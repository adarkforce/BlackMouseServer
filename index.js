const express = require('express')
const app = express()
const port = 3000
const robot = require("robotjs");
const os = require("os");
const ks = require('node-key-sender');



var pointerSensitivity = 0.125
var scrollSensitivity = 1
const screenSize = robot.getScreenSize()

const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

robot.setMouseDelay(0);


app.post('/MousePosition', (req, resp) => {
    const minValue = 1
    var mouseDeltaX = req.body.mouseDeltaX;
    var mouseDeltaY = req.body.mouseDeltaY;
    //var deviceSize = req.body.deviceSize;
    var newMousePositionX = 0;
    var newMousePositionY = 0;
    var magicValueX = mouseDeltaX * pointerSensitivity// map_range((Math.pow(mouseDeltaX,3))/resistence,-1000,1000,-5,5);
    var magicValueY = mouseDeltaY * pointerSensitivity// map_range((Math.pow(mouseDeltaY,3))/resistence,-1000,1000,-5,5);

    if (mouseDeltaX > 0 && mouseDeltaX > 1)
        newMousePositionX = robot.getMousePos().x + magicValueX;
    else if (mouseDeltaX < 0 && mouseDeltaX < -1)
        newMousePositionX = robot.getMousePos().x + magicValueX;
    else if (mouseDeltaX > 0 && mouseDeltaX < minValue)
        newMousePositionX = robot.getMousePos().x + minValue;
    else if (mouseDeltaX < 0 && mouseDeltaX > -minValue)
        newMousePositionX = robot.getMousePos().x - minValue;
    else
        newMousePositionX = robot.getMousePos().x

    if (mouseDeltaY > 0)
        newMousePositionY = robot.getMousePos().y + magicValueY;
    else if (mouseDeltaY < 0)
        newMousePositionY = robot.getMousePos().y + magicValueY;
    else if (mouseDeltaY > 0 && mouseDeltaY < minValue)
        newMousePositionY = robot.getMousePos().y + minValue;
    else if (mouseDeltaY < 0 && mouseDeltaY > -minValue)
        newMousePositionY = robot.getMousePos().y - minValue;
    else
        newMousePositionY = robot.getMousePos().y

    if (newMousePositionX > screenSize.width) {
        newMousePositionX = screenSize.width;
    }
    if (newMousePositionY > screenSize.height) {
        newMousePositionY = screenSize.height;
    }
    if (newMousePositionX < 0) {
        newMousePositionX = 0;
    }
    if (newMousePositionY < 0) {
        newMousePositionY = 0;
    }
    robot.moveMouseSmooth(newMousePositionX, newMousePositionY, .5);
    resp.sendStatus(200);
});

app.get('/', (req, res) => {
    console.log('get chiamata!')
    res.status(200).send(JSON.stringify({ result: "OK", name: os.hostname() }));
});

app.get('/MouseRightClick', (req, res) => {
    robot.mouseClick('right');
    res.sendStatus(200);
})
app.get('/MouseLeftClick', (req, res) => {
    robot.mouseClick('left');
    res.sendStatus(200);
})

app.post('/KeyHandler', (req, res) => {
    key = req.body.key;
    console.log("KEY = ", key);
    try {
        if(key=='Backspace')
            robot.keyTap(key.toLowerCase())
        else
            robot.keyTap(key.toLowerCase())
    } catch (err) {
        console.warn(err);
        ks.sendKey(key);
    } finally {
        res.sendStatus(200);
    }
})

app.post('/Scroll', (req,res) => {
    var scrollX = req.body.scrollX * scrollSensitivity;
    var scrollY = req.body.scrollY * scrollSensitivity;
    robot.scrollMouse(scrollX,scrollY);
    res.sendStatus(200);
})

app.get("/getScrollSensitivity",(req,res)=>{
    res.status(200).send(JSON.stringify({scrollValue: scrollSensitivity}))
})

app.get("/getPointerSensitivity",(req,res)=>{
    res.status(200).send(JSON.stringify({pointerValue: pointerSensitivity}))
})

app.post("/postPointerSensitivity",(req,res)=>{
    pointerSensitivity = req.body.pointerSensitivity
    res.sendStatus(200);
})

app.post("/postScrollSensitivity",(req,res)=>{
    scrollSensitivity = req.body.scrollSensitivity
    res.sendStatus(200);
})

app.listen(port, () => {
    console.log('listening on port ', port);
}).addListener("connection", (socket) => {
    console.log("Connected with ", socket.address());

});

