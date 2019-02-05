const electron =  require('electron');
const { ipcRenderer } = electron;
const {
    HANDLE_LANGUAGE_CHANGE,
} = require('../../utils/constants');


$(document).ready(() => {
  try {
    let string = JSON.parse(window.localStorage.getItem('lang'));
    $('.g3-instructions').html(string.strings.game3.instructions[0].instruction);
    $('.g3-instruction-title').html(string.strings.game3.instructionTitle);
    $('#start-btn').text(string.strings.commons.startButton);
    $('#back-btn').text(string.strings.commons.backButton);
  } catch(err) {};
});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
    window.localStorage.setItem('lang', JSON.stringify(string));
    $('.g3-instructions').html(string.strings.game3.instructions[0].instruction);
    $('.g3-instruction-title').html(string.strings.game3.instructionTitle);
    $('#start-btn').text(string.strings.commons.startButton);
    $('#back-btn').text(string.strings.commons.backButton);
});
