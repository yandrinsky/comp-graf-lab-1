import Standard from "./Standard";
import Store from "../Store";

class Text extends Standard{
    constructor(config) {
        super({...config, type: "text"});
        this.text = config.text;
    }

    getCoords(){
        return {
            start: {
                x: this.start.x,
                y: this.start.y,
            }
        }
    }

    getShiftCoords(){
        return{
            start: {
                x: this.start.x + Store.state.shift.x,
                y: this.start.y + Store.state.shift.y,
            }
        }
    }

    updateText(text) {
        this.text = text;
    }
}

export default Text;