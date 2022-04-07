const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.ws('/', (ws, req) => {
    console.log('CONNECTED');
    // ws.send('Connected to server')
    ws.on('message', (msg) => {
        // console.log(JSON.parse(msg));
        msg = JSON.parse(msg);
        switch(msg.method) {
            case "connection":
                connectionHandler(ws, msg);
                break;
            
            case 'draw':
                broadcastConnection(ws, msg);
                break;
        }
    })
})

app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`));
        const data = `data:image/png;base64,` + file.toString('base64');
        res.json(data);
    } catch(exception) {
        console.log(exception);
        return res.status(500, 'error');
    }
});
app.post('/image', (req, res) => {
    try{
        const data = req.body.img.replace(`data:image/png;base64,`, '');
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64');
        return res.status(200).json({message: "Loaded"});
    } catch(exception) {
        console.log(exception);
        return res.status(500, 'error');
    }
});


app.listen(PORT, ()=> console.log(`Server started at port ${PORT}`));

const connectionHandler = (ws, msg) => {
    console.log(msg);
    ws.id = msg.id;
    broadcastConnection(ws, msg);
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}