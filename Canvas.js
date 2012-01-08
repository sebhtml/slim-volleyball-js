/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */

Canvas=function(canvas){
	this.m_htmlCanvas=canvas;
}

Canvas.prototype.clear=function(){
	this.m_htmlCanvas.getContext("2d").clearRect(0,0,this.m_htmlCanvas.width,this.m_htmlCanvas.height);
}

Canvas.prototype.getHtmlCanvas=function(){
	return this.m_htmlCanvas;
}


