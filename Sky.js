/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */



Sky=function(x,y){
	this.m_x=x;
	this.m_y=y;
}

Sky.prototype.draw=function(canvas){

	var context=canvas.getContext("2d");
	
	context.fillStyle = "rgb(200,200,255)";
	var canvasHeight=canvas.height;
	var canvasWidth=canvas.width;
	context.fillRect(0,0,canvasWidth,canvasHeight)


	context.fillStyle    = '#000000';
	context.font         = 'bold 50px sans-serif';
	context.fillText("Slim Volleyball in javascript", this.m_x, this.m_y);
}
