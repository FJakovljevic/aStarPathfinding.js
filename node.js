class Node {
	constructor(type){
		this._startDist = 10000000000;  //path distance from start
		this._endDist;  //path distance to end
		this._eval;  //added startDist and endDist (evalueted cost of path)
		this._type = type  // 0-can walk; 1-wall; 3-start; 5-end;
		this._parent = { };
	}

	set startDist(distance){
		this._startDist = distance;
		this._eval = this._startDist + this._endDist;
	}
	set endDist(distance){
		this._endDist = distance;
	}
	set type(type){
		this._type = type;
	}
	set parent(nodePos){
		this._parent.x = nodePos.x;
		this._parent.y = nodePos.y;
	}

	get startDist(){
		return this._startDist;
	}
	get endDist(){
		return this._endDist;
	}
	get eval(){
		return this._eval;
	}
	get type(){
		return this._type;
	}
	get parent(){
		return {x:this._parent.x, y:this._parent.y};
	}


}