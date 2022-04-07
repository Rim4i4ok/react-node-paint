import Reac from "react";
import canvasState from "../../store/canvasState";
import toolState from "../../store/toolState";
import '../../styles/toolbar.scss';
import Brush from "../../tools/Brush";
import Rect from "../../tools/Rect";
import Circle from "../../tools/Circle";
import Eraser from "../../tools/Eraser";
import Line from "../../tools/Line";

const Toolbar = () => {

    const changeColor = e => {
        toolState.setStrokeColor(e.target.value)
        toolState.setFillColor(e.target.value)
    }

    function setActive (event) {
        document.querySelectorAll('.toolbar__btn').forEach(function (element) {
            element.classList.remove('active');
        });
        console.log(event)
        event.target.classList.add('active');
    }

    const download = () => {
        const dataUrl = canvasState.convas.toDataURL();
        console.log(dataUrl);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = canvasState.sessionid + ".jpg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return(
        <div className="toolbar">
            <button className="toolbar__btn brush" onClick={(e) => {
                toolState.setTool(new Brush(canvasState.convas, canvasState.socket, canvasState.sessionid)); 
                setActive(e);
            }}></button>
            <button className="toolbar__btn rect" onClick={(e) => {
                toolState.setTool(new Rect(canvasState.convas, canvasState.socket, canvasState.sessionid)); 
                setActive(e);
            }}></button>
            <button className="toolbar__btn circle" onClick={(e) => {
                toolState.setTool(new Circle(canvasState.convas)); 
                setActive(e);
            }}/>
            <button className="toolbar__btn eraser" onClick={(e) => {
                toolState.setTool(new Eraser(canvasState.convas)); 
                setActive(e);
            }}/>
            <button className="toolbar__btn line" onClick={(e) => {
                toolState.setTool(new Line(canvasState.convas)); 
                setActive(e);
            }}/>
            <input onChange={e => changeColor(e)} style={{marginLeft:10}} type="color"/>
            <button className="toolbar__btn undo" onClick={() => canvasState.undo()}></button>
            <button className="toolbar__btn redo" onClick={() => canvasState.redo()}></button>
            <button className="toolbar__btn save" onClick={() => download()}></button>
        </div>
    )
}

export default Toolbar;