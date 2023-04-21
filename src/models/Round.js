/**
 * Round model
 */
class Round {
    constructor(data = {}) {
      this.id = null;
      this.game = null;
      this.playerImages = null;
      Object.assign(this, data);
    }
  }
  export default Round;
  