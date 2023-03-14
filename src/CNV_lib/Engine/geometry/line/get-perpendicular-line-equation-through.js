export const getPerpendicularLineEquationThrough = ({equation, dot: {x, y}}) => {
    const k = -1 / equation.k;
    const b = y - k * x;

    console.log(k * equation.k, 'asdad', k, equation.k)
    return {...equation, k, b};
}