//require('newrelic');
var express = require('express');
var app = express();
var router = express.Router();

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var config = require('./config/config');


// set up our express application
app.use(morgan((config.env === 'dev') ? 'dev' : 'tiny')); // log every request to the console

app.use(bodyParser.json()); // get information from html forms
app.use(methodOverride()); // simulate DELETE and PUT
app.use(cookieParser('')); // read cookies (needed for auth)

// Initialize routes
require('./app/routes.js')(router);
app.use('/api', router);


app.listen(config.httpPort, function () {
    console.log('J316 organizer backend app is running on port', config.httpPort);
});


