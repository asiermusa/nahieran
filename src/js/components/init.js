import {tv} from './tv';
import {deleteContent} from './tv';
import {categories} from './categories'
import {selectProgram} from './tvProgram'
import {selectEpisode} from './tvProgramEpisode'
import {categoriesSingle} from './categoriesSingle'

const c = console.log,
  d = document,
  n = navigator,
  w = window

export const pwa = () => {
  //Service Workerra erregistratu
  if ( 'serviceWorker' in n && n.userAgent.indexOf("Firefox") === -1 ) { //Exkluitu firefox SW erregistrotik
    n.serviceWorker.register('./sw.js')

    .then( registration => {
      c('Service Worker erregistratua', registration.scope)
    })
    .catch( err => c('Registro de Service Worker fallido', err) )
  }
}

export const isOnline = () => {
  //Konexioaren egoera (online/offline)
  const metaTagTheme = d.querySelector('meta[name=theme-color]')

  function networkStatus (e) {

    if ( n.onLine ) {
      metaTagTheme.setAttribute('content', '#ffffff')
      d.querySelector(".offline").innerHTML = ""
      d.querySelector(".main-footer__status").classList.remove("offline")
    } else {
      metaTagTheme.setAttribute('content', '#c9c9c9')
      d.querySelector(".main-footer__status").classList.add("offline")
      d.querySelector(".offline").innerHTML = "<div class='text'>Sarea berreskuratzen...</div>"
    }
  }

  w.addEventListener('online', networkStatus)
  w.addEventListener('offline', networkStatus)
}

export const ga = () => {
  const _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-112999166-1']);
  _gaq.push(['_setDomainName', 'asiermusa.github.io/nahieran']);
  _gaq.push(['_trackPageview']);
  (function(){
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
}

export const init = () => {
  
  const readyState = setInterval(() => {
    //Aplikazioa/leihoa eguneratu
    if ( d.readyState  === 'complete' ) {
      clearInterval(readyState)
      d.getElementById("reload-app").addEventListener('click', (e) => {
        deleteContent()
      })
    }
  }, 100 )
  
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
  ${categories()}
  ${selectProgram()}
  ${selectEpisode()}
  ${categoriesSingle()}
    
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
