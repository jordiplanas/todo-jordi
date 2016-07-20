var express= require('express');
var app=express();
var PORT= process.env.PORT || 4000;
var todos =[{
	id: 1,
	description:"fer lou",
	completed:false
},{
	id: 2,
	description:"caçar un pikachu",
	completed:false
},{
	id: 3,
	description:"pillar pokebols",
	completed:true
}];


app.get('/',function (req,res){
	res.send('todo api root');
});

///GET/TODOS

app.get('/todos', function (req,res){
	res.json(todos);
});

//GET /TODOS/:ID
app.get('/todos/:id', function (req,res){
	
	var todoId=parseInt(req.params.id,10);
	var matched;

	todos.forEach(function(todo){
		if(todo.id===todoId){
			matched=todo;
		}
	});

	if(matched){
		res.json(matched);
	}else{
			res.status(404).send();
		}
	
});

app.listen(PORT,function(){
	console.log('Express listening  on : '+PORT);
})
