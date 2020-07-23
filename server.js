
const http = require('http');
const fs = require('fs');
//Helper function for sending 404 message
function send404(response) {
	response.writeHead(404, { 'Content-Type': 'text/plain' });
	response.write('Error 404: Resource not found.');
	response.end();
}

const server = http.createServer(function (request, response) {
	console.log(request.url);

	if(request.method === "GET"){
		if(request.url === "/" || request.url === "/todo.html"){
			//read the todo.html file and send it back
			fs.readFile("todo.html", function(err, data){
				if(err){
					response.statusCode = 500;
					response.write("Server error.");
					response.end();
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/html");
				response.write(data);
				response.end();
			});
		}else if(request.url === "/todo.js"){
			//read todo.js file and send it back
			fs.readFile("todo.js", function(err, data){
				if(err){
					response.statusCode = 500;
					response.write("Server error.");
					response.end();
					return;
				}
				response.statusCode = 200;
				response.setHeader("Content-Type", "application/javascript");
				response.write(data);
				response.end();
			});
			
		//Add any more 'routes' and their handling code here
		//e.g., GET requests for "/list", POST request to "/list"
		}
		
		else{
			response.statusCode = 404;
			response.write("Unknwn resource.");
			response.end();
		}
	}else if(request.method === "POST"){
		//any handling in here
		response.statusCode = 404;
		response.write("Unknwn resource.");
		response.end();
	}
});
server.listen(3000);
console.log('server running on port 3000');

// implement socket
const io = require("socket.io")(server);
// default data
let de_items = [{Name: "Mike", toggled: false},{Name: "Bob", toggled: false},{Name: "Rachel", toggled: false}];
let tmpa = []
for(let i=0;i<de_items.length;i++){
	tmpa[i] = de_items[i].Name;
}
io.on('connection', socket =>{
	//check if conencting sucessfully
	console.log("A connection was made.");
	socket.on('int', () => {
		socket.emit('int',de_items)
	})
	// if disconnect
	socket.on('disconnect', () => {
		console.log("Somebody left.");
	})
	// add item
  socket.on('add',item => {
      console.log(item + " has been added");
			// add item in the default array
			de_items.push(item);
			// send message to client side and return the updated array
			io.emit('add',de_items);
	})
	// remove item
	socket.on('remove',arr1 => {
		console.log(arr1);
		for( i = 0; i < arr1.length; i++){
			for( j = 0;j<de_items.length;j++){
				if(arr1[i]===de_items[j].Name){
					de_items.splice(j,1);
				}
			}
		}
		// end message to client side and return the updated array
		io.emit('remove',de_items);
	})
	
	socket.on('highlight',arr1 => {
		console.log(arr1);
		for( i = 0; i < arr1.length; i++){
			for( j = 0;j<de_items.length;j++){
				if(arr1[i]===de_items[j].Name){
					if(de_items[j].toggled){
						de_items[j].toggled=false
					}
					else{
						de_items[j].toggled=true
					}
				}
			}
		}
		io.emit('highlight',de_items);
	})

});
