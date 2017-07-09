const LEFT_ARROW_KEY_CODE = 37;
const UP_ARROW_KEY_CODE = 38;
const RIGHT_ARROW_KEY_CODE = 39;
const DOWN_ARROW_KEY_CODE = 40;
const SPACE_KEY_CODE = 32;
const A_KEY_CODE = 65;
const B_KEY_CODE = 66;
const S_KEY_CODE = 83;
const D_KEY_CODE = 68;
const Q_KEY_CODE = 81;
const E_KEY_CODE = 69;
const F_KEY_CODE = 70;
const G_KEY_CODE = 71;
const H_KEY_CODE = 72;
const W_KEY_CODE = 87;
const M_KEY_CODE = 77;


function randomIntInRange(minValue, maxValue) {
    return Math.round(Math.random() * (maxValue - minValue)) + minValue;
}



// TODO 
// below trash!

function getRandomObstacles(count) {
    console.log('random obstacles creating...')
    result = [];
    for (var i = 0; i < count; i++) {
        var minWidth = 50;
        var maxWidth = 100;
        var minHeight = 50;
        var maxHeight = 100;
        var width = randomIntInRange(minWidth, maxWidth);
        var height = randomIntInRange(minHeight, maxHeight);

        var x = randomIntInRange(0, window.innerWidth - width * 2);
        var y = randomIntInRange(0, window.innerHeight - 60 - height * 2);
        result.push([x, y, width, height, 1]);
    }
    // alert(window.innerHeight);
    // return [
    //     [100, window.innerHeight - 0 - 100, 30, 100]
    // ];
    return result;
}



function createObstacles() {
    console.log('obstacles creating...');
    // x, y, width, height, type



    function createVerticalWallsChain(x, y, chainWidth, chainHeight, wallsCount) {
        // returns vertical walls chain with left-top corner in [0, 0]
        // x, y, width, height, type
        var wallHeight = Math.round(chainHeight / wallsCount);
        var result = [];
        for (var i = 0; i < wallsCount; i++) {
            result.push([x, y + i * wallHeight, chainWidth, wallHeight, 1]);
        }
        return result;
    }

    function createHorizontalWallsChain(x, y, chainWidth, chainHeight, wallsCount) {
        // returns vertical walls chain with left-top corner in [0, 0]
        // x, y, width, height, type
        var wallWidth = Math.round(chainWidth / wallsCount);
        var result = [];
        for (var i = 0; i < wallsCount; i++) {
            result.push([x + i * wallWidth, y, wallWidth, chainHeight, 1]);
        }
        return result;
    }

    // 1350 x 660
    var result = [];
    // first row 6 7
    for (var i = 0; i < 0; i++) {
        var wallsChain = createVerticalWallsChain(200 * i + randomIntInRange(0, 150), randomIntInRange(0, 200),
            50, randomIntInRange(100, 300), 1);
        result = result.concat(wallsChain);
    }

    // first column 4 4
    for (var i = 0; i < 4; i++) {
        var wallsChain = createHorizontalWallsChain(randomIntInRange(200, 300), 150 * i + randomIntInRange(0, 130),
            randomIntInRange(100, 300), 50, 1);
        result = result.concat(wallsChain);
    }

    // second column 5 5
    for (var i = 0; i < 0; i++) {
        var wallsChain = createHorizontalWallsChain(500 + randomIntInRange(0, 300), 120 * i + randomIntInRange(0, 120),
            randomIntInRange(100, 300), 50, 1);
        result = result.concat(wallsChain);
    }

    // third column 5 4
    for (var i = 0; i < 0; i++) {
        var wallsChain = createHorizontalWallsChain(900 + randomIntInRange(0, 150), 150 * i + randomIntInRange(0, 50),
            randomIntInRange(100, 300), 50, 1); //3
        result = result.concat(wallsChain);
    }

    // for home

    result = result.concat(createHorizontalWallsChain(0, 500, 100, 50, 1)); //2
    result = result.concat(createVerticalWallsChain(100, 500, 50, 150, 1)); //3
    result = result.concat(createHorizontalWallsChain(0, 600, 100, 50, 1)); //2

    function cropResult(result) {
        var WINDOW_WIDTH = 1366;
        var WINDOW_HEIGHT = 662;
        var dx = window.innerWidth / WINDOW_WIDTH;
        var dy = window.innerHeight / WINDOW_HEIGHT;

        for (var i = 0; i < result.length; i++) {
            // x, y, width, height, type
            var obstacle = result[i];
            obstacle[0] *= dx;
            obstacle[1] *= dy;
            // obstacle[2] *= dx;
            // obstacle[3] *= dy;
            result[i] = obstacle;
        }
        return result;
    }

    return cropResult(result);
}

var drawBackgroundGrid = function(canvas) {
    var context = canvas.getContext('2d');
    var bigStep = 100;
    var smallStep = 10;
    context.beginPath();
    context.strokeStyle = '#eeeeee';
    for (var x = 0; x < canvas.width; x += smallStep) {
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
    }
    for (var y = 0; y < canvas.height; y += smallStep) {
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
    }
    context.stroke();

    context.beginPath();
    context.strokeStyle = '#aaaaaa';
    for (var x = 0; x < canvas.width; x += bigStep) {
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
    }
    for (var y = 0; y < canvas.height; y += bigStep) {
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
    }
    context.stroke();
};