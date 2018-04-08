let fs = require('fs')

class bot {
  constructor() {
    this.name = 'blocker bot' // replace this with the name of your bot
    this.author = 'default' // replace this with your name
    if(fs.existsSync('./log.txt')) fs.unlinkSync('./log.txt')

    this.size = 0
    this.goal = 0

    this.cursor = {
      x: 10,
      y: 10,
    }

    this.direction = {
      x: 1,
      y: 0
    }
  }

  log(s) {
    fs.appendFileSync('./log.txt', JSON.stringify(s) + '\n', 'utf8')
  }

  // -- executes at the start of a game session --
  // perform any setup here
  // the `store` object contains any data added to it previously in the `afterSet` function
  // or added to it in the web editor
  beforeSet(id, size, goal, store) {
    this.size = size
    this.goal = goal
  }

  // -- executes at the start of a match --
  // perform any setup here
  beforeMatch() {
    this.cursor.x = Math.floor(this.size / 2)
    this.cursor.y = Math.floor(this.size / 2)

    this.direction = this.getRandomDirection()
  }

  // -- play a round of rock/paper/scissors
  // return an object with this format: 
  // {
  //   x: x position of desired play
  //   y: y position of desired play
  // }
  play(board, turnHistory, matchHistory, size, goal, id) {
    if (turnHistory.length == 0) return this.playRandom(board, turnHistory, matchHistory, size, goal, id)

    let lastTurn = turnHistory[turnHistory.length - 1]
    let blocking = this.getBlockingSpace(board, size, lastTurn)

    if (blocking == undefined || this.get(board, size, blocking.x, blocking.y) != 0) return this.playRandom(board, turnHistory, matchHistory, size, goal, id)
    
    return blocking
  }


  getBlockingSpace(board, size, enemyTurn) {
    let enemyID = enemyTurn.player

    let above = this.get(board, size, enemyTurn.move.x, enemyTurn.move.y - 1)
    let below = this.get(board, size, enemyTurn.move.x, enemyTurn.move.y + 1)
    let left = this.get(board, size, enemyTurn.move.x - 1, enemyTurn.move.y)
    let right = this.get(board, size, enemyTurn.move.x + 1, enemyTurn.move.y)

    if (above == enemyID) return { x: enemyTurn.move.x, y: enemyTurn.move.y - 2 }
    if (below == enemyID) return { x: enemyTurn.move.x, y: enemyTurn.move.y + 2 }
    if (left == enemyID) return { x: enemyTurn.move.x - 2, y: enemyTurn.move.y }
    if (right == enemyID) return { x: enemyTurn.move.x + 2, y: enemyTurn.move.y }

    return undefined
  }

  get(board, size, x, y) {
    if (x < 0 || x >= size || y < 0 || y >= size) {
      return -1
    }

    return board[y][x]
  }

  playRandom(board, turnHistory, matchHistory, size, goal, id) {
    if (turnHistory.length == 0) {
      return {
        x: Math.floor(size / 2),
        y: Math.floor(size / 2),
      }
    }

    let emptySpaces = []
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (board[y][x] == 0) {
          emptySpaces.push({
            x: x,
            y: y,
          })
        }
      }
    }
    let space = emptySpaces[Math.floor(Math.random() * emptySpaces.length)]

    return {
      x: space.x,
      y: space.y,
    }
  }

  getRandomDirection() {
    let horizontal = Math.random() > 0.5
    let direction = Math.random() > 0.5 ? -1 : 1
    return {
      x: horizontal ? direction : 0,
      y: horizontal ? 0 : direction,
    }
  }

  // -- executes after every match --
  // you can perform adjustments to strategy here
  afterMatch() {

  }

  // -- executes at the end of a game session --
  // whatever object you return here will be saved by the game for access later
  afterSet() {
    return {}
  }
}

module.exports = bot