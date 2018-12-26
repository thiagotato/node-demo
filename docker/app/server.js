var restify = require('restify');
var errors = require('restify-errors');
var mysql = require('mysql');

var port = process.env.NODEJS_API_PORT;
if (!port) {
    port = 8888;
}

var connection = mysql.createConnection({
	host: process.env.NODE_DS,
	user: process.env.NODE_USER,
	password: process.env.NODE_PASS
});

var server = restify.createServer();
server.use(restify.plugins.bodyParser());

var table = "CREATE TABLE IF NOT EXISTS `notes`.`Note` (\n"+
  "`Id` int(11) NOT NULL AUTO_INCREMENT,\n"+
  "`Text` varchar(255) NOT NULL,\n"+
  "`CreateDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n"+
  "PRIMARY KEY (`Id`)\n"+
  ") ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;";

//Create database
connection.query('CREATE DATABASE IF NOT EXISTS notes', function (error, results, fields) {
  if (error) throw error;
  console.log("Database created");
});

//Create table
connection.query(table, function (error, results, fields) {
  if (error) throw error;
  console.log("table created");
});

// get all notes
server.get('/notes', function (request, response, next) {
	connection.query('select * from notes.Note order by Id desc', function (error, results, fields) {
		if (error) { next(error); return; }
		response.end(JSON.stringify(results));
	});
});

// create note
server.post('/notes', function (request, response, next) {
	if(!request.body) { return next(new errors.BadRequestError("texto inválido")); }
	connection.query('insert into notes.Note (Text) values ("?")', [request.body], function (error, results, fields) {
		if (error) { next(error); return; }
		response.end("Ok");
	});
});

// delete note
server.del('/notes/:id', function (request, response, next) {
	var id = request.params.id;
	
	if(!id || id <= 0) { return next(new errors.BadRequestError("id inválido")); }
	
	connection.query('delete from notes.Note WHERE Id=?', [id], function (error, results, fields) {
		if (error) { next(error); return; }
		if(!results.affectedRows) { next(new errors.BadRequestError("id inválido")); return; }
		response.end("Ok");
	});
});

server.listen(port, function () {
	console.log('%s listening at %s', server.name, server.url);
});

module.exports = server;
