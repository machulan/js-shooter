/**
 * Главный скрипт игры, реализующий ее жизненный цикл и управляющий DOM элементами.
 */

var startTime;
var pauseStartTime;
var interval;

var timerElement = document.getElementById('timer');
var scoreElement = document.getElementById('score');
var healthElement = document.getElementById('health');
var cureNumberElement = document.getElementById('cure-number');
var bulletNumberElement = document.getElementById('bullet-number');
var bombNumberElement = document.getElementById('bomb-number');

// var shotAudioElement = document.getElementById('shot-audio');

var gamePulseElement = document.getElementById('game-pulse');

function getTime() {
    return Date.now() - startTime;
}

function getTimerString() {
    var dt = getTime();

    var seconds = Math.floor(dt / 1000);
    var minutes = Math.floor(seconds / 60);
    seconds %= 60;

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
}

function updateTimer() {
    timerElement.innerHTML = getTimerString();
}

function updateScore(newScore) {
    scoreElement.innerHTML = newScore;
}

function updateHealth(newHealth) {
    healthElement.innerHTML = newHealth;
}

function updateCureNumber(newCureNumber) {
    cureNumberElement.innerHTML = newCureNumber;
}

function updateBulletNumber(newBulletNumber) {
    bulletNumberElement.innerHTML = newBulletNumber;
}

function updateBombNumber(newBombNumber) {
    bombNumberElement.innerHTML = newBombNumber;
}


function updateGamePulse(newGamePulse) {
    gamePulseElement.innerHTML = newGamePulse;
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

var level;

var player;
var home;
var trees = [];
var rocks = [];
var rockCreator;

var flies = [];
var flyGenerator;

var spiders = [];
var lairs = [];

var bombs = [];
var bullets = [];
var explosions = [];

var bonusGenerator;
var bonuses = [];

var framesPerSecond = 20; // 20
// var timeInterval = 1000 / framesPerSecond;

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

    //initialize game pulse
    // updateGamePulse(0);

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
        e.preventDefault();
        // debugger;
        keys = (keys || []);
        keys[e.keyCode] = true; // = (e.type == 'keydown')
        // console.log('pressed ' + e.keyCode); // + ' keys: ' + keys);
    });
    window.addEventListener('keyup', function(e) {
        keys = (keys || []); // delete this string
        keys[e.keyCode] = false;
    });

    // clear component storages
    keys = [];

    level = null;

    player = null;
    home = null;
    trees = [];
    rocks = [];
    rockCreator = null;

    flies = [];
    flyGenerator = null;

    spiders = [];
    lairs = [];

    bombs = [];
    bullets = [];
    explosions = [];

    bonusGenerator = null;
    bonuses = [];

    // initialize level
    level = new levels.Level(levels.simpleLevelMap);
    level.construct();

    // var center = { x: 60, y: 60 };
    // var radius = 50;
    // lairs.push(new components.Lair(center, radius));

    // initialize trees
    // var center = { x: 100, y: 100 };
    // var radius = 25;
    // trees.push(new components.Tree(center, radius));
    // var center = { x: 130, y: 100 };
    // var radius = 30;
    // trees.push(new components.Tree(center, radius));

    // initialize rocks
    // var center = { x: 200, y: 200 };
    // var radius = 30;
    // rocks.push(new components.Rock(center, radius));
    // var center = { x: 250, y: 220 };
    // rocks.push(new components.Rock(center, radius));

    // initialize rock creator
    // rockCreator = new generators.RockCreator();
    // for (var i = 0; i < 0; i++) {
    //     rocks.push(rockCreator.create());
    // }

    // initialize player
    // var center = { x: 300, y: 300 };
    // var radius = 40;
    // player = new components.Player(center, radius);


    // initialize home
    // var center = { x: 300, y: 400 };
    // var radius = 50;
    // home = new components.Home(center, radius);

    // initialize flies
    // var center = { x: 250, y: 500 };
    // var radius = 15; // 25
    // flies.push(new components.Fly(center, radius));

    // initialize fly generator
    flyGenerator = new generators.FlyGenerator();

    // initialize spiders (enemies)
    // var center = { x: 400, y: 400 };
    // var radius = 25;
    // spiders.push(new components.Spider(center, radius));
    // var center = { x: 500, y: 500 };
    // var radius = 80; // 40 60 
    // spiders.push(new components.Spider(center, radius));
    // var center = { x: 1000, y: 500 };
    // var radius = 100; // 40 60 
    // spiders.push(new components.Spider(center, radius));

    // initialize bullet bonus
    // bonuses.push(new components.BulletBonus({ x: 200, y: 600 }));
    // bonuses.push(new components.CureBonus({ x: 300, y: 600 }));

    // initialize bonus generator
    bonusGenerator = new generators.BonusGenerator();

    // initialize game
    // setTimeout(function() { player.die() }.bind(this), 2000);
    // setTimeout(function() { win(); }.bind(this), 10000);


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
    interval = setInterval(update, 1000 / framesPerSecond); // 50 // TODO 40 change bonuse animation
}

function update() {
    // update game
    if (lairs.length == 0 && spiders.length == 0) { // win condition
        pause();
        setTimeout(win, 2000);
    }


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

    lairs.forEach(function(lair) {
        lair.update();
    });

    bonuses.forEach(function(bonus) {
        bonus.update();
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

    explosions.forEach(function(explosion) {
        explosion.update();
    });


    flyGenerator.update();
    bonusGenerator.update();

    updateTimer();
    updateScore(player.score);
    updateHealth(player.health);
    updateCureNumber(player.cureNumber);
    updateBulletNumber(player.bulletNumber);
    updateBombNumber(player.bombNumber);


    // updateGamePulse(Date.now() - startTime);


    // if (Date.now() - startTime > 5000) {
    //     // gameOver();
    //     win();
    // }

    // document.getElementById('new-game').addEventListener('click', gameOver);

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

    // fill win time and win score
    document.getElementById('win-time').innerHTML = getTimerString();
    document.getElementById('win-score').innerHTML = player.score;

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

    // fill game over time and game over score
    document.getElementById('game-over-time').innerHTML = getTimerString();
    document.getElementById('game-over-score').innerHTML = player.score;

    // show game over screen
    document.getElementById('play-again').addEventListener('click', init);
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
}

// begin resourses loading
resourses.load(['images/home.png',
    // 'images/green_circle.png',
    'images/player.png',
    // 'images/Machulazz_face.png',
    // 'images/enemy.png',
    // 'images/red_circle.png',
    // 'images/sergey.jpg',
    // 'images/indestructible_wall.png',
    // 'images/small_box.png',
    // 'images/box1_cr.png',
    // 'images/small_box_1.png',
    'images/tree.png',
    'images/rock.png',
    'images/player.png',
    'images/home.png',
    'images/fly.png',
    'images/spider_frame_0.png',
    'images/spider_frame_1.png',
    'images/spider_frame_2.png',
    'images/spider_frame_3.png',
    'images/lair.png',
    // 'images/arrow.png',
    'images/bomb_frame_0.png',
    'images/bomb_frame_1.png',
    'images/bomb_frame_2.png',
    'images/bomb_frame_3.png',
    // 'images/explosion_frame_original.png',
    'images/explosion_frame_0.png',
    'images/explosion_frame_1.png',
    'images/explosion_frame_2.png',
    'images/bullet.png',
    'images/bullet-bonus.png',
    'images/cure-bonus.png',
    'images/bomb-bonus.png',
    'images/shit-piece.png'
]);
// when resourses loaded show welcome screen
resourses.onload(welcome);