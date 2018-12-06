const electron = require('electron');
const payload = require('../../assets/emotion_recognition/emotion_recognition');
const { ipcRenderer } = electron;
const dataSet = { 'data': payload.data.sort(() => Math.random() - 0.5) };
const csvHelper = require('../../utils/csvHelper');


const {
  HANDLE_LANGUAGE_CHANGE,
  PUT_EMOTION_RECOGNITION_DATA,
  HANDLE_PUT_EMOTION_RECOGNITION_DATA,
} = require('../../utils/constants');

$(document).ready(() => {
  let idx = 0;
  let outputPayload = { "data": [] };
  let startTime = new Date();
  let endTime = new Date();
  let string;

  try {
    string = JSON.parse(window.localStorage.getItem('lang'));
  } catch(err) { };

  $('.image-box').css('background-image', 'url(../../assets/emotion_recognition/faces/' + dataSet.data[idx].faceID + '.jpg)');

  $('.emotion-button').click(function () {
    $('.image-box').css('background-image', 'none');
    $('.emotion-button').prop('disabled', true);
    endTime = new Date();
    let data = { "faceId": dataSet.data[idx].faceID };
    let reactionTime = (endTime.getTime() - startTime.getTime()) / 1000;
    data = {
      ...data,
      "reactionTime": reactionTime,
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
    if (++idx > 2) {
      $('.final-modal-container').show();
      ipcRenderer.send(PUT_EMOTION_RECOGNITION_DATA, outputPayload);
    } else {
      setTimeout(() => {
        $('.image-box').css('background-image', 'url(../../assets/emotion_recognition/faces/' + dataSet.data[idx].faceID + '.jpg)');
        $('.emotion-button').prop('disabled', false);
        startTime = new Date();
      }, 500);
    }
  });

  $('#export-btn').on('click', async () => {
    let id = window.localStorage.getItem('patientId');
    csvHelper.write(outputPayload.data, id, 'emotion_recognition').then((res)=>{
      if(res == "success"){
        $('#export-btn').addClass('btn-success').removeClass('btn-primary').prop('disabled', true).text('Exported');
      }
    })
  });

  $('#exit-btn').on('click', () => {
    window.location = '../gameMenu/gameMenu.html';
  });

});

$(window).on('resize', () => {
  $('.game-item').css({ 'height': $('.game-item').width() + 'px' });
});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
  window.localStorage.setItem('lang', string);
});