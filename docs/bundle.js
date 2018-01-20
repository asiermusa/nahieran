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
      var fetchCategory = function fetchCategory(jsonData, requestFromBGSync, catName) {

        var data = jsonData.slice(5),
            tpl = '';

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

var init = exports.init = function init(data) {

  var reloadApp = setInterval(function () {
    //Aplikazioa/leihoa eguneratu
    if (d.readyState === 'complete') {
      clearInterval(reloadApp);
      d.getElementById("reload-app").addEventListener('click', function (e) {
        location.reload();
      });
    }
  });

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
      var fetchProgram = function fetchProgram(jsonData, requestFromBGSync) {

        var data = jsonData.slice(5),
            tpl = '',
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

      //Programa ekarri (click ebentua)


      clearInterval(ajaxLoading);d.getElementById("app").addEventListener('click', function (e) {

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
      var fetchEpisode = function fetchEpisode(jsonData, requestFromBGSync) {

        var data = jsonData.slice(5),
            tpl = '';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29tcG9uZW50cy9jYXRlZ29yaWVzLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2F0ZWdvcmllc1NpbmdsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2luaXQuanMiLCJzcmMvanMvY29tcG9uZW50cy90di5qcyIsInNyYy9qcy9jb21wb25lbnRzL3R2UHJvZ3JhbS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3R2UHJvZ3JhbUVwaXNvZGUuanMiLCJzcmMvanMvc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFNLElBQUksUUFBUSxHQUFsQjtBQUFBLElBQ0UsSUFBSSxRQUROO0FBQUEsSUFFRSxJQUFJLFNBRk47QUFBQSxJQUdFLElBQUksTUFITjs7QUFLTyxJQUFNLGtDQUFhLFNBQWIsVUFBYSxHQUFNOztBQUU5QixNQUFNLGFBQWEsWUFBWSxZQUFNOztBQUVuQyxRQUFLLEVBQUUsVUFBRixLQUFrQixVQUF2QixFQUFvQzs7QUFFbEMsb0JBQWMsVUFBZDs7QUFFQSxVQUFJLE1BQU0sRUFBVjs7QUFFQTtBQUNBLFFBQUUsY0FBRixDQUFpQixnQkFBakIsRUFBbUMsZ0JBQW5DLENBQW9ELE9BQXBELEVBQTZELFVBQUMsQ0FBRCxFQUFPO0FBQ2xFLFVBQUUsYUFBRixDQUFnQixrQkFBaEIsRUFBb0MsU0FBcEMsQ0FBOEMsTUFBOUMsQ0FBcUQsU0FBckQ7O0FBRUE7QUFDQSxZQUFJLEVBQUUsYUFBRixDQUFnQixXQUFoQixFQUE2QixTQUE3QixDQUF1QyxRQUF2QyxDQUFnRCxXQUFoRCxDQUFKLEVBQWlFO0FBQy9ELFlBQUUsYUFBRixDQUFnQixXQUFoQixFQUE2QixTQUE3QixDQUF1QyxNQUF2QyxDQUE4QyxXQUE5QztBQUNELFNBRkQsTUFFTTtBQUNKLFlBQUUsYUFBRixDQUFnQixXQUFoQixFQUE2QixTQUE3QixDQUF1QyxHQUF2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QUNBOztBQUVBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgYyA9IGNvbnNvbGUubG9nLFxuICBkID0gZG9jdW1lbnQsXG4gIG4gPSBuYXZpZ2F0b3IsXG4gIHcgPSB3aW5kb3dcblxuZXhwb3J0IGNvbnN0IGNhdGVnb3JpZXMgPSAoKSA9PiB7XG5cbiAgY29uc3QgcmVhZHlTdGF0ZSA9IHNldEludGVydmFsKCgpID0+IHtcblxuICAgIGlmICggZC5yZWFkeVN0YXRlICA9PT0gJ2NvbXBsZXRlJyApIHtcblxuICAgICAgY2xlYXJJbnRlcnZhbChyZWFkeVN0YXRlKVxuXG4gICAgICBsZXQgdHBsID0gJydcblxuICAgICAgLy9OYWJpZ2F6aW8gYm90b2lhXG4gICAgICBkLmdldEVsZW1lbnRCeUlkKFwiY2F0ZWdvcmllcy1idG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5vZmYtY2FudmFzLW1lbnUnKS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1vcGVuJylcblxuICAgICAgICAvL0thdGVnb3JpYW4gaWtvbm9hIChtZW51IG9mZi1jYW52YXMpXG4gICAgICAgIGlmKCBkLnF1ZXJ5U2VsZWN0b3IoJy5uYXYtaWNvbicpLmNsYXNzTGlzdC5jb250YWlucyhcImlzLWFjdGl2ZVwiKSl7XG4gICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubmF2LWljb24nKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKVxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubmF2LWljb24nKS5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLy9zY2FwZSB0ZWtsYSBiaWRleiBpdHhpIG1lbnVhXG4gICAgICBkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAyNykge1xuICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLm9mZi1jYW52YXMtbWVudScpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKVxuICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLm5hdi1pY29uJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJylcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy9CZWhhcnJlemtvIHNla3ppb2FrIGV6a3V0YXR1XG4gICAgICBkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uJykuZm9yRWFjaCggc2VjdGlvbiA9PiB7XG4gICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgndS1oaWRlJylcbiAgICAgIH0pXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yaWVzJykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcbiAgICAgIGQucXVlcnlTZWxlY3RvcignLnR2JykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcblxuICAgICAgZmV0Y2goJy8vc3RpbGwtY2FzdGxlLTk5NzQ5Lmhlcm9rdWFwcC5jb20vcHJvZ3JhbS10eXBlLWxpc3QnKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpIClcbiAgICAgICAgLnRoZW4oanNvbiA9PiB7XG5cbiAgICAgICAgICBqc29uLm1lbWJlci5mb3JFYWNoKGpzb25DYXQgPT4ge1xuICAgICAgICAgICAgdHBsICs9IGBcbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNhdGVnb3J5LWlkXCIgZGF0YS1jYXRlZ29yeT1cIiR7anNvbkNhdFtcIkBpZFwiXX1cIj5cbiAgICAgICAgICAgICAgXHQke2pzb25DYXQudGl0bGV9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICBgXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLmNhdGVnb3JpZXNfX2xpc3QnKS5pbm5lckhUTUwgPSB0cGxcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKVxuXG4gICAgfSAvL3JlYWR5U3RhdGVcblxuICB9LCAxMDAgKS8vaW50ZXJ2YWxcblxuICByZXR1cm4gYFxuICAgIDxkaXYgY2xhc3M9XCJjYXRlZ29yaWVzIG9mZi1jYW52YXMtbWVudVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImxvYWRlclwiPjwvZGl2PlxuICAgICAgPHVsIGNsYXNzPVwiY2F0ZWdvcmllc19fbGlzdFwiPjwvdWw+XG4gICAgPC9kaXY+XG4gICAgYFxufVxuIiwiY29uc3QgYyA9IGNvbnNvbGUubG9nLFxuICBkID0gZG9jdW1lbnQsXG4gIG4gPSBuYXZpZ2F0b3IsXG4gIHcgPSB3aW5kb3dcblxuZXhwb3J0IGNvbnN0IGNhdGVnb3JpZXNTaW5nbGUgPSAoKSA9PiB7XG5cbiAgY29uc3QgcmVhZHlTdGF0ZSA9IHNldEludGVydmFsKCgpID0+IHtcblxuICAgIGlmICggZC5yZWFkeVN0YXRlICA9PT0gJ2NvbXBsZXRlJyApIHtcblxuICAgICAgY2xlYXJJbnRlcnZhbChyZWFkeVN0YXRlKVxuICAgICAgXG4gICAgICAvL0thdGVnb3JpYSB6ZXJyZW5kYSBla2FycmlcbiAgXHQgIGZ1bmN0aW9uIGZldGNoQ2F0ZWdvcnkoanNvbkRhdGEsIHJlcXVlc3RGcm9tQkdTeW5jLCBjYXROYW1lKSB7XG5cdFx0ICBcdFxuXHRcdCAgXHRsZXQgZGF0YSA9IGpzb25EYXRhLnNsaWNlKDUpLFxuXHRcdCAgXHQgIHRwbCA9ICcnXG4gICAgICAgICAgICAgIFxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5vZmYtY2FudmFzLW1lbnUnKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubmF2LWljb24nKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKVxuICAgICAgICAvL0xvYWRlciBlcmFrdXRzaVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItY2F0JykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtY2F0JykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICAvL0JlaGFycmV6a28gc2VremlvYWsgZXprdXRhdHVcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbicpLmZvckVhY2goIHNlY3Rpb24gPT4ge1xuICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgndS1oaWRlJylcbiAgICAgICAgfSlcbiAgICAgICAgXG4gICAgICAgIGZldGNoKGRhdGEpXG4gICAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSApXG4gICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG5cbiAgICAgICAgICAgIGlmICggIXJlcXVlc3RGcm9tQkdTeW5jICkge1xuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnY2F0ZWdvcnknKVxuICAgICAgXHRcdFx0fVxuICAgICAgXHRcdFxuICAgICAgICAgICAgLy9Mb2FkZXIgZXprdXRhdHVcbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci1jYXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtY2F0JykuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNob3cnKSAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLnNpbmdsZS1jYXQnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuICBcdFx0ICBcbiAgICAgICAgXHRcdGpzb24ubWVtYmVyLmZvckVhY2goanNvbkNhdCA9PiB7XG4gICAgICAgICAgICAgIHRwbCArPSBgXG4gICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cInByb2dyYW0taWRcIiBkYXRhLXByb2dyYW09XCIke2pzb25DYXRbXCJAaWRcIl19XCI+XG4gICAgICAgICAgICAgICAgICAgICR7anNvbkNhdC50aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIH0pXG4gIFxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuc2luZ2xlLWNhdF9fbGlzdCcpLmlubmVySFRNTCA9IHRwbFxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuc2luZ2xlLWNhdF9faGVhZGVyJykuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidHZfX3RpdGxlXCI+JHtjYXROYW1lfTwvZGl2PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR2X19udW1iZXJcIj4oJHtqc29uLm1lbWJlci5sZW5ndGh9KTwvc3Bhbj4gc2FpbyBlcmFrdXN0ZW5cbiAgICAgICAgICAgICAgYFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKVxuICAgICAgICAgIFxuICAgICAgfSAvL2ZldGNoQ2F0ZWdvcnlcblxuICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcmllc19fbGlzdCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYoIGQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWRlb1wiKSkgXG4gICAgICAgICAgZC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpLnBhdXNlKClcblx0XHQgIFxuICAgICAgICBpZiggZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjYXRlZ29yeS1pZCcpICkge1xuXHQgIFxuICAgICAgICAgIGxldCBkYXRhID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWNhdGVnb3J5JyksXG4gICAgICAgICAgICBjYXROYW1lID0gZS50YXJnZXQuaW5uZXJIVE1MXG4gICAgICAgICAgXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhdGVnb3J5JywgZGF0YSlcbiAgICAgICAgICBmZXRjaENhdGVnb3J5KCBkYXRhLCBmYWxzZSwgY2F0TmFtZSkgIFxuICAgICAgICAgIFxuICAgICAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChrYXRlZ29yaWEpXG4gICAgICAgICAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiAmJiAnU3luY01hbmFnZXInIGluIHcgKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiByZWdpc3RlckJHU3luYyAoKSB7XG4gICAgICAgICAgICAgIG4uc2VydmljZVdvcmtlci5yZWFkeVxuICAgICAgICAgICAgICAudGhlbihyZWdpc3RyYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb24uc3luYy5yZWdpc3RlcignbmFoaWVyYW4tY2F0ZWdvcnknKVxuICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIGVyciA9PiBjKCdFcnJvcmVhIGF0emVrbyBzaW5rcm9uaXphemlvYSBlcnJlZ2lzdHJhdHplYW4nLCBlcnIpIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlZ2lzdGVyQkdTeW5jKClcbiAgICAgICAgICB9ICAgICAgICBcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChrYXRlZ29yaWEpXG4gICAgICBuLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGUgPT4ge1xuXHRcdCAgICBjb25zb2xlLmxvZygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIG1lc3NhZ2UgYmlkZXogYWt0aWJhdHVhOiAnLCBlLmRhdGEpXG5cdFx0ICAgIGlmKCBlLmRhdGEgPT09ICdvbmxpbmUgbmFoaWVyYW4tY2F0ZWdvcnknKVxuXHRcdCAgICBcdGZldGNoQ2F0ZWdvcnkoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjYXRlZ29yeScpLCB0cnVlIClcblx0XHQgIH0pXG5cbiAgICB9IC8vcmVhZHlTdGF0ZVxuXG4gIH0sIDEwMCApIC8vaW50ZXJ2YWxcblxuICByZXR1cm4gYFxuICAgIDxkaXYgY2xhc3M9XCJsb2FkZXItdGVtcGxhdGUgbG9hZGVyLXRlbXBsYXRlLWNhdFwiPlxuICAgIFx0PGRpdiBjbGFzcz1cImxvYWRlciBsb2FkZXItY2F0XCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNpbmdsZS1jYXQgc2VjdGlvbiB1LWhpZGVcIj5cbiAgICAgIDxoZWFkZXIgY2xhc3M9XCJzZWN0aW9uLWhlYWRlciB0dl9faGVhZGVyIHNpbmdsZS1jYXRfX2hlYWRlclwiPjwvaGVhZGVyPlxuICAgICAgPHVsIGNsYXNzPVwidHZfX2xpc3Qgc2luZ2xlLWNhdF9fbGlzdFwiPjwvdWw+XG4gICAgPC9kaXY+XG4gICAgYFxufVxuIiwiaW1wb3J0IHt0dn0gZnJvbSAnLi90dic7XG5cbmNvbnN0IGMgPSBjb25zb2xlLmxvZyxcbiAgZCA9IGRvY3VtZW50LFxuICBuID0gbmF2aWdhdG9yLFxuICB3ID0gd2luZG93XG5cbmV4cG9ydCBjb25zdCBwd2EgPSAoKSA9PiB7XG4gIC8vU2VydmljZSBXb3JrZXJyYSBlcnJlZ2lzdHJhdHVcbiAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiApIHtcbiAgICBuLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJy4vc3cuanMnKVxuICAgIC50aGVuKCByZWdpc3RyYXRpb24gPT4ge1xuICAgICAgYygnU2VydmljZSBXb3JrZXIgZXJyZWdpc3RyYXR1YScsIHJlZ2lzdHJhdGlvbi5zY29wZSlcbiAgICB9KVxuICAgIC5jYXRjaCggZXJyID0+IGMoYFJlZ2lzdHJvIGRlIFNlcnZpY2UgV29ya2VyIGZhbGxpZG9gLCBlcnIpIClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgaXNPbmxpbmUgPSAoKSA9PiB7XG4gIC8vS29uZXhpb2FyZW4gZWdvZXJhIChvbmxpbmUvb2ZmbGluZSlcbiAgY29uc3QgbWV0YVRhZ1RoZW1lID0gZC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9dGhlbWUtY29sb3JdJylcblxuICBmdW5jdGlvbiBuZXR3b3JrU3RhdHVzIChlKSB7XG5cbiAgICBpZiAoIG4ub25MaW5lICkge1xuICAgICAgbWV0YVRhZ1RoZW1lLnNldEF0dHJpYnV0ZSgnY29udGVudCcsICcjZmZmZmZmJylcbiAgICAgIGQucXVlcnlTZWxlY3RvcihcIi5tYWluLWZvb3Rlcl9fc3RhdHVzXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJvZmZsaW5lXCIpXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoXCIub2ZmbGluZVwiKS5pbm5lckhUTUwgPSBcIlwiXG4gICAgfSBlbHNlIHtcbiAgICAgIG1ldGFUYWdUaGVtZS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnLCAnI2M5YzljOScpXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1mb290ZXJfX3N0YXR1c1wiKS5jbGFzc0xpc3QuYWRkKFwib2ZmbGluZVwiKVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKFwiLm9mZmxpbmVcIikuaW5uZXJIVE1MID0gXCI8ZGl2IGNsYXNzPSd0ZXh0Jz5TYXJlYSBiZXJyZXNrdXJhdHplbi4uLjwvZGl2PlwiXG4gICAgfVxuICB9XG5cbiAgdy5hZGRFdmVudExpc3RlbmVyKCdvbmxpbmUnLCBuZXR3b3JrU3RhdHVzKVxuICB3LmFkZEV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCBuZXR3b3JrU3RhdHVzKVxufVxuXG5leHBvcnQgY29uc3QgaW5pdCA9IChkYXRhKSA9PiB7XG4gIFxuICBjb25zdCByZWxvYWRBcHAgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgLy9BcGxpa2F6aW9hL2xlaWhvYSBlZ3VuZXJhdHVcbiAgICBpZiAoIGQucmVhZHlTdGF0ZSAgPT09ICdjb21wbGV0ZScgKSB7XG4gICAgICBjbGVhckludGVydmFsKHJlbG9hZEFwcClcbiAgICAgIGQuZ2V0RWxlbWVudEJ5SWQoXCJyZWxvYWQtYXBwXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKClcbiAgICAgIH0pXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBgXG4gIDxoZWFkZXIgY2xhc3M9XCJtYWluLWhlYWRlclwiPlxuICAgIDxkaXYgY2xhc3M9XCJtYWluLWhlYWRlcl9fY29sc1wiPlxuICAgICAgPGltZyBzcmM9XCIuL2Fzc2V0cy9laXRiLWxvZ28tYmx1ZS5zdmdcIiBhbHQ9XCJOYWhpZXJhblwiIGNsYXNzPVwibWFpbi1oZWFkZXJfX2xvZ29cIiBpZD1cInJlbG9hZC1hcHBcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwibWFpbi1oZWFkZXJfX3Nsb2dhblwiPm5haGllcmFuPC9zcGFuPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJtYWluLWhlYWRlcl9fY29scyByaWdodFwiPlxuICAgICAgPGRpdiBjbGFzcz1cIm5hdi1pY29uXCIgaWQ9XCJjYXRlZ29yaWVzLWJ0blwiPlxuICAgICAgXHQ8ZGl2IGNsYXNzPVwibmF2LWljb25fX2JhclwiPjwvZGl2PlxuICAgICAgXHQ8ZGl2IGNsYXNzPVwibmF2LWljb25fX2JhclwiPjwvZGl2PlxuICAgICAgXHQ8ZGl2IGNsYXNzPVwibmF2LWljb25fX2JhclwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvaGVhZGVyPlxuXG4gICR7dHYoKX1cblxuICA8Zm9vdGVyIGNsYXNzPVwibWFpbi1mb290ZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwibWFpbi1mb290ZXJfX3N0YXR1c1wiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJtYWluLWZvb3Rlcl9fcm93XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibWFpbi1mb290ZXJfX2NvbC1sb2dvXCI+XG4gICAgICBcdDxpbWcgc3JjPVwiLi9hc3NldHMvZWl0Yi1sb2dvLXdoaXRlLnN2Z1wiIGFsdD1cImVpdGIgbmFoaWVyYW5cIiBjbGFzcz1cIm1haW4tZm9vdGVyX19sb2dvXCI+XG4gICAgICBcdDxkaXYgY2xhc3M9XCJtYWluLWZvb3Rlcl9fdGV4dFwiPkF6a2VuIGVndW5lcmFrZXRhOlxuICAgICAgXHRcdDxzcGFuIGNsYXNzPVwic2F2ZWQtZGF0ZVwiPiR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJqc29uRGF0ZVwiKX08L3NwYW4+XG4gICAgICBcdDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwibWFpbi1mb290ZXJfX2NvbC1idG4gZGVsZXRlU3RvcmFnZVwiPlxuICAgICAgXHQ8aW1nIHNyYz1cIi4vYXNzZXRzL3JlbG9hZC5zdmdcIiBhbHQ9XCJEYXR1YWsgZWd1bmVyYXR1XCIgY2xhc3M9XCJtYWluLWZvb3Rlcl9fcmVsb2FkXCI+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJtYWluLWZvb3Rlcl9fcm93XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibWFpbi1mb290ZXJfX3Bvd2VyZWQtYnlcIj5cbiAgICAgIFx0UFdBIGdhcmFwZW5hIDxhIG9uY2xpY2s9XCJ3aW5kb3cubG9jYXRpb249J2h0dHBzOi8vdHdpdHRlci5jb20vYXNpZXJtdXNhJ1wiIGhyZWY9XCIjXCI+QGFzaWVybXVzYTwvYT4gfFxuICAgICAgXHRlaXRiIEFQSWEgPGEgb25jbGljaz1cIndpbmRvdy5sb2NhdGlvbj0naHR0cHM6Ly90d2l0dGVyLmNvbS9lcnJhbGluJ1wiIGhyZWY9XCIjXCI+QGVycmFsaW48L2E+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9mb290ZXI+XG4gIGBcbn1cbiIsImltcG9ydCB7Y2F0ZWdvcmllc30gZnJvbSAnLi9jYXRlZ29yaWVzJztcbmltcG9ydCB7c2VsZWN0UHJvZ3JhbX0gZnJvbSAnLi90dlByb2dyYW0nXG5pbXBvcnQge3NlbGVjdEVwaXNvZGV9IGZyb20gJy4vdHZQcm9ncmFtRXBpc29kZSdcbmltcG9ydCB7Y2F0ZWdvcmllc1NpbmdsZX0gZnJvbSAnLi9jYXRlZ29yaWVzU2luZ2xlJ1xuXG5jb25zdCBjID0gY29uc29sZS5sb2csXG4gIGQgPSBkb2N1bWVudCxcbiAgbiA9IG5hdmlnYXRvcixcbiAgdyA9IHdpbmRvd1xuXG5jb25zdCBmaWx0ZXJpbmcgPSAodWwpID0+IHtcblxuICBkLmdldEVsZW1lbnRCeUlkKCdmaW5kLXByb2dyYW1zJykuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuXG4gICAgbGV0IGpzb24gPSBKU09OLnBhcnNlKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9jYWxKc29uJykpLFxuICAgICAgbGlzdGEgPSBudWxsLFxuICAgICAgdHBsID0gJydcblxuICAgIGxpc3RhID0ganNvbi5tZW1iZXIuZmlsdGVyKCBsaXN0ID0+IHtcbiAgICAgIHJldHVybiBsaXN0LnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZS50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKSlcbiAgICB9KVxuXG4gICAgbGlzdGEuZm9yRWFjaChqc29uID0+IHtcbiAgICAgIHRwbCArPVxuICAgICAgYFxuICAgICAgPGxpPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwicHJvZ3JhbS1pZFwiIGRhdGEtcHJvZ3JhbT1cIiR7anNvbltcIkBpZFwiXX1cIj5cbiAgICAgICAgJHtqc29uLnRpdGxlfVxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICAgYFxuICAgIH0pXG5cbiAgICBkLnF1ZXJ5U2VsZWN0b3IodWwpLmlubmVySFRNTCA9IHRwbFxuICAgIGQucXVlcnlTZWxlY3RvcignLnR2X19oZWFkZXInKS5pbm5lckhUTUwgPSBgPHNwYW4gY2xhc3M9XCJ0dl9fbnVtYmVyXCI+JHtsaXN0YS5sZW5ndGh9PC9zcGFuPiBzYWlvIGVyYWt1c3RlbmBcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHR2ID0gKCkgPT4ge1xuXG4gIGNvbnN0IHJlYWR5U3RhdGUgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cbiAgICBpZiAoIGQucmVhZHlTdGF0ZSAgPT09ICdjb21wbGV0ZScgKSB7XG5cbiAgICAgIGNsZWFySW50ZXJ2YWwocmVhZHlTdGF0ZSlcblxuICAgICAgLy9Qcm9ncmFtYSBlcmFrdXRzaSAoYnVrbGVhKVxuICAgICAgZnVuY3Rpb24gZ2V0UHJvZ3JhbXMoanNvbikge1xuXG4gICAgICAgIGxldCB0cGwgPSAnJ1xuXG4gICAgICAgIEpTT04ucGFyc2UoanNvbikubWVtYmVyLmZvckVhY2goanNvbiA9PiB7XG5cbiAgICAgICAgICB0cGwgKz0gYFxuICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwicHJvZ3JhbS1pZFwiIGRhdGEtcHJvZ3JhbT1cIiR7anNvbltcIkBpZFwiXX1cIj5cbiAgICAgICAgICAgICAgICAke2pzb24udGl0bGV9XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICBgXG4gICAgICAgIH0pXG5cbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcudHZfX2xpc3QnKS5pbm5lckhUTUwgPSB0cGxcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcudHZfX2hlYWRlcicpLmlubmVySFRNTCA9IGBTYWlvIGd1enRpYWsgZXJha3VzdGVuIDxzcGFuIGNsYXNzPVwidHZfX251bWJlclwiPigke0pTT04ucGFyc2UoIGpzb24gKS5tZW1iZXIubGVuZ3RofSk8L3NwYW4+YFxuICAgICAgICAvL0xvYWRlciBlemt1dGF0dVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdHYnKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci10ZW1wbGF0ZS10dicpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zaG93JylcbiAgICAgICAgLy9Gb290ZXJyZWFuIEFQSWFyZW4gZWd1bmVyYWtldGEgZGF0YSBiaXN0YXJhdHVcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubWFpbi1mb290ZXJfX3RleHQnKS5jbGFzc0xpc3QuYWRkKCdpcy1jYWNoZScpXG4gICAgICB9XG5cbiAgICAgIC8vUHJvZ3JhbWFrIGVrYXJyaVxuICAgICAgZnVuY3Rpb24gZmV0Y2hBbGxQcm9ncmFtcyhkYXRhLCByZXF1ZXN0RnJvbUJHU3luYywgcmVzZXQpIHtcblxuICAgICAgICBsZXQgdHBsID0gJydcblxuICAgICAgICAvL0xvYWRlciBlcmFrdXRzaVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtdHYnKS5jbGFzc0xpc3QuYWRkKCdsb2FkZXItc2hvdycpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci10dicpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgLy9CZWhhcnJlemtvIHNla3ppb2FrIGV6a3V0YXR1XG4gICAgICAgIGQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24nKS5mb3JFYWNoKCBzZWN0aW9uID0+IHtcbiAgICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ3UtaGlkZScpXG4gICAgICAgIH0pXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmNhdGVnb3JpZXMnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy50dicpLmNsYXNzTGlzdC5yZW1vdmUoJ3UtaGlkZScpXG5cbiAgICAgICAgLy9BUElhIGRlaXR1IGJlaGFyIGJhZGEuLi5cbiAgICAgICAgaWYocmVzZXQpIHtcblxuICAgICAgICAgIGZldGNoKGRhdGEpXG4gICAgICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpIClcbiAgICAgICAgICAgIC50aGVuKGpzb24gPT4ge1xuXG4gICAgICAgICAgICAgIGlmICggIXJlcXVlc3RGcm9tQkdTeW5jICkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0dicpXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbG9jYWxKc29uJywgSlNPTi5zdHJpbmdpZnkoanNvbikpO1xuXG4gICAgICAgICAgICAgIGxldCBzYXZlZERhdGUgPSBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICAgIGRhdGUgPSBzYXZlZERhdGUuZ2V0RnVsbFllYXIoKSArICcvJyArICgnMCcgKyAoc2F2ZWREYXRlLmdldE1vbnRoKCkrMSkpLnNsaWNlKC0yKSArICcvJyArICgnMCcgKyBzYXZlZERhdGUuZ2V0RGF0ZSgpKS5zbGljZSgtMikgKyAnIC0gJyxcbiAgICAgICAgICAgICAgICB0aW1lID0gKCcwJyArIHNhdmVkRGF0ZS5nZXRIb3VycygpKS5zbGljZSgtMikgKyBcIjpcIiArICgnMCcgKyBzYXZlZERhdGUuZ2V0TWludXRlcygpKS5zbGljZSgtMiksXG4gICAgICAgICAgICAgICAgZGF0ZVRpbWUgPSBkYXRlICsgJyAnICsgdGltZVxuXG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwianNvbkRhdGVcIiwgZGF0ZVRpbWUpXG4gICAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLnNhdmVkLWRhdGUnKS5pbm5lckhUTUwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImpzb25EYXRlXCIpXG5cbiAgICAgICAgICAgICAgZ2V0UHJvZ3JhbXMobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvY2FsSnNvbicpKVxuXG4gICAgICAgICAgICAgIC8vTm90aWZpa2F6aW8gYmlkZXogb2hhcnRhcmF6aVxuICAgICAgICAgICAgICBpZiggdy5Ob3RpZmljYXRpb24gJiYgTm90aWZpY2F0aW9uLnBlcm1pc3Npb24gIT09ICdkZW5pZWQnICkge1xuICAgICAgICAgICAgICAgIE5vdGlmaWNhdGlvbi5yZXF1ZXN0UGVybWlzc2lvbihzdGF0dXMgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKVxuICAgICAgICAgICAgICAgICAgbGV0IG4gPSBuZXcgTm90aWZpY2F0aW9uKCdOYWhpZXJhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keTogJ1Byb2dyYW1hIHplcnJlbmRhIGVndW5lcmF0dSBkYSA6KScsXG4gICAgICAgICAgICAgICAgICAgIGljb246ICcuL2Fzc2V0cy9mYXZpY29uLnBuZydcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndHYnLCBkYXRhKVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgLy9Qcm9ncmFtYWsgbG9jYWwtZWFuIGdvcmRldGEgYmFkYWdvXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGdldFByb2dyYW1zKGRhdGEpXG4gICAgICAgIH1cblxuICAgICAgfS8vZmV0Y2hBbGxQcm9ncmFtc1xuXG4gICAgICAvL0ZpbHRyb2EgZWdpblxuICAgICAgZmlsdGVyaW5nKCcudHZfX2xpc3QnKVxuXG4gICAgICAvL0dvcmRldGFrbyBBUElhIGV6YWJhdHUgZXRhIGJlcnJpYSBla2FydHpla28gLSBFWkFCQVRVXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5kZWxldGVTdG9yYWdlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBpZiAoIGNvbmZpcm0oJ1Byb2dyYW1hIHplcnJlbmRhIGVndW5lcmF0dSBuYWhpIGFsIGR1enU/JykgPT0gdHJ1ZSkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdsb2NhbEpzb24nKVxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdqc29uRGF0ZScpXG5cbiAgICAgICAgICAvL0JpZGVvIG1hcnR4YW4gYmFkYWdvIGVyZSwgZ2VyYXR1XG4gICAgICAgICAgZC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpLnBhdXNlKClcblxuICAgICAgICAgIGxldCByZXNldCA9IHRydWUsXG4gICAgICAgICAgICBkYXRhPSAnLy9zdGlsbC1jYXN0bGUtOTk3NDkuaGVyb2t1YXBwLmNvbS9wbGF5bGlzdCdcblxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0dicsIGRhdGEpXG5cbiAgICAgICAgICBmZXRjaEFsbFByb2dyYW1zKGRhdGEsIGZhbHNlLCByZXNldClcblxuICAgICAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChwcm9ncmFtYWspXG4gICAgICAgICAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiAmJiAnU3luY01hbmFnZXInIGluIHcgKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiByZWdpc3RlckJHU3luYyAoKSB7XG4gICAgICAgICAgICAgIG4uc2VydmljZVdvcmtlci5yZWFkeVxuICAgICAgICAgICAgICAudGhlbihyZWdpc3RyYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb24uc3luYy5yZWdpc3RlcignbmFoaWVyYW4tdHYnKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oICgpID0+IGMoJ0F0emVrbyBzaW5rcm9uaXphemlvYSBlcnJlZ2lzdHJhdHVhJykgKVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKCBlcnIgPT4gYygnRXJyb3JlYSBhdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR6ZWFuJywgZXJyKSApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWdpc3RlckJHU3luYygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvL0FwbGlrYXppb3JhIHNhcnR6ZW4gZGVuZWFuIGVnaW4gYmVoYXJyZWtvYSAoQVBJYSBkZWl0dSBlZG8gZXopXG4gICAgICBpZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9jYWxKc29uJykpe1xuICAgICAgICBmZXRjaEFsbFByb2dyYW1zKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2NhbEpzb24nKSwgZmFsc2UsIGZhbHNlKVxuICAgICAgfWVsc2V7XG4gICAgICAgIGxldCByZXNldCA9IHRydWUsXG4gICAgICAgICAgZGF0YT0gJy8vc3RpbGwtY2FzdGxlLTk5NzQ5Lmhlcm9rdWFwcC5jb20vcGxheWxpc3QnXG5cbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3R2JywgZGF0YSlcblxuICAgICAgICBmZXRjaEFsbFByb2dyYW1zKGRhdGEsIGZhbHNlLCByZXNldClcblxuICAgICAgICAvL0JhY2tncm91bmQgU3luYyAocHJvZ3JhbWFrKVxuICAgICAgICBpZiAoICdzZXJ2aWNlV29ya2VyJyBpbiBuICYmICdTeW5jTWFuYWdlcicgaW4gdyApIHtcbiAgICAgICAgICBmdW5jdGlvbiByZWdpc3RlckJHU3luYyAoKSB7XG4gICAgICAgICAgICBuLnNlcnZpY2VXb3JrZXIucmVhZHlcbiAgICAgICAgICAgIC50aGVuKHJlZ2lzdHJhdGlvbiA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb24uc3luYy5yZWdpc3RlcignbmFoaWVyYW4tdHYnKVxuICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdTaW5jcm9uaXphY2nvv71uIGRlIEZvbmRvIFJlZ2lzdHJhZGEnKSApXG4gICAgICAgICAgICAgICAgLmNhdGNoKCBlcnIgPT4gYygnRmFsbG8gbGEgU2luY3Jvbml6YWNp77+9biBkZSBGb25kbycsIGVycikgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVnaXN0ZXJCR1N5bmMoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvL0JhY2tncm91bmQgU3luYyAocHJvZ3JhbWFrKVxuICAgICAgbi5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBlID0+IHtcbiAgICAgICAgYygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIG1lc3NhZ2UgYmlkZXo6ICcsIGUuZGF0YSlcbiAgICAgICAgaWYoIGUuZGF0YSA9PT0gJ29ubGluZSBuYWhpZXJhbi10dicgKVxuICAgICAgICAgIGZldGNoQWxsUHJvZ3JhbXMoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0dicpLCB0cnVlLCBmYWxzZSApXG4gICAgICB9KVxuXG4gICAgfSAvL3JlYWR5U3RhdGVcbiAgfSwgMTAwICkvL2ludGVydmFsXG5cbiAgcmV0dXJuIGBcbiAgICAke2NhdGVnb3JpZXMoKX1cbiAgICA8ZGl2IGNsYXNzPVwidHYgc2VjdGlvblwiPlxuICAgICAgPGRpdiBjbGFzcz1cInR2X19mb3JtXCI+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiZmluZC1wcm9ncmFtc1wiIGNsYXNzPVwidHZfX2lucHV0XCIgcGxhY2Vob2xkZXI9XCJlaXRia28gc2Fpb2VuIGFydGVhbiBiaWxhdHUuLi5cIiB0aXRsZT1cIlNhaW9hayBiaWxhdHVcIj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGhlYWRlciBjbGFzcz1cInNlY3Rpb24taGVhZGVyIHR2X19oZWFkZXJcIj48L2hlYWRlcj5cbiAgICAgIDx1bCBjbGFzcz1cInR2X19saXN0XCI+PC91bD5cbiAgICAgIDxkaXYgY2xhc3M9XCJsb2FkZXItdGVtcGxhdGUgbG9hZGVyLXRlbXBsYXRlLXR2XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJsb2FkZXIgbG9hZGVyLXR2XCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICAke3NlbGVjdFByb2dyYW0oKX1cbiAgICAke3NlbGVjdEVwaXNvZGUoKX1cbiAgICAke2NhdGVnb3JpZXNTaW5nbGUoKX1cbiAgICBgXG59XG4iLCJjb25zdCBjID0gY29uc29sZS5sb2csXG4gIGQgPSBkb2N1bWVudCxcbiAgbiA9IG5hdmlnYXRvcixcbiAgdyA9IHdpbmRvd1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0UHJvZ3JhbSA9ICgpID0+IHtcblxuICBjb25zdCBhamF4TG9hZGluZyA9IHNldEludGVydmFsKCgpID0+IHtcblxuICAgIGlmICggZC5yZWFkeVN0YXRlICA9PT0gJ2NvbXBsZXRlJyApIHtcblxuICAgICAgY2xlYXJJbnRlcnZhbChhamF4TG9hZGluZylcbiAgICAgIFxuICAgICAgLy9Qcm9ncmFtYSBla2FycmkgKHplcnJlbmRhKVxuICAgICAgZnVuY3Rpb24gZmV0Y2hQcm9ncmFtKGpzb25EYXRhLCByZXF1ZXN0RnJvbUJHU3luYykge1xuXHQgXHRcdFxuICAgICAgICBsZXQgZGF0YSA9IGpzb25EYXRhLnNsaWNlKDUpLFxuICAgICAgICAgIHRwbCA9ICcnLFxuICAgICAgICAgIGRhdGUgPSAnJ1xuICAgICAgICBcbiAgICAgICAgLy9CZWhhcnJlemtvIHNla3ppb2FrIGV6a3V0YXR1XG4gICAgICAgIGQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24nKS5mb3JFYWNoKCBzZWN0aW9uID0+IHtcbiAgICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ3UtaGlkZScpXG4gICAgICAgIH0pXG4gICAgICAgIFxuICAgICAgICAvL0xvYWRlciBlcmFrdXRzaVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItcHJvZ3JhbScpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXRlbXBsYXRlLXByb2dyYW0nKS5jbGFzc0xpc3QuYWRkKCdsb2FkZXItc2hvdycpXG4gICAgICAgIFxuICAgICAgICBmZXRjaChkYXRhKVxuICAgICAgICAgIC50aGVuKCByZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkgKVxuICAgICAgICAgIC50aGVuKGpzb24gPT4ge1xuXHRcdFx0XHRcdFxuICAgICAgICAgICAgaWYgKCAhcmVxdWVzdEZyb21CR1N5bmMgKSB7XG4gIFx0XHRcdFx0XHQgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0di1wcm9ncmFtJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBcdFx0XG4gIFx0XHRcdFx0ICBkLnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmFtJykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcbiAgXHRcdFx0XHQgIC8vTG9hZGVyIGV6a3V0YXR1XG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItcHJvZ3JhbScpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zaG93JylcbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci10ZW1wbGF0ZS1wcm9ncmFtJykuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNob3cnKVxuICBcbiAgICAgICAgICAgIGpzb24ubWVtYmVyLmZvckVhY2goanNvbiA9PiB7XG4gICAgICAgICAgICAgIGlmKGpzb24uYnJvYWRjYXN0X2RhdGUpIHsgXG4gICAgICAgICAgICAgICAgZGF0ZSA9IGpzb24uYnJvYWRjYXN0X2RhdGUuc2xpY2UoMCwxMCkgXG4gIFx0XHRcdFx0ICBcdH1cbiAgICAgICAgICAgICAgdHBsICs9IGBcbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJjdXN0b20tZXBpc29kZVwiIGRhdGEtZXBpc29kZT1cIiR7anNvbltcIkBpZFwiXX1cIj5cbiAgICAgIFx0XHRcdFx0XHQgIDxkaXYgY2xhc3M9XCJwcm9ncmFtX19pbWFnZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7anNvbi5lcGlzb2RlX2ltYWdlfVwiIGNsYXNzPVwicHJvZ3JhbV9faW1nIGN1c3RvbS1lcGlzb2RlXCIgZGF0YS1lcGlzb2RlPVwiJHtqc29uW1wiQGlkXCJdfVwiPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gIFx0XHRcdFx0XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3JhbV9fY29udGVudCBjdXN0b20tZXBpc29kZVwiIGRhdGEtZXBpc29kZT1cIiR7anNvbltcIkBpZFwiXX1cIj5cbiAgICAgICAgICAgICAgICAgICAgJHtqc29uLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyYW1fX2RhdGVcIj4ke2RhdGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIH0pXG4gIFxuICAgICAgICAgIFx0ZC5xdWVyeVNlbGVjdG9yKCcucHJvZ3JhbV9fbGlzdCcpLmlubmVySFRNTCA9IHRwbFxuICAgICAgICAgIFx0ZC5xdWVyeVNlbGVjdG9yKCcucHJvZ3JhbV9faGVhZGVyJykuaW5uZXJIVE1MID0gYFxuICAgICAgICAgIFx0XHQ8ZGl2IGNsYXNzPVwicHJvZ3JhbV9fdGl0bGVcIj4ke2pzb24ubmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyYW1fX2Rlc2NcIj4ke2pzb24uZGVzY19ncm91cH08L2Rpdj5cbiAgICAgICAgICAgICAgYFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKVxuXHRcdCAgfVxuICAgICAgXG4gICAgICAvL1Byb2dyYW1hIGVrYXJyaSAoY2xpY2sgZWJlbnR1YSlcbiAgICAgIGQuZ2V0RWxlbWVudEJ5SWQoXCJhcHBcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBpZiggZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwcm9ncmFtLWlkJykgKSB7XG4gIFx0XHQgICAgXG4gIFx0XHQgICAgbGV0IGRhdGEgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZ3JhbScpXG4gIFxuICBcdFx0ICBcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0di1wcm9ncmFtJywgZGF0YSlcbiAgXHRcdCAgXHRcbiAgICAgICAgICBmZXRjaFByb2dyYW0oIGRhdGEsIGZhbHNlKVxuICAgICAgICAgIFxuICAgICAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChwcm9ncmFtYWspXG4gICAgICAgICAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiAmJiAnU3luY01hbmFnZXInIGluIHcgKSB7XG4gIFx0XHRcdCAgICBmdW5jdGlvbiByZWdpc3RlckJHU3luYyAoKSB7XG4gIFx0XHRcdCAgICAgIG4uc2VydmljZVdvcmtlci5yZWFkeVxuICBcdFx0XHQgICAgICAgIC50aGVuKHJlZ2lzdHJhdGlvbiA9PiB7XG4gIFx0XHRcdCAgICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uLnN5bmMucmVnaXN0ZXIoJ25haGllcmFuLXR2LXByb2dyYW0nKVxuICBcdFx0XHQgICAgICAgICAgICAudGhlbiggKCkgPT4gYygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIGVycmVnaXN0cmF0dWEnKSApXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IGMoJ0Vycm9yZWEgYXR6ZWtvIHNpbmtyb25pemF6aW9hIGVycmVnaXN0cmF0emVhbicsIGVycikgKVxuICBcdFx0XHQgICAgICAgIH0pXG4gIFx0XHRcdCAgICB9XG4gIFx0XHRcdCAgICByZWdpc3RlckJHU3luYygpXG4gIFx0XHRcdCAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKHByb2dyYW1haylcbiAgICAgIG4uc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZSA9PiB7XG5cdFx0ICAgIGNvbnNvbGUubG9nKCdBdHpla28gc2lua3Jvbml6YXppb2EgbWVzc2FnZSBiaWRleiBha3RpYmF0dWE6ICcsIGUuZGF0YSlcblx0XHQgICAgaWYoIGUuZGF0YSA9PT0gJ29ubGluZSBuYWhpZXJhbi10di1wcm9ncmFtJyApXG5cdFx0ICAgIFx0ZmV0Y2hQcm9ncmFtKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndHYtcHJvZ3JhbScpLCB0cnVlIClcblx0XHQgIH0pXG4gICAgfSAvL3JlYWR5U3RhdGVcbiAgfSwgMTAwICkvL2ludGVydmFsXG5cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGNsYXNzPVwibG9hZGVyLXRlbXBsYXRlIGxvYWRlci10ZW1wbGF0ZS1wcm9ncmFtXCI+XG4gIFx0ICA8ZGl2IGNsYXNzPVwibG9hZGVyIGxvYWRlci1wcm9ncmFtXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInByb2dyYW0gc2VjdGlvbiB1LWhpZGVcIj5cbiAgXHQgIDxoZWFkZXIgY2xhc3M9XCJzZWN0aW9uLWhlYWRlciBwcm9ncmFtX19oZWFkZXJcIj48L2hlYWRlcj5cbiAgICAgIDx1bCBjbGFzcz1cInByb2dyYW1fX2xpc3RcIj48L3VsPlxuICAgIDwvZGl2PlxuICAgIGBcbn1cbiIsImNvbnN0IGMgPSBjb25zb2xlLmxvZyxcbiAgZCA9IGRvY3VtZW50LFxuICBuID0gbmF2aWdhdG9yLFxuICB3ID0gd2luZG93XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RFcGlzb2RlID0gKCkgPT4ge1xuXG4gIGNvbnN0IHJlYWR5U3RhdGUgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cbiAgICBpZiAoIGQucmVhZHlTdGF0ZSAgPT09ICdjb21wbGV0ZScgKSB7XG4gICAgICBjbGVhckludGVydmFsKHJlYWR5U3RhdGUpXG4gICAgICBcbiAgICAgIC8vQXR6ZXJhIGpvYW4gKHByb2dyYW1ldGFyYSlcbiAgICAgIGQuZ2V0RWxlbWVudEJ5SWQoJ2VwaXNvZGVfX2JhY2snKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIC8vQmVoYXJyZXprbyBzZWt6aW9hayBlemt1dGF0dVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uJykuZm9yRWFjaCggc2VjdGlvbiA9PiB7XG4gICAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCd1LWhpZGUnKVxuICAgICAgICAgIGQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWRlb1wiKS5wYXVzZSgpXG4gICAgICAgIH0pXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLnByb2dyYW0nKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuICAgICAgfSlcbiAgICAgIFxuICAgICAgLy9lcGlzb2RlIGthcmdhdHVcbiAgICAgIGZ1bmN0aW9uIGZldGNoRXBpc29kZShqc29uRGF0YSwgcmVxdWVzdEZyb21CR1N5bmMpIHtcblxuICAgICAgICBsZXQgZGF0YSA9IGpzb25EYXRhLnNsaWNlKDUpLFxuICAgICAgICAgIHRwbCA9ICcnXG4gICAgICAgICAgXG4gICAgICAgIC8vTG9hZGVyIGVyYWt1dHNpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci1lcGlzb2RlJykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtZXBpc29kZScpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgXG4gICAgICAgIC8vQmVoYXJyZXprbyBzZWt6aW9hayBlemt1dGF0dVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uJykuZm9yRWFjaCggc2VjdGlvbiA9PiB7XG4gICAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCd1LWhpZGUnKVxuICAgICAgICB9KVxuICAgICAgICBcbiAgICAgICAgLy9BUElhIGRlaXR1IChlcGlzb2RlKVxuICAgICAgICBmZXRjaChkYXRhKVxuICAgICAgICBcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG5cbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLmVwaXNvZGUnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuXG4gICAgICAgICAgICBpZiAoIXJlcXVlc3RGcm9tQkdTeW5jKSB7XG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0di1wcm9ncmFtLWVwaXNvZGUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL0xvYWRlciBlemt1dGF0dVxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLWVwaXNvZGUnKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtZXBpc29kZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zaG93JylcblxuICAgICAgICAgICAgbGV0IHVybEVuZCA9IGpzb24udXJsLnNsaWNlKC0zKTtcblxuICAgICAgICAgICAgaWYodXJsRW5kID09PSAnbXA0Jykge1xuICAgICAgICAgICAgICB1cmxFbmQgPSBqc29uLnVybFxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIHVybEVuZCA9IGpzb24uZm9ybWF0c1s3XS51cmxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHBsID0gYFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXBpc29kZV9fdmlkZW9cIj5cbiAgICAgICAgICAgICAgICA8dmlkZW8gaWQ9XCJ2aWRlb1wiIGF1dG9wbGF5IHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBjb250cm9scyBwb3N0ZXI9XCIke2pzb24udGh1bWJuYWlsc1swXS51cmx9XCI+XG4gICAgICAgICAgICAgICAgICA8c291cmNlIHNyYz1cIiR7dXJsRW5kfVwiIHR5cGU9XCJ2aWRlby9tcDRcIj5cbiAgICAgICAgICAgICAgICAgIFp1cmUgbmFiaWdhenRhaWxlYWsgZXppbiBkdSBiaWRlb3JpayBlcmFrdXRzaSA6KFxuICAgICAgICAgICAgICAgIDwvdmlkZW8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICBgXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5lcGlzb2RlX19wbGF5JykuaW5uZXJIVE1MID0gdHBsXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5lcGlzb2RlX19oZWFkZXInKS5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlcGlzb2RlX190aXRsZVwiPiR7anNvbi50aXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVwaXNvZGVfX2Rlc2NcIj4ke2pzb24uZGVzY3JpcHRpb259PC9kaXY+XG4gICAgICAgICAgICAgIGBcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3R2LXByb2dyYW0tZXBpc29kZScsIGRhdGEpXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5lcGlzb2RlX19wbGF5JykuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJlcnJvclwiPktvbmV4aW9hayBodXRzIGVnaW4gZHU8L2Rpdj4nXG4gICAgICAgICAgfSlcbiAgICAgIH0gLy9mZXRjaEVwaXNvZGVcbiAgICAgIFxuICAgICAgLy9Qcm9ncmFtYSB6ZXJyZW5kYXRpayBlcGlzb2RlIGVrYXJyaSAoY2xpY2spXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmFtX19saXN0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICBpZiggZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjdXN0b20tZXBpc29kZScpICkge1xuXG4gICAgICAgICAgbGV0IGRhdGEgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZXBpc29kZScpXG5cbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndHYtcHJvZ3JhbS1lcGlzb2RlJywgZGF0YSlcbiAgICAgICAgICBmZXRjaEVwaXNvZGUoZGF0YSwgZmFsc2UpXG4gICAgICAgICAgXG4gICAgICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKGVwaXNvZGUpXG4gICAgICAgICAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiAmJiAnU3luY01hbmFnZXInIGluIHcgKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiByZWdpc3RlckJHU3luYyAoKSB7XG4gICAgICAgICAgICAgIG4uc2VydmljZVdvcmtlci5yZWFkeVxuICAgICAgICAgICAgICAudGhlbihyZWdpc3RyYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb24uc3luYy5yZWdpc3RlcignbmFoaWVyYW4tdHYtcHJvZ3JhbS1lcGlzb2RlJylcbiAgICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IGMoJ0Vycm9yZWEgYXR6ZWtvIHNpbmtyb25pemF6aW9hIGVycmVnaXN0cmF0emVhbicsIGVycikgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVnaXN0ZXJCR1N5bmMoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChlcGlzb2RlKVxuICAgICAgbi5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBlID0+IHtcbiAgICAgICAgYygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIG1lc3NhZ2UgYmlkZXo6ICcsIGUuZGF0YSlcbiAgICAgICAgaWYoIGUuZGF0YSA9PT0gJ29ubGluZSBuYWhpZXJhbi10di1wcm9ncmFtLWVwaXNvZGUnKVxuICAgICAgICAgIGZldGNoRXBpc29kZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndHYtcHJvZ3JhbS1lcGlzb2RlJyksIHRydWUpXG4gICAgICB9KVxuICAgICAgXG4gICAgfSAvL3JlYWR5U3RhdGVcbiAgfSwgMTAwICkvL2ludGVydmFsXG5cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGNsYXNzPVwibG9hZGVyLXRlbXBsYXRlIGxvYWRlci10ZW1wbGF0ZS1lcGlzb2RlXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibG9hZGVyIGxvYWRlci1lcGlzb2RlXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgXG4gICAgPGRpdiBjbGFzcz1cImVwaXNvZGUgc2VjdGlvbiB1LWhpZGVcIj5cbiAgICAgIDxoZWFkZXIgY2xhc3M9XCJzZWN0aW9uLWhlYWRlciBlcGlzb2RlX19oZWFkZXJcIj48L2hlYWRlcj5cbiAgICAgIDxkaXYgY2xhc3M9XCJlcGlzb2RlX19wbGF5XCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZXBpc29kZV9fbmF2XCI+PGEgaHJlZj1cIiNcIiBpZD1cImVwaXNvZGVfX2JhY2tcIj48IEF0emVyYTwvYT48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICBgXG59XG4iLCJpbXBvcnQgeyBpbml0LCBwd2EsIGlzT25saW5lIH0gZnJvbSAnLi9jb21wb25lbnRzL2luaXQnO1xuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykuaW5uZXJIVE1MID0gaW5pdCgpXG5cbi8vQXBsaWt6aW9hIHdlYiBwcm9ncmVzaWJvYSBlcnJlZ2lzdHJhdHVcbnB3YSgpXG5cbi8vT25saW5lL2ZmbGluZSBnYXVkZW4gemVoYXp0dVxuaXNPbmxpbmUoKVxuIl19
