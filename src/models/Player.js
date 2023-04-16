/**
 * Player model
 */
class Player {
  constructor(data = {}) {
    this.id = null;
    this.userName = null;
    this.lobbyCreator = false;
    this.lobby = null;
    Object.assign(this, data);
  }
}
export default Player;
