if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(registration => {
      const Worker = navigator.serviceWorker;

      // if there is a worker waiting and installed
      if (registration.waiting && "installed" === registration.waiting.state) {
        return informUser();
      }

      // Listen worker update
      listenWorkerUpdate(registration);

      // force worker update
      registration.update();
    });
  });
}

function listenWorkerUpdate(_registration) {
  _registration.addEventListener("updatefound", () => {
    const newWorker = _registration.installing;
    // listen changing state of new worker
    newWorker.addEventListener("statechange", () => {
      if ("installed" === newWorker.state) {
        informUser();
      }
    });
  });
}

function informUser() {
  listenWorkerControllerChange();
  sendMessageToWorker("skipWaiting");
}

function listenWorkerControllerChange() {
  Worker.addEventListener("controllerchange", () => {
    window.alert(
      `Une nouvelle mise à jour est disponible, la page de votre navigateur va être actualisée pour finaliser la procédure.`
    );
    window.location.reload();
  });
}

function sendMessageToWorker(_message) {
  Worker.getRegistration().then(registration => {
    registration.waiting.postMessage(_message);
  });
}
