/* slim volleyball game in javascript and html5 */
/* the code is GPL */
/* author: Sébastien Boisvert */


var game=new Game();

var frequencyInHertz=60;
var periodInMilliSeconds=1*1000/60;

// we can not give game.animate directly
// to setInterval because the context won't be correct

var myFunnyClosure=function(){
	game.iterate();
}

setInterval(myFunnyClosure,periodInMilliSeconds);

