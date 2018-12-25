(() => {
  navigator.serviceWorker.register('sw.js');

  window.addEventListener('online', () => console.log('online'));
  window.addEventListener('offline', () => console.log('offline'));
})();

