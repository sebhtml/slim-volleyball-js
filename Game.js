/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */



Game=function(){

	this.m_frequency=150;
	this.m_displayPeriod=1;
	
	/* avoid storing large numbers in string format in some browsers */
	this.m_iteration=0;
	this.m_maxIteration=10000*this.m_displayRatio;
	this.m_gravity=0.3;
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
	this.moveObjects();
	this.applyGravity();
	this.enforceBoundaries();

	//this.m_player1.play(this.m_ball);
	this.m_player2.play(this.m_ball);

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
	div.innerHTML="w: jump, a: go left, d: go right<br />see <a href=\"http://github.com/sebhtml/slim-volleyball-js\">github.com/sebhtml/slim-volleyball-js</a>";
}

Game.prototype.createContainers=function(){

	this.m_objectsToDraw=new Array();
	this.m_objectsToAnimate=new Array();
	this.m_objectsToCollide=new Array();
	this.m_objectsWithGravity=new Array();
	
}

Game.prototype.addObjects=function(){

	var sky=new Sky(this.m_width/2-300,100)
	this.m_objectsToDraw.push(sky);
	

	this.addBalls();

	this.addPanels();

	this.addPlayers();

	this.addWalls();

}

Game.prototype.addPanels=function(){
	var score1=new ScorePanel(100,100);
	this.m_score1=score1;
	this.m_objectsToDraw.push(this.m_score1);
	var score2=new ScorePanel(this.m_width-100,100);
	this.m_score2=score2;
	this.m_objectsToDraw.push(this.m_score2);

	var boundary=this.m_width/2;
	var variable=this;

	// another closure here !
	var callback=function(x,y,object){
		if((object instanceof Wall) && object.isGoal()){
			//console.log("CALlbACK "+x+" "+y+" "+boundary);
			if(x < boundary){
				score2.increment();
				//console.log("+1");
				object.explose();
			}else if(x > boundary){
				score1.increment();
				object.explose();
				if(score1.getScore()==16){
					variable.addSmallBalls();
				}
			}
		}
	}

	this.m_ball.setCallbackForScore(callback);

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

Game.prototype.enforceBoundaries=function(){
	// apply gravity
	for(var index in this.m_objectsToCollide){
		this.m_objectsToCollide[index].enforceBoundaries(this.m_wallThickness,this.m_wallThickness,
								this.m_width-this.m_wallThickness,this.m_wallThickness,
								this.m_wallThickness,this.m_height-this.m_wallThickness,
								this.m_width-this.m_wallThickness,this.m_height-this.m_wallThickness);
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

Game.prototype.addSmallBalls=function(){
	var x=100;
	while(x<this.m_width){
		var ball5=new Ball(x,200,0,3,10);
		this.m_objectsToDraw.push(ball5);
		this.m_objectsToAnimate.push(ball5);
		this.m_objectsToCollide.push(ball5);
		this.m_objectsWithGravity.push(ball5);
		x+=100;
	}
}

Game.prototype.addBalls=function(){
	var ball4=new Ball(this.m_width/4,400,0,-10,38);
	this.m_objectsToDraw.push(ball4);
	this.m_objectsToAnimate.push(ball4);
	this.m_objectsToCollide.push(ball4);
	this.m_objectsWithGravity.push(ball4);

	// for tracking
	this.m_ball=ball4;
}

Game.prototype.addWalls=function(){
	var floor1=new Wall(0,this.m_height-this.m_wallThickness,this.m_width/2,this.m_height-this.m_wallThickness,this.m_width/2,this.m_height,0,this.m_height);
	this.m_objectsToDraw.push(floor1);
	this.m_objectsToCollide.push(floor1);
	floor1.setGoal();

	var floor2=new Wall(this.m_width/2,this.m_height-this.m_wallThickness,this.m_width,this.m_height-this.m_wallThickness,this.m_width,this.m_height,this.m_width/2,this.m_height);
	this.m_objectsToDraw.push(floor2);
	this.m_objectsToCollide.push(floor2);
	floor2.setGoal();

	var wall1=new Wall(0,0,this.m_wallThickness,0,this.m_wallThickness,this.m_height,0,this.m_height);
	this.m_objectsToDraw.push(wall1);
	this.m_objectsToCollide.push(wall1);

	var wall2=new Wall(this.m_width-this.m_wallThickness,0,this.m_width,0,this.m_width,this.m_height,this.m_width-this.m_wallThickness,this.m_height);
	this.m_objectsToDraw.push(wall2);
	this.m_objectsToCollide.push(wall2);

	var wall3=new Wall(0,0,this.m_width,0,this.m_width,this.m_wallThickness,0,this.m_wallThickness);
	this.m_objectsToDraw.push(wall3);
	this.m_objectsToCollide.push(wall3);


	var middleWallHeight=14;
	var wall4=new Wall(this.m_width/2-this.m_wallThickness,this.m_height-middleWallHeight*this.m_wallThickness,
			this.m_width/2+this.m_wallThickness,this.m_height-middleWallHeight*this.m_wallThickness,
			this.m_width/2+this.m_wallThickness,this.m_height,
			this.m_width/2-this.m_wallThickness,this.m_height
			);
	this.m_objectsToDraw.push(wall4);
	this.m_objectsToCollide.push(wall4);
}

Game.prototype.getPlayer=function(){
	return this.m_player1;
}

Game.prototype.addPlayers=function(){

	var radius=80;

	this.m_player1=new Player(this.m_width/4,this.m_height-1*this.m_wallThickness-radius-1,radius,1,this.m_wallThickness,this.m_width/2-this.m_wallThickness);
	this.m_objectsToDraw.push(this.m_player1);
	this.m_objectsToAnimate.push(this.m_player1);
	this.m_objectsToCollide.push(this.m_player1);
	this.m_objectsWithGravity.push(this.m_player1);

	this.m_player2=new Player(3*this.m_width/4,this.m_height-1*this.m_wallThickness-radius-1,radius,2,this.m_width/2+this.m_wallThickness,this.m_width-this.m_wallThickness);
	this.m_objectsToDraw.push(this.m_player2);
	this.m_objectsToAnimate.push(this.m_player2);
	this.m_objectsToCollide.push(this.m_player2);
	this.m_objectsWithGravity.push(this.m_player2);

}
