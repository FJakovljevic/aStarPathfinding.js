const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const tilesSize = 15; 
const widthNumber = canvas.scrollWidth/tilesSize;
const heightNumber = canvas.scrollHeight/tilesSize;
let matrix = [];  // matrix of all possible nodes
let intialize = 0; // if 0 then we need start if 1 then we need finish
let startNode = { };  // node from which we start the search
let endCordinates = { };  // cordinates of finish
let evalueted = [];  // nodes that are going to be considered as next
let checked = [];  // already visited nodes (wont go there again)

const createMatrix = () => {
	for (var i = 0; i < heightNumber; i++) {
		let helper = [];
  		for (var j = 0; j < widthNumber; j++) {
  			if(j == 0 || j+1 == widthNumber){
  				helper[j] = new Node(1);
  			}else{
  				helper[j] = new Node(Math.round(Math.random()-0.2));
			}
		}
		matrix[i] = helper;
	}

	matrix[0].map(node => node.type = 1);
	matrix[matrix.length-1].map(node => node.type = 1);
}

const draw = () => {
 	 for (let i = 0; i < heightNumber; i++) {
  		for (let j = 0; j < widthNumber; j++) {
	  		ctx.fillStyle = '#211f1f';
	  		ctx.fillRect(tilesSize*j, tilesSize*i, tilesSize, tilesSize);
  			if(matrix[i][j].type == 0){
  				ctx.fillStyle = 'gray';
  				ctx.fillRect(tilesSize*j, tilesSize*i, tilesSize-0.5, tilesSize-0.5);
  			}else if (matrix[i][j].type == 3){
  				ctx.fillStyle = 'green';
  				ctx.fillRect(tilesSize*j, tilesSize*i, tilesSize-0.5, tilesSize-0.5);
  			}
  		}
  	}
}

const distBetweenNodes =  parent => node => {
	return (Math.abs(parent.x - node.x) + Math.abs(parent.y - node.y))*tilesSize;
}

const fillData = y => x => parent => {
	if(!checked.some(node => node.x == x && node.y == y)){
		if(matrix[y][x].type !=  1 && (tilesSize + matrix[parent.y][parent.x].startDist) < matrix[y][x].startDist){
			matrix[y][x].endDist = distBetweenNodes(parent)(endCordinates);
			matrix[y][x].startDist = tilesSize + matrix[parent.y][parent.x].startDist;
			matrix[y][x].parent = parent;
			ctx.fillStyle = '#cff779';
			ctx.fillRect(tilesSize*x, tilesSize*y, tilesSize-0.5, tilesSize-0.5);
			evalueted.push({x:x, y:y});
		}
	}
}

const evaluete = parent => {
	fillData(parent.y + 1)(parent.x)(parent);
	fillData(parent.y)(parent.x - 1)(parent);
	fillData(parent.y - 1)(parent.x)(parent);
	fillData(parent.y)(parent.x + 1)(parent);
}

const start = () => {

	checked.push(startNode);
	evaluete(startNode);
	if(evalueted.length == 0){
		alert("No possible path");
		return;
	}
	var next = evalueted.reduce((a, b) => matrix[a.y][a.x].eval<matrix[b.y][b.x].eval?a:b);
	evalueted.splice(evalueted.indexOf(next), 1);
	checked.push(next);
	var noPath = false;
	
	while(!(next.x == endCordinates.x && next.y == endCordinates.y)){

		evaluete(next);
		if(evalueted.length == 0){
			alert("No possible path");
			noPath = true;
			break;
		}
		var next = evalueted.reduce((a, b) => matrix[a.y][a.x].eval<matrix[b.y][b.x].eval?a:b);
		checked.push(next);
		evalueted.splice(evalueted.indexOf(next), 1);
	}

	// colors the founded path
	ctx.fillStyle = 'red';
	ctx.fillRect(endCordinates.x*tilesSize, endCordinates.y*tilesSize, tilesSize-0.5, tilesSize-0.5);
	var parent = matrix[endCordinates.y][endCordinates.x].parent;
	if(!noPath){
		while(!(parent.x == startNode.x && parent.y == startNode.y)){
			ctx.fillStyle = '#59bf22';
			ctx.fillRect(parent.x*tilesSize+0.5, parent.y*tilesSize+0.5, tilesSize-2, tilesSize-2);
			parent = matrix[parent.y][parent.x].parent;
		}
	}
}
// fills data for start point and colors it in green
const makeStart = (i) => (j) => { 
	if(matrix[i][j].type == 0){
	 	matrix[i][j].type = 3;
	 	matrix[i][j].startDist = 0;
	 	ctx.fillStyle = 'green';
	 	ctx.fillRect(tilesSize*j, tilesSize*i, tilesSize-0.5, tilesSize-0.5);
	 	intialize++;
	 	startNode = {x:j, y:i};
	 }
}
// fills data for end point and colors it in red and starts the A* 
const makeFinish = (i) => (j) => { 
	if(matrix[i][j].type == 0 && intialize == 1){
	 	matrix[i][j].type = 5;
	 	ctx.fillStyle = 'red';
	 	ctx.fillRect(tilesSize*j, tilesSize*i, tilesSize-0.5, tilesSize-0.5);
	 	intialize++;
	 	endCordinates = {x:j, y:i};
	 	start();
	}
}
// click event for initializing start and end point
canvas.addEventListener('click', (e) => {
	 const pos = {x: e.clientX, y: e.clientY};
	 let j = Math.floor(pos.x/tilesSize);
	 let i = Math.floor(pos.y/tilesSize);
	 intialize==0?makeStart(i)(j):makeFinish(i)(j);
});

canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;
createMatrix();
draw();