const electron = require('electron');
const payload = require('../../assets/emotion_recognition/emotion_recognition');
const { ipcRenderer } = electron;
const dataSet = { 'data': payload.data.sort(() => Math.random() - 0.5) };


const {
  HANDLE_LANGUAGE_CHANGE,
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
    
    if (idx > 69) {
      console.log(outputPayload.data);
      console.log("open modal")
    } else {
      setTimeout(() => {
        $('.image-box').css('background-image', 'url(../../assets/emotion_recognition/faces/' + dataSet.data[++idx].faceID + '.jpg)');
        startTime = new Date();
      }, 1000);
    }
  });
});

$(window).on('resize', () => {
  $('.game-item').css({ 'height': $('.game-item').width() + 'px' });
});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
  window.localStorage.setItem('lang', string);
});