// you should already know
// HTML, JAVASCRIPT, CSS
// Possibly expreience with other libraries and framework

// HOw NodeJs differs from vanilla js
// 1) Node runs on a server - ot in a browser (backend not frontend)
// 2) The console is the terminal window

// console.log('Hello World')
// 3) Global object instead of window object
//console.log(global);
// 4) Has common Core modules that we will explore
// 5) CommonJs modules instead of ES6 modules
// 6) Missing some JS APIS like fetch


// const os = require('os');
// const path = require('path')
//const math = require('./math')

// const {add, sub, mult, div} = require('./math')

// console.log(os.type())
// console.log(os.totalmem())
// console.log(os.version())
// console.log(os.homedir())

// console.log(__dirname)
// console.log(__filename)

// console.log(path.dirname(__filename))
// console.log(path.basename(__filename))
// console.log(path.extname(__filename))

//console.log(math.add(4,5))

// console.log(add(2,3))
// console.log(mult(2,3))
// console.log(div(2,3))
// console.log(sub(2,3))

 // Creation of a web server with node Js only
 
 const http = require('http');
 const path = require('path');
 const fs = require('fs');
 const fsPromises = require('fs').promises;


 const logEvents = require('./logEvents');
 const EventEmitter = require('events');
 class Emitter extends EventEmitter {};
 // initialize object
 
 const myEmitter = new Emitter();
 myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));
 const PORT = process.env.PORT || 3500;
 
 const serveFile = async(filePath, contentType, response) => {
     try{
         const rawData =  await fsPromises.readFile(
             filePath, 
             !contentType.includes('image') ? 'utf8' : '');
         const data = contentType === "application/json" ? JSON.parse(rawData) : rawData;
         response.writeHead(
             filePath.includes('404.html') ? 404 : 200, 
             {'Content-Type': contentType}
             );
         response.end(
             contentType === 'application/json' ? JSON.stringify(data) : data
         );

     } catch (err) {
         console.log(err);
         myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
         response.statusCode = 500;
         response.end();
     }
 }
 const server = http.createServer((req, res) => {
     console.log(req.url, req.method);
     myEmitter.emit('log', `${req.url}: ${req.method}`, 'reqLog.txt') 

     const extension = path.extname(req.url);

     let contentType;

     switch (extension){
        case '.css':
             contentType = 'text/css';
             break;
        case '.js':
             contentType = 'text/javascript';
             break;
        case '.json':
            contentType = 'Application/json';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.png':
            contentType = 'image/png';   
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
     }

     let filePath = 
       contentType === 'text/html' && req.url === '/'
       ? path.join(__dirname, 'views', 'index.html')
       : contentType === 'text/html' && req.url.slice(-1) == '/'
       ? path.join(__dirname, 'views', req.url, 'index.html')
       : contentType === 'text/html'
       ?path.join(__dirname, 'views', req.url)
       : path.join(__dirname, req.url);

    // makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if (fileExists){
        // serve the file

        serveFile(filePath, contentType, res);
    } else{
      switch(path.parse(filePath).base){
        case 'old-page.html':
            res.writeHead(301, {'Location':'/new-page-html'});
            res.end();
            break;
        case 'www-page.html':
           res.writeHead(301, {'Location':'/'});
           res.end();
           break;
        default:
            //serve a 404 response
            serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
      }
    }
 });

 server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//  // add listener for the log event
//  myEmitter.on('log', (msg) => logEvents(msg));

//  setTimeout(() => {
//      // Emit event
//      myEmitter.emit('log', 'Log event emitted!');
//  }, 2000);