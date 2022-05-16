let historico = []

document.addEventListener('DOMContentLoaded', function () {

    if (localStorage.getItem('historico')) { // verificar se tem carrinho salvo no LocalStorage
        historico = JSON.parse(localStorage.getItem('historico'))
        
        historico.forEach(element => {
            addHistorico(element.operacao, element.resultado, true)
        })
    }

    let botoes = document.querySelectorAll('button')
    botoes.forEach(element => {
        element.addEventListener('click', function () {
            adicionarNaTela(element.value)

        })

    })
    document.querySelector('#calculadora form').addEventListener('submit', function (e) {
        e.preventDefault()
        carcular()
    })
    



})

const enviarDoHistoricoParaInput = (value, opcao) => {
    if(opcao == 'substituir')  document.querySelector('#display').value = (value)
    if(opcao == 'concatenar')  document.querySelector('#display').value += (value)
}

const mostrarErro = (mensagem = '') => {
    let divMensagem = document.querySelector('.alerts')

    if (!document.querySelector('#calculadora').classList.contains('shake')) {
        document.querySelector('#calculadora').classList.add('shake')

        setTimeout(() => {
            document.querySelector('#calculadora').classList.remove('shake')
        }, 1000);
    }


    divMensagem.textContent = mensagem

    document.querySelector('#display').addEventListener('keyup', function () {
        divMensagem.textContent = ''
    })
    document.querySelector("#display").focus()
}


const adicionarNaTela = num => {
    if (num == 'mod' || num == 'x²') return mostrarErro('Função ainda não implementada')
    if (num == 'apagar') return apagarTudo()
    if (num == 'pi') num = Math.PI
    if (num == '=') return carcular()
    if (num == 'desfazer') return desfazer()

    if (document.querySelector('.alerts').textContent != '') {
        document.querySelector('.alerts').textContent = ''
    }

    document.querySelector("#display").value += num
    document.querySelector("#display").focus()
}

const apagarTudo = () => {
    let value = document.getElementById('display').value
    if (value == '') return mostrarErro('')
    document.getElementById('display').value = ''
    document.querySelector("#display").focus()
}

const carcular = () => {
    let Display = document.getElementById('display');
    if (Display.value == '') return

    let operacao = Display.value.funcaoColchetes().toString()
    console.error('1º EQUAÇÃO ADICIONADA OS ASTERÍSTICOS: ' + operacao)
    let operacaoColchetes = operacao.calcularColchetes().toString()
    console.error('2º COLCHETES CALCULADOS')
    console.error('resultado do calculo:', operacaoColchetes)
   
    

    let operacao2 = Display.value

   

    operacao = raizQuadrada(operacaoColchetes)
    operacao = calcularPorcentagem(operacao)
  
    try {
        let result = eval(operacao)
        Display.value = result
        addHistorico(operacao2.replaceAll('**', '^'), Display.value)
    } catch (e) {
        mostrarErro('Expressão mal formada')
    }




}

const desfazer = () => {
    let Display = document.getElementById('display');
    let value = Display.value
    if (value === '') return mostrarErro()
    Display.value = value.slice(0, value.length - 1)
    Display.focus()
}
const limparHistorico = () => {
    localStorage.clear();
    historico = []
    document.querySelector('#historico').innerHTML = ''
    document.querySelector('#limparHistorico').className = 'hide'

}
const addHistorico = (operacao, resultado, syncLocalStorage) => {
    document.querySelector('#limparHistorico').className = 'show'
    if (resultado.length > 12) {
        resultado = resultado.slice(0, 11)
        resultado += '...'
    }


    let divHistorico = document.querySelector("#historico")
    let operacaoDiv = divHistorico.appendChild(criarDiv('operacao', operacao))
   
    divHistorico.appendChild(criarDiv('igual', '='))
    divHistorico.appendChild(criarDiv('resultado', resultado))

    if (!syncLocalStorage) {
        historico.push({ operacao: operacao, resultado: resultado})
        localStorage.setItem('historico', JSON.stringify(historico))
    }
    let objDiv = document.getElementById('historico')
    objDiv.scrollTop = objDiv.scrollHeight;

}

const criarDiv = (nome, valor) => {
    let a = document.createElement('div')
    a.setAttribute('class', nome)
    a.textContent = valor
    if(nome == 'operacao'){
        a.addEventListener('click', function (elemento) {
            enviarDoHistoricoParaInput(valor, 'substituir');
        });
    }
    if(nome == 'resultado'){
        a.addEventListener('click', function (elemento) {
            enviarDoHistoricoParaInput(valor, 'concatenar');
        });
    }
   
    return a
}

calcularPorcentagem = function (num) {
 
    let equacao = num
    let i = equacao.length - 1
    console.warn(equacao)
    
    do{
        if(equacao[i] == '%'){
            console.log('Encontradi % no indice', i);
            let contaPorcentagem = i-1

           do{
            if(equacao[contaPorcentagem] == '-' || equacao[contaPorcentagem] == '+' || equacao[contaPorcentagem] == '*' || equacao[contaPorcentagem] == '/'){
                let operação = equacao[contaPorcentagem]
                console.warn('Operação: '+operação+' no index: '+contaPorcentagem)
               let NumeroDaPorcentagem = equacao.slice(contaPorcentagem+1, i)
              
                let a = contaPorcentagem-1
                do{
                   
                    if(a == 0 || equacao[a] == '{' || equacao[a] == '+' || equacao[a] == '*' || equacao[a] == '/' || equacao[a] == '(' || equacao[a] == ')'){
                       
                        let NumeroAntesDaOperacao = 1
                        if(equacao[a] == '{' || equacao[a] == '+' || equacao[a] == '*' || equacao[a] == '/' || equacao[a] == '(' || equacao[a] == '√' || equacao[a] == ')'){
                            NumeroAntesDaOperacao = equacao.slice(a+1, contaPorcentagem)
                           
                        }else{
                            NumeroAntesDaOperacao = equacao.slice(a, contaPorcentagem)
                         
                        }
                        
                        console.error(NumeroAntesDaOperacao)
                        console.error(NumeroDaPorcentagem)
                        let NumeroAntesDaOperacao2 = eval(NumeroAntesDaOperacao)
                        let porcentagem = (Number(NumeroAntesDaOperacao2)-(Number(NumeroAntesDaOperacao2)*Number(NumeroDaPorcentagem))/100).toFixed(1)
                     
                        console.log(equacao)
                        let corte = NumeroAntesDaOperacao + operação + NumeroDaPorcentagem + equacao[i]
                        equacao = equacao.replaceAll(corte, eval(porcentagem))
                        console.warn('RESULTADO DA PORCENTAGEM:',equacao)
                        console.log('equacao agora:',equacao)
                       
                       console.log('FINAL:',equacao[a]+' no index '+ a)
                       a=0
                    }
                    a--
                }while(a >= 0)

                contaPorcentagem = 0 // ASIODHASIODHUIDIUASHDIUASHDUIASDH
            }else{
              
            }
            contaPorcentagem--
           }
           while(contaPorcentagem >= 0)
            
           
            
        }

        i--

    }while(i >= 0 )
    return equacao
}


String.prototype.calcularColchetes = function () {
   
    let equacao = this
    let i = 0
    do {
        // console.log(equacao[i] + '--' + i)

        if (equacao[i] === '(') {

            let a = i + 1
            do {
                if (equacao[a] == '(') {
                    a = equacao.length
                }
                if (equacao[a] == ')') {
                    // console.error('COLCHETES PARA REALIZAR: i: '+i+'  a: '+a)
                    let corte = equacao.slice(i, a + 1)
                    let resultRais = corte
                    
                    if (corte.includes('√')) {
                        
                        resultRais = raizQuadrada(corte)
                        console.warn('corte',corte)
                        console.warn('resultRais',resultRais)
                        equacao = equacao.replaceAll(corte, resultRais)
                        
                        console.warn('Colchetes calculado RAIZ **: ' + corte + ' = ' + (resultRais))
                        console.log('equacao', equacao)
                        corte = resultRais
                        
                    } 
                    if (corte.includes('%')) {
                      
                        let resultPorcentagem =  calcularPorcentagem(resultRais)
                        console.error('resultPorcentagem %% '+resultPorcentagem+' corte: '+corte)
                        equacao = equacao.replaceAll(corte, eval(resultPorcentagem))
                        
                        // console.warn('Colchetes calculado: ' + corte + ' = ' + eval(resultRais))

                    }else {
                       
                        console.warn(corte)
                        console.error('Colchetes calculado DDD: corte ' + corte + ' = ' + eval(corte))
                        equacao = equacao.replaceAll(corte, eval(corte))
                    }
                    // console.warn(`${corte} | tem raiz ${corte.includes('√')}`)
                    // console.log(`${equacao} | tem raiz ${equacao.includes('√')}`)
                    i = -1;
                    a = equacao.length
                }
                a++
            } while (a <= equacao.length - 1)
        }
        i++
    } while (i <= equacao.length - 1)

    return equacao
}

String.prototype.funcaoColchetes = function () {
    let a = this
    .replaceAll('x', '*')
    .replaceAll("×", '*')
    .replaceAll('π', Math.PI)
    .replaceAll(',', '.')
    .replaceAll(",", '.')
    .replaceAll('−', '-')
    .replaceAll('÷', '/')

    let i = 0
    let adicionadosLeft = 0

    do {
        
        if (i != 0 && a[i] == '(') {
            
            if (
                a[i-1] == '-' ||
                a[i-1] == "+" ||
                a[i-1] == "*" ||
                a[i-1] == "(" ||
                a[i-1] == "√" ||
                a[i-1]== "/"
            ) {

            }
            else {
                console.log('cheguei')
                let left = a.substring(0, i + 0).concat('*(')
                let right = a.substring(Number(i) + 1 + 0, a.length)
                console.warn('keft', left)
                console.warn(right)
                a = left + right

                console.error(left + right)
                adicionadosLeft++
            }
        }
        i++
    }
    while (i <= a.length - 1)
    i = 0
    adicionadosLeft = 0;
    console.log('##############################################')
    do {
       
        if (i + 1 < a.length && a[i] == ')') {
            console.log(i + 2 + ' | ' + Number(a.length))
            console.log(a[Number(i) + 1])

            if (
                !Number.isInteger(a[i + 1]) ||
                a[Number(i) + 1] == '−' ||
                a[Number(i) + 1] == "+" ||
                a[Number(i) + 1] == "*" ||
                a[Number(i) + 1] == "(" ||
                a[Number(i) + 1] == ")" ||
                a[Number(i) + 1] == "√" ||
                a[Number(i) + 1] == "/"
            ) {
                
             }
            else {

                console.log('cheguei', i)
                let left = a.substring(0, i + adicionadosLeft).concat(')*')
                let right = a.substring(Number(i) + 1 + adicionadosLeft, a.length)
                console.warn('keft', left)
                console.warn(right)
                a = left + right

                console.error(left + right)
            }

        }

        i++
    }
    while (i <= a.length)

    i = 0
    do {

        if (i != 0 && a[i] == '√') { 
            

            if (a[Number(i) - 1] == "+" ||
                a[Number(i) - 1] == "-" ||
                a[Number(i) - 1] == ")" ||
                a[Number(i) - 1] == "(" ||
                a[Number(i) - 1] == "*" ||
                a[Number(i) - 1] == "/"
            ) {

            }
            else {

                console.log(a[i])
                console.log('cheguei')
                let left = a.substring(0, i + 0).concat('*√')
                let right = a.substring(Number(i) + 1 + 0, a.length)
                console.warn('left', left)
                console.warn(right)
                a = left + right

                console.error(left + right)
                adicionadosLeft++
            }
        }
        i++
    }
    while (i <= a.length)





    return a
}

// 
const raizQuadrada = num => {
    let raizes = []
    let raiz2 = num
    // console.warn(num.length)
    for (let i = 0; i < num.length; i++) {

        if (num[i] == '√') {
            let temRaizNoIndex = i
            for (let a = temRaizNoIndex + 1; a <= num.length; a++) {


                if (a == num.length - 1 ||
                    //  (num[a] == '(' && num[temRaizNoIndex+1] == '(' && i != 0 )||

                    (num[a] == ')' && num[temRaizNoIndex + 1] == '(') ||
                    (num[a] == '*' && num[temRaizNoIndex + 1] != '(') ||
                    (num[a] == '/' && num[temRaizNoIndex + 1] != '(') ||
                    (num[a] == '-' && num[temRaizNoIndex + 1] != '(') ||
                    (num[a] == '+' && num[temRaizNoIndex + 1] != '(') ||
                    num[a] == '%' && num[temRaizNoIndex + 1] != '(') {



                    if (a == num.length - 1) {
                        if (num[a] == ')') {

                        } else {
                            console.log('aumetado!', num[a])
                            a++
                        }
                    }

                    let raiz = num.slice(i, a)
                    // console.log(raiz)
                    raiz2 = raiz.replace('√', '')

                    // console.warn('raiz2', raiz2)
                    // console.warn('raiz2', raiz)
                    raizes.push(raiz2)
                    // console.log(raizes)
                    a = num.length - 1

                } else {


                }

            }

        }

    }
    raizes.forEach(value => {
        // console.log(value)

        if (value[0] == '√') {
            let valor = value.replace(/^./, "")
            num = num.replaceAll(value, Math.sqrt(eval(valor)))
        }
        else {
            // console.log(num)
            num = num.replaceAll('√' + value, Math.sqrt(value))
        }


    })
    return num
}