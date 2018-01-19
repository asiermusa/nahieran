(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var c = console.log,
    d = document,
    n = navigator,
    w = window;

var categories = exports.categories = function categories() {

  var readyState = setInterval(function () {

    if (d.readyState === 'complete') {

      clearInterval(readyState);

      var tpl = '';

      //Nabigazio botoia
      d.getElementById("categories-btn").addEventListener('click', function (e) {
        d.querySelector('.off-canvas-menu').classList.toggle('is-open');

        //Kategorian ikonoa (menu off-canvas)
        if (d.querySelector('.nav-icon').classList.contains("is-active")) {
          d.querySelector('.nav-icon').classList.remove('is-active');
        } else {
          d.querySelector('.nav-icon').classList.add('is-active');
        }
      });
      //scape tekla bidez itxi menua
      d.addEventListener('keyup', function (e) {
        if (e.keyCode == 27) {
          d.querySelector('.off-canvas-menu').classList.remove('is-open');
          d.querySelector('.nav-icon').classList.remove('is-active');
        }
      });

      //Beharrezko sekzioak ezkutatu
      d.querySelectorAll('.section').forEach(function (section) {
        section.classList.add('u-hide');
      });
      d.querySelector('.categories').classList.remove('u-hide');
      d.querySelector('.tv').classList.remove('u-hide');

      fetch('http://still-castle-99749.herokuapp.com/program-type-list').then(function (response) {
        return response.json();
      }).then(function (json) {

        json.member.forEach(function (jsonCat) {
          tpl += '\n            <li>\n              <a href="#" class="category-id" data-category="' + jsonCat["@id"] + '">\n              \t' + jsonCat.title + '\n              </a>\n            </li>\n            ';
        });

        d.querySelector('.categories__list').innerHTML = tpl;
      }).catch(function (err) {
        return console.log(err);
      });
    } //readyState
  }, 100); //interval

  return '\n    <div class="categories off-canvas-menu">\n      <div class="loader"></div>\n      <ul class="categories__list"></ul>\n    </div>\n    ';
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var c = console.log,
    d = document,
    n = navigator,
    w = window;

var categoriesSingle = exports.categoriesSingle = function categoriesSingle() {

  var readyState = setInterval(function () {

    if (d.readyState === 'complete') {

      //Kategoria zerrenda ekarri
      var fetchCategory = function fetchCategory(data, requestFromBGSync, catName) {

        var tpl = '';

        d.querySelector('.off-canvas-menu').classList.remove('is-open');
        d.querySelector('.nav-icon').classList.remove('is-active');
        //Loader erakutsi
        d.querySelector('.loader-cat').classList.add('loader-show');
        d.querySelector('.loader-template-cat').classList.add('loader-show');
        //Beharrezko sekzioak ezkutatu
        d.querySelectorAll('.section').forEach(function (section) {
          section.classList.add('u-hide');
        });

        fetch(data).then(function (response) {
          return response.json();
        }).then(function (json) {

          if (!requestFromBGSync) {
            localStorage.removeItem('category');
          }

          //Loader ezkutatu
          d.querySelector('.loader-cat').classList.remove('loader-show');
          d.querySelector('.loader-template-cat').classList.remove('loader-show');

          d.querySelector('.single-cat').classList.remove('u-hide');

          json.member.forEach(function (jsonCat) {
            tpl += '\n                <li>\n                  <a href="#" class="program-id" data-program="' + jsonCat["@id"] + '">\n                    ' + jsonCat.title + '\n                    </a>\n                  </li>\n                  ';
          });

          d.querySelector('.single-cat__list').innerHTML = tpl;
          d.querySelector('.single-cat__header').innerHTML = '\n              <div class="tv__title">' + catName + '</div>\n              <span class="tv__number">(' + json.member.length + ')</span> saio erakusten\n              ';
        }).catch(function (err) {
          return console.log(err);
        });
      }; //fetchCategory

      clearInterval(readyState);d.querySelector('.categories__list').addEventListener('click', function (e) {

        e.preventDefault();
        if (d.getElementById("video")) d.getElementById("video").pause();

        if (e.target.classList.contains('category-id')) {

          var data = e.target.getAttribute('data-category'),
              catName = e.target.innerHTML;

          localStorage.setItem('category', data);
          fetchCategory(data, false, catName);

          //Background Sync (kategoria)
          if ('serviceWorker' in n && 'SyncManager' in w) {
            var registerBGSync = function registerBGSync() {
              n.serviceWorker.ready.then(function (registration) {
                return registration.sync.register('nahieran-category').then(function () {
                  return c('Atzeko sinkronizazioa erregistratua');
                }).catch(function (err) {
                  return c('Errorea atzeko sinkronizazioa erregistratzean', err);
                });
              });
            };

            registerBGSync();
          }
        }
      });
      //Background Sync (kategoria)
      n.serviceWorker.addEventListener('message', function (e) {
        console.log('Atzeko sinkronizazioa message bidez aktibatua: ', e.data);
        if (e.data === 'online nahieran-category') fetchCategory(localStorage.getItem('category'), true);
      });
    } //readyState
  }, 100); //interval

  return '\n    <div class="loader-template loader-template-cat">\n    \t<div class="loader loader-cat"></div>\n    </div>\n    <div class="single-cat section u-hide">\n      <header class="section-header tv__header single-cat__header"></header>\n      <ul class="tv__list single-cat__list"></ul>\n    </div>\n    ';
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = exports.isOnline = exports.pwa = undefined;

var _tv = require('./tv');

var c = console.log,
    d = document,
    n = navigator,
    w = window;

var pwa = exports.pwa = function pwa() {
  //Service Workerra erregistratu
  if ('serviceWorker' in n) {
    n.serviceWorker.register('./sw.js').then(function (registration) {
      c('Service Worker erregistratua', registration.scope);
    }).catch(function (err) {
      return c('Registro de Service Worker fallido', err);
    });
  }
};

var isOnline = exports.isOnline = function isOnline() {
  //Konexioaren egoera (online/offline)
  var metaTagTheme = d.querySelector('meta[name=theme-color]');

  function networkStatus(e) {

    if (n.onLine) {
      metaTagTheme.setAttribute('content', '#ffffff');
      d.querySelector(".main-footer__status").classList.remove("offline");
      d.querySelector(".offline").innerHTML = "";
    } else {
      metaTagTheme.setAttribute('content', '#c9c9c9');
      d.querySelector(".main-footer__status").classList.add("offline");
      d.querySelector(".offline").innerHTML = "<div class='text'>Sarea berreskuratzen...</div>";
    }
  }

  w.addEventListener('online', networkStatus);
  w.addEventListener('offline', networkStatus);
};

var reloadApp = setInterval(function () {
  //Aplikazioa/leihoa eguneratu
  if (d.readyState === 'complete') {
    clearInterval(reloadApp);
    d.getElementById("reload-app").addEventListener('click', function (e) {
      location.reload();
    });
  }
});

var init = exports.init = function init(data) {

  return '\n  <header class="main-header">\n    <div class="main-header__cols">\n      <img src="./assets/eitb-logo-blue.svg" alt="Nahieran" class="main-header__logo" id="reload-app">\n      <span class="main-header__slogan">nahieran</span>\n    </div>\n    <div class="main-header__cols right">\n      <div class="nav-icon" id="categories-btn">\n      \t<div class="nav-icon__bar"></div>\n      \t<div class="nav-icon__bar"></div>\n      \t<div class="nav-icon__bar"></div>\n      </div>\n    </div>\n  </header>\n\n  ' + (0, _tv.tv)() + '\n\n  <footer class="main-footer">\n    <div class="main-footer__status"></div>\n    <div class="main-footer__row">\n      <div class="main-footer__col-logo">\n      \t<img src="./assets/eitb-logo-white.svg" alt="eitb nahieran" class="main-footer__logo">\n      \t<div class="main-footer__text">Azken eguneraketa:\n      \t\t<span class="saved-date">' + localStorage.getItem("jsonDate") + '</span>\n      \t</div>\n      </div>\n      <div class="main-footer__col-btn deleteStorage">\n      \t<img src="./assets/reload.svg" alt="Datuak eguneratu" class="main-footer__reload">\n      </div>\n    </div>\n\n    <div class="main-footer__row">\n      <div class="main-footer__powered-by">\n      \tPWA garapena <a onclick="window.location=\'https://twitter.com/asiermusa\'" href="#">@asiermusa</a> |\n      \teitb APIa <a onclick="window.location=\'https://twitter.com/erralin\'" href="#">@erralin</a>\n      </div>\n    </div>\n  </footer>\n  ';
};

},{"./tv":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tv = undefined;

var _categories = require('./categories');

var _tvProgram = require('./tvProgram');

var _tvProgramEpisode = require('./tvProgramEpisode');

var _categoriesSingle = require('./categoriesSingle');

var c = console.log,
    d = document,
    n = navigator,
    w = window;

var filtering = function filtering(ul) {

  d.getElementById('find-programs').addEventListener('keyup', function (e) {

    var json = JSON.parse(localStorage.getItem('localJson')),
        lista = null,
        tpl = '';

    lista = json.member.filter(function (list) {
      return list.title.toLowerCase().includes(e.target.value.toLowerCase());
    });

    lista.forEach(function (json) {
      tpl += '\n      <li>\n        <a href="#" class="program-id" data-program="' + json["@id"] + '">\n        ' + json.title + '\n        </a>\n      </li>\n      ';
    });

    d.querySelector(ul).innerHTML = tpl;
    d.querySelector('.tv__header').innerHTML = '<span class="tv__number">' + lista.length + '</span> saio erakusten';
  });
};

var tv = exports.tv = function tv() {

  var readyState = setInterval(function () {

    if (d.readyState === 'complete') {

      //Programa erakutsi (buklea)
      var getPrograms = function getPrograms(json) {

        var tpl = '';

        JSON.parse(json).member.forEach(function (json) {

          tpl += '\n            <li>\n              <a href="#" class="program-id" data-program="' + json["@id"] + '">\n                ' + json.title + '\n              </a>\n            </li>\n            ';
        });

        d.querySelector('.tv__list').innerHTML = tpl;
        d.querySelector('.tv__header').innerHTML = 'Saio guztiak erakusten <span class="tv__number">(' + JSON.parse(json).member.length + ')</span>';
        //Loader ezkutatu
        d.querySelector('.loader-tv').classList.remove('loader-show');
        d.querySelector('.loader-template-tv').classList.remove('loader-show');
        //Footerrean APIaren eguneraketa data bistaratu
        d.querySelector('.main-footer__text').classList.add('is-cache');
      };

      //Programak ekarri


      var fetchAllPrograms = function fetchAllPrograms(data, requestFromBGSync, reset) {

        var tpl = '';

        //Loader erakutsi
        d.querySelector('.loader-template-tv').classList.add('loader-show');
        d.querySelector('.loader-tv').classList.add('loader-show');
        //Beharrezko sekzioak ezkutatu
        d.querySelectorAll('.section').forEach(function (section) {
          section.classList.add('u-hide');
        });
        d.querySelector('.categories').classList.remove('u-hide');
        d.querySelector('.tv').classList.remove('u-hide');

        //APIa deitu behar bada...
        if (reset) {

          fetch(data).then(function (response) {
            return response.json();
          }).then(function (json) {

            if (!requestFromBGSync) {
              localStorage.removeItem('tv');
            }

            localStorage.setItem('localJson', JSON.stringify(json));

            var savedDate = new Date(),
                date = savedDate.getFullYear() + '/' + ('0' + (savedDate.getMonth() + 1)).slice(-2) + '/' + ('0' + savedDate.getDate()).slice(-2) + ' - ',
                time = ('0' + savedDate.getHours()).slice(-2) + ":" + ('0' + savedDate.getMinutes()).slice(-2),
                dateTime = date + ' ' + time;

            localStorage.setItem("jsonDate", dateTime);
            d.querySelector('.saved-date').innerHTML = localStorage.getItem("jsonDate");

            getPrograms(localStorage.getItem('localJson'));

            //Notifikazio bidez ohartarazi
            if (w.Notification && Notification.permission !== 'denied') {
              Notification.requestPermission(function (status) {
                console.log(status);
                var n = new Notification('Nahieran', {
                  body: 'Programa zerrenda eguneratu da :)',
                  icon: './assets/favicon.png'
                });
              });
            }
          }).catch(function (err) {
            localStorage.setItem('tv', data);
          });

          //Programak local-ean gordeta badago
        } else {
          getPrograms(data);
        }
      }; //fetchAllPrograms

      //Filtroa egin


      clearInterval(readyState);filtering('.tv__list');

      //Gordetako APIa ezabatu eta berria ekartzeko - EZABATU
      d.querySelector('.deleteStorage').addEventListener('click', function (e) {

        e.preventDefault();
        if (confirm('Programa zerrenda eguneratu nahi al duzu?') == true) {
          localStorage.removeItem('localJson');
          localStorage.removeItem('jsonDate');

          //Bideo martxan badago ere, geratu
          d.getElementById("video").pause();

          var reset = true,
              data = 'http://still-castle-99749.herokuapp.com/playlist';

          localStorage.setItem('tv', data);

          fetchAllPrograms(data, false, reset);

          //Background Sync (programak)
          if ('serviceWorker' in n && 'SyncManager' in w) {
            var registerBGSync = function registerBGSync() {
              n.serviceWorker.ready.then(function (registration) {
                return registration.sync.register('nahieran-tv').then(function () {
                  return c('Atzeko sinkronizazioa erregistratua');
                }).catch(function (err) {
                  return c('Errorea atzeko sinkronizazioa erregistratzean', err);
                });
              });
            };

            registerBGSync();
          }
        }
      });

      //Aplikaziora sartzen denean egin beharrekoa (APIa deitu edo ez)
      if (localStorage.getItem('localJson')) {
        fetchAllPrograms(localStorage.getItem('localJson'), false, false);
      } else {
        var reset = true,
            data = 'http://still-castle-99749.herokuapp.com/playlist';

        localStorage.setItem('tv', data);

        fetchAllPrograms(data, false, reset);

        //Background Sync (programak)
        if ('serviceWorker' in n && 'SyncManager' in w) {
          var registerBGSync = function registerBGSync() {
            n.serviceWorker.ready.then(function (registration) {
              return registration.sync.register('nahieran-tv').then(function () {
                return c('Sincronizaci�n de Fondo Registrada');
              }).catch(function (err) {
                return c('Fallo la Sincronizaci�n de Fondo', err);
              });
            });
          };

          registerBGSync();
        }
      }
      //Background Sync (programak)
      n.serviceWorker.addEventListener('message', function (e) {
        c('Atzeko sinkronizazioa message bidez: ', e.data);
        if (e.data === 'online nahieran-tv') fetchAllPrograms(localStorage.getItem('tv'), true, false);
      });
    } //readyState
  }, 100); //interval

  return '\n    ' + (0, _categories.categories)() + '\n    <div class="tv section">\n      <div class="tv__form">\n        <input type="text" id="find-programs" class="tv__input" placeholder="eitbko saioen artean bilatu..." title="Saioak bilatu">\n      </div>\n      <header class="section-header tv__header"></header>\n      <ul class="tv__list"></ul>\n      <div class="loader-template loader-template-tv">\n        <div class="loader loader-tv"></div>\n      </div>\n    </div>\n    ' + (0, _tvProgram.selectProgram)() + '\n    ' + (0, _tvProgramEpisode.selectEpisode)() + '\n    ' + (0, _categoriesSingle.categoriesSingle)() + '\n    ';
};

},{"./categories":1,"./categoriesSingle":2,"./tvProgram":5,"./tvProgramEpisode":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var c = console.log,
    d = document,
    n = navigator,
    w = window;

var selectProgram = exports.selectProgram = function selectProgram() {

  var ajaxLoading = setInterval(function () {

    if (d.readyState === 'complete') {

      //Programa ekarri (zerrenda)
      var fetchProgram = function fetchProgram(data, requestFromBGSync) {

        var tpl = '',
            date = '';

        //Beharrezko sekzioak ezkutatu
        d.querySelectorAll('.section').forEach(function (section) {
          section.classList.add('u-hide');
        });

        //Loader erakutsi
        d.querySelector('.loader-program').classList.add('loader-show');
        d.querySelector('.loader-template-program').classList.add('loader-show');

        fetch(data).then(function (response) {
          return response.json();
        }).then(function (json) {

          if (!requestFromBGSync) {
            localStorage.removeItem('tv-program');
          }

          d.querySelector('.program').classList.remove('u-hide');
          //Loader ezkutatu
          d.querySelector('.loader-program').classList.remove('loader-show');
          d.querySelector('.loader-template-program').classList.remove('loader-show');

          json.member.forEach(function (json) {
            if (json.broadcast_date) {
              date = json.broadcast_date.slice(0, 10);
            }
            tpl += '\n                <li class="custom-episode" data-episode="' + json["@id"] + '">\n      \t\t\t\t\t  <div class="program__image">\n                    <img src="' + json.episode_image + '" class="program__img custom-episode" data-episode="' + json["@id"] + '">\n                  </div>\n  \t\t\t\t\n                  <div class="program__content custom-episode" data-episode="' + json["@id"] + '">\n                    ' + json.title + '\n                  <div class="program__date">' + date + '</div>\n                  </div>\n                </li>\n                ';
          });

          d.querySelector('.program__list').innerHTML = tpl;
          d.querySelector('.program__header').innerHTML = '\n          \t\t<div class="program__title">' + json.name + '</div>\n              <div class="program__desc">' + json.desc_group + '</div>\n              ';
        }).catch(function (err) {
          return console.log(err);
        });
      };

      clearInterval(ajaxLoading);

      d.getElementById("app").addEventListener('click', function (e) {

        e.preventDefault();
        if (e.target.classList.contains('program-id')) {

          var data = e.target.getAttribute('data-program');

          localStorage.setItem('tv-program', data);

          fetchProgram(data, false);

          //Background Sync (programak)
          if ('serviceWorker' in n && 'SyncManager' in w) {
            var registerBGSync = function registerBGSync() {
              n.serviceWorker.ready.then(function (registration) {
                return registration.sync.register('nahieran-tv-program').then(function () {
                  return c('Atzeko sinkronizazioa erregistratua');
                }).catch(function (err) {
                  return c('Errorea atzeko sinkronizazioa erregistratzean', err);
                });
              });
            };

            registerBGSync();
          }
        }
      });
      //Background Sync (programak)
      n.serviceWorker.addEventListener('message', function (e) {
        console.log('Atzeko sinkronizazioa message bidez aktibatua: ', e.data);
        if (e.data === 'online nahieran-tv-program') fetchProgram(localStorage.getItem('tv-program'), true);
      });
    } //readyState
  }, 100); //interval

  return '\n    <div class="loader-template loader-template-program">\n  \t  <div class="loader loader-program"></div>\n    </div>\n    <div class="program section u-hide">\n  \t  <header class="section-header program__header"></header>\n      <ul class="program__list"></ul>\n    </div>\n    ';
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var c = console.log,
    d = document,
    n = navigator,
    w = window;

var selectEpisode = exports.selectEpisode = function selectEpisode() {

  var readyState = setInterval(function () {

    if (d.readyState === 'complete') {

      //episode kargatu
      var fetchEpisode = function fetchEpisode(data, requestFromBGSync) {

        var tpl = '';
        //Loader erakutsi
        d.querySelector('.loader-episode').classList.add('loader-show');
        d.querySelector('.loader-template-episode').classList.add('loader-show');

        //Beharrezko sekzioak ezkutatu
        d.querySelectorAll('.section').forEach(function (section) {
          section.classList.add('u-hide');
        });

        //APIa deitu (episode)
        fetch(data).then(function (response) {
          return response.json();
        }).then(function (json) {

          d.querySelector('.episode').classList.remove('u-hide');

          if (!requestFromBGSync) {
            localStorage.removeItem('tv-program-episode');
          }

          //Loader ezkutatu
          d.querySelector('.loader-episode').classList.remove('loader-show');
          d.querySelector('.loader-template-episode').classList.remove('loader-show');

          var urlEnd = json.url.slice(-3);

          if (urlEnd === 'mp4') {
            urlEnd = json.url;
          } else {
            urlEnd = json.formats[7].url;
          }

          tpl = '\n              <div class="episode__video">\n                <video id="video" autoplay width="100%" height="100%" controls poster="' + json.thumbnails[0].url + '">\n                  <source src="' + urlEnd + '" type="video/mp4">\n                  Zure nabigaztaileak ezin du bideorik erakutsi :(\n                </video>\n              </div>\n              ';
          d.querySelector('.episode__play').innerHTML = tpl;
          d.querySelector('.episode__header').innerHTML = '\n              <div class="episode__title">' + json.title + '</div>\n              <div class="episode__desc">' + json.description + '</div>\n              ';
        }).catch(function (err) {
          localStorage.setItem('tv-program-episode', data);
          d.querySelector('.episode__play').innerHTML = '<div class="error">Konexioak huts egin du</div>';
        });
      }; //fetchEpisode

      //Programa zerrendatik episode ekarri (click)


      clearInterval(readyState);

      //Atzera joan (programetara)
      d.getElementById('episode__back').addEventListener('click', function (e) {
        //Beharrezko sekzioak ezkutatu
        d.querySelectorAll('.section').forEach(function (section) {
          section.classList.add('u-hide');
          d.getElementById("video").pause();
        });
        d.querySelector('.program').classList.remove('u-hide');
      });d.querySelector('.program__list').addEventListener('click', function (e) {
        e.preventDefault();

        if (e.target.classList.contains('custom-episode')) {

          var data = e.target.getAttribute('data-episode');

          localStorage.setItem('tv-program-episode', data);
          fetchEpisode(data, false);

          //Background Sync (episode)
          if ('serviceWorker' in n && 'SyncManager' in w) {
            var registerBGSync = function registerBGSync() {
              n.serviceWorker.ready.then(function (registration) {
                return registration.sync.register('nahieran-tv-program-episode').then(function () {
                  return c('Atzeko sinkronizazioa erregistratua');
                }).catch(function (err) {
                  return c('Errorea atzeko sinkronizazioa erregistratzean', err);
                });
              });
            };

            registerBGSync();
          }
        }
      });
      //Background Sync (episode)
      n.serviceWorker.addEventListener('message', function (e) {
        c('Atzeko sinkronizazioa message bidez: ', e.data);
        if (e.data === 'online nahieran-tv-program-episode') fetchEpisode(localStorage.getItem('tv-program-episode'), true);
      });
    } //readyState
  }, 100); //interval

  return '\n    <div class="loader-template loader-template-episode">\n      <div class="loader loader-episode"></div>\n    </div>\n    \n    <div class="episode section u-hide">\n      <header class="section-header episode__header"></header>\n      <div class="episode__play"></div>\n      <div class="episode__nav"><a href="#" id="episode__back">< Atzera</a></div>\n    </div>\n    ';
};

},{}],7:[function(require,module,exports){
'use strict';

var _init = require('./components/init');

document.getElementById('app').innerHTML = (0, _init.init)();

//Aplikzioa web progresiboa erregistratu
(0, _init.pwa)();

//Online/ffline gauden zehaztu
(0, _init.isOnline)();

},{"./components/init":3}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29tcG9uZW50cy9jYXRlZ29yaWVzLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2F0ZWdvcmllc1NpbmdsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2luaXQuanMiLCJzcmMvanMvY29tcG9uZW50cy90di5qcyIsInNyYy9qcy9jb21wb25lbnRzL3R2UHJvZ3JhbS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3R2UHJvZ3JhbUVwaXNvZGUuanMiLCJzcmMvanMvc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFNLElBQUksUUFBUSxHQUFsQjtBQUFBLElBQ0UsSUFBSSxRQUROO0FBQUEsSUFFRSxJQUFJLFNBRk47QUFBQSxJQUdFLElBQUksTUFITjs7QUFLTyxJQUFNLGtDQUFhLFNBQWIsVUFBYSxHQUFNOztBQUU5QixNQUFNLGFBQWEsWUFBWSxZQUFNOztBQUVuQyxRQUFLLEVBQUUsVUFBRixLQUFrQixVQUF2QixFQUFvQzs7QUFFbEMsb0JBQWMsVUFBZDs7QUFFQSxVQUFJLE1BQU0sRUFBVjs7QUFFQTtBQUNBLFFBQUUsY0FBRixDQUFpQixnQkFBakIsRUFBbUMsZ0JBQW5DLENBQW9ELE9BQXBELEVBQTZELFVBQUMsQ0FBRCxFQUFPO0FBQ2xFLFVBQUUsYUFBRixDQUFnQixrQkFBaEIsRUFBb0MsU0FBcEMsQ0FBOEMsTUFBOUMsQ0FBcUQsU0FBckQ7O0FBRUE7QUFDQSxZQUFJLEVBQUUsYUFBRixDQUFnQixXQUFoQixFQUE2QixTQUE3QixDQUF1QyxRQUF2QyxDQUFnRCxXQUFoRCxDQUFKLEVBQWlFO0FBQy9ELFlBQUUsYUFBRixDQUFnQixXQUFoQixFQUE2QixTQUE3QixDQUF1QyxNQUF2QyxDQUE4QyxXQUE5QztBQUNELFNBRkQsTUFFTTtBQUNKLFlBQUUsYUFBRixDQUFnQixXQUFoQixFQUE2QixTQUE3QixDQUF1QyxHQUF2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QUFYOztBQUVBLHVCQUFhLE9BQWIsQ0FBcUIsb0JBQXJCLEVBQTJDLElBQTNDO0FBQ0EsdUJBQWEsSUFBYixFQUFtQixLQUFuQjs7QUFFQTtBQUNBLGNBQUssbUJBQW1CLENBQW5CLElBQXdCLGlCQUFpQixDQUE5QyxFQUFrRDtBQUFBLGdCQUN2QyxjQUR1QyxHQUNoRCxTQUFTLGNBQVQsR0FBMkI7QUFDekIsZ0JBQUUsYUFBRixDQUFnQixLQUFoQixDQUNDLElBREQsQ0FDTSx3QkFBZ0I7QUFDcEIsdUJBQU8sYUFBYSxJQUFiLENBQWtCLFFBQWxCLENBQTJCLDZCQUEzQixFQUNKLElBREksQ0FDRTtBQUFBLHlCQUFNLEVBQUUscUNBQUYsQ0FBTjtBQUFBLGlCQURGLEVBRUosS0FGSSxDQUVHO0FBQUEseUJBQU8sRUFBRSwrQ0FBRixFQUFtRCxHQUFuRCxDQUFQO0FBQUEsaUJBRkgsQ0FBUDtBQUdELGVBTEQ7QUFNRCxhQVIrQzs7QUFTaEQ7QUFDRDtBQUNGO0FBQ0YsT0F2QkQ7QUF3QkE7QUFDQSxRQUFFLGFBQUYsQ0FBZ0IsZ0JBQWhCLENBQWlDLFNBQWpDLEVBQTRDLGFBQUs7QUFDL0MsVUFBRSx1Q0FBRixFQUEyQyxFQUFFLElBQTdDO0FBQ0EsWUFBSSxFQUFFLElBQUYsS0FBVyxvQ0FBZixFQUNFLGFBQWEsYUFBYSxPQUFiLENBQXFCLG9CQUFyQixDQUFiLEVBQXlELElBQXpEO0FBQ0gsT0FKRDtBQU1ELEtBeEdrQyxDQXdHakM7QUFDSCxHQXpHa0IsRUF5R2hCLEdBekdnQixDQUFuQixDQUZpQyxDQTJHekI7O0FBRVI7QUFXRCxDQXhITTs7Ozs7QUNMUDs7QUFFQSxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsRUFBK0IsU0FBL0IsR0FBMkMsaUJBQTNDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBjID0gY29uc29sZS5sb2csXG4gIGQgPSBkb2N1bWVudCxcbiAgbiA9IG5hdmlnYXRvcixcbiAgdyA9IHdpbmRvd1xuXG5leHBvcnQgY29uc3QgY2F0ZWdvcmllcyA9ICgpID0+IHtcblxuICBjb25zdCByZWFkeVN0YXRlID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICBcbiAgICBpZiAoIGQucmVhZHlTdGF0ZSAgPT09ICdjb21wbGV0ZScgKSB7XG4gICAgXG4gICAgICBjbGVhckludGVydmFsKHJlYWR5U3RhdGUpXG4gICAgICBcbiAgICAgIGxldCB0cGwgPSAnJ1xuICAgICAgXG4gICAgICAvL05hYmlnYXppbyBib3RvaWFcbiAgICAgIGQuZ2V0RWxlbWVudEJ5SWQoXCJjYXRlZ29yaWVzLWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLm9mZi1jYW52YXMtbWVudScpLmNsYXNzTGlzdC50b2dnbGUoJ2lzLW9wZW4nKVxuICAgICAgXG4gICAgICAgIC8vS2F0ZWdvcmlhbiBpa29ub2EgKG1lbnUgb2ZmLWNhbnZhcylcbiAgICAgICAgaWYoIGQucXVlcnlTZWxlY3RvcignLm5hdi1pY29uJykuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaXMtYWN0aXZlXCIpKXtcbiAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5uYXYtaWNvbicpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5uYXYtaWNvbicpLmNsYXNzTGlzdC5hZGQoJ2lzLWFjdGl2ZScpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAvL3NjYXBlIHRla2xhIGJpZGV6IGl0eGkgbWVudWFcbiAgICAgIGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09IDI3KSB7XG4gICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcub2ZmLWNhbnZhcy1tZW51JykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3BlbicpXG4gICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubmF2LWljb24nKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgXG4gICAgICAvL0JlaGFycmV6a28gc2VremlvYWsgZXprdXRhdHVcbiAgICAgIGQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24nKS5mb3JFYWNoKCBzZWN0aW9uID0+IHtcbiAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCd1LWhpZGUnKVxuICAgICAgfSlcbiAgICAgIGQucXVlcnlTZWxlY3RvcignLmNhdGVnb3JpZXMnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKCcudHYnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuICAgICAgXG4gICAgICBmZXRjaCgnaHR0cDovL3N0aWxsLWNhc3RsZS05OTc0OS5oZXJva3VhcHAuY29tL3Byb2dyYW0tdHlwZS1saXN0JylcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSApXG4gICAgICAgIC50aGVuKGpzb24gPT4ge1xuICAgICAgXG4gICAgICAgICAganNvbi5tZW1iZXIuZm9yRWFjaChqc29uQ2F0ID0+IHtcbiAgICAgICAgICAgIHRwbCArPSBgXG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJjYXRlZ29yeS1pZFwiIGRhdGEtY2F0ZWdvcnk9XCIke2pzb25DYXRbXCJAaWRcIl19XCI+XG4gICAgICAgICAgICAgIFx0JHtqc29uQ2F0LnRpdGxlfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgYFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yaWVzX19saXN0JykuaW5uZXJIVE1MID0gdHBsXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSlcbiAgICBcbiAgICB9IC8vcmVhZHlTdGF0ZVxuICBcbiAgfSwgMTAwICkvL2ludGVydmFsXG4gIFxuICByZXR1cm4gYFxuICAgIDxkaXYgY2xhc3M9XCJjYXRlZ29yaWVzIG9mZi1jYW52YXMtbWVudVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImxvYWRlclwiPjwvZGl2PlxuICAgICAgPHVsIGNsYXNzPVwiY2F0ZWdvcmllc19fbGlzdFwiPjwvdWw+XG4gICAgPC9kaXY+XG4gICAgYFxufVxuIiwiY29uc3QgYyA9IGNvbnNvbGUubG9nLFxuICBkID0gZG9jdW1lbnQsXG4gIG4gPSBuYXZpZ2F0b3IsXG4gIHcgPSB3aW5kb3dcblxuZXhwb3J0IGNvbnN0IGNhdGVnb3JpZXNTaW5nbGUgPSAoKSA9PiB7XG5cbiAgY29uc3QgcmVhZHlTdGF0ZSA9IHNldEludGVydmFsKCgpID0+IHtcblxuICAgIGlmICggZC5yZWFkeVN0YXRlICA9PT0gJ2NvbXBsZXRlJyApIHtcblxuICAgICAgY2xlYXJJbnRlcnZhbChyZWFkeVN0YXRlKVxuICAgICAgXG4gICAgICAvL0thdGVnb3JpYSB6ZXJyZW5kYSBla2FycmlcbiAgXHQgIGZ1bmN0aW9uIGZldGNoQ2F0ZWdvcnkoZGF0YSwgcmVxdWVzdEZyb21CR1N5bmMsIGNhdE5hbWUpIHtcblx0XHQgIFx0XG5cdFx0ICBcdGxldCB0cGwgPSAnJ1xuICAgICAgICAgICAgICBcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcub2ZmLWNhbnZhcy1tZW51JykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3BlbicpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLm5hdi1pY29uJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJylcbiAgICAgICAgLy9Mb2FkZXIgZXJha3V0c2lcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLWNhdCcpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXRlbXBsYXRlLWNhdCcpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgLy9CZWhhcnJlemtvIHNla3ppb2FrIGV6a3V0YXR1XG4gICAgICAgIGQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24nKS5mb3JFYWNoKCBzZWN0aW9uID0+IHtcbiAgICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ3UtaGlkZScpXG4gICAgICAgIH0pXG4gICAgICAgIFxuICAgICAgICBmZXRjaChkYXRhKVxuICAgICAgICAgIC50aGVuKCByZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkgKVxuICAgICAgICAgIC50aGVuKGpzb24gPT4ge1xuXG4gICAgICAgICAgICBpZiAoICFyZXF1ZXN0RnJvbUJHU3luYyApIHtcbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2NhdGVnb3J5JylcbiAgICAgIFx0XHRcdH1cbiAgICAgIFx0XHRcbiAgICAgICAgICAgIC8vTG9hZGVyIGV6a3V0YXR1XG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItY2F0JykuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNob3cnKVxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXRlbXBsYXRlLWNhdCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zaG93JykgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5zaW5nbGUtY2F0JykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcbiAgXHRcdCAgXG4gICAgICAgIFx0XHRqc29uLm1lbWJlci5mb3JFYWNoKGpzb25DYXQgPT4ge1xuICAgICAgICAgICAgICB0cGwgKz0gYFxuICAgICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJwcm9ncmFtLWlkXCIgZGF0YS1wcm9ncmFtPVwiJHtqc29uQ2F0W1wiQGlkXCJdfVwiPlxuICAgICAgICAgICAgICAgICAgICAke2pzb25DYXQudGl0bGV9XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICB9KVxuICBcbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLnNpbmdsZS1jYXRfX2xpc3QnKS5pbm5lckhUTUwgPSB0cGxcbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLnNpbmdsZS1jYXRfX2hlYWRlcicpLmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInR2X190aXRsZVwiPiR7Y2F0TmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0dl9fbnVtYmVyXCI+KCR7anNvbi5tZW1iZXIubGVuZ3RofSk8L3NwYW4+IHNhaW8gZXJha3VzdGVuXG4gICAgICAgICAgICAgIGBcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSlcbiAgICAgICAgICBcbiAgICAgIH0gLy9mZXRjaENhdGVnb3J5XG5cbiAgICAgIGQucXVlcnlTZWxlY3RvcignLmNhdGVnb3JpZXNfX2xpc3QnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGlmKCBkLmdldEVsZW1lbnRCeUlkKFwidmlkZW9cIikpIFxuICAgICAgICAgIGQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWRlb1wiKS5wYXVzZSgpXG5cdFx0ICBcbiAgICAgICAgaWYoIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2F0ZWdvcnktaWQnKSApIHtcblx0ICBcbiAgICAgICAgICBsZXQgZGF0YSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1jYXRlZ29yeScpLFxuICAgICAgICAgICAgY2F0TmFtZSA9IGUudGFyZ2V0LmlubmVySFRNTFxuICAgICAgICAgIFxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYXRlZ29yeScsIGRhdGEpXG4gICAgICAgICAgZmV0Y2hDYXRlZ29yeSggZGF0YSwgZmFsc2UsIGNhdE5hbWUpICBcbiAgICAgICAgICBcbiAgICAgICAgICAvL0JhY2tncm91bmQgU3luYyAoa2F0ZWdvcmlhKVxuICAgICAgICAgIGlmICggJ3NlcnZpY2VXb3JrZXInIGluIG4gJiYgJ1N5bmNNYW5hZ2VyJyBpbiB3ICkge1xuICAgICAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJCR1N5bmMgKCkge1xuICAgICAgICAgICAgICBuLnNlcnZpY2VXb3JrZXIucmVhZHlcbiAgICAgICAgICAgICAgLnRoZW4ocmVnaXN0cmF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uLnN5bmMucmVnaXN0ZXIoJ25haGllcmFuLWNhdGVnb3J5JylcbiAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4gYygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIGVycmVnaXN0cmF0dWEnKSApXG4gICAgICAgICAgICAgICAgLmNhdGNoKCBlcnIgPT4gYygnRXJyb3JlYSBhdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR6ZWFuJywgZXJyKSApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWdpc3RlckJHU3luYygpXG4gICAgICAgICAgfSAgICAgICAgXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAvL0JhY2tncm91bmQgU3luYyAoa2F0ZWdvcmlhKVxuICAgICAgbi5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBlID0+IHtcblx0XHQgICAgY29uc29sZS5sb2coJ0F0emVrbyBzaW5rcm9uaXphemlvYSBtZXNzYWdlIGJpZGV6IGFrdGliYXR1YTogJywgZS5kYXRhKVxuXHRcdCAgICBpZiggZS5kYXRhID09PSAnb25saW5lIG5haGllcmFuLWNhdGVnb3J5Jylcblx0XHQgICAgXHRmZXRjaENhdGVnb3J5KCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2F0ZWdvcnknKSwgdHJ1ZSApXG5cdFx0ICB9KVxuXG4gICAgfSAvL3JlYWR5U3RhdGVcblxuICB9LCAxMDAgKSAvL2ludGVydmFsXG5cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGNsYXNzPVwibG9hZGVyLXRlbXBsYXRlIGxvYWRlci10ZW1wbGF0ZS1jYXRcIj5cbiAgICBcdDxkaXYgY2xhc3M9XCJsb2FkZXIgbG9hZGVyLWNhdFwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzaW5nbGUtY2F0IHNlY3Rpb24gdS1oaWRlXCI+XG4gICAgICA8aGVhZGVyIGNsYXNzPVwic2VjdGlvbi1oZWFkZXIgdHZfX2hlYWRlciBzaW5nbGUtY2F0X19oZWFkZXJcIj48L2hlYWRlcj5cbiAgICAgIDx1bCBjbGFzcz1cInR2X19saXN0IHNpbmdsZS1jYXRfX2xpc3RcIj48L3VsPlxuICAgIDwvZGl2PlxuICAgIGBcbn1cbiIsImltcG9ydCB7dHZ9IGZyb20gJy4vdHYnO1xuXG5jb25zdCBjID0gY29uc29sZS5sb2csXG4gIGQgPSBkb2N1bWVudCxcbiAgbiA9IG5hdmlnYXRvcixcbiAgdyA9IHdpbmRvd1xuXG5leHBvcnQgY29uc3QgcHdhID0gKCkgPT4ge1xuICAvL1NlcnZpY2UgV29ya2VycmEgZXJyZWdpc3RyYXR1XG4gIGlmICggJ3NlcnZpY2VXb3JrZXInIGluIG4gKSB7XG4gICAgbi5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcuL3N3LmpzJylcbiAgICAudGhlbiggcmVnaXN0cmF0aW9uID0+IHtcbiAgICAgIGMoJ1NlcnZpY2UgV29ya2VyIGVycmVnaXN0cmF0dWEnLCByZWdpc3RyYXRpb24uc2NvcGUpXG4gICAgfSlcbiAgICAuY2F0Y2goIGVyciA9PiBjKGBSZWdpc3RybyBkZSBTZXJ2aWNlIFdvcmtlciBmYWxsaWRvYCwgZXJyKSApXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGlzT25saW5lID0gKCkgPT4ge1xuICAvL0tvbmV4aW9hcmVuIGVnb2VyYSAob25saW5lL29mZmxpbmUpXG4gIGNvbnN0IG1ldGFUYWdUaGVtZSA9IGQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPXRoZW1lLWNvbG9yXScpXG5cbiAgZnVuY3Rpb24gbmV0d29ya1N0YXR1cyAoZSkge1xuXG4gICAgaWYgKCBuLm9uTGluZSApIHtcbiAgICAgIG1ldGFUYWdUaGVtZS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnLCAnI2ZmZmZmZicpXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1mb290ZXJfX3N0YXR1c1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwib2ZmbGluZVwiKVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKFwiLm9mZmxpbmVcIikuaW5uZXJIVE1MID0gXCJcIlxuICAgIH0gZWxzZSB7XG4gICAgICBtZXRhVGFnVGhlbWUuc2V0QXR0cmlidXRlKCdjb250ZW50JywgJyNjOWM5YzknKVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKFwiLm1haW4tZm9vdGVyX19zdGF0dXNcIikuY2xhc3NMaXN0LmFkZChcIm9mZmxpbmVcIilcbiAgICAgIGQucXVlcnlTZWxlY3RvcihcIi5vZmZsaW5lXCIpLmlubmVySFRNTCA9IFwiPGRpdiBjbGFzcz0ndGV4dCc+U2FyZWEgYmVycmVza3VyYXR6ZW4uLi48L2Rpdj5cIlxuICAgIH1cbiAgfVxuXG4gIHcuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgbmV0d29ya1N0YXR1cylcbiAgdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgbmV0d29ya1N0YXR1cylcbn1cblxuY29uc3QgcmVsb2FkQXBwID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAvL0FwbGlrYXppb2EvbGVpaG9hIGVndW5lcmF0dVxuICBpZiAoIGQucmVhZHlTdGF0ZSAgPT09ICdjb21wbGV0ZScgKSB7XG4gICAgY2xlYXJJbnRlcnZhbChyZWxvYWRBcHApXG4gICAgZC5nZXRFbGVtZW50QnlJZChcInJlbG9hZC1hcHBcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgbG9jYXRpb24ucmVsb2FkKClcbiAgICB9KVxuICB9XG59KVxuXG5leHBvcnQgY29uc3QgaW5pdCA9IChkYXRhKSA9PiB7XG5cbiAgcmV0dXJuIGBcbiAgPGhlYWRlciBjbGFzcz1cIm1haW4taGVhZGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1haW4taGVhZGVyX19jb2xzXCI+XG4gICAgICA8aW1nIHNyYz1cIi4vYXNzZXRzL2VpdGItbG9nby1ibHVlLnN2Z1wiIGFsdD1cIk5haGllcmFuXCIgY2xhc3M9XCJtYWluLWhlYWRlcl9fbG9nb1wiIGlkPVwicmVsb2FkLWFwcFwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJtYWluLWhlYWRlcl9fc2xvZ2FuXCI+bmFoaWVyYW48L3NwYW4+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1haW4taGVhZGVyX19jb2xzIHJpZ2h0XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibmF2LWljb25cIiBpZD1cImNhdGVnb3JpZXMtYnRuXCI+XG4gICAgICBcdDxkaXYgY2xhc3M9XCJuYXYtaWNvbl9fYmFyXCI+PC9kaXY+XG4gICAgICBcdDxkaXYgY2xhc3M9XCJuYXYtaWNvbl9fYmFyXCI+PC9kaXY+XG4gICAgICBcdDxkaXYgY2xhc3M9XCJuYXYtaWNvbl9fYmFyXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9oZWFkZXI+XG5cbiAgJHt0digpfVxuXG4gIDxmb290ZXIgY2xhc3M9XCJtYWluLWZvb3RlclwiPlxuICAgIDxkaXYgY2xhc3M9XCJtYWluLWZvb3Rlcl9fc3RhdHVzXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX19yb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYWluLWZvb3Rlcl9fY29sLWxvZ29cIj5cbiAgICAgIFx0PGltZyBzcmM9XCIuL2Fzc2V0cy9laXRiLWxvZ28td2hpdGUuc3ZnXCIgYWx0PVwiZWl0YiBuYWhpZXJhblwiIGNsYXNzPVwibWFpbi1mb290ZXJfX2xvZ29cIj5cbiAgICAgIFx0PGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX190ZXh0XCI+QXprZW4gZWd1bmVyYWtldGE6XG4gICAgICBcdFx0PHNwYW4gY2xhc3M9XCJzYXZlZC1kYXRlXCI+JHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImpzb25EYXRlXCIpfTwvc3Bhbj5cbiAgICAgIFx0PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYWluLWZvb3Rlcl9fY29sLWJ0biBkZWxldGVTdG9yYWdlXCI+XG4gICAgICBcdDxpbWcgc3JjPVwiLi9hc3NldHMvcmVsb2FkLnN2Z1wiIGFsdD1cIkRhdHVhayBlZ3VuZXJhdHVcIiBjbGFzcz1cIm1haW4tZm9vdGVyX19yZWxvYWRcIj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX19yb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYWluLWZvb3Rlcl9fcG93ZXJlZC1ieVwiPlxuICAgICAgXHRQV0EgZ2FyYXBlbmEgPGEgb25jbGljaz1cIndpbmRvdy5sb2NhdGlvbj0naHR0cHM6Ly90d2l0dGVyLmNvbS9hc2llcm11c2EnXCIgaHJlZj1cIiNcIj5AYXNpZXJtdXNhPC9hPiB8XG4gICAgICBcdGVpdGIgQVBJYSA8YSBvbmNsaWNrPVwid2luZG93LmxvY2F0aW9uPSdodHRwczovL3R3aXR0ZXIuY29tL2VycmFsaW4nXCIgaHJlZj1cIiNcIj5AZXJyYWxpbjwvYT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Zvb3Rlcj5cbiAgYFxufVxuIiwiaW1wb3J0IHtjYXRlZ29yaWVzfSBmcm9tICcuL2NhdGVnb3JpZXMnO1xuaW1wb3J0IHtzZWxlY3RQcm9ncmFtfSBmcm9tICcuL3R2UHJvZ3JhbSdcbmltcG9ydCB7c2VsZWN0RXBpc29kZX0gZnJvbSAnLi90dlByb2dyYW1FcGlzb2RlJ1xuaW1wb3J0IHtjYXRlZ29yaWVzU2luZ2xlfSBmcm9tICcuL2NhdGVnb3JpZXNTaW5nbGUnXG5cbmNvbnN0IGMgPSBjb25zb2xlLmxvZyxcbiAgZCA9IGRvY3VtZW50LFxuICBuID0gbmF2aWdhdG9yLFxuICB3ID0gd2luZG93XG5cbmNvbnN0IGZpbHRlcmluZyA9ICh1bCkgPT4ge1xuXG4gIGQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmQtcHJvZ3JhbXMnKS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG5cbiAgICBsZXQganNvbiA9IEpTT04ucGFyc2UoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2NhbEpzb24nKSksXG4gICAgICBsaXN0YSA9IG51bGwsXG4gICAgICB0cGwgPSAnJ1xuICBcbiAgICBsaXN0YSA9IGpzb24ubWVtYmVyLmZpbHRlciggbGlzdCA9PiB7XG4gICAgICByZXR1cm4gbGlzdC50aXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpXG4gICAgfSlcbiAgXG4gICAgbGlzdGEuZm9yRWFjaChqc29uID0+IHtcbiAgICAgIHRwbCArPSBcbiAgICAgIGBcbiAgICAgIDxsaT5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cInByb2dyYW0taWRcIiBkYXRhLXByb2dyYW09XCIke2pzb25bXCJAaWRcIl19XCI+XG4gICAgICAgICR7anNvbi50aXRsZX1cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICAgIGBcbiAgICB9KVxuICBcbiAgICBkLnF1ZXJ5U2VsZWN0b3IodWwpLmlubmVySFRNTCA9IHRwbFxuICAgIGQucXVlcnlTZWxlY3RvcignLnR2X19oZWFkZXInKS5pbm5lckhUTUwgPSBgPHNwYW4gY2xhc3M9XCJ0dl9fbnVtYmVyXCI+JHtsaXN0YS5sZW5ndGh9PC9zcGFuPiBzYWlvIGVyYWt1c3RlbmBcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHR2ID0gKCkgPT4ge1xuXG4gIGNvbnN0IHJlYWR5U3RhdGUgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cbiAgICBpZiAoIGQucmVhZHlTdGF0ZSAgPT09ICdjb21wbGV0ZScgKSB7XG5cbiAgICAgIGNsZWFySW50ZXJ2YWwocmVhZHlTdGF0ZSlcbiAgICAgIFxuICAgICAgLy9Qcm9ncmFtYSBlcmFrdXRzaSAoYnVrbGVhKVxuICAgICAgZnVuY3Rpb24gZ2V0UHJvZ3JhbXMoanNvbikge1xuXG4gICAgICAgIGxldCB0cGwgPSAnJ1xuICAgICAgICBcbiAgICAgICAgSlNPTi5wYXJzZShqc29uKS5tZW1iZXIuZm9yRWFjaChqc29uID0+IHtcbiAgXG4gICAgICAgICAgdHBsICs9IGBcbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cInByb2dyYW0taWRcIiBkYXRhLXByb2dyYW09XCIke2pzb25bXCJAaWRcIl19XCI+XG4gICAgICAgICAgICAgICAgJHtqc29uLnRpdGxlfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgYFxuICAgICAgICB9KVxuICBcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcudHZfX2xpc3QnKS5pbm5lckhUTUwgPSB0cGxcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcudHZfX2hlYWRlcicpLmlubmVySFRNTCA9IGBTYWlvIGd1enRpYWsgZXJha3VzdGVuIDxzcGFuIGNsYXNzPVwidHZfX251bWJlclwiPigke0pTT04ucGFyc2UoIGpzb24gKS5tZW1iZXIubGVuZ3RofSk8L3NwYW4+YFxuICAgICAgICAvL0xvYWRlciBlemt1dGF0dVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdHYnKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci10ZW1wbGF0ZS10dicpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zaG93JylcbiAgICAgICAgLy9Gb290ZXJyZWFuIEFQSWFyZW4gZWd1bmVyYWtldGEgZGF0YSBiaXN0YXJhdHVcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubWFpbi1mb290ZXJfX3RleHQnKS5jbGFzc0xpc3QuYWRkKCdpcy1jYWNoZScpXG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vUHJvZ3JhbWFrIGVrYXJyaVxuICAgICAgZnVuY3Rpb24gZmV0Y2hBbGxQcm9ncmFtcyhkYXRhLCByZXF1ZXN0RnJvbUJHU3luYywgcmVzZXQpIHtcblxuICAgICAgICBsZXQgdHBsID0gJydcbiAgICAgICAgXG4gICAgICAgIC8vTG9hZGVyIGVyYWt1dHNpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci10ZW1wbGF0ZS10dicpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXR2JykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICAvL0JlaGFycmV6a28gc2VremlvYWsgZXprdXRhdHVcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbicpLmZvckVhY2goIHNlY3Rpb24gPT4ge1xuICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgndS1oaWRlJylcbiAgICAgICAgfSlcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcmllcycpLmNsYXNzTGlzdC5yZW1vdmUoJ3UtaGlkZScpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLnR2JykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcbiAgICAgICAgXG4gICAgICAgIC8vQVBJYSBkZWl0dSBiZWhhciBiYWRhLi4uXG4gICAgICAgIGlmKHJlc2V0KSB7XG5cbiAgICAgICAgICBmZXRjaChkYXRhKVxuICAgICAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSApXG4gICAgICAgICAgICAudGhlbihqc29uID0+IHtcblxuICAgICAgICAgICAgICBpZiAoICFyZXF1ZXN0RnJvbUJHU3luYyApIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndHYnKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xvY2FsSnNvbicsIEpTT04uc3RyaW5naWZ5KGpzb24pKTtcblxuICAgICAgICAgICAgICBsZXQgc2F2ZWREYXRlID0gbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICBkYXRlID0gc2F2ZWREYXRlLmdldEZ1bGxZZWFyKCkgKyAnLycgKyAoJzAnICsgKHNhdmVkRGF0ZS5nZXRNb250aCgpKzEpKS5zbGljZSgtMikgKyAnLycgKyAoJzAnICsgc2F2ZWREYXRlLmdldERhdGUoKSkuc2xpY2UoLTIpICsgJyAtICcsXG4gICAgICAgICAgICAgICAgdGltZSA9ICgnMCcgKyBzYXZlZERhdGUuZ2V0SG91cnMoKSkuc2xpY2UoLTIpICsgXCI6XCIgKyAoJzAnICsgc2F2ZWREYXRlLmdldE1pbnV0ZXMoKSkuc2xpY2UoLTIpLFxuICAgICAgICAgICAgICAgIGRhdGVUaW1lID0gZGF0ZSArICcgJyArIHRpbWVcblxuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImpzb25EYXRlXCIsIGRhdGVUaW1lKVxuICAgICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5zYXZlZC1kYXRlJykuaW5uZXJIVE1MID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJqc29uRGF0ZVwiKVxuXG4gICAgICAgICAgICAgIGdldFByb2dyYW1zKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2NhbEpzb24nKSlcblxuICAgICAgICAgICAgICAvL05vdGlmaWthemlvIGJpZGV6IG9oYXJ0YXJhemlcbiAgICAgICAgICAgICAgaWYoIHcuTm90aWZpY2F0aW9uICYmIE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uICE9PSAnZGVuaWVkJyApIHtcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oc3RhdHVzID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cylcbiAgICAgICAgICAgICAgICAgIGxldCBuID0gbmV3IE5vdGlmaWNhdGlvbignTmFoaWVyYW4nLCB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHk6ICdQcm9ncmFtYSB6ZXJyZW5kYSBlZ3VuZXJhdHUgZGEgOiknLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnLi9hc3NldHMvZmF2aWNvbi5wbmcnXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3R2JywgZGF0YSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIFxuICAgICAgICAvL1Byb2dyYW1hayBsb2NhbC1lYW4gZ29yZGV0YSBiYWRhZ29cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgZ2V0UHJvZ3JhbXMoZGF0YSlcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgIH0vL2ZldGNoQWxsUHJvZ3JhbXNcblxuICAgICAgLy9GaWx0cm9hIGVnaW5cbiAgICAgIGZpbHRlcmluZygnLnR2X19saXN0JylcbiAgICAgIFxuICAgICAgLy9Hb3JkZXRha28gQVBJYSBlemFiYXR1IGV0YSBiZXJyaWEgZWthcnR6ZWtvIC0gRVpBQkFUVVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlU3RvcmFnZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYgKCBjb25maXJtKCdQcm9ncmFtYSB6ZXJyZW5kYSBlZ3VuZXJhdHUgbmFoaSBhbCBkdXp1PycpID09IHRydWUpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnbG9jYWxKc29uJylcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnanNvbkRhdGUnKVxuICAgICAgICAgIFxuICAgICAgICAgIC8vQmlkZW8gbWFydHhhbiBiYWRhZ28gZXJlLCBnZXJhdHVcbiAgICAgICAgICBkLmdldEVsZW1lbnRCeUlkKFwidmlkZW9cIikucGF1c2UoKVxuICAgICAgICAgIFxuICAgICAgICAgIGxldCByZXNldCA9IHRydWUsXG4gICAgICAgICAgICBkYXRhPSAnaHR0cDovL3N0aWxsLWNhc3RsZS05OTc0OS5oZXJva3VhcHAuY29tL3BsYXlsaXN0J1xuICAgICAgICAgIFxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0dicsIGRhdGEpXG4gICAgICAgICAgXG4gICAgICAgICAgZmV0Y2hBbGxQcm9ncmFtcyhkYXRhLCBmYWxzZSwgcmVzZXQpXG4gICAgICAgICAgXG4gICAgICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKHByb2dyYW1haylcbiAgICAgICAgICBpZiAoICdzZXJ2aWNlV29ya2VyJyBpbiBuICYmICdTeW5jTWFuYWdlcicgaW4gdyApIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQkdTeW5jICgpIHtcbiAgICAgICAgICAgICAgbi5zZXJ2aWNlV29ya2VyLnJlYWR5XG4gICAgICAgICAgICAgIC50aGVuKHJlZ2lzdHJhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbi5zeW5jLnJlZ2lzdGVyKCduYWhpZXJhbi10dicpXG4gICAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4gYygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIGVycmVnaXN0cmF0dWEnKSApXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goIGVyciA9PiBjKCdFcnJvcmVhIGF0emVrbyBzaW5rcm9uaXphemlvYSBlcnJlZ2lzdHJhdHplYW4nLCBlcnIpIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlZ2lzdGVyQkdTeW5jKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vQXBsaWthemlvcmEgc2FydHplbiBkZW5lYW4gZWdpbiBiZWhhcnJla29hIChBUElhIGRlaXR1IGVkbyBleilcbiAgICAgIGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2NhbEpzb24nKSl7XG4gICAgICAgIGZldGNoQWxsUHJvZ3JhbXMobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvY2FsSnNvbicpLCBmYWxzZSwgZmFsc2UpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgbGV0IHJlc2V0ID0gdHJ1ZSxcbiAgICAgICAgICBkYXRhPSAnaHR0cDovL3N0aWxsLWNhc3RsZS05OTc0OS5oZXJva3VhcHAuY29tL3BsYXlsaXN0J1xuICAgICAgICAgIFxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndHYnLCBkYXRhKVxuXG4gICAgICAgIGZldGNoQWxsUHJvZ3JhbXMoZGF0YSwgZmFsc2UsIHJlc2V0KVxuICAgICAgICBcbiAgICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKHByb2dyYW1haylcbiAgICAgICAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiAmJiAnU3luY01hbmFnZXInIGluIHcgKSB7XG4gICAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJCR1N5bmMgKCkge1xuICAgICAgICAgICAgbi5zZXJ2aWNlV29ya2VyLnJlYWR5XG4gICAgICAgICAgICAudGhlbihyZWdpc3RyYXRpb24gPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uLnN5bmMucmVnaXN0ZXIoJ25haGllcmFuLXR2JylcbiAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4gYygnU2luY3Jvbml6YWNp77+9biBkZSBGb25kbyBSZWdpc3RyYWRhJykgKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IGMoJ0ZhbGxvIGxhIFNpbmNyb25pemFjae+/vW4gZGUgRm9uZG8nLCBlcnIpIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlZ2lzdGVyQkdTeW5jKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKHByb2dyYW1haylcbiAgICAgIG4uc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZSA9PiB7XG4gICAgICAgIGMoJ0F0emVrbyBzaW5rcm9uaXphemlvYSBtZXNzYWdlIGJpZGV6OiAnLCBlLmRhdGEpXG4gICAgICAgIGlmKCBlLmRhdGEgPT09ICdvbmxpbmUgbmFoaWVyYW4tdHYnIClcbiAgICAgICAgICBmZXRjaEFsbFByb2dyYW1zKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndHYnKSwgdHJ1ZSwgZmFsc2UgKVxuICAgICAgfSlcblxuICAgIH0gLy9yZWFkeVN0YXRlXG4gIH0sIDEwMCApLy9pbnRlcnZhbFxuXG4gIHJldHVybiBgXG4gICAgJHtjYXRlZ29yaWVzKCl9XG4gICAgPGRpdiBjbGFzcz1cInR2IHNlY3Rpb25cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0dl9fZm9ybVwiPlxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImZpbmQtcHJvZ3JhbXNcIiBjbGFzcz1cInR2X19pbnB1dFwiIHBsYWNlaG9sZGVyPVwiZWl0YmtvIHNhaW9lbiBhcnRlYW4gYmlsYXR1Li4uXCIgdGl0bGU9XCJTYWlvYWsgYmlsYXR1XCI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxoZWFkZXIgY2xhc3M9XCJzZWN0aW9uLWhlYWRlciB0dl9faGVhZGVyXCI+PC9oZWFkZXI+XG4gICAgICA8dWwgY2xhc3M9XCJ0dl9fbGlzdFwiPjwvdWw+XG4gICAgICA8ZGl2IGNsYXNzPVwibG9hZGVyLXRlbXBsYXRlIGxvYWRlci10ZW1wbGF0ZS10dlwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibG9hZGVyIGxvYWRlci10dlwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgJHtzZWxlY3RQcm9ncmFtKCl9XG4gICAgJHtzZWxlY3RFcGlzb2RlKCl9XG4gICAgJHtjYXRlZ29yaWVzU2luZ2xlKCl9XG4gICAgYFxufVxuIiwiY29uc3QgYyA9IGNvbnNvbGUubG9nLFxuICBkID0gZG9jdW1lbnQsXG4gIG4gPSBuYXZpZ2F0b3IsXG4gIHcgPSB3aW5kb3dcblxuZXhwb3J0IGNvbnN0IHNlbGVjdFByb2dyYW0gPSAoKSA9PiB7XG5cbiAgY29uc3QgYWpheExvYWRpbmcgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cbiAgICBpZiAoIGQucmVhZHlTdGF0ZSAgPT09ICdjb21wbGV0ZScgKSB7XG5cbiAgICAgIGNsZWFySW50ZXJ2YWwoYWpheExvYWRpbmcpXG4gICAgICBcbiAgICAgIC8vUHJvZ3JhbWEgZWthcnJpICh6ZXJyZW5kYSlcbiAgICAgIGZ1bmN0aW9uIGZldGNoUHJvZ3JhbShkYXRhLCByZXF1ZXN0RnJvbUJHU3luYykge1xuXHQgXHRcdFxuICAgICAgICBsZXQgdHBsID0gJycsXG4gICAgICAgICAgZGF0ZSA9ICcnXG4gICAgICAgIFxuICAgICAgICAvL0JlaGFycmV6a28gc2VremlvYWsgZXprdXRhdHVcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbicpLmZvckVhY2goIHNlY3Rpb24gPT4ge1xuICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgndS1oaWRlJylcbiAgICAgICAgfSlcbiAgICAgICAgXG4gICAgICAgIC8vTG9hZGVyIGVyYWt1dHNpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci1wcm9ncmFtJykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtcHJvZ3JhbScpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgICAgICBcbiAgICAgICAgZmV0Y2goZGF0YSlcbiAgICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpIClcbiAgICAgICAgICAudGhlbihqc29uID0+IHtcblx0XHRcdFx0XHRcbiAgICAgICAgICAgIGlmICggIXJlcXVlc3RGcm9tQkdTeW5jICkge1xuICBcdFx0XHRcdFx0ICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndHYtcHJvZ3JhbScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXHRcdFxuICBcdFx0XHRcdCAgZC5xdWVyeVNlbGVjdG9yKCcucHJvZ3JhbScpLmNsYXNzTGlzdC5yZW1vdmUoJ3UtaGlkZScpXG4gIFx0XHRcdFx0ICAvL0xvYWRlciBlemt1dGF0dVxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXByb2dyYW0nKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtcHJvZ3JhbScpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zaG93JylcbiAgXG4gICAgICAgICAgICBqc29uLm1lbWJlci5mb3JFYWNoKGpzb24gPT4ge1xuICAgICAgICAgICAgICBpZihqc29uLmJyb2FkY2FzdF9kYXRlKSB7IFxuICAgICAgICAgICAgICAgIGRhdGUgPSBqc29uLmJyb2FkY2FzdF9kYXRlLnNsaWNlKDAsMTApIFxuICBcdFx0XHRcdCAgXHR9XG4gICAgICAgICAgICAgIHRwbCArPSBgXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiY3VzdG9tLWVwaXNvZGVcIiBkYXRhLWVwaXNvZGU9XCIke2pzb25bXCJAaWRcIl19XCI+XG4gICAgICBcdFx0XHRcdFx0ICA8ZGl2IGNsYXNzPVwicHJvZ3JhbV9faW1hZ2VcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2pzb24uZXBpc29kZV9pbWFnZX1cIiBjbGFzcz1cInByb2dyYW1fX2ltZyBjdXN0b20tZXBpc29kZVwiIGRhdGEtZXBpc29kZT1cIiR7anNvbltcIkBpZFwiXX1cIj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICBcdFx0XHRcdFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyYW1fX2NvbnRlbnQgY3VzdG9tLWVwaXNvZGVcIiBkYXRhLWVwaXNvZGU9XCIke2pzb25bXCJAaWRcIl19XCI+XG4gICAgICAgICAgICAgICAgICAgICR7anNvbi50aXRsZX1cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmFtX19kYXRlXCI+JHtkYXRlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICB9KVxuICBcbiAgICAgICAgICBcdGQucXVlcnlTZWxlY3RvcignLnByb2dyYW1fX2xpc3QnKS5pbm5lckhUTUwgPSB0cGxcbiAgICAgICAgICBcdGQucXVlcnlTZWxlY3RvcignLnByb2dyYW1fX2hlYWRlcicpLmlubmVySFRNTCA9IGBcbiAgICAgICAgICBcdFx0PGRpdiBjbGFzcz1cInByb2dyYW1fX3RpdGxlXCI+JHtqc29uLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmFtX19kZXNjXCI+JHtqc29uLmRlc2NfZ3JvdXB9PC9kaXY+XG4gICAgICAgICAgICAgIGBcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSlcblx0XHQgIH1cblxuICAgICAgZC5nZXRFbGVtZW50QnlJZChcImFwcFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGlmKCBlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3Byb2dyYW0taWQnKSApIHtcbiAgXHRcdCAgICBcbiAgXHRcdCAgICBsZXQgZGF0YSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1wcm9ncmFtJylcbiAgXG4gIFx0XHQgIFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3R2LXByb2dyYW0nLCBkYXRhKVxuICBcdFx0ICBcdFxuICAgICAgICAgIGZldGNoUHJvZ3JhbSggZGF0YSwgZmFsc2UpXG4gICAgICAgICAgXG4gICAgICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKHByb2dyYW1haylcbiAgICAgICAgICBpZiAoICdzZXJ2aWNlV29ya2VyJyBpbiBuICYmICdTeW5jTWFuYWdlcicgaW4gdyApIHtcbiAgXHRcdFx0ICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQkdTeW5jICgpIHtcbiAgXHRcdFx0ICAgICAgbi5zZXJ2aWNlV29ya2VyLnJlYWR5XG4gIFx0XHRcdCAgICAgICAgLnRoZW4ocmVnaXN0cmF0aW9uID0+IHtcbiAgXHRcdFx0ICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb24uc3luYy5yZWdpc3RlcignbmFoaWVyYW4tdHYtcHJvZ3JhbScpXG4gIFx0XHRcdCAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCBlcnIgPT4gYygnRXJyb3JlYSBhdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR6ZWFuJywgZXJyKSApXG4gIFx0XHRcdCAgICAgICAgfSlcbiAgXHRcdFx0ICAgIH1cbiAgXHRcdFx0ICAgIHJlZ2lzdGVyQkdTeW5jKClcbiAgXHRcdFx0ICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAvL0JhY2tncm91bmQgU3luYyAocHJvZ3JhbWFrKVxuICAgICAgbi5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBlID0+IHtcblx0XHQgICAgY29uc29sZS5sb2coJ0F0emVrbyBzaW5rcm9uaXphemlvYSBtZXNzYWdlIGJpZGV6IGFrdGliYXR1YTogJywgZS5kYXRhKVxuXHRcdCAgICBpZiggZS5kYXRhID09PSAnb25saW5lIG5haGllcmFuLXR2LXByb2dyYW0nIClcblx0XHQgICAgXHRmZXRjaFByb2dyYW0oIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0di1wcm9ncmFtJyksIHRydWUgKVxuXHRcdCAgfSlcbiAgICB9IC8vcmVhZHlTdGF0ZVxuICB9LCAxMDAgKS8vaW50ZXJ2YWxcblxuICByZXR1cm4gYFxuICAgIDxkaXYgY2xhc3M9XCJsb2FkZXItdGVtcGxhdGUgbG9hZGVyLXRlbXBsYXRlLXByb2dyYW1cIj5cbiAgXHQgIDxkaXYgY2xhc3M9XCJsb2FkZXIgbG9hZGVyLXByb2dyYW1cIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicHJvZ3JhbSBzZWN0aW9uIHUtaGlkZVwiPlxuICBcdCAgPGhlYWRlciBjbGFzcz1cInNlY3Rpb24taGVhZGVyIHByb2dyYW1fX2hlYWRlclwiPjwvaGVhZGVyPlxuICAgICAgPHVsIGNsYXNzPVwicHJvZ3JhbV9fbGlzdFwiPjwvdWw+XG4gICAgPC9kaXY+XG4gICAgYFxufVxuIiwiY29uc3QgYyA9IGNvbnNvbGUubG9nLFxuICBkID0gZG9jdW1lbnQsXG4gIG4gPSBuYXZpZ2F0b3IsXG4gIHcgPSB3aW5kb3dcblxuZXhwb3J0IGNvbnN0IHNlbGVjdEVwaXNvZGUgPSAoKSA9PiB7XG5cbiAgY29uc3QgcmVhZHlTdGF0ZSA9IHNldEludGVydmFsKCgpID0+IHtcblxuICAgIGlmICggZC5yZWFkeVN0YXRlICA9PT0gJ2NvbXBsZXRlJyApIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwocmVhZHlTdGF0ZSlcbiAgICAgIFxuICAgICAgLy9BdHplcmEgam9hbiAocHJvZ3JhbWV0YXJhKVxuICAgICAgZC5nZXRFbGVtZW50QnlJZCgnZXBpc29kZV9fYmFjaycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgLy9CZWhhcnJlemtvIHNla3ppb2FrIGV6a3V0YXR1XG4gICAgICAgIGQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24nKS5mb3JFYWNoKCBzZWN0aW9uID0+IHtcbiAgICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ3UtaGlkZScpXG4gICAgICAgICAgZC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpLnBhdXNlKClcbiAgICAgICAgfSlcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcucHJvZ3JhbScpLmNsYXNzTGlzdC5yZW1vdmUoJ3UtaGlkZScpXG4gICAgICB9KVxuICAgICAgXG4gICAgICAvL2VwaXNvZGUga2FyZ2F0dVxuICAgICAgZnVuY3Rpb24gZmV0Y2hFcGlzb2RlKGRhdGEsIHJlcXVlc3RGcm9tQkdTeW5jKSB7XG5cbiAgICAgICAgbGV0IHRwbCA9ICcnXG4gICAgICAgIC8vTG9hZGVyIGVyYWt1dHNpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci1lcGlzb2RlJykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtZXBpc29kZScpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgXG4gICAgICAgIC8vQmVoYXJyZXprbyBzZWt6aW9hayBlemt1dGF0dVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uJykuZm9yRWFjaCggc2VjdGlvbiA9PiB7XG4gICAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCd1LWhpZGUnKVxuICAgICAgICB9KVxuICAgICAgICBcbiAgICAgICAgLy9BUElhIGRlaXR1IChlcGlzb2RlKVxuICAgICAgICBmZXRjaChkYXRhKVxuICAgICAgICBcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG5cbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLmVwaXNvZGUnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuXG4gICAgICAgICAgICBpZiAoIXJlcXVlc3RGcm9tQkdTeW5jKSB7XG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0di1wcm9ncmFtLWVwaXNvZGUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL0xvYWRlciBlemt1dGF0dVxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLWVwaXNvZGUnKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtZXBpc29kZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zaG93JylcblxuICAgICAgICAgICAgbGV0IHVybEVuZCA9IGpzb24udXJsLnNsaWNlKC0zKTtcblxuICAgICAgICAgICAgaWYodXJsRW5kID09PSAnbXA0Jykge1xuICAgICAgICAgICAgICB1cmxFbmQgPSBqc29uLnVybFxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIHVybEVuZCA9IGpzb24uZm9ybWF0c1s3XS51cmxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHBsID0gYFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXBpc29kZV9fdmlkZW9cIj5cbiAgICAgICAgICAgICAgICA8dmlkZW8gaWQ9XCJ2aWRlb1wiIGF1dG9wbGF5IHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBjb250cm9scyBwb3N0ZXI9XCIke2pzb24udGh1bWJuYWlsc1swXS51cmx9XCI+XG4gICAgICAgICAgICAgICAgICA8c291cmNlIHNyYz1cIiR7dXJsRW5kfVwiIHR5cGU9XCJ2aWRlby9tcDRcIj5cbiAgICAgICAgICAgICAgICAgIFp1cmUgbmFiaWdhenRhaWxlYWsgZXppbiBkdSBiaWRlb3JpayBlcmFrdXRzaSA6KFxuICAgICAgICAgICAgICAgIDwvdmlkZW8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICBgXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5lcGlzb2RlX19wbGF5JykuaW5uZXJIVE1MID0gdHBsXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5lcGlzb2RlX19oZWFkZXInKS5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlcGlzb2RlX190aXRsZVwiPiR7anNvbi50aXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVwaXNvZGVfX2Rlc2NcIj4ke2pzb24uZGVzY3JpcHRpb259PC9kaXY+XG4gICAgICAgICAgICAgIGBcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3R2LXByb2dyYW0tZXBpc29kZScsIGRhdGEpXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5lcGlzb2RlX19wbGF5JykuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJlcnJvclwiPktvbmV4aW9hayBodXRzIGVnaW4gZHU8L2Rpdj4nXG4gICAgICAgICAgfSlcbiAgICAgIH0gLy9mZXRjaEVwaXNvZGVcbiAgICAgIFxuICAgICAgLy9Qcm9ncmFtYSB6ZXJyZW5kYXRpayBlcGlzb2RlIGVrYXJyaSAoY2xpY2spXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmFtX19saXN0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICBpZiggZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjdXN0b20tZXBpc29kZScpICkge1xuXG4gICAgICAgICAgbGV0IGRhdGEgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZXBpc29kZScpXG5cbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndHYtcHJvZ3JhbS1lcGlzb2RlJywgZGF0YSlcbiAgICAgICAgICBmZXRjaEVwaXNvZGUoZGF0YSwgZmFsc2UpXG4gICAgICAgICAgXG4gICAgICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKGVwaXNvZGUpXG4gICAgICAgICAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiAmJiAnU3luY01hbmFnZXInIGluIHcgKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiByZWdpc3RlckJHU3luYyAoKSB7XG4gICAgICAgICAgICAgIG4uc2VydmljZVdvcmtlci5yZWFkeVxuICAgICAgICAgICAgICAudGhlbihyZWdpc3RyYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb24uc3luYy5yZWdpc3RlcignbmFoaWVyYW4tdHYtcHJvZ3JhbS1lcGlzb2RlJylcbiAgICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IGMoJ0Vycm9yZWEgYXR6ZWtvIHNpbmtyb25pemF6aW9hIGVycmVnaXN0cmF0emVhbicsIGVycikgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVnaXN0ZXJCR1N5bmMoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChlcGlzb2RlKVxuICAgICAgbi5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBlID0+IHtcbiAgICAgICAgYygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIG1lc3NhZ2UgYmlkZXo6ICcsIGUuZGF0YSlcbiAgICAgICAgaWYoIGUuZGF0YSA9PT0gJ29ubGluZSBuYWhpZXJhbi10di1wcm9ncmFtLWVwaXNvZGUnKVxuICAgICAgICAgIGZldGNoRXBpc29kZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndHYtcHJvZ3JhbS1lcGlzb2RlJyksIHRydWUpXG4gICAgICB9KVxuICAgICAgXG4gICAgfSAvL3JlYWR5U3RhdGVcbiAgfSwgMTAwICkvL2ludGVydmFsXG5cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGNsYXNzPVwibG9hZGVyLXRlbXBsYXRlIGxvYWRlci10ZW1wbGF0ZS1lcGlzb2RlXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibG9hZGVyIGxvYWRlci1lcGlzb2RlXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgXG4gICAgPGRpdiBjbGFzcz1cImVwaXNvZGUgc2VjdGlvbiB1LWhpZGVcIj5cbiAgICAgIDxoZWFkZXIgY2xhc3M9XCJzZWN0aW9uLWhlYWRlciBlcGlzb2RlX19oZWFkZXJcIj48L2hlYWRlcj5cbiAgICAgIDxkaXYgY2xhc3M9XCJlcGlzb2RlX19wbGF5XCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZXBpc29kZV9fbmF2XCI+PGEgaHJlZj1cIiNcIiBpZD1cImVwaXNvZGVfX2JhY2tcIj48IEF0emVyYTwvYT48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICBgXG59XG4iLCJpbXBvcnQgeyBpbml0LCBwd2EsIGlzT25saW5lIH0gZnJvbSAnLi9jb21wb25lbnRzL2luaXQnO1xuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykuaW5uZXJIVE1MID0gaW5pdCgpXG5cbi8vQXBsaWt6aW9hIHdlYiBwcm9ncmVzaWJvYSBlcnJlZ2lzdHJhdHVcbnB3YSgpXG5cbi8vT25saW5lL2ZmbGluZSBnYXVkZW4gemVoYXp0dVxuaXNPbmxpbmUoKVxuIl19
