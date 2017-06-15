var http = require('http');
var server = http.createServer();
var models = require('./models');
var app = require('./app')
var Promise = require('bluebird');

server.on('request', app);

//sync creates the table if it does not exist. Force true drops the table first if it exists
//order matters because we cannot drop the User table if there are items in the Page table that reference it
models.Post.sync({ force: false }) //{force: true}
	.then(() => models.Bird.sync({ force: false })) //{force: true}
    .then(function () {
        server.listen(3000, function () {
            console.log('Server is listening on port 3000!');
        });
    })
    .catch(console.error);

