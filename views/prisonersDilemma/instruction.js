const electron =  require('electron');
const { ipcRenderer } = electron;
const {
    HANDLE_LANGUAGE_CHANGE,
} = require('../../utils/constants');


$(document).ready(() => {
  let count = 1;
  try {
    let string = JSON.parse(window.localStorage.getItem('lang'));
    $('.g6-instruction-title').html(string.strings.game6.instructionTitle);
    $('.g6-instructions').html(string.strings.game6.instruction);
    $('#start-btn').text(string.strings.commons.nextButton);
    $('#back-btn').text(string.strings.commons.backButton);
  } catch(err) { };

  $('#start-btn').on('click', () => {
      let string = JSON.parse(window.localStorage.getItem('lang'));
      count++;
      console.log(count);
      if(count == 2){
         $('.g6-instructions').html(string.strings.game6.instruction2);
      } else if(count == 3){
        $('.g6-instructions-content').html(string.strings.game6.instruction3);
        $('#start-btn').text(string.strings.commons.startButton);
      } else if(count == 4){
        window.location = "./prisonersDilemma.html";
      }
  })

});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
    window.localStorage.setItem('lang', JSON.stringify(string));
    $('.g6-instruction-title').html(string.strings.game6.instructionTitle);
    $('.g6-instructions').html(string.strings.game6.instruction);
    $('#start-btn').text(string.strings.commons.startButton);
    $('#back-btn').text(string.strings.commons.backButton);
});
