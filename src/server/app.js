var express = require('express');
var path = require('path');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');

var app = express();
app.set('port', (process.env.PORT || 5050));

app.use('/', express.static(__dirname + '/../../dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));


// all other routes are handled by Angular
app.get('/*', function(req, res) {
    var indexPath = path.join(__dirname,'/../../dist/index.html');
    console.log(indexPath);
    res.sendFile(indexPath);
});

app.listen(app.get('port'), function() {
    console.log('Angular 2 Full Stack listening on port '+app.get('port'));
});

module.exports = app;