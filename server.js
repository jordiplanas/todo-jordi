var express= require('express');
var bodyparser=require('body-parser');
var _= require("underscore")
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
	var matched= _.findWhere(todos,{id:todoId});

	if(matched){
		res.json(matched);
	}else{
			res.status(404).send();
		}
	
});

////POST /todos
app.post('/todos',function (req ,res){
	var body=_.pick(req.body,'description','completed');

	if(!_.isBoolean(body.completed)||!_.isString(body.description)|| body.description.trim().length===0){
		return res.status(400).send();
	}
	body.description=body.description.trim();

	body.id=id++;
	//console.log(typeof body);

	todos.push(body);
	console.log(todos);
	res.json(body);

});
//DELETE /TODOS/:ID
app.delete('/todos/:id', function (req,res){
	var deleteId=parseInt(req.params.id,10);
	var matched= _.findWhere(todos,{id:deleteId});
	if(!matched){
		res.status(404.json({"error":"no ttod found with id"}))
	}else{
	todos=_.without(todos,matched);
	res.json(matched);
	}


});

app.listen(PORT,function(){
	console.log('Express listening  on : '+PORT);
})
