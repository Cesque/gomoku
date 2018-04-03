class RandomBot {
  constructor() {
    this.name = 'random bot',
    this.author = 'default'  
  }

  // -- executes at the start of a game session --
  // perform any setup here
  // the `store` object contains any data added to it previously in the `afterSet` function
  // or added to it in the web editor
  beforeSet(store) {
    
  }
    
  // -- executes at the start of a match --
  // perform any setup here
  beforeMatch() {
    
  }

  // -- executes at the start of a game session --
  // perform any setup here
  beforeSet() {

  }

  // -- executes at the start of a match --
  // perform any setup here
  beforeMatch() {

  }

  play(board, turnHistory, matchHistory, size, goal) {
    if (turnHistory.length == 0) {
      return {
        x: Math.floor(size/2),
        y: Math.floor(size/2),
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

module.exports = RandomBot