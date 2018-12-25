const electron = require('electron');
const payload = require('../../assets/emotion_recognition');
const { ipcRenderer } = electron;
const dataSet = { 'data': payload.data.sort(() => Math.random() - 0.5) };
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

  let idx = 0;
  let outputPayload = { "data": [] };
  let startTime = new Date();
  let endTime = new Date();
  let string = JSON.parse(window.localStorage.getItem('lang'));

  try {
    $('#JOY').text(string.strings.game1.joy);
    $('#SADNESS').text(string.strings.game1.sadness);
    $('#ANGER').text(string.strings.game1.anger);
    $('#NEUTRAL').text(string.strings.game1.neutral);
    $('#DISGUST').text(string.strings.game1.disgust);
    $('#FEAR').text(string.strings.game1.fear);
    $('#SURPRISE').text(string.strings.game1.surprise);
    $('#close-modal-btn').text(string.strings.commons.modalCloseButton);
    $('.modal-content-text').text(string.strings.commons.modalContent);
    $('#exit-btn').text(string.strings.commons.modalExitButton);
    $('#export-btn').text(string.strings.commons.exportButton);
    $('#end-game-btn').text(string.strings.commons.modalExitButton);


  } catch (err) { console.log(err) };

  $('.image-box').css('background-image', 'url(../../assets/faces/' + dataSet.data[idx].faceID + '.jpg)');

  $('.emotion-button').click(function () {
    $('.image-box').css('background-image', 'none');
    $('.emotion-button').prop('disabled', true);
    endTime = new Date();
    let data = { "faceId": dataSet.data[idx].faceID };
    let reactionTime = (endTime.getTime() - startTime.getTime()) / 1000;
    data = {
      ...data,
      "reactionTime": reactionTime,
      "choice": this.id
    }
    if (this.id == dataSet.data[idx].response) {
      data = {
        ...data,
        "answer": "correct",
      }
    } else {
      data = {
        ...data,
        "answer": "incorrect",
      }
    }
    outputPayload.data.push(data)
    if (++idx > 69) {
      $('.final-modal-container').show();
    } else {
      setTimeout(() => {
        $('.image-box').css('background-image', 'url(../../assets/faces/' + dataSet.data[idx].faceID + '.jpg)');
        $('.emotion-button').prop('disabled', false);
        startTime = new Date();
      }, 500);
    }
  });

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
    let fields = ['faceId', 'answer', 'choice', 'reactionTime'];
    csvHelper.write(outputPayload.data, id, 'emotion_recognition', fields).then((res) => {
      if (res == "success") {
        $('#export-btn').addClass('btn-success').removeClass('btn-primary').prop('disabled', true).text(string.strings.commons.exported);
        $('#close-modal-btn').hide();
      }
    })
  });

  $('#exit-btn').on('click', () => {
    ipcRenderer.send(PUT_DATA, 'emotion_recognition', outputPayload);
    let taskData = 1;
    if (outputPayload.data.length > 0) {
      ipcRenderer.send(PUT_TASK_STATE, { data: taskData });
    }
    window.location = '../gameMenu/gameMenu.html';
  });

});

$(window).on('resize', () => {
  $('.game-item').css({ 'height': $('.game-item').width() + 'px' });
});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
  window.localStorage.setItem('lang', JSON.stringify(string));
  $('#JOY').text(string.strings.game1.joy);
  $('#SADNESS').text(string.strings.game1.sadness);
  $('#ANGER').text(string.strings.game1.anger);
  $('#NEUTRAL').text(string.strings.game1.neutral);
  $('#DISGUST').text(string.strings.game1.disgust);
  $('#FEAR').text(string.strings.game1.fear);
  $('#SURPRISE').text(string.strings.game1.surprise);
  $('#close-modal-btn').text(string.strings.commons.modalCloseButton);
  $('.modal-content-text').text(string.strings.commons.modalContent);
  $('#exit-btn').text(string.strings.commons.modalExitButton);
  $('#export-btn').text(string.strings.commons.exportButton);
  $('#end-game-btn').text(string.strings.commons.modalExitButton);
});