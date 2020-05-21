const c = console.log,
  d = document,
  n = navigator,
  w = window

export const deleteContent = () => {

  //Beharrezko sekzioak ezkutatu
  d.querySelectorAll('.section').forEach( section => {
    section.classList.add('u-hide')
  })
  d.querySelector('.categories').classList.remove('u-hide')
  d.querySelector('.tv').classList.remove('u-hide')

  //Bideoa martxan badago ere, geratu
  if(d.querySelector(".dplayer-video")) {
    d.querySelector(".dplayer-video").pause()
    }
}

const filtering = (ul) => {

  d.getElementById('find-programs').addEventListener('keyup', (e) => {

    let json = JSON.parse( localStorage.getItem('localJson')),
      lista = null,
      tpl = ''

    lista = json.member.filter( list => {
      return list.title.toLowerCase().includes(e.target.value.toLowerCase())
    })

    lista.forEach(json => {
      tpl +=
      `
      <li>
        <a href="#" class="program-id" data-program="${json["@id"]}">
        ${json.title}
        </a>
      </li>
      `
    })

    d.querySelector(ul).innerHTML = tpl
    d.querySelector('.tv__header').innerHTML = `<span class="tv__number">${lista.length}</span> saio erakusten`
  })
}

export const tv = () => {

  const readyState = setInterval(() => {

    if ( d.readyState  === 'complete' ) {

      clearInterval(readyState)

      //Programa erakutsi (buklea)
      function getPrograms(json) {

        let tpl = ''

        JSON.parse(json).member.forEach(json => {

          tpl += `
            <li>
              <a href="#" class="program-id" data-program="${json["@id"]}">
                ${json.title}
              </a>
            </li>
            `
        })

        d.querySelector('.tv__list').innerHTML = tpl
        d.querySelector('.tv__header').innerHTML = `Saio guztiak erakusten <span class="tv__number">(${JSON.parse( json ).member.length})</span>`
        //Loader ezkutatu
        d.querySelector('.loader-tv').classList.remove('loader-show')
        d.querySelector('.loader-template-tv').classList.remove('loader-show')
        //Footerrean APIaren eguneraketa data bistaratu
        d.querySelector('.main-footer__text').classList.add('is-cache')
      }

      //Programak ekarri
      function fetchAllPrograms(data, requestFromBGSync, reset) {

        let tpl = ''

        //Loader erakutsi
        d.querySelector('.loader-template-tv').classList.add('loader-show')
        d.querySelector('.loader-tv').classList.add('loader-show')
        //Beharrezko sekzioak ezkutatu
        d.querySelectorAll('.section').forEach( section => {
          section.classList.add('u-hide')
        })
        d.querySelector('.categories').classList.remove('u-hide')
        d.querySelector('.tv').classList.remove('u-hide')

        //Bideoa martxan badago ere, geratu
        if(d.querySelector(".dplayer-video")) {
          d.querySelector(".dplayer-video").pause()
        }

        //APIa deitu behar bada...
        if(reset) {

          fetch(data)
            .then( response => response.json() )
            .then(json => {

              if ( !requestFromBGSync ) {
                localStorage.removeItem('tv')
              }

              localStorage.setItem('localJson', JSON.stringify(json));

              let savedDate = new Date(),
                date = savedDate.getFullYear() + '/' + ('0' + (savedDate.getMonth()+1)).slice(-2) + '/' + ('0' + savedDate.getDate()).slice(-2) + ' - ',
                time = ('0' + savedDate.getHours()).slice(-2) + ":" + ('0' + savedDate.getMinutes()).slice(-2),
                dateTime = date + ' ' + time

              localStorage.setItem("jsonDate", dateTime)
              d.querySelector('.saved-date').innerHTML = localStorage.getItem("jsonDate")

              getPrograms(localStorage.getItem('localJson'))

              //Notifikazio bidez ohartarazi
              if( w.Notification && Notification.permission !== 'denied' ) {
                Notification.requestPermission(status => {
                  //console.log(status)
                  let n = new Notification('Nahieran', {
                    body: 'Programa zerrenda eguneratu da :)',
                    icon: './assets/favicon.png'
                  })
                })
              }
            })
            .catch(err => {
              localStorage.setItem('tv', data)
          })

        //Programak local-ean gordeta badago
        }else{
          getPrograms(data)
        }

      }//fetchAllPrograms

      //Filtroa egin
      filtering('.tv__list')

      //Gordetako APIa ezabatu eta berria ekartzeko - EZABATU
      d.querySelector('.deleteStorage').addEventListener('click', (e) => {

        e.preventDefault()
        if ( confirm('Programa zerrenda eguneratu nahi al duzu?') == true) {
          localStorage.removeItem('localJson')
          localStorage.removeItem('jsonDate')

          let reset = true,
            data= 'https://still-castle-99749.herokuapp.com/playlist'

          localStorage.setItem('tv', data)

          fetchAllPrograms(data, false, reset)

          //Background Sync (programak)
          if ( 'serviceWorker' in n && 'SyncManager' in w ) {
            function registerBGSync () {
              n.serviceWorker.ready
              .then(registration => {
                return registration.sync.register('nahieran-tv')
                  .then( () => c('Atzeko sinkronizazioa erregistratua') )
                  .catch( err => c('Errorea atzeko sinkronizazioa erregistratzean', err) )
              })
            }
            registerBGSync()
          }
        }
      })

      //Aplikaziora sartzen denean egin beharrekoa (APIa deitu edo ez)
      if(localStorage.getItem('localJson')){
        fetchAllPrograms(localStorage.getItem('localJson'), false, false)
      }else{
        let reset = true,
          data = 'https://still-castle-99749.herokuapp.com/playlist'

        localStorage.setItem('tv', data)

        //Background Sync (programak)
        if ( 'serviceWorker' in n && 'SyncManager' in w ) {
          function registerBGSync () {
            n.serviceWorker.ready
            .then(registration => {
              return registration.sync.register('nahieran-tv')
              .then( () => {
                c('Atzeko sinkronizazioa erregistratua')
                //Loader erakutsi
                d.querySelector('.loader-tv').classList.add('loader-show')
                d.querySelector('.loader-template-tv').classList.add('loader-show')
              })
              .catch( err => c('Errorea atzeko sinkronizazioa erregistratzean', err) )
            })
          }
          registerBGSync()

          //Background Sync (programak)
          n.serviceWorker.addEventListener('message', e => {
            c('Atzeko sinkronizazioa message bidez: ', e.data)
            if( e.data === 'online nahieran-tv' )
              fetchAllPrograms( localStorage.getItem('tv'), true, reset )
          })
        }else{
          fetchAllPrograms(data, false, reset)
        }
      }


    } //readyState
  }, 100 )//interval

  return `
    <div class="tv section">
      <div class="tv__form">
        <input type="text" id="find-programs" class="tv__input" placeholder="eitbko saioen artean bilatu..." title="Saioak bilatu">
      </div>
      <header class="section-header tv__header"></header>
      <ul class="tv__list"></ul>
      <div class="loader-template loader-template-tv">
        <div class="loader loader-tv"></div>
      </div>
    </div>
    `
}
