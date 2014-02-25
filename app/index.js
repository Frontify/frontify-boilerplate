var express = require('express');
var connect = require('connect');
var app = express();
var ejs = require('ejs');

app.use(connect.compress());
app.configure(function () {
    app.use("/api/", express.static(__dirname + '/api/'));
    app.use("/assets/", express.static(__dirname + '/assets/'));
});

app.set('views', './app/views');
app.set('view engine', 'html');
app.engine('html', ejs.__express);
app.disable('view cache');
app.get('/', function (req, res){ 
    var data = {};
    res.render('index', data);
});

app.listen(3000); //the port you want to use