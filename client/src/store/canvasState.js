import {makeAutoObservable} from 'mobx'

class CanvasState {
    convas = null;
    undoList = [];
    redoList = [];
    username = "";
    sessionid = null;
    socket = null;

    constructor() {
        makeAutoObservable(this);
    }

    setSessionId(sessionid) {
        this.sessionid = sessionid;
    }

    setSocket(socket){
        this.socket = socket;
    }

    setUsername(username) {
        this.username = username;
    }

    setCanvas(convas) {
        this.convas = convas;
    }

    pushToUndo(data) {
        this.undoList.push(data);
    }

    pushToRedo(data) {
        this.redoList.push(data);
    }

    undo() {
        let ctx = this.convas.getContext('2d');
        if (this.undoList.length > 0) {
            let dataUrl = this.undoList.pop();
            this.redoList.push(this.convas.toDataURL());
            let img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0,0,this.convas.width, this.convas.height);
                ctx.drawImage(img, 0,0,this.convas.width, this.convas.height);
            }
        } else {
            ctx.clearRect(0,0,this.convas.width, this.convas.height);
        }
    }

    redo() {
        let ctx = this.convas.getContext('2d');
        if (this.redoList.length > 0) {
            let dataUrl = this.redoList.pop();
            this.undoList.push(this.convas.toDataURL());
            let img = new Image();
            img.src = dataUrl;
            img.onload =  () => {
                ctx.clearRect(0,0, this.convas.width, this.convas.height);
                ctx.drawImage(img, 0, 0, this.convas.width, this.convas.height);
            }
        }
    }
}

export default new CanvasState();