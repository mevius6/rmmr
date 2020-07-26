if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function (registration) {
    // console.log('SW registered: ', registration)
  })
}

let deferredPrompt;
const addDiv = document.querySelector('.a2hs');
const addBtn = document.querySelector('.a2hs__cta');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  addDiv.classList.toggle('hidden', false);

  addBtn.addEventListener('click', (e) => {
    addDiv.classList.toggle('hidden', true);

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Пользователь принял a2hs запрос');
      } else {
        console.log('Пользователь отклонил a2hs запрос');
      }
      deferredPrompt = null;
    })
  });
});

window.addEventListener('appinstalled', (evt) => {
  console.log('a2hs установлен');
});
