import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import canvasState from "../../store/canvasState";
import toolState from "../../store/toolState";
import '../../styles/canvas.scss';
import Brush from '../../tools/Brush';
import Rect from '../../tools/Rect';
import axios from 'axios';

const Canvas = observer(() => {
    const canvasRef = useRef();
    const usernameRef = useRef();
    const [modal, setModal] = useState(true);
    const params = useParams();

    useEffect(() => {
        // console.log(canvasRef.current)
        canvasState.setCanvas(canvasRef.current);
        let ctx = canvasRef.current.getContext('2d');
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image();
                img.src = response.data;
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            })
    }, [])

    useEffect(() => {
        if(canvasState.username){
            const socket = new WebSocket(`ws://localhost:5000/`);
            canvasState.setSocket(socket);
            canvasState.setSessionId(params.id);
            toolState.setTool(new Brush(canvasRef.current, socket, params.id));
            socket.onopen = () => {
                console.log('Connection done')
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: 'connection'
                }))
            }

            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data);
                // console.log(msg);
                switch(msg.method) {
                    case "connection":
                        console.log(`User ${msg.username} connected`);
                        break;

                    case "draw": 
                        drawHandler(msg);
                        break;
                }
            }
        }
    }, [canvasState.username]);

    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext('2d');
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y)
                break;

            case "rect":
                Rect.staticDraw(ctx,figure.x, figure.y, figure.width, figure.height, figure.color)

            case "finish":
                ctx.beginPath();
                break;
        }
    }

    const mouseDownHandler = () => {
        let imgData = canvasRef.current.toDataURL();
        canvasState.pushToUndo(imgData);
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: imgData})
            .then(response => console.log(response.data));
    }

    const connectionHanlder = () => {
        canvasState.setUsername(usernameRef.current.value);
        setModal(false);
    }

    return(
        <div className="canvas">
            <Modal show={modal} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title>Enter user name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectionHanlder()}>
                        Log in
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas 
                ref={canvasRef} 
                onMouseDown={() => mouseDownHandler()}
                width={600} 
                height={400}></canvas>
        </div>
    )
});

export default Canvas;