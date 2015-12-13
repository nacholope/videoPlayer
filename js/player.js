/*
Comentar Cada Funcion
 */

/* Constants Keys */

var player = getById('player');
if (player != null) {
    setPlayerButtons();
    settingPlayer();
}
function doDefault(evt) {
    evt.preventDefault();
}
function play(evt) {
    doDefault(evt);
    player.paused ? player.play() : player.pause();
}
function stop(evt) {
    doDefault(evt);
    player.currentTime = 0;
    player.pause();
}
function forward(evt) {
    doDefault(evt);
    player.playbackRate = Math.min(5, player.playbackRate + 0.1);
}
function backward(evt) {
    doDefault(evt);
    player.playbackRate = Math.max(0, player.playbackRate - 0.1);
}
function fullScreen(evt) {
    doDefault(evt);
    if (player.requestFullscreen) {
        player.requestFullscreen();
    } else if (player.mozRequestFullScreen) {
        player.mozRequestFullScreen();
    } else if (player.webkitRequestFullScreen) {
        player.webkitRequestFullScreen();
    } else if (player.msRequestFullScreen) {
        player.msRequestFullScreen();
    }
    player.controls = true;
}
function increaseVolume(evt){
    doDefault(evt);
    player.volume = Math.min(1, player.volume+0.1);
}
function decreaseVolume(evt){
    doDefault(evt);
    player.volume = Math.max(0, player.volume-0.1);
}
function setPlayerButtons() {
    var div = createElement('div');
    div.className = 'row';
    div.id = 'playerButtons';

    div.appendChild(createTimeBar());

    var icons = ['play','stop','volume-down','volume-up','backward','forward','fullscreen'];
    var functions = [play,stop,decreaseVolume,increaseVolume,backward, forward, fullScreen];
    for (var i = 0; i < functions.length; i++) {
        div.appendChild(createButton(icons[i],functions[i]));
    }

    document.getElementById('player-container').appendChild(div);
}
function createTimeBar() {
    var input = createElement('input');
    input.type = 'range';
    input.id = 'timeBar';
    input.min = '0';
    input.value = '0';
    input.max = '100';
    input.onchange = function (event) {
        doDefault(event);
        player.currentTime = player.duration * (input.value / 100);
    };
    return input;
}
function createButton(icon,fnc) {
    var button = createElement('button');
    button.type = 'button';
    button.className = 'btn btn-default playerButton';
    button.onclick = function (evt) {
        fnc(evt);
    };
    var span = createElement('span');
    span.className = 'glyphicon glyphicon-' + icon;
    span.id = fnc.name;
    span.title = icon;

    button.appendChild(span);

    return button;
}
function settingPlayer() {
    var playButton = getById('play');
    var timeBar = getById('timeBar');
    player.onended = function () {
        playButton.className = 'glyphicon glyphicon-repeat';
        playButton.title = 'Repeat';
    };
    player.onpause = function () {
        playButton.className = 'glyphicon glyphicon-play';
        playButton.title = 'Play';
    };
    player.onplaying = function () {
        playButton.className = 'glyphicon glyphicon-pause';
        playButton.title = 'Pause';
    };
    player.ontimeupdate = function () {
        timeBar.value = player.currentTime * 100 / player.duration;
    };
}
function getById(id) {
    return document.getElementById(id);
}
function createElement(type){return document.createElement(type)}
