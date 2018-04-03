

let bot1 = require('./' + process.argv[2])
let bot2 = require('./' + process.argv[3])

let gomoku = new (require('./gomoku'))()

gomoku.add(bot1)
gomoku.add(bot2)

let n = 1
console.time(n + ' games')
gomoku.playSet(n)
console.timeEnd(n + ' games')


let stats = gomoku.stats()

console.log(stats)