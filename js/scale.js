var minScaleFactor = 0.25; //change only if needed to change the scale of zooming


/* Scales function for zoom */
DrawObject.prototype.scale = function (oldScaleFactor, newScaleFactor){

	this.objStartX = (this.objStartX / oldScaleFactor) * newScaleFactor;
	this.objEndX = (this.objEndX / oldScaleFactor) * newScaleFactor;
	this.objStartY = (this.objStartY / oldScaleFactor) * newScaleFactor;
	this.objEndY = (this.objEndY / oldScaleFactor) * newScaleFactor;
	
}

CWall.prototype.scale = function (oldScaleFactor, newScaleFactor){	
	var tmpObjVerticesArr = [];
	for(var i = 0 ; i < this.objVerticesArr.length ; i++){
		tmpObjVerticesArr.push({ x: ((this.objVerticesArr[i].x / oldScaleFactor) * newScaleFactor), y: ( (this.objVerticesArr[i].y / oldScaleFactor) * newScaleFactor)});
	}
	this.objVerticesArr = [];
	this.setVertices(tmpObjVerticesArr);
}







