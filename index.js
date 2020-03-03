const express = require('express')
const path = require('path')
const { controller } = require('./controller')
var app = express();
var router = express.Router();
const killPort = require('kill-port')
var server = null;
let connections = [];


app.use('/BlackMouse', router);

app.use(express.static(__dirname + '/public'));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'), function (err) {
        if (err) {
            console.log(err)
            res.status(err.status).end();
        } else {
            console.log('file sent')
        }
    });
});

router.get('/Connect', (req, res) => {
    server = controller.listen(3000, () => {
        console.log('Listening on port 3000');
    });
    server.on('connection', connection => {
        connections.push(connection);
        connection.on('close', () => connections = connections.filter(curr => curr !== connection));
    });
    res.sendStatus(200);
})
router.get('/Disconnect', (req, res) => {

    console.log(Object.keys(server));
    server.close();
    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
    res.sendStatus(200);
})


app.listen(4000, () => {
    console.log("Listening")

});