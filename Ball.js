/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */



Ball=function(x,y,speedX,speedY){
	this.m_x=x;
	this.m_y=y;

	this.m_speedX=speedX;
	this.m_speedY=speedY;

	this.m_radius=32;
}

Ball.prototype.animate=function(){
	// move the ball
	this.m_x += this.m_speedX;
	this.m_y += this.m_speedY;

	// apply gravity
}

Ball.prototype.draw=function(canvas){

	var context=canvas.getContext("2d");

	context.fillStyle = "rgb(28,29,150)";

	context.beginPath();
	context.arc(this.m_x,this.m_y, this.m_radius, 0, Math.PI*2, true);
	context.closePath();
	context.fill();

}

Ball.prototype.detectCollision=function(object){
	collision=object.detectCollisionWithCircle(this.m_x,this.m_y,this.m_radius);

	if(collision.collisionDetected()){
		var newSpeed=collision.computeNewVector(this.m_speedX,this.m_speedY,this.m_x,this.m_y,collision.getX(),collision.getY());
		this.m_speedX = newSpeed[0];
		this.m_speedY = newSpeed[1];

		//console.log("New speed "+this.m_speedX+" "+this.m_speedY);
	}
}

Ball.prototype.detectCollisionWithCircle=function(x,y,radius){
	var collision=new Collision();
	collision.detectCollisionBetweenCircles(this.m_x,this.m_y,this.m_radius,x,y,radius);
	return collision;
}

Ball.prototype.applyGravity=function(gravity){
	this.m_speedY += gravity;
}

Ball.prototype.detectCollisionWithLine=function(x1,y1,x2,y2){

	var collision=new Collision();
	collision.detectCollisionBetweenLineAndCircle(x1,y1,x2,y2,this.m_x,this.m_y,this.m_radius);
	return collision;
}
