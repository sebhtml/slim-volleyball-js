/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */



Sky=function(){
}

Sky.prototype.animate=function(){
}

Sky.prototype.draw=function(canvas){

	var context=canvas.getContext("2d");
	
	context.fillStyle = "rgb(200,200,255)";
	var canvasHeight=canvas.height;
	var canvasWidth=canvas.width;
	context.fillRect(0,0,canvasWidth,canvasHeight)

}
