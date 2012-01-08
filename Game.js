/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */



Game=function(){

	this.addTitle();

	this.addCanvas();

	this.createContainers();

	this.addObjects();
}

Game.prototype.iterate=function(){
	// collide things
	for(var index in this.m_objectsToCollide){
		var item=this.m_objectsToCollide[index];
	}

	// animate things
	for(var index in this.m_objectsToAnimate){
		var item=this.m_objectsToAnimate[index];
		item.animate();
	}

	// draw things
	// I think javascript does double-buffering for me
	this.m_canvas.clear();
	for(var index in this.m_objectsToDraw){
		var item=this.m_objectsToDraw[index];
		item.draw(this.m_canvas.getHtmlCanvas());
	}
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

	canvas.width=1600;
	canvas.height=900;

	// add a disclaimer
	var div=document.createElement("div");
	center.appendChild(div);
	div.innerHTML="See <a href=\"http://github.com/sebhtml/slim-volleyball-js\">github.com/sebhtml/slim-volleyball-js</a>";
}

Game.prototype.createContainers=function(){

	this.m_objectsToDraw=new Array();
	this.m_objectsToAnimate=new Array();
	this.m_objectsToCollide=new Array();
	
}

Game.prototype.addObjects=function(){

	var sky=new Sky()
	this.m_objectsToDraw.push(sky);

	var floor=new Floor(48);
	this.m_objectsToDraw.push(floor);
	this.m_objectsToCollide.push(floor);

	var ball1=new Ball(200,200,1,-10);
	this.m_objectsToDraw.push(ball1);
	this.m_objectsToAnimate.push(ball1);
	this.m_objectsToCollide.push(ball1);

	var ball2=new Ball(300,100,3,-5);
	this.m_objectsToDraw.push(ball2);
	this.m_objectsToAnimate.push(ball2);
	this.m_objectsToCollide.push(ball2);

	var ball3=new Ball(400,200,-4,-40);
	this.m_objectsToDraw.push(ball3);
	this.m_objectsToAnimate.push(ball3);
	this.m_objectsToCollide.push(ball3);

	var ball4=new Ball(500,400,9,19);
	this.m_objectsToDraw.push(ball4);
	this.m_objectsToAnimate.push(ball4);
	this.m_objectsToCollide.push(ball4);

}
