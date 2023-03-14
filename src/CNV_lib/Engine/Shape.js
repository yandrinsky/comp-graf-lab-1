import {getCoordinates, length, moveTo} from "./geometry/geometry"
import availableProperties from "./cssEngine/availableProperties";
import {render} from "./render";
import Store from "../Store";
import {getEquationFrom2Points} from "./geometry/line/get-equation-from-2-points";

class Shape{
    constructor(link, id) {
        this.link = link;
        this.id = id;
        this.isPointer = false;

        this.styleProp = {};

        availableProperties.forEach(property => {
            link = this.link;

            Object.defineProperty(this.styleProp, property, {
                get: function (){
                    return link.style[property];
                },

                set: function (arg){
                    link.style[property] = arg;
                    render();
                },
            })
        })

    }

    get system(){
        const __this = this;

        return {
            get equation(){
                if(__this.link.type === "line"){
                    let eq = getEquationFrom2Points(
                        __this.link.start.x,
                        __this.link.start.y,
                        __this.link.end.x,
                        __this.link.end.y,
                    )

                    eq.x3 = __this.link.check.x;
                    eq.y3 = __this.link.check.y;
                    eq.target = __this;

                    return eq;
                }
            },

            get coordinates(){
                let x1 = __this.link.start.x;
                let y1 = __this.link.start.y;
                let x2 = __this.link.end?.x;
                let y2 = __this.link.end?.y;
                let x3 = __this.link.check?.x;
                let y3 = __this.link.check?.y;
                return {x1, y1, x2, y2, x3, y3};
            },

            getCoordinatesX(y){
                return getCoordinates(this.equation, undefined, y);
            },

            getCoordinatesY(x){
                return getCoordinates(this.equation, x, undefined);
            },

            moveTo(move, x){
                return moveTo(this.equation, move, x);
            },

            get length(){
                return length(this.equation);
            },

            getID() {
                return __this.id
            }

        }
    }
    get classList(){
        let link = this.link;

        return {
            add(className){
                if(!link.classList.includes(className)){
                    link.classList.push(className)
                    render();
                }
            },

            remove(className){
                const index = link.classList.indexOf(className);
                if(index !== -1){
                    link.classList.splice(index, 1);
                    render();
                }
            },

            toggle(className){
                const index = link.classList.indexOf(className);
                if(index !== -1){
                    link.classList.splice(index, 1);
                    render();
                } else {
                    link.classList.push(className);
                    render();
                }
            },

            contains(className){
                return link.classList.includes(className);
            }
        }
    }

    get style(){
        return this.styleProp;
    }

    get update(){
        const link = this.link;

        return {
            get check(){
                return {
                    set x(x){
                        link.check.x = x;
                        render();
                    },
                    set y(y){
                        link.check.y = y;
                        render();
                    }
                }
            },

            get start(){
                return {
                    set x(x){
                        link.start.x = x;
                        render();
                    },
                    set y(y){
                        link.start.y = y;
                        render();
                    }
                }
            },

            get startPosition (){
                return {
                    set x(x){
                        link.start.x = x;
                        render();
                    },
                    set y(y){
                        link.start.y = y;
                        render();
                    }
                }
            },

            get end(){
                if(link.type === "line"){
                    return {
                        set x(x){
                            link.end.x = x;
                            render();
                        },
                        set y(y){
                            link.end.y = y;
                            render();
                        }
                    }
                }
            },

            get endPosition (){
                if(link.type === "line"){
                    return {
                        set x(x){
                            link.end.x = x;
                            render();
                        },
                        set y(y){
                            link.end.y = y;
                            render();
                        }
                    }
                }
            },

            set width (newWidth){
                link.width = newWidth;
                render();
            },

            set height (newHeight){
                link.height = newHeight;
                render();
            }
        }
    }

    set pointer(bool){
        this.isPointer = !!bool;
        this.link.pointer = this.isPointer
    }

    set ondrag(callback){
        Store.state.ondrag[this.id] = callback;

        if(!Store.state.__mouseMoveTargets.includes(this.id)){
            Store.state.__mouseMoveTargets.push(this.id)
        }
    }

    set onmouseover(callback){
        Store.state.mouseover[this.id] = callback;

        if(!Store.state.__mouseMoveTargets.includes(this.id)){
            Store.state.__mouseMoveTargets.push(this.id)
        }
    }

    set onmouseenter(callback){
        Store.state.mouseenter[this.id] = callback;

        if(!Store.state.__mouseMoveTargets.includes(this.id)){
            Store.state.__mouseMoveTargets.push(this.id)
        }
    }

    set onmouseleave(callback){
        Store.state.mouseleave[this.id] = callback;
        if(!Store.state.__mouseMoveTargets.includes(this.id)){
            Store.state.__mouseMoveTargets.push(this.id)
        }
    }

    set onclick(callback){
        if(!Store.state.__mouseClickTargets.includes(this.id)){
            Store.state.__mouseClickTargets.push(this.id)
        }

        Store.state.click[this.id] = callback;
    }

    get isLine(){
        let distance = 3;
        return Math.abs(this.link.start.x - this.link.check.x) < distance && Math.abs(this.link.start.y - this.link.check.y) < distance;
    }

    remove(){
        //удаляем информацию
        delete Store.state.__shapes[this.id];
        //удаляем инстанс класса
        delete Store.state.shapes[this.id];
        //удаляем слушатели событий
        delete Store.state.mouseenter[this.id];
        delete Store.state.mouseleave[this.id];
        delete Store.state.mouseenter[this.id];
        delete Store.state.click[this.id];

        let MMT = Store.state.__mouseMoveTargets;
        let MCT = Store.state.__mouseClickTargets;

        if(MMT.indexOf(this.id) >= 0){
            MMT.splice(MMT.indexOf(this.id), 1);
        }
        if(MCT.indexOf(this.id) >= 0){
            MCT.splice(MCT.indexOf(this.id), 1);
        }
        render();
    }
}

export default Shape;