
//Setting up canvas
let canvas;
let ctx;

canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")

canvas.width=400;
canvas.height=700;

document.body.appendChild(canvas)

let bgImg, shooterImg, missileImg, astroidImg, gameoverImg
let gameOver = false // if true, gameover
let score = 0
let astroidImgSize = 64
let missileImgSize = 24

//shooter location
let shooterX = canvas.width/2 - 24
let shooterY = canvas.height - 48

//missile generator
let missileList = []

function Missile(){
    this.x = 0
    this.y = 0
    this.init = function(){
        this.x = shooterX + 12
        this.y = shooterY
        this.alive = true // whether a missile hit or not

        missileList.push(this)
    }
    
    this.update = function(){
        this.y -= 7
    }

    this.checkHit = function(){
        for(let i=0;i<astroidList.length;i++){
            if(
                this.y <= astroidList[i].y + astroidImgSize && 
                this.x >= astroidList[i].x && 
                this.x <= astroidList[i].x + astroidImgSize - missileImgSize){
                score++;
                this.alive = false;
                astroidList.splice(i, 1);
            }
        }
        
    }

}

//astroid generator
let astroidList = []

function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max - min + 1)) + min
    return randomNum
}

function Astroid(){
    this.x = 0
    this.y = 0
    this.init = function(){
        this.x = generateRandomValue(0, canvas.width - astroidImgSize)
        this.y = 0
        astroidList.push(this)
    }
    this.update = function(){
        this.y += 4
        if(this.y >= canvas.height - astroidImgSize){
            gameOver = true
            //console.log("Game Over")
        }
    }
}

function loadImage(){
    bgImg = new Image();
    bgImg.src="images/background.jpg"

    shooterImg = new Image();
    shooterImg.src="images/shooter.png"

    missileImg = new Image();
    missileImg.src="images/missile.png"
    
    astroidImg = new Image();
    astroidImg.src="images/astroid.png"
    
    gameoverImg = new Image();
    gameoverImg.src="images/gameover.jpeg"
}

let keysDown={};

function setupKeyboardListener(){
    document.addEventListener("keydown",function(event){
        //console.log("which key?",event.keyCode)
        keysDown[event.key] = true;
        //console.log("keysDown",keysDown)

    });
    document.addEventListener("keyup",function(event){
        delete keysDown[event.key];
        //console.log("keysDown after keyup",keysDown)

        if(event.key == " "){
            createMissile()
        }

    })
}

function createMissile(){
    //console.log("missile created!")
    let m = new Missile(); // create missile
    m.init(); // setup initial missile location

}

function createAstroid(){
    const interval = setInterval(function(){
        let a = new Astroid();
        a.init();
    }, 1000) // create astroid every 1000ms
}

function update(){

    // shooter update
    if("ArrowRight" in keysDown){
        shooterX += 5 // shooter speed
    } // right
    if("ArrowLeft" in keysDown){
        shooterX -= 5
    } // left
    if(shooterX <= 0){
        shooterX=0
    } // left limit
    if(shooterX >= canvas.width-48){
        shooterX=canvas.width-48
    } // right limit

    // missile update
    for(let i=0;i<missileList.length;i++){
        if(missileList[i].alive){
            missileList[i].update()
            missileList[i].checkHit()
        }
    }

    // astroid update
    for(let i=0;i<astroidList.length;i++){
        astroidList[i].update()
    }

}

function render(){
    ctx.drawImage(img=bgImg, dx=0, dy=0, dWidth=400, dHeight=700);
    ctx.drawImage(img=shooterImg, dx=shooterX, dy=shooterY); 
    ctx.fillText(`Score:${score}`, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial"; 

    for(let i=0;i<missileList.length;i++){
        if(missileList[i].alive){
            ctx.drawImage(img=missileImg, dx=missileList[i].x, dy=missileList[i].y)
        }
    }

    for(let i=0;i<astroidList.length;i++){
        ctx.drawImage(img=astroidImg, dx=astroidList[i].x, dy=astroidList[i].y)
    }

}

function main(){
    if(!gameOver){
        update();
        render();
        requestAnimationFrame(main);
    }
    else{
        ctx.drawImage(gameoverImg, dx=10, dy=200, dWidth=380, dHeight=180)
    }
}

loadImage();
setupKeyboardListener();
createAstroid();
main();
