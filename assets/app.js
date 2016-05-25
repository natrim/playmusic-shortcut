/* global chrome, BrowserControl, TitleBar */
var viewIsLoaded = false;
window.onload = function () {
    var webview = document.querySelector('#webview');

    var browserControl = new BrowserControl('#webview', webview.src);
    var titlebar = new TitleBar('top', 'assets/icon_16.png', 'Play Music Shortcut', true, browserControl);
    titlebar.bind();

	var isLoaded = false;
	var loadLimit = 10;
	var loading = setTimeout(function() {
		if (loadLimit >= 10) {
			document.querySelector('#dialog-title').innerHTML = 'Error';
			document.querySelector('#dialog-content').innerHTML = 'Cannot open web! Check your internet connection and use Reload in titlebar.';
			document.querySelector('#dialog-cancel').style.display = 'none';
			document.querySelector('#dialog').showModal();
		} else {
			loadLimit++;
			document.querySelector('#mainwebview').reload();
		}
	}, 10000);

    webview.addEventListener('contentload', function () {
        if (loading) {
            clearTimeout(loading);
            loading = null;
        }
        if (!isLoaded) {
            isLoaded = true;
        }
    });
    webview.addEventListener('permissionrequest', function (e) {
        if (e.permission === 'download') {
            e.request.allow();
        } else if (e.permission === 'fullscreen') {
            e.request.allow();
        } else if (e.permission === 'loadplugin') {
            if (e.request.identifier === 'adobe-flash-player') {
                e.request.allow();
            }
        }
    });
    webview.addEventListener('loadstart', function () {
        viewIsLoaded = false;
    });
    webview.addEventListener('loadstop', function () {
        viewIsLoaded = true;
    });
    webview.addEventListener('newwindow', function (e) {
        e.preventDefault();
        window.open(e.targetUrl);
    });
    webview.addEventListener('dialog', function (e) {
        if (e.messageType === 'prompt') {
            console.error('prompt dialog not handled!');
            return;
        }

        document.querySelector('#dialog-title').innerHTML = 'Dialog ' + e.messageType;
        document.querySelector('#dialog-content').innerHTML = e.messageText;

        if (e.messageType === 'confirm') {
            document.querySelector('#dialog-cancel').style.display = 'inline';
        } else {
            document.querySelector('#dialog-cancel').style.display = 'none';
        }

        e.preventDefault();

        returnDialog = e.dialog;

        document.querySelector('#dialog').showModal();
    });

    var returnDialog = null;
    document.querySelector('#dialog').addEventListener('close', function () {
        if (returnDialog) {
            returnDialog.cancel();
            returnDialog = null;
        }
    });
    document.querySelector('#dialog-ok').addEventListener('click', function () {
        if (returnDialog) {
            returnDialog.ok();
            returnDialog = null;
        }
        document.querySelector('#dialog').close();
    });
    document.querySelector('#dialog-cancel').addEventListener('click', function () {
        if (returnDialog) {
            returnDialog.cancel();
            returnDialog = null;
        }
        document.querySelector('#dialog').close();
    });
};

chrome.commands.onCommand.addListener(function (command) {
    if (!viewIsLoaded) return;
    var webview = document.querySelector('#webview');
    switch (command) {
    case 'NEXT-MK':
        //NEXT_MK
        webview.executeScript({
            code: "Array.prototype.slice.call(document.querySelectorAll('#player-bar-forward')).forEach(function(el) { el.click(); });"
        });
        break;
    case 'PREV-MK':
        //PREV_MK
        webview.executeScript({
            code: "Array.prototype.slice.call(document.querySelectorAll('#player-bar-rewind')).forEach(function(el) { el.click(); });"
        });
        break;
    case 'PLAY-PAUSE-MK':
        //PLAY_MK
        webview.executeScript({
            code: "Array.prototype.slice.call(document.querySelectorAll('#player-bar-play-pause')).forEach(function(el) { el.click(); });"
        });
        break;
    case 'STOP-MK':
        //STOP_MK
        webview.executeScript({
            code: "Array.prototype.slice.call(document.querySelectorAll('#player-bar-play-pause')).forEach(function(el) { el.click(); });"
        });
        break;
    }
});
