const electron = require('electron');
const { ipcRenderer } = electron;

const csvHelper = require('../../utils/csvHelper');

const {
    HANDLE_LANGUAGE_CHANGE,
    GET_TASK_STATE,
    GET_DATA
} = require('../../utils/constants');

$(document).ready(() => {
    $('.game-item').css({ 'height': $('.game-item').width() + 'px' });

    let taskState = ipcRenderer.sendSync(GET_TASK_STATE);

    $('#gameCSV' + taskState.data).css('display', 'unset');


    let string;
    try {
        string = JSON.parse(window.localStorage.getItem('lang'));
        $('.game-text1').html(string.strings.gamePage.game1);
        $('.game-text2').html(string.strings.gamePage.game2);
        $('.game-text3').html(string.strings.gamePage.game3);
        $('.game-text4').html(string.strings.gamePage.game4);
        $('.game-text5').html(string.strings.gamePage.game5);
        $('.game-text6').html(string.strings.gamePage.game6);
    } catch (err) { };
});

$(window).on('resize', () => {
    $('.game-item').css({ 'height': $('.game-item').width() + 'px' });
});

$('#gameCSV1').on('click', async (e) => {
  e.stopPropagation();
  let outputPayload = ipcRenderer.sendSync(GET_DATA, 'emotion_recognition');
  let id = window.localStorage.getItem('patientId');
  let fields = ['faceId', 'answer', 'choice', 'reactionTime'];
  csvHelper.write(outputPayload.data, id, 'emotion_recognition', fields).then((res) => {
    if (res == "success") {
      alert('CSV Exported');
    }
  })
});

$('#gameCSV2').on('click', async (e) => {
  e.stopPropagation();
  let outputPayload = ipcRenderer.sendSync(GET_DATA, 'gonogo');
  let id = window.localStorage.getItem('patientId');
  let fields = ['set', 'faceID', 'quadrant', 'response', 'correctResponse', 'emotion', 'reactionTime'];
  csvHelper.write(outputPayload.data, id, 'go-no-go', fields).then((res) => {
    if (res == "success") {
      alert('CSV Exported');
    }
  })
});

$('#gameCSV3').on('click', async (e) => {
  e.stopPropagation();
  let outputPayload = ipcRenderer.sendSync(GET_DATA, 'word_gonogo');
  let id = window.localStorage.getItem('patientId');
  let fields = ['set', 'word', 'quadrant', 'response', 'correctResponse', 'emotion', 'reactionTime'];
  csvHelper.write(outputPayload.data, id, 'word-go-no-go', fields).then((res) => {
    if (res == "success") {
      alert('CSV Exported');
    }
  })
});

$('#gameCSV4').on('click', async (e) => {
  e.stopPropagation();
  let outputPayload = ipcRenderer.sendSync(GET_DATA, 'iowa_gambling');
  let id = window.localStorage.getItem('patientId');
  let fields = ['Trial', 'Card', 'Won', 'Lost', 'Total'];
  csvHelper.write(outputPayload.data, id, 'iowa_gambling', fields).then((res) => {
    if (res == "success") {
      alert('CSV Exported');
    }
  })
});

$('#gameCSV5').on('click', async (e) => {
  e.stopPropagation();
  let outputPayload = ipcRenderer.sendSync(GET_DATA, 'delay_dicounting');
  let id = window.localStorage.getItem('patientId');
  let fields = ['choiceNo', 'index', 'indexAdjustment', 'delayChoice', 'response', 'responseTime', 'ed50', 'k'];
  csvHelper.write(outputPayload.data, id, 'delay_dicounting', fields).then((res) => {
    if (res == "success") {
      alert('CSV Exported');
    }
  })
});

$('#gameCSV6').on('click', async (e) => {
  e.stopPropagation();
  let outputPayload = ipcRenderer.sendSync(GET_DATA, 'prisoners_dilemma');
  let id = window.localStorage.getItem('patientId');
  let fields = ['trial', 'opponentStrategy', 'patientResponse', 'opponentResponse', 'patientGainedPts', 'opponentGainedPts', 'patientTotalPts', 'opponentTotalPts', 'reactionTime'];
  csvHelper.write(outputPayload.data, id, 'prisoners_dilemma', fields).then((res) => {
    if (res == "success") {
      alert('CSV Exported');
    }
  })
});

$('#game1').on('click', () => {
  window.location = "../gameSpotEmotion/instructions.html";
});

$('#game2').on('click', () => {
  window.location = "../goNoGo/instruction.html";
});

$('#game3').on('click', () => {
  window.location = "../wordAffectiveGoNoGo/instruction.html";
});

$('#game4').on('click', () => {
  window.location = "../IOWAGambling/instruction.html";
});

$('#game5').on('click', () => {
  window.location = "../delayDiscounting/instruction.html";
});

$('#game6').on('click', () => {
  window.location = "../prisonersDilemma/instruction.html";
});


ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
    window.localStorage.setItem('lang', JSON.stringify(string));
    $('.game-text1').html(string.strings.gamePage.game1);
    $('.game-text2').html(string.strings.gamePage.game2);
    $('.game-text3').html(string.strings.gamePage.game3);
    $('.game-text4').html(string.strings.gamePage.game4);
    $('.game-text5').html(string.strings.gamePage.game5);
    $('.game-text6').html(string.strings.gamePage.game6);
});