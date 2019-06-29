function _getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

function _setCookie(name, value, days) {
  var d = new Date;
  d.setTime(d.getTime() + 24*60*60*1000*days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

if ('serviceWorker' in navigator) {
  var deferredPrompt;
  var installBtn = document.getElementById('installBtn');
  var installDismissBtn = document.getElementById('installDismissBtn');
  var installDialog = document.getElementById('installDialog');
  var installDialogDontShow = _getCookie('installDialogHide');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (window.location.href.indexOf('view') !== -1 || installDialogDontShow) return;
    installDialog.style.display = 'block';
    installBtn.addEventListener('click', (e) => {
      installDialog.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            _setCookie('installDialogHide', 'true', 999);
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
    });
    installDismissBtn.addEventListener('click', (e) => {
      installDialog.style.display = 'none';
      _setCookie('installDialogHide', 'true', 999);
    });
  });
}