const electron = require('electron');
const { ipcRenderer } = electron;
const gamePayloadRaw = require('../../assets/delay_discounting.js');
let gamePayload;
let index = 16;
const csvHelper = require('../../utils/csvHelper');
const remote = require('electron').remote
const app = remote.app;
const {
  HANDLE_LANGUAGE_CHANGE,
  PUT_DATA,
  PUT_TASK_STATE,
  GET_TASK_STATE
} = require('../../utils/constants');

$(document).ready(() => {
  let previousChoice = null;
  let trialCount = 1;
  let oponent = 1;
  let userTotalPts = 0;
  let oponentTotalPts = 0;
  let outputPayload = { "data": [] };
  let string = JSON.parse(window.localStorage.getItem('lang'));

  $('#oponent').html('A');

  $('#close-modal-btn').text(string.strings.commons.modalCloseButton);
  $('.modal-content-text').html(string.strings.commons.modalContent);
  $('#exit-btn').text(string.strings.commons.modalExitButton);
  $('#export-btn').text(string.strings.commons.exportButton);
  $('#end-game-btn').text(string.strings.commons.modalExitButton);
  $('#question').html(string.strings.game6.question);
  $('#share').text(string.strings.game6.buttonShare);
  $('.btn-seperator').html(string.strings.game6.or);
  $('#steal').text(string.strings.game6.buttonSteal);
  $('#subText').html(string.strings.game6.subText);
  $('#your-pts').html(string.strings.game6.you);
  $('#oponent-pts').html(string.strings.game6.oponent);
  gamePayload = (JSON.parse(window.localStorage.getItem('lang')).language == 'en') ? gamePayloadRaw.en : gamePayloadRaw.kn;

  $('#end-game-btn').on('click', () => {
    let string = JSON.parse(window.localStorage.getItem('lang'));
    $('.modal-content-text').html(string.strings.commons.inGameExit);
    $('#exit-btn').text(string.strings.commons.modalExitButton);
    $('#export-btn').text(string.strings.commons.exportButton);
    $('.final-modal-container').show();
    $('#close-modal-btn').show();
  })

  $('#export-btn').on('click', async () => {
    let id = window.localStorage.getItem('patientId');
    let fields = ['choiceNo', 'index', 'indexAdjustment', 'delayChoice', 'response', 'responseTime', 'ed50', 'k'];
    csvHelper.write(outputPayload.data, id, 'delay_discounting', fields).then((res) => {
      if (res == "success") {
        $('#export-btn').addClass('btn-success').removeClass('btn-primary').prop('disabled', true).text(string.strings.commons.exported);
        $('#close-modal-btn').hide();
      }
    })
  });

  $('#exit-btn').on('click', () => {
    ipcRenderer.send(PUT_DATA, 'delay_discounting', outputPayload);
    let taskData = [1, 2, 3, 4, 5, 6];
    if (outputPayload.data.length > 0 && ipcRenderer.sendSync(GET_TASK_STATE).data.length < taskData.length) {
      ipcRenderer.send(PUT_TASK_STATE, { data: taskData });
    }
    window.location = '../gameMenu/gameMenu.html';
  });

  $('#steal').on('click', () => {
    playTurn('steal');
  });

  $('#share').on('click', () => {
    playTurn('share');
  });

  $('#close-modal-btn').on('click', () => {
    $('.final-modal-container').hide();
    $('#close-modal-btn').hide();
  })

  $('#okay-btn').on('click', () => {
    $('.result-modal-container').hide();
  })

  const playTurn = (userChoice) => {
    let oponentChoice;
    let oponentpts;
    let userpts;

    ShowSpinner();

    switch (oponent) {
      case 1: oponentChoice = aggressive(previousChoice)
        break;
      case 2: oponentChoice = titForTwo();
        break;
      case 3: oponentChoice = alwaysShare();
    }

    console.log('u: ' + userChoice + ' o: ' + oponentChoice);

    if (userChoice == 'share' && oponentChoice == 'share') {
      oponentpts = userpts = 3;
    } else if (userChoice == 'share' && oponentChoice == 'steal') {
      oponentpts = 5;
      userpts = 0;
    } else if (userChoice == 'steal' && oponentChoice == 'share') {
      oponentpts = 0;
      userpts = 5;
    } else {
      oponentpts = userpts = 1;
    }

    userTotalPts += userpts;
    oponentTotalPts += oponentpts;

    let payload = {
      oponentStrategy: oponent,
      trial: trialCount,
      patientResponse: userChoice,
      oponentResponse: oponentChoice,
      patientGainedPts: userpts,
      oponentGainedPts: userpts,
      patientTotalPts: userTotalPts,
      oponentTotalPts: oponentTotalPts,
    }

    outputPayload.data.push(payload);

    setTimeout(() => {
      hideSpinner();
      showTurnResult(userpts, oponentpts);
      $('.your-score').html(userTotalPts);
      $('.oponent-score').html(oponentTotalPts);
      if (trialCount++ > 30) {
        oponent++;
        if (oponent == 2) {
          $('#oponent').html('B');
        } else if (oponent == 3) {
          $('#oponent').html('C');
        } else {
          $('.close-modal-btn').hide();
          $('.final-modal-container').show();
        }
      }
      previousChoice = userChoice;
    }, 5000)
  }

  const showTurnResult = (upts, opts) => {
    $('.result-modal-content-text').html(string.strings.game6.youEarned + ' ' + upts + ' ' + string.strings.game6.andYourOponent + ' ' + opts);
    $('.spinner').hide();
    $('.result-modal-btns').show();
    $('.result-modal-container').show();
  }

  const ShowSpinner = () => {
    $('.result-modal-content-text').html(string.strings.game6.wait)
    $('.spinner').show();
    $('.result-modal-btns').hide();
    $('.result-modal-container').show();
  }

  const hideSpinner = () => {
    $('.result-modal-container').hide();
    $('.spinner').hide();
    $('.result-modal-btns').show();
  }

  const aggressive = (previousChoice) => {
    if (trialCount == 1) {
      return 'steal'
    } else {
      return previousChoice;
    }
  }

  const alwaysShare = () => {
    return 'share';
  }

});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
  window.localStorage.setItem('lang', JSON.stringify(string));
  $('#close-modal-btn').text(string.strings.commons.modalCloseButton);
  $('.modal-content-text').html(string.strings.commons.modalContent);
  $('#exit-btn').text(string.strings.commons.modalExitButton);
  $('#export-btn').text(string.strings.commons.exportButton);
  $('#end-game-btn').text(string.strings.commons.modalExitButton);
  $('#question').html(string.strings.game6.question);
  $('#share').text(string.strings.game6.buttonShare);
  $('.btn-seperator').html(string.strings.game6.or);
  $('#steal').text(string.strings.game6.buttonSteal);
  $('#subText').html(string.strings.game6.subText);
  $('#your-pts').html(string.strings.game6.you);
  $('#oponent-pts').html(string.strings.game6.oponent);
  gamePayload = (JSON.parse(window.localStorage.getItem('lang')).language == 'en') ? gamePayloadRaw.en : gamePayloadRaw.kn;
  $('#later').text('₹1000 ' + gamePayload[index - 1].string);
});
