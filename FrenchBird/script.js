const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = './media/flappy-bird-set.png';

// General settings
function isMobileDevice() { 
    if( navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    ){
        return true;
     }
    else {
        return false;
    }
   }
let typeEcran = isMobileDevice();
function getFee(type) {
    return (type ? 4 : 3);
}
function getGravity(type){
    return (type ? 0.25 : 0.15)
}

// Scroll Disable on phone
window.addEventListener('touchmove', ev => {
      ev.preventDefault();
      ev.stopPropagation();
}, { passive: false });

// Global variables
let ancientScore = 0;
let gamePlaying = false ; 
const gravity = getGravity(typeEcran);
const speed = getFee(typeEcran);
const size = [56, 36];
const jump = -4;
const cTenth = (canvas.width / 10);

// Pipe
const pipewidth = 78;
const pipeGap = 300;
function pipeLoc(){
    return ((Math.random() * (canvas.height - (pipeGap + pipewidth)) - pipewidth) + pipewidth);
}

let index = 0,
    bestScore = 0,
    currentScore =0,
    pipes = [],
    flight,
    flyHeight,
    comptoi = 0,
    tableauPositions = [0, 36, 72],
    globI = 0;
    tick = 0;

// Initialization
function setup(){
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2 ) - (size[1] / 2);

    pipes = Array(3).fill().map((a , i) => [
        canvas.width + (i*(pipewidth+pipeGap)), pipeLoc()]);
}
    
    
// Render
const render = () => {
    function myFunction(){
        tick ++;
        console.log(canvas.width);
        let tmp = tableauPositions [globI];

        // Speed animation bird
        if (tick == 19 ) {       
            tick = 0;
            globI++;
            if (globI >=  3) {
                globI = 0;
            }
        }
        return tmp;
    }

    index++;

    // Move backGround
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, canvas.width - ((index*(speed / 2)) % canvas.width),
    0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, - ((index*(speed / 2)) % canvas.width), 
    0, canvas.width, canvas.height);

    if (gamePlaying) {
        // move bird
        ctx.drawImage(img, 432, myFunction(), ...size, cTenth , flyHeight , ...size );
        flight += gravity;
        flyHeight = flyHeight + flight;
    } else {
        // home
        document.getElementById('currentscore').innerHTML = 'Score : ' + ancientScore;
        ctx.fillText('Meilleur Score = ' + bestScore, 69, 300);
        ctx.fillText('Best Score = ' + bestScore, 105, 245);
        ctx.fillText('Cliquer pour jouer', 48, 155);
        ctx.fillText('Click to play', 92, 100);
        ctx.fillText('Made by Carl', 200, 750);
        ctx.font = "bold 30px courier";
        ctx.fillStyle = "#ffffff";
        flyHeight = (canvas.height / 2 )- (size[1]/2);
        ctx.drawImage(img, 432, myFunction(), ...size, ((canvas.width / 2) - size[0] / 2), flyHeight , ...size );
    }

    // DisplayPipe
    if (gamePlaying) {
        console.log(flyHeight);
        pipes.map(pipe => {
            console.log('pipe:' +pipe[0]);
            pipe[0] -= speed;
            // top pipe
            ctx.drawImage(img, 432, 588 - pipe[1], pipewidth, pipe[1], pipe[0], 0, pipewidth, pipe[1]);
            // bottom pipe
            ctx.drawImage(img, 432 + pipewidth, 108, pipewidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipewidth, canvas.height - pipe[1] + pipeGap);

            if (pipe[0] <= -pipewidth) {

                currentScore++;
                bestScore = Math.max(currentScore, bestScore)
                document.getElementById('currentscore').innerHTML = 'Score : ' + currentScore ;
                pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipewidth, pipeLoc()]];
            }
        
            // Lost
            if ((pipe[0] <= cTenth + size[0]  && flyHeight <= pipe[1]) && !(pipe[0] < -pipewidth / 2 )) {
                ancientScore = currentScore;
                document.getElementById('currentscore').innerHTML = 'Score : ' + ancientScore ;
                gamePlaying = false;
                setup();
                return;
            } else if ((pipe[0] <= cTenth + size[0] && flyHeight >= pipe[1] + pipeGap - size[1]) && !(pipe[0] < -pipewidth / 2)) {
                ancientScore = currentScore;
                document.getElementById('currentscore').innerHTML = 'Score : ' + currentScore ;
                gamePlaying = false;
                setup();
                return;
            }
            else if(flyHeight < 0 || flyHeight > 1000){
                ancientScore = currentScore;
                document.getElementById('currentscore').innerHTML = 'Score : ' + currentScore ;
                gamePlaying = false;
                setup();
                return;
            }
        })
    }
    window.requestAnimationFrame(render);
}

setup();
img.onload = render; 

// Start game
document.addEventListener("click", myFunction);
function myFunction() {
  if(gamePlaying === false){
    document.getElementById('currentscore').innerHTML = 'Score : 0';
  }
  gamePlaying = true;

}

// Jump
document.addEventListener("click", saut);
function saut(){
    flight = jump;
}


