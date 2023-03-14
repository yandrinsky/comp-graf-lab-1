import {createShape} from "./createShape";
import Circle from "../../Templates/Circle";

export const createCircle = (config) => {
    let link = new Circle(config);
    return createShape(link);
}