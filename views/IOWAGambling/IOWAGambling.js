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
  let bal = 2000; //use this variable for cash-left class in your html, set it in putDataInPayload function
  let outputPayload = { "data": [] };
  let string = JSON.parse(window.localStorage.getItem('lang'));

  $('#close-modal-btn').text(string.strings.commons.modalCloseButton);
  $('.modal-content-text').text(string.strings.commons.modalContent);
  $('#exit-btn').text(string.strings.commons.modalExitButton);
  $('#export-btn').text(string.strings.commons.exportButton);
  $('#end-game-btn').text(string.strings.commons.modalExitButton);
  $('#cash-left-text').text(string.strings.game4.cashLeft);
  
  $('.cash').html(bal);
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

  const processCardAB = (card) => {
    lockCards();
    let lost = 0;
    let won = 100;
    let random_idx = Math.random();
    if (random_idx <= 0.50) {
      //show won face with amount 100
      dispayEmoji(true, 100);
    } else {
        //show won face with amount 100 and lost face with amount 250
        dispayEmoji(true, 100);
        dispayEmoji(false, 250);
        lost = 250;
    }
    putDataInPayload(card, won, lost);
    trialCount++;
    setTimeout( () => {
      $('.emoji-container').hide();
      unlockCards();
    }, 1000);
  }

  const processCardDE = (card) => {
    lockCards();
    let lost = 0;
    let won = 50;
    let random_idx = Math.random();
    if (random_idx <= 0.50) {
      dispayEmoji(true, 50);
    } else {
        dispayEmoji(true, 50);
        dispayEmoji(false, 50);
        lost = 50;
    }
    putDataInPayload(card, won, lost);
    trialCount++;
    setTimeout( () => {
      $('.emoji-container').hide();
      unlockCards();
    }, 1000);
  }

  const dispayEmoji = (isProfit, amount ) => {
    if(isProfit){
      $('.emoji-container1').css('background-image', 'url(../../assets/profit.png)');
      $('.emoji-container1').find('.amount-gain-loss').html(amount);
      $('.emoji-container1').show();
    } else {
      $('.emoji-container2').css('background-image', 'url(../../assets/loss.png)');
      $('.emoji-container2').find('.amount-gain-loss').html(amount);
      $('.emoji-container2').show();
    }
  }


  const lockCards = () => {
    $(".iowa-card").prop('disabled',true);
    $('.iowa-card').css({ 'opacity': '0.3'}) 
    $('.iowa-card').css({ 'pointer-events': 'none'})
  }

  const unlockCards = () => {
    $(".iowa-card").prop('disabled',false);
    $('.iowa-card').css({ 'opacity': '1'});
    $('.iowa-card').css({ 'pointer-events': 'auto'}) 
    if(trialCount == 100) {
      $('.final-modal-container').show();
    }
  }

  const putDataInPayload = (card, won, lost) => {
    bal = (bal+won)-lost;
    $('.cash').html(bal);
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
  $('#close-modal-btn').text(string.strings.commons.modalCloseButton);
  $('.modal-content-text').text(string.strings.commons.modalContent);
  $('#exit-btn').text(string.strings.commons.modalExitButton);
  $('#export-btn').text(string.strings.commons.exportButton);
  $('#end-game-btn').text(string.strings.commons.modalExitButton);
  $('#cash-left-text').text(string.strings.game4.cashLeft);
});