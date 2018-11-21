const electron =  require('electron');
const { ipcRenderer } = electron;

const {
    HANDLE_LANGUAGE_CHANGE,
} = require('../../utils/constants');

$(document).ready(() => {
    let string =  JSON.parse(window.localStorage.getItem('lang'));
    $('.game-text1').html(string.strings.gamePage.game1);
    $('.game-text2').html(string.strings.gamePage.game2);
    $('.game-text3').html(string.strings.gamePage.game3);
    $('.game-text4').html(string.strings.gamePage.game4);

    $('.game-item').css({ 'height': $('.game-item').width() + 'px' });
});

$(window).on('resize', () => {
    $('.game-item').css({ 'height': $('.game-item').width() + 'px' });
});

ipcRenderer.on(HANDLE_LANGUAGE_CHANGE, (e, string) => {
    console.log("ge");
    window.localStorage.setItem('lang', string);
    $('.game-text1').html(string.strings.gamePage.game1);
    $('.game-text2').html(string.strings.gamePage.game2);
    $('.game-text3').html(string.strings.gamePage.game3);
    $('.game-text4').html(string.strings.gamePage.game4);
});