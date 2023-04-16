/**
 * Lobby model
 */
class Lobby {
  constructor(data = {}) {
    this.game = null;
    this.pin = null;
    this.numberOfRounds = null;
    this.players = null;
    this.roundDuration = null;
    Object.assign(this, data);
  }
}
export default Lobby;
