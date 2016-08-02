var express = require('express');
var bodyparser = require('body-parser');
var _ = require("underscore")
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 4000;
var todos = [];
var id = 1;

app.use(bodyparser.json());

app.get('/', function(req, res) {
	res.send('todo api root');
});

///GET/TODOS

app.get('/todos', middleware.requireAuthentication, function(req, res) {
	var queryParams = req.query;
	var where = {
		userId:req.user.get('id')

	};

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
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {

	var todoId = parseInt(req.params.id, 10);

	db.todo.findOne({where:{
		id:todoId,
		userId:req.user.get('id')

	}}).then(function(todo) {
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
app.post('/todos', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	db.todo.create(body).then(function(todo) {
		//return res.status(200).json(todo.toJSON());
		req.user.addTodo(todo).then(function() {
			return todo.reload();
		}).then(function(todo) {
			res.json(todo.toJSON());
		});
	}, function(e) {
		return res.status(400).json(e);
	});



});
//DELETE /TODOS/:ID
app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var deleteId = parseInt(req.params.id, 10);

	db.todo.destroy({
			where: {
				id: deleteId,
				userId:req.user.get('id')
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
app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {

	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var atributes = {};


	if (body.hasOwnProperty('completed')) {
		atributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		atributes.description = body.description;
	}

	db.todo.findOne({
		where:{
			id:todoId,
			userId:req.user.get('id')
		}}).then(function(todo) {
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

///////////////UDERS////////

app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	db.user.create(body).then(function(user) {
		return res.status(200).json(user.toPublicJSON());
		//console.log(todo.asJSON());
	}, function(e) {
		return res.status(400).json(e);
	});

});


///POST/USERS/LOGINS
app.post('/users/login', function(req, res) {

	var body = _.pick(req.body, 'email', 'password');
	db.user.authenticate(body).then(function(user) {
			var token = user.generateToken('authentication');
			if (token) {
				res.header('Auth', token).json(user.toPublicJSON());
			} else {
				res.status(401).send();
			}

		},
		function(e) {
			res.status(401).send();
		});

});



db.sequelize.sync({
	//force: true
}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening  on : ' + PORT);
	});
});