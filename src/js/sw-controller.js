if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(registration => {
      window.console.log(
        `Service Worker registered! Scope: ${registration.scope}`
      );
      registration.update();
      window.console.info(`Service Worker updated!`);
      
      if(registration.waiting && 'installed' === registration.waiting.state){
        return askUser();
      }

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        newWorker.addEventListener("statechange", () => {
          window.console.log("App: Nouvel état :", newWorker.state);

          if ("installed" === newWorker.state) {
            askUser();
          }
        });
      });
    });
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.log("controller change");
    window.alert(
        `La nouvelle mise à jour a bien été activé 
(la page de votre navigateur va être actualisé pour finaliser la procédure.)`
      );
      window.location.reload();
  });

  function askUser(){
    let userChoice = confirm(`Une nouvelle mise à jour est disponible.
Voulez-vous l'activer ?`);
            if (userChoice) {
              navigator.serviceWorker.getRegistration().then(registration => {
                registration.waiting.postMessage("skipWaiting");
              });
            }
  }
}
