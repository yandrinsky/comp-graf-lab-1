import React, {useEffect, useReducer, useState} from 'react';
import {Note} from "./view/components/domain/note/note.component";
import {CNV as CNV_lib} from "./CNV_lib/library";
import {CSS} from "./css";
import {getCoordinates, getEquationForLine, moveTo} from "./CNV_lib/Engine/geometry/geometry";
import {getEquationFrom2Points} from "./CNV_lib/Engine/geometry/line/get-equation-from-2-points";
import {doesDotBelongToLine} from "./CNV_lib/Engine/geometry/line/does-dot-belong-to-line";
import {getStraightCollisionCoordinates} from "./CNV_lib/Engine/geometry/collision/getStraightCollisionCoordinates";
import {useKIOState} from "./KIO/use-KIO-state";
import {cache} from "./KIO/cache";
import hash from 'object-hash'
import mousePosition from "./CNV_lib/Engine/eventsHandles/mousePosition";
import {getPerpendicularLineEquationThrough} from "./CNV_lib/Engine/geometry/line/get-perpendicular-line-equation-through";
import Store from "./CNV_lib/Store";
import {getSign} from "./CNV_lib/Engine/utils/get-sign";

// const globalOBJ = {
//     "228": false,
// }
//
// function useKIOState(data, id){
//     const [state, setState] = useState(globalOBJ.hasOwnProperty(id) ? globalOBJ[id] : data);
//
//     useEffect(() => {
//         globalOBJ[id] = state;
//     }, [state]);
//
//
//     return [state, setState]
// }

// const initialState = {count: 1};
//
// const reducer = (state, action) => {
//     switch (action.type) {
//         case 'add':
//             return {...state, count: state.count + 1}
//         case 'minus':
//             return {...state, count: state.count - 1}
//     }
// }

// const GetTangentPointCoordinate = (X, Y, Xo, Yo, rad) => {
//     const dx = X - Xo;
//     const dy = Y - Yo;
//
//     const L = Math.sqrt(dx * dx + dy * dy);
//     const itg = rad / L;
//     const jtg = Math.sqrt(1 - itg * itg);
//
//     const Xtg = -itg * dx * itg + itg * dy * jtg;
//     const Ytg = -itg * dx * jtg - itg * dy * itg;
//
//     return {
//         x: Xtg,
//         y: Ytg
//     };
// }


/*ФУНКЦИЯ ПОИСКА ТОЧЕК КАСАНИЯ*/
const kasatelnie =({xMainCircle, yMainCircle, rMainCircle, xAuxCircle, yAuxCircle, rAuxCircle}) => {
    let x1 = xMainCircle;
    let y1 = yMainCircle;
    let x2 = xAuxCircle;
    let y2 = yAuxCircle;

    const R1 = rMainCircle; //Радиус основной окружности
    const R2 = rAuxCircle; //Радиус вспомогательной окружности
    const D = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)); //Длина отрезка от точки к центру основной окружности
//это я фиг знает где взял
    const a = (R1*R1-R2*R2+D*D)/(2*D);
    const h = Math.sqrt(R1 * R1 - a ** 2);
    console.log('h', h)

    const X = x1+a*(x2-x1)/D;
    const Y = y1+a*(y2-y1)/D;

    return {
        x1: X + h*(y2 - y1)/D,
        y1: Y - h*(x2 - x1)/D,
        x2: X - h*(y2 - y1)/D,
        y2: Y + h*(x2 - x1)/D
    }
}

// /*ОПРЕДЕЛЕНИЕ МЕСТА ТОЧКИ ОТНОСИТЕЛЬНО ОКРУЖНОСТИ*/
const intersection = ({xDot, yDot, xCircle, yCircle, rCircle}) => {
    let x1 = xDot;
    let y1 = yDot;
    let x2 = xCircle;
    let y2 = yCircle;

    //сначала я пытался использовать тип переменных double, но дублем считает не так как надо, поэтому флоат
    const d=(x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);  //Расстояние от точки до окружности
    const b= rCircle**2; //Квадрат радиуса (из упрощенной формулы окружности)

    //если квадрат радиуса равен квадрату длины отрезка, то одна точка касания
    if (d === b) {
        return 1;
    } else if (d<b) {
        return 0;
    } //если квадрат радиуса меньше квадрата длины отрезка, то нет точек


    return 2; //если не то и не другое = две точки касания
}


const getParamsOfAuxCircle = ({xDot, yDot, xCircle, yCircle}) => {
    return {
        x: (xDot + xCircle) / 2,
        y: (yDot + yCircle) / 2,
        r: Math.sqrt((xDot - xCircle)**2 + (yDot - yCircle) ** 2) / 2,
    }
}

function findTangentPoint(x0, y0, r, x1, y1) {
    // Находим угловой коэффициент прямой
    const k = (y1 - y0) / (x1 - x0);
    // Вычисляем координаты центра окружности
    const cx = x0;
    const cy = y0;
    // Решаем квадратное уравнение для получения координат точки касания
    const a = 1 + k ** 2;
    const b = -2 * cx + 2 * k * (y1 - cy) - 2 * k * x1;
    const c = cx ** 2 + (y1 - cy) ** 2 - r ** 2 - 2 * k * cy * (y1 - cy) + 2 * k * x1 * cy;
    const discriminant = b ** 2 - 4 * a * c;

    if (discriminant < 0) {
        return null; // Точка касания не найдена
    }

    const sqrtDiscriminant = Math.sqrt(discriminant);
    const t1 = (-b + sqrtDiscriminant) / (2 * a);
    const t2 = (-b - sqrtDiscriminant) / (2 * a);

    const x = x1 + t1 * (x1 - x0);
    const y = y1 + t1 * (y1 - y0);
    return [x, y];
}

const func = ({radius, k, b: originalB, kY = 1, xCircle = 0, yCircle = 0}) => {
    let b = originalB + (-1) * getSign(k) * xCircle * Number(!!k) + yCircle;

    console.log('b', b)
    console.log('k', k)
    const x0 = -k*b/(k*k+kY*kY);
    const y0 = -kY*b/(k*k+kY*kY);

    if (b*b > radius*radius*(k*k+kY*kY) + Number.EPSILON){
        console.log("no points");

        return null
    } else if (Math.abs(b*b - radius*radius*(k*k+kY*kY)) < Number.EPSILON) {
        console.log("1 point");
        console.log(x0, y0)

        return {
            x1: x0 - (-1) * getSign(k) * xCircle,
            y1: y0 - yCircle
        }
    } else {
        const d = radius*radius - b*b/(k*k+kY*kY);
        const mult = Math.sqrt(d / (k*k+kY*kY));

        let ax,ay,bx,by;

        ax = x0 + kY * mult;
        bx = x0 - kY * mult;
        ay = y0 - k * mult;
        by = y0 + k * mult;

        console.log("2 points");
        console.log(ax, ay, bx, by)

        return {
            x1: ax - (-1) * getSign(k) * xCircle,
            y1: ay - yCircle,
            x2: bx - (-1) * getSign(k) * xCircle,
            y2: by - yCircle
        }
    }
}

const natasha = ({xCircle: x1, yCircle: y1, rCircle: r1, xDot: x0, yDot: y0}) => {
    const d = (x1 - x0) ** 2 + (y1 - y0) ** 2;
    const b = r1 ** 2;

    if (d > b) {
        let x2 = (x0 + x1) / 2
        let y2 = (y0 + y1) / 2
        let r2 = Math.sqrt(d) / 2
        const D = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

        const a = (r1 ** 2 - r2 ** 2 + D ** 2) / (2 * D);

        const h = Math.sqrt(r1 ** 2 - a ** 2);

        const x = x1 + a * (x2 - x1) / D;
        const y = y1 + a * (y2 - y1) / D;

        const xRes1 = x + h * (y2 - y1) / D;
        const yRes1 = y - h * (x2 - x1) / D;

        const xRes2 = x - h * (y2 - y1) / D;
        const yRes2 = y + h * (x2 - x1) / D

        return [{
            x: Math.floor(xRes1), y: Math.floor(yRes1)},
            {x: Math.floor(xRes2), y: Math.floor(yRes2)}
        ];
    }
}

func({radius: 30, k: 1, b: 0})

const [xRes, yRes] = findTangentPoint(50, -100, 60, 134, -40);


function App() {
    // const [state, setState] = useKIOState('hello', "229");
    // const [state1, setState1] = useKIOState(false, "230");
    // const [stateRed, dispatch] = useReducer(reducer, initialState);
    // console.log({...cache.programCache})

    useEffect(() => {
        const canvas = document.querySelector('#canvas');
        const context = canvas.getContext("2d");

        const CNV = new CNV_lib({canvas, context, css: CSS, settings: {draggableCanvas: false}})

        const mainCircle = CNV.createCircle({x0: 700, y0: 500, className: 'mainCircle'});

        const dot = CNV.createCircle({x0: 500, y0: 300, className: 'dot'});

        const line1 = CNV.createLine({x0: dot.link.getCoords().start.x, y0: dot.link.getCoords().start.y, x1: 0, y1: 0});
        const line2 = CNV.createLine({x0: dot.link.getCoords().start.x, y0: dot.link.getCoords().start.y, x1:0, y1: 0});


        const movingMainCircle = (e) => {
            const [x, y] = mousePosition(e);

            const res = natasha({
                xDot: dot.link.getCoords().start.x,
                yDot: dot.link.getCoords().start.y,
                xCircle: x,
                yCircle: y,
                rCircle: 30
            })

            CNV.combineRender(() => {
                mainCircle.update.start.x = x;
                mainCircle.update.start.y = y;

                if(!res) {
                    return;
                }

                line1.update.end.x = res[0].x;
                line1.update.end.y = res[0].y;

                line2.update.end.x = res[1].x
                line2.update.end.y = res[1].y
            })

        }

        const movingDot = (e) => {
            const [x, y] = mousePosition(e);

            const res = natasha({
                xDot: x,
                yDot: y,
                xCircle: mainCircle.link.getCoords().start.x,
                yCircle: mainCircle.link.getCoords().start.y,
                rCircle: 30
            })

            CNV.combineRender(() => {
                dot.update.start.x = x;
                dot.update.start.y = y;

                if(!res) {
                    line1.classList.add('hide');
                    line2.classList.add('hide');

                    console.log(line1.classList.contains('hide'))
                    return;
                }

                line1.classList.remove('hide');
                line2.classList.remove('hide');

                line1.update.start.x = x;
                line1.update.start.y = y;
                line1.update.check.x = x;
                line1.update.check.y = y;

                line2.update.start.x = x;
                line2.update.start.y = y;
                line2.update.check.x = x;
                line2.update.check.y = y;

                line1.update.end.x = res[0].x;
                line1.update.end.y = res[0].y;

                line2.update.end.x = res[1].x
                line2.update.end.y = res[1].y
            })
        }

        const moveMainCircle = (e) => {
            CNV.getState().canvas.addEventListener('mousemove', movingMainCircle);
        }

        const moveDot = (e) => {
            CNV.getState().canvas.addEventListener('mousemove', movingDot);
        }

        const stop = () => {
            CNV.getState().canvas.removeEventListener('mousemove', movingMainCircle);
            CNV.getState().canvas.removeEventListener('mousemove', movingDot);
            CNV.getState().canvas.removeEventListener('mouseup', stop);
        }

        mainCircle.onmouseenter = () => {
            CNV.getState().canvas.addEventListener('mousedown', moveMainCircle);
            CNV.getState().canvas.addEventListener('mouseup', stop);
        }

        mainCircle.onmouseleave = () => {
            CNV.getState().canvas.removeEventListener('mousedown', moveMainCircle);
        }

        dot.onmouseenter = () => {
            CNV.getState().canvas.addEventListener('mousedown', moveDot);
            CNV.getState().canvas.addEventListener('mouseup', stop);
        }

        dot.onmouseleave = () => {
            CNV.getState().canvas.removeEventListener('mousedown', moveDot);
        }
    }, [])

    const [arr, setArr] = useState(["fdsgd"])


    const newArr = [];




  return (
    <div className="App">
        <canvas id="canvas" width={1000} height={500} style={{border: '1px solid black', marginTop: 10}}/>

        <button onClick={() => {
            setArr(old => [...old, old.length])
        }}>CLick me</button>
        </div>
  );
}

export default App;
