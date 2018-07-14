var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const haravan = require('./routes/haravan');

//SSH
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('./server.key', 'utf8');
var certificate = fs.readFileSync('./server.crt', 'utf8');

var credentials = { key: privateKey, cert: certificate };

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', haravan);

app.get('/api/customers', (req, res) => {
    const customers = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Brad', lastName: 'Traversy' },
        { id: 3, firstName: 'Mary', lastName: 'Swanson' },
    ];

    res.json(customers);
});


const port = 5000;

//app.listen(port, () => `Server running on port ${port}`);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(port);
httpsServer.listen(5001);