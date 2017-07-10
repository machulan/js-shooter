(function() {
    /**
     * Модуль отрисовки компонент игры на экране.
     */

    var canvas = false;
    var context = false;

    function init() {
        canvas = document.querySelector('canvas');
        if (!canvas) {
            console.log('creating canvas...');
            canvas = document.createElement('canvas');
            canvas.width = window.innerWidth; //800; 
            canvas.height = window.innerHeight; // 600;
            // console.log(window.innerWidth, window.innerHeight);
            // canvas.width = 1366;
            // canvas.height = 662;

            document.getElementById('game-area').appendChild(canvas);
            context = canvas.getContext('2d');
        } else {
            if (context) {
                console.log('clearing canvas...')
                context.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                context = canvas.getContext('2d');
            }
        }
    }

    function getCanvas() {
        return canvas;
    }

    function getContext() {
        return context;
        // return document.querySelector('canvas').getContext('2d');
    }

    function getBounds() {
        return {
            left: 0,
            right: canvas.width,
            top: 0,
            bottom: canvas.height
        };
    }

    function clearGameArea() {
        console.log('clearing game area...');
        // a = 0 / 0;
        // var canvas = document.querySelector('canvas');
        // var context = canvas.getContext('2d');
        // console.log(canvas.width);
        context.beginPath();
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function makeCircle(params) {
        // console.log('making circle...');
        var center = params.center;
        var radius = params.radius;
        var image = params.image;

        // var context = getContext();
        context.beginPath();
        context.save();
        // context.fillStyle = "#0fff00";
        context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
        context.clip();
        context.drawImage(image, center.x - radius, center.y - radius, radius * 2, radius * 2);
        context.restore();


        // context.clearRect(0, 0, canvas.width, canvas.height);
        // var context = getContext();
        // context.save();
        // context.fillStyle = "#ff9900";
        // // context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
        // context.rect(0, 0, 1366, 662);
        // // context.rect(center.x, center.y, 100, 100);
        // // console.log(center.x, center.y);
        // context.fill();
        // context.restore();
    }

    function makeTurnedCircle(params) {
        // console.log('making turned circle...');
        var center = params.center;
        var radius = params.radius;
        var image = params.image;
        var angle = params.angle;

        // console.log('angle :', angle);

        // var context = getContext();
        context.beginPath();
        context.save();
        context.translate(center.x, center.y);
        context.rotate(angle);
        // context.arc(0, 0, radius, 0, 2 * Math.PI, false);
        // context.clip();
        context.drawImage(image, -radius, -radius, radius * 2, radius * 2);
        context.restore();


        // context.clearRect(0, 0, canvas.width, canvas.height);
        // var context = getContext();
        // context.save();
        // context.fillStyle = "#ff9900";
        // // context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
        // context.rect(0, 0, 1366, 662);
        // // context.rect(center.x, center.y, 100, 100);
        // // console.log(center.x, center.y);
        // context.fill();
        // context.restore();
    }

    function clearCircle(params) {
        // console.log('clearing circle...');
        var center = params.center;
        var radius = params.radius;
        // var fillStyle = params.filler;

        context.globalCompositeOperation = 'destination-out';
        context.beginPath();
        context.arc(center.x, center.y, radius * 1.012, 0, Math.PI * 2, true); // 1.012
        context.fill();

        context.globalCompositeOperation = 'source-over';
    }

    // CLEAR CIRCLE RIGHT:
    // function clearCircle(params) {
    //     console.log('clearing circle...');
    //     var center = params.center;
    //     var radius = params.radius;
    //     var fillStyle = params.filler;

    //     context.globalCompositeOperation = 'destination-out';
    //     context.beginPath();
    //     context.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
    //     context.fill();

    //     context.globalCompositeOperation = 'source-over';
    // }

    window.renderer = {
        init: init,
        clearCircle: clearCircle,
        makeCircle: makeCircle,
        getBounds: getBounds,
        clearGameArea: clearGameArea,
        // getContext: getContext,
        // getCanvas: getCanvas,
        makeTurnedCircle: makeTurnedCircle
    };
})();