export const getCircleTangentPoints = ({
    xCircle: x1,
    yCircle: y1,
    rCircle: r1,
    xDot: x0,
    yDot: y0
}) => {
    const d = (x1 - x0) ** 2 + (y1 - y0) ** 2;
    const b = r1 ** 2;

    if (d > b) {
        let x2 = (x0 + x1) / 2;
        let y2 = (y0 + y1) / 2;
        let r2 = Math.sqrt(d) / 2;

        const a = r1 ** 2 / (2 * r2);

        const h = Math.sqrt(r1 ** 2 - a ** 2);

        const x = x1 + (a * (x2 - x1)) / r2;
        const y = y1 + (a * (y2 - y1)) / r2;

        const xRes1 = x + (h * (y2 - y1)) / r2;
        const yRes1 = y - (h * (x2 - x1)) / r2;

        const xRes2 = x - (h * (y2 - y1)) / r2;
        const yRes2 = y + (h * (x2 - x1)) / r2;

        return [
            {
                x: Math.floor(xRes1),
                y: Math.floor(yRes1)
            },
            { x: Math.floor(xRes2), y: Math.floor(yRes2) }
        ];
    }
};
