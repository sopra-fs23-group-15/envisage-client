/**
 * Challenge model
 */
class Challenge {
    constructor(data = {}) {
        this.durationInSeconds = null;
        this.styleRequirement = null;
        this.imagePrompt = null;
        this.roundNr = null;
        Object.assign(this, data);
    }
}
export default Challenge;