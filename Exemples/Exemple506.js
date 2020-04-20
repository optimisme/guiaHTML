var engCnv = null,
    engCtx = null,
    fpsTimeNow = 0,
    fpsTimeDif = 0,
    fpsTimeOld = 0,
    direccio = 'quiet',
    tiles = null,
    carregat = false,
    frame = 0,
    tempsFrame = 6,
    x = 50
    

function init () {
    engCnv = document.getElementById('cnv')
    engCtx = engCnv.getContext('2d', { alpha: false })

    window.addEventListener('resize', () => { setSize() })
    setSize()

    jocInit()
    pagRun()
}

function pagRun () {
    fpsRunBegin()
    jocRun()
    fpsRunEnd()
    requestAnimationFrame(pagRun)
}

function jocInit() {
    document.body.addEventListener('keydown', (e) => { teclaApretada(e) })
    document.body.addEventListener('keyup',   (e) => { teclaAlliberada(e) })

    direccio = 'quiet'
    tiles = new Image()
    tiles.src = './Exemple506.png'
    tiles.onload = () => { carregat = true }
    tiles.onerror = (e) => { console.log(e) }
}

function jocRun () {
    logica()
    if (carregat === false) {
        dibuixCarregant()
    } else {
        dibuix()
    }
}

function logica () {
    let distancia = fpsGetTimeDistance(200)

    if (carregat === false) return
    if (direccio === 'dreta') {
        frame = frame + 1
        if (frame === tempsFrame * 6) {
            frame = 0
        }
        x = x + distancia
        if (x > 750) {
            x = 0
        }
    }
}

function dibuixCarregant () {
    let cnv = engCnv,
        ctx = engCtx

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, cnv.width, cnv.height)

    ctx.font = '15px Arial'
    ctx.fillStyle = 'black'
    ctx.fillText('Carregant ...', 30, 40)
}

function dibuix () {
    let cnv = engCnv,
        ctx = engCtx

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, cnv.width, cnv.height)

    if (direccio === 'quiet') {
        dibuixaTile(0, x, 50)
        ctx.fillStyle = 'black'
        ctx.fillText('Apreta la tecla cap a la dreta ...', 30, 20)
        frame = tempsFrame
    } else {
        dibuixaTile(parseInt(frame / tempsFrame), x, 50)
        ctx.fillStyle = 'black'
        ctx.fillText('Aquesta animació no té en compte els FPS ...', 30, 20)
    }
}

function dibuixaTile (tile, x, y) {
    let midaX = 200,
        midaY = 275
    engCtx.drawImage(tiles, tile * midaX, 0, midaX, midaY, x, y, midaX, midaY)  
}

function teclaApretada (e) {
    switch (e.key) {
    case 'ArrowRight':  direccio = 'dreta'; break
    }
}

function teclaAlliberada (e) {
    if (e.key === 'ArrowRight' && direccio === 'dreta')    { direccio = 'quiet' }
}

function setSize () {
    let style = window.getComputedStyle(engCnv, ''),
        width = parseInt(style.getPropertyValue('width')),
        height = parseInt(style.getPropertyValue('height'))

    // TODO: Tenir en compte mides reals

    engCnv.width = width
    engCnv.height = height
}

function fpsRunBegin () {
    
    fpsTimeNow = new Date()
    fpsTimeDif = (fpsTimeNow - fpsTimeOld) / 1000

    if (fpsTimeDif > 5) {
        fpsTimeDif = 0
    }

    fpsTimeOld = fpsTimeNow
}

function fpsRunEnd () {
    fpsTimeOld = fpsTimeNow
}

// Returns the distance per seconds depending on FPS
function fpsGetTimeDistance (value) {
    return fpsTimeDif * value
}
