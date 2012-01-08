/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */



Player=function(x,y,radius,player,minX,maxX){
	this.m_x=x;
	this.m_y=y;
	this.m_speedY=0;
	this.m_speedX=0;

	this.m_minX=minX;
	this.m_maxX=maxX;

	this.m_leftPressed=false;
	this.m_rightPressed=false;
	this.m_upPressed=false;
	this.m_radius=radius;

	this.m_x0=x;
	this.m_y0=y;

	this.m_eyeX=this.m_radius/4;
	this.m_eyeY=this.m_radius/3;
	this.m_angry=0;

	this.m_maxSpeed=9;
	this.m_jumpSpeed=10;

	this.m_speedIncrease=this.m_maxSpeed;

	this.m_speedIncrease=3;

	this.m_color="rgb(28,230,150)";

	if(player==2){
		this.m_color="rgb(210,30,150)";
		this.m_speedX=this.m_maxSpeed;
	}

	// ball tracker
	this.m_trackingNumber=-1;

	this.m_waitingSlices=0;

	this.m_score=0;
}

Player.prototype.goLeft=function(){
	if(this.m_speedX>-this.m_maxSpeed){
		if(this.m_speedX>0)
			this.m_speedX=0;
		this.m_speedX-=this.m_speedIncrease;
	}
	if(this.m_speedX>-0.9 && this.m_speedX<0.9)
		this.m_speedX=0;
}

Player.prototype.goRight=function(){
	if(this.m_speedX<this.m_maxSpeed){

		if(this.m_speedX<0)
			this.m_speedX=0;
		this.m_speedX+=this.m_speedIncrease;
	}

	if(this.m_speedX>0.9 && this.m_speedX<0.9)
		this.m_speedX=0;
}

Player.prototype.jump=function(){
	if(this.m_y==this.m_y0){
		this.m_speedY=-this.m_jumpSpeed;
		//console.log("jump");
	}
}

Player.prototype.processKeyboardEvent=function(e){
	var key=e.which;
	var keychar = String.fromCharCode(key);

	if(keychar=="a" ){
		this.goLeft();
	}else if(keychar=="d"){
		this.goRight();
	}else if(keychar=="w"){
		this.jump();
	}

}

Player.prototype.animate=function(){

	this.m_x += this.m_speedX;
	this.m_y += this.m_speedY;

	if(this.m_y>this.m_y0){
		this.m_y=this.m_y0;
		this.m_speedY=0;
	}

	var width=16;
	// fix buggy collisions
	if((this.m_x-this.m_radius)<(this.m_minX-width)){
		this.m_x=this.m_minX+this.m_radius+1;
		this.m_speedX=0;
		this.m_speedY=0;

		//console.log("Fixing on the left");
	}

	// fix buggy collisions
	if((this.m_x+this.m_radius) >(this.m_maxX+width)){
		this.m_x=this.m_maxX-this.m_radius-1;
		this.m_speedX=0;
		this.m_speedY=0;

		//console.log("Fixing on the right");
	}
}

Player.prototype.draw=function(canvas){

	var context=canvas.getContext("2d");

	context.fillStyle = this.m_color;

	context.beginPath();
	context.arc(this.m_x,this.m_y, this.m_radius, 0, Math.PI*2, true);
	context.closePath();
	context.fill();

	if(this.m_angry>0){
		this.drawAngryFace(context);
		this.m_angry--;
	}else{
		this.drawFace(context);
	}
}

Player.prototype.detectCollision=function(object){

	collision=object.detectCollisionWithCircle(this.m_x,this.m_y,this.m_radius);

	if(collision.collisionDetected()){
		var newSpeed=collision.computeNewVector(this.m_speedX,this.m_speedY,this.m_x,this.m_y,collision.getX(),collision.getY());
		this.m_speedX = newSpeed[0];
		this.m_speedY= newSpeed[1];
		//console.log("New speed "+this.m_speedX+" "+this.m_speedY);

		this.m_angry=16;
	}
}

Player.prototype.detectCollisionWithCircle=function(x,y,radius){
	var collision=new Collision();
	collision.detectCollisionBetweenCircles(this.m_x,this.m_y,this.m_radius,x,y,radius);
	return collision;
}

Player.prototype.detectCollisionWithLine=function(x1,y1,x2,y2){
}

Player.prototype.applyGravity=function(gravity){
	this.m_speedY += gravity;

	this.m_gravity=gravity;
}

Player.prototype.enforceBoundaries=function(x1,y1,x2,y2,x3,y3,x4,y4){

}

// the computer can call goLeft, goRight or jump
// choices are:
// - 0 nothing
// - 1 goLeft
// - 2 goLeft+jump
// - 3 jump
// - 4 goRight
// - 5 goRight+jump
Player.prototype.play=function(ball){

	if(this.m_trackingNumber!=ball.getNumberOfCollisions()){
		this.m_trackingNumber=ball.getNumberOfCollisions();
		//console.log("Tracking "+this.m_trackingNumber);
		this.m_ballX=ball.getX();
		this.m_ballY=ball.getY();
		this.m_ballSpeedX=ball.getSpeedX();
		this.m_ballSpeedY=ball.getSpeedY();
		this.m_numberOfComputedMoves=0;
		this.m_bestMove=-1;
	}else if(!this.foundBallDestination()){
		//console.log("Finding ball destination");
		var i=10*200;

		while(i>0 && !this.foundBallDestination()){
			this.findBallDestination();
			i--;
		}

		//console.log("Self: "+this.m_x+" "+this.m_y+" Ball: "+this.m_ballX+" "+this.m_ballY+" FoundDestination= "+this.foundBallDestination());

	}else if(this.foundBallDestination() && !this.calculatedMoves()){
		this.calculateMoves();
	}else if(this.calculatedMoves()){
		this.playMove();
	}

	if(this.m_waitingSlices>0)
		this.m_waitingSlices--;
}

Player.prototype.foundBallDestination=function(){
	return (this.m_y - this.m_ballY) < 25;
}

// find where the ball will arrive
Player.prototype.findBallDestination=function(){
	this.m_ballX += this.m_ballSpeedX;
	this.m_ballY += this.m_ballSpeedY;
	this.m_ballSpeedY+=this.m_gravity;
}

Player.prototype.calculateMoves=function(){
	// do nothing because the ball is not coming on my side
	if(false && !(this.m_minX <= this.m_ballX && this.m_ballX <= this.m_maxX)){
		this.m_finalBestMove=0;
		this.m_numberOfComputedMoves=6;
		return;
	}

	var stepping=this.m_radius;
	var tool=new Collision();

	var xModifier=0;//-this.m_radius/4;
	var yModifier=0;//-this.m_radius/2;

	if(this.m_numberOfComputedMoves==0){
		var d0=tool.getSquareDistance(this.m_x+xModifier,this.m_y+yModifier,this.m_ballX,this.m_ballY);
		this.m_bestDistance=d0;
		this.m_bestMove=0;
		this.m_numberOfComputedMoves++;
	}else if(this.m_numberOfComputedMoves==1){

		var d1=tool.getSquareDistance(this.m_x+xModifier-stepping,this.m_y+yModifier,this.m_ballX,this.m_ballY);
		if(d1 < this.m_bestDistance){
			this.m_bestDistance=d1;
			this.m_bestMove=1;
		}
		this.m_numberOfComputedMoves++;
	}else if(this.m_numberOfComputedMoves==2){
		var d2=tool.getSquareDistance(this.m_x+xModifier-stepping,this.m_y-stepping+yModifier,this.m_ballX,this.m_ballY);
		if(d2 < this.m_bestDistance){
			this.m_bestDistance=d2;
			this.m_bestMove=2;
		}
		this.m_numberOfComputedMoves++;
	}else if(this.m_numberOfComputedMoves==3){
		var d3=tool.getSquareDistance(this.m_x+xModifier,this.m_y-stepping+yModifier,this.m_ballX,this.m_ballY);
		if(d3 < this.m_bestDistance){
			this.m_bestDistance=d3;
			this.m_bestMove=3;
		}
		this.m_numberOfComputedMoves++;
	}else if(this.m_numberOfComputedMoves==4){
		var d4=tool.getSquareDistance(this.m_x+xModifier+stepping,this.m_y+yModifier,this.m_ballX,this.m_ballY);
		if(d4 < this.m_bestDistance){
			this.m_bestDistance=d4;
			this.m_bestMove=4;
		}
		this.m_numberOfComputedMoves++;
	}else if(this.m_numberOfComputedMoves==5){
		var d5=tool.getSquareDistance(this.m_x+xModifier+stepping,this.m_y-stepping+yModifier,this.m_ballX,this.m_ballY);
		if(d5 < this.m_bestDistance){
			this.m_bestDistance=d5;
			this.m_bestMove=5;
		}
		this.m_numberOfComputedMoves++;

		//console.log("Best move= "+this.m_bestMove);

		this.m_finalBestMove=this.m_bestMove;
		//alert("pause");
	}
}

Player.prototype.calculatedMoves=function(){
	return this.m_numberOfComputedMoves==6;
}

Player.prototype.playMove=function(){
	if(this.m_waitingSlices>0)
		return;

	switch(this.m_finalBestMove){
		case 1:
			this.goLeft();
			break;
		case 2:
			this.goLeft();
			this.jump();
			break;
		case 3:
			this.jump();
			break;
		case 4:
			this.goRight();
			break;
		case 5:
			this.goRight();
			this.jump();
			break;
	}

	this.m_numberOfComputedMoves=0;
	
	this.m_waitingSlices=0;
}

Player.prototype.drawAngryFace=function(context){
	context.fillStyle="#ff0000";
	context.strokeStyle="#000000"; 

	context.beginPath();
	context.arc(this.m_x-this.m_eyeX,this.m_y-this.m_eyeY, 10, 0, Math.PI*2, true);
	context.fill();
	context.stroke();
	context.closePath();

	context.beginPath();
	context.arc(this.m_x+this.m_eyeX,this.m_y-this.m_eyeY, 10, 0, Math.PI*2, true);
	context.fill();
	context.stroke();
	context.closePath();

	context.beginPath();
	context.arc(this.m_x,this.m_y,35,0,Math.PI,false);
	context.moveTo(this.m_x-35,this.m_y);
	context.lineTo(this.m_x+35,this.m_y);
	context.fill();
	context.stroke();
	context.closePath();

}

Player.prototype.drawFace=function(context){
	context.fillStyle="#000000";
	context.strokeStyle="#000000"; 

	context.beginPath();
	context.arc(this.m_x-this.m_eyeX,this.m_y-this.m_eyeY, 10, 0, Math.PI*2, true);
	context.closePath();
	context.fill();

	context.beginPath();
	context.arc(this.m_x+this.m_eyeX,this.m_y-this.m_eyeY, 10, 0, Math.PI*2, true);
	context.fill();
	context.closePath();

	context.beginPath();
	context.arc(this.m_x,this.m_y,35,0,Math.PI,false);
	context.fill();
	context.closePath();



}
