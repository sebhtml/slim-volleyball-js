/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */


var game=new Game();

var periodInMilliSeconds=1*1000/game.getFrequency();

// we can not give game.animate directly
// to setInterval because the context won't be correct
var myFunnyClosure=function(){
	game.iterate();
}

// run the game in intervals
setInterval(myFunnyClosure,periodInMilliSeconds);

// bind keyboard
document.onkeypress=function(e){
	game.getPlayer().processKeyboardEvent(e);
}


