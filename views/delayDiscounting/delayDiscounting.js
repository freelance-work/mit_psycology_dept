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
  let trialCount = 1;
  let outputPayload = { "data": [] };
  let currentAdjustment = index/2;
  let startRespTime = new Date();
  let string = JSON.parse(window.localStorage.getItem('lang'));
  
  $('#close-modal-btn').text(string.strings.commons.modalCloseButton);
  $('.modal-content-text').html(string.strings.commons.modalContent);
  $('#exit-btn').text(string.strings.commons.modalExitButton);
  $('#export-btn').text(string.strings.commons.exportButton);
  $('#end-game-btn').text(string.strings.commons.modalExitButton);
  $('#question').html(string.strings.game5.question);
  $('#now').text(string.strings.game5.buttonNow);
  $('.btn-seperator').html(string.strings.game5.or);
  $('#later').text(string.strings.game5.buttonLater);
  $('#subText').html(string.strings.game5.subText);
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
    if (outputPayload.data.length > 0) {
      ipcRenderer.send(PUT_TASK_STATE, 5);
    }
    window.location = '../gameMenu/gameMenu.html';
  });

  $('#now').on('click', () => {
    endRespTime = new Date();
    let reactionTime = ((endRespTime.getTime() - startRespTime.getTime()) / 1000).toPrecision(2);
    let delayChoice = gamePayloadRaw.en[index-1].value;

    let ed50 = 'Not determined';
    let k = 'Not determined';

    if(trialCount == 5) {
      ed50 = gamePayload[index-1].ed50.immediate;
      k = gamePayload[index-1].k.immediate;
    }

    putDataInPayload(trialCount, index, currentAdjustment, delayChoice, 'now', reactionTime, ed50, k);

    trialCount++;    
    if(trialCount == 6) {
      $('.final-modal-container').show();
      $('#close-modal-btn').hide();
      return;
    }
    index = index - currentAdjustment;
    $('#later').text('₹1000 '+ gamePayload[index-1].string);
    startRespTime = new Date();
    currentAdjustment = currentAdjustment/2;
  })

  $('#later').on('click', () => {
    endRespTime = new Date();
    let reactionTime = ((endRespTime.getTime() - startRespTime.getTime()) / 1000).toPrecision(2);
    let delayChoice = gamePayloadRaw.en[index-1].value;

    let ed50 = 'Not determined';
    let k = 'Not determined';

    if(trialCount == 5) {
      ed50 = gamePayload[index-1].ed50.delayed;
      k = gamePayload[index-1].k.delayed;
    }

    putDataInPayload(trialCount, index, currentAdjustment, delayChoice, 'delayed', reactionTime, ed50, k);

    trialCount++;
    if(trialCount == 6) {
      $('.final-modal-container').show();
      $('#close-modal-btn').hide();
      return;
    }
    index = index + currentAdjustment;
    $('#later').text('₹1000 '+ gamePayload[index-1].string);
    startRespTime = new Date();
    currentAdjustment = currentAdjustment/2;
  })

  const putDataInPayload = (trial, indexVal, adjustment, delayChoice, response, responseTime, ed50, k) => {
    let res= {
      choiceNo: trial,
      index: indexVal,
      indexAdjustment: adjustment,
      delayChoice: delayChoice,
      response: response,
      responseTime: responseTime,
      ed50: ed50,
      k: k
    };
    outputPayload.data.push(res);
  }

});

$(window).on('resize', () => {
  $('.game-item').css({ 'height': $('.game-item').width() + 'px' });
});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
  window.localStorage.setItem('lang', JSON.stringify(string));
  $('#close-modal-btn').text(string.strings.commons.modalCloseButton);
  $('.modal-content-text').html(string.strings.commons.modalContent);
  $('#exit-btn').text(string.strings.commons.modalExitButton);
  $('#export-btn').text(string.strings.commons.exportButton);
  $('#end-game-btn').text(string.strings.commons.modalExitButton);
  $('#question').text(string.strings.game5.question);
  $('#btn-now').html(string.strings.game5.buttonNow);
  $('.btn-seperator').html(string.strings.game5.or);
  $('#subText').html(string.strings.game5.subText);
  $('#now').text(string.strings.game5.buttonNow);
  gamePayload = (JSON.parse(window.localStorage.getItem('lang')).language == 'en') ? gamePayloadRaw.en : gamePayloadRaw.kn;
  $('#later').text('₹1000 '+ gamePayload[index-1].string);
});
  