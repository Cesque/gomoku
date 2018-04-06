class bot {
  constructor() {
    this.name = 'find first non-empty' // replace this with the name of your bot
    this.author = 'default' // replace this with your name
  }

  // -- executes at the start of a game session --
  // perform any setup here
  // the `store` object contains any data added to it previously in the `afterSet` function
  // or added to it in the web editor
  beforeSet(id, size, goal, store) {

  }

  // -- executes at the start of a match --
  // perform any setup here
  beforeMatch() {

  }

  // -- play a round of rock/paper/scissors
  // return an object with this format: 
  // {
  //   x: x position of desired play
  //   y: y position of desired play
  // }
  play(board, turnHistory, matchHistory, size, goal, id) {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (board[y][x] == 0) return {
          x: x,
          y: y,
        }
      }
    }

    return {
      x: 0,
      y: 0,
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