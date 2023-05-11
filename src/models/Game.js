/**
 * Game model
 */
class Game {
  constructor(data = {}) {
    this.rounds = null;
    this.playerScores = null;
    this.lobbyPin = null;
    this.status = null;
    Object.assign(this, data);
  }
}
export default Game;
