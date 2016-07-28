var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/db.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({
	force: true
}).then(function() {
	console.log('everithing is syncro');
	/*Todo.create({
		description: "Walk dog",
		completed: false
	}).then(function(todo) {
		console.log('finished');
	}).catch( function (e){
		console.log(e);
	})
	Todo.create({
		description: " pillar pokemons tochus",
		completed: false
	}).then(function(todo) {
		return Todo.create({
			description: "pillar un pikachu",
			completed: true,
		});
	}).then(function() {
			var complet = Todo.findAll({
				where: {
					id: 1
				}
			}).then(function(todo) {
					if (todo) {
						todo.forEach(function(t){
							console.log(t.toJSON());
						});

						
					}
					
				
			});


	});*/
Todo.create({
 description: "pillar pokebols",
 completed:true

}).then(function (todo){
	return Todo.create({
		description: "pillar Droja",
		completed:false
	})
})

Todo.findAll({
			where: {
				completed: true
			}
		}).then( function (ts){
			if(ts){
				ts.forEach( function(t){
					console.log(t.toJSON())
				});
			}
			
		});




});