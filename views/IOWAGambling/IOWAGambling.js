const electron = require('electron');
const { ipcRenderer } = electron;
const csvHelper = require('../../utils/csvHelper');
const remote = require('electron').remote
const app = remote.app;
const {
  HANDLE_LANGUAGE_CHANGE,
  PUT_DATA,
  PUT_TASK_STATE
} = require('../../utils/constants');

$(document).ready(() => {
  
  let trialCount = 1;
  let bal = 2000;
  let outputPayload = { "data": [] };
  let string = JSON.parse(window.localStorage.getItem('lang'));

  $('#card1').on('click', () => {
    processCardAB('A');
  })

  $('#card2').on('click', () => {
    processCardAB('B');
  })

  $('#card3').on('click', () => {
    processCardDE('C');
  })

  $('#card4').on('click', () => {
    processCardDE('D');
  })

  $('#end-game-btn').on('click', () => {
    let string = JSON.parse(window.localStorage.getItem('lang'));
    $('.modal-content-text').html(string.strings.commons.inGameExit);
    $('#exit-btn').text(string.strings.commons.modalExitButton);
    $('#export-btn').text(string.strings.commons.exportButton);
    $('#close-modal-btn').show();
    $('.final-modal-container').show();
  })

  $('#close-modal-btn').on('click', () => {
    $('.final-modal-container').hide();
    $('#close-modal-btn').hide();
  })

  $('#export-btn').on('click', async () => {
    let id = window.localStorage.getItem('patientId');
    let fields = ['Trial', 'Card', 'Won', 'Lost', 'Total'];
    csvHelper.write(outputPayload.data, id, 'iowa_gambling', fields).then((res) => {
      if (res == "success") {
        $('#export-btn').addClass('btn-success').removeClass('btn-primary').prop('disabled', true).text(string.strings.commons.exported);
        $('#close-modal-btn').hide();
      }
    })
  });

  $('#exit-btn').on('click', () => {
    ipcRenderer.send(PUT_DATA, 'iowa_gambling', outputPayload);
    if (outputPayload.data.length > 0) {
      ipcRenderer.send(PUT_TASK_STATE, { data: [1, 2, 3, 4, 5] });
    }
    window.location = '../gameMenu/gameMenu.html';
  });

  const showFinalModal = () => {
    $('.final-modal-container').show();
  }

  const processCardAB = (card) => {
    lockCards();
    let lost = 0;
    let won = 100;
    let random_idx = Math.random();
    if (random_idx <= 0.50) {
      //show won face with amount 100
    } else {
        //show won face with amount 100 and lost amount 250
        lost = 250;
    }
    putDataInPayload(card, won, lost);
    trialCount++;
    setTimeout( () => {
      unlockCards();
    }, 1000);
  }

  const processCardDE = (card) => {
    lockCards();
    let lost = 0;
    let won = 50;
    let random_idx = Math.random();
    if (random_idx <= 0.50) {
      //show won face with amount 50
    } else {
        //show won face with amount 50 and lost amount 50
        lost = 50;
    }
    putDataInPayload(card, won, lost);
    trialCount++;
    setTimeout( () => {
      unlockCards();
    }, 1000);
  }

  const lockCards = () => {
    $('.iowa-card').css({ 'pointer-events': 'none'})
  }

  const unlockCards = () => {
    $('.iowa-card').css({ 'pointer-events': 'auto'}) 
  }

  const putDataInPayload = (card, won, lost) => {
    bal = (bal+won)-lost;
    let res = {
      Trial: trialCount,
      Card: card,
      Won: won,
      Lost: lost,
      Total: bal
    }

    outputPayload.data.push(res);
  }

});

$(window).on('resize', () => {
  $('.game-item').css({ 'height': $('.game-item').width() + 'px' });
});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
  window.localStorage.setItem('lang', JSON.stringify(string));
  
});