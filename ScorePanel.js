/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */

ScorePanel=function(x,y){
	this.m_score=0;
	this.m_x=x;
	this.m_y=y;
}

ScorePanel.prototype.draw=function(canvas){
	var context=canvas.getContext("2d");
	context.fillStyle    = '#000000';
	context.font         = 'bold 50px sans-serif';
	context.fillText(this.m_score, this.m_x, this.m_y);
}

ScorePanel.prototype.increment=function(){
	this.m_score++;
}
