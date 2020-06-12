const axios = require('axios')
const {ComputeLoans} = require('../ComputeLoans')

const keyOne = '1'
const keyTwo = '2'
const keyThree = '3'

const loans = new ComputeLoans()
loans.computeIfAbsent(keyOne, () => axios.get('https://api.chucknorris.io/jokes/random')).then(result => console.log(JSON.stringify(result.data)))
loans.computeIfAbsent(keyOne, () => axios.get('https://api.chucknorris.io/jokes/random')).then(result => console.log(JSON.stringify(result.data)))
loans.computeIfAbsent(keyTwo, () => axios.get('https://api.chucknorris.io/jokes/random')).then(result => console.log(JSON.stringify(result.data)))
loans.computeIfAbsent(keyTwo, () => axios.get('https://api.chucknorris.io/jokes/random')).then(result => console.log(JSON.stringify(result.data)))
loans.computeIfAbsent(keyThree, () => axios.get('https://api.chucknorris.io/jokes/random')).then(result => console.log(JSON.stringify(result.data)))
loans.computeIfAbsent(keyThree, () => axios.get('https://api.chucknorris.io/jokes/random')).then(result => console.log(JSON.stringify(result.data)))



