/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */



Floor=function(height){
	this.m_height=height;
}

Floor.prototype.animate=function(){
}

Floor.prototype.draw=function(canvas){

	var context=canvas.getContext("2d");
	
	context.fillStyle = "rgb(150,29,28)";
	var canvasHeight=canvas.height;
	var canvasWidth=canvas.width;
	context.fillRect(0,canvasHeight-this.m_height,canvasWidth,canvasHeight)
}
