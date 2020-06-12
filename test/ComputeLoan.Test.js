const {createLoanerWithWrappedPromise} = require('../ComputeLoan')
const {ComputeLoan} = require('../ComputeLoan')

let cnt = 0
let successCnt = 0

function computeError() {
    console.log('Computed error ' + ++cnt)
    throw 'error'
}

function computeSuccess() {
    const cnt = ++successCnt
    console.log('Computed success ' + cnt)

    if (cnt > 1) {
        console.log('This should not happen!!!')
    }
    return 'success ' + cnt
}

const computeRandom = () => Math.random() > 0.49 ? computeSuccess() : computeError()

const loan = createLoanerWithWrappedPromise(computeRandom)


loan.computeIfAbsent().then(data => console.log('Success: ' + data)).catch(e => console.log('Error: ' + e))
loan.computeIfAbsent().then(data => console.log('Success: ' + data)).catch(e => console.log('Error: ' + e))
loan.computeIfAbsent().then(data => console.log('Success: ' + data)).catch(e => console.log('Error: ' + e))
loan.computeIfAbsent().then(data => console.log('Success: ' + data)).catch(e => console.log('Error: ' + e))
loan.computeIfAbsent().then(data => console.log('Success: ' + data)).catch(e => console.log('Error: ' + e))
loan.computeIfAbsent().then(data => console.log('Success: ' + data)).catch(e => console.log('Error: ' + e))
