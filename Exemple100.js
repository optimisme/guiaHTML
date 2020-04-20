function init () {

    let cnt = 0,
        arr = [
        { 
            type: 'generic',
            parent: document.body,
            attributes: {
                id: 'tool'
            },
            style: {
                position: 'absolute',
                bottom: '0px',
                right: '0px',
                top: '0px',
                width: '250px',
                backgroundColor: 'lightgrey'
            }
        }
    ]
    
    for (cnt = 0; cnt < arr.length; cnt = cnt + 1) {
        addDiv(arr[cnt])
    }
}

function addDiv (newDiv) {
    let cnt = 0,
        key = '',
        keys = [],
        tmp = document.createElement('div')

    switch (newDiv.type) {
    case 'generic':
        keys = Object.keys(newDiv.attributes)
        for (cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            key = keys[cnt]
            tmp.setAttribute(key, newDiv.attributes[key])
        }
        keys = Object.keys(newDiv.style)
        for (cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            key = keys[cnt]
            tmp.style[key] = newDiv.style[key]
        }
        if (typeof newDiv.parent === 'string') {
            newDiv.parent.appendChild(document.getElementById(newDiv.parent))
        } else {
            newDiv.parent.appendChild(tmp)
        }   
    }
}
