let bot1 = process.argv[2]
let bot2 = process.argv[3]

let gomoku = new (require('./gomoku'))()

async function run() {
  await gomoku.add(bot1, 'some GUID 1', {})
  await gomoku.add(bot2, 'some GUID 2', {})
  let n = 100
  console.time(n + ' games')
  let stores = await gomoku.playSet(n)
  console.timeEnd(n + ' games')

  console.log(stores)
  let stats = gomoku.stats()

  console.log(stats)
  gomoku.dismantle()
}

run()