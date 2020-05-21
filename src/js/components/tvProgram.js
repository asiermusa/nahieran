const c = console.log,
  d = document,
  n = navigator,
  w = window

export const selectProgram = () => {

  const readyState = setInterval(() => {

    if ( d.readyState  === 'complete' ) {

      clearInterval(readyState)

      //Programa ekarri (zerrenda)
      function fetchProgram(jsonData, requestFromBGSync) {

        let data = jsonData.slice(5),
          tpl = '',
          date = ''

        //Beharrezko sekzioak ezkutatu
        d.querySelectorAll('.section').forEach( section => {
          section.classList.add('u-hide')
        })

        //Loader erakutsi
        d.querySelector('.loader-program').classList.add('loader-show')
        d.querySelector('.loader-template-program').classList.add('loader-show')

        //Bideoa martxan badago ere, geratu
        if(d.querySelector(".dplayer-video")) {
          d.querySelector(".dplayer-video").pause()
        }

        fetch(data)
          .then( response => response.json() )
          .then(json => {

            if ( !requestFromBGSync ) {
  					  localStorage.removeItem('tv-program')
            }

  				  d.querySelector('.program').classList.remove('u-hide')
  				  //Loader ezkutatu
            d.querySelector('.loader-program').classList.remove('loader-show')
            d.querySelector('.loader-template-program').classList.remove('loader-show')

            json.member.forEach(json => {
              if(json.broadcast_date) {
                date = json.broadcast_date.slice(0,10)
  				  	}
              tpl += `
                <li class="custom-episode" data-episode="${json["@id"]}">
      					  <div class="program__image">
                    <img src="${json.episode_image}" class="program__img custom-episode" data-episode="${json["@id"]}">
                  </div>

                  <div class="program__content custom-episode" data-episode="${json["@id"]}">
                    ${json.title}
                  <div class="program__date">${date}</div>
                  </div>
                </li>
                `
            })

          	d.querySelector('.program__list').innerHTML = tpl
          	d.querySelector('.program__header').innerHTML = `
          		<div class="program__title">${json.name}</div>
              <div class="program__desc">${json.desc_group}</div>
              `
          })
          .catch(err => console.log(err))
		  }

      //Programa ekarri (click ebentua)
      d.getElementById("app").addEventListener('click', (e) => {

        e.preventDefault()
        if( e.target.classList.contains('program-id') ) {

  		    let data = e.target.getAttribute('data-program')
  		  	localStorage.setItem('tv-program', data)
          //Background Sync (programak)
          if ( 'serviceWorker' in n && 'SyncManager' in w ) {
  			    function registerBGSync () {
  			      n.serviceWorker.ready
  			        .then(registration => {
  			          return registration.sync.register('nahieran-tv-program')
  			            .then( () => {
                      c('Atzeko sinkronizazioa erregistratua')
                      //Loader erakutsi
                      d.querySelector('.loader-program').classList.add('loader-show')
                      d.querySelector('.loader-template-program').classList.add('loader-show')
                    })
                    .catch( err => c('Errorea atzeko sinkronizazioa erregistratzean', err) )
  			        })
  			    }
  			    registerBGSync()

  			    //Background Sync (programak)
            n.serviceWorker.addEventListener('message', e => {
      		    //console.log('Atzeko sinkronizazioa message bidez aktibatua: ', e.data)
      		    if( e.data === 'online nahieran-tv-program' )
      		    	fetchProgram( localStorage.getItem('tv-program'), true )
      		  })
  			  }else{
    			 fetchProgram( data, false)
  			  }
        }
      })

    } //readyState
  }, 100 )//interval

  return `
    <div class="loader-template loader-template-program">
  	  <div class="loader loader-program"></div>
    </div>
    <div class="program section u-hide">
  	  <header class="section-header program__header"></header>
      <ul class="program__list"></ul>
    </div>
    `
}
