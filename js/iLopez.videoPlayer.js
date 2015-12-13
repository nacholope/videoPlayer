(function ($) {
    if (!$.iLopez) {
        $.iLopez = new Object();
    }
    $.iLopez.videoPlayer = function (el, getData, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        //Declare Player. Its initializated on initPlayer after append the video.
        base.player;
        //Declare ID. will be initialized with Id pased on constructor + random number.
        base.id;
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        // Add a reverse reference to the DOM object
        base.$el.data("iLopez.videoPlayer", base);
        base.init = function () {
            base.$el[0].className = 'col-md-10';
            base.getData = getData;
            base.options = $.extend($.iLopez.videoPlayer.defaultOptions, options);
            base.id = base.getData.id + Math.floor((Math.random() * 100) + 1);
            // Put your initialization code here
            base.initPlayer();
            base.initButtons();
            base.addKeyListeners();
            base.renderScenesForm();
            base.renderScenes();
        };
        /**
         * Styles the box of buttons.
         */
        base.renderScenesForm = function () {
            function updateSceneRow(name) {
                var scenes = $("#sceneRow")[0];
                var li = document.createElement('li');
                var sceneButton = document.createElement('button');
                sceneButton.className = 'btn btn-default scene';
                sceneButton.innerHTML = name;
                sceneButton.onclick = function () {
                    base.player.currentTime = localStorage.getItem(name);
                };
                li.appendChild(sceneButton);
                scenes.appendChild(li);
            }
            var row = document.createElement('ul');
            row.id = 'sceneRow';
            row.className = 'col-md-2';
            $('.container').last().append(row);

            var buttonCreateScenes = document.createElement('button');
            buttonCreateScenes.type = 'button';
            buttonCreateScenes.className = 'btn btn-default sceneMaker';
            buttonCreateScenes.innerHTML = 'Save scene';
            buttonCreateScenes.onclick = function () {
                var sceneName = $('#inputScene').get(0).value;
                var time = base.player.currentTime;
                if (localStorage.getItem(sceneName) === null) {
                    localStorage.setItem(sceneName, time);
                    updateSceneRow(sceneName);
                } else {
                    if (confirm("This scene exist, do you want update the time?")) {
                        localStorage.setItem(sceneName, time);
                    }
                }

            };
            var input = document.createElement('input');
            input.type = 'text';
            input.id = "inputScene";
            input.placeholder = 'Scene name';
            $("#sceneRow").append(buttonCreateScenes);
            $("#sceneRow").append(input);

        };
        base.renderScenes = function () {
            $.each(localStorage, function (index, value) {
                var li = document.createElement('li');
                var button = document.createElement('button');
                button.className = 'btn btn-default scene';
                button.innerHTML = index;
                button.onclick = function () {
                    base.player.currentTime = value;
                };
                li.appendChild(button);
                $("#sceneRow").append(li);
            });

        };
        // Functions of the VideoPlayer Buttons
        base.play = function (evt) {
            evt.preventDefault();
            base.player.paused ? base.player.play() : base.player.pause();
        };
        base.stop = function (evt) {
            evt.preventDefault();
            base.player.currentTime = 0;
            base.player.pause();
        };
        base.forward = function (evt) {
            evt.preventDefault();
            base.player.playbackRate = Math.min(5, base.player.playbackRate + 0.1);
        };
        base.backward = function (evt) {
            evt.preventDefault();
            base.player.playbackRate = Math.max(0, base.player.playbackRate - 0.1);
        };
        base.fullScreen = function (evt) {
            evt.preventDefault();
            if (base.player.requestFullscreen) {
                base.player.requestFullscreen();
            } else if (base.player.mozRequestFullScreen) {
                base.player.mozRequestFullScreen();
            } else if (base.player.webkitRequestFullScreen) {
                base.player.webkitRequestFullScreen();
            } else if (base.player.msRequestFullScreen) {
                base.player.msRequestFullScreen();
            }
            base.player.controls = true;
        };
        base.increaseVolume = function (evt) {
            evt.preventDefault();
            base.player.volume = Math.min(1, base.player.volume + 0.1);
        };
        base.decreaseVolume = function (evt) {
            evt.preventDefault();
            base.player.volume = Math.max(0, base.player.volume - 0.1);
        };
        /**
         * Functions that create VideoPlayer Buttons
         * @returns {Element}
         */
        base.createTimeStamp = function(){
            var buttonItem = document.createElement('li');
            buttonItem.innerHTML = '<span class="currentTime">00</span>';
            buttonItem.innerHTML += '<span>:</span>';
            buttonItem.innerHTML += '<span class="totalDuration">00</span>';
            return buttonItem;
        };
        base.createTimeBar = function () {
            var buttonItem = document.createElement('li');
            var input = document.createElement('input');
            input.type = 'range';
            input.id = 'timeBar';
            input.min = '0';
            input.value = '0';
            input.max = '100';
            ///////////////////////BUG///////////////////////////
            //Si usas el localhost que te proporciona Webstorm no funciona(No actualiza currentTime).
            //Abriendo el HTML manualmente Si.
            input.onchange = function (event) {
                event.preventDefault();
                base.player.pause();
                base.player.currentTime = base.player.duration * (input.value / 100);
                base.player.play();
            };
            buttonItem.appendChild(input);
            return buttonItem;
        };
        base.createButtonItem = function (icon, fnc) {
            var buttonItem = document.createElement('li');
            var button = document.createElement('button');
            button.type = 'button';
            button.className = ('btn btn-default playerButton ' + icon + "Button" );
            button.appendChild(base.setInnerButton(icon));
            button.onclick = function (evt) {
                fnc(evt);
            };
            buttonItem.appendChild(button);
            return buttonItem;
        };
        base.setInnerButton = function (icon) {
            var span = document.createElement('span');
            span.className = 'glyphicon glyphicon-' + icon;
            span.id = icon;
            span.title = icon;
            return span;
        };
        /**
         * Calls all the functions of the player buttons and Functions to create Buttons
         * Is called at base.ini();
         *
         */

        base.addKeyListeners = function () {
            window.onkeyup = function (e) {
                var key = e.keyCode ? e.keyCode : e.which;
                switch (key) {
                    case $.iLopez.videoPlayer.defaultOptions.keys.play:
                        base.play(event);
                        break;
                    case $.iLopez.videoPlayer.defaultOptions.keys.fullScreen:
                        base.fullScreen(event);
                        break;
                    case $.iLopez.videoPlayer.defaultOptions.keys.volumeUp:
                        base.increaseVolume(event);
                        break;
                    case $.iLopez.videoPlayer.defaultOptions.keys.volumeDown:
                        base.decreaseVolume(event);
                        break;
                    case $.iLopez.videoPlayer.defaultOptions.keys.fastForward:
                        base.forward(event);
                        break;
                    case $.iLopez.videoPlayer.defaultOptions.keys.slowForward:
                        base.backward(event);
                        break;
                }
            }
        };

        base.initButtons = function () {
            var buttonList = document.createElement('ul');
            buttonList.className = 'buttonContainer';
            if (base.getData.buttons.play) buttonList.appendChild(base.createButtonItem('play', base.play));
            if (base.getData.buttons.timeStamp) buttonList.appendChild(base.createTimeStamp());
            if (base.getData.buttons.timeBar) buttonList.appendChild(base.createTimeBar());
            if (base.getData.buttons.stop) buttonList.appendChild(base.createButtonItem('stop', base.stop));
            if (base.getData.buttons.volumeUp) buttonList.appendChild(base.createButtonItem('volume-down', base.decreaseVolume));
            if (base.getData.buttons.volumeDown) buttonList.appendChild(base.createButtonItem('volume-up', base.increaseVolume));
            if (base.getData.buttons.fastForward) buttonList.appendChild(base.createButtonItem('forward', base.forward));
            if (base.getData.buttons.slowForward) buttonList.appendChild(base.createButtonItem('backward', base.backward));
            if (base.getData.buttons.fullScreen) buttonList.appendChild(base.createButtonItem('fullscreen', base.fullScreen));

            base.$el.append(buttonList);
        };
        base.initPlayer = function () {
            var video = '<video id="{id}" poster="{poster}" class="iLopezPlayer">';
            video += '<source src="{src}" type="{type}">';
            video += 'Your browser does not support the video element.';
            video += '</video>';

            //Modifiy the template with values on the constructor
            video = video.replace("{id}", base.id).replace("{poster}", base.getData.poster);
            video = video.replace("{src}", base.getData.videoURl).replace("{type}", base.getData.type);

            //Appends the video to the HTML
            base.$el.append(video);

            //Asign value to base.player based on ID given on constructor.
            base.player = base.$el.find('#' + base.id).get(0);

            //Gives the Behavior to the Video Player
            base.player.onended = function () {
                base.$el.find("#play").attr('class', 'glyphicon glyphicon-repeat').attr('title', 'Repeat');
            };
            base.player.onpause = function () {
                base.$el.find("#play").attr('class', 'glyphicon glyphicon-play').attr('title', 'Play');
            };
            base.player.onplaying = function () {
                base.$el.find("#play").attr('class', 'glyphicon glyphicon-pause').attr('title', 'Pause');
            };
            base.player.ontimeupdate = function () {
                base.$el.find("#timeBar").val(base.player.currentTime * 100 / base.player.duration);
                base.$el.find(".currentTime")[0].innerHTML = Math.floor(base.player.currentTime);
                base.$el.find(".totalDuration")[0].innerHTML = Math.floor(base.player.duration);
                console.log(base.$el.find(".currentTime")[0]);
            };

        };

        // Run initializer
        base.init();
    };

    $.iLopez.videoPlayer.defaultOptions = {
        option1: "defData",
        keys: {
            play: 32,
            fullScreen: 45,
            volumeUp: 38,
            volumeDown: 40,
            fastForward: 39,
            slowForward: 37
        }
    };

    $.fn.iLopez_videoPlayer = function (getData, options) {
        return this.each(function () {
            (new $.iLopez.videoPlayer(this, getData, options));
        });
    };

    // This function breaks the chain, but returns
    // the iLopez.videoPlayer if it has been attached to the object.
    $.fn.getILopez_videoPlayer = function () {
        this.data("iLopez.videoPlayer");
    };

})(jQuery);