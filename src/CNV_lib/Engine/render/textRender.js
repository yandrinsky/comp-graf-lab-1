import Store from "../../Store";

function textRender({link}){
    const style = Store.state.styleEngine.getShapeStyles(link);
    const {context} = Store.state;

    const coords = style.position === "sticky" ? link.getCoords() : link.getShiftCoords();
    const {start: {x, y}} = coords;

    context.font = `${style.fontSize} ${style.fontFamily}`;

    let info = context.measureText(link.text);
    let padding = Number(String(style.padding).split("px")[0]);

    if(style.backgroundColor){
        context.beginPath();
        context.fillStyle = style.backgroundColor;
        context.fillRect(
            x - padding,
            y + 2 + padding,
            info.width + padding * 2,
            -Number(style.fontSize.split("px")[0]) - padding * 2
        )
    }

    context.fillStyle = style.color;
    context.fillText(link.text, x, y);
}

export default textRender;