/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */



Ball=function(x,y,speedX,speedY){
	this.m_x=x;
	this.m_y=y;

	this.m_speedX=speedX;
	this.m_speedY=speedY;

	this.m_gravity=3;
}

Ball.prototype.animate=function(){
	// move the ball
	this.m_x += this.m_speedX;
	this.m_y += this.m_speedY;

	// apply gravity
	
	this.m_speedY += this.m_gravity;
}

Ball.prototype.draw=function(canvas){

	var context=canvas.getContext("2d");

	context.fillStyle = "rgb(28,29,150)";

	context.beginPath();
	context.arc(this.m_x,this.m_y, 10, 0, Math.PI*2, true);
	context.closePath();
	context.fill();

}
