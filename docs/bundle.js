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
            tpl += '\n                <li class="custom-episode" data-episode="' + json["@id"] + '">\n      \t\t\t\t\t  <div class="program__image">\n                    <img src="' + json.episode_image.slice(5) + '" class="program__img custom-episode" data-episode="' + json["@id"] + '">\n                  </div>\n  \t\t\t\t\n                  <div class="program__content custom-episode" data-episode="' + json["@id"] + '">\n                    ' + json.title + '\n                  <div class="program__date">' + date + '</div>\n                  </div>\n                </li>\n                ';
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

          tpl = '\n              <div class="episode__video">\n                <video id="video" autoplay width="100%" height="100%" controls poster="' + json.thumbnails[0].url.slice(5) + '">\n                  <source src="' + urlEnd.slice(5) + '" type="video/mp4">\n                  Zure nabigaztaileak ezin du bideorik erakutsi :(\n                </video>\n              </div>\n              ';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29tcG9uZW50cy9jYXRlZ29yaWVzLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2F0ZWdvcmllc1NpbmdsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2luaXQuanMiLCJzcmMvanMvY29tcG9uZW50cy90di5qcyIsInNyYy9qcy9jb21wb25lbnRzL3R2UHJvZ3JhbS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3R2UHJvZ3JhbUVwaXNvZGUuanMiLCJzcmMvanMvc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFNLElBQUksUUFBUSxHQUFsQjtBQUFBLElBQ0UsSUFBSSxRQUROO0FBQUEsSUFFRSxJQUFJLFNBRk47QUFBQSxJQUdFLElBQUksTUFITjs7QUFLTyxJQUFNLGtDQUFhLFNBQWIsVUFBYSxHQUFNOztBQUU5QixNQUFNLGFBQWEsWUFBWSxZQUFNOztBQUVuQyxRQUFLLEVBQUUsVUFBRixLQUFrQixVQUF2QixFQUFvQzs7QUFFbEMsb0JBQWMsVUFBZDs7QUFFQSxVQUFJLE1BQU0sRUFBVjs7QUFFQTtBQUNBLFFBQUUsY0FBRixDQUFpQixnQkFBakIsRUFBbUMsZ0JBQW5DLENBQW9ELE9BQXBELEVBQTZELFVBQUMsQ0FBRCxFQUFPO0FBQ2xFLFVBQUUsYUFBRixDQUFnQixrQkFBaEIsRUFBb0MsU0FBcEMsQ0FBOEMsTUFBOUMsQ0FBcUQsU0FBckQ7O0FBRUE7QUFDQSxZQUFJLEVBQUUsYUFBRixDQUFnQixXQUFoQixFQUE2QixTQUE3QixDQUF1QyxRQUF2QyxDQUFnRCxXQUFoRCxDQUFKLEVBQWlFO0FBQy9ELFlBQUUsYUFBRixDQUFnQixXQUFoQixFQUE2QixTQUE3QixDQUF1QyxNQUF2QyxDQUE4QyxXQUE5QztBQUNELFNBRkQsTUFFTTtBQUNKLFlBQUUsYUFBRixDQUFnQixXQUFoQixFQUE2QixTQUE3QixDQUF1QyxHQUF2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QVdELENBMUhNOzs7OztBQ0xQOztBQUVBLFNBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQixTQUEvQixHQUEyQyxpQkFBM0M7O0FBRUE7QUFDQTs7QUFFQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IGMgPSBjb25zb2xlLmxvZyxcbiAgZCA9IGRvY3VtZW50LFxuICBuID0gbmF2aWdhdG9yLFxuICB3ID0gd2luZG93XG5cbmV4cG9ydCBjb25zdCBjYXRlZ29yaWVzID0gKCkgPT4ge1xuXG4gIGNvbnN0IHJlYWR5U3RhdGUgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cbiAgICBpZiAoIGQucmVhZHlTdGF0ZSAgPT09ICdjb21wbGV0ZScgKSB7XG5cbiAgICAgIGNsZWFySW50ZXJ2YWwocmVhZHlTdGF0ZSlcblxuICAgICAgbGV0IHRwbCA9ICcnXG5cbiAgICAgIC8vTmFiaWdhemlvIGJvdG9pYVxuICAgICAgZC5nZXRFbGVtZW50QnlJZChcImNhdGVnb3JpZXMtYnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcub2ZmLWNhbnZhcy1tZW51JykuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtb3BlbicpXG5cbiAgICAgICAgLy9LYXRlZ29yaWFuIGlrb25vYSAobWVudSBvZmYtY2FudmFzKVxuICAgICAgICBpZiggZC5xdWVyeVNlbGVjdG9yKCcubmF2LWljb24nKS5jbGFzc0xpc3QuY29udGFpbnMoXCJpcy1hY3RpdmVcIikpe1xuICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLm5hdi1pY29uJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJylcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLm5hdi1pY29uJykuY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vc2NhcGUgdGVrbGEgYmlkZXogaXR4aSBtZW51YVxuICAgICAgZC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT0gMjcpIHtcbiAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5vZmYtY2FudmFzLW1lbnUnKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJylcbiAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5uYXYtaWNvbicpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vQmVoYXJyZXprbyBzZWt6aW9hayBlemt1dGF0dVxuICAgICAgZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbicpLmZvckVhY2goIHNlY3Rpb24gPT4ge1xuICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ3UtaGlkZScpXG4gICAgICB9KVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcmllcycpLmNsYXNzTGlzdC5yZW1vdmUoJ3UtaGlkZScpXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy50dicpLmNsYXNzTGlzdC5yZW1vdmUoJ3UtaGlkZScpXG5cbiAgICAgIGZldGNoKCcvL3N0aWxsLWNhc3RsZS05OTc0OS5oZXJva3VhcHAuY29tL3Byb2dyYW0tdHlwZS1saXN0JylcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSApXG4gICAgICAgIC50aGVuKGpzb24gPT4ge1xuXG4gICAgICAgICAganNvbi5tZW1iZXIuZm9yRWFjaChqc29uQ2F0ID0+IHtcbiAgICAgICAgICAgIHRwbCArPSBgXG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJjYXRlZ29yeS1pZFwiIGRhdGEtY2F0ZWdvcnk9XCIke2pzb25DYXRbXCJAaWRcIl19XCI+XG4gICAgICAgICAgICAgIFx0JHtqc29uQ2F0LnRpdGxlfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgYFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yaWVzX19saXN0JykuaW5uZXJIVE1MID0gdHBsXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSlcblxuICAgIH0gLy9yZWFkeVN0YXRlXG5cbiAgfSwgMTAwICkvL2ludGVydmFsXG5cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGNsYXNzPVwiY2F0ZWdvcmllcyBvZmYtY2FudmFzLW1lbnVcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJsb2FkZXJcIj48L2Rpdj5cbiAgICAgIDx1bCBjbGFzcz1cImNhdGVnb3JpZXNfX2xpc3RcIj48L3VsPlxuICAgIDwvZGl2PlxuICAgIGBcbn1cbiIsImNvbnN0IGMgPSBjb25zb2xlLmxvZyxcbiAgZCA9IGRvY3VtZW50LFxuICBuID0gbmF2aWdhdG9yLFxuICB3ID0gd2luZG93XG5cbmV4cG9ydCBjb25zdCBjYXRlZ29yaWVzU2luZ2xlID0gKCkgPT4ge1xuXG4gIGNvbnN0IHJlYWR5U3RhdGUgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cbiAgICBpZiAoIGQucmVhZHlTdGF0ZSAgPT09ICdjb21wbGV0ZScgKSB7XG5cbiAgICAgIGNsZWFySW50ZXJ2YWwocmVhZHlTdGF0ZSlcbiAgICAgIFxuICAgICAgLy9LYXRlZ29yaWEgemVycmVuZGEgZWthcnJpXG4gIFx0ICBmdW5jdGlvbiBmZXRjaENhdGVnb3J5KGpzb25EYXRhLCByZXF1ZXN0RnJvbUJHU3luYywgY2F0TmFtZSkge1xuXHRcdCAgXHRcblx0XHQgIFx0bGV0IGRhdGEgPSBqc29uRGF0YS5zbGljZSg1KSxcblx0XHQgIFx0ICB0cGwgPSAnJ1xuICAgICAgICAgICAgICBcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcub2ZmLWNhbnZhcy1tZW51JykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3BlbicpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLm5hdi1pY29uJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJylcbiAgICAgICAgLy9Mb2FkZXIgZXJha3V0c2lcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLWNhdCcpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXRlbXBsYXRlLWNhdCcpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgLy9CZWhhcnJlemtvIHNla3ppb2FrIGV6a3V0YXR1XG4gICAgICAgIGQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24nKS5mb3JFYWNoKCBzZWN0aW9uID0+IHtcbiAgICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ3UtaGlkZScpXG4gICAgICAgIH0pXG4gICAgICAgIFxuICAgICAgICBmZXRjaChkYXRhKVxuICAgICAgICAgIC50aGVuKCByZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkgKVxuICAgICAgICAgIC50aGVuKGpzb24gPT4ge1xuXG4gICAgICAgICAgICBpZiAoICFyZXF1ZXN0RnJvbUJHU3luYyApIHtcbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2NhdGVnb3J5JylcbiAgICAgIFx0XHRcdH1cbiAgICAgIFx0XHRcbiAgICAgICAgICAgIC8vTG9hZGVyIGV6a3V0YXR1XG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItY2F0JykuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNob3cnKVxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXRlbXBsYXRlLWNhdCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zaG93JykgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5zaW5nbGUtY2F0JykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcbiAgXHRcdCAgXG4gICAgICAgIFx0XHRqc29uLm1lbWJlci5mb3JFYWNoKGpzb25DYXQgPT4ge1xuICAgICAgICAgICAgICB0cGwgKz0gYFxuICAgICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJwcm9ncmFtLWlkXCIgZGF0YS1wcm9ncmFtPVwiJHtqc29uQ2F0W1wiQGlkXCJdfVwiPlxuICAgICAgICAgICAgICAgICAgICAke2pzb25DYXQudGl0bGV9XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICB9KVxuICBcbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLnNpbmdsZS1jYXRfX2xpc3QnKS5pbm5lckhUTUwgPSB0cGxcbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLnNpbmdsZS1jYXRfX2hlYWRlcicpLmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInR2X190aXRsZVwiPiR7Y2F0TmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0dl9fbnVtYmVyXCI+KCR7anNvbi5tZW1iZXIubGVuZ3RofSk8L3NwYW4+IHNhaW8gZXJha3VzdGVuXG4gICAgICAgICAgICAgIGBcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSlcbiAgICAgICAgICBcbiAgICAgIH0gLy9mZXRjaENhdGVnb3J5XG5cbiAgICAgIGQucXVlcnlTZWxlY3RvcignLmNhdGVnb3JpZXNfX2xpc3QnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGlmKCBkLmdldEVsZW1lbnRCeUlkKFwidmlkZW9cIikpIFxuICAgICAgICAgIGQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWRlb1wiKS5wYXVzZSgpXG5cdFx0ICBcbiAgICAgICAgaWYoIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2F0ZWdvcnktaWQnKSApIHtcblx0ICBcbiAgICAgICAgICBsZXQgZGF0YSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1jYXRlZ29yeScpLFxuICAgICAgICAgICAgY2F0TmFtZSA9IGUudGFyZ2V0LmlubmVySFRNTFxuICAgICAgICAgIFxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYXRlZ29yeScsIGRhdGEpXG4gICAgICAgICAgZmV0Y2hDYXRlZ29yeSggZGF0YSwgZmFsc2UsIGNhdE5hbWUpICBcbiAgICAgICAgICBcbiAgICAgICAgICAvL0JhY2tncm91bmQgU3luYyAoa2F0ZWdvcmlhKVxuICAgICAgICAgIGlmICggJ3NlcnZpY2VXb3JrZXInIGluIG4gJiYgJ1N5bmNNYW5hZ2VyJyBpbiB3ICkge1xuICAgICAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJCR1N5bmMgKCkge1xuICAgICAgICAgICAgICBuLnNlcnZpY2VXb3JrZXIucmVhZHlcbiAgICAgICAgICAgICAgLnRoZW4ocmVnaXN0cmF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uLnN5bmMucmVnaXN0ZXIoJ25haGllcmFuLWNhdGVnb3J5JylcbiAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4gYygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIGVycmVnaXN0cmF0dWEnKSApXG4gICAgICAgICAgICAgICAgLmNhdGNoKCBlcnIgPT4gYygnRXJyb3JlYSBhdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR6ZWFuJywgZXJyKSApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWdpc3RlckJHU3luYygpXG4gICAgICAgICAgfSAgICAgICAgXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAvL0JhY2tncm91bmQgU3luYyAoa2F0ZWdvcmlhKVxuICAgICAgbi5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBlID0+IHtcblx0XHQgICAgY29uc29sZS5sb2coJ0F0emVrbyBzaW5rcm9uaXphemlvYSBtZXNzYWdlIGJpZGV6IGFrdGliYXR1YTogJywgZS5kYXRhKVxuXHRcdCAgICBpZiggZS5kYXRhID09PSAnb25saW5lIG5haGllcmFuLWNhdGVnb3J5Jylcblx0XHQgICAgXHRmZXRjaENhdGVnb3J5KCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2F0ZWdvcnknKSwgdHJ1ZSApXG5cdFx0ICB9KVxuXG4gICAgfSAvL3JlYWR5U3RhdGVcblxuICB9LCAxMDAgKSAvL2ludGVydmFsXG5cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGNsYXNzPVwibG9hZGVyLXRlbXBsYXRlIGxvYWRlci10ZW1wbGF0ZS1jYXRcIj5cbiAgICBcdDxkaXYgY2xhc3M9XCJsb2FkZXIgbG9hZGVyLWNhdFwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzaW5nbGUtY2F0IHNlY3Rpb24gdS1oaWRlXCI+XG4gICAgICA8aGVhZGVyIGNsYXNzPVwic2VjdGlvbi1oZWFkZXIgdHZfX2hlYWRlciBzaW5nbGUtY2F0X19oZWFkZXJcIj48L2hlYWRlcj5cbiAgICAgIDx1bCBjbGFzcz1cInR2X19saXN0IHNpbmdsZS1jYXRfX2xpc3RcIj48L3VsPlxuICAgIDwvZGl2PlxuICAgIGBcbn1cbiIsImltcG9ydCB7dHZ9IGZyb20gJy4vdHYnO1xuXG5jb25zdCBjID0gY29uc29sZS5sb2csXG4gIGQgPSBkb2N1bWVudCxcbiAgbiA9IG5hdmlnYXRvcixcbiAgdyA9IHdpbmRvd1xuXG5leHBvcnQgY29uc3QgcHdhID0gKCkgPT4ge1xuICAvL1NlcnZpY2UgV29ya2VycmEgZXJyZWdpc3RyYXR1XG4gIGlmICggJ3NlcnZpY2VXb3JrZXInIGluIG4gKSB7XG4gICAgbi5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcuL3N3LmpzJylcbiAgICAudGhlbiggcmVnaXN0cmF0aW9uID0+IHtcbiAgICAgIGMoJ1NlcnZpY2UgV29ya2VyIGVycmVnaXN0cmF0dWEnLCByZWdpc3RyYXRpb24uc2NvcGUpXG4gICAgfSlcbiAgICAuY2F0Y2goIGVyciA9PiBjKGBSZWdpc3RybyBkZSBTZXJ2aWNlIFdvcmtlciBmYWxsaWRvYCwgZXJyKSApXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGlzT25saW5lID0gKCkgPT4ge1xuICAvL0tvbmV4aW9hcmVuIGVnb2VyYSAob25saW5lL29mZmxpbmUpXG4gIGNvbnN0IG1ldGFUYWdUaGVtZSA9IGQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPXRoZW1lLWNvbG9yXScpXG5cbiAgZnVuY3Rpb24gbmV0d29ya1N0YXR1cyAoZSkge1xuXG4gICAgaWYgKCBuLm9uTGluZSApIHtcbiAgICAgIG1ldGFUYWdUaGVtZS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnLCAnI2ZmZmZmZicpXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1mb290ZXJfX3N0YXR1c1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwib2ZmbGluZVwiKVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKFwiLm9mZmxpbmVcIikuaW5uZXJIVE1MID0gXCJcIlxuICAgIH0gZWxzZSB7XG4gICAgICBtZXRhVGFnVGhlbWUuc2V0QXR0cmlidXRlKCdjb250ZW50JywgJyNjOWM5YzknKVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKFwiLm1haW4tZm9vdGVyX19zdGF0dXNcIikuY2xhc3NMaXN0LmFkZChcIm9mZmxpbmVcIilcbiAgICAgIGQucXVlcnlTZWxlY3RvcihcIi5vZmZsaW5lXCIpLmlubmVySFRNTCA9IFwiPGRpdiBjbGFzcz0ndGV4dCc+U2FyZWEgYmVycmVza3VyYXR6ZW4uLi48L2Rpdj5cIlxuICAgIH1cbiAgfVxuXG4gIHcuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgbmV0d29ya1N0YXR1cylcbiAgdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgbmV0d29ya1N0YXR1cylcbn1cblxuZXhwb3J0IGNvbnN0IGluaXQgPSAoZGF0YSkgPT4ge1xuICBcbiAgY29uc3QgcmVsb2FkQXBwID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIC8vQXBsaWthemlvYS9sZWlob2EgZWd1bmVyYXR1XG4gICAgaWYgKCBkLnJlYWR5U3RhdGUgID09PSAnY29tcGxldGUnICkge1xuICAgICAgY2xlYXJJbnRlcnZhbChyZWxvYWRBcHApXG4gICAgICBkLmdldEVsZW1lbnRCeUlkKFwicmVsb2FkLWFwcFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gYFxuICA8aGVhZGVyIGNsYXNzPVwibWFpbi1oZWFkZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwibWFpbi1oZWFkZXJfX2NvbHNcIj5cbiAgICAgIDxpbWcgc3JjPVwiLi9hc3NldHMvZWl0Yi1sb2dvLWJsdWUuc3ZnXCIgYWx0PVwiTmFoaWVyYW5cIiBjbGFzcz1cIm1haW4taGVhZGVyX19sb2dvXCIgaWQ9XCJyZWxvYWQtYXBwXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cIm1haW4taGVhZGVyX19zbG9nYW5cIj5uYWhpZXJhbjwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwibWFpbi1oZWFkZXJfX2NvbHMgcmlnaHRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJuYXYtaWNvblwiIGlkPVwiY2F0ZWdvcmllcy1idG5cIj5cbiAgICAgIFx0PGRpdiBjbGFzcz1cIm5hdi1pY29uX19iYXJcIj48L2Rpdj5cbiAgICAgIFx0PGRpdiBjbGFzcz1cIm5hdi1pY29uX19iYXJcIj48L2Rpdj5cbiAgICAgIFx0PGRpdiBjbGFzcz1cIm5hdi1pY29uX19iYXJcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2hlYWRlcj5cblxuICAke3R2KCl9XG5cbiAgPGZvb3RlciBjbGFzcz1cIm1haW4tZm9vdGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX19zdGF0dXNcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwibWFpbi1mb290ZXJfX3Jvd1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX19jb2wtbG9nb1wiPlxuICAgICAgXHQ8aW1nIHNyYz1cIi4vYXNzZXRzL2VpdGItbG9nby13aGl0ZS5zdmdcIiBhbHQ9XCJlaXRiIG5haGllcmFuXCIgY2xhc3M9XCJtYWluLWZvb3Rlcl9fbG9nb1wiPlxuICAgICAgXHQ8ZGl2IGNsYXNzPVwibWFpbi1mb290ZXJfX3RleHRcIj5BemtlbiBlZ3VuZXJha2V0YTpcbiAgICAgIFx0XHQ8c3BhbiBjbGFzcz1cInNhdmVkLWRhdGVcIj4ke2xvY2FsU3RvcmFnZS5nZXRJdGVtKFwianNvbkRhdGVcIil9PC9zcGFuPlxuICAgICAgXHQ8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX19jb2wtYnRuIGRlbGV0ZVN0b3JhZ2VcIj5cbiAgICAgIFx0PGltZyBzcmM9XCIuL2Fzc2V0cy9yZWxvYWQuc3ZnXCIgYWx0PVwiRGF0dWFrIGVndW5lcmF0dVwiIGNsYXNzPVwibWFpbi1mb290ZXJfX3JlbG9hZFwiPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwibWFpbi1mb290ZXJfX3Jvd1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX19wb3dlcmVkLWJ5XCI+XG4gICAgICBcdFBXQSBnYXJhcGVuYSA8YSBvbmNsaWNrPVwid2luZG93LmxvY2F0aW9uPSdodHRwczovL3R3aXR0ZXIuY29tL2FzaWVybXVzYSdcIiBocmVmPVwiI1wiPkBhc2llcm11c2E8L2E+IHxcbiAgICAgIFx0ZWl0YiBBUElhIDxhIG9uY2xpY2s9XCJ3aW5kb3cubG9jYXRpb249J2h0dHBzOi8vdHdpdHRlci5jb20vZXJyYWxpbidcIiBocmVmPVwiI1wiPkBlcnJhbGluPC9hPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZm9vdGVyPlxuICBgXG59XG4iLCJpbXBvcnQge2NhdGVnb3JpZXN9IGZyb20gJy4vY2F0ZWdvcmllcyc7XG5pbXBvcnQge3NlbGVjdFByb2dyYW19IGZyb20gJy4vdHZQcm9ncmFtJ1xuaW1wb3J0IHtzZWxlY3RFcGlzb2RlfSBmcm9tICcuL3R2UHJvZ3JhbUVwaXNvZGUnXG5pbXBvcnQge2NhdGVnb3JpZXNTaW5nbGV9IGZyb20gJy4vY2F0ZWdvcmllc1NpbmdsZSdcblxuY29uc3QgYyA9IGNvbnNvbGUubG9nLFxuICBkID0gZG9jdW1lbnQsXG4gIG4gPSBuYXZpZ2F0b3IsXG4gIHcgPSB3aW5kb3dcblxuY29uc3QgZmlsdGVyaW5nID0gKHVsKSA9PiB7XG5cbiAgZC5nZXRFbGVtZW50QnlJZCgnZmluZC1wcm9ncmFtcycpLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcblxuICAgIGxldCBqc29uID0gSlNPTi5wYXJzZSggbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvY2FsSnNvbicpKSxcbiAgICAgIGxpc3RhID0gbnVsbCxcbiAgICAgIHRwbCA9ICcnXG5cbiAgICBsaXN0YSA9IGpzb24ubWVtYmVyLmZpbHRlciggbGlzdCA9PiB7XG4gICAgICByZXR1cm4gbGlzdC50aXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkpXG4gICAgfSlcblxuICAgIGxpc3RhLmZvckVhY2goanNvbiA9PiB7XG4gICAgICB0cGwgKz1cbiAgICAgIGBcbiAgICAgIDxsaT5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cInByb2dyYW0taWRcIiBkYXRhLXByb2dyYW09XCIke2pzb25bXCJAaWRcIl19XCI+XG4gICAgICAgICR7anNvbi50aXRsZX1cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICAgIGBcbiAgICB9KVxuXG4gICAgZC5xdWVyeVNlbGVjdG9yKHVsKS5pbm5lckhUTUwgPSB0cGxcbiAgICBkLnF1ZXJ5U2VsZWN0b3IoJy50dl9faGVhZGVyJykuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwidHZfX251bWJlclwiPiR7bGlzdGEubGVuZ3RofTwvc3Bhbj4gc2FpbyBlcmFrdXN0ZW5gXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB0diA9ICgpID0+IHtcblxuICBjb25zdCByZWFkeVN0YXRlID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXG4gICAgaWYgKCBkLnJlYWR5U3RhdGUgID09PSAnY29tcGxldGUnICkge1xuXG4gICAgICBjbGVhckludGVydmFsKHJlYWR5U3RhdGUpXG5cbiAgICAgIC8vUHJvZ3JhbWEgZXJha3V0c2kgKGJ1a2xlYSlcbiAgICAgIGZ1bmN0aW9uIGdldFByb2dyYW1zKGpzb24pIHtcblxuICAgICAgICBsZXQgdHBsID0gJydcblxuICAgICAgICBKU09OLnBhcnNlKGpzb24pLm1lbWJlci5mb3JFYWNoKGpzb24gPT4ge1xuXG4gICAgICAgICAgdHBsICs9IGBcbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cInByb2dyYW0taWRcIiBkYXRhLXByb2dyYW09XCIke2pzb25bXCJAaWRcIl19XCI+XG4gICAgICAgICAgICAgICAgJHtqc29uLnRpdGxlfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgYFxuICAgICAgICB9KVxuXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLnR2X19saXN0JykuaW5uZXJIVE1MID0gdHBsXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLnR2X19oZWFkZXInKS5pbm5lckhUTUwgPSBgU2FpbyBndXp0aWFrIGVyYWt1c3RlbiA8c3BhbiBjbGFzcz1cInR2X19udW1iZXJcIj4oJHtKU09OLnBhcnNlKCBqc29uICkubWVtYmVyLmxlbmd0aH0pPC9zcGFuPmBcbiAgICAgICAgLy9Mb2FkZXIgZXprdXRhdHVcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXR2JykuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNob3cnKVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtdHYnKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG4gICAgICAgIC8vRm9vdGVycmVhbiBBUElhcmVuIGVndW5lcmFrZXRhIGRhdGEgYmlzdGFyYXR1XG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLm1haW4tZm9vdGVyX190ZXh0JykuY2xhc3NMaXN0LmFkZCgnaXMtY2FjaGUnKVxuICAgICAgfVxuXG4gICAgICAvL1Byb2dyYW1hayBla2FycmlcbiAgICAgIGZ1bmN0aW9uIGZldGNoQWxsUHJvZ3JhbXMoZGF0YSwgcmVxdWVzdEZyb21CR1N5bmMsIHJlc2V0KSB7XG5cbiAgICAgICAgbGV0IHRwbCA9ICcnXG5cbiAgICAgICAgLy9Mb2FkZXIgZXJha3V0c2lcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXRlbXBsYXRlLXR2JykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdHYnKS5jbGFzc0xpc3QuYWRkKCdsb2FkZXItc2hvdycpXG4gICAgICAgIC8vQmVoYXJyZXprbyBzZWt6aW9hayBlemt1dGF0dVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uJykuZm9yRWFjaCggc2VjdGlvbiA9PiB7XG4gICAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCd1LWhpZGUnKVxuICAgICAgICB9KVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yaWVzJykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcudHYnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuXG4gICAgICAgIC8vQVBJYSBkZWl0dSBiZWhhciBiYWRhLi4uXG4gICAgICAgIGlmKHJlc2V0KSB7XG5cbiAgICAgICAgICBmZXRjaChkYXRhKVxuICAgICAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSApXG4gICAgICAgICAgICAudGhlbihqc29uID0+IHtcblxuICAgICAgICAgICAgICBpZiAoICFyZXF1ZXN0RnJvbUJHU3luYyApIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndHYnKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xvY2FsSnNvbicsIEpTT04uc3RyaW5naWZ5KGpzb24pKTtcblxuICAgICAgICAgICAgICBsZXQgc2F2ZWREYXRlID0gbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICBkYXRlID0gc2F2ZWREYXRlLmdldEZ1bGxZZWFyKCkgKyAnLycgKyAoJzAnICsgKHNhdmVkRGF0ZS5nZXRNb250aCgpKzEpKS5zbGljZSgtMikgKyAnLycgKyAoJzAnICsgc2F2ZWREYXRlLmdldERhdGUoKSkuc2xpY2UoLTIpICsgJyAtICcsXG4gICAgICAgICAgICAgICAgdGltZSA9ICgnMCcgKyBzYXZlZERhdGUuZ2V0SG91cnMoKSkuc2xpY2UoLTIpICsgXCI6XCIgKyAoJzAnICsgc2F2ZWREYXRlLmdldE1pbnV0ZXMoKSkuc2xpY2UoLTIpLFxuICAgICAgICAgICAgICAgIGRhdGVUaW1lID0gZGF0ZSArICcgJyArIHRpbWVcblxuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImpzb25EYXRlXCIsIGRhdGVUaW1lKVxuICAgICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5zYXZlZC1kYXRlJykuaW5uZXJIVE1MID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJqc29uRGF0ZVwiKVxuXG4gICAgICAgICAgICAgIGdldFByb2dyYW1zKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2NhbEpzb24nKSlcblxuICAgICAgICAgICAgICAvL05vdGlmaWthemlvIGJpZGV6IG9oYXJ0YXJhemlcbiAgICAgICAgICAgICAgaWYoIHcuTm90aWZpY2F0aW9uICYmIE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uICE9PSAnZGVuaWVkJyApIHtcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oc3RhdHVzID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cylcbiAgICAgICAgICAgICAgICAgIGxldCBuID0gbmV3IE5vdGlmaWNhdGlvbignTmFoaWVyYW4nLCB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHk6ICdQcm9ncmFtYSB6ZXJyZW5kYSBlZ3VuZXJhdHUgZGEgOiknLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnLi9hc3NldHMvZmF2aWNvbi5wbmcnXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3R2JywgZGF0YSlcbiAgICAgICAgICB9KVxuXG4gICAgICAgIC8vUHJvZ3JhbWFrIGxvY2FsLWVhbiBnb3JkZXRhIGJhZGFnb1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBnZXRQcm9ncmFtcyhkYXRhKVxuICAgICAgICB9XG5cbiAgICAgIH0vL2ZldGNoQWxsUHJvZ3JhbXNcblxuICAgICAgLy9GaWx0cm9hIGVnaW5cbiAgICAgIGZpbHRlcmluZygnLnR2X19saXN0JylcblxuICAgICAgLy9Hb3JkZXRha28gQVBJYSBlemFiYXR1IGV0YSBiZXJyaWEgZWthcnR6ZWtvIC0gRVpBQkFUVVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlU3RvcmFnZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYgKCBjb25maXJtKCdQcm9ncmFtYSB6ZXJyZW5kYSBlZ3VuZXJhdHUgbmFoaSBhbCBkdXp1PycpID09IHRydWUpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnbG9jYWxKc29uJylcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnanNvbkRhdGUnKVxuXG4gICAgICAgICAgLy9CaWRlbyBtYXJ0eGFuIGJhZGFnbyBlcmUsIGdlcmF0dVxuICAgICAgICAgIGQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWRlb1wiKS5wYXVzZSgpXG5cbiAgICAgICAgICBsZXQgcmVzZXQgPSB0cnVlLFxuICAgICAgICAgICAgZGF0YT0gJy8vc3RpbGwtY2FzdGxlLTk5NzQ5Lmhlcm9rdWFwcC5jb20vcGxheWxpc3QnXG5cbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndHYnLCBkYXRhKVxuXG4gICAgICAgICAgZmV0Y2hBbGxQcm9ncmFtcyhkYXRhLCBmYWxzZSwgcmVzZXQpXG5cbiAgICAgICAgICAvL0JhY2tncm91bmQgU3luYyAocHJvZ3JhbWFrKVxuICAgICAgICAgIGlmICggJ3NlcnZpY2VXb3JrZXInIGluIG4gJiYgJ1N5bmNNYW5hZ2VyJyBpbiB3ICkge1xuICAgICAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJCR1N5bmMgKCkge1xuICAgICAgICAgICAgICBuLnNlcnZpY2VXb3JrZXIucmVhZHlcbiAgICAgICAgICAgICAgLnRoZW4ocmVnaXN0cmF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uLnN5bmMucmVnaXN0ZXIoJ25haGllcmFuLXR2JylcbiAgICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IGMoJ0Vycm9yZWEgYXR6ZWtvIHNpbmtyb25pemF6aW9hIGVycmVnaXN0cmF0emVhbicsIGVycikgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVnaXN0ZXJCR1N5bmMoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy9BcGxpa2F6aW9yYSBzYXJ0emVuIGRlbmVhbiBlZ2luIGJlaGFycmVrb2EgKEFQSWEgZGVpdHUgZWRvIGV6KVxuICAgICAgaWYobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvY2FsSnNvbicpKXtcbiAgICAgICAgZmV0Y2hBbGxQcm9ncmFtcyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9jYWxKc29uJyksIGZhbHNlLCBmYWxzZSlcbiAgICAgIH1lbHNle1xuICAgICAgICBsZXQgcmVzZXQgPSB0cnVlLFxuICAgICAgICAgIGRhdGE9ICcvL3N0aWxsLWNhc3RsZS05OTc0OS5oZXJva3VhcHAuY29tL3BsYXlsaXN0J1xuXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0dicsIGRhdGEpXG5cbiAgICAgICAgZmV0Y2hBbGxQcm9ncmFtcyhkYXRhLCBmYWxzZSwgcmVzZXQpXG5cbiAgICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKHByb2dyYW1haylcbiAgICAgICAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiAmJiAnU3luY01hbmFnZXInIGluIHcgKSB7XG4gICAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJCR1N5bmMgKCkge1xuICAgICAgICAgICAgbi5zZXJ2aWNlV29ya2VyLnJlYWR5XG4gICAgICAgICAgICAudGhlbihyZWdpc3RyYXRpb24gPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uLnN5bmMucmVnaXN0ZXIoJ25haGllcmFuLXR2JylcbiAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4gYygnU2luY3Jvbml6YWNp77+9biBkZSBGb25kbyBSZWdpc3RyYWRhJykgKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IGMoJ0ZhbGxvIGxhIFNpbmNyb25pemFjae+/vW4gZGUgRm9uZG8nLCBlcnIpIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlZ2lzdGVyQkdTeW5jKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKHByb2dyYW1haylcbiAgICAgIG4uc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZSA9PiB7XG4gICAgICAgIGMoJ0F0emVrbyBzaW5rcm9uaXphemlvYSBtZXNzYWdlIGJpZGV6OiAnLCBlLmRhdGEpXG4gICAgICAgIGlmKCBlLmRhdGEgPT09ICdvbmxpbmUgbmFoaWVyYW4tdHYnIClcbiAgICAgICAgICBmZXRjaEFsbFByb2dyYW1zKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndHYnKSwgdHJ1ZSwgZmFsc2UgKVxuICAgICAgfSlcblxuICAgIH0gLy9yZWFkeVN0YXRlXG4gIH0sIDEwMCApLy9pbnRlcnZhbFxuXG4gIHJldHVybiBgXG4gICAgJHtjYXRlZ29yaWVzKCl9XG4gICAgPGRpdiBjbGFzcz1cInR2IHNlY3Rpb25cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0dl9fZm9ybVwiPlxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImZpbmQtcHJvZ3JhbXNcIiBjbGFzcz1cInR2X19pbnB1dFwiIHBsYWNlaG9sZGVyPVwiZWl0YmtvIHNhaW9lbiBhcnRlYW4gYmlsYXR1Li4uXCIgdGl0bGU9XCJTYWlvYWsgYmlsYXR1XCI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxoZWFkZXIgY2xhc3M9XCJzZWN0aW9uLWhlYWRlciB0dl9faGVhZGVyXCI+PC9oZWFkZXI+XG4gICAgICA8dWwgY2xhc3M9XCJ0dl9fbGlzdFwiPjwvdWw+XG4gICAgICA8ZGl2IGNsYXNzPVwibG9hZGVyLXRlbXBsYXRlIGxvYWRlci10ZW1wbGF0ZS10dlwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibG9hZGVyIGxvYWRlci10dlwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgJHtzZWxlY3RQcm9ncmFtKCl9XG4gICAgJHtzZWxlY3RFcGlzb2RlKCl9XG4gICAgJHtjYXRlZ29yaWVzU2luZ2xlKCl9XG4gICAgYFxufVxuIiwiY29uc3QgYyA9IGNvbnNvbGUubG9nLFxuICBkID0gZG9jdW1lbnQsXG4gIG4gPSBuYXZpZ2F0b3IsXG4gIHcgPSB3aW5kb3dcblxuZXhwb3J0IGNvbnN0IHNlbGVjdFByb2dyYW0gPSAoKSA9PiB7XG5cbiAgY29uc3QgYWpheExvYWRpbmcgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cbiAgICBpZiAoIGQucmVhZHlTdGF0ZSAgPT09ICdjb21wbGV0ZScgKSB7XG5cbiAgICAgIGNsZWFySW50ZXJ2YWwoYWpheExvYWRpbmcpXG4gICAgICBcbiAgICAgIC8vUHJvZ3JhbWEgZWthcnJpICh6ZXJyZW5kYSlcbiAgICAgIGZ1bmN0aW9uIGZldGNoUHJvZ3JhbShqc29uRGF0YSwgcmVxdWVzdEZyb21CR1N5bmMpIHtcblx0IFx0XHRcbiAgICAgICAgbGV0IGRhdGEgPSBqc29uRGF0YS5zbGljZSg1KSxcbiAgICAgICAgICB0cGwgPSAnJyxcbiAgICAgICAgICBkYXRlID0gJydcbiAgICAgICAgXG4gICAgICAgIC8vQmVoYXJyZXprbyBzZWt6aW9hayBlemt1dGF0dVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uJykuZm9yRWFjaCggc2VjdGlvbiA9PiB7XG4gICAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCd1LWhpZGUnKVxuICAgICAgICB9KVxuICAgICAgICBcbiAgICAgICAgLy9Mb2FkZXIgZXJha3V0c2lcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXByb2dyYW0nKS5jbGFzc0xpc3QuYWRkKCdsb2FkZXItc2hvdycpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci10ZW1wbGF0ZS1wcm9ncmFtJykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICBcbiAgICAgICAgZmV0Y2goZGF0YSlcbiAgICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpIClcbiAgICAgICAgICAudGhlbihqc29uID0+IHtcblx0XHRcdFx0XHRcbiAgICAgICAgICAgIGlmICggIXJlcXVlc3RGcm9tQkdTeW5jICkge1xuICBcdFx0XHRcdFx0ICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndHYtcHJvZ3JhbScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXHRcdFxuICBcdFx0XHRcdCAgZC5xdWVyeVNlbGVjdG9yKCcucHJvZ3JhbScpLmNsYXNzTGlzdC5yZW1vdmUoJ3UtaGlkZScpXG4gIFx0XHRcdFx0ICAvL0xvYWRlciBlemt1dGF0dVxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXByb2dyYW0nKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtcHJvZ3JhbScpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zaG93JylcbiAgXG4gICAgICAgICAgICBqc29uLm1lbWJlci5mb3JFYWNoKGpzb24gPT4ge1xuICAgICAgICAgICAgICBpZihqc29uLmJyb2FkY2FzdF9kYXRlKSB7IFxuICAgICAgICAgICAgICAgIGRhdGUgPSBqc29uLmJyb2FkY2FzdF9kYXRlLnNsaWNlKDAsMTApIFxuICBcdFx0XHRcdCAgXHR9XG4gICAgICAgICAgICAgIHRwbCArPSBgXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiY3VzdG9tLWVwaXNvZGVcIiBkYXRhLWVwaXNvZGU9XCIke2pzb25bXCJAaWRcIl19XCI+XG4gICAgICBcdFx0XHRcdFx0ICA8ZGl2IGNsYXNzPVwicHJvZ3JhbV9faW1hZ2VcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2pzb24uZXBpc29kZV9pbWFnZS5zbGljZSg1KX1cIiBjbGFzcz1cInByb2dyYW1fX2ltZyBjdXN0b20tZXBpc29kZVwiIGRhdGEtZXBpc29kZT1cIiR7anNvbltcIkBpZFwiXX1cIj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICBcdFx0XHRcdFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyYW1fX2NvbnRlbnQgY3VzdG9tLWVwaXNvZGVcIiBkYXRhLWVwaXNvZGU9XCIke2pzb25bXCJAaWRcIl19XCI+XG4gICAgICAgICAgICAgICAgICAgICR7anNvbi50aXRsZX1cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmFtX19kYXRlXCI+JHtkYXRlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICB9KVxuICBcbiAgICAgICAgICBcdGQucXVlcnlTZWxlY3RvcignLnByb2dyYW1fX2xpc3QnKS5pbm5lckhUTUwgPSB0cGxcbiAgICAgICAgICBcdGQucXVlcnlTZWxlY3RvcignLnByb2dyYW1fX2hlYWRlcicpLmlubmVySFRNTCA9IGBcbiAgICAgICAgICBcdFx0PGRpdiBjbGFzcz1cInByb2dyYW1fX3RpdGxlXCI+JHtqc29uLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmFtX19kZXNjXCI+JHtqc29uLmRlc2NfZ3JvdXB9PC9kaXY+XG4gICAgICAgICAgICAgIGBcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSlcblx0XHQgIH1cbiAgICAgIFxuICAgICAgLy9Qcm9ncmFtYSBla2FycmkgKGNsaWNrIGViZW50dWEpXG4gICAgICBkLmdldEVsZW1lbnRCeUlkKFwiYXBwXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYoIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncHJvZ3JhbS1pZCcpICkge1xuICBcdFx0ICAgIFxuICBcdFx0ICAgIGxldCBkYXRhID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXByb2dyYW0nKVxuICBcbiAgXHRcdCAgXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndHYtcHJvZ3JhbScsIGRhdGEpXG4gIFx0XHQgIFx0XG4gICAgICAgICAgZmV0Y2hQcm9ncmFtKCBkYXRhLCBmYWxzZSlcbiAgICAgICAgICBcbiAgICAgICAgICAvL0JhY2tncm91bmQgU3luYyAocHJvZ3JhbWFrKVxuICAgICAgICAgIGlmICggJ3NlcnZpY2VXb3JrZXInIGluIG4gJiYgJ1N5bmNNYW5hZ2VyJyBpbiB3ICkge1xuICBcdFx0XHQgICAgZnVuY3Rpb24gcmVnaXN0ZXJCR1N5bmMgKCkge1xuICBcdFx0XHQgICAgICBuLnNlcnZpY2VXb3JrZXIucmVhZHlcbiAgXHRcdFx0ICAgICAgICAudGhlbihyZWdpc3RyYXRpb24gPT4ge1xuICBcdFx0XHQgICAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbi5zeW5jLnJlZ2lzdGVyKCduYWhpZXJhbi10di1wcm9ncmFtJylcbiAgXHRcdFx0ICAgICAgICAgICAgLnRoZW4oICgpID0+IGMoJ0F0emVrbyBzaW5rcm9uaXphemlvYSBlcnJlZ2lzdHJhdHVhJykgKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goIGVyciA9PiBjKCdFcnJvcmVhIGF0emVrbyBzaW5rcm9uaXphemlvYSBlcnJlZ2lzdHJhdHplYW4nLCBlcnIpIClcbiAgXHRcdFx0ICAgICAgICB9KVxuICBcdFx0XHQgICAgfVxuICBcdFx0XHQgICAgcmVnaXN0ZXJCR1N5bmMoKVxuICBcdFx0XHQgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChwcm9ncmFtYWspXG4gICAgICBuLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGUgPT4ge1xuXHRcdCAgICBjb25zb2xlLmxvZygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIG1lc3NhZ2UgYmlkZXogYWt0aWJhdHVhOiAnLCBlLmRhdGEpXG5cdFx0ICAgIGlmKCBlLmRhdGEgPT09ICdvbmxpbmUgbmFoaWVyYW4tdHYtcHJvZ3JhbScgKVxuXHRcdCAgICBcdGZldGNoUHJvZ3JhbSggbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3R2LXByb2dyYW0nKSwgdHJ1ZSApXG5cdFx0ICB9KVxuICAgIH0gLy9yZWFkeVN0YXRlXG4gIH0sIDEwMCApLy9pbnRlcnZhbFxuXG4gIHJldHVybiBgXG4gICAgPGRpdiBjbGFzcz1cImxvYWRlci10ZW1wbGF0ZSBsb2FkZXItdGVtcGxhdGUtcHJvZ3JhbVwiPlxuICBcdCAgPGRpdiBjbGFzcz1cImxvYWRlciBsb2FkZXItcHJvZ3JhbVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJwcm9ncmFtIHNlY3Rpb24gdS1oaWRlXCI+XG4gIFx0ICA8aGVhZGVyIGNsYXNzPVwic2VjdGlvbi1oZWFkZXIgcHJvZ3JhbV9faGVhZGVyXCI+PC9oZWFkZXI+XG4gICAgICA8dWwgY2xhc3M9XCJwcm9ncmFtX19saXN0XCI+PC91bD5cbiAgICA8L2Rpdj5cbiAgICBgXG59XG4iLCJjb25zdCBjID0gY29uc29sZS5sb2csXG4gIGQgPSBkb2N1bWVudCxcbiAgbiA9IG5hdmlnYXRvcixcbiAgdyA9IHdpbmRvd1xuXG5leHBvcnQgY29uc3Qgc2VsZWN0RXBpc29kZSA9ICgpID0+IHtcblxuICBjb25zdCByZWFkeVN0YXRlID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXG4gICAgaWYgKCBkLnJlYWR5U3RhdGUgID09PSAnY29tcGxldGUnICkge1xuICAgICAgY2xlYXJJbnRlcnZhbChyZWFkeVN0YXRlKVxuICAgICAgXG4gICAgICAvL0F0emVyYSBqb2FuIChwcm9ncmFtZXRhcmEpXG4gICAgICBkLmdldEVsZW1lbnRCeUlkKCdlcGlzb2RlX19iYWNrJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAvL0JlaGFycmV6a28gc2VremlvYWsgZXprdXRhdHVcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbicpLmZvckVhY2goIHNlY3Rpb24gPT4ge1xuICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgndS1oaWRlJylcbiAgICAgICAgICBkLmdldEVsZW1lbnRCeUlkKFwidmlkZW9cIikucGF1c2UoKVxuICAgICAgICB9KVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmFtJykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcbiAgICAgIH0pXG4gICAgICBcbiAgICAgIC8vZXBpc29kZSBrYXJnYXR1XG4gICAgICBmdW5jdGlvbiBmZXRjaEVwaXNvZGUoanNvbkRhdGEsIHJlcXVlc3RGcm9tQkdTeW5jKSB7XG5cbiAgICAgICAgbGV0IGRhdGEgPSBqc29uRGF0YS5zbGljZSg1KSxcbiAgICAgICAgICB0cGwgPSAnJ1xuICAgICAgICAgIFxuICAgICAgICAvL0xvYWRlciBlcmFrdXRzaVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItZXBpc29kZScpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXRlbXBsYXRlLWVwaXNvZGUnKS5jbGFzc0xpc3QuYWRkKCdsb2FkZXItc2hvdycpXG4gICAgICAgIFxuICAgICAgICAvL0JlaGFycmV6a28gc2VremlvYWsgZXprdXRhdHVcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbicpLmZvckVhY2goIHNlY3Rpb24gPT4ge1xuICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgndS1oaWRlJylcbiAgICAgICAgfSlcbiAgICAgICAgXG4gICAgICAgIC8vQVBJYSBkZWl0dSAoZXBpc29kZSlcbiAgICAgICAgZmV0Y2goZGF0YSlcbiAgICAgICAgXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAgIC50aGVuKGpzb24gPT4ge1xuXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5lcGlzb2RlJykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcblxuICAgICAgICAgICAgaWYgKCFyZXF1ZXN0RnJvbUJHU3luYykge1xuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndHYtcHJvZ3JhbS1lcGlzb2RlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9Mb2FkZXIgZXprdXRhdHVcbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci1lcGlzb2RlJykuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNob3cnKVxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXRlbXBsYXRlLWVwaXNvZGUnKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG5cbiAgICAgICAgICAgIGxldCB1cmxFbmQgPSBqc29uLnVybC5zbGljZSgtMyk7XG5cbiAgICAgICAgICAgIGlmKHVybEVuZCA9PT0gJ21wNCcpIHtcbiAgICAgICAgICAgICAgdXJsRW5kID0ganNvbi51cmxcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICB1cmxFbmQgPSBqc29uLmZvcm1hdHNbN10udXJsXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRwbCA9IGBcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVwaXNvZGVfX3ZpZGVvXCI+XG4gICAgICAgICAgICAgICAgPHZpZGVvIGlkPVwidmlkZW9cIiBhdXRvcGxheSB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgY29udHJvbHMgcG9zdGVyPVwiJHtqc29uLnRodW1ibmFpbHNbMF0udXJsLnNsaWNlKDUpfVwiPlxuICAgICAgICAgICAgICAgICAgPHNvdXJjZSBzcmM9XCIke3VybEVuZC5zbGljZSg1KX1cIiB0eXBlPVwidmlkZW8vbXA0XCI+XG4gICAgICAgICAgICAgICAgICBadXJlIG5hYmlnYXp0YWlsZWFrIGV6aW4gZHUgYmlkZW9yaWsgZXJha3V0c2kgOihcbiAgICAgICAgICAgICAgICA8L3ZpZGVvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuZXBpc29kZV9fcGxheScpLmlubmVySFRNTCA9IHRwbFxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuZXBpc29kZV9faGVhZGVyJykuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXBpc29kZV9fdGl0bGVcIj4ke2pzb24udGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlcGlzb2RlX19kZXNjXCI+JHtqc29uLmRlc2NyaXB0aW9ufTwvZGl2PlxuICAgICAgICAgICAgICBgXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0di1wcm9ncmFtLWVwaXNvZGUnLCBkYXRhKVxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuZXBpc29kZV9fcGxheScpLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiZXJyb3JcIj5Lb25leGlvYWsgaHV0cyBlZ2luIGR1PC9kaXY+J1xuICAgICAgICAgIH0pXG4gICAgICB9IC8vZmV0Y2hFcGlzb2RlXG4gICAgICBcbiAgICAgIC8vUHJvZ3JhbWEgemVycmVuZGF0aWsgZXBpc29kZSBla2FycmkgKGNsaWNrKVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKCcucHJvZ3JhbV9fbGlzdCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgaWYoIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY3VzdG9tLWVwaXNvZGUnKSApIHtcblxuICAgICAgICAgIGxldCBkYXRhID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWVwaXNvZGUnKVxuXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3R2LXByb2dyYW0tZXBpc29kZScsIGRhdGEpXG4gICAgICAgICAgZmV0Y2hFcGlzb2RlKGRhdGEsIGZhbHNlKVxuICAgICAgICAgIFxuICAgICAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChlcGlzb2RlKVxuICAgICAgICAgIGlmICggJ3NlcnZpY2VXb3JrZXInIGluIG4gJiYgJ1N5bmNNYW5hZ2VyJyBpbiB3ICkge1xuICAgICAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJCR1N5bmMgKCkge1xuICAgICAgICAgICAgICBuLnNlcnZpY2VXb3JrZXIucmVhZHlcbiAgICAgICAgICAgICAgLnRoZW4ocmVnaXN0cmF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uLnN5bmMucmVnaXN0ZXIoJ25haGllcmFuLXR2LXByb2dyYW0tZXBpc29kZScpXG4gICAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4gYygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIGVycmVnaXN0cmF0dWEnKSApXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goIGVyciA9PiBjKCdFcnJvcmVhIGF0emVrbyBzaW5rcm9uaXphemlvYSBlcnJlZ2lzdHJhdHplYW4nLCBlcnIpIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlZ2lzdGVyQkdTeW5jKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAvL0JhY2tncm91bmQgU3luYyAoZXBpc29kZSlcbiAgICAgIG4uc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZSA9PiB7XG4gICAgICAgIGMoJ0F0emVrbyBzaW5rcm9uaXphemlvYSBtZXNzYWdlIGJpZGV6OiAnLCBlLmRhdGEpXG4gICAgICAgIGlmKCBlLmRhdGEgPT09ICdvbmxpbmUgbmFoaWVyYW4tdHYtcHJvZ3JhbS1lcGlzb2RlJylcbiAgICAgICAgICBmZXRjaEVwaXNvZGUobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3R2LXByb2dyYW0tZXBpc29kZScpLCB0cnVlKVxuICAgICAgfSlcbiAgICAgIFxuICAgIH0gLy9yZWFkeVN0YXRlXG4gIH0sIDEwMCApLy9pbnRlcnZhbFxuXG4gIHJldHVybiBgXG4gICAgPGRpdiBjbGFzcz1cImxvYWRlci10ZW1wbGF0ZSBsb2FkZXItdGVtcGxhdGUtZXBpc29kZVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImxvYWRlciBsb2FkZXItZXBpc29kZVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICAgIFxuICAgIDxkaXYgY2xhc3M9XCJlcGlzb2RlIHNlY3Rpb24gdS1oaWRlXCI+XG4gICAgICA8aGVhZGVyIGNsYXNzPVwic2VjdGlvbi1oZWFkZXIgZXBpc29kZV9faGVhZGVyXCI+PC9oZWFkZXI+XG4gICAgICA8ZGl2IGNsYXNzPVwiZXBpc29kZV9fcGxheVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImVwaXNvZGVfX25hdlwiPjxhIGhyZWY9XCIjXCIgaWQ9XCJlcGlzb2RlX19iYWNrXCI+PCBBdHplcmE8L2E+PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgYFxufVxuIiwiaW1wb3J0IHsgaW5pdCwgcHdhLCBpc09ubGluZSB9IGZyb20gJy4vY29tcG9uZW50cy9pbml0JztcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpLmlubmVySFRNTCA9IGluaXQoKVxuXG4vL0FwbGlremlvYSB3ZWIgcHJvZ3Jlc2lib2EgZXJyZWdpc3RyYXR1XG5wd2EoKVxuXG4vL09ubGluZS9mZmxpbmUgZ2F1ZGVuIHplaGF6dHVcbmlzT25saW5lKClcbiJdfQ==
