/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */



Ball=function(x,y,speedX,speedY,radius){
	this.m_x=x;
	this.m_y=y;

	this.m_speedX=speedX;
	this.m_speedY=speedY;

	this.m_isMoving=speedX!=0 || speedY!=0;
	this.m_radius=radius;

	this.m_collisions=0;

	this.m_explosion=0;
}

Ball.prototype.animate=function(){
	// move the ball
	this.m_x += this.m_speedX;
	this.m_y += this.m_speedY;
}

Ball.prototype.draw=function(canvas){

	var context=canvas.getContext("2d");

	if(this.m_explosion>0){
		if(this.m_explosion>25){
			context.fillStyle = "rgb(255,255,64)";
			context.beginPath();
			context.arc(this.m_x,this.m_y, this.m_radius+20, 0, Math.PI*2, true);
			context.closePath();
			context.fill();

		}
		context.fillStyle = "rgb(255,128,64)";
		context.beginPath();
		context.arc(this.m_x,this.m_y, this.m_radius+5, 0, Math.PI*2, true);
		context.closePath();
		context.fill();

		this.m_explosion--;
	}

	context.fillStyle = "rgb(28,29,150)";
	context.beginPath();
	context.arc(this.m_x,this.m_y, this.m_radius, 0, Math.PI*2, true);
	context.closePath();
	context.fill();

}

Ball.prototype.detectCollision=function(object){
	if(!this.m_isMoving)
		return;

	collision=object.detectCollisionWithCircle(this.m_x,this.m_y,this.m_radius);

	if(collision.collisionDetected()){
		var newSpeed=collision.computeNewVector(this.m_speedX,this.m_speedY,this.m_x,this.m_y,collision.getX(),collision.getY());
		this.m_speedX = newSpeed[0];
		this.m_speedY = newSpeed[1];

		this.m_collisions++;

		collision2=object.detectCollisionWithCircle(this.m_x+this.m_speedX,this.m_y+this.m_speedY,this.m_radius);

		if(collision2.collisionDetected()){
			//console.log("Collision problem...");
			this.animate();
			this.animate();
			this.animate();
		}

		//console.log("New speed "+this.m_speedX+" "+this.m_speedY);

		this.m_explosion=30;

		this.callbackForScore(this.m_x,this.m_y,object);
	}
}

Ball.prototype.setCallbackForScore=function(callback){
	this.callbackForScore=callback;
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

Ball.prototype.isMoving=function(){
	return this.m_isMoving;
}

Ball.prototype.enforceBoundaries=function(x1,y1,x2,y2,x3,y3,x4,y4){

}

Ball.prototype.getX=function(){
	return this.m_x;
}

Ball.prototype.getY=function(){
	return this.m_y;
}

Ball.prototype.getSpeedX=function(){
	return this.m_speedX;
}

Ball.prototype.getSpeedY=function(){
	return this.m_speedY;
}

Ball.prototype.getNumberOfCollisions=function(){
	return this.m_collisions;
}

