var xDown = -1,                                                     
    yDown = -1,
    touchDir = '',
    menuEstat       = 'closed'    // closed, opening, open, closing, touching
    menuTransition  = '0.5s ease',
    menuTranslation = 0

function init () {

    // Registrar la detecció d'events de dit
    document.addEventListener('touchstart', handleTouchStart, false)    
    document.addEventListener('touchmove',  handleTouchMove, false)
    document.addEventListener('touchend',   handleTouchEnd, false)
    document.addEventListener('touchcancel',handleTouchEnd, false)
}

// S'apunta la posició d'inici d'un event de dit
function handleTouchStart (evt) {
    let touch = evt.touches[0]
    touchDir = ''
    xDown = touch.clientX                                      
    yDown = touch.clientY
}

// Es gestiona un moviment de dit
async function handleTouchMove (evt) {
    let touch = evt.touches[0],
        xUp = touch.clientX,
        yUp = touch.clientY,
        xDiff = xDown - xUp,
        yDiff = yDown - yUp

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            touchDir = 'left'
        } else {
            touchDir = 'right'
        }
    } else {
        if (yDiff > 0) {
            touchDir = 'up' 
        } else { 
            touchDir = 'down'
        }                                                                 
    }
    xDown = xUp
    yDown = yUp

    if (touchDir === 'left' && menuEstat === 'open') {
        await posicionaMenu(evt, 'touching', evt.touches[0].clientX)  
    } else if (touchDir === 'right' && menuEstat === 'closed') {
        await posicionaMenu(evt, 'touching', evt.touches[0].clientX)  
    } else if (menuEstat === 'touching') {
        await posicionaMenu(evt, 'touching', evt.touches[0].clientX)
    }
}

// Es gestiona aixecar un dit
async function handleTouchEnd (evt) {
    let refBody = document.getElementsByTagName('body')[0],
        refSmall = document.getElementById('menuSmall'),
        refContainer = document.getElementById('menuContainer'),
        estilContainer = window.getComputedStyle(refContainer, ''),
        midaContainer = parseInt(estilContainer.getPropertyValue('width'))
        touchDiff = 0,
        target = ''

    // TODO: Fer que si passa la meitat obri, o si no tenqui, com a twitter o l'inferior de android
    if (touchDir === 'left' && (menuEstat === 'open' || menuEstat === 'touching')) {
        await posicionaMenu(evt, 'closing', 0)
        touchDir = ''
    } else if (touchDir === 'right' && (menuEstat === 'closed' || menuEstat === 'touching')) {
        await posicionaMenu(evt, 'opening', 0)
        touchDir = ''
    }
}

async function posicionaMenu (evt, seguentEstat, clientX) {
    let refBody = document.getElementsByTagName('body')[0],
        refSmall = document.getElementById('menuSmall'),
        refContainer = document.getElementById('menuContainer'),
        estilContainer = window.getComputedStyle(refContainer, ''),
        midaContainer = parseInt(estilContainer.getPropertyValue('width'))

    // Animar fins a mostrar-se completament
    if (seguentEstat === 'opening') {
        refBody.style.overflow = 'hidden'       // Treure scroll de la pàgina
        refSmall.style.display = 'flex'         // Mostrar la capa 'menuSmall'
                                                // Esperar que es processi el canvi de 'display' anterior
        await promiseWaitUntilPropertyValue('menuSmall', 'display', 'flex')  

                                                // Activar l'animació
        refSmall.style.transition = 'opacity ' + menuTransition
        refContainer.style.transition = 'transform ' + menuTransition  

                                                // Animar perquè es mostri
        refSmall.style.opacity = 1              // Animar la opacitat de 'menuSmall'
        refContainer.style.transform = 'translateX(0)'
        menuTranslation = 0

        await promiseTransitionEnd(refSmall)    // Esperar a que acabin les animacions

        menuEstat = 'open'
    }

    // Posicionar segons el 'touch' del dit
    if (seguentEstat === 'touching') {
        refBody.style.overflow = 'hidden'       // Treure scroll de la pàgina
        refSmall.style.display = 'flex'         // Mostrar la capa 'menuSmall'
                                                // Esperar que es processi el canvi de 'display' anterior
        await promiseWaitUntilPropertyValue('menuSmall', 'display', 'flex')  


        refSmall.style.transition = 'none'
                                                // Desactivar l'animació de la posició del menú
        refContainer.style.transition = 'none' 

        midaContainer = parseInt(estilContainer.getPropertyValue('width'))
        touchDiff = clientX - midaContainer
        if (touchDiff > 0) touchDiff = 0
                                                // Posicionar perquè es mostri (animar també la opacitat)
        refSmall.style.opacity = (touchDiff / midaContainer) + 1
        refContainer.style.transform = 'translateX(' + touchDiff + 'px)'
        menuTranslation = touchDiff

        menuEstat = 'touching'
    }

    // Animar fins a tancar-se completament
    if (seguentEstat === 'closing') {
        refBody.style.overflow = 'auto'         // Recuperar scroll de la pàgina
                                                // Activar l'animació
        refSmall.style.transition = 'opacity ' + menuTransition
        refContainer.style.transition = 'transform ' + menuTransition 

        midaContainer = parseInt(estilContainer.getPropertyValue('width'))

                                                // Animar perquè s'amagui
        refSmall.style.opacity = 0              // Animar la opacitat de 'menuSmall'
        refContainer.style.transform = 'translateX(-' + midaContainer + 'px)'
        menuTranslation = -midaContainer

        await promiseTransitionEnd(refSmall)    // Esperar a que acabin les animacions
        refSmall.style.display = 'none'         // Treure 'menuSmall' del dibuix de la pàgina per evitar problemes d'interacció
    
        menuEstat = 'closed'
    }
}

async function mostraMenu (evt) {

    if (typeof evt !== 'undefined') {
        if (evt.cancelable) evt.preventDefault()// Evitar els events de navegador
        evt.stopPropagation()                   // Evitar que es propaguin events cap a altres capes
        target = evt.target.id                  // Si es crida per event d'una capa, en guardem l'id
    }

    await posicionaMenu(evt, 'opening', 0)  
}

async function amagaMenu (evt) {

    if (typeof evt !== 'undefined') {
        if (evt.cancelable) evt.preventDefault()// Evitar els events de navegador
        evt.stopPropagation()                   // Evitar que es propaguin events cap a altres capes
        target = evt.target.id                  // Si es crida per event d'una capa, en guardem l'id
    }

    if (target === 'menuContainer' && touchDir !== 'left') {
        return                                  // Si han tocat 'menuContainer' no cal amagar el menu
    }

    await posicionaMenu(evt, 'closing', 0)  
}

function navega (evt, lloc) {
    evt.stopPropagation() // Evitar que executi 'amagaMenu' des de 'menuSmall'
    console.log('Navegar a ', lloc)
}

// Espera una estona abans de seguir amb el codi
function promiseWait (time) {
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