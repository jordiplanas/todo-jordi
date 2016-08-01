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
	var where = {};

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === "true") {
		where.completed = true;
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === "false") {
		where.completed = false;
	}
	if (queryParams.hasOwnProperty('q') && _.isString(queryParams.q) && queryParams.q.trim().length > 0) {
		where.description = {
			$like: '%' + queryParams.q + '%'
		};
	}

	db.todo.findAll({
			where: where
		}).then(function(todos) {
			res.json(todos);
		}, function(e) {
			res.status(500).send();
		})
		// var filtered = todos;
		// if (queryParams.hasOwnProperty('completed') && queryParams.completed === "true") {
		// 	filtered = _.where(filtered, {
		// 		"completed": true
		// 	});
		// } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === "false") {
		// 	filtered = _.where(filtered, {
		// 		"completed": false
		// 	});

	// }
	// if (queryParams.hasOwnProperty('q') && _.isString(queryParams.q) && queryParams.q.trim().length > 0) {
	// 	var keyword = queryParams.q;
	// 	filtered = _.filter(filtered, function(todo) {
	// 		return todo.description.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
	// 	});
	// }
	// res.json(filtered);

});

//GET /TODOS/:ID
app.get('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);
	// var matched = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (matched) {
	// 	res.json(matched);
	// } else {
	// 	res.status(404).send();
	// }
	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.status(200).json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).json(e);
	});

});

////POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	db.todo.create(body).then(function(todo) {
		return res.status(200).json(todo.toJSON());
		//console.log(todo.asJSON());
	}, function(e) {
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

	db.todo.destroy({
			where: {
				id: deleteId
			}
		}).then(function(rowdeleted) {
			if (rowdeleted === 0) {
				res.status(404).json({
					error: "no id"
				});
			} else {
				res.status(204).send();
			}
		}, function(e) {
			res.status(500).send();
		})
		// var matched = _.findWhere(todos, {
		// 	id: deleteId
		// });
		// if (!matched) {
		// 	res.status(404).json({
		// 		"error": "no ttod found with id"
		// 	});
		// } else {
		// 	todos = _.without(todos, matched);
		// 	res.json(matched);
		// }


});
//APA PUT
app.put('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var atributes = {};


	if (body.hasOwnProperty('completed')) {
		atributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		atributes.description = body.description;
	}

	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			todo.update(atributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}

	},
	function() {
		res.status(500).send();
	})
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening  on : ' + PORT);
	});
});