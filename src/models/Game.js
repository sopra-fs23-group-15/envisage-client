/**
 * Game model
 */
class Game {
    constructor(data = {}) {
      this.id = null;
      this.rounds = null;
      this.playerScores = null;
      this.lobby = null;
      this.status = READY;
      Object.assign(this, data);
    }
  }
  export default Game;
  