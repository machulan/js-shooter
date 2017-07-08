// "use strict";

// import { one } from "./new-components";

// function Article() {
//     Article.count++;
//     this.x = 199;
// }

// Article.count = 0;
// Article.showCount = function() {
//     console.log('art');
//     console.log(this.count + 10);
//     alert(this.count);
//     console.log(this.x);
// }

// // new Article();
// Article.showCount();

// // 'use strict';
// let a = 1;
// const a = 1;
// alert(a);

var canvas;
var context;

// function createGameCanvas() {
//     canvas = document.createElement('canvas');
//     // handling canvas
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     context = canvas.getContext('2d');
//     document.body.insertBefore(canvas, document.body.childNodes[0]);
// }

var game;
var isGameOver;

var timer;
var startTime = new Date().getTime();
var pauseStartTime = 0;

var player;
var playerImage;
var home;

var enemiesCount = 1;
var enemies = [];
// var obstacles = [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// ]
var obstacles = [
    // [50, 50, 30, 60, 1],
    // [100, 200, 200, 300],
]; // x, y, width, height, type
var obstacles = getRandomObstacles(40);
var obstacles = createObstacles();

var destructibleWallImage;
var indestructibleWallImage;
var walls = [];

// var canvas = document.createElement('canvas');



/*var game = {
    canvas: document.createElement('canvas'),
    // canvas: canvas,
    initialize: function() {
        // handling canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.context = this.canvas.getContext('2d');
        // this.context = context;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        drawBackgroundGrid(this.canvas);

        // createPatterns(this.canvas);

        // run animation loop
        this.interval = setInterval(updateGame, 40); //20
        this.frameNumber = 0;
        // requestAnimationFrame(updateGame);

        // event listeners
        window.addEventListener('keydown', function(e) {
            // e.preventDefault();
            game.keys = (game.keys || []);
            game.keys[e.keyCode] = true; // = (e.type == 'keydown')
            // console.log('pressed ' + e.keyCode + ' keys: ' + keys);
        });
        window.addEventListener('keyup', function(e) {
            // game.keys = (game.keys || []);
            game.keys[e.keyCode] = false;
        });
    },
    stop: function() {
        clearInterval(this.interval);
        this.stopped = true;
        pauseStartTime = new Date().getTime();
        // alert('clearing interval...');
    },
    stopped: false,
    clearCanvas: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    createObstacles: function(obstacles) {
        walls = [];
        for (var i = 0; i < obstacles.length; i++) {
            var obstacle = obstacles[i];
            walls.push(new IndestructibleWall(obstacle[0], obstacle[1], obstacle[2], obstacle[3]));
            // this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    },
    getCanvasEdges: function() {
        // left, right, top, bottom
        return [0, this.canvas.width, 0, this.canvas.height];
    }
}*/

function updateGame() {
    game.frameNumber += 1;
    // console.log('updating...');

    // game.clearCanvas();

    // background canvas
    // drawBackgroundGrid(game.canvas);

    // player
    player.stop();
    player.updateSpeeds();
    player.updatePosition();
    player.update();

    // home
    home.stop();
    home.updateSpeeds();
    home.updatePosition();
    home.update();

    // enemies
    for (var i = 0; i < enemies.length; i++) {
        var changeSpeeds = (game.frameNumber % randomIntInRange(30, 60)) == 0;
        if (game.frameNumber == 1 || changeSpeeds) { //|| game.frameNumber % 30 == 0) {
            enemies[i].stop();
            enemies[i].updateSpeeds();
        }

        enemies[i].updatePosition();
        enemies[i].update();
    }

    // obstacles
    for (var i = 0; i < walls.length; i++) {
        // walls = [];
        walls[i].update();
    }

    // timer 
    var passedTime = new Date(new Date().getTime() - startTime);
    var minutes = passedTime.getMinutes();
    var seconds = passedTime.getSeconds();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    timer.text = minutes + ":" + seconds;
    timer.update();

    // gameover
    // if (game.frameNumber > 50) {
    //     // alert(200);
    //     game.gameOver();
    // }
}

function run() {
    // var child = new Child(3, 5);
}

function startGame() {
    if (game && game.stopped) {
        //20
        startTime += new Date().getTime() - pauseStartTime;
        // pauseStartTime = 0;
        game.stopped = false;
        game.interval = setInterval(updateGame, 50);
        return;
    }

    if (!game) {
        // hide game over screen
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('game-over-overlay').style.display = 'none';

        document.getElementById('start-game-button').disabled = false;
        document.getElementById('pause-game-button').disabled = false;


        var canvas = document.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
        } else {
            canvas.parentNode.removeChild(canvas);
        }

        game = {
            canvas: canvas, //document.createElement('canvas'),
            // canvas: canvas,
            initialize: function() {
                // handling canvas
                this.canvas.width = window.innerWidth; //800; 
                this.canvas.height = window.innerHeight; // 600;

                this.context = this.canvas.getContext('2d');
                // this.context = context;
                document.body.insertBefore(this.canvas, document.body.childNodes[0]);

                // drawBackgroundGrid(this.canvas);

                // createPatterns(this.canvas);

                // run animation loop
                this.interval = setInterval(updateGame, 50); //20
                this.frameNumber = 0;
                // requestAnimationFrame(updateGame);

                // event listeners
                window.addEventListener('keydown', function(e) {
                    // e.preventDefault();
                    game.keys = (game.keys || []);
                    game.keys[e.keyCode] = true; // = (e.type == 'keydown')
                    // console.log('pressed ' + e.keyCode + ' keys: ' + keys);
                });
                window.addEventListener('keyup', function(e) {
                    // game.keys = (game.keys || []);
                    game.keys[e.keyCode] = false;
                });
            },
            stop: function() {
                clearInterval(this.interval);
                this.stopped = true;
                pauseStartTime = new Date().getTime();
                // alert('clearing interval...');
            },
            stopped: false,
            isGameOver: false,
            // Game over
            gameOver: function() {
                document.getElementById('game-over').style.display = 'block';
                document.getElementById('game-over-overlay').style.display = 'block';

                document.getElementById('start-game-button').disabled = true;
                document.getElementById('pause-game-button').disabled = true;

                isGameOver = true;
                game.isGameOver = true;
                game.stop();
            },
            clearCanvas: function() {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            },
            createObstacles: function(obstacles) {
                walls = [];
                for (var i = 0; i < obstacles.length; i++) {
                    var obstacle = obstacles[i];
                    walls.push(new IndestructibleWall(obstacle[0], obstacle[1], obstacle[2], obstacle[3]));
                    // this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
                }
            },
            getCanvasEdges: function() {
                // left, right, top, bottom
                return [0, this.canvas.width, 0, this.canvas.height];
            }
        };
    }

    game.initialize();
    // score = new Component("30px", "Consolas", "black", 280, 40, "text");
    startTime = new Date().getTime();
    timer = new Timer(10, game.canvas.height - 10, "adsfadfs", "30px", "Verdana", "black");
    //alert(timer);

    // setTimeout(game.createObstacles(obstacles), 5000);
    // alert('asdasd');
    // obstacles = [];
    // obstacles = getRandomObstacles(40);
    // obstacles = createObstacles();
    game.createObstacles(obstacles);
    // alert(walls.length);

    // unit = new Unit();
    player = new Player(200, 600, 50, 50);
    home = new Home(50, 550, 50, 50);
    // for (var i = 0; i < 2; i++) {
    //     enemies.push(new Enemy(500, 600, 50, 50));
    // // }
    // enemies.push(new Enemy(1000, 600, 30, 30));
    // enemies.push(new Enemy(800, 600, 70, 70));
    // enemies.push(new Enemy(500, 600, 50, 50));
    enemies = [];
    enemies.push(new Enemy(250, 500, 70, 70));

    // enemies.push(new Enemy(400, 600, 70, 70));
    // enemies.push(new Enemy(300, 600, 30, 30));
    // enemies.push(new Enemy(1200, 600, 50, 50));

    // enemies.push(new Enemy(1000, 70, 30, 30));
    // enemies.push(new Enemy(800, 70, 70, 70));
    // enemies.push(new Enemy(500, 70, 50, 50));


    // enemies.push(new Enemy(400, 70, 70, 70));
    // enemies.push(new Enemy(300, 70, 30, 30));
    // enemies.push(new Enemy(1200, 70, 50, 50));

    // enemies.push(new Enemy(1000, 370, 30, 30));
    // enemies.push(new Enemy(800, 370, 70, 70));
    // enemies.push(new Enemy(500, 370, 50, 50));


    // enemies.push(new Enemy(400, 370, 70, 70));
    // enemies.push(new Enemy(300, 370, 30, 30));
    // enemies.push(new Enemy(1200, 370, 50, 50));

    // requestAnimationFrame(updateGame);
}

function pauseGame() {
    game.stop();
}

function restartGame() {
    // game.stop();
    // obstacles = getRandomObstacles(20);
    delete game.canvas;
    game = null;
    // alert('restart');
    // delete game;
    obstacles = [];
    obstacles = createObstacles();
    startGame();
}


window.addEventListener('run', run);
run();

document.getElementById('play-again').addEventListener('click', restartGame);