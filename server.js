var express = require('express');
var bodyparser = require('body-parser');
var _ = require("underscore")
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 4000;
var todos = [];
var id = 1;

app.use(bodyparser.json());

app.get('/', function(req, res) {
	res.send('todo api root');
});

///GET/TODOS

app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filtered = todos;
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === "true") {
		filtered = _.where(filtered, {
			"completed": true
		});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === "false") {
		filtered = _.where(filtered, {
			"completed": false
		});

	}
	if (queryParams.hasOwnProperty('q') && _.isString(queryParams.q) && queryParams.q.trim().length > 0) {
		var keyword = queryParams.q;
		filtered = _.filter(filtered, function(todo) {
			return todo.description.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
		});
	}
	res.json(filtered);

});

//GET /TODOS/:ID
app.get('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);
	var matched = _.findWhere(todos, {
		id: todoId
	});

	if (matched) {
		res.json(matched);
	} else {
		res.status(404).send();
	}

});

////POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	db.todo.create(body).then(function (todo){
		return res.status(200).json(todo.toJSON());
		//console.log(todo.asJSON());
	}, function (e){
		return res.status(400).json(e);
	});



	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send();
	// }
	// body.description = body.description.trim();

	// body.id = id++;
	// //console.log(typeof body);

	// todos.push(body);
	// console.log(todos);
	// res.json(body);

});
//DELETE /TODOS/:ID
app.delete('/todos/:id', function(req, res) {
	var deleteId = parseInt(req.params.id, 10);
	var matched = _.findWhere(todos, {
		id: deleteId
	});
	if (!matched) {
		res.status(404).json({
			"error": "no ttod found with id"
		});
	} else {
		todos = _.without(todos, matched);
		res.json(matched);
	}


});
//APA PUT
app.put('/todos/:id', function(req, res) {
	var deleteId = parseInt(req.params.id, 10);
	var matched = _.findWhere(todos, {
		id: deleteId
	});
	var body = _.pick(req.body, 'description', 'completed');
	var validAtributes = {};
	if (!matched) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAtributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(404).send();

	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAtributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(404).send();
	}

	_.extend(matched, validAtributes);
	res.json(matched);



});
db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening  on : ' + PORT);
	});
});