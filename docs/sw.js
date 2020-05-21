const CACHE_NAME = 'nahieran-cache',
  urlsToCache = [
    './',
    './?utm=homescreen',
    './index.html',
    './index.html?utm=homescreen',
    './styles.min.css',
    './bundle.js',
    './assets/icon_192x192.png',
    'https://fonts.googleapis.com/css?family=Raleway:400,400i,600,600i,700,700i,800,800i'
]

self.addEventListener('install', e => {
  //console.log('SW instalatua')
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        //console.log('Artxiboak katxean')
        return cache.addAll(urlsToCache)
        .then( () => self.skipWaiting() )
        //skipWaiting forza al SW a activarse
      })
      .catch(err => console.log('Errorea katxea erregistratzean', err) )
  )
})

self.addEventListener('activate', e => {
  //console.log('SW aktibatua')
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          //Eliminamos lo que ya no se necesita en cache
          if ( cacheWhitelist.indexOf(cacheName) === -1 )
            return caches.delete(cacheName)
        })
      )
    })
    .then(() => {
      //console.log('Katxe eguneratua')
      // Le indica al SW activar el cache actual
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', e => {
  //console.log('SW errekuperatzen')

  e.respondWith(
    //Miramos si la petición coincide con algún elemento del cache
    caches.match(e.request)
    .then(res => {
        //console.log('Katxea errekuperatzen')
        if ( res ) {
          //Si coincide lo retornamos del cache
          return res
        }
        //Sino, lo solicitamos a la red
        return fetch(e.request)
      })
    )
})

self.addEventListener('sync', e => {
  //console.log('Atzeko sinkronizazioa aktibatua', e)

  //Revisamos que la etiqueta de sincronización sea la que definimos o la que emulan las devtools
  if ( e.tag === 'nahieran-tv'
    || e.tag === 'nahieran-tv-program'
    || e.tag === 'nahieran-tv-program-episode'
    || e.tag === 'nahieran-tv-categories'
    || e.tag === 'nahieran-category'
    || e.tag === 'test-tag-from-devtools' ) {

    e.waitUntil(
      //Comprobamos todas las pestañas abiertas y les enviamos postMessage
      self.clients.matchAll()
        .then(all => {
          return all.map(client => {
            return client.postMessage('online ' + e.tag)
          })
        })
        .catch( err => console.log(err) )
    )
  }
})
