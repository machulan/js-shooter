/**
 * Вспомогательные функции.
 */

function randomIntInRange(minValue, maxValue) {
    return Math.round(Math.random() * (maxValue - minValue)) + minValue;
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

// window.addEventListener('click', function(e) {
//     e.preventDefault();
//     // debugger;
//     var x = e.clientX;
//     var y = Math.round(parseFloat(e.clientY) * 100 / 94);
//     // var y = (+e.clientY * 100 / 94).toString();
//     var coords = '(' + x + ', ' + y + ')';
//     updateGamePulse(coords);
// });