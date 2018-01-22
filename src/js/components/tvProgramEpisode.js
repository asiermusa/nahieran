import DPlayer from 'DPlayer'

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
          d.getElementById("video").pause()
        })
        d.querySelector('.program').classList.remove('u-hide')
      })

      //episode kargatu
      function fetchEpisode(jsonData, requestFromBGSync) {

        let data = jsonData.slice(5),
          tpl = ''

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

            d.querySelector('.episode').classList.remove('u-hide')

            if (!requestFromBGSync) {
              localStorage.removeItem('tv-program-episode')
            }

            //Loader ezkutatu
            d.querySelector('.loader-episode').classList.remove('loader-show')
            d.querySelector('.loader-template-episode').classList.remove('loader-show')

            let urlEnd = json.url.slice(-3);

            if(urlEnd === 'mp4') {
              urlEnd = json.url
            }else{
              urlEnd = json.formats[7].url
            }
            
            if(d.getElementById('dplayer')){
              var dp = new DPlayer({
                container: d.getElementById('dplayer'),
                autoplay: false,
                theme: '#008cd0',
                screenshot: true,
                video: {
                  url: urlEnd.slice(5)                
                }
              });
            }
                        
            d.querySelector('.episode__header').innerHTML = `
              <div class="episode__title">${json.title}</div>
              <div class="episode__desc">${json.description}</div>
              `
          })
          .catch(err => {
            localStorage.setItem('tv-program-episode', jsonData)
            d.querySelector('.episode__play').innerHTML = '<div class="error">Konexioak huts egin du</div>'
          })
      } //fetchEpisode

      //Programa zerrendatik episode ekarri (click)
      d.querySelector('.program__list').addEventListener('click', (e) => {
        e.preventDefault()

        if( e.target.classList.contains('custom-episode') ) {

          let data = e.target.getAttribute('data-episode')

          localStorage.setItem('tv-program-episode', data)
          fetchEpisode(data, false)

          //Background Sync (episode)
          if ( 'serviceWorker' in n && 'SyncManager' in w ) {
            function registerBGSync () {
              n.serviceWorker.ready
              .then(registration => {
                return registration.sync.register('nahieran-tv-program-episode')
                  .then( () => c('Atzeko sinkronizazioa erregistratua') )
                  .catch( err => c('Errorea atzeko sinkronizazioa erregistratzean', err) )
              })
            }
            registerBGSync()
          }
        }
      })
      //Background Sync (episode)
      n.serviceWorker.addEventListener('message', e => {
        c('Atzeko sinkronizazioa message bidez: ', e.data)
        if( e.data === 'online nahieran-tv-program-episode')
          fetchEpisode(localStorage.getItem('tv-program-episode'), true)
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
      <div class="episode__nav"><a href="#" id="episode__back">< Atzera</a></div>
    </div>
    `
}
