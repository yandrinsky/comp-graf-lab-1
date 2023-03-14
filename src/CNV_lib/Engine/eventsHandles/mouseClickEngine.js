import {nearLine, nearRect} from "../geometry";

import selfEvent from "./selfEvent";
import mousePosition from "./mousePosition";
import {nearDot} from "../geometry";
import Store from "../../Store";
import {render} from "../render";

function mouseClickEngine(e){
    let needToRedraw = false;
    let [clientX, clientY] = mousePosition(e);

    for(let i = 0; i < Store.state.__mouseClickTargets.length; i++){
        const shapeId = Store.state.__mouseClickTargets[i];
        let link = Store.state.__shapes[shapeId];

        if(link.type === "line"){
            const {start: {x: x1, y: y1}, end: {x: x2, y: y2}, check: {x: x3, y: y3}} = link.getShiftCoords();

            nearLine({
                distance: link.getCSS().width / 2,
                userX: clientX,
                userY: clientY,
                x1,
                x2,
                x3,
                y1,
                y2,
                y3,
                e: e,
            }, (e)=> {
                if(Store.state.click[link.id]){
                    Store.state.click[link.id](selfEvent(e, Store.state.shapes[link.id]))
                }
            })
        } else if (link.type === "circle"){
            nearDot({
                distance: link.getCSS().radius,
                userX: clientX,
                userY: clientY,
                circle: link,
                e: e,
            }, (e)=> {
                if(Store.state.click[link.id]){
                    Store.state.click[link.id](selfEvent(e, Store.state.shapes[link.id]))
                }
            })
        } else if(link.type === 'rect') {
            const {start: {x, y}, width, height} = link.getShiftCoords();

            nearRect({
                distance: 0,
                userX: clientX,
                userY: clientY,
                x,
                y,
                width,
                height,
                e: e
            }, (e)=> {
                if(Store.state.click[link.id]){
                    Store.state.click[link.id](selfEvent(e, Store.state.shapes[link.id]))
                }
            })
        }
    }

    if(needToRedraw){
        render();
    }
}

export default mouseClickEngine;
