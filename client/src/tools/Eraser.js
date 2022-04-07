import Brush from "./Brush";

class Eraser extends Brush {
    constructor(canvas) {
        super(canvas);
    }

    draw(x, y) {
        this.ctx.strokeStyle = "white";
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }
}

export default Eraser;