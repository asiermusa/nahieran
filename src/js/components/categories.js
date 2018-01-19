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

      //Beharrezko sekzioak ezkutatu
      d.querySelectorAll('.section').forEach( section => {
        section.classList.add('u-hide')
      })
      d.querySelector('.categories').classList.remove('u-hide')
      d.querySelector('.tv').classList.remove('u-hide')

      fetch('//still-castle-99749.herokuapp.com/program-type-list')
        .then( response => response.json() )
        .then(json => {

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
        .catch(err => console.log(err))

    } //readyState

  }, 100 )//interval

  return `
    <div class="categories off-canvas-menu">
      <div class="loader"></div>
      <ul class="categories__list"></ul>
    </div>
    `
}
