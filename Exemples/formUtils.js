function getInputTextValue (id) {
    return document.getElementById(id).value
}

function setInputTextValue (id, value) {
    document.getElementById(id).value = value
}

function getInputTextareaValue (id) {
    return document.getElementById(id).value
}

function setInputTextareaValue (id, value) {
    document.getElementById(id).value = value
}

function getInputRadioValue (name) {
    let radios = document.getElementsByName(name)
    let cnt = 0
    for (cnt = 0; cnt < radios.length; cnt = cnt + 1) {
        if (radios[cnt].checked) {
            return radios[cnt].value
        }
    }
}

function setInputRadioValue (name, value) {
    let radios = document.getElementsByName(name)
    let cnt = 0
    for (cnt = 0; cnt < radios.length; cnt = cnt + 1) {
        if (radios[cnt].value === value) radios[cnt].checked = true
    }
}

function getInputCheckboxValues (name) {
    let checks = document.getElementsByName(name)
    let cnt = 0
    let rst = {}
    for (cnt = 0; cnt < checks.length; cnt = cnt + 1) {
        rst[checks[cnt].value] = checks[cnt].checked
    } 
    return rst
}

function getInputCheckboxValue (name, value) {
    let checks = document.getElementsByName(name)
    let cnt = 0
    for (cnt = 0; cnt < checks.length; cnt = cnt + 1) {
        if (checks[cnt].value === value) return checks[cnt].checked
    }
}

function setInputCheckboxValue (name, value, checked) {
    let checks = document.getElementsByName(name)
    let cnt = 0
    for (cnt = 0; cnt < checks.length; cnt = cnt + 1) {
        if (checks[cnt].value === value) checks[cnt].checked = true
    }
}

function getInputSelectValue (id) {
    let options = document.getElementById(id).querySelectorAll('option')
    let cnt = 0
    for (cnt = 0; cnt < options.length; cnt = cnt + 1) {
        if (options[cnt].selected) {
            return options[cnt].value
        }
    }
}

function setInputSelectValue (id, value) {
    let options = document.getElementById(id).querySelectorAll('option')
    let cnt = 0
    for (cnt = 0; cnt < options.length; cnt = cnt + 1) {
        if (options[cnt].value === value) options[cnt].selected = true
    }
}

function mdlCleanUp () {
    let mdlInputs = document.querySelectorAll('.mdl-js-textfield')
    let cnt = 0
    for (cnt = 0; cnt < mdlInputs.length; cnt = cnt + 1) {
        mdlInputs[cnt].MaterialTextfield.checkDirty()
    }
}