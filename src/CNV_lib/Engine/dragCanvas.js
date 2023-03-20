import Store from '../Store';
import mousePosition from './events-engine/mousePosition';
import { nearDot } from './geometry';
import { render } from './render';
import { createText } from '../library/create/createText';
import { preventRender } from '../library/prevent-render';

function onMouseDown(e) {
    if (Store.state.draggableCanvas) {
        for (let i = 0; i < Store.state.__mouseClickTargets.length; i++) {
            let link = Store.state.__shapes[Store.state.__mouseClickTargets[i]];
            let [clientX, clientY] = mousePosition(e);

            let res = nearDot({
                distance: 5,
                userX: clientX,
                userY: clientY,
                circle: link,
                e: e
            });

            if (res) {
                return;
            }
        }

        Store.state.canvas.style.cursor = 'grab';
        Store.state.canvas.addEventListener('mousemove', onMouseMove);
    }
}

function onMouseUp(e) {
    if (Store.state.draggableCanvas) {
        Store.state.canvas.style.cursor = 'default';
        Store.state.canvas.removeEventListener('mousemove', onMouseMove);
    }
}

function onMouseMove(e) {
    Store.state.canvas.style.cursor = 'grabbing';

    if (Store.state.draggableCanvas) {
        Store.state.shift.x += e.movementX;
        Store.state.shift.y += e.movementY;

        if (Store.state.draggableCanvasObserver) {
            Store.state.draggableCanvasObserver(Store.state.shift.x, Store.state.shift.y);
        }

        preventRender(() => {
            Store.state.__shapes[
                Store.state.systemShapes['shiftIndicator'].system.getID()
            ]?.updateText(`${Store.state.shift.x} ${Store.state.shift.y}`);
        });

        render();
    }
}

export const dragCanvas = () => {
    if (Store.state.draggableCanvas) {
        Store.state.systemShapes['shiftIndicator'] = createText({
            x0: Store.state.canvas.width - 50,
            y0: Store.state.canvas.height - 10,
            text: '0 0',
            className: 'text'
        });
    }

    Store.state.canvas.addEventListener('mousedown', onMouseDown);
    Store.state.canvas.addEventListener('mouseup', onMouseUp);
};
