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
} = require('./utils/constants');

$('#start-btn').on('click', () => {
    let patientID = $('#patient-id').val();
    if(patientID){
        ipcRenderer.send(PUT_PATIENT_IN_STORAGE, patientID);
    }
});

ipcRenderer.on(HANDLE_PUT_PATIENT_IN_STORAGE, (e, res) => {
    if(res.success){
        window.location = "views/gameMenu.html";
    }
});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
    window.localStorage.setItem('lang', string);
    $('#patient-title').html(string.strings.landingPage.title);
    $('#patient-id').attr("placeholder", string.strings.landingPage.placeholder);
});