import {querySelectorEngine, querySelectorAllEngine} from "./Engine/cssEngine/selecting";
import mouseMoveEngine from "./Engine/eventsHandles/mouseMoveEngine";
import mouseClickEngine from "./Engine/eventsHandles/mouseClickEngine";
import { dragCanvas } from "./Engine/dragCanvas";

import Shape from "./Engine/Shape";
import {render} from "./Engine/render";
import Store from "./Store";
import Line from "./Templates/Line";
import Circle from "./Templates/Circle";
import Text from "./Templates/Text";
import Rectangle from "./Templates/Rectangle";
import {collision} from "./Engine/geometry/geometry";
import {StyleEngine} from "./Engine/styleEngine";
import {createLine} from "./library/create/createLine";
import {createText} from "./library/create/createText";
import {createCircle} from "./library/create/createCircle";
import {createRect} from "./library/create/createRect";
import {preventRender} from "./library/prevent-render";
import {CSS} from "./css";

export class CNV {
    constructor({context, canvas, css = {}, settings = {}}) {
        Store.initState();
        this.getState = () => Store.getState();

        Store.state.context = context;
        Store.state.canvas = canvas;
        Store.state.styleEngine = new StyleEngine({css: {...CSS, ...css}});
        Store.state.draggableCanvas = !!settings.draggableCanvas;
        this.start();
    }

    start(){
        dragCanvas();

        Store.state.canvas.addEventListener("mousemove", mouseMoveEngine.bind(this));
        Store.state.canvas.addEventListener("click", mouseClickEngine);

        this.render();
    }

    get settings(){
        return {
            set draggableCanvas(flag){

                Store.state.draggableCanvas = !!flag;
            },
            set draggableCanvasObserver(observer){
                Store.state.draggableCanvasObserver = observer;
            },
        }
    }


    querySelector(selector){
        return querySelectorEngine(selector, Store.state.__shapes, Store.state.shapes);
    }

    querySelectorAll(selector){
        return querySelectorAllEngine(selector, Store.state.__shapes, Store.state.shapes);
    }

    getElementByUniqueId(id){
        return Store.state.shapes[id];
    }

    createLine = (config) => createLine(config);
    createRect = (config) => createRect(config);
    createText = (config) => createText(config);
    createCircle = (config) => createCircle(config);

    text(config){
        Store.state.context.font = `${config.fontSize || 14}px serif`;
        Store.state.fillStyle = config.color || "black";
        Store.state.fillText(config.text, config.x, config.y);
    }

    render = () => render();

    lineCollision(line1, line2){
        return collision(line1.system.equation, line2.system.equation);
    }

    preventRender = (callback) => preventRender(callback);

    combineRender(callback){
        this.preventRender(callback);
        this.render();
    }

    save(){
        let state = Store.getState();

        let preparedStore = {
            __shapes: {},
            draggableCanvas: state.draggableCanvas,
            shift: state.shift,
        }

        for(let key in state.__shapes) {
            let link = state.__shapes[key];
            preparedStore.__shapes[key] = {
                className: link.classList,
                x0: link.start.x,
                y0: link.start.y,
                x1: link.end?.x,
                y1: link.end?.y,
                x2: link.check?.x,
                y2: link.check?.y,
                uniqueId: link.id,
                type: link.type,
                text: link.text,
                id: link.userId,
                width: link.width,
                height: link.height,
                pointer: link.pointer,
                style: link.style,
            }
        }
        return JSON.stringify(preparedStore);
    }

    recover(data){
        const state = {...Store.createState(), ...JSON.parse(data)};

        for(let key in state.__shapes) {
            let oldLink = state.__shapes[key]
            let link = oldLink;
            let pointer = link.pointer;

            if(link.type === "line") link = new Line({...link});
            else if(link.type === "circle") link = new Circle({...link});
            else if(link.type === "text") link = new Text({...link});
            else if(link.type === "rect") link = new Rectangle({...link});

            for(let key in oldLink.style) {
                link.style[key] = oldLink.style[key];
            }

            state.__shapes[key] = link;
            state.shapes[key] = new Shape(link, key);
            state.shapes[key].pointer = pointer;
        }

        Store.setState(state);
        Store.state = Store.getState();

        this.render();
    }
}

