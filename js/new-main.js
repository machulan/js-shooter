var startTime;
var pauseStartTime;
var interval;

var timerElement = document.getElementById('timer');
var scoreElement = document.getElementById('score');
var gamePulseElement = document.getElementById('game-pulse');

function updateTimer() {
    var dt = Date.now() - startTime;

    var seconds = Math.floor(dt / 1000);
    var minutes = Math.floor(seconds / 60);
    seconds %= 60;

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    timerElement.innerHTML = minutes + ":" + seconds;
}

function updateScore(newScore) {
    scoreElement.innerHTML = newScore;
}

function updateGamePulse(newGamePulse) {
    gamePulseElement.innerHTML = newGamePulse;
}

function getTime() {
    return Date.now() - startTime;
}

function welcome() {
    // run welcome screen
    document.getElementById('welcome').style.display = 'block';
    document.getElementById('welcome-overlay').style.display = 'block';

    document.getElementById('init-game').addEventListener('click', function() {
        document.getElementById('welcome').style.display = 'none';
        document.getElementById('welcome-overlay').style.display = 'none';

        init();
    });

}

var keys = [];

var player;
var home;
var trees = [];
var rocks = [];
var flies = [];
var spiders = [];

var bombs = [];
var bullets = [];

var bonuses = [];

function init() {
    // initialize new game
    console.log('game init...');

    pause();

    // initialize timer
    startTime = Date.now();
    pauseStartTime = Date.now();
    updateTimer();

    // initialize score
    updateScore(0);

    //initialize game time 
    updateGamePulse(0);

    // event listeners
    document.getElementById('start-game').addEventListener('click', start);
    document.getElementById('pause-game').addEventListener('click', pause);
    document.getElementById('new-game').addEventListener('click', init);

    // show toolbar
    document.getElementById('toolbar').style.display = 'block';
    // hide game over screen
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    // hide win screen
    document.getElementById('win').style.display = 'none';
    document.getElementById('win-overlay').style.display = 'none';

    // add game content wrapper
    var gameArea = document.getElementById('game-area');
    gameArea.style.display = 'block';

    // initialize creator (painter, renderer)
    renderer.init();

    // initialize keydown and keyup event listeners
    window.addEventListener('keydown', function(e) {
        // e.preventDefault();
        // debugger;
        keys = (keys || []);
        keys[e.keyCode] = true; // = (e.type == 'keydown')
        // console.log('pressed ' + e.keyCode); // + ' keys: ' + keys);
    });
    window.addEventListener('keyup', function(e) {
        keys = (keys || []); // delete this string
        keys[e.keyCode] = false;
    });

    // initialize trees
    var center = { x: 100, y: 100 };
    var radius = 25;
    trees.push(new components.Tree(center, radius));

    var center = { x: 130, y: 100 };
    var radius = 30;
    trees.push(new components.Tree(center, radius));

    // initialize rocks
    var center = { x: 200, y: 200 };
    var radius = 30;
    rocks.push(new components.Rock(center, radius));
    var center = { x: 250, y: 220 };
    rocks.push(new components.Rock(center, radius));

    // initialize player
    var center = { x: 300, y: 300 };
    var radius = 40;
    player = new components.Player(center, radius);

    // initialize home
    var center = { x: 300, y: 400 };
    var radius = 50;
    home = new components.Home(center, radius);

    // initialize flies
    var center = { x: 250, y: 500 };
    var radius = 15; // 25
    flies.push(new components.Fly(center, radius));

    // initialize spiders (enemies)
    var center = { x: 400, y: 400 };
    var radius = 25;
    spiders.push(new components.Spider(center, radius));
    var center = { x: 500, y: 500 };
    var radius = 60; // 40 
    spiders.push(new components.Spider(center, radius));

    // initialize bullet bonus
    bonuses.push(new components.BulletBonus({ x: 200, y: 600 }));
    bonuses.push(new components.CureBonus({ x: 300, y: 600 }));

    // initialize game
    setTimeout(function() { player.die() }.bind(this), 2000);


    // add canvas
    // var canvas = document.querySelector('canvas');
    // if (!canvas) {
    //     canvas = document.createElement('canvas');
    //     canvas.width = window.innerWidth; //800; 
    //     canvas.height = window.innerHeight; // 600;
    //     // document.body.insertBefore(canvas, document.body.childNodes[0]);
    //     document.getElementById('game-area').appendChild(canvas);
    // }

    // creator.makeCircle({ center: { x: 100, y: 200 }, radius: 50, image: resourses.get('images/green_circle.png') });
    // return;

    // game = 1; // new Game();

    // var player



    // run animation
    start();
}

function start() {
    // run animation
    console.log('game started...');

    // fix toolbar
    document.getElementById('start-game').disabled = true;
    document.getElementById('pause-game').disabled = false;

    // if was paused
    startTime += Date.now() - pauseStartTime;

    // run loop
    interval = setInterval(update, 50);
}

var curcenter = { x: 100, y: 200 };
var prevcenter = { x: 100, y: 200 };

function update() {
    // update game
    player.update();
    spiders.forEach(function(spider) {
        spider.update();
    });
    rocks.forEach(function(rock) {
        rock.update();
    })
    flies.forEach(function(fly) {
        fly.update();
    });
    trees.forEach(function(tree) {
        tree.update();
    });
    bombs.forEach(function(bomb) {
        bomb.update();
    });
    bullets.forEach(function(bullet) {
        bullet.update();
    });
    bonuses.forEach(function(bonus) {
        bonus.update();
    });




    // console.log('game updating...');
    updateTimer();
    // updateScore(Date.now() - startTime);
    updateGamePulse(Date.now() - startTime);
    // if (Date.now() - startTime > 5000) {
    //     // gameOver();
    //     win();
    // }


    // document.getElementById('new-game').addEventListener('click', gameOver);

    curcenter.x += 4;

    var context = renderer.getContext();
    var canvas = renderer.getCanvas();

    // context.fillStyle = "#ddd";  
    // context.fillRect(0, 0, canvas.width, canvas.height);
    // renderer.makeCircle({ center: prevcenter, radius: 60, image: resourses.get('images/Machulazz_face.png') });

    // a = 0 / 0;

    // renderer.clearCircle({ center: prevcenter, radius: 50 });
    // renderer.makeCircle({ center: curcenter, radius: 50, image: resourses.get('images/Machulazz_face.png') });



    prevcenter.x = curcenter.x;
    prevcenter.y = curcenter.y;

    // pause();
}

function pause() {
    // stop animation
    console.log('game paused...')

    // fix toolbar
    document.getElementById('pause-game').disabled = true;
    document.getElementById('start-game').disabled = false;

    // save pause start time
    pauseStartTime = Date.now();

    // stop loop
    clearInterval(interval);
}

function win() {
    // win
    pause();

    // remove game area
    var gameArea = document.getElementById('game-area');
    gameArea.style.display = 'none';

    // stop game
    document.getElementById('start-game').disabled = true;
    document.getElementById('pause-game').disabled = true;
    // document.getElementById('new-game').disabled = true;

    // hide toolbar
    document.getElementById('toolbar').style.display = 'none';

    // show win screen
    document.getElementById('win-play-again').addEventListener('click', init);
    document.getElementById('win').style.display = 'block';
    document.getElementById('win-overlay').style.display = 'block';
}

function gameOver() {
    // game over
    pause();

    // remove canvas
    // var canvas = document.querySelector('canvas');
    // canvas.parentNode.removeChild(canvas);

    // remove game area
    var gameArea = document.getElementById('game-area');
    gameArea.style.display = 'none';

    // stop game
    document.getElementById('start-game').disabled = true;
    document.getElementById('pause-game').disabled = true;
    // document.getElementById('new-game').disabled = true;

    // hide toolbar
    document.getElementById('toolbar').style.display = 'none';

    // show game over screen
    document.getElementById('play-again').addEventListener('click', init);
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
}

// begin resourses loading
resourses.load(['images/home.png',
    'images/green_circle.png',
    'images/player.png',
    'images/Machulazz_face.png',
    // 'images/enemy.png',
    'images/red_circle.png',
    'images/sergey.jpg',
    'images/indestructible_wall.png',
    'images/small_box.png',
    'images/box1_cr.png',
    'images/small_box_1.png',
    'images/tree.png',
    'images/rock.png',
    'images/player.png',
    'images/home.png',
    'images/fly.png',
    'images/spider_frame_0.png',
    'images/spider_frame_1.png',
    'images/spider_frame_2.png',
    'images/spider_frame_3.png',
    // 'images/arrow.png',
    'images/bomb_frame_0.png',
    'images/bomb_frame_1.png',
    'images/bomb_frame_2.png',
    'images/bomb_frame_3.png',
    'images/explosion_frame_original.png',
    'images/explosion_frame_0.png',
    'images/explosion_frame_1.png',
    'images/explosion_frame_2.png',
    'images/bullet.png',
    'images/bullet-bonus.png',
    'images/cure-bonus.png',
    'images/shit-piece.png'
]);
// when resourses loaded show welcome screen
resourses.onload(welcome);

// temp CLEAR CIRCLE:
// var curcenter = { x: 100, y: 200 };
// var prevcenter = curcenter;

// function update() {
//     curcenter.x += 4;
//     var ctx = renderer.getContext();
//     ctx.fillStyle = "#ff9900";
//     ctx.rect(0, 0, 1366, 662);
//     ctx.fill();


//     renderer.clearCircle({ center: prevcenter, radius: 50 });
//     renderer.makeCircle({ center: curcenter, radius: 50, image: resourses.get('images/Machulazz_face.png') });

//     prevcenter = curcenter;
// }




//below was


// function init() {
//     console.log('init running...');
//     document.getElementById('play-again').addEventListener('click', function() {
//         reset();
//     });

//     reset();
//     startTime = Date.now();
//     main();
// }

// function main() {
//     var dt = Date.now() - startTime;
//     update(dt);
//     render();
//     requestAnimationFrame(main);
// }

// function update(dt) {
//     handleInput();

// }

// function render(dt) {

// }

// function pause() {

// }