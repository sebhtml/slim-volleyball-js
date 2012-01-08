/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */



Game=function(){

	this.m_frequency=120;
	this.m_displayPeriod=1;
	
	/* avoid storing large numbers in string format in some browsers */
	this.m_iteration=0;
	this.m_maxIteration=10000*this.m_displayRatio;
	this.m_gravity=0.1;
	this.m_width=1600;
	this.m_height=900;
	this.m_wallThickness=20;

	this.addTitle();

	this.addCanvas();

	this.createContainers();

	this.addObjects();


}

Game.prototype.getFrequency=function(){
	return this.m_frequency;
}

Game.prototype.iterate=function(){

	this.detectCollisions();
	this.applyGravity();
	this.moveObjects();

	if((this.m_iteration % this.m_displayPeriod) == 0){
		this.updateDisplay();
	}

	this.m_iteration++;
	
	if(this.m_iteration==this.m_maxIteration)
		this.m_iteration=0;
}

Game.prototype.addTitle=function(){
	// set the title
	var title=document.createElement("title");
	var content=document.createTextNode("Slim volleyball in javascript and html5");
	title.appendChild(content);
	var head=document.getElementsByTagName("head")[0];
	head.appendChild(title);


}

Game.prototype.addCanvas=function(){

	// add the canvas
	var body=document.getElementsByTagName("body")[0];
	var center=document.createElement("center");
	var canvas=document.createElement("canvas");
	center.appendChild(canvas);
	this.m_canvas=new Canvas(canvas);

	body.appendChild(center);
	
	// resolutions: 
	// 1920 x 1080  16:9
	// 1600 x 900   16:9
	// 1280 x 1024  5:4
	// 1024 x 768   4:3
	// 800  x 600   4:3

	canvas.width=this.m_width;
	canvas.height=this.m_height;

	// add a disclaimer
	var div=document.createElement("div");
	center.appendChild(div);
	div.innerHTML="See <a href=\"http://github.com/sebhtml/slim-volleyball-js\">github.com/sebhtml/slim-volleyball-js</a>";
}

Game.prototype.createContainers=function(){

	this.m_objectsToDraw=new Array();
	this.m_objectsToAnimate=new Array();
	this.m_objectsToCollide=new Array();
	this.m_objectsWithGravity=new Array();
	
}

Game.prototype.addObjects=function(){

	var sky=new Sky()
	this.m_objectsToDraw.push(sky);

	this.addBalls();

	this.addWalls();
}

Game.prototype.detectCollisions=function(){

	// collide things
	for(var index in this.m_objectsToCollide){
		var item=this.m_objectsToCollide[index];
		for(var index2 in this.m_objectsToCollide){
			// only process half of the pairs
			// and don't process the diagonal
			if(index!=index2){
				var item2=this.m_objectsToCollide[index2];
				item.detectCollision(item2);
			}
		}

	}

}

Game.prototype.applyGravity=function(){
	// apply gravity
	for(var index in this.m_objectsWithGravity){
		this.m_objectsWithGravity[index].applyGravity(this.m_gravity);
	}


}

Game.prototype.moveObjects=function(){
	// animate things
	for(var index in this.m_objectsToAnimate){
		var item=this.m_objectsToAnimate[index];
		item.animate();
	}
}

Game.prototype.updateDisplay=function(){
	// draw things
	// I think javascript does double-buffering for me
	this.m_canvas.clear();
	for(var index in this.m_objectsToDraw){
		var item=this.m_objectsToDraw[index];
		item.draw(this.m_canvas.getHtmlCanvas());
	}

}

Game.prototype.addBalls=function(){
	var ball1=new Ball(200,200,5,-5);
	this.m_objectsToDraw.push(ball1);
	this.m_objectsToAnimate.push(ball1);
	this.m_objectsToCollide.push(ball1);
	this.m_objectsWithGravity.push(ball1);

/*
	var ball2=new Ball(300,100,3,-2);
	this.m_objectsToDraw.push(ball2);
	this.m_objectsToAnimate.push(ball2);
	this.m_objectsToCollide.push(ball2);
	this.m_objectsWithGravity.push(ball2);

	var ball3=new Ball(400,200,4,-3);
	this.m_objectsToDraw.push(ball3);
	this.m_objectsToAnimate.push(ball3);
	this.m_objectsToCollide.push(ball3);
	this.m_objectsWithGravity.push(ball3);

	var ball4=new Ball(500,400,9,2);
	this.m_objectsToDraw.push(ball4);
	this.m_objectsToAnimate.push(ball4);
	this.m_objectsToCollide.push(ball4);
	this.m_objectsWithGravity.push(ball4);

*/

	var ball4=new Ball(this.m_width/2,this.m_height-this.m_wallThickness,0,0);
	this.m_objectsToDraw.push(ball4);
	this.m_objectsToCollide.push(ball4);
}

Game.prototype.addWalls=function(){
	var floor=new Wall(0,this.m_height-this.m_wallThickness,this.m_width,this.m_height-this.m_wallThickness,this.m_width,this.m_height,0,this.m_height);
	this.m_objectsToDraw.push(floor);
	this.m_objectsToCollide.push(floor);

	var wall1=new Wall(0,0,this.m_wallThickness,0,this.m_wallThickness,this.m_height,0,this.m_height);
	this.m_objectsToDraw.push(wall1);
	this.m_objectsToCollide.push(wall1);

	var wall2=new Wall(this.m_width-this.m_wallThickness,0,this.m_width,0,this.m_width,this.m_height,this.m_width-this.m_wallThickness,this.m_height);
	this.m_objectsToDraw.push(wall2);
	this.m_objectsToCollide.push(wall2);

}
