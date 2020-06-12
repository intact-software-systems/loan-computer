const {createLoanerWithPromise, createLoanerWithWrappedPromise} = require('./ComputeLoan')

class ComputeLoans {
    #loans

    constructor() {
        this.#loans = new Map()
    }

    computeIfAbsent(key, supplier) {
        const loan = this.#loans.get(key)
        if (loan) {
            return loan.computeIfAbsent()
        }
        else {
            const loan = createLoanerWithPromise(supplier)
            this.#loans.set(key, loan)
            return loan.computeIfAbsent()
        }
    }

    computeIfAbsentWrapPromise(key, supplier) {
        const loan = this.#loans.get(key)
        if (loan) {
            return loan.computeIfAbsent()
        }
        else {
            const loan = createLoanerWithWrappedPromise(supplier)
            this.#loans.set(key, loan)
            return loan.computeIfAbsent()
        }
    }

    read(key) {
        const loan = this.#loans.get(key)
        if (loan) {
            const dataLoan = loan.getDataLoan()
            return dataLoan && dataLoan.isValid() ? dataLoan.read() : undefined
        }
        return undefined
    }

    loanMap() {
        return this.#loans
    }
}

module.exports = {
    ComputeLoans
}