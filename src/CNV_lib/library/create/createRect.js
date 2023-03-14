import {createShape} from "./createShape";
import Rectangle from "../../Templates/Rectangle";

export const createRect = (config) => {
    let link = new Rectangle(config);
    return createShape(link);
}