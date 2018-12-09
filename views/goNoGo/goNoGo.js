const electron = require('electron');
const { ipcRenderer } = electron;
const csvHelper = require('../../utils/csvHelper');
const gamePayload = require('../../assets/gonogo');
const {
    HANDLE_LANGUAGE_CHANGE,
    GET_EMOTION_RECOGNITION_DATA,
    PUT_TASK_STATE,
} = require('../../utils/constants');
let face;
let resp = { faceID: '', response: 'noResponse' };
let setCount = 0;
let setArr = [{ emotion: 'JOY', obj: gamePayload.joyAnger }, { emotion: 'JOY', obj: gamePayload.joyNeutral }, { emotion: 'NEUTRAL', obj: gamePayload.neutralJoy }, { emotion: 'NEUTRAL', obj: gamePayload.neutralAngry }, { emotion: 'ANGER', obj: gamePayload.angerJoy }, { emotion: 'ANGER', obj: gamePayload.angerNeutral }];
let payload = { "data": [] }

$(document).ready(() => {
    let string = JSON.parse(window.localStorage.getItem('lang'));
    console.log(string)
    $('.modal-content-text').html(string.strings.game2.instructions[setCount].instruction)
    startGame(setArr[setCount].obj);
    $(window).keypress(function (e) {
        if (e.which === 32) {
            if (face.response == setArr[set].emotion) {
                if (resp.response == 'noResponse') {
                    resp = { ...resp, response: 'correct' }
                }
            } else {
                if (resp.response == 'noResponse') {
                    resp = { ...resp, response: 'incorrect' }
                }
            }
        }
    });
});

$('.continue-btn').on('click', () => {
    $('.modal-container').hide();
    let payload = { "data": [] }
    startGame(setArr[setCount].obj);
})

startGame = (payloadSet) => {
    let string = JSON.parse(window.localStorage.getItem('lang'));
    let quad;
    let random_idx;
    let count = 0;
    let timer = setInterval(function () {
        if (count != 0) {
            payload.data.push(resp);
            console.log(payload);
        }

        $('.quadrant').css({ 'background-image': 'url()' });
        resp = { faceID: '', response: 'noResponse', set: setCount }
        if (++count > 30) {
            setCount++;
            if (setCount > 5) {
                clearInterval(timer);
                $('.final-modal-container').show();
            }
            $('.modal-content-text').html(string.strings.game2.instructions[setCount].instruction)
            clearInterval(timer);
            $('.modal-container').show();
        }
        setTimeout(function () {
            quad = Math.floor(Math.random() * 4) + 1;
            random_idx = Math.random();
            if (random_idx <= 0.75) {
                face = payloadSet[Math.floor(Math.random() * 30)];
            } else {
                face = payloadSet[Math.floor(Math.random() * 30) + 30];
            }
            resp = {
                ...resp,
                faceID: face.faceID,
                quadrant: quad,
                emotion: face.response,
            };
            $('.quadrant' + quad).css({ 'background-image': 'url(../../assets/faces/' + face.faceID + '.jpg)' });
        }, 500);
    }, 1500);
}

$('#export-btn').on('click', async () => {
    let id = window.localStorage.getItem('patientId');
    csvHelper.write(payload.data, id, 'emotion_recognition').then((res) => {
        if (res == "success") {
            $('#export-btn').addClass('btn-success').removeClass('btn-primary').prop('disabled', true).text('Exported');
        }
    })
});

$('#exit-btn').on('click', () => {
    ipcRenderer.send(PUT_TASK_STATE, { data: [1, 2, 3] });
    window.location = '../gameMenu/gameMenu.html';
});