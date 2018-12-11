const electron = require('electron');
const { ipcRenderer } = electron;
const csvHelper = require('../../utils/csvHelper');
const gamePayload = require('../../assets/word_gonogo');
const {
  HANDLE_LANGUAGE_CHANGE,
  PUT_GONOGO_DATA,
  PUT_TASK_STATE,
} = require('../../utils/constants');
let face;
let resp = { word: '', response: 'noResponse' };
let setCount = 0;
let setArr = [{ emotion: 'Happy', obj: gamePayload.happySad }, { emotion: 'Happy', obj: gamePayload.happySad }, { emotion: 'Happy', obj: gamePayload.happyNeutral }, { emotion: 'Neutral', obj: gamePayload.neutralhappy }, { emotion: 'Neutral', obj: gamePayload.neutralSad }, { emotion: 'Sad', obj: gamePayload.sadHappy }, { emotion: 'Sad', obj: gamePayload.sadNeutral }];
let payload = { "data": [] }
let timer;
let startRespTime = new Date();
let endRespTime = new Date();
let count = 0;
let quad;

$(document).ready(() => {
  let string = JSON.parse(window.localStorage.getItem('lang'));
  $('.modal-content-text').html(string.strings.game3.instructions[setCount].instruction);
  $('#exit-btn').text(string.strings.commons.modalExitButton);
  $('#end-game-btn').text(string.strings.commons.modalExitButton);
  $('#continue-btn').text(string.strings.commons.continueButton);
  startGame(setArr[setCount].obj);

  $(window).keypress(function (e) {
    if (e.which === 32) {
      endRespTime = new Date();
      let reactionTime = ((endRespTime.getTime() - startRespTime.getTime()) / 1000).toPrecision(2);
      if (resp.response == 'noResponse' && reactionTime < 1.00) {
        $('.quadrant').css({ 'border': '0px solid black'});
        setTimeout(function(){$('.quadrant' + quad).css({ 'border': '1px solid black'})},150)
        if (face.type == setArr[setCount].emotion) {
          resp = { ...resp, response: 'correct', reactionTime: reactionTime }
        } else {
          resp = { ...resp, response: 'incorrect', reactionTime: reactionTime }
        }
      }
    }
  });
});

$('.continue-btn').on('click', () => {
  $('.modal-container').hide();
  $('.quadrantText').html('');
  $('.quadrant').css({ 'border': '0px solid black'});
  startGame(setArr[setCount].obj);
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
        if(reactionTime > 1.00) { reactionTime = 1.00 }
        if (face.response == setArr[setCount].emotion) {
            resp = { ...resp, response: 'incorrect', reactionTime : reactionTime }
        } else {
            resp = { ...resp, response: 'correct', reactionTime : reactionTime}
        }
      }
      payload.data.push(resp);
    }

    $('.quadrantText').html('');
    $('.quadrant').css({ 'border': '0px solid black'});
    resp = { word: '', response: 'noResponse', set: setCount, correctResponse: setArr[setCount].emotion }
    if (setCount == 0){
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
        $('.quadrant').css({ 'border': '0px solid black'});
        clearInterval(timer);
        $('.modal-container').show();
      }
    }

    setTimeout(function () {
      quad = Math.floor(Math.random() * 4) + 1;
      random_idx = Math.random();
      if (random_idx <= 0.75) {
        face = payloadSet[Math.floor(Math.random() * 30)];

      } else {
        face = payloadSet[Math.floor(Math.random() * 30) + 30];
      }
      resp.correctResponse = resp.correctResponse == face.type ? "Press" : "Don't Press";

      resp = {
        ...resp,
        word: face.word,
        quadrant: quad,
        emotion: face.type,
      };

      $('.quadrant' + quad + 'Text').html(face.word);
      $('.quadrant' + quad).css({ 'border': '1px solid black'});
      startRespTime = new Date();
    }, 500);
  }, 1500);
}

$('#export-btn').on('click', async () => {
  let id = window.localStorage.getItem('patientId');
  csvHelper.write(payload.data, id, 'word-go-no-go').then((res) => {
    if (res == "success") {
      $('#export-btn').addClass('btn-success').removeClass('btn-primary').prop('disabled', true).text('Exported');
      $('#close-modal-btn').hide();
    }
  })
});

$('#exit-btn').on('click', () => {
  ipcRenderer.send(PUT_GONOGO_DATA, payload);
  if (payload.data.length > 0) {
    ipcRenderer.send(PUT_TASK_STATE, { data: [1, 2, 3, 4] });
  }
  window.location = '../gameMenu/gameMenu.html';
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
  startGame(setArr[setCount].obj);
})

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
  window.localStorage.setItem('lang', JSON.stringify(string));
  $('.modal-content-text').html(string.strings.game3.instructions[setCount].instruction);
  $('#exit-btn').text(string.strings.commons.modalExitButton);
  $('#end-game-btn').text(string.strings.commons.modalExitButton);
  $('#continue-btn').text(string.strings.commons.continueButton);
});
