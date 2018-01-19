import {tv} from './tv';

const c = console.log,
  d = document,
  n = navigator,
  w = window

export const pwa = () => {
  //Service Workerra erregistratu
  if ( 'serviceWorker' in n ) {
    n.serviceWorker.register('./sw.js')
    .then( registration => {
      c('Service Worker erregistratua', registration.scope)
    })
    .catch( err => c(`Registro de Service Worker fallido`, err) )
  }
}

export const isOnline = () => {
  //Konexioaren egoera (online/offline)
  const metaTagTheme = d.querySelector('meta[name=theme-color]')

  function networkStatus (e) {

    if ( n.onLine ) {
      metaTagTheme.setAttribute('content', '#ffffff')
      d.querySelector(".main-footer__status").classList.remove("offline")
      d.querySelector(".offline").innerHTML = ""
    } else {
      metaTagTheme.setAttribute('content', '#c9c9c9')
      d.querySelector(".main-footer__status").classList.add("offline")
      d.querySelector(".offline").innerHTML = "<div class='text'>Sarea berreskuratzen...</div>"
    }
  }

  w.addEventListener('online', networkStatus)
  w.addEventListener('offline', networkStatus)
}

const reloadApp = setInterval(() => {
  //Aplikazioa/leihoa eguneratu
  if ( d.readyState  === 'complete' ) {
    clearInterval(reloadApp)
    d.getElementById("reload-app").addEventListener('click', (e) => {
      location.reload()
    })
  }
})

export const init = (data) => {

  return `
  <header class="main-header">
    <div class="main-header__cols">
      <img src="./assets/eitb-logo-blue.svg" alt="Nahieran" class="main-header__logo" id="reload-app">
      <span class="main-header__slogan">nahieran</span>
    </div>
    <div class="main-header__cols right">
      <div class="nav-icon" id="categories-btn">
      	<div class="nav-icon__bar"></div>
      	<div class="nav-icon__bar"></div>
      	<div class="nav-icon__bar"></div>
      </div>
    </div>
  </header>

  ${tv()}

  <footer class="main-footer">
    <div class="main-footer__status"></div>
    <div class="main-footer__row">
      <div class="main-footer__col-logo">
      	<img src="./assets/eitb-logo-white.svg" alt="eitb nahieran" class="main-footer__logo">
      	<div class="main-footer__text">Azken eguneraketa:
      		<span class="saved-date">${localStorage.getItem("jsonDate")}</span>
      	</div>
      </div>
      <div class="main-footer__col-btn deleteStorage">
      	<img src="./assets/reload.svg" alt="Datuak eguneratu" class="main-footer__reload">
      </div>
    </div>

    <div class="main-footer__row">
      <div class="main-footer__powered-by">
      	PWA garapena <a onclick="window.location='https://twitter.com/asiermusa'" href="#">@asiermusa</a> |
      	eitb APIa <a onclick="window.location='https://twitter.com/erralin'" href="#">@erralin</a>
      </div>
    </div>
  </footer>
  `
}
