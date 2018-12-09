const electron =  require('electron');
const { ipcRenderer } = electron;
const {
    HANDLE_LANGUAGE_CHANGE,
} = require('../../utils/constants');


$(document).ready(() => {
  try {
    let string = JSON.parse(window.localStorage.getItem('lang'));
    $('.g2-instructions').html(string.strings.game2.instructions[0].instruction);
    $('#start-btn').text(string.strings.game2.startbutton);
    $('#back-btn').text(string.strings.game1.backbtn);
    
  } catch(err) { };
});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
    window.localStorage.setItem('lang', JSON.stringify(string));
    $('.g2-instructions').html(string.strings.game2.instructions[0].instruction);
    $('#start-btn').text(string.strings.game2.startbutton);
    $('#back-btn').text(string.strings.game1.backbtn);
});
