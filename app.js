const {app} = require('./web-interface-server');
const ChromeLauncher = require('chrome-launcher');


app.listen(4000, () => {
    console.log("Listening")

});


ChromeLauncher.launch({
    startingUrl: 'http://localhost:4000/BlackMouse',
  }).then(chrome => {
    console.log(`Chrome debugging port running on ${chrome.port}`);
    chrome.process.on('exit',(code)=>{
        process.exit(0);
    })
  });