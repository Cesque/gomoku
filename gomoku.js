let fs = require('fs')
let VM = require('vm2').NodeVM

class Gomoku {
  constructor() {
    this.size = 5
    this.init()
    this.matchHistory = []
    this.goal = 5
    this.players = [];
  }

  init() {
    this.board = new Array(this.size).fill(0).map(x => new Array(this.size).fill(0))
    this.currentPlayer = 0
    this.turnHistory = []
  }

  add(player) {
    if (this.players.length >= 2) throw 'too many players!'
    //this.players.push(player)

    let vm = new VM({
      timeout: 1000,
      sandbox: {
        bot: player,
        player: {}
      },
      wrapper: 'none',
    })

    vm.run(`player = new bot()`)

    this.players.push(vm)
  }

  playSet(n) {
    this.matchHistory = []
    let starting = 0

    let store = JSON.parse(fs.readFileSync('./store/store.json', 'UTF-8'))
    this.players.forEach(player => {
      let hash = player.name + ' (' + player.author + ')'
      let data = store[hash]
      if (data == undefined || (typeof data != 'Object') || Array.isArray(data)) data = {}

      console.log(player.run('return player'))//.beforeSet(store)
    })

    for (let i = 0; i < n; i++) {
      var matchResult = this.playMatch(starting)
      this.matchHistory.push(matchResult)
      starting++
      starting %= this.players.length
    }

    this.players.forEach(player => {
      let hash = player.name + ' (' + player.author + ')'
      let data = player.run(`return player`).afterSet()
      if (data == undefined || (typeof data != 'Object') || Array.isArray(data)) data = {}

      store[hash] = data
    })

    fs.writeFileSync('./store/store.json', JSON.stringify(store, null, 2), 'UTF-8')
  }

  playMatch(startingPlayer) {
    this.init()
    this.currentPlayer = startingPlayer
    while (true) {
      this.turn()

      let result = this.check()
      if (result != null) return {
        winner: result,
        turns: this.turnHistory.slice(),
        board: this.board.slice()
      }

      if (this.board.every(column => column.every(val => val != 0))) {
        // game over, its a draw
        return {
          winner: -1,
          turns: this.turnHistory.slice(),
          board: this.board.slice()
        }
      }

      this.currentPlayer++
      this.currentPlayer %= this.players.length
    }
  }

  turn() {
    let move = this.players[this.currentPlayer].run(`return player`).play(
      this.board.slice(),
      this.turnHistory.slice(),
      this.matchHistory.slice(),
      this.size,
      this.goal
    )

    if (move.hasOwnProperty('x') && Number.isInteger(move.x)
      && move.hasOwnProperty('y') && Number.isInteger(move.y)
      && move.x >= 0 && move.x < this.size
      && move.y >= 0 && move.y < this.size
      && this.board[move.y][move.x] == 0) {
      let moveObj = {
        player: this.currentPlayer + 1,
        move: move
      }

      this.turnHistory.push(moveObj)
      this.board[move.y][move.x] = this.currentPlayer + 1

      //log(this.board.map(x => x.join(' ')).join('\n'))

    } else {
      //invalid move
      let moveObj = {
        player: this.currentPlayer + 1,
        move: null,
        message: 'invalid move!'
      }

      console.log(move)
      console.log('invalid move made by player ' + (this.currentPlayer + 1))
      console.log()
      this.turnHistory.push(moveObj)
    }
  }

  check() {
    let check2 = (x, y, dx, dy) => {
      if (x + (this.goal * dx) > this.size) return false
      if (y + (this.goal * dy) > this.size) return false
      let piece = this.board[y][x]
      if (piece > 0) {
        let found = false
        for (let i = 0; i < this.goal; i++) {
          let next = this.board[y + (dy * i)][x + (dx * i)]
          if (next != piece) return false
          found = true
        }
        if (found) return true
      }
      return false
    }

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x <= this.size; x++) {
        if (check2(x, y, 1, 0)) return this.board[y][x]
        if (check2(x, y, 0, 1)) return this.board[y][x]
        if (check2(x, y, 1, 1)) return this.board[y][x]
      }
    }

    return null
  }

  stats() {
    let wins = this.players.map((player, index) => this.matchHistory.filter(match => match.winner == index + 1).length)
    let draws = this.matchHistory.filter(match => match.winner == -1).length
    let maxWins = Math.max(...wins)
    let winner = wins.findIndex(x => x == maxWins)
    /*for (let i = 0; i < this.matchHistory.length; i++) {
      if (wins[i] > maxWins) {
        maxWins = wins[i]
        winner = i
      }
    }*/

    if (wins[0] == wins[1]) {
      winner = -1
    }

    let winnerDetails = winner == -1 ? {} : {
      name: this.players[winner].run(`return player`).name,
      author: this.players[winner].run(`return player`).author,
    }

    let winPercentage = (maxWins / (this.matchHistory.length - draws)).toFixed(3)
    winPercentage -= (winPercentage % 0.001)

    return {
      wins: wins,
      draws: draws,
      winner: winner + 1,
      winPercentage: winPercentage,
      winnerDetails: winnerDetails,
    }
  }
}

module.exports = Gomoku