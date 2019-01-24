const electron = require('electron');
const { ipcRenderer } = electron;
const csvHelper = require('../../utils/csvHelper');
const gamePayloadRaw = require('../../assets/word_gonogo');
let gamePayload = (JSON.parse(window.localStorage.getItem('lang')).language == 'en') ? gamePayloadRaw.en : gamePayloadRaw.kn;
const {
  HANDLE_LANGUAGE_CHANGE,
  PUT_DATA,
  PUT_TASK_STATE,
  GET_TASK_STATE
} = require('../../utils/constants');
let face;
let resp = { word: '', response: 'noResponse' };
let setCount = 0;
let setArr;
let payload = { "data": [] }
let timer;
let startRespTime = new Date();
let endRespTime = new Date();
let count = 0;
let quad;

$(document).ready(() => {
  let string = JSON.parse(window.localStorage.getItem('lang'));
  $('.modal-content-text').html(string.strings.game3.instructions[setCount].instruction);
  $('#exit-btn, #exit-btn-info, #end-game-btn , #end-game-btn-info').text(string.strings.commons.modalExitButton);
  $('#start-btn').text(string.strings.commons.startButtonText);
  $('#back-btn').text(string.strings.commons.backButton);
  $('#continue-btn').text(string.strings.commons.continueButton);
  $('#export-btn, #export-btn-info').text(string.strings.commons.exportButton);
  $('#close-modal-btn, #close-modal-btn-info').text(string.strings.commons.modalCloseButton);
  $('.final-modal-content-text').html(string.strings.commons.modalContent);
  gamePayload = (JSON.parse(window.localStorage.getItem('lang')).language == 'en') ? gamePayloadRaw.en : gamePayloadRaw.kn;
  setArr = [{ emotion: 'Happy', obj: gamePayload.happySad, engObj: gamePayloadRaw.en.happySad }, { emotion: 'Happy', obj: gamePayload.happySad, engObj: gamePayloadRaw.en.happySad }, { emotion: 'Happy', obj: gamePayload.happyNeutral, engObj: gamePayloadRaw.en.happyNeutral }, { emotion: 'Neutral', obj: gamePayload.neutralhappy, engObj: gamePayloadRaw.en.neutralhappy }, { emotion: 'Neutral', obj: gamePayload.neutralSad, engObj: gamePayloadRaw.en.neutralSad }, { emotion: 'Sad', obj: gamePayload.sadHappy, engObj: gamePayloadRaw.en.sadHappy }, { emotion: 'Sad', obj: gamePayload.sadNeutral, engObj: gamePayloadRaw.en.sadNeutral }];

  startGame(setArr[setCount]);

  $(window).keypress(function (e) {
    if (e.which === 32) {
      endRespTime = new Date();
      let reactionTime = ((endRespTime.getTime() - startRespTime.getTime()) / 1000).toPrecision(2);
      if (resp.response == 'noResponse' && reactionTime < 1.00) {
        $('.quadrant').css({ 'border': '0px solid black' });
        $('.res-img').css({ 'background-image': 'url()' });
        if (face.type == setArr[setCount].emotion) {
          if (setCount == 0) {
            $('.quadrant' + quad).find('.res-img').css({ 'background-image': 'url(../../assets/Green_tick.png)' });
          }
          setTimeout(function () { $('.quadrant' + quad).css({ 'border': '2px solid black' }) }, 150);
          resp = { ...resp, response: 'correct', reactionTime: reactionTime }
        } else {
          if (setCount == 0) {
            $('.quadrant' + quad).find('.res-img').css({ 'background-image': 'url(../../assets/Red_X.png)' });
          }
          setTimeout(function () { $('.quadrant' + quad).css({ 'border': '2px solid black' }) }, 150);
          resp = { ...resp, response: 'incorrect', reactionTime: reactionTime }
        }
      }
    }
  });
});

$('.continue-btn').on('click', () => {
  $('.modal-container').hide();
  $('.quadrantText').html('');
  $('.quadrant').css({ 'border': '0px solid black' });
  $('.res-img').css({ 'background-image': 'url()' });
  startGame(setArr[setCount]);
})

startGame = (payloadSet) => {
  let string = JSON.parse(window.localStorage.getItem('lang'));
  let random_idx;
  let trial;

  timer = setInterval(function () {
    if (count != 0) {
      if (resp.response == 'noResponse') {
        endRespTime = new Date();
        let reactionTime = ((endRespTime.getTime() - startRespTime.getTime()) / 1000).toPrecision(2);
        if (reactionTime > 1.00) { reactionTime = 1.00 }
        if (face.response == setArr[setCount].emotion) {
          resp = { ...resp, response: 'incorrect', reactionTime: reactionTime }
        } else {
          resp = { ...resp, response: 'correct', reactionTime: reactionTime }
        }
      }
      payload.data.push(resp);
    }

    $('.quadrantText').html('');
    $('.quadrant').css({ 'border': '0px solid black' });
    $('.res-img').css({ 'background-image': 'url()' });
    resp = { word: '', response: 'noResponse', set: setCount, correctResponse: setArr[setCount].emotion }
    if (setCount == 0) {
      trial = 10;
    } else {
      trial = 30;
    }
    if (++count > trial) {
      count = 0;
      setCount++;
      if (setCount > 6) {
        clearInterval(timer);
        $('.final-modal-content-text').html(string.strings.commons.modalContent);
        $('#exit-btn').text(string.strings.commons.modalExitButton);
        $('#export-btn').text(string.strings.commons.exportButton);
        $('.final-modal-container').show();
      } else {
        $('.modal-content-text').html(string.strings.game3.instructions[setCount].instruction);
        $('.quadrantText').html('');
        $('.quadrant').css({ 'border': '0px solid black' });
        $('.res-img').css({ 'background-image': 'url()' });
        clearInterval(timer);
        $('.modal-container').show();
      }
    }

    setTimeout(function () {
      quad = Math.floor(Math.random() * 4) + 1;
      random_idx = Math.random();
      let rIdx;
      let eng_word;
      if (random_idx <= 0.75) {
        rIdx = Math.floor(Math.random() * 30)
        face = payloadSet.obj[rIdx];
        eng_word = payloadSet.engObj[rIdx];
      } else {
        let rIdx = Math.floor(Math.random() * 30) + 30
        face = payloadSet.obj[rIdx];
        eng_word = payloadSet.engObj[rIdx];
      }
      resp.correctResponse = resp.correctResponse == face.type ? "Press" : "Don't Press";

      resp = {
        ...resp,
        word: eng_word.word,
        quadrant: quad,
        emotion: face.type,
      };

      $('.quadrant' + quad + 'Text').html(face.word);
      $('.quadrant' + quad).css({ 'border': '2px solid black' });
      startRespTime = new Date();
    }, 500);
  }, 1500);
}

$('#export-btn').on('click', async () => {
  let id = window.localStorage.getItem('patientId');
  let fields = ['set', 'word', 'quadrant', 'response', 'correctResponse', 'emotion', 'reactionTime'];
  let string = JSON.parse(window.localStorage.getItem('lang'));
  csvHelper.write(payload.data, id, 'word-go-no-go', fields).then((res) => {
    if (res == "success") {
      $('#export-btn').addClass('btn-success').removeClass('btn-primary').prop('disabled', true).text(string.strings.commons.exported);
      $('#close-modal-btn').hide();
    }
  })
});

$('#exit-btn').on('click', () => {
  exitToMenu();
});

$('#end-game-btn').on('click', () => {
  clearInterval(timer);
  $('#close-modal-btn').show();
  $('.final-modal-container').show();
})

$('#close-modal-btn').on('click', () => {
  startRespTime = new Date()
  $('.final-modal-container').hide();
  $('#close-modal-btn').hide();
  startGame(setArr[setCount]);
})

$('#end-game-btn-info').on('click', () => {
  let string = JSON.parse(window.localStorage.getItem('lang'));
  $('.final-modal-content-text').html(string.strings.commons.inGameExit);
  $('#exit-btn').text(string.strings.commons.modalExitButton);
  $('#export-btn').text(string.strings.commons.exportButton);
  $('#close-modal-btn-info').show();
  $('.final-modal-container-info').show();
})

$('#close-modal-btn-info').on('click', () => {
  $('.final-modal-container-info').hide();
  $('#close-modal-btn-info').hide();
})

$('#exit-btn-info').on('click', () => {
  exitToMenu();
})

const exitToMenu = () => {
  ipcRenderer.send(PUT_DATA, 'gonogo', payload);
  if (payload.data.length > 0) {
    ipcRenderer.send(PUT_TASK_STATE, 3);
  }
  window.location = '../gameMenu/gameMenu.html';
}

$('#export-btn-info').on('click', async () => {
  let id = window.localStorage.getItem('patientId');
  let fields = ['set', 'word', 'quadrant', 'response', 'correctResponse', 'emotion', 'reactionTime'];
  let string = JSON.parse(window.localStorage.getItem('lang'));
  csvHelper.write(payload.data, id, 'word-go-no-go', fields).then((res) => {
    if (res == "success") {
      $('#export-btn-info').addClass('btn-success').removeClass('btn-primary').prop('disabled', true).text(string.strings.commons.exported);
      $('#close-modal-btn-info').hide();
    }
  })
});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
  window.localStorage.setItem('lang', JSON.stringify(string));
  $('.modal-content-text').html(string.strings.game3.instructions[setCount].instruction);
  $('#exit-btn, #exit-btn-info, #end-game-btn , #end-game-btn-info').text(string.strings.commons.modalExitButton);
  $('#start-btn').text(string.strings.commons.startButtonText);
  $('#back-btn').text(string.strings.commons.backButton);
  $('#continue-btn').text(string.strings.commons.continueButton);
  $('#export-btn, #export-btn-info').text(string.strings.commons.exportButton);
  $('#close-modal-btn, #close-modal-btn-info').text(string.strings.commons.modalCloseButton);
  $('.final-modal-content-text').html(string.strings.commons.modalContent);
  gamePayload = (JSON.parse(window.localStorage.getItem('lang')).language == 'en') ? gamePayloadRaw.en : gamePayloadRaw.kn;
  setArr = [{ emotion: 'Happy', obj: gamePayload.happySad }, { emotion: 'Happy', obj: gamePayload.happySad }, { emotion: 'Happy', obj: gamePayload.happyNeutral }, { emotion: 'Neutral', obj: gamePayload.neutralhappy }, { emotion: 'Neutral', obj: gamePayload.neutralSad }, { emotion: 'Sad', obj: gamePayload.sadHappy }, { emotion: 'Sad', obj: gamePayload.sadNeutral }];
});
