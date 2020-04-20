var menuTransition = '0.5s ease'

async function mostraMenu (evt) {
    let refBody = document.getElementsByTagName('body')[0],
        refSmall = document.getElementById('menuSmall'),
        refContainer = document.getElementById('menuContainer'),
        estilContainer = window.getComputedStyle(refContainer, ''),
        midaContainer = 0

    if (typeof evt !== 'undefined') {
        if (evt.cancelable) evt.preventDefault()// Evitar els events de navegador
        evt.stopPropagation()                   // Evitar que es propaguin events cap a altres capes
        target = evt.target.id                  // Si es crida per event d'una capa, en guardem l'id
    }
        
    refBody.style.overflow = 'hidden'   // Treure scroll de la pàgina
    refSmall.style.display = 'flex'     // Mostrar la capa 'menuSmall'
                                        // Esperar que es processi el canvi de 'display' anterior
    await promiseWaitUntilPropertyValue('menuSmall', 'display', 'flex')  

                                        // Activar l'animació
    refSmall.style.transition = 'opacity ' + menuTransition
    refContainer.style.transition = 'transform ' + menuTransition  

                                        // Animar perquè es mostri
    refSmall.style.opacity = 1          // Animar la opacitat de 'menuSmall'
    midaContainer = parseInt(estilContainer.getPropertyValue('height'), 10)
    refContainer.style.transform =  'translateY(-' + midaContainer + 'px)'

    await promiseTransitionEnd(refSmall)// Esperar a que acabin les animacions
}
async function amagaMenu (evt) {
    let refBody = document.getElementsByTagName('body')[0],
        refSmall = document.getElementById('menuSmall'),
        refContainer = document.getElementById('menuContainer')
   
    if (typeof evt !== 'undefined') {
        if (evt.cancelable) evt.preventDefault()// Evitar els events de navegador
        evt.stopPropagation()                   // Evitar que es propaguin events cap a altres capes
        target = evt.target.id                  // Si es crida per event d'una capa, en guardem l'id
    }
    
    if (target === 'menuSmall') {
        refBody.style.overflow = 'auto'     // Recuperar scroll de la pàgina
                                                // Activar l'animació
        refSmall.style.transition = 'opacity ' + menuTransition
        refContainer.style.transition = 'transform ' + menuTransition 
                                            // Animar perquè s'amagui
        refSmall.style.opacity = 0          // Animar la opacitat de 'menuSmall'
        refContainer.style.transform = 'translateY(0)'

        await promiseTransitionEnd(refSmall)// Esperar a que acabin les animacions
        refSmall.style.display = 'none'     // Treure 'menuSmall' del dibuix de la pàgina per evitar problemes d'interacció
    }
}
function navega (evt, lloc) {
    evt.stopPropagation() // Evitar que executi 'amagaMenu' des de 'menuSmall'
    //location.href = lloc
    console.log('Navegar a ', lloc)
}

// Espera una estona abans de seguir amb el codi
async function promiseWait (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, time)
    })
}

function promiseWaitUntilPropertyValue (divId, property, value) {
    return new Promise(async (resolve, reject) => {
        let ref = document.getElementById(divId),
            style = window.getComputedStyle(ref),
            now = style.getPropertyValue(property)
        if (now === value) {
            resolve()
        } else {
            await promiseWait(1)
            await promiseWaitUntilPropertyValue(divId, property, value)
        }
    }) 
}

function promiseTransitionEnd (ref) {
    return new Promise(async (resolve, reject) => {
        ref.addEventListener('transitionend', () => {
            resolve()
        })
    })  
}