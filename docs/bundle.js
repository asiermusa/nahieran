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

      //Kategoriak ekarri
      var fetchAllCategories = function fetchAllCategories(data, requestFromBGSync) {
        //Beharrezko sekzioak ezkutatu
        d.querySelectorAll('.section').forEach(function (section) {
          section.classList.add('u-hide');
        });
        d.querySelector('.categories').classList.remove('u-hide');
        d.querySelector('.tv').classList.remove('u-hide');

        fetch(data).then(function (response) {
          return response.json();
        }).then(function (json) {

          if (!requestFromBGSync) {
            localStorage.removeItem('category-list');
          }

          localStorage.setItem('localJsonCategories', JSON.stringify(json));

          json.member.forEach(function (jsonCat) {
            tpl += '\n              <li>\n                <a href="#" class="category-id" data-category="' + jsonCat["@id"] + '">\n                \t' + jsonCat.title + '\n                </a>\n              </li>\n              ';
          });

          d.querySelector('.categories__list').innerHTML = tpl;
        }).catch(function (err) {
          return localStorage.setItem('category-list', data);
        });
      };

      //Aplikaziora sartzen denean egin beharrekoa


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
      });var data = '//still-castle-99749.herokuapp.com/program-type-list';

      localStorage.setItem('category-list', data);

      fetchAllCategories(data, false);

      //Background Sync (programak)
      if ('serviceWorker' in n && 'SyncManager' in w) {
        var registerBGSync = function registerBGSync() {
          n.serviceWorker.ready.then(function (registration) {
            return registration.sync.register('nahieran-tv-categories').then(function () {
              return c('Atzeko sinkronizazioa erregistratua');
            }).catch(function (err) {
              return c('Errorea atzeko sinkronizazioa erregistratzean', err);
            });
          });
        };

        registerBGSync();
      }
      //Background Sync (programak)
      n.serviceWorker.addEventListener('message', function (e) {
        c('Atzeko sinkronizazioa message bidez: ', e.data);
        if (e.data === 'online nahieran-tv-categories') fetchAllCategories(localStorage.getItem('category-list'), true);
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
          var catName = e.target.innerHTML;
          var data = e.target.getAttribute('data-category');

          localStorage.setItem('category', data);
          localStorage.setItem('category-name', catName);

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
        if (e.data === 'online nahieran-category') fetchCategory(localStorage.getItem('category'), true, localStorage.getItem('category-name'));
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

          //Bideoa martxan badago ere, geratu
          if (d.getElementById("video").pause()) d.getElementById("video").pause();

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
                return c('Atzeko sinkronizazioa erregistratua');
              }).catch(function (err) {
                return c('Errorea atzeko sinkronizazioa erregistratzean', err);
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
            tpl += '\n                <li class="custom-episode" data-episode="' + json["@id"] + '">\n      \t\t\t\t\t  <div class="program__image">\n                    <img src="' + json.episode_image.slice(5) + '" class="program__img custom-episode" data-episode="' + json["@id"] + '">\n                  </div>\n\n                  <div class="program__content custom-episode" data-episode="' + json["@id"] + '">\n                    ' + json.title + '\n                  <div class="program__date">' + date + '</div>\n                  </div>\n                </li>\n                ';
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

  return '\n    <div class="loader-template loader-template-episode">\n      <div class="loader loader-episode"></div>\n    </div>\n\n    <div class="episode section u-hide">\n      <header class="section-header episode__header"></header>\n      <div class="episode__play"></div>\n      <div class="episode__nav"><a href="#" id="episode__back">< Atzera</a></div>\n    </div>\n    ';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29tcG9uZW50cy9jYXRlZ29yaWVzLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2F0ZWdvcmllc1NpbmdsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2luaXQuanMiLCJzcmMvanMvY29tcG9uZW50cy90di5qcyIsInNyYy9qcy9jb21wb25lbnRzL3R2UHJvZ3JhbS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3R2UHJvZ3JhbUVwaXNvZGUuanMiLCJzcmMvanMvc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFNLElBQUksUUFBUSxHQUFsQjtBQUFBLElBQ0UsSUFBSSxRQUROO0FBQUEsSUFFRSxJQUFJLFNBRk47QUFBQSxJQUdFLElBQUksTUFITjs7QUFLTyxJQUFNLGtDQUFhLFNBQWIsVUFBYSxHQUFNOztBQUU5QixNQUFNLGFBQWEsWUFBWSxZQUFNOztBQUVuQyxRQUFLLEVBQUUsVUFBRixLQUFrQixVQUF2QixFQUFvQzs7QUF5QmxDO0FBekJrQyxVQTBCekIsa0JBMUJ5QixHQTBCbEMsU0FBUyxrQkFBVCxDQUE0QixJQUE1QixFQUFrQyxpQkFBbEMsRUFBcUQ7QUFDbkQ7QUFDQSxVQUFFLGdCQUFGLENBQW1CLFVBQW5CLEVBQStCLE9BQS9CLENBQXdDLG1CQUFXO0FBQ2pELGtCQUFRLFNBQVIsQ0FBa0IsR0FBbEIsQ0FBc0IsUUFBdEI7QUFDRCxTQUZEO0FBR0EsVUFBRSxhQUFGLENBQWdCLGFBQWhCLEVBQStCLFNBQS9CLENBQXlDLE1BQXpDLENBQWdELFFBQWhEO0FBQ0EsVUFBRSxhQUFGLENBQWdCLEtBQWhCLEVBQXVCLFNBQXZCLENBQWlDLE1BQWpDLENBQXdDLFFBQXhDOztBQUVBLGNBQU0sSUFBTixFQUNHLElBREgsQ0FDUztBQUFBLGlCQUFZLFNBQVMsSUFBVCxFQUFaO0FBQUEsU0FEVCxFQUVHLElBRkgsQ0FFUSxnQkFBUTs7QUFFWixjQUFLLENBQUMsaUJBQU4sRUFBMEI7QUFDeEIseUJBQWEsVUFBYixDQUF3QixlQUF4QjtBQUNEOztBQUVELHVCQUFhLE9BQWIsQ0FBcUIscUJBQXJCLEVBQTRDLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBNUM7O0FBRUEsZUFBSyxNQUFMLENBQVksT0FBWixDQUFvQixtQkFBVztBQUM3Qiw2R0FFbUQsUUFBUSxLQUFSLENBRm5ELDhCQUdLLFFBQVEsS0FIYjtBQU9ELFdBUkQ7O0FBVUEsWUFBRSxhQUFGLENBQWdCLG1CQUFoQixFQUFxQyxTQUFyQyxHQUFpRCxHQUFqRDtBQUNELFNBckJILEVBc0JHLEtBdEJILENBc0JTO0FBQUEsaUJBQ0wsYUFBYSxPQUFiLENBQXFCLGVBQXJCLEVBQXNDLElBQXRDLENBREs7QUFBQSxTQXRCVDtBQXlCRCxPQTNEaUM7O0FBNkRsQzs7O0FBM0RBLG9CQUFjLFVBQWQ7O0FBRUEsVUFBSSxNQUFNLEVBQVY7O0FBRUE7QUFDQSxRQUFFLGNBQUYsQ0FBaUIsZ0JBQWpCLEVBQW1DLGdCQUFuQyxDQUFvRCxPQUFwRCxFQUE2RCxVQUFDLENBQUQsRUFBTztBQUNsRSxVQUFFLGFBQUYsQ0FBZ0Isa0JBQWhCLEVBQW9DLFNBQXBDLENBQThDLE1BQTlDLENBQXFELFNBQXJEOztBQUVBO0FBQ0EsWUFBSSxFQUFFLGFBQUYsQ0FBZ0IsV0FBaEIsRUFBNkIsU0FBN0IsQ0FBdUMsUUFBdkMsQ0FBZ0QsV0FBaEQsQ0FBSixFQUFpRTtBQUMvRCxZQUFFLGFBQUYsQ0FBZ0IsV0FBaEIsRUFBNkIsU0FBN0IsQ0FBdUMsTUFBdkMsQ0FBOEMsV0FBOUM7QUFDRCxTQUZELE1BRU07QUFDSixZQUFFLGFBQUYsQ0FBZ0IsV0FBaEIsRUFBNkIsU0FBN0IsQ0FBdUMsR0FBdkMsQ0FBMkMsV0FBM0M7QUFDRDtBQUNGLE9BVEQ7QUFVQTtBQUNBLFFBQUUsZ0JBQUYsQ0FBbUIsT0FBbkIsRUFBNEIsVUFBQyxDQUFELEVBQU87QUFDakMsWUFBSSxFQUFFLE9BQUYsSUFBYSxFQUFqQixFQUFxQjtBQUNuQixZQUFFLGFBQUYsQ0FBZ0Isa0JBQWhCLEVBQW9DLFNBQXBDLENBQThDLE1BQTlDLENBQXFELFNBQXJEO0FBQ0EsWUFBRSxhQUFGLENBQWdCLFdBQWhCLEVBQTZCLFNBQTdCLENBQXVDLE1BQXZDLENBQThDLFdBQTlDO0FBQ0Q7QUFDRixPQUxELEVBNENBLElBQUksT0FBTyxzREFBWDs7QUFFQSxtQkFBYSxPQUFiLENBQXFCLGVBQXJCLEVBQXNDLElBQXRDOztBQUVBLHlCQUFtQixJQUFuQixFQUF5QixLQUF6Qjs7QUFFQTtBQUNBLFVBQUssbUJBQW1CLENBQW5CLElBQXdCLGlCQUFpQixDQUE5QyxFQUFrRDtBQUFBLFlBQ3ZDLGNBRHVDLEdBQ2hELFNBQVMsY0FBVCxHQUEyQjtBQUN6QixZQUFFLGFBQUYsQ0FBZ0IsS0FBaEIsQ0FDQyxJQURELENBQ00sd0JBQWdCO0FBQ3BCLG1CQUFPLGFBQWEsSUFBYixDQUFrQixRQUFsQixDQUEyQix3QkFBM0IsRUFDSixJQURJLENBQ0U7QUFBQSxxQkFBTSxFQUFFLHFDQUFGLENBQU47QUFBQSxhQURGLEVBRUosS0FGSSxDQUVHO0FBQUEscUJBQU8sRUFBRSwrQ0FBRixFQUFtRCxHQUFuRCxDQUFQO0FBQUEsYUFGSCxDQUFQO0FBR0QsV0FMRDtBQU1ELFNBUitDOztBQVNoRDtBQUNEO0FBQ0Q7QUFDQSxRQUFFLGFBQUYsQ0FBZ0IsZ0JBQWhCLENBQWlDLFNBQWpDLEVBQTRDLGFBQUs7QUFDL0MsVUFBRSx1Q0FBRixFQUEyQyxFQUFFLElBQTdDO0FBQ0EsWUFBSSxFQUFFLElBQUYsS0FBVywrQkFBZixFQUNFLG1CQUFvQixhQUFhLE9BQWIsQ0FBcUIsZUFBckIsQ0FBcEIsRUFBMkQsSUFBM0Q7QUFDSCxPQUpEO0FBTUQsS0F6RmtDLENBeUZqQztBQUVILEdBM0ZrQixFQTJGaEIsR0EzRmdCLENBQW5CLENBRjhCLENBNkZ0Qjs7QUFFUjtBQU1ELENBckdNOzs7Ozs7OztBQ0xQLElBQU0sSUFBSSxRQUFRLEdBQWxCO0FBQUEsSUFDRSxJQUFJLFFBRE47QUFBQSxJQUVFLElBQUksU0FGTjtBQUFBLElBR0UsSUFBSSxNQUhOOztBQUtPLElBQU0sOENBQW1CLFNBQW5CLGdCQUFtQixHQUFNOztBQUVwQyxNQUFNLGFBQWEsWUFBWSxZQUFNOztBQUVuQyxRQUFLLEVBQUUsVUFBRixLQUFrQixVQUF2QixFQUFvQzs7QUFJbEM7QUFKa0MsVUFLMUIsYUFMMEIsR0FLbkMsU0FBUyxhQUFULENBQXVCLFFBQXZCLEVBQWlDLGlCQUFqQyxFQUFvRCxPQUFwRCxFQUE2RDs7QUFFN0QsWUFBSSxPQUFPLFNBQVMsS0FBVCxDQUFlLENBQWYsQ0FBWDtBQUFBLFlBQ0UsTUFBTSxFQURSOztBQUdHLFVBQUUsYUFBRixDQUFnQixrQkFBaEIsRUFBb0MsU0FBcEMsQ0FBOEMsTUFBOUMsQ0FBcUQsU0FBckQ7QUFDQSxVQUFFLGFBQUYsQ0FBZ0IsV0FBaEIsRUFBNkIsU0FBN0IsQ0FBdUMsTUFBdkMsQ0FBOEMsV0FBOUM7QUFDQTtBQUNBLFVBQUUsYUFBRixDQUFnQixhQUFoQixFQUErQixTQUEvQixDQUF5QyxHQUF6QyxDQUE2QyxhQUE3QztBQUNBLFVBQUUsYUFBRixDQUFnQixzQkFBaEIsRUFBd0MsU0FBeEMsQ0FBa0QsR0FBbEQsQ0FBc0QsYUFBdEQ7QUFDQTtBQUNBLFVBQUUsZ0JBQUYsQ0FBbUIsVUFBbkIsRUFBK0IsT0FBL0IsQ0FBd0MsbUJBQVc7QUFDakQsa0JBQVEsU0FBUixDQUFrQixHQUFsQixDQUFzQixRQUF0QjtBQUNELFNBRkQ7O0FBSUEsY0FBTSxJQUFOLEVBQ0csSUFESCxDQUNTO0FBQUEsaUJBQVksU0FBUyxJQUFULEVBQVo7QUFBQSxTQURULEVBRUcsSUFGSCxDQUVRLGdCQUFROztBQUVaLGNBQUssQ0FBQyxpQkFBTixFQUEwQjtBQUN4Qix5QkFBYSxVQUFiLENBQXdCLFVBQXhCO0FBQ0o7O0FBRUU7QUFDQSxZQUFFLGFBQUYsQ0FBZ0IsYUFBaEIsRUFBK0IsU0FBL0IsQ0FBeUMsTUFBekMsQ0FBZ0QsYUFBaEQ7QUFDQSxZQUFFLGFBQUYsQ0FBZ0Isc0JBQWhCLEVBQXdDLFNBQXhDLENBQWtELE1BQWxELENBQXlELGFBQXpEOztBQUVBLFlBQUUsYUFBRixDQUFnQixhQUFoQixFQUErQixTQUEvQixDQUF5QyxNQUF6QyxDQUFnRCxRQUFoRDs7QUFFRixlQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLG1CQUFXO0FBQzNCLCtHQUVtRCxRQUFRLEtBQVIsQ0FGbkQsZ0NBR1EsUUFBUSxLQUhoQjtBQU9ELFdBUkg7O0FBVUUsWUFBRSxhQUFGLENBQWdCLG1CQUFoQixFQUFxQyxTQUFyQyxHQUFpRCxHQUFqRDtBQUNBLFlBQUUsYUFBRixDQUFnQixxQkFBaEIsRUFBdUMsU0FBdkMsK0NBQzJCLE9BRDNCLHdEQUU4QixLQUFLLE1BQUwsQ0FBWSxNQUYxQztBQUlELFNBN0JILEVBOEJHLEtBOUJILENBOEJTO0FBQUEsaUJBQU8sUUFBUSxHQUFSLENBQVksR0FBWixDQUFQO0FBQUEsU0E5QlQ7QUFnQ0QsT0FwRGlDLEVBb0RoQzs7QUFsREYsb0JBQWMsVUFBZCxFQW9EQSxFQUFFLGFBQUYsQ0FBZ0IsbUJBQWhCLEVBQXFDLGdCQUFyQyxDQUFzRCxPQUF0RCxFQUErRCxVQUFDLENBQUQsRUFBTzs7QUFFcEUsVUFBRSxjQUFGO0FBQ0EsWUFBSSxFQUFFLGNBQUYsQ0FBaUIsT0FBakIsQ0FBSixFQUNFLEVBQUUsY0FBRixDQUFpQixPQUFqQixFQUEwQixLQUExQjs7QUFFRixZQUFJLEVBQUUsTUFBRixDQUFTLFNBQVQsQ0FBbUIsUUFBbkIsQ0FBNEIsYUFBNUIsQ0FBSixFQUFpRDtBQUMvQyxjQUFJLFVBQVUsRUFBRSxNQUFGLENBQVMsU0FBdkI7QUFDQSxjQUFJLE9BQU8sRUFBRSxNQUFGLENBQVMsWUFBVCxDQUFzQixlQUF0QixDQUFYOztBQUVBLHVCQUFhLE9BQWIsQ0FBcUIsVUFBckIsRUFBaUMsSUFBakM7QUFDQSx1QkFBYSxPQUFiLENBQXFCLGVBQXJCLEVBQXNDLE9BQXRDOztBQUVBLHdCQUFjLElBQWQsRUFBb0IsS0FBcEIsRUFBMkIsT0FBM0I7O0FBRUE7QUFDQSxjQUFLLG1CQUFtQixDQUFuQixJQUF3QixpQkFBaUIsQ0FBOUMsRUFBa0Q7QUFBQSxnQkFDdkMsY0FEdUMsR0FDaEQsU0FBUyxjQUFULEdBQTJCO0FBQ3pCLGdCQUFFLGFBQUYsQ0FBZ0IsS0FBaEIsQ0FDQyxJQURELENBQ00sd0JBQWdCO0FBQ3BCLHVCQUFPLGFBQWEsSUFBYixDQUFrQixRQUFsQixDQUEyQixtQkFBM0IsRUFDTixJQURNLENBQ0E7QUFBQSx5QkFBTSxFQUFFLHFDQUFGLENBQU47QUFBQSxpQkFEQSxFQUVOLEtBRk0sQ0FFQztBQUFBLHlCQUFPLEVBQUUsK0NBQUYsRUFBbUQsR0FBbkQsQ0FBUDtBQUFBLGlCQUZELENBQVA7QUFHRCxlQUxEO0FBTUQsYUFSK0M7O0FBU2hEO0FBQ0Q7QUFDRjtBQUNGLE9BNUJEO0FBNkJBO0FBQ0EsUUFBRSxhQUFGLENBQWdCLGdCQUFoQixDQUFpQyxTQUFqQyxFQUE0QyxhQUFLO0FBQ2pELGdCQUFRLEdBQVIsQ0FBWSxpREFBWixFQUErRCxFQUFFLElBQWpFO0FBQ0EsWUFBSSxFQUFFLElBQUYsS0FBVywwQkFBZixFQUNDLGNBQWMsYUFBYSxPQUFiLENBQXFCLFVBQXJCLENBQWQsRUFBZ0QsSUFBaEQsRUFBc0QsYUFBYSxPQUFiLENBQXFCLGVBQXJCLENBQXREO0FBQ0YsT0FKQztBQU1ELEtBNUZrQyxDQTRGakM7QUFFSCxHQTlGa0IsRUE4RmhCLEdBOUZnQixDQUFuQixDQUZvQyxDQWdHM0I7O0FBRVQ7QUFTRCxDQTNHTTs7Ozs7Ozs7OztBQ0xQOztBQUVBLElBQU0sSUFBSSxRQUFRLEdBQWxCO0FBQUEsSUFDRSxJQUFJLFFBRE47QUFBQSxJQUVFLElBQUksU0FGTjtBQUFBLElBR0UsSUFBSSxNQUhOOztBQUtPLElBQU0sb0JBQU0sU0FBTixHQUFNLEdBQU07QUFDdkI7QUFDQSxNQUFLLG1CQUFtQixDQUF4QixFQUE0QjtBQUMxQixNQUFFLGFBQUYsQ0FBZ0IsUUFBaEIsQ0FBeUIsU0FBekIsRUFDQyxJQURELENBQ08sd0JBQWdCO0FBQ3JCLFFBQUUsOEJBQUYsRUFBa0MsYUFBYSxLQUEvQztBQUNELEtBSEQsRUFJQyxLQUpELENBSVE7QUFBQSxhQUFPLHdDQUF3QyxHQUF4QyxDQUFQO0FBQUEsS0FKUjtBQUtEO0FBQ0YsQ0FUTTs7QUFXQSxJQUFNLDhCQUFXLFNBQVgsUUFBVyxHQUFNO0FBQzVCO0FBQ0EsTUFBTSxlQUFlLEVBQUUsYUFBRixDQUFnQix3QkFBaEIsQ0FBckI7O0FBRUEsV0FBUyxhQUFULENBQXdCLENBQXhCLEVBQTJCOztBQUV6QixRQUFLLEVBQUUsTUFBUCxFQUFnQjtBQUNkLG1CQUFhLFlBQWIsQ0FBMEIsU0FBMUIsRUFBcUMsU0FBckM7QUFDQSxRQUFFLGFBQUYsQ0FBZ0Isc0JBQWhCLEVBQXdDLFNBQXhDLENBQWtELE1BQWxELENBQXlELFNBQXpEO0FBQ0EsUUFBRSxhQUFGLENBQWdCLFVBQWhCLEVBQTRCLFNBQTVCLEdBQXdDLEVBQXhDO0FBQ0QsS0FKRCxNQUlPO0FBQ0wsbUJBQWEsWUFBYixDQUEwQixTQUExQixFQUFxQyxTQUFyQztBQUNBLFFBQUUsYUFBRixDQUFnQixzQkFBaEIsRUFBd0MsU0FBeEMsQ0FBa0QsR0FBbEQsQ0FBc0QsU0FBdEQ7QUFDQSxRQUFFLGFBQUYsQ0FBZ0IsVUFBaEIsRUFBNEIsU0FBNUIsR0FBd0MsaURBQXhDO0FBQ0Q7QUFDRjs7QUFFRCxJQUFFLGdCQUFGLENBQW1CLFFBQW5CLEVBQTZCLGFBQTdCO0FBQ0EsSUFBRSxnQkFBRixDQUFtQixTQUFuQixFQUE4QixhQUE5QjtBQUNELENBbkJNOztBQXFCQSxJQUFNLHNCQUFPLFNBQVAsSUFBTyxDQUFDLElBQUQsRUFBVTs7QUFFNUIsTUFBTSxZQUFZLFlBQVksWUFBTTtBQUNsQztBQUNBLFFBQUssRUFBRSxVQUFGLEtBQWtCLFVBQXZCLEVBQW9DO0FBQ2xDLG9CQUFjLFNBQWQ7QUFDQSxRQUFFLGNBQUYsQ0FBaUIsWUFBakIsRUFBK0IsZ0JBQS9CLENBQWdELE9BQWhELEVBQXlELFVBQUMsQ0FBRCxFQUFPO0FBQzlELGlCQUFTLE1BQVQ7QUFDRCxPQUZEO0FBR0Q7QUFDRixHQVJpQixDQUFsQjs7QUFVQSwyZ0JBZUUsYUFmRixzV0F1QmlDLGFBQWEsT0FBYixDQUFxQixVQUFyQixDQXZCakM7QUF1Q0QsQ0FuRE07Ozs7Ozs7Ozs7QUN2Q1A7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsSUFBTSxJQUFJLFFBQVEsR0FBbEI7QUFBQSxJQUNFLElBQUksUUFETjtBQUFBLElBRUUsSUFBSSxTQUZOO0FBQUEsSUFHRSxJQUFJLE1BSE47O0FBS0EsSUFBTSxZQUFZLFNBQVosU0FBWSxDQUFDLEVBQUQsRUFBUTs7QUFFeEIsSUFBRSxjQUFGLENBQWlCLGVBQWpCLEVBQWtDLGdCQUFsQyxDQUFtRCxPQUFuRCxFQUE0RCxVQUFDLENBQUQsRUFBTzs7QUFFakUsUUFBSSxPQUFPLEtBQUssS0FBTCxDQUFZLGFBQWEsT0FBYixDQUFxQixXQUFyQixDQUFaLENBQVg7QUFBQSxRQUNFLFFBQVEsSUFEVjtBQUFBLFFBRUUsTUFBTSxFQUZSOztBQUlBLFlBQVEsS0FBSyxNQUFMLENBQVksTUFBWixDQUFvQixnQkFBUTtBQUNsQyxhQUFPLEtBQUssS0FBTCxDQUFXLFdBQVgsR0FBeUIsUUFBekIsQ0FBa0MsRUFBRSxNQUFGLENBQVMsS0FBVCxDQUFlLFdBQWYsRUFBbEMsQ0FBUDtBQUNELEtBRk8sQ0FBUjs7QUFJQSxVQUFNLE9BQU4sQ0FBYyxnQkFBUTtBQUNwQixxRkFHaUQsS0FBSyxLQUFMLENBSGpELG9CQUlJLEtBQUssS0FKVDtBQVFELEtBVEQ7O0FBV0EsTUFBRSxhQUFGLENBQWdCLEVBQWhCLEVBQW9CLFNBQXBCLEdBQWdDLEdBQWhDO0FBQ0EsTUFBRSxhQUFGLENBQWdCLGFBQWhCLEVBQStCLFNBQS9CLGlDQUF1RSxNQUFNLE1BQTdFO0FBQ0QsR0F2QkQ7QUF3QkQsQ0ExQkQ7O0FBNEJPLElBQU0sa0JBQUssU0FBTCxFQUFLLEdBQU07O0FBRXRCLE1BQU0sYUFBYSxZQUFZLFlBQU07O0FBRW5DLFFBQUssRUFBRSxVQUFGLEtBQWtCLFVBQXZCLEVBQW9DOztBQUlsQztBQUprQyxVQUt6QixXQUx5QixHQUtsQyxTQUFTLFdBQVQsQ0FBcUIsSUFBckIsRUFBMkI7O0FBRXpCLFlBQUksTUFBTSxFQUFWOztBQUVBLGFBQUssS0FBTCxDQUFXLElBQVgsRUFBaUIsTUFBakIsQ0FBd0IsT0FBeEIsQ0FBZ0MsZ0JBQVE7O0FBRXRDLHFHQUVtRCxLQUFLLEtBQUwsQ0FGbkQsNEJBR1EsS0FBSyxLQUhiO0FBT0QsU0FURDs7QUFXQSxVQUFFLGFBQUYsQ0FBZ0IsV0FBaEIsRUFBNkIsU0FBN0IsR0FBeUMsR0FBekM7QUFDQSxVQUFFLGFBQUYsQ0FBZ0IsYUFBaEIsRUFBK0IsU0FBL0IseURBQStGLEtBQUssS0FBTCxDQUFZLElBQVosRUFBbUIsTUFBbkIsQ0FBMEIsTUFBekg7QUFDQTtBQUNBLFVBQUUsYUFBRixDQUFnQixZQUFoQixFQUE4QixTQUE5QixDQUF3QyxNQUF4QyxDQUErQyxhQUEvQztBQUNBLFVBQUUsYUFBRixDQUFnQixxQkFBaEIsRUFBdUMsU0FBdkMsQ0FBaUQsTUFBakQsQ0FBd0QsYUFBeEQ7QUFDQTtBQUNBLFVBQUUsYUFBRixDQUFnQixvQkFBaEIsRUFBc0MsU0FBdEMsQ0FBZ0QsR0FBaEQsQ0FBb0QsVUFBcEQ7QUFDRCxPQTNCaUM7O0FBNkJsQzs7O0FBN0JrQyxVQThCekIsZ0JBOUJ5QixHQThCbEMsU0FBUyxnQkFBVCxDQUEwQixJQUExQixFQUFnQyxpQkFBaEMsRUFBbUQsS0FBbkQsRUFBMEQ7O0FBRXhELFlBQUksTUFBTSxFQUFWOztBQUVBO0FBQ0EsVUFBRSxhQUFGLENBQWdCLHFCQUFoQixFQUF1QyxTQUF2QyxDQUFpRCxHQUFqRCxDQUFxRCxhQUFyRDtBQUNBLFVBQUUsYUFBRixDQUFnQixZQUFoQixFQUE4QixTQUE5QixDQUF3QyxHQUF4QyxDQUE0QyxhQUE1QztBQUNBO0FBQ0EsVUFBRSxnQkFBRixDQUFtQixVQUFuQixFQUErQixPQUEvQixDQUF3QyxtQkFBVztBQUNqRCxrQkFBUSxTQUFSLENBQWtCLEdBQWxCLENBQXNCLFFBQXRCO0FBQ0QsU0FGRDtBQUdBLFVBQUUsYUFBRixDQUFnQixhQUFoQixFQUErQixTQUEvQixDQUF5QyxNQUF6QyxDQUFnRCxRQUFoRDtBQUNBLFVBQUUsYUFBRixDQUFnQixLQUFoQixFQUF1QixTQUF2QixDQUFpQyxNQUFqQyxDQUF3QyxRQUF4Qzs7QUFFQTtBQUNBLFlBQUcsS0FBSCxFQUFVOztBQUVSLGdCQUFNLElBQU4sRUFDRyxJQURILENBQ1M7QUFBQSxtQkFBWSxTQUFTLElBQVQsRUFBWjtBQUFBLFdBRFQsRUFFRyxJQUZILENBRVEsZ0JBQVE7O0FBRVosZ0JBQUssQ0FBQyxpQkFBTixFQUEwQjtBQUN4QiwyQkFBYSxVQUFiLENBQXdCLElBQXhCO0FBQ0Q7O0FBRUQseUJBQWEsT0FBYixDQUFxQixXQUFyQixFQUFrQyxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQWxDOztBQUVBLGdCQUFJLFlBQVksSUFBSSxJQUFKLEVBQWhCO0FBQUEsZ0JBQ0UsT0FBTyxVQUFVLFdBQVYsS0FBMEIsR0FBMUIsR0FBZ0MsQ0FBQyxPQUFPLFVBQVUsUUFBVixLQUFxQixDQUE1QixDQUFELEVBQWlDLEtBQWpDLENBQXVDLENBQUMsQ0FBeEMsQ0FBaEMsR0FBNkUsR0FBN0UsR0FBbUYsQ0FBQyxNQUFNLFVBQVUsT0FBVixFQUFQLEVBQTRCLEtBQTVCLENBQWtDLENBQUMsQ0FBbkMsQ0FBbkYsR0FBMkgsS0FEcEk7QUFBQSxnQkFFRSxPQUFPLENBQUMsTUFBTSxVQUFVLFFBQVYsRUFBUCxFQUE2QixLQUE3QixDQUFtQyxDQUFDLENBQXBDLElBQXlDLEdBQXpDLEdBQStDLENBQUMsTUFBTSxVQUFVLFVBQVYsRUFBUCxFQUErQixLQUEvQixDQUFxQyxDQUFDLENBQXRDLENBRnhEO0FBQUEsZ0JBR0UsV0FBVyxPQUFPLEdBQVAsR0FBYSxJQUgxQjs7QUFLQSx5QkFBYSxPQUFiLENBQXFCLFVBQXJCLEVBQWlDLFFBQWpDO0FBQ0EsY0FBRSxhQUFGLENBQWdCLGFBQWhCLEVBQStCLFNBQS9CLEdBQTJDLGFBQWEsT0FBYixDQUFxQixVQUFyQixDQUEzQzs7QUFFQSx3QkFBWSxhQUFhLE9BQWIsQ0FBcUIsV0FBckIsQ0FBWjs7QUFFQTtBQUNBLGdCQUFJLEVBQUUsWUFBRixJQUFrQixhQUFhLFVBQWIsS0FBNEIsUUFBbEQsRUFBNkQ7QUFDM0QsMkJBQWEsaUJBQWIsQ0FBK0Isa0JBQVU7QUFDdkMsd0JBQVEsR0FBUixDQUFZLE1BQVo7QUFDQSxvQkFBSSxJQUFJLElBQUksWUFBSixDQUFpQixVQUFqQixFQUE2QjtBQUNuQyx3QkFBTSxtQ0FENkI7QUFFbkMsd0JBQU07QUFGNkIsaUJBQTdCLENBQVI7QUFJRCxlQU5EO0FBT0Q7QUFDRixXQTlCSCxFQStCRyxLQS9CSCxDQStCUyxlQUFPO0FBQ1oseUJBQWEsT0FBYixDQUFxQixJQUFyQixFQUEyQixJQUEzQjtBQUNILFdBakNEOztBQW1DRjtBQUNDLFNBdENELE1Bc0NLO0FBQ0gsc0JBQVksSUFBWjtBQUNEO0FBRUYsT0F2RmlDLEVBdUZqQzs7QUFFRDs7O0FBdkZBLG9CQUFjLFVBQWQsRUF3RkEsVUFBVSxXQUFWOztBQUVBO0FBQ0EsUUFBRSxhQUFGLENBQWdCLGdCQUFoQixFQUFrQyxnQkFBbEMsQ0FBbUQsT0FBbkQsRUFBNEQsVUFBQyxDQUFELEVBQU87O0FBRWpFLFVBQUUsY0FBRjtBQUNBLFlBQUssUUFBUSwyQ0FBUixLQUF3RCxJQUE3RCxFQUFtRTtBQUNqRSx1QkFBYSxVQUFiLENBQXdCLFdBQXhCO0FBQ0EsdUJBQWEsVUFBYixDQUF3QixVQUF4Qjs7QUFFQTtBQUNBLGNBQUcsRUFBRSxjQUFGLENBQWlCLE9BQWpCLEVBQTBCLEtBQTFCLEVBQUgsRUFDRSxFQUFFLGNBQUYsQ0FBaUIsT0FBakIsRUFBMEIsS0FBMUI7O0FBRUYsY0FBSSxRQUFRLElBQVo7QUFBQSxjQUNFLE9BQU0sNkNBRFI7O0FBR0EsdUJBQWEsT0FBYixDQUFxQixJQUFyQixFQUEyQixJQUEzQjs7QUFFQSwyQkFBaUIsSUFBakIsRUFBdUIsS0FBdkIsRUFBOEIsS0FBOUI7O0FBRUE7QUFDQSxjQUFLLG1CQUFtQixDQUFuQixJQUF3QixpQkFBaUIsQ0FBOUMsRUFBa0Q7QUFBQSxnQkFDdkMsY0FEdUMsR0FDaEQsU0FBUyxjQUFULEdBQTJCO0FBQ3pCLGdCQUFFLGFBQUYsQ0FBZ0IsS0FBaEIsQ0FDQyxJQURELENBQ00sd0JBQWdCO0FBQ3BCLHVCQUFPLGFBQWEsSUFBYixDQUFrQixRQUFsQixDQUEyQixhQUEzQixFQUNKLElBREksQ0FDRTtBQUFBLHlCQUFNLEVBQUUscUNBQUYsQ0FBTjtBQUFBLGlCQURGLEVBRUosS0FGSSxDQUVHO0FBQUEseUJBQU8sRUFBRSwrQ0FBRixFQUFtRCxHQUFuRCxDQUFQO0FBQUEsaUJBRkgsQ0FBUDtBQUdELGVBTEQ7QUFNRCxhQVIrQzs7QUFTaEQ7QUFDRDtBQUNGO0FBQ0YsT0EvQkQ7O0FBaUNBO0FBQ0EsVUFBRyxhQUFhLE9BQWIsQ0FBcUIsV0FBckIsQ0FBSCxFQUFxQztBQUNuQyx5QkFBaUIsYUFBYSxPQUFiLENBQXFCLFdBQXJCLENBQWpCLEVBQW9ELEtBQXBELEVBQTJELEtBQTNEO0FBQ0QsT0FGRCxNQUVLO0FBQ0gsWUFBSSxRQUFRLElBQVo7QUFBQSxZQUNFLE9BQU0sNkNBRFI7O0FBR0EscUJBQWEsT0FBYixDQUFxQixJQUFyQixFQUEyQixJQUEzQjs7QUFFQSx5QkFBaUIsSUFBakIsRUFBdUIsS0FBdkIsRUFBOEIsS0FBOUI7O0FBRUE7QUFDQSxZQUFLLG1CQUFtQixDQUFuQixJQUF3QixpQkFBaUIsQ0FBOUMsRUFBa0Q7QUFBQSxjQUN2QyxjQUR1QyxHQUNoRCxTQUFTLGNBQVQsR0FBMkI7QUFDekIsY0FBRSxhQUFGLENBQWdCLEtBQWhCLENBQ0MsSUFERCxDQUNNLHdCQUFnQjtBQUNwQixxQkFBTyxhQUFhLElBQWIsQ0FBa0IsUUFBbEIsQ0FBMkIsYUFBM0IsRUFDTixJQURNLENBQ0E7QUFBQSx1QkFBTSxFQUFFLHFDQUFGLENBQU47QUFBQSxlQURBLEVBRU4sS0FGTSxDQUVDO0FBQUEsdUJBQU8sRUFBRSwrQ0FBRixFQUFtRCxHQUFuRCxDQUFQO0FBQUEsZUFGRCxDQUFQO0FBR0QsYUFMRDtBQU1ELFdBUitDOztBQVNoRDtBQUNEO0FBQ0Y7QUFDRDtBQUNBLFFBQUUsYUFBRixDQUFnQixnQkFBaEIsQ0FBaUMsU0FBakMsRUFBNEMsYUFBSztBQUMvQyxVQUFFLHVDQUFGLEVBQTJDLEVBQUUsSUFBN0M7QUFDQSxZQUFJLEVBQUUsSUFBRixLQUFXLG9CQUFmLEVBQ0UsaUJBQWtCLGFBQWEsT0FBYixDQUFxQixJQUFyQixDQUFsQixFQUE4QyxJQUE5QyxFQUFvRCxLQUFwRDtBQUNILE9BSkQ7QUFNRCxLQS9Ka0MsQ0ErSmpDO0FBQ0gsR0FoS2tCLEVBZ0toQixHQWhLZ0IsQ0FBbkIsQ0FGc0IsQ0FrS2Q7O0FBRVIsb0JBQ0ksNkJBREosMGJBWUksK0JBWkosY0FhSSxzQ0FiSixjQWNJLHlDQWRKO0FBZ0JELENBcExNOzs7Ozs7OztBQ3RDUCxJQUFNLElBQUksUUFBUSxHQUFsQjtBQUFBLElBQ0UsSUFBSSxRQUROO0FBQUEsSUFFRSxJQUFJLFNBRk47QUFBQSxJQUdFLElBQUksTUFITjs7QUFLTyxJQUFNLHdDQUFnQixTQUFoQixhQUFnQixHQUFNOztBQUVqQyxNQUFNLGNBQWMsWUFBWSxZQUFNOztBQUVwQyxRQUFLLEVBQUUsVUFBRixLQUFrQixVQUF2QixFQUFvQzs7QUFJbEM7QUFKa0MsVUFLekIsWUFMeUIsR0FLbEMsU0FBUyxZQUFULENBQXNCLFFBQXRCLEVBQWdDLGlCQUFoQyxFQUFtRDs7QUFFakQsWUFBSSxPQUFPLFNBQVMsS0FBVCxDQUFlLENBQWYsQ0FBWDtBQUFBLFlBQ0UsTUFBTSxFQURSO0FBQUEsWUFFRSxPQUFPLEVBRlQ7O0FBSUE7QUFDQSxVQUFFLGdCQUFGLENBQW1CLFVBQW5CLEVBQStCLE9BQS9CLENBQXdDLG1CQUFXO0FBQ2pELGtCQUFRLFNBQVIsQ0FBa0IsR0FBbEIsQ0FBc0IsUUFBdEI7QUFDRCxTQUZEOztBQUlBO0FBQ0EsVUFBRSxhQUFGLENBQWdCLGlCQUFoQixFQUFtQyxTQUFuQyxDQUE2QyxHQUE3QyxDQUFpRCxhQUFqRDtBQUNBLFVBQUUsYUFBRixDQUFnQiwwQkFBaEIsRUFBNEMsU0FBNUMsQ0FBc0QsR0FBdEQsQ0FBMEQsYUFBMUQ7O0FBRUEsY0FBTSxJQUFOLEVBQ0csSUFESCxDQUNTO0FBQUEsaUJBQVksU0FBUyxJQUFULEVBQVo7QUFBQSxTQURULEVBRUcsSUFGSCxDQUVRLGdCQUFROztBQUVaLGNBQUssQ0FBQyxpQkFBTixFQUEwQjtBQUM3Qix5QkFBYSxVQUFiLENBQXdCLFlBQXhCO0FBQ0k7O0FBRUwsWUFBRSxhQUFGLENBQWdCLFVBQWhCLEVBQTRCLFNBQTVCLENBQXNDLE1BQXRDLENBQTZDLFFBQTdDO0FBQ0E7QUFDSSxZQUFFLGFBQUYsQ0FBZ0IsaUJBQWhCLEVBQW1DLFNBQW5DLENBQTZDLE1BQTdDLENBQW9ELGFBQXBEO0FBQ0EsWUFBRSxhQUFGLENBQWdCLDBCQUFoQixFQUE0QyxTQUE1QyxDQUFzRCxNQUF0RCxDQUE2RCxhQUE3RDs7QUFFQSxlQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLGdCQUFRO0FBQzFCLGdCQUFHLEtBQUssY0FBUixFQUF3QjtBQUN0QixxQkFBTyxLQUFLLGNBQUwsQ0FBb0IsS0FBcEIsQ0FBMEIsQ0FBMUIsRUFBNEIsRUFBNUIsQ0FBUDtBQUNOO0FBQ0ksbUZBQzZDLEtBQUssS0FBTCxDQUQ3QywwRkFHa0IsS0FBSyxhQUFMLENBQW1CLEtBQW5CLENBQXlCLENBQXpCLENBSGxCLDREQUdvRyxLQUFLLEtBQUwsQ0FIcEcscUhBTWlFLEtBQUssS0FBTCxDQU5qRSxnQ0FPUSxLQUFLLEtBUGIsdURBUWlDLElBUmpDO0FBWUQsV0FoQkQ7O0FBa0JELFlBQUUsYUFBRixDQUFnQixnQkFBaEIsRUFBa0MsU0FBbEMsR0FBOEMsR0FBOUM7QUFDQSxZQUFFLGFBQUYsQ0FBZ0Isa0JBQWhCLEVBQW9DLFNBQXBDLG9EQUMrQixLQUFLLElBRHBDLHlEQUVnQyxLQUFLLFVBRnJDO0FBSUEsU0FwQ0gsRUFxQ0csS0FyQ0gsQ0FxQ1M7QUFBQSxpQkFBTyxRQUFRLEdBQVIsQ0FBWSxHQUFaLENBQVA7QUFBQSxTQXJDVDtBQXNDSCxPQTFEbUM7O0FBNERsQzs7O0FBMURBLG9CQUFjLFdBQWQsRUEyREEsRUFBRSxjQUFGLENBQWlCLEtBQWpCLEVBQXdCLGdCQUF4QixDQUF5QyxPQUF6QyxFQUFrRCxVQUFDLENBQUQsRUFBTzs7QUFFdkQsVUFBRSxjQUFGO0FBQ0EsWUFBSSxFQUFFLE1BQUYsQ0FBUyxTQUFULENBQW1CLFFBQW5CLENBQTRCLFlBQTVCLENBQUosRUFBZ0Q7O0FBRWhELGNBQUksT0FBTyxFQUFFLE1BQUYsQ0FBUyxZQUFULENBQXNCLGNBQXRCLENBQVg7O0FBRUQsdUJBQWEsT0FBYixDQUFxQixZQUFyQixFQUFtQyxJQUFuQzs7QUFFRyx1QkFBYyxJQUFkLEVBQW9CLEtBQXBCOztBQUVBO0FBQ0EsY0FBSyxtQkFBbUIsQ0FBbkIsSUFBd0IsaUJBQWlCLENBQTlDLEVBQWtEO0FBQUEsZ0JBQzFDLGNBRDBDLEdBQ25ELFNBQVMsY0FBVCxHQUEyQjtBQUN6QixnQkFBRSxhQUFGLENBQWdCLEtBQWhCLENBQ0csSUFESCxDQUNRLHdCQUFnQjtBQUNwQix1QkFBTyxhQUFhLElBQWIsQ0FBa0IsUUFBbEIsQ0FBMkIscUJBQTNCLEVBQ0osSUFESSxDQUNFO0FBQUEseUJBQU0sRUFBRSxxQ0FBRixDQUFOO0FBQUEsaUJBREYsRUFFRCxLQUZDLENBRU07QUFBQSx5QkFBTyxFQUFFLCtDQUFGLEVBQW1ELEdBQW5ELENBQVA7QUFBQSxpQkFGTixDQUFQO0FBR0QsZUFMSDtBQU1ELGFBUmtEOztBQVNuRDtBQUNEO0FBQ0M7QUFDRixPQXhCRDtBQXlCQTtBQUNBLFFBQUUsYUFBRixDQUFnQixnQkFBaEIsQ0FBaUMsU0FBakMsRUFBNEMsYUFBSztBQUNqRCxnQkFBUSxHQUFSLENBQVksaURBQVosRUFBK0QsRUFBRSxJQUFqRTtBQUNBLFlBQUksRUFBRSxJQUFGLEtBQVcsNEJBQWYsRUFDQyxhQUFjLGFBQWEsT0FBYixDQUFxQixZQUFyQixDQUFkLEVBQWtELElBQWxEO0FBQ0YsT0FKQztBQUtELEtBOUZtQyxDQThGbEM7QUFDSCxHQS9GbUIsRUErRmpCLEdBL0ZpQixDQUFwQixDQUZpQyxDQWlHekI7O0FBRVI7QUFTRCxDQTVHTTs7Ozs7Ozs7QUNMUCxJQUFNLElBQUksUUFBUSxHQUFsQjtBQUFBLElBQ0UsSUFBSSxRQUROO0FBQUEsSUFFRSxJQUFJLFNBRk47QUFBQSxJQUdFLElBQUksTUFITjs7QUFLTyxJQUFNLHdDQUFnQixTQUFoQixhQUFnQixHQUFNOztBQUVqQyxNQUFNLGFBQWEsWUFBWSxZQUFNOztBQUVuQyxRQUFLLEVBQUUsVUFBRixLQUFrQixVQUF2QixFQUFvQzs7QUFhbEM7QUFia0MsVUFjekIsWUFkeUIsR0FjbEMsU0FBUyxZQUFULENBQXNCLFFBQXRCLEVBQWdDLGlCQUFoQyxFQUFtRDs7QUFFakQsWUFBSSxPQUFPLFNBQVMsS0FBVCxDQUFlLENBQWYsQ0FBWDtBQUFBLFlBQ0UsTUFBTSxFQURSOztBQUdBO0FBQ0EsVUFBRSxhQUFGLENBQWdCLGlCQUFoQixFQUFtQyxTQUFuQyxDQUE2QyxHQUE3QyxDQUFpRCxhQUFqRDtBQUNBLFVBQUUsYUFBRixDQUFnQiwwQkFBaEIsRUFBNEMsU0FBNUMsQ0FBc0QsR0FBdEQsQ0FBMEQsYUFBMUQ7O0FBRUE7QUFDQSxVQUFFLGdCQUFGLENBQW1CLFVBQW5CLEVBQStCLE9BQS9CLENBQXdDLG1CQUFXO0FBQ2pELGtCQUFRLFNBQVIsQ0FBa0IsR0FBbEIsQ0FBc0IsUUFBdEI7QUFDRCxTQUZEOztBQUlBO0FBQ0EsY0FBTSxJQUFOLEVBRUcsSUFGSCxDQUVRO0FBQUEsaUJBQVksU0FBUyxJQUFULEVBQVo7QUFBQSxTQUZSLEVBR0csSUFISCxDQUdRLGdCQUFROztBQUVaLFlBQUUsYUFBRixDQUFnQixVQUFoQixFQUE0QixTQUE1QixDQUFzQyxNQUF0QyxDQUE2QyxRQUE3Qzs7QUFFQSxjQUFJLENBQUMsaUJBQUwsRUFBd0I7QUFDdEIseUJBQWEsVUFBYixDQUF3QixvQkFBeEI7QUFDRDs7QUFFRDtBQUNBLFlBQUUsYUFBRixDQUFnQixpQkFBaEIsRUFBbUMsU0FBbkMsQ0FBNkMsTUFBN0MsQ0FBb0QsYUFBcEQ7QUFDQSxZQUFFLGFBQUYsQ0FBZ0IsMEJBQWhCLEVBQTRDLFNBQTVDLENBQXNELE1BQXRELENBQTZELGFBQTdEOztBQUVBLGNBQUksU0FBUyxLQUFLLEdBQUwsQ0FBUyxLQUFULENBQWUsQ0FBQyxDQUFoQixDQUFiOztBQUVBLGNBQUcsV0FBVyxLQUFkLEVBQXFCO0FBQ25CLHFCQUFTLEtBQUssR0FBZDtBQUNELFdBRkQsTUFFSztBQUNILHFCQUFTLEtBQUssT0FBTCxDQUFhLENBQWIsRUFBZ0IsR0FBekI7QUFDRDs7QUFFRCwwSkFFNkUsS0FBSyxVQUFMLENBQWdCLENBQWhCLEVBQW1CLEdBQW5CLENBQXVCLEtBQXZCLENBQTZCLENBQTdCLENBRjdFLDJDQUdxQixPQUFPLEtBQVAsQ0FBYSxDQUFiLENBSHJCO0FBUUEsWUFBRSxhQUFGLENBQWdCLGdCQUFoQixFQUFrQyxTQUFsQyxHQUE4QyxHQUE5QztBQUNBLFlBQUUsYUFBRixDQUFnQixrQkFBaEIsRUFBb0MsU0FBcEMsb0RBQ2dDLEtBQUssS0FEckMseURBRStCLEtBQUssV0FGcEM7QUFJRCxTQXBDSCxFQXFDRyxLQXJDSCxDQXFDUyxlQUFPO0FBQ1osdUJBQWEsT0FBYixDQUFxQixvQkFBckIsRUFBMkMsSUFBM0M7QUFDQSxZQUFFLGFBQUYsQ0FBZ0IsZ0JBQWhCLEVBQWtDLFNBQWxDLEdBQThDLGlEQUE5QztBQUNELFNBeENIO0FBeUNELE9BdEVpQyxFQXNFaEM7O0FBRUY7OztBQXZFQSxvQkFBYyxVQUFkOztBQUVBO0FBQ0EsUUFBRSxjQUFGLENBQWlCLGVBQWpCLEVBQWtDLGdCQUFsQyxDQUFtRCxPQUFuRCxFQUE0RCxVQUFDLENBQUQsRUFBTztBQUNqRTtBQUNBLFVBQUUsZ0JBQUYsQ0FBbUIsVUFBbkIsRUFBK0IsT0FBL0IsQ0FBd0MsbUJBQVc7QUFDakQsa0JBQVEsU0FBUixDQUFrQixHQUFsQixDQUFzQixRQUF0QjtBQUNBLFlBQUUsY0FBRixDQUFpQixPQUFqQixFQUEwQixLQUExQjtBQUNELFNBSEQ7QUFJQSxVQUFFLGFBQUYsQ0FBZ0IsVUFBaEIsRUFBNEIsU0FBNUIsQ0FBc0MsTUFBdEMsQ0FBNkMsUUFBN0M7QUFDRCxPQVBELEVBcUVBLEVBQUUsYUFBRixDQUFnQixnQkFBaEIsRUFBa0MsZ0JBQWxDLENBQW1ELE9BQW5ELEVBQTRELFVBQUMsQ0FBRCxFQUFPO0FBQ2pFLFVBQUUsY0FBRjs7QUFFQSxZQUFJLEVBQUUsTUFBRixDQUFTLFNBQVQsQ0FBbUIsUUFBbkIsQ0FBNEIsZ0JBQTVCLENBQUosRUFBb0Q7O0FBRWxELGNBQUksT0FBTyxFQUFFLE1BQUYsQ0FBUyxZQUFULENBQXNCLGNBQXRCLENBQVg7O0FBRUEsdUJBQWEsT0FBYixDQUFxQixvQkFBckIsRUFBMkMsSUFBM0M7QUFDQSx1QkFBYSxJQUFiLEVBQW1CLEtBQW5COztBQUVBO0FBQ0EsY0FBSyxtQkFBbUIsQ0FBbkIsSUFBd0IsaUJBQWlCLENBQTlDLEVBQWtEO0FBQUEsZ0JBQ3ZDLGNBRHVDLEdBQ2hELFNBQVMsY0FBVCxHQUEyQjtBQUN6QixnQkFBRSxhQUFGLENBQWdCLEtBQWhCLENBQ0MsSUFERCxDQUNNLHdCQUFnQjtBQUNwQix1QkFBTyxhQUFhLElBQWIsQ0FBa0IsUUFBbEIsQ0FBMkIsNkJBQTNCLEVBQ0osSUFESSxDQUNFO0FBQUEseUJBQU0sRUFBRSxxQ0FBRixDQUFOO0FBQUEsaUJBREYsRUFFSixLQUZJLENBRUc7QUFBQSx5QkFBTyxFQUFFLCtDQUFGLEVBQW1ELEdBQW5ELENBQVA7QUFBQSxpQkFGSCxDQUFQO0FBR0QsZUFMRDtBQU1ELGFBUitDOztBQVNoRDtBQUNEO0FBQ0Y7QUFDRixPQXZCRDtBQXdCQTtBQUNBLFFBQUUsYUFBRixDQUFnQixnQkFBaEIsQ0FBaUMsU0FBakMsRUFBNEMsYUFBSztBQUMvQyxVQUFFLHVDQUFGLEVBQTJDLEVBQUUsSUFBN0M7QUFDQSxZQUFJLEVBQUUsSUFBRixLQUFXLG9DQUFmLEVBQ0UsYUFBYSxhQUFhLE9BQWIsQ0FBcUIsb0JBQXJCLENBQWIsRUFBeUQsSUFBekQ7QUFDSCxPQUpEO0FBTUQsS0ExR2tDLENBMEdqQztBQUNILEdBM0drQixFQTJHaEIsR0EzR2dCLENBQW5CLENBRmlDLENBNkd6Qjs7QUFFUjtBQVdELENBMUhNOzs7OztBQ0xQOztBQUVBLFNBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQixTQUEvQixHQUEyQyxpQkFBM0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgYyA9IGNvbnNvbGUubG9nLFxuICBkID0gZG9jdW1lbnQsXG4gIG4gPSBuYXZpZ2F0b3IsXG4gIHcgPSB3aW5kb3dcblxuZXhwb3J0IGNvbnN0IGNhdGVnb3JpZXMgPSAoKSA9PiB7XG5cbiAgY29uc3QgcmVhZHlTdGF0ZSA9IHNldEludGVydmFsKCgpID0+IHtcblxuICAgIGlmICggZC5yZWFkeVN0YXRlICA9PT0gJ2NvbXBsZXRlJyApIHtcblxuICAgICAgY2xlYXJJbnRlcnZhbChyZWFkeVN0YXRlKVxuXG4gICAgICBsZXQgdHBsID0gJydcblxuICAgICAgLy9OYWJpZ2F6aW8gYm90b2lhXG4gICAgICBkLmdldEVsZW1lbnRCeUlkKFwiY2F0ZWdvcmllcy1idG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5vZmYtY2FudmFzLW1lbnUnKS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1vcGVuJylcblxuICAgICAgICAvL0thdGVnb3JpYW4gaWtvbm9hIChtZW51IG9mZi1jYW52YXMpXG4gICAgICAgIGlmKCBkLnF1ZXJ5U2VsZWN0b3IoJy5uYXYtaWNvbicpLmNsYXNzTGlzdC5jb250YWlucyhcImlzLWFjdGl2ZVwiKSl7XG4gICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubmF2LWljb24nKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKVxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubmF2LWljb24nKS5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLy9zY2FwZSB0ZWtsYSBiaWRleiBpdHhpIG1lbnVhXG4gICAgICBkLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAyNykge1xuICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLm9mZi1jYW52YXMtbWVudScpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKVxuICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLm5hdi1pY29uJykuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJylcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy9LYXRlZ29yaWFrIGVrYXJyaVxuICAgICAgZnVuY3Rpb24gZmV0Y2hBbGxDYXRlZ29yaWVzKGRhdGEsIHJlcXVlc3RGcm9tQkdTeW5jKSB7XG4gICAgICAgIC8vQmVoYXJyZXprbyBzZWt6aW9hayBlemt1dGF0dVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uJykuZm9yRWFjaCggc2VjdGlvbiA9PiB7XG4gICAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCd1LWhpZGUnKVxuICAgICAgICB9KVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yaWVzJykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcudHYnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuXG4gICAgICAgIGZldGNoKGRhdGEpXG4gICAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSApXG4gICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG5cbiAgICAgICAgICAgIGlmICggIXJlcXVlc3RGcm9tQkdTeW5jICkge1xuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnY2F0ZWdvcnktbGlzdCcpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsb2NhbEpzb25DYXRlZ29yaWVzJywgSlNPTi5zdHJpbmdpZnkoanNvbikpO1xuXG4gICAgICAgICAgICBqc29uLm1lbWJlci5mb3JFYWNoKGpzb25DYXQgPT4ge1xuICAgICAgICAgICAgICB0cGwgKz0gYFxuICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNhdGVnb3J5LWlkXCIgZGF0YS1jYXRlZ29yeT1cIiR7anNvbkNhdFtcIkBpZFwiXX1cIj5cbiAgICAgICAgICAgICAgICBcdCR7anNvbkNhdC50aXRsZX1cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLmNhdGVnb3JpZXNfX2xpc3QnKS5pbm5lckhUTUwgPSB0cGxcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYXRlZ29yeS1saXN0JywgZGF0YSlcbiAgICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIC8vQXBsaWthemlvcmEgc2FydHplbiBkZW5lYW4gZWdpbiBiZWhhcnJla29hXG4gICAgICBsZXQgZGF0YSA9ICcvL3N0aWxsLWNhc3RsZS05OTc0OS5oZXJva3VhcHAuY29tL3Byb2dyYW0tdHlwZS1saXN0J1xuXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2F0ZWdvcnktbGlzdCcsIGRhdGEpXG5cbiAgICAgIGZldGNoQWxsQ2F0ZWdvcmllcyhkYXRhLCBmYWxzZSlcblxuICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKHByb2dyYW1haylcbiAgICAgIGlmICggJ3NlcnZpY2VXb3JrZXInIGluIG4gJiYgJ1N5bmNNYW5hZ2VyJyBpbiB3ICkge1xuICAgICAgICBmdW5jdGlvbiByZWdpc3RlckJHU3luYyAoKSB7XG4gICAgICAgICAgbi5zZXJ2aWNlV29ya2VyLnJlYWR5XG4gICAgICAgICAgLnRoZW4ocmVnaXN0cmF0aW9uID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb24uc3luYy5yZWdpc3RlcignbmFoaWVyYW4tdHYtY2F0ZWdvcmllcycpXG4gICAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgLmNhdGNoKCBlcnIgPT4gYygnRXJyb3JlYSBhdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR6ZWFuJywgZXJyKSApXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZWdpc3RlckJHU3luYygpXG4gICAgICB9XG4gICAgICAvL0JhY2tncm91bmQgU3luYyAocHJvZ3JhbWFrKVxuICAgICAgbi5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBlID0+IHtcbiAgICAgICAgYygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIG1lc3NhZ2UgYmlkZXo6ICcsIGUuZGF0YSlcbiAgICAgICAgaWYoIGUuZGF0YSA9PT0gJ29ubGluZSBuYWhpZXJhbi10di1jYXRlZ29yaWVzJyApXG4gICAgICAgICAgZmV0Y2hBbGxDYXRlZ29yaWVzKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2F0ZWdvcnktbGlzdCcpLCB0cnVlKVxuICAgICAgfSlcblxuICAgIH0gLy9yZWFkeVN0YXRlXG5cbiAgfSwgMTAwICkvL2ludGVydmFsXG5cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGNsYXNzPVwiY2F0ZWdvcmllcyBvZmYtY2FudmFzLW1lbnVcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJsb2FkZXJcIj48L2Rpdj5cbiAgICAgIDx1bCBjbGFzcz1cImNhdGVnb3JpZXNfX2xpc3RcIj48L3VsPlxuICAgIDwvZGl2PlxuICAgIGBcbn1cbiIsImNvbnN0IGMgPSBjb25zb2xlLmxvZyxcbiAgZCA9IGRvY3VtZW50LFxuICBuID0gbmF2aWdhdG9yLFxuICB3ID0gd2luZG93XG5cbmV4cG9ydCBjb25zdCBjYXRlZ29yaWVzU2luZ2xlID0gKCkgPT4ge1xuXG4gIGNvbnN0IHJlYWR5U3RhdGUgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cbiAgICBpZiAoIGQucmVhZHlTdGF0ZSAgPT09ICdjb21wbGV0ZScgKSB7XG5cbiAgICAgIGNsZWFySW50ZXJ2YWwocmVhZHlTdGF0ZSlcblxuICAgICAgLy9LYXRlZ29yaWEgemVycmVuZGEgZWthcnJpXG4gIFx0ICBmdW5jdGlvbiBmZXRjaENhdGVnb3J5KGpzb25EYXRhLCByZXF1ZXN0RnJvbUJHU3luYywgY2F0TmFtZSkge1xuXG5cdFx0ICBcdGxldCBkYXRhID0ganNvbkRhdGEuc2xpY2UoNSksXG5cdFx0ICBcdCAgdHBsID0gJydcblxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5vZmYtY2FudmFzLW1lbnUnKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubmF2LWljb24nKS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKVxuICAgICAgICAvL0xvYWRlciBlcmFrdXRzaVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItY2F0JykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtY2F0JykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICAvL0JlaGFycmV6a28gc2VremlvYWsgZXprdXRhdHVcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbicpLmZvckVhY2goIHNlY3Rpb24gPT4ge1xuICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgndS1oaWRlJylcbiAgICAgICAgfSlcblxuICAgICAgICBmZXRjaChkYXRhKVxuICAgICAgICAgIC50aGVuKCByZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkgKVxuICAgICAgICAgIC50aGVuKGpzb24gPT4ge1xuXG4gICAgICAgICAgICBpZiAoICFyZXF1ZXN0RnJvbUJHU3luYyApIHtcbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2NhdGVnb3J5JylcbiAgICAgIFx0XHRcdH1cblxuICAgICAgICAgICAgLy9Mb2FkZXIgZXprdXRhdHVcbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci1jYXQnKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItdGVtcGxhdGUtY2F0JykuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNob3cnKVxuXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5zaW5nbGUtY2F0JykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcblxuICAgICAgICBcdFx0anNvbi5tZW1iZXIuZm9yRWFjaChqc29uQ2F0ID0+IHtcbiAgICAgICAgICAgICAgdHBsICs9IGBcbiAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwicHJvZ3JhbS1pZFwiIGRhdGEtcHJvZ3JhbT1cIiR7anNvbkNhdFtcIkBpZFwiXX1cIj5cbiAgICAgICAgICAgICAgICAgICAgJHtqc29uQ2F0LnRpdGxlfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuc2luZ2xlLWNhdF9fbGlzdCcpLmlubmVySFRNTCA9IHRwbFxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuc2luZ2xlLWNhdF9faGVhZGVyJykuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidHZfX3RpdGxlXCI+JHtjYXROYW1lfTwvZGl2PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR2X19udW1iZXJcIj4oJHtqc29uLm1lbWJlci5sZW5ndGh9KTwvc3Bhbj4gc2FpbyBlcmFrdXN0ZW5cbiAgICAgICAgICAgICAgYFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKVxuXG4gICAgICB9IC8vZmV0Y2hDYXRlZ29yeVxuXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yaWVzX19saXN0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBpZiggZC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpKVxuICAgICAgICAgIGQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWRlb1wiKS5wYXVzZSgpXG5cbiAgICAgICAgaWYoIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2F0ZWdvcnktaWQnKSApIHtcbiAgICAgICAgICB2YXIgY2F0TmFtZSA9IGUudGFyZ2V0LmlubmVySFRNTFxuICAgICAgICAgIGxldCBkYXRhID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWNhdGVnb3J5JylcblxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYXRlZ29yeScsIGRhdGEpXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhdGVnb3J5LW5hbWUnLCBjYXROYW1lKVxuXG4gICAgICAgICAgZmV0Y2hDYXRlZ29yeShkYXRhLCBmYWxzZSwgY2F0TmFtZSlcblxuICAgICAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChrYXRlZ29yaWEpXG4gICAgICAgICAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiAmJiAnU3luY01hbmFnZXInIGluIHcgKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiByZWdpc3RlckJHU3luYyAoKSB7XG4gICAgICAgICAgICAgIG4uc2VydmljZVdvcmtlci5yZWFkeVxuICAgICAgICAgICAgICAudGhlbihyZWdpc3RyYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb24uc3luYy5yZWdpc3RlcignbmFoaWVyYW4tY2F0ZWdvcnknKVxuICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIGVyciA9PiBjKCdFcnJvcmVhIGF0emVrbyBzaW5rcm9uaXphemlvYSBlcnJlZ2lzdHJhdHplYW4nLCBlcnIpIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlZ2lzdGVyQkdTeW5jKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAvL0JhY2tncm91bmQgU3luYyAoa2F0ZWdvcmlhKVxuICAgICAgbi5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBlID0+IHtcblx0XHQgICAgY29uc29sZS5sb2coJ0F0emVrbyBzaW5rcm9uaXphemlvYSBtZXNzYWdlIGJpZGV6IGFrdGliYXR1YTogJywgZS5kYXRhKVxuXHRcdCAgICBpZiggZS5kYXRhID09PSAnb25saW5lIG5haGllcmFuLWNhdGVnb3J5Jylcblx0XHQgICAgXHRmZXRjaENhdGVnb3J5KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjYXRlZ29yeScpLCB0cnVlLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2F0ZWdvcnktbmFtZScpKVxuXHRcdCAgfSlcblxuICAgIH0gLy9yZWFkeVN0YXRlXG5cbiAgfSwgMTAwICkgLy9pbnRlcnZhbFxuXG4gIHJldHVybiBgXG4gICAgPGRpdiBjbGFzcz1cImxvYWRlci10ZW1wbGF0ZSBsb2FkZXItdGVtcGxhdGUtY2F0XCI+XG4gICAgXHQ8ZGl2IGNsYXNzPVwibG9hZGVyIGxvYWRlci1jYXRcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2luZ2xlLWNhdCBzZWN0aW9uIHUtaGlkZVwiPlxuICAgICAgPGhlYWRlciBjbGFzcz1cInNlY3Rpb24taGVhZGVyIHR2X19oZWFkZXIgc2luZ2xlLWNhdF9faGVhZGVyXCI+PC9oZWFkZXI+XG4gICAgICA8dWwgY2xhc3M9XCJ0dl9fbGlzdCBzaW5nbGUtY2F0X19saXN0XCI+PC91bD5cbiAgICA8L2Rpdj5cbiAgICBgXG59XG4iLCJpbXBvcnQge3R2fSBmcm9tICcuL3R2JztcblxuY29uc3QgYyA9IGNvbnNvbGUubG9nLFxuICBkID0gZG9jdW1lbnQsXG4gIG4gPSBuYXZpZ2F0b3IsXG4gIHcgPSB3aW5kb3dcblxuZXhwb3J0IGNvbnN0IHB3YSA9ICgpID0+IHtcbiAgLy9TZXJ2aWNlIFdvcmtlcnJhIGVycmVnaXN0cmF0dVxuICBpZiAoICdzZXJ2aWNlV29ya2VyJyBpbiBuICkge1xuICAgIG4uc2VydmljZVdvcmtlci5yZWdpc3RlcignLi9zdy5qcycpXG4gICAgLnRoZW4oIHJlZ2lzdHJhdGlvbiA9PiB7XG4gICAgICBjKCdTZXJ2aWNlIFdvcmtlciBlcnJlZ2lzdHJhdHVhJywgcmVnaXN0cmF0aW9uLnNjb3BlKVxuICAgIH0pXG4gICAgLmNhdGNoKCBlcnIgPT4gYyhgUmVnaXN0cm8gZGUgU2VydmljZSBXb3JrZXIgZmFsbGlkb2AsIGVycikgKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBpc09ubGluZSA9ICgpID0+IHtcbiAgLy9Lb25leGlvYXJlbiBlZ29lcmEgKG9ubGluZS9vZmZsaW5lKVxuICBjb25zdCBtZXRhVGFnVGhlbWUgPSBkLnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT10aGVtZS1jb2xvcl0nKVxuXG4gIGZ1bmN0aW9uIG5ldHdvcmtTdGF0dXMgKGUpIHtcblxuICAgIGlmICggbi5vbkxpbmUgKSB7XG4gICAgICBtZXRhVGFnVGhlbWUuc2V0QXR0cmlidXRlKCdjb250ZW50JywgJyNmZmZmZmYnKVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKFwiLm1haW4tZm9vdGVyX19zdGF0dXNcIikuY2xhc3NMaXN0LnJlbW92ZShcIm9mZmxpbmVcIilcbiAgICAgIGQucXVlcnlTZWxlY3RvcihcIi5vZmZsaW5lXCIpLmlubmVySFRNTCA9IFwiXCJcbiAgICB9IGVsc2Uge1xuICAgICAgbWV0YVRhZ1RoZW1lLnNldEF0dHJpYnV0ZSgnY29udGVudCcsICcjYzljOWM5JylcbiAgICAgIGQucXVlcnlTZWxlY3RvcihcIi5tYWluLWZvb3Rlcl9fc3RhdHVzXCIpLmNsYXNzTGlzdC5hZGQoXCJvZmZsaW5lXCIpXG4gICAgICBkLnF1ZXJ5U2VsZWN0b3IoXCIub2ZmbGluZVwiKS5pbm5lckhUTUwgPSBcIjxkaXYgY2xhc3M9J3RleHQnPlNhcmVhIGJlcnJlc2t1cmF0emVuLi4uPC9kaXY+XCJcbiAgICB9XG4gIH1cblxuICB3LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIG5ldHdvcmtTdGF0dXMpXG4gIHcuYWRkRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsIG5ldHdvcmtTdGF0dXMpXG59XG5cbmV4cG9ydCBjb25zdCBpbml0ID0gKGRhdGEpID0+IHtcbiAgXG4gIGNvbnN0IHJlbG9hZEFwcCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAvL0FwbGlrYXppb2EvbGVpaG9hIGVndW5lcmF0dVxuICAgIGlmICggZC5yZWFkeVN0YXRlICA9PT0gJ2NvbXBsZXRlJyApIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwocmVsb2FkQXBwKVxuICAgICAgZC5nZXRFbGVtZW50QnlJZChcInJlbG9hZC1hcHBcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGBcbiAgPGhlYWRlciBjbGFzcz1cIm1haW4taGVhZGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1haW4taGVhZGVyX19jb2xzXCI+XG4gICAgICA8aW1nIHNyYz1cIi4vYXNzZXRzL2VpdGItbG9nby1ibHVlLnN2Z1wiIGFsdD1cIk5haGllcmFuXCIgY2xhc3M9XCJtYWluLWhlYWRlcl9fbG9nb1wiIGlkPVwicmVsb2FkLWFwcFwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJtYWluLWhlYWRlcl9fc2xvZ2FuXCI+bmFoaWVyYW48L3NwYW4+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1haW4taGVhZGVyX19jb2xzIHJpZ2h0XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibmF2LWljb25cIiBpZD1cImNhdGVnb3JpZXMtYnRuXCI+XG4gICAgICBcdDxkaXYgY2xhc3M9XCJuYXYtaWNvbl9fYmFyXCI+PC9kaXY+XG4gICAgICBcdDxkaXYgY2xhc3M9XCJuYXYtaWNvbl9fYmFyXCI+PC9kaXY+XG4gICAgICBcdDxkaXYgY2xhc3M9XCJuYXYtaWNvbl9fYmFyXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9oZWFkZXI+XG5cbiAgJHt0digpfVxuXG4gIDxmb290ZXIgY2xhc3M9XCJtYWluLWZvb3RlclwiPlxuICAgIDxkaXYgY2xhc3M9XCJtYWluLWZvb3Rlcl9fc3RhdHVzXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX19yb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYWluLWZvb3Rlcl9fY29sLWxvZ29cIj5cbiAgICAgIFx0PGltZyBzcmM9XCIuL2Fzc2V0cy9laXRiLWxvZ28td2hpdGUuc3ZnXCIgYWx0PVwiZWl0YiBuYWhpZXJhblwiIGNsYXNzPVwibWFpbi1mb290ZXJfX2xvZ29cIj5cbiAgICAgIFx0PGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX190ZXh0XCI+QXprZW4gZWd1bmVyYWtldGE6XG4gICAgICBcdFx0PHNwYW4gY2xhc3M9XCJzYXZlZC1kYXRlXCI+JHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImpzb25EYXRlXCIpfTwvc3Bhbj5cbiAgICAgIFx0PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYWluLWZvb3Rlcl9fY29sLWJ0biBkZWxldGVTdG9yYWdlXCI+XG4gICAgICBcdDxpbWcgc3JjPVwiLi9hc3NldHMvcmVsb2FkLnN2Z1wiIGFsdD1cIkRhdHVhayBlZ3VuZXJhdHVcIiBjbGFzcz1cIm1haW4tZm9vdGVyX19yZWxvYWRcIj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cIm1haW4tZm9vdGVyX19yb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYWluLWZvb3Rlcl9fcG93ZXJlZC1ieVwiPlxuICAgICAgXHRQV0EgZ2FyYXBlbmEgPGEgb25jbGljaz1cIndpbmRvdy5sb2NhdGlvbj0naHR0cHM6Ly90d2l0dGVyLmNvbS9hc2llcm11c2EnXCIgaHJlZj1cIiNcIj5AYXNpZXJtdXNhPC9hPiB8XG4gICAgICBcdGVpdGIgQVBJYSA8YSBvbmNsaWNrPVwid2luZG93LmxvY2F0aW9uPSdodHRwczovL3R3aXR0ZXIuY29tL2VycmFsaW4nXCIgaHJlZj1cIiNcIj5AZXJyYWxpbjwvYT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Zvb3Rlcj5cbiAgYFxufVxuIiwiaW1wb3J0IHtjYXRlZ29yaWVzfSBmcm9tICcuL2NhdGVnb3JpZXMnO1xuaW1wb3J0IHtzZWxlY3RQcm9ncmFtfSBmcm9tICcuL3R2UHJvZ3JhbSdcbmltcG9ydCB7c2VsZWN0RXBpc29kZX0gZnJvbSAnLi90dlByb2dyYW1FcGlzb2RlJ1xuaW1wb3J0IHtjYXRlZ29yaWVzU2luZ2xlfSBmcm9tICcuL2NhdGVnb3JpZXNTaW5nbGUnXG5cbmNvbnN0IGMgPSBjb25zb2xlLmxvZyxcbiAgZCA9IGRvY3VtZW50LFxuICBuID0gbmF2aWdhdG9yLFxuICB3ID0gd2luZG93XG5cbmNvbnN0IGZpbHRlcmluZyA9ICh1bCkgPT4ge1xuXG4gIGQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmQtcHJvZ3JhbXMnKS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG5cbiAgICBsZXQganNvbiA9IEpTT04ucGFyc2UoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2NhbEpzb24nKSksXG4gICAgICBsaXN0YSA9IG51bGwsXG4gICAgICB0cGwgPSAnJ1xuXG4gICAgbGlzdGEgPSBqc29uLm1lbWJlci5maWx0ZXIoIGxpc3QgPT4ge1xuICAgICAgcmV0dXJuIGxpc3QudGl0bGUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpKVxuICAgIH0pXG5cbiAgICBsaXN0YS5mb3JFYWNoKGpzb24gPT4ge1xuICAgICAgdHBsICs9XG4gICAgICBgXG4gICAgICA8bGk+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJwcm9ncmFtLWlkXCIgZGF0YS1wcm9ncmFtPVwiJHtqc29uW1wiQGlkXCJdfVwiPlxuICAgICAgICAke2pzb24udGl0bGV9XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG4gICAgICBgXG4gICAgfSlcblxuICAgIGQucXVlcnlTZWxlY3Rvcih1bCkuaW5uZXJIVE1MID0gdHBsXG4gICAgZC5xdWVyeVNlbGVjdG9yKCcudHZfX2hlYWRlcicpLmlubmVySFRNTCA9IGA8c3BhbiBjbGFzcz1cInR2X19udW1iZXJcIj4ke2xpc3RhLmxlbmd0aH08L3NwYW4+IHNhaW8gZXJha3VzdGVuYFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdHYgPSAoKSA9PiB7XG5cbiAgY29uc3QgcmVhZHlTdGF0ZSA9IHNldEludGVydmFsKCgpID0+IHtcblxuICAgIGlmICggZC5yZWFkeVN0YXRlICA9PT0gJ2NvbXBsZXRlJyApIHtcblxuICAgICAgY2xlYXJJbnRlcnZhbChyZWFkeVN0YXRlKVxuXG4gICAgICAvL1Byb2dyYW1hIGVyYWt1dHNpIChidWtsZWEpXG4gICAgICBmdW5jdGlvbiBnZXRQcm9ncmFtcyhqc29uKSB7XG5cbiAgICAgICAgbGV0IHRwbCA9ICcnXG5cbiAgICAgICAgSlNPTi5wYXJzZShqc29uKS5tZW1iZXIuZm9yRWFjaChqc29uID0+IHtcblxuICAgICAgICAgIHRwbCArPSBgXG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJwcm9ncmFtLWlkXCIgZGF0YS1wcm9ncmFtPVwiJHtqc29uW1wiQGlkXCJdfVwiPlxuICAgICAgICAgICAgICAgICR7anNvbi50aXRsZX1cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIGBcbiAgICAgICAgfSlcblxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy50dl9fbGlzdCcpLmlubmVySFRNTCA9IHRwbFxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy50dl9faGVhZGVyJykuaW5uZXJIVE1MID0gYFNhaW8gZ3V6dGlhayBlcmFrdXN0ZW4gPHNwYW4gY2xhc3M9XCJ0dl9fbnVtYmVyXCI+KCR7SlNPTi5wYXJzZSgganNvbiApLm1lbWJlci5sZW5ndGh9KTwvc3Bhbj5gXG4gICAgICAgIC8vTG9hZGVyIGV6a3V0YXR1XG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci10dicpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zaG93JylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXRlbXBsYXRlLXR2JykuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNob3cnKVxuICAgICAgICAvL0Zvb3RlcnJlYW4gQVBJYXJlbiBlZ3VuZXJha2V0YSBkYXRhIGJpc3RhcmF0dVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5tYWluLWZvb3Rlcl9fdGV4dCcpLmNsYXNzTGlzdC5hZGQoJ2lzLWNhY2hlJylcbiAgICAgIH1cblxuICAgICAgLy9Qcm9ncmFtYWsgZWthcnJpXG4gICAgICBmdW5jdGlvbiBmZXRjaEFsbFByb2dyYW1zKGRhdGEsIHJlcXVlc3RGcm9tQkdTeW5jLCByZXNldCkge1xuXG4gICAgICAgIGxldCB0cGwgPSAnJ1xuXG4gICAgICAgIC8vTG9hZGVyIGVyYWt1dHNpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci10ZW1wbGF0ZS10dicpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXR2JykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuICAgICAgICAvL0JlaGFycmV6a28gc2VremlvYWsgZXprdXRhdHVcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbicpLmZvckVhY2goIHNlY3Rpb24gPT4ge1xuICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgndS1oaWRlJylcbiAgICAgICAgfSlcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcmllcycpLmNsYXNzTGlzdC5yZW1vdmUoJ3UtaGlkZScpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLnR2JykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcblxuICAgICAgICAvL0FQSWEgZGVpdHUgYmVoYXIgYmFkYS4uLlxuICAgICAgICBpZihyZXNldCkge1xuXG4gICAgICAgICAgZmV0Y2goZGF0YSlcbiAgICAgICAgICAgIC50aGVuKCByZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkgKVxuICAgICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG5cbiAgICAgICAgICAgICAgaWYgKCAhcmVxdWVzdEZyb21CR1N5bmMgKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3R2JylcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsb2NhbEpzb24nLCBKU09OLnN0cmluZ2lmeShqc29uKSk7XG5cbiAgICAgICAgICAgICAgbGV0IHNhdmVkRGF0ZSA9IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgICAgZGF0ZSA9IHNhdmVkRGF0ZS5nZXRGdWxsWWVhcigpICsgJy8nICsgKCcwJyArIChzYXZlZERhdGUuZ2V0TW9udGgoKSsxKSkuc2xpY2UoLTIpICsgJy8nICsgKCcwJyArIHNhdmVkRGF0ZS5nZXREYXRlKCkpLnNsaWNlKC0yKSArICcgLSAnLFxuICAgICAgICAgICAgICAgIHRpbWUgPSAoJzAnICsgc2F2ZWREYXRlLmdldEhvdXJzKCkpLnNsaWNlKC0yKSArIFwiOlwiICsgKCcwJyArIHNhdmVkRGF0ZS5nZXRNaW51dGVzKCkpLnNsaWNlKC0yKSxcbiAgICAgICAgICAgICAgICBkYXRlVGltZSA9IGRhdGUgKyAnICcgKyB0aW1lXG5cbiAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJqc29uRGF0ZVwiLCBkYXRlVGltZSlcbiAgICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuc2F2ZWQtZGF0ZScpLmlubmVySFRNTCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwianNvbkRhdGVcIilcblxuICAgICAgICAgICAgICBnZXRQcm9ncmFtcyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9jYWxKc29uJykpXG5cbiAgICAgICAgICAgICAgLy9Ob3RpZmlrYXppbyBiaWRleiBvaGFydGFyYXppXG4gICAgICAgICAgICAgIGlmKCB3Lk5vdGlmaWNhdGlvbiAmJiBOb3RpZmljYXRpb24ucGVybWlzc2lvbiAhPT0gJ2RlbmllZCcgKSB7XG4gICAgICAgICAgICAgICAgTm90aWZpY2F0aW9uLnJlcXVlc3RQZXJtaXNzaW9uKHN0YXR1cyA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMpXG4gICAgICAgICAgICAgICAgICBsZXQgbiA9IG5ldyBOb3RpZmljYXRpb24oJ05haGllcmFuJywge1xuICAgICAgICAgICAgICAgICAgICBib2R5OiAnUHJvZ3JhbWEgemVycmVuZGEgZWd1bmVyYXR1IGRhIDopJyxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJy4vYXNzZXRzL2Zhdmljb24ucG5nJ1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0dicsIGRhdGEpXG4gICAgICAgICAgfSlcblxuICAgICAgICAvL1Byb2dyYW1hayBsb2NhbC1lYW4gZ29yZGV0YSBiYWRhZ29cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgZ2V0UHJvZ3JhbXMoZGF0YSlcbiAgICAgICAgfVxuXG4gICAgICB9Ly9mZXRjaEFsbFByb2dyYW1zXG5cbiAgICAgIC8vRmlsdHJvYSBlZ2luXG4gICAgICBmaWx0ZXJpbmcoJy50dl9fbGlzdCcpXG5cbiAgICAgIC8vR29yZGV0YWtvIEFQSWEgZXphYmF0dSBldGEgYmVycmlhIGVrYXJ0emVrbyAtIEVaQUJBVFVcbiAgICAgIGQucXVlcnlTZWxlY3RvcignLmRlbGV0ZVN0b3JhZ2UnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGlmICggY29uZmlybSgnUHJvZ3JhbWEgemVycmVuZGEgZWd1bmVyYXR1IG5haGkgYWwgZHV6dT8nKSA9PSB0cnVlKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2xvY2FsSnNvbicpXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2pzb25EYXRlJylcblxuICAgICAgICAgIC8vQmlkZW9hIG1hcnR4YW4gYmFkYWdvIGVyZSwgZ2VyYXR1XG4gICAgICAgICAgaWYoZC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpLnBhdXNlKCkpXG4gICAgICAgICAgICBkLmdldEVsZW1lbnRCeUlkKFwidmlkZW9cIikucGF1c2UoKVxuXG4gICAgICAgICAgbGV0IHJlc2V0ID0gdHJ1ZSxcbiAgICAgICAgICAgIGRhdGE9ICcvL3N0aWxsLWNhc3RsZS05OTc0OS5oZXJva3VhcHAuY29tL3BsYXlsaXN0J1xuXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3R2JywgZGF0YSlcblxuICAgICAgICAgIGZldGNoQWxsUHJvZ3JhbXMoZGF0YSwgZmFsc2UsIHJlc2V0KVxuXG4gICAgICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKHByb2dyYW1haylcbiAgICAgICAgICBpZiAoICdzZXJ2aWNlV29ya2VyJyBpbiBuICYmICdTeW5jTWFuYWdlcicgaW4gdyApIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQkdTeW5jICgpIHtcbiAgICAgICAgICAgICAgbi5zZXJ2aWNlV29ya2VyLnJlYWR5XG4gICAgICAgICAgICAgIC50aGVuKHJlZ2lzdHJhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbi5zeW5jLnJlZ2lzdGVyKCduYWhpZXJhbi10dicpXG4gICAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4gYygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIGVycmVnaXN0cmF0dWEnKSApXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goIGVyciA9PiBjKCdFcnJvcmVhIGF0emVrbyBzaW5rcm9uaXphemlvYSBlcnJlZ2lzdHJhdHplYW4nLCBlcnIpIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlZ2lzdGVyQkdTeW5jKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vQXBsaWthemlvcmEgc2FydHplbiBkZW5lYW4gZWdpbiBiZWhhcnJla29hIChBUElhIGRlaXR1IGVkbyBleilcbiAgICAgIGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2NhbEpzb24nKSl7XG4gICAgICAgIGZldGNoQWxsUHJvZ3JhbXMobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvY2FsSnNvbicpLCBmYWxzZSwgZmFsc2UpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgbGV0IHJlc2V0ID0gdHJ1ZSxcbiAgICAgICAgICBkYXRhPSAnLy9zdGlsbC1jYXN0bGUtOTk3NDkuaGVyb2t1YXBwLmNvbS9wbGF5bGlzdCdcblxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndHYnLCBkYXRhKVxuXG4gICAgICAgIGZldGNoQWxsUHJvZ3JhbXMoZGF0YSwgZmFsc2UsIHJlc2V0KVxuXG4gICAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChwcm9ncmFtYWspXG4gICAgICAgIGlmICggJ3NlcnZpY2VXb3JrZXInIGluIG4gJiYgJ1N5bmNNYW5hZ2VyJyBpbiB3ICkge1xuICAgICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQkdTeW5jICgpIHtcbiAgICAgICAgICAgIG4uc2VydmljZVdvcmtlci5yZWFkeVxuICAgICAgICAgICAgLnRoZW4ocmVnaXN0cmF0aW9uID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvbi5zeW5jLnJlZ2lzdGVyKCduYWhpZXJhbi10dicpXG4gICAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgLmNhdGNoKCBlcnIgPT4gYygnRXJyb3JlYSBhdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR6ZWFuJywgZXJyKSApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICByZWdpc3RlckJHU3luYygpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChwcm9ncmFtYWspXG4gICAgICBuLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGUgPT4ge1xuICAgICAgICBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgbWVzc2FnZSBiaWRlejogJywgZS5kYXRhKVxuICAgICAgICBpZiggZS5kYXRhID09PSAnb25saW5lIG5haGllcmFuLXR2JyApXG4gICAgICAgICAgZmV0Y2hBbGxQcm9ncmFtcyggbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3R2JyksIHRydWUsIGZhbHNlIClcbiAgICAgIH0pXG5cbiAgICB9IC8vcmVhZHlTdGF0ZVxuICB9LCAxMDAgKS8vaW50ZXJ2YWxcblxuICByZXR1cm4gYFxuICAgICR7Y2F0ZWdvcmllcygpfVxuICAgIDxkaXYgY2xhc3M9XCJ0diBzZWN0aW9uXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwidHZfX2Zvcm1cIj5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJmaW5kLXByb2dyYW1zXCIgY2xhc3M9XCJ0dl9faW5wdXRcIiBwbGFjZWhvbGRlcj1cImVpdGJrbyBzYWlvZW4gYXJ0ZWFuIGJpbGF0dS4uLlwiIHRpdGxlPVwiU2Fpb2FrIGJpbGF0dVwiPlxuICAgICAgPC9kaXY+XG4gICAgICA8aGVhZGVyIGNsYXNzPVwic2VjdGlvbi1oZWFkZXIgdHZfX2hlYWRlclwiPjwvaGVhZGVyPlxuICAgICAgPHVsIGNsYXNzPVwidHZfX2xpc3RcIj48L3VsPlxuICAgICAgPGRpdiBjbGFzcz1cImxvYWRlci10ZW1wbGF0ZSBsb2FkZXItdGVtcGxhdGUtdHZcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImxvYWRlciBsb2FkZXItdHZcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgICR7c2VsZWN0UHJvZ3JhbSgpfVxuICAgICR7c2VsZWN0RXBpc29kZSgpfVxuICAgICR7Y2F0ZWdvcmllc1NpbmdsZSgpfVxuICAgIGBcbn1cbiIsImNvbnN0IGMgPSBjb25zb2xlLmxvZyxcbiAgZCA9IGRvY3VtZW50LFxuICBuID0gbmF2aWdhdG9yLFxuICB3ID0gd2luZG93XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RQcm9ncmFtID0gKCkgPT4ge1xuXG4gIGNvbnN0IGFqYXhMb2FkaW5nID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXG4gICAgaWYgKCBkLnJlYWR5U3RhdGUgID09PSAnY29tcGxldGUnICkge1xuXG4gICAgICBjbGVhckludGVydmFsKGFqYXhMb2FkaW5nKVxuXG4gICAgICAvL1Byb2dyYW1hIGVrYXJyaSAoemVycmVuZGEpXG4gICAgICBmdW5jdGlvbiBmZXRjaFByb2dyYW0oanNvbkRhdGEsIHJlcXVlc3RGcm9tQkdTeW5jKSB7XG5cdCBcdFx0XG4gICAgICAgIGxldCBkYXRhID0ganNvbkRhdGEuc2xpY2UoNSksXG4gICAgICAgICAgdHBsID0gJycsXG4gICAgICAgICAgZGF0ZSA9ICcnXG5cbiAgICAgICAgLy9CZWhhcnJlemtvIHNla3ppb2FrIGV6a3V0YXR1XG4gICAgICAgIGQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24nKS5mb3JFYWNoKCBzZWN0aW9uID0+IHtcbiAgICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ3UtaGlkZScpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy9Mb2FkZXIgZXJha3V0c2lcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXByb2dyYW0nKS5jbGFzc0xpc3QuYWRkKCdsb2FkZXItc2hvdycpXG4gICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci10ZW1wbGF0ZS1wcm9ncmFtJykuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNob3cnKVxuXG4gICAgICAgIGZldGNoKGRhdGEpXG4gICAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSApXG4gICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG5cbiAgICAgICAgICAgIGlmICggIXJlcXVlc3RGcm9tQkdTeW5jICkge1xuICBcdFx0XHRcdFx0ICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndHYtcHJvZ3JhbScpXG4gICAgICAgICAgICB9XG5cbiAgXHRcdFx0XHQgIGQucXVlcnlTZWxlY3RvcignLnByb2dyYW0nKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGUnKVxuICBcdFx0XHRcdCAgLy9Mb2FkZXIgZXprdXRhdHVcbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci1wcm9ncmFtJykuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNob3cnKVxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXRlbXBsYXRlLXByb2dyYW0nKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG5cbiAgICAgICAgICAgIGpzb24ubWVtYmVyLmZvckVhY2goanNvbiA9PiB7XG4gICAgICAgICAgICAgIGlmKGpzb24uYnJvYWRjYXN0X2RhdGUpIHtcbiAgICAgICAgICAgICAgICBkYXRlID0ganNvbi5icm9hZGNhc3RfZGF0ZS5zbGljZSgwLDEwKVxuICBcdFx0XHRcdCAgXHR9XG4gICAgICAgICAgICAgIHRwbCArPSBgXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiY3VzdG9tLWVwaXNvZGVcIiBkYXRhLWVwaXNvZGU9XCIke2pzb25bXCJAaWRcIl19XCI+XG4gICAgICBcdFx0XHRcdFx0ICA8ZGl2IGNsYXNzPVwicHJvZ3JhbV9faW1hZ2VcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2pzb24uZXBpc29kZV9pbWFnZS5zbGljZSg1KX1cIiBjbGFzcz1cInByb2dyYW1fX2ltZyBjdXN0b20tZXBpc29kZVwiIGRhdGEtZXBpc29kZT1cIiR7anNvbltcIkBpZFwiXX1cIj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3JhbV9fY29udGVudCBjdXN0b20tZXBpc29kZVwiIGRhdGEtZXBpc29kZT1cIiR7anNvbltcIkBpZFwiXX1cIj5cbiAgICAgICAgICAgICAgICAgICAgJHtqc29uLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyYW1fX2RhdGVcIj4ke2RhdGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICBcdGQucXVlcnlTZWxlY3RvcignLnByb2dyYW1fX2xpc3QnKS5pbm5lckhUTUwgPSB0cGxcbiAgICAgICAgICBcdGQucXVlcnlTZWxlY3RvcignLnByb2dyYW1fX2hlYWRlcicpLmlubmVySFRNTCA9IGBcbiAgICAgICAgICBcdFx0PGRpdiBjbGFzcz1cInByb2dyYW1fX3RpdGxlXCI+JHtqc29uLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmFtX19kZXNjXCI+JHtqc29uLmRlc2NfZ3JvdXB9PC9kaXY+XG4gICAgICAgICAgICAgIGBcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSlcblx0XHQgIH1cblxuICAgICAgLy9Qcm9ncmFtYSBla2FycmkgKGNsaWNrIGViZW50dWEpXG4gICAgICBkLmdldEVsZW1lbnRCeUlkKFwiYXBwXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYoIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncHJvZ3JhbS1pZCcpICkge1xuXG4gIFx0XHQgICAgbGV0IGRhdGEgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZ3JhbScpXG5cbiAgXHRcdCAgXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndHYtcHJvZ3JhbScsIGRhdGEpXG5cbiAgICAgICAgICBmZXRjaFByb2dyYW0oIGRhdGEsIGZhbHNlKVxuXG4gICAgICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKHByb2dyYW1haylcbiAgICAgICAgICBpZiAoICdzZXJ2aWNlV29ya2VyJyBpbiBuICYmICdTeW5jTWFuYWdlcicgaW4gdyApIHtcbiAgXHRcdFx0ICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQkdTeW5jICgpIHtcbiAgXHRcdFx0ICAgICAgbi5zZXJ2aWNlV29ya2VyLnJlYWR5XG4gIFx0XHRcdCAgICAgICAgLnRoZW4ocmVnaXN0cmF0aW9uID0+IHtcbiAgXHRcdFx0ICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb24uc3luYy5yZWdpc3RlcignbmFoaWVyYW4tdHYtcHJvZ3JhbScpXG4gIFx0XHRcdCAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCBlcnIgPT4gYygnRXJyb3JlYSBhdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR6ZWFuJywgZXJyKSApXG4gIFx0XHRcdCAgICAgICAgfSlcbiAgXHRcdFx0ICAgIH1cbiAgXHRcdFx0ICAgIHJlZ2lzdGVyQkdTeW5jKClcbiAgXHRcdFx0ICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAvL0JhY2tncm91bmQgU3luYyAocHJvZ3JhbWFrKVxuICAgICAgbi5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBlID0+IHtcblx0XHQgICAgY29uc29sZS5sb2coJ0F0emVrbyBzaW5rcm9uaXphemlvYSBtZXNzYWdlIGJpZGV6IGFrdGliYXR1YTogJywgZS5kYXRhKVxuXHRcdCAgICBpZiggZS5kYXRhID09PSAnb25saW5lIG5haGllcmFuLXR2LXByb2dyYW0nIClcblx0XHQgICAgXHRmZXRjaFByb2dyYW0oIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0di1wcm9ncmFtJyksIHRydWUgKVxuXHRcdCAgfSlcbiAgICB9IC8vcmVhZHlTdGF0ZVxuICB9LCAxMDAgKS8vaW50ZXJ2YWxcblxuICByZXR1cm4gYFxuICAgIDxkaXYgY2xhc3M9XCJsb2FkZXItdGVtcGxhdGUgbG9hZGVyLXRlbXBsYXRlLXByb2dyYW1cIj5cbiAgXHQgIDxkaXYgY2xhc3M9XCJsb2FkZXIgbG9hZGVyLXByb2dyYW1cIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicHJvZ3JhbSBzZWN0aW9uIHUtaGlkZVwiPlxuICBcdCAgPGhlYWRlciBjbGFzcz1cInNlY3Rpb24taGVhZGVyIHByb2dyYW1fX2hlYWRlclwiPjwvaGVhZGVyPlxuICAgICAgPHVsIGNsYXNzPVwicHJvZ3JhbV9fbGlzdFwiPjwvdWw+XG4gICAgPC9kaXY+XG4gICAgYFxufVxuIiwiY29uc3QgYyA9IGNvbnNvbGUubG9nLFxuICBkID0gZG9jdW1lbnQsXG4gIG4gPSBuYXZpZ2F0b3IsXG4gIHcgPSB3aW5kb3dcblxuZXhwb3J0IGNvbnN0IHNlbGVjdEVwaXNvZGUgPSAoKSA9PiB7XG5cbiAgY29uc3QgcmVhZHlTdGF0ZSA9IHNldEludGVydmFsKCgpID0+IHtcblxuICAgIGlmICggZC5yZWFkeVN0YXRlICA9PT0gJ2NvbXBsZXRlJyApIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwocmVhZHlTdGF0ZSlcblxuICAgICAgLy9BdHplcmEgam9hbiAocHJvZ3JhbWV0YXJhKVxuICAgICAgZC5nZXRFbGVtZW50QnlJZCgnZXBpc29kZV9fYmFjaycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgLy9CZWhhcnJlemtvIHNla3ppb2FrIGV6a3V0YXR1XG4gICAgICAgIGQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24nKS5mb3JFYWNoKCBzZWN0aW9uID0+IHtcbiAgICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ3UtaGlkZScpXG4gICAgICAgICAgZC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpLnBhdXNlKClcbiAgICAgICAgfSlcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcucHJvZ3JhbScpLmNsYXNzTGlzdC5yZW1vdmUoJ3UtaGlkZScpXG4gICAgICB9KVxuXG4gICAgICAvL2VwaXNvZGUga2FyZ2F0dVxuICAgICAgZnVuY3Rpb24gZmV0Y2hFcGlzb2RlKGpzb25EYXRhLCByZXF1ZXN0RnJvbUJHU3luYykge1xuXG4gICAgICAgIGxldCBkYXRhID0ganNvbkRhdGEuc2xpY2UoNSksXG4gICAgICAgICAgdHBsID0gJydcblxuICAgICAgICAvL0xvYWRlciBlcmFrdXRzaVxuICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItZXBpc29kZScpLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zaG93JylcbiAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXRlbXBsYXRlLWVwaXNvZGUnKS5jbGFzc0xpc3QuYWRkKCdsb2FkZXItc2hvdycpXG5cbiAgICAgICAgLy9CZWhhcnJlemtvIHNla3ppb2FrIGV6a3V0YXR1XG4gICAgICAgIGQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24nKS5mb3JFYWNoKCBzZWN0aW9uID0+IHtcbiAgICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ3UtaGlkZScpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy9BUElhIGRlaXR1IChlcGlzb2RlKVxuICAgICAgICBmZXRjaChkYXRhKVxuXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAgIC50aGVuKGpzb24gPT4ge1xuXG4gICAgICAgICAgICBkLnF1ZXJ5U2VsZWN0b3IoJy5lcGlzb2RlJykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRlJylcblxuICAgICAgICAgICAgaWYgKCFyZXF1ZXN0RnJvbUJHU3luYykge1xuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndHYtcHJvZ3JhbS1lcGlzb2RlJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9Mb2FkZXIgZXprdXRhdHVcbiAgICAgICAgICAgIGQucXVlcnlTZWxlY3RvcignLmxvYWRlci1lcGlzb2RlJykuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNob3cnKVxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXRlbXBsYXRlLWVwaXNvZGUnKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc2hvdycpXG5cbiAgICAgICAgICAgIGxldCB1cmxFbmQgPSBqc29uLnVybC5zbGljZSgtMyk7XG5cbiAgICAgICAgICAgIGlmKHVybEVuZCA9PT0gJ21wNCcpIHtcbiAgICAgICAgICAgICAgdXJsRW5kID0ganNvbi51cmxcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICB1cmxFbmQgPSBqc29uLmZvcm1hdHNbN10udXJsXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRwbCA9IGBcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVwaXNvZGVfX3ZpZGVvXCI+XG4gICAgICAgICAgICAgICAgPHZpZGVvIGlkPVwidmlkZW9cIiBhdXRvcGxheSB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgY29udHJvbHMgcG9zdGVyPVwiJHtqc29uLnRodW1ibmFpbHNbMF0udXJsLnNsaWNlKDUpfVwiPlxuICAgICAgICAgICAgICAgICAgPHNvdXJjZSBzcmM9XCIke3VybEVuZC5zbGljZSg1KX1cIiB0eXBlPVwidmlkZW8vbXA0XCI+XG4gICAgICAgICAgICAgICAgICBadXJlIG5hYmlnYXp0YWlsZWFrIGV6aW4gZHUgYmlkZW9yaWsgZXJha3V0c2kgOihcbiAgICAgICAgICAgICAgICA8L3ZpZGVvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuZXBpc29kZV9fcGxheScpLmlubmVySFRNTCA9IHRwbFxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuZXBpc29kZV9faGVhZGVyJykuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXBpc29kZV9fdGl0bGVcIj4ke2pzb24udGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlcGlzb2RlX19kZXNjXCI+JHtqc29uLmRlc2NyaXB0aW9ufTwvZGl2PlxuICAgICAgICAgICAgICBgXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0di1wcm9ncmFtLWVwaXNvZGUnLCBkYXRhKVxuICAgICAgICAgICAgZC5xdWVyeVNlbGVjdG9yKCcuZXBpc29kZV9fcGxheScpLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwiZXJyb3JcIj5Lb25leGlvYWsgaHV0cyBlZ2luIGR1PC9kaXY+J1xuICAgICAgICAgIH0pXG4gICAgICB9IC8vZmV0Y2hFcGlzb2RlXG5cbiAgICAgIC8vUHJvZ3JhbWEgemVycmVuZGF0aWsgZXBpc29kZSBla2FycmkgKGNsaWNrKVxuICAgICAgZC5xdWVyeVNlbGVjdG9yKCcucHJvZ3JhbV9fbGlzdCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgaWYoIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY3VzdG9tLWVwaXNvZGUnKSApIHtcblxuICAgICAgICAgIGxldCBkYXRhID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWVwaXNvZGUnKVxuXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3R2LXByb2dyYW0tZXBpc29kZScsIGRhdGEpXG4gICAgICAgICAgZmV0Y2hFcGlzb2RlKGRhdGEsIGZhbHNlKVxuXG4gICAgICAgICAgLy9CYWNrZ3JvdW5kIFN5bmMgKGVwaXNvZGUpXG4gICAgICAgICAgaWYgKCAnc2VydmljZVdvcmtlcicgaW4gbiAmJiAnU3luY01hbmFnZXInIGluIHcgKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiByZWdpc3RlckJHU3luYyAoKSB7XG4gICAgICAgICAgICAgIG4uc2VydmljZVdvcmtlci5yZWFkeVxuICAgICAgICAgICAgICAudGhlbihyZWdpc3RyYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb24uc3luYy5yZWdpc3RlcignbmFoaWVyYW4tdHYtcHJvZ3JhbS1lcGlzb2RlJylcbiAgICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiBjKCdBdHpla28gc2lua3Jvbml6YXppb2EgZXJyZWdpc3RyYXR1YScpIClcbiAgICAgICAgICAgICAgICAgIC5jYXRjaCggZXJyID0+IGMoJ0Vycm9yZWEgYXR6ZWtvIHNpbmtyb25pemF6aW9hIGVycmVnaXN0cmF0emVhbicsIGVycikgKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVnaXN0ZXJCR1N5bmMoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vQmFja2dyb3VuZCBTeW5jIChlcGlzb2RlKVxuICAgICAgbi5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBlID0+IHtcbiAgICAgICAgYygnQXR6ZWtvIHNpbmtyb25pemF6aW9hIG1lc3NhZ2UgYmlkZXo6ICcsIGUuZGF0YSlcbiAgICAgICAgaWYoIGUuZGF0YSA9PT0gJ29ubGluZSBuYWhpZXJhbi10di1wcm9ncmFtLWVwaXNvZGUnKVxuICAgICAgICAgIGZldGNoRXBpc29kZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndHYtcHJvZ3JhbS1lcGlzb2RlJyksIHRydWUpXG4gICAgICB9KVxuXG4gICAgfSAvL3JlYWR5U3RhdGVcbiAgfSwgMTAwICkvL2ludGVydmFsXG5cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGNsYXNzPVwibG9hZGVyLXRlbXBsYXRlIGxvYWRlci10ZW1wbGF0ZS1lcGlzb2RlXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibG9hZGVyIGxvYWRlci1lcGlzb2RlXCI+PC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiZXBpc29kZSBzZWN0aW9uIHUtaGlkZVwiPlxuICAgICAgPGhlYWRlciBjbGFzcz1cInNlY3Rpb24taGVhZGVyIGVwaXNvZGVfX2hlYWRlclwiPjwvaGVhZGVyPlxuICAgICAgPGRpdiBjbGFzcz1cImVwaXNvZGVfX3BsYXlcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJlcGlzb2RlX19uYXZcIj48YSBocmVmPVwiI1wiIGlkPVwiZXBpc29kZV9fYmFja1wiPjwgQXR6ZXJhPC9hPjwvZGl2PlxuICAgIDwvZGl2PlxuICAgIGBcbn1cbiIsImltcG9ydCB7IGluaXQsIHB3YSwgaXNPbmxpbmUgfSBmcm9tICcuL2NvbXBvbmVudHMvaW5pdCc7XG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKS5pbm5lckhUTUwgPSBpbml0KClcblxuLy9BcGxpa3ppb2Egd2ViIHByb2dyZXNpYm9hIGVycmVnaXN0cmF0dVxucHdhKClcbi8vT25saW5lL2ZmbGluZSBnYXVkZW4gemVoYXp0dVxuaXNPbmxpbmUoKVxuIl19
