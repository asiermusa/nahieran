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

      fetch('//still-castle-99749.herokuapp.com/program-type-list').then(function (response) {
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
              data = '//still-castle-99749.herokuapp.com/playlist';

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
            data = '//still-castle-99749.herokuapp.com/playlist';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29tcG9uZW50cy9jYXRlZ29yaWVzLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2F0ZWdvcmllc1NpbmdsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2luaXQuanMiLCJzcmMvanMvY29tcG9uZW50cy90di5qcyIsInNyYy9qcy9jb21wb25lbnRzL3R2UHJvZ3JhbS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3R2UHJvZ3JhbUVwaXNvZGUuanMiLCJzcmMvanMvc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFNLElBQUksUUFBUSxHQUFsQjtBQUFBLElBQ0UsSUFBSSxRQUROO0FBQUEsSUFFRSxJQUFJLFNBRk47QUFBQSxJQUdFLElBQUksTUFITjs7QUFLTyxJQUFNLGtDQUFhLFNBQWIsVUFBYSxHQUFNOztBQUU5QixNQUFNLGFBQWEsWUFBWSxZQUFNOztBQUVuQyxRQUFLLEVBQUUsVUFBRixLQUFrQixVQUF2QixFQUFvQzs7QUFFbEMsb0JBQWMsVUFBZDs7QUFFQSxVQUFJLE1BQU0sRUFBVjs7QUFFQTtBQUNBLFFBQUUsY0FBRixDQUFpQixnQkFBakIsRUFBbUMsZ0JBQW5DLENBQW9ELE9BQXBELEVBQTZELFVBQUMsQ0FBRCxFQUFPO0FBQ2xFLFVBQUUsYUFBRixDQUFnQixrQkFBaEIsRUFBb0MsU0FBcEMsQ0FBOEMsTUFBOUMsQ0FBcUQsU0FBckQ7O0FBRUE7QUFDQSxZQUFJLEVBQUUsYUFBRixDQUFnQixXQUFoQixFQUE2QixTQUE3QixDQUF1QyxRQUF2QyxDQUFnRCxXQUFoRCxDQUFKLEVBQWlFO0FBQy9ELFlBQUUsYUFBRixDQUFnQixXQUFoQixFQUE2QixTQUE3QixDQUF1QyxNQUF2QyxDQUE4QyxXQUE5QztBQUNELFNBRkQsTUFFTTtBQUNKLFlBQUUsYUFBRixDQUFnQixXQUFoQixFQUE2QixTQUE3QixDQUF1QyxHQUF2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QUFYOztBQUVBLHVCQUFhLE9BQWIsQ0FBcUIsb0JBQXJCLEVBQTJDLElBQTNDO0FBQ0EsdUJBQWEsSUFBYixFQUFtQixLQUFuQjs7QUFFQTtBQUNBLGNBQUssbUJBQW1CLENBQW5CLElBQXdCLGlCQUFpQixDQUE5QyxFQUFrRDtBQUFBLGdCQUN2QyxjQUR1QyxHQUNoRCxTQUFTLGNBQVQsR0FBMkI7QUFDekIsZ0JBQUUsYUFBRixDQUFnQixLQUFoQixDQUNDLElBREQsQ0FDTSx3QkFBZ0I7QUFDcEIsdUJBQU8sYUFBYSxJQUFiLENBQWtCLFFBQWxCLENBQTJCLDZCQUEzQixFQUNKLElBREksQ0FDRTtBQUFBLHlCQUFNLEVBQUUscUNBQUYsQ0FBTjtBQUFBLGlCQURGLEVBRUosS0FGSSxDQUVHO0FBQUEseUJBQU8sRUFBRSwrQ0FBRixFQUFtRCxHQUFuRCxDQUFQO0FBQUEsaUJBRkgsQ0FBUDtBQUdELGVBTEQ7QUFNRCxhQVIrQzs7QUFTaEQ7QUFDRDtBQUNGO0FBQ0YsT0F2QkQ7QUF3QkE7QUFDQSxRQUFFLGFBQUYsQ0FBZ0IsZ0JBQWhCLENBQWlDLFNBQWpDLEVBQTRDLGFBQUs7QUFDL0MsVUFBRSx1Q0FBRixFQUEyQyxFQUFFLElBQTdDO0FBQ0EsWUFBSSxFQUFFLElBQUYsS0FBVyxvQ0FBZixFQUNFLGFBQWEsYUFBYSxPQUFiLENBQXFCLG9CQUFyQixDQUFiLEVBQXlELElBQXpEO0FBQ0gsT0FKRDtBQU1ELEtBeEdrQyxDQXdHakM7QUFDSCxHQXpHa0IsRUF5R2hCLEdBekdnQixDQUFuQixDQUZpQyxDQTJHekI7O0FBRVI7QUFXRCxDQXhITTs7Ozs7QUNMUDs7QUFFQSxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsRUFBK0IsU0FBL0IsR0FBMkMsaUJBQTNDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBjID0gY29uc29sZS5sb2csXG4gIGQgPSBkb2N1bWVudCxcbiAgbiA9IG5hdmlnYXRvcixcbiAgdyA9IHdpbmRvd1xuXG5leHBvcnQgY29uc3QgY2F0ZWdvcmllcyA9ICgpID0+IHtcblxuICBjb25zdCByZWFkeVN0YXRlID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXG4gICAgaWYgKCBkLnJlYWR5U3RhdGUgID09PSAnY29tcGxldGUnICkge1xuXG4gICAgICBjbGVhckludGVydmFsKHJlYWR5U3RhdGUpXG5cbiAgICAgIGxldCB0cGwgPSAnJ1xuXG4gICAgICAvL05hYmlnYXppbyBib3RvaWFcbiAgICAgIGQuZ2V0RWxlbWVudEJ5SWQoXCJjYXRlZ29yaWVzLWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLm9mZi1jYW52YXMtbWVudScpLmNsYXNzTGlzdC50b2dnbGUoJ2lzLW9wZW4nKVxuXG4gICAgICAgIC8vS2F0ZWdvcmlhbiBpa29ub2EgKG1lbnUgb2ZmLWNhbnZhcylcbiAgICAgICAgaWYoIGQucXVlcnlTZWxlY3RvcignLm5hdi1pY29uJykuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaXMtYWN0aXZlXCIpKXtcbiAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5uYXYtaWNvbicpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5uYXYtaWNvbicpLmNsYXNzTGlzdC5hZGQoJ2lzLWFjdGl2ZScpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAvL3NjYXBlIHRla2xhIGJpZGV6IGl0eGkgbWVudWFcbiAgICAgIGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09IDI3KSB7XG4gICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcub2ZmLWNhbnZhcy1tZW51JykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3BlbicpXG4gICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubmF2LWljb24nKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvL0JlaGFycmV6a28gc2VremlvYWsgZXprdXRhdHVcbiAgICAgIGQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24nKS5mb3JFYWNoKCBzZWN0aW9uID0+IHtcbiAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCd1LWhpZGUnKVxuICAgICAgfSlcbiAgICAgIGQucXVlcnlTZWxlY3RvcignLmNhdGVnb3JpZXMnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKCcudHYnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuXG4gICAgICBmZXRjaCgnLy9zdGlsbC1jYXN0bGUtOTk3NDkuaGVyb2t1YXBwLmNvbS9wcm9ncmFtLXR5cGUtbGlzdCcpXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkgKVxuICAgICAgICAudGhlbihqc29uID0+IHtcblxuICAgICAgICAgIGpzb24ubWVtYmVyLmZvckVhY2goanNvbkNhdCA9PiB7XG4gICAgICAgICAgICB0cGwgKz0gYFxuICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwiY2F0ZWdvcnktaWRcIiBkYXRhLWNhdGVnb3J5PVwiJHtqc29uQ2F0W1wiQGlkXCJdfVwiPlxuICAgICAgICAgICAgICBcdCR7anNvbkNhdC50aXRsZX1cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIGBcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcmllc19fbGlzdCcpLmlubmVySFRNTCA9IHRwbFxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpXG5cbiAgICB9IC8vcmVhZHlTdGF0ZVxuXG4gIH0sIDEwMCApLy9pbnRlcnZhbFxuXG4gIHJldHVybiBgXG4gICAgPGRpdiBjbGFzcz1cImNhdGVnb3JpZXMgb2ZmLWNhbnZhcy1tZW51XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibG9hZGVyXCI+PC9kaXY+XG4gICAgICA8dWwgY2xhc3M9XCJjYXRlZ29yaWVzX19saXN0XCI+PC91bD5cbiAgICA8L2Rpdj5cbiAgICBgXG59XG4iLCJjb25zdCBjID0gY29uc29sZS5sb2csXG4gIGQgPSBkb2N1bWVudCxcbiAgbiA9IG5hdmlnYXRvcixcbiAgdyA9IHdpbmRvd1xuXG5leHBvcnQgY29uc3QgY2F0ZWdvcmllc1NpbmdsZSA9ICgpID0+IHtcblxuICBjb25zdCByZWFkeVN0YXRlID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXG4gICAgaWYgKCBkLnJlYWR5U3RhdGUgID09PSAnY29tcGxldGUnICkge1xuXG4gICAgICBjbGVhckludGVydmFsKHJlYWR5U3RhdGUpXG4gICAgICBcbiAgICAgIC8vS2F0ZWdvcmlhIHplcnJlbmRhIGVrYXJyaVxuICBcdCAgZnVuY3Rpb24gZmV0Y2hDYXRlZ29yeShkYXRhLCByZXF1ZXN0RnJvbUJHU3luYywgY2F0TmFtZSkge1xuXHRcdCAgXHRcblx0XHQgIFx0bGV0IHRwbCA9ICcnXG4gICAgICAgICAgICAgIFxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5vZmYtY2FudmFzLW1lbnUnKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubmF2LWljb24nKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKVxuICAgICAgICAvL0xvYWRlciBlcmFrdXRzaVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItY2F0JykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtY2F0JykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICAvL0JlaGFycmV6a28gc2VremlvYWsgZXprdXRhdHVcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbicpLmZvckVhY2goIHNlY3Rpb24gPT4ge1xuICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgndS1oaWRlJylcbiAgICAgICAgfSlcbiAgICAgICAgXG4gICAgICAgIGZldGNoKGRhdGEpXG4gICAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSApXG4gICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG5cbiAgICAgICAgICAgIGlmICggIXJlcXVlc3RGcm9tQkdTeW5jICkge1xuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnY2F0ZWdvcnknKVxuICAgICAgXHRcdFx0fVxuICAgICAgXHRcdFxuICAgICAgICAgICAgLy9Mb2FkZXIgZXprdXRhdHVcbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci1jYXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtY2F0JykuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNob3cnKSAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLnNpbmdsZS1jYXQnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuICBcdFx0ICBcbiAgICAgICAgXHRcdGpzb24ubWVtYmVyLmZvckVhY2goanNvbkNhdCA9PiB7XG4gICAgICAgICAgICAgIHRwbCArPSBgXG4gICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cInByb2dyYW0taWRcIiBkYXRhLXByb2dyYW09XCIke2pzb25DYXRbXCJAaWRcIl19XCI+XG4gICAgICAgICAgICAgICAgICAgICR7anNvbkNhdC50aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIH0pXG4gIFxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuc2luZ2xlLWNhdF9fbGlzdCcpLmlubmVySFRNTCA9IHRwbFxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuc2luZ2xlLWNhdF9faGVhZGVyJykuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidHZfX3RpdGxlXCI+JHtjYXROYW1lfTwvZGl2PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR2X19udW1iZXJcIj4oJHtqc29uLm1lbWJlci5sZW5ndGh9KTwvc3Bhbj4gc2FpbyBlcmFrdXN0ZW5cbiAgICAgICAgICAgICAgYFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKVxuICAgICAgICAgIFxuICAgICAgfSAvL2ZldGNoQ2F0ZWdvcnlcblxuICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcmllc19fbGlzdCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYoIGQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWRlb1wiKSkgXG4gICAgICAgICAgZC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpLnBhdXNlKClcblx0XHQgIFxuICAgICAgICBpZiggZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjYXRlZ29yeS1pZCcpICkge1xuXHQgIFxuICAgICAgICAgIGxldCBkYXRhID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWNhdGVnb3J5JyksXG4gICAgICAgICAgICBjYXROYW1lID0gZS50YXJnZXQuaW5uZXJIVE1MXG4gICAgICAgICAgXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhdGVnb3J5JywgZGF0YSlcbiAgICAgICAgICBmZXRjaENhdGVnb3J5KCBkYXRhLCBmYWxzZSwgY2F0TmFtZSkgIFxuICAgICAgICAgIFxuICAgICAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChrYXRlZ29yaWEpXG4gICAgICAgICAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiAmJiAnU3luY01hbmFnZXInIGluIHcgKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiByZWdpc3RlckJHU3luYyAoKSB7XG4gICAgICAgICAgICAgIG4uc2VydmljZVdvcmtlci5yZWFkeVxuICAgICAgICAgICAgICAudGhlbihyZWdpc3RyYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb24uc3luYy5yZWdpc3RlcignbmFoaWVyYW4tY2F0ZWdvcnknKVxuICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIGVyciA9PiBjKCdFcnJvcmVhIGF0emVrbyBzaW5rcm9uaXphemlvYSBlcnJlZ2lzdHJhdHplYW4nLCBlcnIpIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlZ2lzdGVyQkdTeW5jKClcbiAgICAgICAgICB9ICAgICAgICBcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChrYXRlZ29yaWEpXG4gICAgICBuLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGUgPT4ge1xuXHRcdCAgICBjb25zb2xlLmxvZygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIG1lc3NhZ2UgYmlkZXogYWt0aWJhdHVhOiAnLCBlLmRhdGEpXG5cdFx0ICAgIGlmKCBlLmRhdGEgPT09ICdvbmxpbmUgbmFoaWVyYW4tY2F0ZWdvcnknKVxuXHRcdCAgICBcdGZldGNoQ2F0ZWdvcnkoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjYXRlZ29yeScpLCB0cnVlIClcblx0XHQgIH0pXG5cbiAgICB9IC8vcmVhZHlTdGF0ZVxuXG4gIH0sIDEwMCApIC8vaW50ZXJ2YWxcblxuICByZXR1cm4gYFxuICAgIDxkaXYgY2xhc3M9XCJsb2FkZXItdGVtcGxhdGUgbG9hZGVyLXRlbXBsYXRlLWNhdFwiPlxuICAgIFx0PGRpdiBjbGFzcz1cImxvYWRlciBsb2FkZXItY2F0XCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNpbmdsZS1jYXQgc2VjdGlvbiB1LWhpZGVcIj5cbiAgICAgIDxoZWFkZXIgY2xhc3M9XCJzZWN0aW9uLWhlYWRlciB0dl9faGVhZGVyIHNpbmdsZS1jYXRfX2hlYWRlclwiPjwvaGVhZGVyPlxuICAgICAgPHVsIGNsYXNzPVwidHZfX2xpc3Qgc2luZ2xlLWNhdF9fbGlzdFwiPjwvdWw+XG4gICAgPC9kaXY+XG4gICAgYFxufVxuIiwiaW1wb3J0IHt0dn0gZnJvbSAnLi90dic7XG5cbmNvbnN0IGMgPSBjb25zb2xlLmxvZyxcbiAgZCA9IGRvY3VtZW50LFxuICBuID0gbmF2aWdhdG9yLFxuICB3ID0gd2luZG93XG5cbmV4cG9ydCBjb25zdCBwd2EgPSAoKSA9PiB7XG4gIC8vU2VydmljZSBXb3JrZXJyYSBlcnJlZ2lzdHJhdHVcbiAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiApIHtcbiAgICBuLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJy4vc3cuanMnKVxuICAgIC50aGVuKCByZWdpc3RyYXRpb24gPT4ge1xuICAgICAgYygnU2VydmljZSBXb3JrZXIgZXJyZWdpc3RyYXR1YScsIHJlZ2lzdHJhdGlvbi5zY29wZSlcbiAgICB9KVxuICAgIC5jYXRjaCggZXJyID0+IGMoYFJlZ2lzdHJvIGRlIFNlcnZpY2UgV29ya2VyIGZhbGxpZG9gLCBlcnIpIClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgaXNPbmxpbmUgPSAoKSA9PiB7XG4gIC8vS29uZXhpb2FyZW4gZWdvZXJhIChvbmxpbmUvb2ZmbGluZSlcbiAgY29uc3QgbWV0YVRhZ1RoZW1lID0gZC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9dGhlbWUtY29sb3JdJylcblxuICBmdW5jdGlvbiBuZXR3b3JrU3RhdHVzIChlKSB7XG5cbiAgICBpZiAoIG4ub25MaW5lICkge1xuICAgICAgbWV0YVRhZ1RoZW1lLnNldEF0dHJpYnV0ZSgnY29udGVudCcsICcjZmZmZmZmJylcbiAgICAgIGQucXVlcnlTZWxlY3RvcihcIi5tYWluLWZvb3Rlcl9fc3RhdHVzXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJvZmZsaW5lXCIpXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoXCIub2ZmbGluZVwiKS5pbm5lckhUTUwgPSBcIlwiXG4gICAgfSBlbHNlIHtcbiAgICAgIG1ldGFUYWdUaGVtZS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnLCAnI2M5YzljOScpXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1mb290ZXJfX3N0YXR1c1wiKS5jbGFzc0xpc3QuYWRkKFwib2ZmbGluZVwiKVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKFwiLm9mZmxpbmVcIikuaW5uZXJIVE1MID0gXCI8ZGl2IGNsYXNzPSd0ZXh0Jz5TYXJlYSBiZXJyZXNrdXJhdHplbi4uLjwvZGl2PlwiXG4gICAgfVxuICB9XG5cbiAgdy5hZGRFdmVudExpc3RlbmVyKCdvbmxpbmUnLCBuZXR3b3JrU3RhdHVzKVxuICB3LmFkZEV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCBuZXR3b3JrU3RhdHVzKVxufVxuXG5jb25zdCByZWxvYWRBcHAgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gIC8vQXBsaWthemlvYS9sZWlob2EgZWd1bmVyYXR1XG4gIGlmICggZC5yZWFkeVN0YXRlICA9PT0gJ2NvbXBsZXRlJyApIHtcbiAgICBjbGVhckludGVydmFsKHJlbG9hZEFwcClcbiAgICBkLmdldEVsZW1lbnRCeUlkKFwicmVsb2FkLWFwcFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBsb2NhdGlvbi5yZWxvYWQoKVxuICAgIH0pXG4gIH1cbn0pXG5cbmV4cG9ydCBjb25zdCBpbml0ID0gKGRhdGEpID0+IHtcblxuICByZXR1cm4gYFxuICA8aGVhZGVyIGNsYXNzPVwibWFpbi1oZWFkZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwibWFpbi1oZWFkZXJfX2NvbHNcIj5cbiAgICAgIDxpbWcgc3JjPVwiLi9hc3NldHMvZWl0Yi1sb2dvLWJsdWUuc3ZnXCIgYWx0PVwiTmFoaWVyYW5cIiBjbGFzcz1cIm1haW4taGVhZGVyX19sb2dvXCIgaWQ9XCJyZWxvYWQtYXBwXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cIm1haW4taGVhZGVyX19zbG9nYW5cIj5uYWhpZXJhbjwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwibWFpbi1oZWFkZXJfX2NvbHMgcmlnaHRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJuYXYtaWNvblwiIGlkPVwiY2F0ZWdvcmllcy1idG5cIj5cbiAgICAgIFx0PGRpdiBjbGFzcz1cIm5hdi1pY29uX19iYXJcIj48L2Rpdj5cbiAgICAgIFx0PGRpdiBjbGFzcz1cIm5hdi1pY29uX19iYXJcIj48L2Rpdj5cbiAgICAgIFx0PGRpdiBjbGFzcz1cIm5hdi1pY29uX19iYXJcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2hlYWRlcj5cblxuICAke3R2KCl9XG5cbiAgPGZvb3RlciBjbGFzcz1cIm1haW4tZm9vdGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX19zdGF0dXNcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwibWFpbi1mb290ZXJfX3Jvd1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX19jb2wtbG9nb1wiPlxuICAgICAgXHQ8aW1nIHNyYz1cIi4vYXNzZXRzL2VpdGItbG9nby13aGl0ZS5zdmdcIiBhbHQ9XCJlaXRiIG5haGllcmFuXCIgY2xhc3M9XCJtYWluLWZvb3Rlcl9fbG9nb1wiPlxuICAgICAgXHQ8ZGl2IGNsYXNzPVwibWFpbi1mb290ZXJfX3RleHRcIj5BemtlbiBlZ3VuZXJha2V0YTpcbiAgICAgIFx0XHQ8c3BhbiBjbGFzcz1cInNhdmVkLWRhdGVcIj4ke2xvY2FsU3RvcmFnZS5nZXRJdGVtKFwianNvbkRhdGVcIil9PC9zcGFuPlxuICAgICAgXHQ8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX19jb2wtYnRuIGRlbGV0ZVN0b3JhZ2VcIj5cbiAgICAgIFx0PGltZyBzcmM9XCIuL2Fzc2V0cy9yZWxvYWQuc3ZnXCIgYWx0PVwiRGF0dWFrIGVndW5lcmF0dVwiIGNsYXNzPVwibWFpbi1mb290ZXJfX3JlbG9hZFwiPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwibWFpbi1mb290ZXJfX3Jvd1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX19wb3dlcmVkLWJ5XCI+XG4gICAgICBcdFBXQSBnYXJhcGVuYSA8YSBvbmNsaWNrPVwid2luZG93LmxvY2F0aW9uPSdodHRwczovL3R3aXR0ZXIuY29tL2FzaWVybXVzYSdcIiBocmVmPVwiI1wiPkBhc2llcm11c2E8L2E+IHxcbiAgICAgIFx0ZWl0YiBBUElhIDxhIG9uY2xpY2s9XCJ3aW5kb3cubG9jYXRpb249J2h0dHBzOi8vdHdpdHRlci5jb20vZXJyYWxpbidcIiBocmVmPVwiI1wiPkBlcnJhbGluPC9hPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZm9vdGVyPlxuICBgXG59XG4iLCJpbXBvcnQge2NhdGVnb3JpZXN9IGZyb20gJy4vY2F0ZWdvcmllcyc7XG5pbXBvcnQge3NlbGVjdFByb2dyYW19IGZyb20gJy4vdHZQcm9ncmFtJ1xuaW1wb3J0IHtzZWxlY3RFcGlzb2RlfSBmcm9tICcuL3R2UHJvZ3JhbUVwaXNvZGUnXG5pbXBvcnQge2NhdGVnb3JpZXNTaW5nbGV9IGZyb20gJy4vY2F0ZWdvcmllc1NpbmdsZSdcblxuY29uc3QgYyA9IGNvbnNvbGUubG9nLFxuICBkID0gZG9jdW1lbnQsXG4gIG4gPSBuYXZpZ2F0b3IsXG4gIHcgPSB3aW5kb3dcblxuY29uc3QgZmlsdGVyaW5nID0gKHVsKSA9PiB7XG5cbiAgZC5nZXRFbGVtZW50QnlJZCgnZmluZC1wcm9ncmFtcycpLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcblxuICAgIGxldCBqc29uID0gSlNPTi5wYXJzZSggbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvY2FsSnNvbicpKSxcbiAgICAgIGxpc3RhID0gbnVsbCxcbiAgICAgIHRwbCA9ICcnXG5cbiAgICBsaXN0YSA9IGpzb24ubWVtYmVyLmZpbHRlciggbGlzdCA9PiB7XG4gICAgICByZXR1cm4gbGlzdC50aXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpXG4gICAgfSlcblxuICAgIGxpc3RhLmZvckVhY2goanNvbiA9PiB7XG4gICAgICB0cGwgKz1cbiAgICAgIGBcbiAgICAgIDxsaT5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cInByb2dyYW0taWRcIiBkYXRhLXByb2dyYW09XCIke2pzb25bXCJAaWRcIl19XCI+XG4gICAgICAgICR7anNvbi50aXRsZX1cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICAgIGBcbiAgICB9KVxuXG4gICAgZC5xdWVyeVNlbGVjdG9yKHVsKS5pbm5lckhUTUwgPSB0cGxcbiAgICBkLnF1ZXJ5U2VsZWN0b3IoJy50dl9faGVhZGVyJykuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwidHZfX251bWJlclwiPiR7bGlzdGEubGVuZ3RofTwvc3Bhbj4gc2FpbyBlcmFrdXN0ZW5gXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB0diA9ICgpID0+IHtcblxuICBjb25zdCByZWFkeVN0YXRlID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXG4gICAgaWYgKCBkLnJlYWR5U3RhdGUgID09PSAnY29tcGxldGUnICkge1xuXG4gICAgICBjbGVhckludGVydmFsKHJlYWR5U3RhdGUpXG5cbiAgICAgIC8vUHJvZ3JhbWEgZXJha3V0c2kgKGJ1a2xlYSlcbiAgICAgIGZ1bmN0aW9uIGdldFByb2dyYW1zKGpzb24pIHtcblxuICAgICAgICBsZXQgdHBsID0gJydcblxuICAgICAgICBKU09OLnBhcnNlKGpzb24pLm1lbWJlci5mb3JFYWNoKGpzb24gPT4ge1xuXG4gICAgICAgICAgdHBsICs9IGBcbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cInByb2dyYW0taWRcIiBkYXRhLXByb2dyYW09XCIke2pzb25bXCJAaWRcIl19XCI+XG4gICAgICAgICAgICAgICAgJHtqc29uLnRpdGxlfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgYFxuICAgICAgICB9KVxuXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLnR2X19saXN0JykuaW5uZXJIVE1MID0gdHBsXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLnR2X19oZWFkZXInKS5pbm5lckhUTUwgPSBgU2FpbyBndXp0aWFrIGVyYWt1c3RlbiA8c3BhbiBjbGFzcz1cInR2X19udW1iZXJcIj4oJHtKU09OLnBhcnNlKCBqc29uICkubWVtYmVyLmxlbmd0aH0pPC9zcGFuPmBcbiAgICAgICAgLy9Mb2FkZXIgZXprdXRhdHVcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXR2JykuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNob3cnKVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtdHYnKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG4gICAgICAgIC8vRm9vdGVycmVhbiBBUElhcmVuIGVndW5lcmFrZXRhIGRhdGEgYmlzdGFyYXR1XG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLm1haW4tZm9vdGVyX190ZXh0JykuY2xhc3NMaXN0LmFkZCgnaXMtY2FjaGUnKVxuICAgICAgfVxuXG4gICAgICAvL1Byb2dyYW1hayBla2FycmlcbiAgICAgIGZ1bmN0aW9uIGZldGNoQWxsUHJvZ3JhbXMoZGF0YSwgcmVxdWVzdEZyb21CR1N5bmMsIHJlc2V0KSB7XG5cbiAgICAgICAgbGV0IHRwbCA9ICcnXG5cbiAgICAgICAgLy9Mb2FkZXIgZXJha3V0c2lcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXRlbXBsYXRlLXR2JykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdHYnKS5jbGFzc0xpc3QuYWRkKCdsb2FkZXItc2hvdycpXG4gICAgICAgIC8vQmVoYXJyZXprbyBzZWt6aW9hayBlemt1dGF0dVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uJykuZm9yRWFjaCggc2VjdGlvbiA9PiB7XG4gICAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCd1LWhpZGUnKVxuICAgICAgICB9KVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yaWVzJykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcudHYnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuXG4gICAgICAgIC8vQVBJYSBkZWl0dSBiZWhhciBiYWRhLi4uXG4gICAgICAgIGlmKHJlc2V0KSB7XG5cbiAgICAgICAgICBmZXRjaChkYXRhKVxuICAgICAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSApXG4gICAgICAgICAgICAudGhlbihqc29uID0+IHtcblxuICAgICAgICAgICAgICBpZiAoICFyZXF1ZXN0RnJvbUJHU3luYyApIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndHYnKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xvY2FsSnNvbicsIEpTT04uc3RyaW5naWZ5KGpzb24pKTtcblxuICAgICAgICAgICAgICBsZXQgc2F2ZWREYXRlID0gbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICBkYXRlID0gc2F2ZWREYXRlLmdldEZ1bGxZZWFyKCkgKyAnLycgKyAoJzAnICsgKHNhdmVkRGF0ZS5nZXRNb250aCgpKzEpKS5zbGljZSgtMikgKyAnLycgKyAoJzAnICsgc2F2ZWREYXRlLmdldERhdGUoKSkuc2xpY2UoLTIpICsgJyAtICcsXG4gICAgICAgICAgICAgICAgdGltZSA9ICgnMCcgKyBzYXZlZERhdGUuZ2V0SG91cnMoKSkuc2xpY2UoLTIpICsgXCI6XCIgKyAoJzAnICsgc2F2ZWREYXRlLmdldE1pbnV0ZXMoKSkuc2xpY2UoLTIpLFxuICAgICAgICAgICAgICAgIGRhdGVUaW1lID0gZGF0ZSArICcgJyArIHRpbWVcblxuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImpzb25EYXRlXCIsIGRhdGVUaW1lKVxuICAgICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5zYXZlZC1kYXRlJykuaW5uZXJIVE1MID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJqc29uRGF0ZVwiKVxuXG4gICAgICAgICAgICAgIGdldFByb2dyYW1zKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2NhbEpzb24nKSlcblxuICAgICAgICAgICAgICAvL05vdGlmaWthemlvIGJpZGV6IG9oYXJ0YXJhemlcbiAgICAgICAgICAgICAgaWYoIHcuTm90aWZpY2F0aW9uICYmIE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uICE9PSAnZGVuaWVkJyApIHtcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oc3RhdHVzID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cylcbiAgICAgICAgICAgICAgICAgIGxldCBuID0gbmV3IE5vdGlmaWNhdGlvbignTmFoaWVyYW4nLCB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHk6ICdQcm9ncmFtYSB6ZXJyZW5kYSBlZ3VuZXJhdHUgZGEgOiknLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnLi9hc3NldHMvZmF2aWNvbi5wbmcnXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3R2JywgZGF0YSlcbiAgICAgICAgICB9KVxuXG4gICAgICAgIC8vUHJvZ3JhbWFrIGxvY2FsLWVhbiBnb3JkZXRhIGJhZGFnb1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBnZXRQcm9ncmFtcyhkYXRhKVxuICAgICAgICB9XG5cbiAgICAgIH0vL2ZldGNoQWxsUHJvZ3JhbXNcblxuICAgICAgLy9GaWx0cm9hIGVnaW5cbiAgICAgIGZpbHRlcmluZygnLnR2X19saXN0JylcblxuICAgICAgLy9Hb3JkZXRha28gQVBJYSBlemFiYXR1IGV0YSBiZXJyaWEgZWthcnR6ZWtvIC0gRVpBQkFUVVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlU3RvcmFnZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYgKCBjb25maXJtKCdQcm9ncmFtYSB6ZXJyZW5kYSBlZ3VuZXJhdHUgbmFoaSBhbCBkdXp1PycpID09IHRydWUpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnbG9jYWxKc29uJylcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnanNvbkRhdGUnKVxuXG4gICAgICAgICAgLy9CaWRlbyBtYXJ0eGFuIGJhZGFnbyBlcmUsIGdlcmF0dVxuICAgICAgICAgIGQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWRlb1wiKS5wYXVzZSgpXG5cbiAgICAgICAgICBsZXQgcmVzZXQgPSB0cnVlLFxuICAgICAgICAgICAgZGF0YT0gJy8vc3RpbGwtY2FzdGxlLTk5NzQ5Lmhlcm9rdWFwcC5jb20vcGxheWxpc3QnXG5cbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndHYnLCBkYXRhKVxuXG4gICAgICAgICAgZmV0Y2hBbGxQcm9ncmFtcyhkYXRhLCBmYWxzZSwgcmVzZXQpXG5cbiAgICAgICAgICAvL0JhY2tncm91bmQgU3luYyAocHJvZ3JhbWFrKVxuICAgICAgICAgIGlmICggJ3NlcnZpY2VXb3JrZXInIGluIG4gJiYgJ1N5bmNNYW5hZ2VyJyBpbiB3ICkge1xuICAgICAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJCR1N5bmMgKCkge1xuICAgICAgICAgICAgICBuLnNlcnZpY2VXb3JrZXIucmVhZHlcbiAgICAgICAgICAgICAgLnRoZW4ocmVnaXN0cmF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uLnN5bmMucmVnaXN0ZXIoJ25haGllcmFuLXR2JylcbiAgICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IGMoJ0Vycm9yZWEgYXR6ZWtvIHNpbmtyb25pemF6aW9hIGVycmVnaXN0cmF0emVhbicsIGVycikgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVnaXN0ZXJCR1N5bmMoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy9BcGxpa2F6aW9yYSBzYXJ0emVuIGRlbmVhbiBlZ2luIGJlaGFycmVrb2EgKEFQSWEgZGVpdHUgZWRvIGV6KVxuICAgICAgaWYobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvY2FsSnNvbicpKXtcbiAgICAgICAgZmV0Y2hBbGxQcm9ncmFtcyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9jYWxKc29uJyksIGZhbHNlLCBmYWxzZSlcbiAgICAgIH1lbHNle1xuICAgICAgICBsZXQgcmVzZXQgPSB0cnVlLFxuICAgICAgICAgIGRhdGE9ICcvL3N0aWxsLWNhc3RsZS05OTc0OS5oZXJva3VhcHAuY29tL3BsYXlsaXN0J1xuXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0dicsIGRhdGEpXG5cbiAgICAgICAgZmV0Y2hBbGxQcm9ncmFtcyhkYXRhLCBmYWxzZSwgcmVzZXQpXG5cbiAgICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKHByb2dyYW1haylcbiAgICAgICAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiAmJiAnU3luY01hbmFnZXInIGluIHcgKSB7XG4gICAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJCR1N5bmMgKCkge1xuICAgICAgICAgICAgbi5zZXJ2aWNlV29ya2VyLnJlYWR5XG4gICAgICAgICAgICAudGhlbihyZWdpc3RyYXRpb24gPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uLnN5bmMucmVnaXN0ZXIoJ25haGllcmFuLXR2JylcbiAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4gYygnU2luY3Jvbml6YWNp77+9biBkZSBGb25kbyBSZWdpc3RyYWRhJykgKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IGMoJ0ZhbGxvIGxhIFNpbmNyb25pemFjae+/vW4gZGUgRm9uZG8nLCBlcnIpIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlZ2lzdGVyQkdTeW5jKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKHByb2dyYW1haylcbiAgICAgIG4uc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZSA9PiB7XG4gICAgICAgIGMoJ0F0emVrbyBzaW5rcm9uaXphemlvYSBtZXNzYWdlIGJpZGV6OiAnLCBlLmRhdGEpXG4gICAgICAgIGlmKCBlLmRhdGEgPT09ICdvbmxpbmUgbmFoaWVyYW4tdHYnIClcbiAgICAgICAgICBmZXRjaEFsbFByb2dyYW1zKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndHYnKSwgdHJ1ZSwgZmFsc2UgKVxuICAgICAgfSlcblxuICAgIH0gLy9yZWFkeVN0YXRlXG4gIH0sIDEwMCApLy9pbnRlcnZhbFxuXG4gIHJldHVybiBgXG4gICAgJHtjYXRlZ29yaWVzKCl9XG4gICAgPGRpdiBjbGFzcz1cInR2IHNlY3Rpb25cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0dl9fZm9ybVwiPlxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImZpbmQtcHJvZ3JhbXNcIiBjbGFzcz1cInR2X19pbnB1dFwiIHBsYWNlaG9sZGVyPVwiZWl0YmtvIHNhaW9lbiBhcnRlYW4gYmlsYXR1Li4uXCIgdGl0bGU9XCJTYWlvYWsgYmlsYXR1XCI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxoZWFkZXIgY2xhc3M9XCJzZWN0aW9uLWhlYWRlciB0dl9faGVhZGVyXCI+PC9oZWFkZXI+XG4gICAgICA8dWwgY2xhc3M9XCJ0dl9fbGlzdFwiPjwvdWw+XG4gICAgICA8ZGl2IGNsYXNzPVwibG9hZGVyLXRlbXBsYXRlIGxvYWRlci10ZW1wbGF0ZS10dlwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibG9hZGVyIGxvYWRlci10dlwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgJHtzZWxlY3RQcm9ncmFtKCl9XG4gICAgJHtzZWxlY3RFcGlzb2RlKCl9XG4gICAgJHtjYXRlZ29yaWVzU2luZ2xlKCl9XG4gICAgYFxufVxuIiwiY29uc3QgYyA9IGNvbnNvbGUubG9nLFxuICBkID0gZG9jdW1lbnQsXG4gIG4gPSBuYXZpZ2F0b3IsXG4gIHcgPSB3aW5kb3dcblxuZXhwb3J0IGNvbnN0IHNlbGVjdFByb2dyYW0gPSAoKSA9PiB7XG5cbiAgY29uc3QgYWpheExvYWRpbmcgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cbiAgICBpZiAoIGQucmVhZHlTdGF0ZSAgPT09ICdjb21wbGV0ZScgKSB7XG5cbiAgICAgIGNsZWFySW50ZXJ2YWwoYWpheExvYWRpbmcpXG4gICAgICBcbiAgICAgIC8vUHJvZ3JhbWEgZWthcnJpICh6ZXJyZW5kYSlcbiAgICAgIGZ1bmN0aW9uIGZldGNoUHJvZ3JhbShkYXRhLCByZXF1ZXN0RnJvbUJHU3luYykge1xuXHQgXHRcdFxuICAgICAgICBsZXQgdHBsID0gJycsXG4gICAgICAgICAgZGF0ZSA9ICcnXG4gICAgICAgIFxuICAgICAgICAvL0JlaGFycmV6a28gc2VremlvYWsgZXprdXRhdHVcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbicpLmZvckVhY2goIHNlY3Rpb24gPT4ge1xuICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgndS1oaWRlJylcbiAgICAgICAgfSlcbiAgICAgICAgXG4gICAgICAgIC8vTG9hZGVyIGVyYWt1dHNpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci1wcm9ncmFtJykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtcHJvZ3JhbScpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgICAgICBcbiAgICAgICAgZmV0Y2goZGF0YSlcbiAgICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpIClcbiAgICAgICAgICAudGhlbihqc29uID0+IHtcblx0XHRcdFx0XHRcbiAgICAgICAgICAgIGlmICggIXJlcXVlc3RGcm9tQkdTeW5jICkge1xuICBcdFx0XHRcdFx0ICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndHYtcHJvZ3JhbScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXHRcdFxuICBcdFx0XHRcdCAgZC5xdWVyeVNlbGVjdG9yKCcucHJvZ3JhbScpLmNsYXNzTGlzdC5yZW1vdmUoJ3UtaGlkZScpXG4gIFx0XHRcdFx0ICAvL0xvYWRlciBlemt1dGF0dVxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXByb2dyYW0nKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtcHJvZ3JhbScpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zaG93JylcbiAgXG4gICAgICAgICAgICBqc29uLm1lbWJlci5mb3JFYWNoKGpzb24gPT4ge1xuICAgICAgICAgICAgICBpZihqc29uLmJyb2FkY2FzdF9kYXRlKSB7IFxuICAgICAgICAgICAgICAgIGRhdGUgPSBqc29uLmJyb2FkY2FzdF9kYXRlLnNsaWNlKDAsMTApIFxuICBcdFx0XHRcdCAgXHR9XG4gICAgICAgICAgICAgIHRwbCArPSBgXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiY3VzdG9tLWVwaXNvZGVcIiBkYXRhLWVwaXNvZGU9XCIke2pzb25bXCJAaWRcIl19XCI+XG4gICAgICBcdFx0XHRcdFx0ICA8ZGl2IGNsYXNzPVwicHJvZ3JhbV9faW1hZ2VcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2pzb24uZXBpc29kZV9pbWFnZX1cIiBjbGFzcz1cInByb2dyYW1fX2ltZyBjdXN0b20tZXBpc29kZVwiIGRhdGEtZXBpc29kZT1cIiR7anNvbltcIkBpZFwiXX1cIj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICBcdFx0XHRcdFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyYW1fX2NvbnRlbnQgY3VzdG9tLWVwaXNvZGVcIiBkYXRhLWVwaXNvZGU9XCIke2pzb25bXCJAaWRcIl19XCI+XG4gICAgICAgICAgICAgICAgICAgICR7anNvbi50aXRsZX1cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmFtX19kYXRlXCI+JHtkYXRlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICB9KVxuICBcbiAgICAgICAgICBcdGQucXVlcnlTZWxlY3RvcignLnByb2dyYW1fX2xpc3QnKS5pbm5lckhUTUwgPSB0cGxcbiAgICAgICAgICBcdGQucXVlcnlTZWxlY3RvcignLnByb2dyYW1fX2hlYWRlcicpLmlubmVySFRNTCA9IGBcbiAgICAgICAgICBcdFx0PGRpdiBjbGFzcz1cInByb2dyYW1fX3RpdGxlXCI+JHtqc29uLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmFtX19kZXNjXCI+JHtqc29uLmRlc2NfZ3JvdXB9PC9kaXY+XG4gICAgICAgICAgICAgIGBcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSlcblx0XHQgIH1cblxuICAgICAgZC5nZXRFbGVtZW50QnlJZChcImFwcFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGlmKCBlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3Byb2dyYW0taWQnKSApIHtcbiAgXHRcdCAgICBcbiAgXHRcdCAgICBsZXQgZGF0YSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1wcm9ncmFtJylcbiAgXG4gIFx0XHQgIFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3R2LXByb2dyYW0nLCBkYXRhKVxuICBcdFx0ICBcdFxuICAgICAgICAgIGZldGNoUHJvZ3JhbSggZGF0YSwgZmFsc2UpXG4gICAgICAgICAgXG4gICAgICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKHByb2dyYW1haylcbiAgICAgICAgICBpZiAoICdzZXJ2aWNlV29ya2VyJyBpbiBuICYmICdTeW5jTWFuYWdlcicgaW4gdyApIHtcbiAgXHRcdFx0ICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQkdTeW5jICgpIHtcbiAgXHRcdFx0ICAgICAgbi5zZXJ2aWNlV29ya2VyLnJlYWR5XG4gIFx0XHRcdCAgICAgICAgLnRoZW4ocmVnaXN0cmF0aW9uID0+IHtcbiAgXHRcdFx0ICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb24uc3luYy5yZWdpc3RlcignbmFoaWVyYW4tdHYtcHJvZ3JhbScpXG4gIFx0XHRcdCAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCBlcnIgPT4gYygnRXJyb3JlYSBhdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR6ZWFuJywgZXJyKSApXG4gIFx0XHRcdCAgICAgICAgfSlcbiAgXHRcdFx0ICAgIH1cbiAgXHRcdFx0ICAgIHJlZ2lzdGVyQkdTeW5jKClcbiAgXHRcdFx0ICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAvL0JhY2tncm91bmQgU3luYyAocHJvZ3JhbWFrKVxuICAgICAgbi5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBlID0+IHtcblx0XHQgICAgY29uc29sZS5sb2coJ0F0emVrbyBzaW5rcm9uaXphemlvYSBtZXNzYWdlIGJpZGV6IGFrdGliYXR1YTogJywgZS5kYXRhKVxuXHRcdCAgICBpZiggZS5kYXRhID09PSAnb25saW5lIG5haGllcmFuLXR2LXByb2dyYW0nIClcblx0XHQgICAgXHRmZXRjaFByb2dyYW0oIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0di1wcm9ncmFtJyksIHRydWUgKVxuXHRcdCAgfSlcbiAgICB9IC8vcmVhZHlTdGF0ZVxuICB9LCAxMDAgKS8vaW50ZXJ2YWxcblxuICByZXR1cm4gYFxuICAgIDxkaXYgY2xhc3M9XCJsb2FkZXItdGVtcGxhdGUgbG9hZGVyLXRlbXBsYXRlLXByb2dyYW1cIj5cbiAgXHQgIDxkaXYgY2xhc3M9XCJsb2FkZXIgbG9hZGVyLXByb2dyYW1cIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicHJvZ3JhbSBzZWN0aW9uIHUtaGlkZVwiPlxuICBcdCAgPGhlYWRlciBjbGFzcz1cInNlY3Rpb24taGVhZGVyIHByb2dyYW1fX2hlYWRlclwiPjwvaGVhZGVyPlxuICAgICAgPHVsIGNsYXNzPVwicHJvZ3JhbV9fbGlzdFwiPjwvdWw+XG4gICAgPC9kaXY+XG4gICAgYFxufVxuIiwiY29uc3QgYyA9IGNvbnNvbGUubG9nLFxuICBkID0gZG9jdW1lbnQsXG4gIG4gPSBuYXZpZ2F0b3IsXG4gIHcgPSB3aW5kb3dcblxuZXhwb3J0IGNvbnN0IHNlbGVjdEVwaXNvZGUgPSAoKSA9PiB7XG5cbiAgY29uc3QgcmVhZHlTdGF0ZSA9IHNldEludGVydmFsKCgpID0+IHtcblxuICAgIGlmICggZC5yZWFkeVN0YXRlICA9PT0gJ2NvbXBsZXRlJyApIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwocmVhZHlTdGF0ZSlcbiAgICAgIFxuICAgICAgLy9BdHplcmEgam9hbiAocHJvZ3JhbWV0YXJhKVxuICAgICAgZC5nZXRFbGVtZW50QnlJZCgnZXBpc29kZV9fYmFjaycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgLy9CZWhhcnJlemtvIHNla3ppb2FrIGV6a3V0YXR1XG4gICAgICAgIGQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24nKS5mb3JFYWNoKCBzZWN0aW9uID0+IHtcbiAgICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ3UtaGlkZScpXG4gICAgICAgICAgZC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpLnBhdXNlKClcbiAgICAgICAgfSlcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcucHJvZ3JhbScpLmNsYXNzTGlzdC5yZW1vdmUoJ3UtaGlkZScpXG4gICAgICB9KVxuICAgICAgXG4gICAgICAvL2VwaXNvZGUga2FyZ2F0dVxuICAgICAgZnVuY3Rpb24gZmV0Y2hFcGlzb2RlKGRhdGEsIHJlcXVlc3RGcm9tQkdTeW5jKSB7XG5cbiAgICAgICAgbGV0IHRwbCA9ICcnXG4gICAgICAgIC8vTG9hZGVyIGVyYWt1dHNpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci1lcGlzb2RlJykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtZXBpc29kZScpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgXG4gICAgICAgIC8vQmVoYXJyZXprbyBzZWt6aW9hayBlemt1dGF0dVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uJykuZm9yRWFjaCggc2VjdGlvbiA9PiB7XG4gICAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCd1LWhpZGUnKVxuICAgICAgICB9KVxuICAgICAgICBcbiAgICAgICAgLy9BUElhIGRlaXR1IChlcGlzb2RlKVxuICAgICAgICBmZXRjaChkYXRhKVxuICAgICAgICBcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG5cbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLmVwaXNvZGUnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuXG4gICAgICAgICAgICBpZiAoIXJlcXVlc3RGcm9tQkdTeW5jKSB7XG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0di1wcm9ncmFtLWVwaXNvZGUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL0xvYWRlciBlemt1dGF0dVxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLWVwaXNvZGUnKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtZXBpc29kZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zaG93JylcblxuICAgICAgICAgICAgbGV0IHVybEVuZCA9IGpzb24udXJsLnNsaWNlKC0zKTtcblxuICAgICAgICAgICAgaWYodXJsRW5kID09PSAnbXA0Jykge1xuICAgICAgICAgICAgICB1cmxFbmQgPSBqc29uLnVybFxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIHVybEVuZCA9IGpzb24uZm9ybWF0c1s3XS51cmxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHBsID0gYFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXBpc29kZV9fdmlkZW9cIj5cbiAgICAgICAgICAgICAgICA8dmlkZW8gaWQ9XCJ2aWRlb1wiIGF1dG9wbGF5IHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBjb250cm9scyBwb3N0ZXI9XCIke2pzb24udGh1bWJuYWlsc1swXS51cmx9XCI+XG4gICAgICAgICAgICAgICAgICA8c291cmNlIHNyYz1cIiR7dXJsRW5kfVwiIHR5cGU9XCJ2aWRlby9tcDRcIj5cbiAgICAgICAgICAgICAgICAgIFp1cmUgbmFiaWdhenRhaWxlYWsgZXppbiBkdSBiaWRlb3JpayBlcmFrdXRzaSA6KFxuICAgICAgICAgICAgICAgIDwvdmlkZW8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICBgXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5lcGlzb2RlX19wbGF5JykuaW5uZXJIVE1MID0gdHBsXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5lcGlzb2RlX19oZWFkZXInKS5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlcGlzb2RlX190aXRsZVwiPiR7anNvbi50aXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVwaXNvZGVfX2Rlc2NcIj4ke2pzb24uZGVzY3JpcHRpb259PC9kaXY+XG4gICAgICAgICAgICAgIGBcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3R2LXByb2dyYW0tZXBpc29kZScsIGRhdGEpXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5lcGlzb2RlX19wbGF5JykuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJlcnJvclwiPktvbmV4aW9hayBodXRzIGVnaW4gZHU8L2Rpdj4nXG4gICAgICAgICAgfSlcbiAgICAgIH0gLy9mZXRjaEVwaXNvZGVcbiAgICAgIFxuICAgICAgLy9Qcm9ncmFtYSB6ZXJyZW5kYXRpayBlcGlzb2RlIGVrYXJyaSAoY2xpY2spXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmFtX19saXN0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICBpZiggZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjdXN0b20tZXBpc29kZScpICkge1xuXG4gICAgICAgICAgbGV0IGRhdGEgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZXBpc29kZScpXG5cbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndHYtcHJvZ3JhbS1lcGlzb2RlJywgZGF0YSlcbiAgICAgICAgICBmZXRjaEVwaXNvZGUoZGF0YSwgZmFsc2UpXG4gICAgICAgICAgXG4gICAgICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKGVwaXNvZGUpXG4gICAgICAgICAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiAmJiAnU3luY01hbmFnZXInIGluIHcgKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiByZWdpc3RlckJHU3luYyAoKSB7XG4gICAgICAgICAgICAgIG4uc2VydmljZVdvcmtlci5yZWFkeVxuICAgICAgICAgICAgICAudGhlbihyZWdpc3RyYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb24uc3luYy5yZWdpc3RlcignbmFoaWVyYW4tdHYtcHJvZ3JhbS1lcGlzb2RlJylcbiAgICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IGMoJ0Vycm9yZWEgYXR6ZWtvIHNpbmtyb25pemF6aW9hIGVycmVnaXN0cmF0emVhbicsIGVycikgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVnaXN0ZXJCR1N5bmMoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChlcGlzb2RlKVxuICAgICAgbi5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBlID0+IHtcbiAgICAgICAgYygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIG1lc3NhZ2UgYmlkZXo6ICcsIGUuZGF0YSlcbiAgICAgICAgaWYoIGUuZGF0YSA9PT0gJ29ubGluZSBuYWhpZXJhbi10di1wcm9ncmFtLWVwaXNvZGUnKVxuICAgICAgICAgIGZldGNoRXBpc29kZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndHYtcHJvZ3JhbS1lcGlzb2RlJyksIHRydWUpXG4gICAgICB9KVxuICAgICAgXG4gICAgfSAvL3JlYWR5U3RhdGVcbiAgfSwgMTAwICkvL2ludGVydmFsXG5cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGNsYXNzPVwibG9hZGVyLXRlbXBsYXRlIGxvYWRlci10ZW1wbGF0ZS1lcGlzb2RlXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibG9hZGVyIGxvYWRlci1lcGlzb2RlXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgXG4gICAgPGRpdiBjbGFzcz1cImVwaXNvZGUgc2VjdGlvbiB1LWhpZGVcIj5cbiAgICAgIDxoZWFkZXIgY2xhc3M9XCJzZWN0aW9uLWhlYWRlciBlcGlzb2RlX19oZWFkZXJcIj48L2hlYWRlcj5cbiAgICAgIDxkaXYgY2xhc3M9XCJlcGlzb2RlX19wbGF5XCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZXBpc29kZV9fbmF2XCI+PGEgaHJlZj1cIiNcIiBpZD1cImVwaXNvZGVfX2JhY2tcIj48IEF0emVyYTwvYT48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICBgXG59XG4iLCJpbXBvcnQgeyBpbml0LCBwd2EsIGlzT25saW5lIH0gZnJvbSAnLi9jb21wb25lbnRzL2luaXQnO1xuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykuaW5uZXJIVE1MID0gaW5pdCgpXG5cbi8vQXBsaWt6aW9hIHdlYiBwcm9ncmVzaWJvYSBlcnJlZ2lzdHJhdHVcbnB3YSgpXG5cbi8vT25saW5lL2ZmbGluZSBnYXVkZW4gemVoYXp0dVxuaXNPbmxpbmUoKVxuIl19
