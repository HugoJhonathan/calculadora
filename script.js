import './calculator.js'
import { solveEquation } from './calculator.js'

let historic = []

const display = document.querySelector('#display')
const buttons = document.querySelectorAll('button')
const calculadoraForm = document.querySelector('#calculadora form')
const btnClearHistoric = document.querySelector('#limparHistorico')
const historicArea = document.querySelector("#historico")

window.addEventListener('DOMContentLoaded', e => {
    display.disabled = isMobile()
    focusInDisplay()
    buttons.forEach(element => {
        element.addEventListener('click', function () {
            addOnScreen(element.value)
        })
    })
    calculadoraForm.addEventListener('submit', function (e) {
        e.preventDefault()
        handleCalculate()
    })
    btnClearHistoric.onclick = handleClearHistoric
})


const addToHistoric = (equation, result, syncLocalStorageBoolean) => {

    btnClearHistoric.className = 'show'

    if (result.length > 12) {
        result = result.slice(0, 11)
        result += '...'
    }

    historicArea.append(createHistoricRow(equation, result))

    historicArea.scrollTop = historicArea.scrollHeight

    if (!syncLocalStorageBoolean) {
        historic.push({ operacao: equation, resultado: result })
        localStorage.setItem('linux_calc', JSON.stringify(historic))
    }

}

const createHistoricRow = (_operation, _result) => {
    let row = document.createElement('div')
    let operation = document.createElement('div')
    operation.setAttribute('class', 'operacao')
    operation.textContent = _operation
    operation.onclick = () => display.value = _operation

    let equal = document.createElement('div')
    equal.setAttribute('class', 'igual')
    equal.textContent = "="

    let result = document.createElement('div')
    result.setAttribute('class', 'resultado')
    result.textContent = _result
    result.onclick = () => display.value += _result

    row.append(operation, equal, result)

    return row
}

if (localStorage.getItem('linux_calc')) {
    historic = JSON.parse(localStorage.getItem('linux_calc'))

    historic.forEach(element => {
        addToHistoric(element.operacao, element.resultado, true)
    })
}

const showError = (mensagem = '') => {

    let divMensagem = document.querySelector('.alerts')
    let calculadora = document.querySelector('#calculadora')


    calculadora.classList.add('shake')

    setTimeout(() => {
        calculadora.classList.remove('shake')
    }, 1000)

    divMensagem.textContent = mensagem

    display.addEventListener('keyup', function (e) {
        if (e.key != 'Enter') {
            divMensagem.textContent = ''
        }
    })
    focusInDisplay()
}
const addOnScreen = num => {
    if (num == 'mod' || num == 'x²') return showError('Função ainda não implementada!')
    if (num == 'clear') return handleClearDisplay()
    if (num == '=') return handleCalculate()
    if (num == 'undo') return handleUndo()

    document.querySelector('.alerts').textContent = ''
    focusInDisplay()
    display.value += num

}
const focusInDisplay = () => {
    if (!isMobile()) {
        display.focus()
    }
}
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

const handleClearDisplay = () => {
    if (display.value.trim() == '') return showError()
    display.value = ''
    focusInDisplay()
}
const handleCalculate = () => {
    let equation = display.value

    if (equation.trim() == '') return

    try {
        display.value = solveEquation(equation)
        addToHistoric(equation, display.value)
    } catch (e) {
        console.error(e)
        showError('Expressão mal formada')
    }

}
const handleUndo = () => {
    if (display.value === '') return showError()
    display.value = display.value.slice(0, display.value.length - 1)
    focusInDisplay()
}
const handleClearHistoric = () => {
    localStorage.clear()
    historic = []
    historicArea.innerHTML = ''
}