const c = console.log,
  d = document,
  n = navigator,
  w = window

export const categories = () => {

  const readyState = setInterval(() => {

    if ( d.readyState  === 'complete' ) {

      clearInterval(readyState)

      let tpl = ''

      //Nabigazio botoia
      d.getElementById("categories-btn").addEventListener('click', (e) => {
        d.querySelector('.off-canvas-menu').classList.toggle('is-open')

        //Kategorian ikonoa (menu off-canvas)
        if( d.querySelector('.nav-icon').classList.contains("is-active")){
          d.querySelector('.nav-icon').classList.remove('is-active')
        }else {
          d.querySelector('.nav-icon').classList.add('is-active')
        }
      })
      //scape tekla bidez itxi menua
      d.addEventListener('keyup', (e) => {
        if (e.keyCode == 27) {
          d.querySelector('.off-canvas-menu').classList.remove('is-open')
          d.querySelector('.nav-icon').classList.remove('is-active')
        }
      })

      //Kategoriak ekarri
      function fetchAllCategories(data, requestFromBGSync) {
        //Beharrezko sekzioak ezkutatu
        d.querySelectorAll('.section').forEach( section => {
          section.classList.add('u-hide')
        })
        d.querySelector('.categories').classList.remove('u-hide')
        d.querySelector('.tv').classList.remove('u-hide')

        fetch(data)
          .then( response => response.json() )
          .then(json => {

            if ( !requestFromBGSync ) {
              localStorage.removeItem('category-list')
            }

            localStorage.setItem('localJsonCategories', JSON.stringify(json));

            json.member.forEach(jsonCat => {
              tpl += `
              <li>
                <a href="#" class="category-id" data-category="${jsonCat["@id"]}">
                	${jsonCat.title}
                </a>
              </li>
              `
            })

            d.querySelector('.categories__list').innerHTML = tpl
          })
          .catch(err =>
            localStorage.setItem('category-list', data)
          )
      }

      //Aplikaziora sartzen denean egin beharrekoa
      let data = '//still-castle-99749.herokuapp.com/program-type-list'
        
      localStorage.setItem('category-list', data)

      //Background Sync (programak)
      if ( 'serviceWorker' in n && 'SyncManager' in w ) {
        function registerBGSync () {
          n.serviceWorker.ready
          .then(registration => {
            return registration.sync.register('nahieran-tv-categories')
              .then( () => {
                c('Atzeko sinkronizazioa erregistratua')
              })
              .catch( err => c('Errorea atzeko sinkronizazioa erregistratzean', err) )
          })
        }
        registerBGSync()
        
        //Background Sync (programak)
        n.serviceWorker.addEventListener('message', e => {
          c('Atzeko sinkronizazioa message bidez: ', e.data)
          if( e.data === 'online nahieran-tv-categories' )
            fetchAllCategories( localStorage.getItem('category-list'), true)
        })
      }else{
        fetchAllCategories(data, false)
      }

    } //readyState

  }, 100 )//interval

  return `
    <div class="categories off-canvas-menu">
      <div class="loader"></div>
      <ul class="categories__list"></ul>
    </div>
    `
}
