const electron =  require('electron');
const { ipcRenderer } = electron;

const {
    PUT_PATIENT_IN_STORAGE,
    HANDLE_PUT_PATIENT_IN_STORAGE,
    GET_PATIENT_FROM_STORAGE,
    HANDLE_GET_PATIENT_FROM_STORAGE,
    CLEAR_STORAGE,
    HANDLE_CLEAR_STORAGE,
    HANDLE_LANGUAGE_CHANGE,
    PUT_TASK_STATE,
} = require('./utils/constants');

$(document).ready(() => {
  try {
    ipcRenderer.send(CLEAR_STORAGE);
    let string =  JSON.parse(window.localStorage.getItem('lang'));
    $('#patient-title').html(string.strings.landingPage.title);
    $('#patient-id').attr("placeholder", string.strings.landingPage.placeholder);
    $('#start-btn').text(string.strings.landingPage.buttonText);
  } catch(err) {};
});

$('#start-btn').on('click', () => {
  let patientID = $('#patient-id').val();
  ipcRenderer.send(PUT_TASK_STATE, {data: [1]});
  window.localStorage.setItem('patientId', patientID);
  window.location = "views/gameMenu/gameMenu.html";
});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
  window.localStorage.setItem('lang', JSON.stringify(string));
  $('#patient-title').html(string.strings.landingPage.title);
  $('#patient-id').attr("placeholder", string.strings.landingPage.placeholder);
  $('#start-btn').text(string.strings.landingPage.buttonText);
});