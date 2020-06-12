class DataLoan {
    constructor(data, loanDurationMsecs) {
        this.data = data
        this.loanDurationMsecs = loanDurationMsecs
        this.loanStart = new Date().getTime()
    }

    read() {
        return this.data
    }

    isExpired() {
        return this.loanDurationMsecs <= 0 || new Date().getTime() - this.loanStart >= this.loanDurationMsecs
    }

    isValid() {
        return !this.isExpired()
    }
}

const ResultState = {
    None: 'None',
    Success: 'Success',
    Failure: 'Failure'
}

function createPromiseWrapperExecutor(supplier, durationMsecs) {
    return new Promise((resolve, reject) => {
        try {
            const data = supplier()
            console.log('Computed ' + data)
            data
                ? resolve(new DataLoan(data, durationMsecs))
                : reject({reason: 'Data was undefined or null'})
        } catch (e) {
            reject(e)
        }
    })
}

function createPromiseExecutor(supplier, durationMsecs) {
    return supplier()
        .then(data => new DataLoan(data, durationMsecs))
}

const HALF_HOUR = 30 * 60 * 1000

class ComputeLoan {
    #promise
    #computePromise
    #resultState
    #dataLoan

    constructor(executeSupplier) {
        this.#promise = undefined
        this.#dataLoan = new DataLoan(undefined, 0)
        this.#computePromise = async () => {
            console.log('Creating new promise')
            this.#resultState = ResultState.None
            return executeSupplier()
                .then(dataLoan => {
                    this.#resultState = ResultState.Success
                    this.#dataLoan = dataLoan
                    return dataLoan
                })
                .catch(e => {
                    this.#resultState = ResultState.Failure
                    this.#dataLoan = new DataLoan(undefined, 0)
                    return Promise.reject(e)
                })
        }
    }

    async computeIfAbsentAwait() {
        if (this.#promise) {
            try {
                const dataLoan = await this.#promise
                if (dataLoan.isValid()) {
                    return dataLoan.read()
                }
            } catch (e) {
                console.log('Failed to compute data loan. Trying again ...')
            }
        }

        try {
            if (this.#resultState !== ResultState.None) {
                this.#promise = this.#computePromise()
            }

            const dataLoan = await this.#promise
            console.log('Computed data loan')

            return dataLoan.read()
        } catch (e) {
            console.log('Failed to compute data loan ' + e)
            return Promise.reject(e)
        }
    }

    computeIfAbsent() {
        if (!this.#promise) {
            this.#promise = this.#computePromise()
        }

        return this.#promise
            .then(dataLoan => dataLoan.isValid() ? dataLoan : Promise.reject('expired'))
            .catch(e => {
                console.log('Failed to compute data loan ' + e + ' result state ' + this.#resultState)
                if (this.#resultState !== ResultState.None) {
                    console.log('Trying again .... ')
                    this.#promise = this.#computePromise()
                }
                return this.#promise
            })
            .then(dataLoan => dataLoan.read())
    }

    getDataLoan() {
        return this.#dataLoan
    }
}

module.exports = {
    ComputeLoan,
    DataLoan,
    createLoanerWithWrappedPromise: (supplier, durationMsecs = HALF_HOUR) => {
        return new ComputeLoan(() => createPromiseWrapperExecutor(supplier, durationMsecs))
    },
    createLoanerWithPromise: (supplier, durationMsecs = HALF_HOUR) => {
        return new ComputeLoan(() => createPromiseExecutor(supplier, durationMsecs))
    }
}