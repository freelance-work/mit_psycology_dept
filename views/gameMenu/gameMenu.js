const electron = require('electron');
const { ipcRenderer } = electron;

const csvHelper = require('../../utils/csvHelper');

const {
    HANDLE_LANGUAGE_CHANGE,
    GET_EMOTION_RECOGNITION_DATA,
    GET_TASK_STATE
} = require('../../utils/constants');

$(document).ready(() => {
    $('.game-item').css({ 'height': $('.game-item').width() + 'px' });

    let taskState = ipcRenderer.sendSync(GET_TASK_STATE);

    taskState.data.map(state => {
      if(taskState.data.length - 1 == state) {
        $('#gameCSV' + state).css('display', 'unset');
      }
      $('#game'+ state).css('filter', 'none');
    })

    let string;
    try {
        string = JSON.parse(window.localStorage.getItem('lang'));
        $('.game-text1').html(string.strings.gamePage.game1);
        $('.game-text2').html(string.strings.gamePage.game2);
        $('.game-text3').html(string.strings.gamePage.game3);
        $('.game-text4').html(string.strings.gamePage.game4);
    } catch (err) { };
});

$(window).on('resize', () => {
    $('.game-item').css({ 'height': $('.game-item').width() + 'px' });
});

$('#gameCSV1').on('click', async (e) => {
  e.stopPropagation();
  let outputPayload = ipcRenderer.sendSync(GET_EMOTION_RECOGNITION_DATA);
  let id = window.localStorage.getItem('patientId');
  csvHelper.write(outputPayload.data, id, 'emotion_recognition').then((res) => {
    if (res == "success") {
      alert('CSV Exported');
    }
  })
});

$('#game1').on('click', () => {
  window.location = "../gameSpotEmotion/instructions.html";
});

$('#game2').on('click', () => {
  if(ipcRenderer.sendSync(GET_TASK_STATE).data.length == 2) {
    window.location = "../goNoGo/instruction.html";
  }
});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
    window.localStorage.setItem('lang', JSON.stringify(string));
    $('.game-text1').html(string.strings.gamePage.game1);
    $('.game-text2').html(string.strings.gamePage.game2);
    $('.game-text3').html(string.strings.gamePage.game3);
    $('.game-text4').html(string.strings.gamePage.game4);
});