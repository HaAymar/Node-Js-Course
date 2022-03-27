 const express = require('express');
 const app = express();
 const path = require('path');
 const cors = require('cors')
 const {logger, logEvents} = require('./middleware/logEvents');
 const PORT = process.env.PORT || 3500;

 // custom middleware logger
 app.use(logger);

 //Cross Origin Resource Sharing & Access-control allow origin
const whitelist = ['https://www.yoursite.com','http://127.0.0.1:5500','http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1){
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

//Built in middleware to handle urlencoded data
// in order words, form data:
// content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));// t's form data it's for JSON data 

//built-in middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, '/public'))); // This is for css

app.get('^/$|/index(.html)?', (req, res) => {
     //rs.sendFile('./views/index.html',{root: __direname});
     res.sendFile(path.join(__dirname,'views', 'index.html'));
 });

 app.get('/new-page(.html)?', (req, res) => {
     res.sendFile(path.join(__dirname,'views', 'new-page.html'));
});


app.get('/old-page(.html)?', (req, res) => {
     res.redirect(301,'/new-page.html'); //302 by default
});

// Route handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log('Attempted to load hello.html');
    next()
} , (req, res) => {
    res.send('Hello world!');
})

// changing the route handlers
const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res, next) => {
    console.log('three');
    res.send('Finished');
}

app.get('/chain(.html)?', [one, two, three]);

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
});

 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

 