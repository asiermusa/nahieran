import DPlayer from 'dplayer';

const c = console.log,
  d = document,
  n = navigator,
  w = window

export const selectEpisode = () => {

  const readyState = setInterval(() => {

    if ( d.readyState  === 'complete' ) {
      clearInterval(readyState)

      //Atzera joan (programetara)
      d.getElementById('episode__back').addEventListener('click', (e) => {
        //Beharrezko sekzioak ezkutatu
        d.querySelectorAll('.section').forEach( section => {
          section.classList.add('u-hide')
        })
        d.querySelector('.program').classList.remove('u-hide')

        //Bideoa martxan badago ere, geratu
        if(d.querySelector(".dplayer-video")) {
          d.querySelector(".dplayer-video").pause()
        }

      })

      //episode kargatu
      function fetchEpisode(jsonData, requestFromBGSync) {

        let data = jsonData.replace(/^http:\/\//i, 'https://')

        //Loader erakutsi
        d.querySelector('.loader-episode').classList.add('loader-show')
        d.querySelector('.loader-template-episode').classList.add('loader-show')

        //Beharrezko sekzioak ezkutatu
        d.querySelectorAll('.section').forEach( section => {
          section.classList.add('u-hide')
        })

        //APIa deitu (episode)
        fetch(data)

          .then(response => response.json())
          .then(json => {

            var dp = ""

            d.querySelector('.episode').classList.remove('u-hide')

            if (!requestFromBGSync) {
              localStorage.removeItem('tv-program-episode')
            }

            //Loader ezkutatu
            d.querySelector('.loader-episode').classList.remove('loader-show')
            d.querySelector('.loader-template-episode').classList.remove('loader-show')

            let urlEnd = json.url.slice(-3);
            let fullVideo = ''

            if(urlEnd === 'mp4') {
              urlEnd = json.url
              fullVideo = json.url
            }else{
              urlEnd = json.formats[6].url
              fullVideo = json.formats[9].url
            }

            if(d.getElementById('dplayer')){
              dp = new DPlayer({
                container: d.getElementById('dplayer'),
                autoplay: false,
                theme: '#008cd0',
                video: {
                    url: urlEnd,
                    thumbnails: json.thumbnail,
                    pic: json.thumbnail
                },
              });
            }

            //Bideoaren src kodea aldatu (https bidez funtzionatzeko)
            //d.querySelector(".dplayer-video").setAttribute("src", urlEnd)

            // full video link
            d.getElementById("fullVideo").setAttribute("onclick", `window.open('${fullVideo}')`)

            d.querySelector('.episode__error').classList.remove('show')

            d.querySelector('.episode__header').innerHTML = `
              <div class="episode__title">${json.title}</div>
              <div class="episode__desc">${json.description}</div>
              `

          })
          .catch(err => {
            localStorage.setItem('tv-program-episode', jsonData.replace(/^http:\/\//i, 'https://'))
            d.querySelector('.episode__error').innerHTML = 'Konexioak huts egin du'
            d.querySelector('.episode__error').classList.add('show')
          })
      } //fetchEpisode

      //Programa zerrendatik episode ekarri (click)
      d.querySelector('.program__list').addEventListener('click', (e) => {
        e.preventDefault()

        if( e.target.classList.contains('custom-episode') ) {

          let data = e.target.getAttribute('data-episode')

          //console.warn(data)
          localStorage.setItem('tv-program-episode', data.replace(/^http:\/\//i, 'https://'))

          //Background Sync (episode)
          if ( 'serviceWorker' in n && 'SyncManager' in w ) {
            function registerBGSync () {
              n.serviceWorker.ready
              .then(registration => {
                return registration.sync.register('nahieran-tv-program-episode')
                  .then( () => {
                    c('Atzeko sinkronizazioa erregistratua')
                    //Loader erakutsi
                    d.querySelector('.loader-episode').classList.add('loader-show')
                    d.querySelector('.loader-template-episode').classList.add('loader-show')
                  })
                  .catch( err => c('Errorea atzeko sinkronizazioa erregistratzean', err) )
              })
            }
            registerBGSync()

            //Background Sync (episode)
            n.serviceWorker.addEventListener('message', e => {
              //c('Atzeko sinkronizazioa message bidez: ', e.data)
              if( e.data === 'online nahieran-tv-program-episode' || e.data === 'online test-tag-from-devtools' )
                fetchEpisode(localStorage.getItem('tv-program-episode'), true)
            })
          }else{
            fetchEpisode(data, false)
          }
        }
      })


    } //readyState
  }, 100 )//interval

  return `
    <div class="loader-template loader-template-episode">
      <div class="loader loader-episode"></div>
    </div>

    <div class="episode section u-hide">
      <header class="section-header episode__header"></header>
      <div class="episode__play">
        <div id="dplayer"></div>
      </div>
      <div class="episode__error"></div>
      <div class="episode__notes">Kalitate altuagoan ikusteko egin <a href="#" onclick="window.location='https://twitter.com/erralin'" class="episode__notes-link" id="fullVideo" target="_blank">klik hemen.</a></div>
      <div class="episode__nav"><a href="#" id="episode__back">< Atzera</a></div>
    </div>
    `
}
