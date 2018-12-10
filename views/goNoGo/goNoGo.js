const electron = require('electron');
const { ipcRenderer } = electron;
const csvHelper = require('../../utils/csvHelper');
const gamePayload = require('../../assets/gonogo');
const {
    HANDLE_LANGUAGE_CHANGE,
    PUT_GONOGO_DATA,
    PUT_TASK_STATE,
} = require('../../utils/constants');
let face;
let resp = { faceID: '', response: 'noResponse' };
let setCount = 0;
let setArr = [{ emotion: 'JOY', obj: gamePayload.joyAnger }, { emotion: 'JOY', obj: gamePayload.joyNeutral }, { emotion: 'NEUTRAL', obj: gamePayload.neutralJoy }, { emotion: 'NEUTRAL', obj: gamePayload.neutralAngry }, { emotion: 'ANGER', obj: gamePayload.angerJoy }, { emotion: 'ANGER', obj: gamePayload.angerNeutral }];
let payload = { "data": [] }
let timer;
let startRespTime = new Date();
let endRespTime = new Date();
let count = 0;

$(document).ready(() => {
  let string = JSON.parse(window.localStorage.getItem('lang'));
  $('.modal-content-text').html(string.strings.game2.instructions[setCount].instruction);
  $('#exit-btn').text(string.strings.commons.modalExitButton);
  $('#end-game-btn').text(string.strings.commons.modalExitButton);
  $('#continue-btn').text(string.strings.commons.continueButton);
  
  startGame(setArr[setCount].obj);

  $(window).keypress(function (e) {
    if (e.which === 32) {
      endRespTime = new Date();
      let reactionTime = ((endRespTime.getTime() - startRespTime.getTime()) / 1000).toPrecision(2);
      if (resp.response == 'noResponse' && reactionTime < 1.00) {
        if (face.response == setArr[setCount].emotion) {
            resp = { ...resp, response: 'correct', reactionTime : reactionTime }
        } else {
            resp = { ...resp, response: 'incorrect', reactionTime : reactionTime}
        }
      }
    }
  });
});

$('.continue-btn').on('click', () => {
  $('.modal-container').hide();
  $('.quadrant1, .quadrant2, .quadrant3, .quadrant4').css({ 'background-image': 'url()' });
  startGame(setArr[setCount].obj);
})

startGame = (payloadSet) => {
  let string = JSON.parse(window.localStorage.getItem('lang'));
  let quad;
  let random_idx;

  timer = setInterval(function () {
    if (count != 0) {
      if(resp.response == 'noResponse'){
        endRespTime = new Date();
        let reactionTime = ((endRespTime.getTime() - startRespTime.getTime()) / 1000).toPrecision(2);
        if (face.response == setArr[setCount].emotion) {
            resp = { ...resp, response: 'incorrect', reactionTime : reactionTime }
        } else {
            resp = { ...resp, response: 'correct', reactionTime : reactionTime}
        }
      }
      payload.data.push(resp);
    }

    $('.quadrant1, .quadrant2, .quadrant3, .quadrant4').css({ 'background-image': 'url()' });
    resp = { faceID: '', response: 'noResponse', set: setCount + 1, correctResponse : setArr[setCount].emotion }

    if (++count > 5) {
      count = 0;
      setCount++;
      if (setCount > 5) {
          clearInterval(timer);
          $('.final-modal-content-text').html(string.strings.commons.modalContent);
          $('#exit-btn').text(string.strings.commons.modalExitButton);
          $('#export-btn').text(string.strings.commons.exportButton);
          $('.final-modal-container').show();
      }
      $('.modal-content-text').html(string.strings.game2.instructions[setCount].instruction);
      $('.quadrant1, .quadrant2, .quadrant3, .quadrant4').css({ 'background-image': 'url()' });
      clearInterval(timer);
      $('.modal-container').show();
    }
    
    setTimeout(function () {
      quad = Math.floor(Math.random() * 4) + 1;
      random_idx = Math.random();
      if (random_idx <= 0.75) {
          face = payloadSet[Math.floor(Math.random() * 30)];
      } else {
          face = payloadSet[Math.floor(Math.random() * 30) + 30];
      }

      resp.correctResponse = resp.correctResponse == face.response ? "Press" : "Don't Press";

      resp = {
          ...resp,
          faceID: face.faceID,
          quadrant: quad,
          emotion: face.response,
      };
      $('.quadrant' + quad).css({ 'background-image': 'url(../../assets/faces/' + face.faceID + '.jpg)' });
      startRespTime = new Date();
    }, 500);
  }, 1500);
}

$('#export-btn').on('click', async () => {
  let id = window.localStorage.getItem('patientId');
  let fields = ['set', 'faceID', 'quadrant', 'response', 'correctResponse', 'emotion', 'reactionTime'];
  csvHelper.write(payload.data, id, 'go-no-go', fields).then((res) => {
    if (res == "success") {
      $('#export-btn').addClass('btn-success').removeClass('btn-primary').prop('disabled', true).text(string.strings.commons.exported);
      $('#close-modal-btn').hide();
    }
  })
});

$('#exit-btn').on('click', () => {
  ipcRenderer.send(PUT_GONOGO_DATA, payload);
  if(payload.data.length > 0) {
    ipcRenderer.send(PUT_TASK_STATE, { data: [1, 2, 3] });
  }  
  window.location = '../gameMenu/gameMenu.html';
});

$('#end-game-btn').on('click', () => {
  clearInterval(timer);
  let string = JSON.parse(window.localStorage.getItem('lang'));
  $('.final-modal-content-text').html(string.strings.commons.inGameExit);
  $('#exit-btn').text(string.strings.commons.modalExitButton);
  $('#export-btn').text(string.strings.commons.exportButton);
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
  $('.modal-content-text').html(string.strings.game2.instructions[setCount].instruction);
  $('#end-game-btn').text(string.strings.commons.modalExitButton);
  $('#exit-btn').text(string.strings.commons.modalExitButton);
  $('#start-btn').text(string.strings.commons.startButtonText);
  $('#back-btn').text(string.strings.commons.backButton);
  $('#continue-btn').text(string.strings.commons.continueButton);
  $('#export-btn').text(string.strings.commons.exportButton);
  $('.final-modal-content-text').html(string.strings.commons.modalContent);
});
