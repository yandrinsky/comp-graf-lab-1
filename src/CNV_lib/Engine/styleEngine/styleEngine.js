import {sortShapesByIndex} from "./sortShapesByIndex";
import {CSSEngine} from "../cssEngine/cssEngine";
import {defaultStyles} from "./defaultStyles";

export class StyleEngine {
    constructor({css}) {
        this.CSSEngine = new CSSEngine({css: css, defaultStyles: defaultStyles})
        this.css = css;
        this.cache = {combineStyles: {}, }
        this.defaultStyles = defaultStyles;
    }

    getShapeStyles(shape) {
        if(!this.cache.combineStyles[shape.id]) {
            this.cache.combineStyles[shape.id] = this.CSSEngine.getStyles({
                classes: shape.classList,
                type: shape.type,
                ownStyle: shape.style
            });
        }

        return this.cache.combineStyles[shape.id];
    }

    sortShapesByIndex(shapes) {
        return sortShapesByIndex({getShapeStyles: this.getShapeStyles.bind(this), shapes});
    }
}
