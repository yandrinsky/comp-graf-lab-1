import React, { useEffect } from 'react';
import { CNV as CNV_lib } from './CNV_lib/library';
import { CSS } from './css';

const getCircleTangentPoints = ({ xCircle: x1, yCircle: y1, rCircle: r1, xDot: x0, yDot: y0 }) => {
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

function App() {
    useEffect(() => {
        const canvas = document.querySelector('#canvas');
        const context = canvas.getContext('2d');

        const CNV = new CNV_lib({
            canvas,
            context,
            css: CSS,
            settings: { draggableCanvas: false }
        });

        const mainCircle = CNV.createCircle({ x0: 700, y0: 300, className: 'mainCircle' });

        const dot = CNV.createCircle({ x0: 500, y0: 300, className: 'dot' });

        const line1 = CNV.createLine({
            x0: dot.link.getCoords().start.x,
            y0: dot.link.getCoords().start.y,
            x1: 0,
            y1: 0
        });

        const line2 = CNV.createLine({
            x0: dot.link.getCoords().start.x,
            y0: dot.link.getCoords().start.y,
            x1: 0,
            y1: 0
        });

        const rangeLine = CNV.createLine({
            x0: 800,
            y0: 480,
            x1: 980,
            y1: 480,
            className: 'line'
        });

        const rangeCircle = CNV.createCircle({
            x0: 800,
            y0: 480,
            className: 'line'
        });

        const movingMainCircle = e => {
            const { clientX: x, clientY: y } = e;

            const res = getCircleTangentPoints({
                xDot: dot.link.getCoords().start.x,
                yDot: dot.link.getCoords().start.y,
                xCircle: x,
                yCircle: y,
                rCircle: mainCircle.link.getCSS().radius
            });

            CNV.combineRender(() => {
                mainCircle.update.start.x = x;
                mainCircle.update.start.y = y;

                if (!res) {
                    return;
                }

                line1.update.end.x = res[0].x;
                line1.update.end.y = res[0].y;

                line2.update.end.x = res[1].x;
                line2.update.end.y = res[1].y;
            });
        };

        const movingDot = e => {
            const { clientX: x, clientY: y } = e;

            const res = getCircleTangentPoints({
                xDot: x,
                yDot: y,
                xCircle: mainCircle.link.getCoords().start.x,
                yCircle: mainCircle.link.getCoords().start.y,
                rCircle: mainCircle.link.getCSS().radius
            });

            CNV.combineRender(() => {
                dot.update.start.x = x;
                dot.update.start.y = y;

                if (!res) {
                    line1.classList.add('hide');
                    line2.classList.add('hide');

                    console.log(line1.classList.contains('hide'));
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

                line2.update.end.x = res[1].x;
                line2.update.end.y = res[1].y;
            });
        };

        dot.ondrag = movingDot;
        mainCircle.ondrag = movingMainCircle;

        CNV.createLine({ x0: 10, y0: 10, x1: 100, y1: 100, x2: 300, y2: 300 });

        rangeCircle.ondrag = e => {
            if (
                e.clientX > rangeLine.link.getCoords().start.x &&
                e.clientX < rangeLine.link.getCoords().end.x
            ) {
                mainCircle.style.radius = 30 + (e.clientX - rangeLine.link.getCoords().start.x) / 5;

                const { x, y } = mainCircle.link.getCoords().start;
                movingMainCircle({ clientX: x, clientY: y });

                rangeCircle.update.start.x = e.clientX;
            }
        };

        const { x, y } = mainCircle.link.getCoords().start;
        movingMainCircle({ clientX: x, clientY: y });
    }, []);

    return (
        <div className="App">
            <canvas
                id="canvas"
                width={1000}
                height={500}
                style={{ border: '1px solid black', marginTop: 10 }}
            />
        </div>
    );
}

export default App;
