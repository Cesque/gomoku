let bot1 = process.argv[2]
let bot2 = process.argv[3]

let gomoku = new (require('./gomoku'))()

async function run() {
  await gomoku.add(bot1, 'some GUID 1', {})
  await gomoku.add(bot2, 'some GUID 2', {})
  let n = 1000
  console.time(n + ' games')
  let stores = await gomoku.playSet(n)
  console.timeEnd(n + ' games')

  let stats = gomoku.stats()


  if (stats.winner == 0) {
    console.log('Draw!')
  } else {
    console.log()
    console.log('winner: "' + stats.winnerDetails.name + '" by "' + stats.winnerDetails.author + '"')
    console.log('winrate: ' + (100 * stats.winPercentage).toFixed(2) + '%')
    console.log('wins:   ', stats.wins[stats.winner - 1])
    console.log('draws:  ', stats.draws)
    console.log('losses: ', stats.losses[stats.winner - 1])
  }  

  gomoku.dismantle()
}

run()