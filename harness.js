class BotHarness {
  constructor(botname) {
    let Bot = require('./' + botname)
    this.bot = new Bot()

    process.stdin.on('data', data => this.recieveMessage(data))
  }

  recieveMessage(data) {
    data = JSON.parse(data)
    switch (data.type) {
      case 'getInfo':
        let obj = JSON.stringify({
          name: this.bot.name,
          author: this.bot.author
        })
        console.log(obj)
        break
      case 'beforeSet':
        this.bot.beforeSet(data.store)
        console.log('{}')
        break
      case 'beforeMatch':
        this.bog.beforeMatch()
        console.log('{}')
        break
      case 'play':
        let move = this.bot.play(data.board, data.turnHistory, data.matchHistory, data.size, data.goal)
        console.log(JSON.stringify(move))
        break
      case 'afterMatch':
        this.bot.afterMatch() 
        console.log('{}')
        break
      case 'afterSet':
        let store = this.bot.afterSet()  
        console.log(JSON.stringify(store))
        break
      default:
        throw 'unrecognised message type' + data.type
    }
  }
}

let harness = new BotHarness(process.argv[2])

// keep alive
require('net').createServer().listen()