const electron = require('electron');
const { ipcRenderer } = electron;
const csvHelper = require('../../utils/csvHelper');
const remote = require('electron').remote;
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
  let opponent = 1;
  let userTotalPts = 0;
  let opponentTotalPts = 0;
  let outputPayload = { "data": [] };
  let startRespTime = new Date();
  let string = JSON.parse(window.localStorage.getItem('lang'));

  $('#opponent').html('A');

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
  $('#opponent-pts').html(string.strings.game6.opponent);

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
    let fields = ['trial', 'opponentStrategy', 'patientResponse', 'opponentResponse', 'patientGainedPts', 'opponentGainedPts', 'patientTotalPts', 'opponentTotalPts', 'reactionTime'];
    csvHelper.write(outputPayload.data, id, 'prisoners_dilemma', fields).then((res) => {
      if (res == "success") {
        $('#export-btn').addClass('btn-success').removeClass('btn-primary').prop('disabled', true).text(string.strings.commons.exported);
        $('#close-modal-btn').hide();
      }
    })
  });

  $('#exit-btn').on('click', () => {
    ipcRenderer.send(PUT_DATA, 'prisoners_dilemma', outputPayload);
    if (outputPayload.data.length > 0) {
      ipcRenderer.send(PUT_TASK_STATE, 6);
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
    let string = JSON.parse(window.localStorage.getItem('lang'));
    startRespTime = new Date();
    $('.result-modal-container').hide();
    if(trialCount == 21){
      ShowSpinner(string.strings.game6.doneOpponent1);
      setTimeout(() => {
        hideSpinner();
        $('#opponent').html('B');
        $('#opponent-img').attr("src","../../assets/opponent2.png");
        userTotalPts = 0;
        opponentTotalPts  = 0;
        previousChoice = 'null'
        $('.your-score').html(': '+0);
        $('.opponent-score').html(': '+0);
        startRespTime = new Date();
      }, 5000)
    } else if (trialCount == 41){
      ShowSpinner(string.strings.game6.doneOpponent2);
      setTimeout(() => {
        hideSpinner();
        $('#opponent').html('C');
        $('#opponent-img').attr("src","../../assets/opponent3.png");
        userTotalPts = 0;
        opponentTotalPts  = 0;
        $('.your-score').html(0);
        $('.opponent-score').html(0);
        startRespTime = new Date();
      }, 5000) 
    } else if (trialCount == 61){
      $('#close-modal-btn').hide();
      $('.final-modal-container').show();
      startRespTime = new Date();
    }
  })

  const playTurn = (userChoice) => {
    let string = JSON.parse(window.localStorage.getItem('lang'));
    let endRespTime = new Date();
    let reactionTime = ((endRespTime.getTime() - startRespTime.getTime()) / 1000).toPrecision(2);
    let opponentChoice;
    let opponentpts;
    let userpts;
    ShowSpinner(string.strings.game6.wait);
    

    switch (opponent) {
      case 1: opponentChoice = aggressive(previousChoice);
        break;
      case 2: opponentChoice = titForTwo(userChoice);
        break;
      case 3: opponentChoice = alwaysShare();
    }

    if (userChoice == 'share' && opponentChoice == 'share') {
      opponentpts = userpts = 3;
    } else if (userChoice == 'share' && opponentChoice == 'steal') {
      opponentpts = 5;
      userpts = 0;
    } else if (userChoice == 'steal' && opponentChoice == 'share') {
      opponentpts = 0;
      userpts = 5;
    } else {
      opponentpts = userpts = 1;
    }

    userTotalPts += userpts;
    opponentTotalPts += opponentpts;

    let payload = {
      opponentStrategy: opponent,
      trial: trialCount,
      patientResponse: userChoice,
      opponentResponse: opponentChoice,
      patientGainedPts: userpts,
      opponentGainedPts: userpts,
      patientTotalPts: userTotalPts,
      opponentTotalPts: opponentTotalPts,
      reactionTime : reactionTime
    }

    outputPayload.data.push(payload);

    setTimeout(() => {
      hideSpinner();
      showTurnResult(userpts, opponentpts, opponentChoice);
      $('.your-score').html(': '+userTotalPts);
      $('.opponent-score').html(': '+opponentTotalPts);
      trialCount++;
      if (trialCount == 21 || trialCount == 41 || trialCount == 61) {
        opponent++;
      }
      previousChoice = userChoice;
    }, 5000)
  }

  const showTurnResult = (upts, opts, opponentChoice) => {
    let optchoice = null;
    let string = JSON.parse(window.localStorage.getItem('lang'));
    (opponentChoice == 'steal') ? optchoice = string.strings.game6.steal : optchoice = string.strings.game6.share;
    $('.result-modal-content-text').html( string.strings.game6.yourOponentChoose + optchoice + "<br>" + string.strings.game6.youEarned + ' ' + upts + ' ' + string.strings.game6.andYourOpponent + ' ' + opts);
    $('.spinner').hide();
    $('.result-modal-btns').show();
    $('.result-modal-container').show();
  }

  const ShowSpinner = (modalText) => {
    $('.result-modal-content-text').html(modalText);
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

  const titForTwo = (userChoice) => {
    if(previousChoice == 'steal' && userChoice == 'steal'){
      return 'steal';
    } else {
      return 'share';
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
  $('#opponent-pts').html(string.strings.game6.opponent);
  alert('Some strings may fail to translate now, They will be translated in the next trial');
});
