var engCnv = null,
    engCtx = null,
    fpsTimeNow = 0,
    fpsTimeDif = 0,
    fpsTimeOld = 0,
    carregat = false,
    taulell = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    direccio = 'quiet',
    fitxaActual = 4,
    fitxaSeguent = 0,
    fitxaX = 0,
    fitxaY = 0,
    rotacio = 1,
    tempsAvall = 0,
    tempsTecla = 0,
    tempsLimit = 1,
    level = 0,
    fitxes = [
        [
            [
                [1],
                [1],
                [1],
                [1]
            ],
            [
                [1, 1, 1, 1],
            ]
        ],
        [
            [
                [1, 0],
                [1, 1],
                [0, 1]
            ],
            [
                [0, 1, 1],
                [1, 1, 0]
            ]
        ],
        [
            [
                [0, 1],
                [1, 1],
                [1, 0]
            ],
            [
                [1, 1, 0],
                [0, 1, 1]
            ]
        ],
        [
            [
                [1, 0],
                [1, 1],
                [1, 0]
            ],
            [
                [1, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 1],
                [1, 1],
                [0, 1]
            ],
            [
                [0, 1, 0],
                [1, 1, 1]
            ]
        ],
        [
            [
                [1, 1],
                [1, 0],
                [1, 0]
            ],
            [
                [1, 1, 1],
                [0, 0, 1]
            ],
            [
                [0, 1],
                [0, 1],
                [1, 1]
            ],
            [
                [1, 0, 0],
                [1, 1, 1]
            ]
        ],
        [
            [
                [1, 1],
                [0, 1],
                [0, 1]
            ],
            [
                [0, 0, 1],
                [1, 1, 1]
            ],
            [
                [1, 0],
                [1, 0],
                [1, 1]
            ],
            [
                [1, 1, 1],
                [1, 0, 0]
            ]
        ],
        [
            [1, 1],
            [1, 1]
        ],
    ]

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

    // TODO: Si es carrega algo, no posar 'carregat = true' fins que estigui tot llest
    carregat = true
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

    time = time + fpsTimeDif

    if (time > tempsLimit) {
        time = 0

        if (direccio === 'dreta') {
            
        }

        fitxaY++
    }

    if (level <= 10) tempsLimit = 1 / (level + 1)
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
        ctx = engCtx,
        x = 0,
        y = 0,
        tile = 32,
        fitxa = null

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, cnv.width, cnv.height)

    // Dibuixa el taullell
    for (y = 0; y < taulell.length; y = y + 1) {
        for (x = 0; x < taulell[y].length; x = x + 1) {
            dibuixaQuadre(ctx, taulell[y][x], x, y, tile)
        }
    }

    // Dibuixa la fitxa actual
    fitxa = fitxes[fitxaActual][rotacio]
    for (y = 0; y < fitxa.length; y = y + 1) {
        for (x = 0; x < fitxa[y].length; x = x + 1) {
            if (fitxa[y][x] === 1) {
                // TODO: falta la rotació
                dibuixaQuadre(ctx, fitxaActual + 1, fitxaX + x, fitxaY + y, tile)
            }
        }
    }
}

function dibuixaQuadre (ctx, valor, x, y, tile) {
    switch (valor) {
    case 0:
        ctx.fillStyle = 'lightgrey'
        ctx.fillRect(x * tile, y * tile, tile, tile)
        break;
    case 1:
        ctx.fillStyle = 'orange'
        ctx.fillRect(x * tile, y * tile, tile, tile)
        break;
    case 2:
        ctx.fillStyle = 'green'
        ctx.fillRect(x * tile, y * tile, tile, tile)
        break;
    case 3:
        ctx.fillStyle = 'darkgreen'
        ctx.fillRect(x * tile, y * tile, tile, tile)
        break;
    case 4:
        ctx.fillStyle = 'blue'
        ctx.fillRect(x * tile, y * tile, tile, tile)
        break;
    case 5:
        ctx.fillStyle = 'purple'
        ctx.fillRect(x * tile, y * tile, tile, tile)
        break;
    case 6:
        ctx.fillStyle = 'brown'
        ctx.fillRect(x * tile, y * tile, tile, tile)
        break;
    case 7:
        ctx.fillStyle = 'red'
        ctx.fillRect(x * tile, y * tile, tile, tile)
        break;
    }
}

function teclaApretada (e) {
    if (e.key === 'ArrowRight' && direccio !== 'avall') direccio = 'dreta'
    if (e.key === 'ArrowLeft'  && direccio !== 'avall') direccio = 'esquerra'
    if (e.key === 'ArrowDown'  && direccio !== 'avall') direccio = 'avall'
    if (e.key === 'ArrowUp') rotacio = (rotacio + 1) % 4
}

function teclaAlliberada (e) {
    if (e.key  === 'ArrowRight' && direccio === 'dreta')     { direccio = 'quiet' }
    if (e.key  === 'ArrowLeft'  && direccio === 'esquerra')  { direccio = 'quiet' }
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
