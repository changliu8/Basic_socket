
let socket = io('http://localhost:3000');
// recive the return value which is the default array
// this is called when you loading the page
socket.on('int',function(data){
  let list = document.getElementById("todolist");
       updatelist(data);
});
// add item
// recive the return value which is the updated arrray from server after adding item
socket.on('add',function(data){
  document.getElementById("todolist").innerHTML=""
  let list = document.getElementById("todolist");
      updatelist(data);
});
// remove item
//recive the return value which is the updated arrray from server after adding item
socket.on('remove',function(data){
  document.getElementById("todolist").innerHTML=""
  let list = document.getElementById("todolist");
      updatelist(data);
})

socket.on('highlight',function(data){
  document.getElementById("todolist").innerHTML=""
  let list = document.getElementById("todolist");
      updatelist(data);
})
// initialize function when loading page
function int(){
  socket.emit("int") // send a message to server
}
function updatelist(data){
  for(i = 0; i < data.length; i++){
    let input = document.createElement("input");
    input.setAttribute("type","checkbox");
    input.id = data[i].Name;
    let span = document.createElement('SPAN');
    span.innerHTML = data[i].Name;
	if(data[i].toggled){
		span.style.backgroundColor="RED";
	}
	else{
		span.style.backgroundColor="default"
	}
    let br = document.createElement("BR");
    document.getElementById("todolist").appendChild(input);
    document.getElementById("todolist").appendChild(span);
    document.getElementById("todolist").appendChild(br);
  }
}
function Add(){
  let items = document.getElementById("box").value;
  tmp = {Name: items, toggled: false}
  if(items.length > 0){
    socket.emit("add",tmp);
  }else{
    alert("You need add something in box");
  }
}

function Remove(){
  let list = document.getElementById("todolist").children;
    let array=[]; // array is used for storing the checked text
    for(child of list){
          if(child.checked){
            let id = child.id;
            console.log(id);
            array.push(id);
			console.log(id)
          }
     }
     socket.emit("remove",array)
}

function Highlight(){
	let list = document.getElementById("todolist").children;
	//list[1].style.backgroundColor="RED"
    let array=[]; // array is used for storing the checked text
    for(child of list){
          if(child.checked){
            let id = child.id;
            array.push(id);
          }
    }
	socket.emit("highlight",array)
}
