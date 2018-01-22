const c = console.log,
  d = document,
  n = navigator,
  w = window

export const categoriesSingle = () => {

  const readyState = setInterval(() => {

    if ( d.readyState  === 'complete' ) {

      clearInterval(readyState)

      //Kategoria zerrenda ekarri
  	  function fetchCategory(jsonData, requestFromBGSync, catName) {

		  	let data = jsonData.slice(5),
		  	  tpl = ''

        d.querySelector('.off-canvas-menu').classList.remove('is-open')
        d.querySelector('.nav-icon').classList.remove('is-active')
        //Loader erakutsi
        d.querySelector('.loader-cat').classList.add('loader-show')
        d.querySelector('.loader-template-cat').classList.add('loader-show')
        //Beharrezko sekzioak ezkutatu
        d.querySelectorAll('.section').forEach( section => {
          section.classList.add('u-hide')
        })
        
        //Bideoa martxan badago ere, geratu
        if(d.querySelector(".dplayer-video")) {
          d.querySelector(".dplayer-video").pause()
        }

        fetch(data)
          .then( response => response.json() )
          .then(json => {

            if ( !requestFromBGSync ) {
              localStorage.removeItem('category')
      			}

            //Loader ezkutatu
            d.querySelector('.loader-cat').classList.remove('loader-show')
            d.querySelector('.loader-template-cat').classList.remove('loader-show')

            d.querySelector('.single-cat').classList.remove('u-hide')

        		json.member.forEach(jsonCat => {
              tpl += `
                <li>
                  <a href="#" class="program-id" data-program="${jsonCat["@id"]}">
                    ${jsonCat.title}
                    </a>
                  </li>
                  `
            })

            d.querySelector('.single-cat__list').innerHTML = tpl
            d.querySelector('.single-cat__header').innerHTML = `
              <div class="tv__title">${catName}</div>
              <span class="tv__number">(${json.member.length})</span> saio erakusten
              `
          })
          .catch(err => console.log(err))

      } //fetchCategory

      d.querySelector('.categories__list').addEventListener('click', (e) => {

        e.preventDefault()

        if( e.target.classList.contains('category-id') ) {
          var catName = e.target.innerHTML
          let data = e.target.getAttribute('data-category')

          localStorage.setItem('category', data)
          localStorage.setItem('category-name', catName)

          fetchCategory(data, false, catName)

          //Background Sync (kategoria)
          if ( 'serviceWorker' in n && 'SyncManager' in w ) {
            function registerBGSync () {
              n.serviceWorker.ready
              .then(registration => {
                return registration.sync.register('nahieran-category')
                .then( () => c('Atzeko sinkronizazioa erregistratua') )
                .catch( err => c('Errorea atzeko sinkronizazioa erregistratzean', err) )
              })
            }
            registerBGSync()
          }
        }
      })
      //Background Sync (kategoria)
      n.serviceWorker.addEventListener('message', e => {
		    console.log('Atzeko sinkronizazioa message bidez aktibatua: ', e.data)
		    if( e.data === 'online nahieran-category')
		    	fetchCategory(localStorage.getItem('category'), true, localStorage.getItem('category-name'))
		  })

    } //readyState

  }, 100 ) //interval

  return `
    <div class="loader-template loader-template-cat">
    	<div class="loader loader-cat"></div>
    </div>
    <div class="single-cat section u-hide">
      <header class="section-header tv__header single-cat__header"></header>
      <ul class="tv__list single-cat__list"></ul>
    </div>
    `
}
