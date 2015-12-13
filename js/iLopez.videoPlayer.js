(function ($) {
    if (!$.iLopez) {
        $.iLopez = new Object();
    }
    $.iLopez.videoPlayer = function (el, getData, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        console.log(getData.id);
        base.player = $(getData.id)[0];
        // Add a reverse reference to the DOM object
        base.$el.data("iLopez.videoPlayer", base);
        base.init = function () {
            base.getData = getData;
            base.options = $.extend({}, $.iLopez.videoPlayer.defaultOptions, options);
            // Put your initialization code here
            base.initPlayer();
            base.initButtons();
            //console.log(base.$el.find("#play").attr('class','glyphicon glyphicon-repeat'));
        };

        // Sample Function, Uncomment to use
        base.render = function () {
            base.$el.html(base.options);
        };

        // Functions of the VideoPlayer Buttons
        base.play = function (evt) {
            evt.preventDefault();
            player.paused ? player.play() : player.pause();
        };
        base.stop = function (evt) {
            evt.preventDefault();
            player.currentTime = 0;
            player.pause();
        };
        base.forward = function (evt) {
            evt.preventDefault();
            player.playbackRate = Math.min(5, player.playbackRate + 0.1);
        };
        base.backward = function (evt) {
            evt.preventDefault();
            player.playbackRate = Math.max(0, player.playbackRate - 0.1);
        };
        base.fullScreen = function (evt) {
            evt.preventDefault();
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
        };
        base.increaseVolume = function (evt) {
            evt.preventDefault();
            player.volume = Math.min(1, player.volume + 0.1);
        };
        base.decreaseVolume = function (evt) {
            evt.preventDefault();
            player.volume = Math.max(0, player.volume - 0.1);
        };
        /**
         * Functions that create VideoPlayer Buttons
         * @returns {Element}
         */
        base.createTimeBar = function () {
            var buttonItem = document.createElement('li');
            var input = document.createElement('input');
            input.type = 'range';
            input.id = 'timeBar';
            input.min = '0';
            input.className = 'col-md-12';
            input.value = '0';
            input.max = '100';
            input.onchange = function (event) {
                player.pause();
                event.preventDefault();
                console.log("prueba");
                //player.currentTime = player.duration * (input.value / 100);
                player.currentTime = 30;
                console.log(player.currentTime);
            };
            buttonItem.appendChild(input);
            return buttonItem;
        };
        base.createButtonItem = function (icon, fnc) {
            var buttonItem = document.createElement('li');
            var button = base.setButton('btn btn-default playerButton');
            button.appendChild(base.setInnerButton(icon));
            button.onclick = function (evt) {
                fnc(evt);
            };
            buttonItem.appendChild(button);
            return buttonItem;
        };
        base.setButton = function (classname) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = classname;
            return button;
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
        base.initButtons = function () {
            var buttonList = document.createElement('ul');
            buttonList.className = 'col-md-12 buttonContainer';

            buttonList.appendChild(base.createTimeBar());
            var icons = ['play', 'stop', 'volume-down', 'volume-up', 'backward', 'forward', 'fullscreen'];
            var functions = [base.play, base.stop, base.decreaseVolume, base.increaseVolume, base.backward, base.forward, base.fullScreen];
            for (var i = 0; i < icons.length; i++) {
                buttonList.appendChild(base.createButtonItem(icons[i], functions[i]));
            }
            base.$el.append(buttonList);
        };
        base.initPlayer = function () {
            var video = "";
            video += '<video id="{id}" poster="{poster}">';
            video += '<source src="{src}" type="{type}">';
            video += 'Your browser does not support the video element.';
            video += '</video>';
            video = video.replace("{id}", base.getData.id).replace("{poster}", base.getData.poster);
            video = video.replace("{src}", base.getData.videoURl).replace("{type}", base.getData.type);

            base.$el.html(video);
            console.log(player);
            console.log(base.player);
            player.onended = function () {
                base.$el.find("#play").attr('class','glyphicon glyphicon-repeat').attr('title' ,'Repeat');
            };
            player.onpause = function () {
                base.$el.find("#play").attr('class' ,'glyphicon glyphicon-play').attr('title' ,'Play');
            };
            player.onplaying = function () {
                base.$el.find("#play").attr('class' ,'glyphicon glyphicon-pause').attr('title' ,'Pause');
            };
            player.ontimeupdate = function () {
                base.$el.find("#timeBar").val(player.currentTime * 100 / player.duration);
            };
        };

        // Run initializer
        base.init();
    };

    $.iLopez.videoPlayer.defaultOptions = {
        option1: "defData",
        keys: {
            start: 32
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