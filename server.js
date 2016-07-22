var express= require('express');
var bodyparser=require('body-parser');
var app=express();
var PORT= process.env.PORT || 4000;
var todos =[];
var id = 1;

app.use(bodyparser.json());

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

////POST /todos
app.post('/todos',function (req ,res){
	var body=req.body;
	//console.log(typeof body);
	res.json(body);
	todos.push(body);

});

app.listen(PORT,function(){
	console.log('Express listening  on : '+PORT);
})
