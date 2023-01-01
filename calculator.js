// Adiciona simbolo de multiplicação (*) entre o fechamento e abertura de parenteses
// que não tenha nenhuma operação explicita, ex:
// entrada: 1(2)4    saida: 1*(2)*4
// entrada: 1+(2)4   saida: 1+(2)*4
String.prototype.addMultiplicationInParentheses = function () {
    const regex1 = /\d[(]/g
    const regex2 = /[)]\d/g
    return this
        .replaceAll(regex1, (match, group) => match.replace("(", "*("))
        .replaceAll(regex2, (match, group) => match.replace(")", ")*"))
}

// Adiciona simbolo de multiplicação (*) antes do simbolo de raiz quadrada
// quando o valor antes desse simbolo não tiver nenhuma operação explicita
// ex:
// entrada: 2√9     saida: 2*√9
// entrada: 2+√9    saida: 2+√9
String.prototype.addMultiplicationBeforeSquareRoot = function () {
    const regex = /[\d|)][√]/g
    return this.replaceAll(regex, (match, group) => match.replace("√", "*√"))
}

// Operação que resolve todos os parenteses aninhados, e para cada parenteses
// é feito o calculo de raiz quadrada (se houver) e assim, retornando o resultado
// com a função eval
String.prototype.solveBetweenParentheses = function () {
    const regex = /\(([^()]+)\)/g
    return this.replaceAll(regex, (match, group) => {
        group = group.solveSquareRoot()
            .resolvePercentage()
        return eval(group)
    })
}

String.prototype.solveSquareRoot = function () {
    const regexSqrt = /(√)[0-9]*/g
    return this.replaceAll(regexSqrt, (match, group) => {
        let number = Number(match.replace("√", ""))
        return Math.sqrt(number)
    })
}
// Substitui operadores aritmeticos vísíveis nos botões e display (x, ÷, π) 
// por operadores da linguagem
String.prototype.replaceArithmeticOperators = function () {
    return this
        .replaceAll('π', Math.PI)
        .replaceAll("÷", '/')
        .replaceAll("×", '*')
        .replaceAll(",", '.')
}

// Adiciona simbolo de multiplicação (*) antes ou depois do simbolo de PI
// quando não tiver nenhuma operação explicita
// ex:
// entrada: 2π      saida: 2*π
// entrada: 1+π2    saida: 1+π*2
String.prototype.addMultiplicationBeforeOrAfterPI = function () {
    const regex1 = /[\d][π]/g
    const regex2 = /[π][\d]/g
    return this
        .replaceAll(regex1, (match, group) => match.replace("π", "*π"))
        .replaceAll(regex2, (match, group) => match.replace("π", "π*"))
}

String.prototype.resolvePercentage = function () {
    const regex1 = /[-|+|\/|*|%]\d*[%]/g
    return this
        .replaceAll(regex1, (match, group) => {
            let percentage = match.split('')
            let operacao = percentage[0]
            percentage.shift()
            percentage.pop()
            let num = Number(percentage.join(''))
            if (operacao == '+') {
                num = 1 + (num / 100)
            }
            if (operacao == '-') {
                num = 1 - (num / 100)
            }
            return match.replace(match, "*" + num)
        })
}

export const solveEquation = equation => {
    equation = equation
        .addMultiplicationBeforeOrAfterPI()
        .replaceArithmeticOperators()
        .resolvePercentage()
        .addMultiplicationInParentheses()
        .addMultiplicationBeforeSquareRoot()
        .solveBetweenParentheses()
        .solveSquareRoot()
    return eval(equation)
}