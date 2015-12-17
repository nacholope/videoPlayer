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
            //Change the class of the div containing the video
            base.$el[0].className = 'iLopezPlayer';

            base.getData = getData;
            //The default function
            // $.extend({},$.iLopez.videoPlayer.defaultOptions,options);
            //Rewrite the default options of the object so future instances of the plugin will have the options passed before.
            //I changed it creating a temporally object as third parameter merging the default options and options
            base.tempOptions = $.iLopez.videoPlayer.defaultOptions;
            base.options = $.extend({}, $.iLopez.videoPlayer.defaultOptions, $.extend(true, base.tempOptions, options));
            base.id = base.options.id;
            // Put your initialization code here
            base.initPlayer();
            base.initButtons();
            base.behaviorPlayer();
            base.addKeyListeners();
            base.initModal();
            base.addSaveScenesListener();

        };
        /**
         * Styles the box of buttons.
         */
        base.addSaveScenesListener = function(){
            $('#ButtonScenes').click(
                function () {
                    base.player.pause();
                    var sceneName = $('#SceneTextInputID').get(0).value + " " + $('#SceneTextInput').get(0).value;
                    var time = base.player.currentTime;
                    localStorage.setItem(sceneName, time);
                    base.showScenes();
                }
            );
        };
        base.renderScenes = function () {
            var ul = document.createElement('ul');
            $.each(localStorage, function (index, value) {
                var id = index.split(" ")[0];
                if (id === base.id) {
                    var li = document.createElement('li');
                    var button = document.createElement('button');
                    button.className = 'scene';
                    button.style.style = 'none';
                    button.innerHTML = index.replace(index.split(" ")[0], "");
                    button.onclick = function () {
                        base.player.currentTime = value;
                    };
                    li.appendChild(button);
                    ul.appendChild(li);
                }
            });
            return ul;
        };
        base.initModal = function () {
            //Check only 1 modal is active to avoid creating 1 modal per video.
            if ($('#iLopezPlayerModal').get(0) == undefined) {
                var modal = '<div class="modal fade" id="iLopezPlayerModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
                modal += '<div class="modal-dialog">';
                modal += '<div class="modal-content">';
                modal += '<div class="modal-header">';
                modal += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
                modal += '<h4 class="modal-title" id="myModalLabel">Scenes of the video</h4>';
                modal += '</div>';
                modal += '<div class="modal-body">';
                modal += '<input type="text" id="SceneTextInput">';
                modal += '<input type="hidden" id="SceneTextInputID" value="">';
                modal += '<button value="save Scene" id="ButtonScenes">Save Scene</button>';
                modal += '<div class="modal-body-content">';
                modal += 'Cotenido Modal';
                modal += '</div>';
                modal += '</div>';
                modal += '<div class="modal-footer">';
                modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
                modal += '</div>';
                modal += '</div>';
                modal += '</div>';
                modal += '</div>';
                $(document.body).append(modal);
            }
        };
        base.showScenes = function () {
            var Modal = $('#iLopezPlayerModal').find('.modal-body-content').get(0);
            Modal.innerHTML = "";
            Modal.appendChild(base.renderScenes());
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
        base.updateVolume = function (evt, value) {
            evt.preventDefault();
            base.player.volume = value / 100;
        };
        base.updateTimeSpan = function (value) {
            value = Math.floor(value);
            if (value < 10) {
                value = '0' + value;
            }
            return value;
        };
        /**
         * Functions that create VideoPlayer Buttons
         * @returns {Element}
         */
        base.createTimeBar = function () {
            function createSpan(className, value) {
                var span = document.createElement('span');
                span.className = className;
                span.innerHTML = value;
                return span;
            }

            var li = document.createElement('li');
            li.id = 'timeBarContainer';
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
            //Checks if the user wants TimeSpam
            if (base.options.buttons.timeStamp) {
                li.appendChild(createSpan("currentTime", "00"));
                li.appendChild(createSpan("", "/"));
                li.appendChild(createSpan("totalDuration"));
            }

            li.appendChild(input);
            return li;
        };
        base.createSoundButton = function () {
            var li = document.createElement('li');
            var button = document.createElement('button');
            button.type = 'button';
            button.id = 'soundButton';
            button.className = ('btn btn-default playerButton Sound Button' );

            var span = document.createElement('span');
            span.className = 'glyphicon glyphicon-volume-up';
            span.id = 'sound';
            span.title = 'sound';
            button.appendChild(span);

            var input = document.createElement('input');
            input.type = 'range';
            input.id = 'soundBar';
            input.min = '0';
            input.value = '50';
            input.max = '100';
            input.style.display = 'none';
            input.onchange = function (event) {
                base.updateVolume(event, input.value);

            };

            button.onmouseover = function () {
                input.style.display = 'block';
            };
            button.onmouseout = function () {
                input.style.display = 'none';
            };

            button.appendChild(input);
            li.appendChild(button);
            return li;
        };
        base.createScenesButton = function () {
            var li = document.createElement('li');
            var button2 = '<button class="btn btn-default playerButton Scenes Button" id="' + base.id + '" data-toggle="modal" data-target="#iLopezPlayerModal">';
            button2 += '<span class="glyphicon glyphicon-list-alt"></span>';
            button2 += '</button>';
            li.innerHTML = button2;
            li.onmouseover = function () {
                $('#SceneTextInputID').get(0).value = base.id;
                base.showScenes();
            };
            return li;
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
                    case base.options.keys.play:
                        base.play(event);
                        break;
                    case base.options.keys.fullScreen:
                        base.fullScreen(event);
                        break;
                    case base.options.keys.volumeUp:
                        event.preventDefault();
                        base.player.volume = Math.min(1, base.player.volume + 0.1);
                        break;
                    case base.options.keys.volumeDown:
                        event.preventDefault();
                        base.player.volume = Math.max(0, base.player.volume - 0.1);
                        break;
                    case base.options.keys.fastForward:
                        base.forward(event);
                        break;
                    case base.options.keys.slowForward:
                        base.backward(event);
                        break;
                }
            }
        };
        base.initButtons = function () {
            var buttonList = document.createElement('ul');
            buttonList.className = 'buttonContainer';

            if (base.options.buttons.play) buttonList.appendChild(base.createButtonItem('play', base.play));
            if (base.options.buttons.stop) buttonList.appendChild(base.createButtonItem('stop', base.stop));
            if (base.options.buttons.timeBar) buttonList.appendChild(base.createTimeBar());
            if (base.options.buttons.volume) buttonList.appendChild(base.createSoundButton());
            if (base.options.buttons.scenes) buttonList.appendChild(base.createScenesButton());
            if (base.options.buttons.slowForward) buttonList.appendChild(base.createButtonItem('backward', base.backward));
            if (base.options.buttons.fastForward) buttonList.appendChild(base.createButtonItem('forward', base.forward));
            if (base.options.buttons.fullScreen) buttonList.appendChild(base.createButtonItem('fullscreen', base.fullScreen));

            base.$el.append(buttonList);
        };
        base.initPlayer = function () {
            var video = '<video id="{id}" poster="{poster}" class="iLopezPlayerVideo">';
            video += '<source src="{src}" type="{type}">';
            video += 'Your browser does not support the video element.';
            video += '</video>';

            //Modifiy the template with values on the constructor
            video = video.replace("{id}", base.id).replace("{poster}", base.options.poster);
            video = video.replace("{src}", base.options.videoURl).replace("{type}", base.options.type);

            //Appends the video to the HTML
            base.$el.append(video);

        };


        base.behaviorPlayer = function () {

            //Search and initialize values.
            //Button of Play
            base.buttonPlay = base.$el.find("#play").get(0);
            //Timebar of the video
            base.timeBar = base.$el.find("#timeBar").get(0);
            //Span to show the current time.
            base.currentTimeSpan = base.$el.find(".currentTime").get(0);
            //span to show the total duration of the video.
            base.durationTimeSpan = base.$el.find(".totalDuration")[0];
            //Video
            base.player = base.$el.find('#' + base.id).get(0);

            //Waits till the video is loaded.
            base.player.oncanplay = function () {
                //Set the total duration of the video to the Span
                base.durationTimeSpan.innerHTML = Math.floor(base.player.duration);
            };
            base.player.onended = function () {
                base.buttonPlay.className = 'glyphicon glyphicon-repeat';
                base.buttonPlay.title = 'Repeat';
            };
            base.player.onpause = function () {
                base.buttonPlay.className = 'glyphicon glyphicon-play';
                base.buttonPlay.title = 'Play';
            };
            base.player.onplaying = function () {
                base.buttonPlay.className = 'glyphicon glyphicon-pause';
                base.buttonPlay.title = 'Pause';
            };
            base.player.ontimeupdate = function () {
                base.timeBar.value = base.player.currentTime * 100 / base.player.duration;
                base.currentTimeSpan.innerHTML = base.updateTimeSpan(base.player.currentTime);
            };
            base.player.onclick = function (event) {
                base.play(event);
            };

        };

        // Run initializer
        base.init();
    };

    $.iLopez.videoPlayer.defaultOptions = {
        poster: "img/poster.png",
        type: 'video/mp4',
        keys: {
            play: 32,
            fullScreen: 45,
            volumeUp: 38,
            volumeDown: 40,
            fastForward: 39,
            slowForward: 37
        },
        buttons: {
            timeBar: true,
            timeStamp: true,
            play: true,
            stop: true,
            volume: true,
            fastForward: true,
            slowForward: true,
            scenes: true,
            fullScreen: true
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