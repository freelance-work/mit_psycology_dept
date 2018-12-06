const electron =  require('electron');
const { ipcRenderer } = electron;
const {
    HANDLE_LANGUAGE_CHANGE,
} = require('../../utils/constants');


$(document).ready(() => {
  try {
    let string = JSON.parse(window.localStorage.getItem('lang'));
    $('.g1-instruction-title').html(string.strings.game1.instructionTitle);
    $('.g1-instructions').html(string.strings.game1.instruction);
    $('#start-btn').text(string.strings.game1.startButtonText);
  } catch(err) { };
});

$(window).on('resize', () => {
    $('.game-item').css({ 'height': $('.game-item').width() + 'px' });
});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
    window.localStorage.setItem('lang', string);
    $('.g1-instruction-title').html(string.strings.game1.instructionTitle);
    $('.g1-instructions').html(string.strings.game1.instruction);
    $('#start-btn').text(string.strings.game1.startButtonText);
});
