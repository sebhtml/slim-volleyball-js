/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */



Wall=function(x1,y1,x2,y2,x3,y3,x4,y4){

	this.m_x1=x1;
	this.m_y1=y1;
	this.m_x2=x2;
	this.m_y2=y2;
	this.m_x3=x3;
	this.m_y3=y3;
	this.m_x4=x4;
	this.m_y4=y4;

	this.m_isGoal=false;

	this.m_explosion=0;
}

Wall.prototype.setGoal=function(){
	this.m_isGoal=true;
}

Wall.prototype.isGoal=function(){
	return this.m_isGoal;
}

Wall.prototype.animate=function(){
}

Wall.prototype.draw=function(canvas){

	var context=canvas.getContext("2d");
	
	context.fillStyle = "rgb(150,29,28)";
	if(this.m_isGoal)
		context.fillStyle="#4AA02C";

	if(this.m_explosion>0){
		if(this.m_explosion>25){
			context.fillStyle = "rgb(255,255,64)";
		}else{
			context.fillStyle = "rgb(255,128,64)";
		}
	}


	context.beginPath();
	context.moveTo(this.m_x1,this.m_y1);
	context.lineTo(this.m_x2,this.m_y2);
	context.lineTo(this.m_x3,this.m_y3);
	context.lineTo(this.m_x4,this.m_y4);
	context.lineTo(this.m_x1,this.m_y1);
	context.fill();
	context.closePath();

	if(this.m_explosion>0)
		this.m_explosion--;
}

Wall.prototype.detectCollision=function(object){
	//collision=detectCollisionWithLine(this.m_x1,this.m_y1,this.m_x2,this.m_y2);
}

Wall.prototype.detectCollisionWithCircle=function(x,y,radius){
	var collision=new Collision();

	collision.detectCollisionBetweenLineAndCircle(this.m_x1,this.m_y1,this.m_x2,this.m_y2,x,y,radius);
	if(collision.collisionDetected())
		return collision;

	collision.detectCollisionBetweenLineAndCircle(this.m_x2,this.m_y2,this.m_x3,this.m_y3,x,y,radius);
	if(collision.collisionDetected())
		return collision;
	
	collision.detectCollisionBetweenLineAndCircle(this.m_x3,this.m_y3,this.m_x4,this.m_y4,x,y,radius);
	if(collision.collisionDetected())
		return collision;

	collision.detectCollisionBetweenLineAndCircle(this.m_x4,this.m_y4,this.m_x1,this.m_y1,x,y,radius);
	if(collision.collisionDetected())
		return collision;

	collision.detectCollisionBetweenPointAndCircle(this.m_x1,this.m_y1,x,y,radius);
	if(collision.collisionDetected())
		return collision;
	collision.detectCollisionBetweenPointAndCircle(this.m_x2,this.m_y2,x,y,radius);
	if(collision.collisionDetected())
		return collision;
	collision.detectCollisionBetweenPointAndCircle(this.m_x3,this.m_y3,x,y,radius);
	if(collision.collisionDetected())
		return collision;
	collision.detectCollisionBetweenPointAndCircle(this.m_x4,this.m_y4,x,y,radius);
	if(collision.collisionDetected())
		return collision;

	return collision;
}

Wall.prototype.enforceBoundaries=function(x1,y1,x2,y2,x3,y3,x4,y4){

}

Wall.prototype.explose=function(){
	this.m_explosion=30;
}
