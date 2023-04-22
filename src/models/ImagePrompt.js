class ImagePrompt {
    constructor(data = {}) {
        this.image = null;
        this.imageType = null;
        Object.assign(this, data);
    }
}
export default ImagePrompt;