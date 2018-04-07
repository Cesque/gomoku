class BotHarness {
  constructor(botname) {
    let Bot = require(botname)
    this.bot = new Bot()
    this.board = undefined
    this.turnHistory = []
    this.matchHistory = []
    this.goal = 5
    this.size = 19

    process.stdin.on('data', data => this.recieveMessage(data))
  }

  init() {
    this.board = new Array(this.size).fill(0).map(x => new Array(this.size).fill(0))
    this.turnHistory = []
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
        this.init()  
        this.id = data.id
        this.size = data.size
        this.goal = data.goal
        this.bot.beforeSet(data.id, data.size, data.goal, data.store)
        console.log('{}')
        break
      case 'beforeMatch':
        this.init()
        this.bot.beforeMatch()
        console.log('{}')
        break
      case 'play':
        if (!data.lastTurn.start) {
          let lastTurn = data.lastTurn
          this.board[lastTurn.move.y][lastTurn.move.x] = lastTurn.player
          this.turnHistory.push(data.move)
        }
        
        let move = this.bot.play(this.board, this.turnHistory, this.matchHistory, this.size, this.goal, this.id)
        this.board[move.y][move.x] = this.id
        console.log(JSON.stringify(move))
        break
      case 'afterMatch':
        this.matchHistory.push(data.match)  
        this.bot.afterMatch() 
        console.log('{}')
        break
      case 'afterSet':
        this.matchHistory.push(data.match)  
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