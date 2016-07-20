var express= require('express');
var app=express();
var PORT= 4000 || process.env.PORT;

app.get('/public',function (req,res){
	res.send('todo api root');
});

app.listen(PORT,function(){
	console.log('Express listening  on : '+PORT);
})
