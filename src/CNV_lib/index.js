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
        r: Math.sqrt((xDot - yCircle)**2 + (yDot - yCircle) ** 2) / 2,
    }
}
