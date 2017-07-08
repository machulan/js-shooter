function Component(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.getEdges = function() {
        var left = this.x;
        var right = left + this.width;
        var top = this.y;
        var bottom = top + this.height;
        return [left, right, top, bottom];
    };

    this.hasIntersection = function(otherComponent) {
        var edges = this.getEdges();
        var left = edges[0];
        var right = edges[1];
        var top = edges[2];
        var bottom = edges[3];

        var otherEdges = otherComponent.getEdges();
        var otherLeft = otherEdges[0];
        var otherRight = otherEdges[1];
        var otherTop = otherEdges[2];
        var otherBottom = otherEdges[3];

        var result = true;
        if (bottom < otherTop || top > otherBottom || left > otherRight || right < otherLeft) {
            result = false;
        }
        return result;
    };
    this.in = function(otherComponent) {
        var edges = this.getEdges();
        var left = edges[0];
        var right = edges[1];
        var top = edges[2];
        var bottom = edges[3];

        var otherEdges = otherComponent.getEdges();
        var otherLeft = otherEdges[0];
        var otherRight = otherEdges[1];
        var otherTop = otherEdges[2];
        var otherBottom = otherEdges[3];

        return otherLeft <= left && right <= otherRight && otherTop <= top && bottom <= otherBottom;
    };

    this.inCanvas = function() {
        var edges = this.getEdges();
        var left = edges[0];
        var right = edges[1];
        var top = edges[2];
        var bottom = edges[3];

        var otherEdges = game.getCanvasEdges();
        var otherLeft = otherEdges[0];
        var otherRight = otherEdges[1];
        var otherTop = otherEdges[2];
        var otherBottom = otherEdges[3];

        return otherLeft <= left && right <= otherRight && otherTop <= top && bottom <= otherBottom;
    };
}

function Background(x, y, width, height, style) {
    Component.apply(this, arguments);
    this.style = style;
}

function Timer(x, y, text, fontSize, fontFamily, color) {
    Component.call(this, x, y, 0, 0);

    this.text = text;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;

    // score = new Component("30px", "Consolas", "black", 280, 40, "text");

    this.update = function() {
        game.context.font = this.fontSize + " " + this.fontFamily;
        game.context.fillStyle = this.color;
        game.context.fillText(this.text, this.x, this.y);
    }
}

function Obstacle(x, y, width, height) {
    Component.apply(this, arguments);
}

function DestructibleWall(x, y, width, height) {
    Obstacle.apply(this, arguments);
    this.image = new Image();
    // this.image.src = 'images/destructible_wall.png';
    this.image.src = 'images/small_box.png';
}

function IndestructibleWall(x, y, width, height) {
    Obstacle.apply(this, arguments);
    this.image = new Image(); //document.createElement('image'); //
    this.image.onload = function() {
        this.pattern = game.context.createPattern(this.image, 'repeat'); //game.context.createPattern(this.image, 'repeat');
        // alert(pattern);
        game.context.fillStyle = this.pattern;
        game.context.rect(x, y, width, height);
        game.context.fill();
        console.log();
    }.bind(this);
    // this.image.src = 'images/indestructible_wall.png';
    this.image.src = 'images/small_box.png';
    // this.image.src = 'images/box1_cr.png';
    // this.image.src = 'images/small_box_1.png';

    this.update = function() {
        // game.context.fillStyle = this.pattern;
        // game.context.rect(x, y, width, height);
        // game.context.fill();
    }.bind(this);
}


function Unit(x, y, width, height) {
    Component.apply(this, arguments);

    this.health = 100;
    this.decreaseHealth = function(damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
        }
    }
    this.speedX = 0;
    this.speedY = 0;
}

function Player(x, y, width, height) {
    Unit.apply(this, arguments);

    this.health = 100;
    this.image = new Image();

    // this.image.onload = function() {
    //     var pattern = game.context.createPattern(this.image, 'repeat');
    //     // alert(pattern);
    //     game.context.fillStyle = pattern;
    //     game.context.rect(x, y, width, height);
    //     game.context.fill();
    // }.bind(this);
    this.speedX = 0;
    this.speedY = 0;
    // this.image.src = 'images/player.png';
    this.image.src = 'images/Machulazz_face.png';
    // this.image.src = 'images/green_circle.png';

    this.update = function() {
        // game.context.shadowOffsetX = 5;
        // game.context.shadowOffsetY = 5;
        // game.context.shadowBlur = 10;
        // game.context.shadowColor = '#0F0'; //'#050'; 
        game.context.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    // var self = this;
    this.updatePosition = function() {
        this.x += this.speedX;
        this.y += this.speedY;

        // var newX = this.x + this.speedX;
        // var newY = this.y + this.speedY;

        if (!this.inCanvas() || this.checkCrashesWithWalls()) {
            this.x -= this.speedX;
            this.y -= this.speedY;
            // console.log('has intersection with walls');
        }




        this.checkBounds();
        this.checkCrashesWithWalls();
        this.checkCrashesWithEnemies1();
    };
    this.checkBounds = function() {
        var canvasEdges = game.getCanvasEdges();
        var canvasLeft = canvasEdges[0];
        var canvasRight = canvasEdges[1];
        var canvasTop = canvasEdges[2];
        var canvasBottom = canvasEdges[3];

        var edges = this.getEdges();
        var left = edges[0];
        var right = edges[1];
        var top = edges[2];
        var bottom = edges[3];

        // left
        if (left < canvasLeft) {
            this.x = canvasLeft;
        }
        if (right > canvasRight) {
            this.x = canvasRight - this.width;
        }
        if (top < canvasTop) {
            this.y = canvasTop;
        }
        if (bottom > canvasBottom) {
            this.y = canvasBottom - this.height;
        }
    };
    this.checkCrashesWithWalls = function() {
        var result = walls.some(this.hasIntersectionWithComponent);
        // console.log('has no intersection with walls');
        return result;

        for (var i = 0; i < walls.length; i++) {
            if (this.hasIntersection(walls[i])) {
                // alert('crash');
                //player.stop();
                // walls = [];
                var edges = this.getEdges();
                var left = edges[0];
                var right = edges[1];
                var top = edges[2];
                var bottom = edges[3];

                var otherEdges = walls[i].getEdges();
                var otherLeft = otherEdges[0];
                var otherRight = otherEdges[1];
                var otherTop = otherEdges[2];
                var otherBottom = otherEdges[3];

                if (right >= otherLeft && left < otherLeft && bottom > otherTop && top < otherBottom) {
                    this.x -= 1; //= otherLeft - this.width;
                }
                if (left <= otherRight && right > otherRight && bottom > otherTop && top < otherBottom) {
                    this.x += 1; //= otherRight + 1;
                }
                if (top <= otherBottom && bottom > otherBottom && right > otherLeft && left < otherRight) {
                    this.y += 1; //= otherBottom + 1;
                }
                if (bottom >= otherTop && top < otherTop && right > otherLeft && left < otherRight) {
                    this.y -= 1; //= otherTop - this.width;
                }
            }
        }
    };
    this.hasIntersectionWithComponent = function(component) {
        return this.hasIntersection(component);
    }.bind(this);
    this.checkCrashes = function(components) {
        for (var i = 0; i < components.length; i++) {
            if (this.hasIntersection(components[i])) {
                // alert('crash');
                //player.stop();
                // walls = [];
                var edges = this.getEdges();
                var left = edges[0];
                var right = edges[1];
                var top = edges[2];
                var bottom = edges[3];

                var otherEdges = components[i].getEdges();
                var otherLeft = otherEdges[0];
                var otherRight = otherEdges[1];
                var otherTop = otherEdges[2];
                var otherBottom = otherEdges[3];

                if (right >= otherLeft && left < otherLeft && bottom > otherTop && top < otherBottom) {
                    this.x -= 1; //= otherLeft - this.width;
                }
                if (left <= otherRight && right > otherRight && bottom > otherTop && top < otherBottom) {
                    this.x += 1; //= otherRight + 1;
                }
                if (top <= otherBottom && bottom > otherBottom && right > otherLeft && left < otherRight) {
                    this.y += 1; //= otherBottom + 1;
                }
                if (bottom >= otherTop && top < otherTop && right > otherLeft && left < otherRight) {
                    this.y -= 1; //= otherTop - this.width;
                }
            }
        }
    }.bind(this);

    this.checkCrashesWithEnemies1 = function() {
        for (var i = 0; i < enemies.length; i++) {
            if (this.hasIntersection(enemies[i])) {
                // alert('crash');
                //player.stop();
                // walls = [];
                var edges = this.getEdges();
                var left = edges[0];
                var right = edges[1];
                var top = edges[2];
                var bottom = edges[3];

                var otherEdges = enemies[i].getEdges();
                var otherLeft = otherEdges[0];
                var otherRight = otherEdges[1];
                var otherTop = otherEdges[2];
                var otherBottom = otherEdges[3];

                if (right >= otherLeft && left < otherLeft && bottom > otherTop && top < otherBottom) {
                    this.x -= 1; //= otherLeft - this.width;
                }
                if (left <= otherRight && right > otherRight && bottom > otherTop && top < otherBottom) {
                    this.x += 1; //= otherRight + 1;
                }
                if (top <= otherBottom && bottom > otherBottom && right > otherLeft && left < otherRight) {
                    this.y += 1; //= otherBottom + 1;
                }
                if (bottom >= otherTop && top < otherTop && right > otherLeft && left < otherRight) {
                    this.y -= 1; //= otherTop - this.width;
                }
            }
        }
    }.bind(this);
    this.updateSpeeds = function() {
        // if (game.keys) {
        //     if (game.keys[LEFT_ARROW_KEY_CODE]) {
        //         this.speedX = -1;
        //     }
        //     if (game.keys[RIGHT_ARROW_KEY_CODE]) {
        //         this.speedX = 1;
        //     }
        //     if (game.keys[UP_ARROW_KEY_CODE]) {
        //         this.speedY = -1;
        //     }
        //     if (game.keys[DOWN_ARROW_KEY_CODE]) {
        //         this.speedY = 1;
        //     }
        //     if (game.keys[SPACE_KEY_CODE]) {
        //         this.shoot();
        //     }
        // }
        if (game.keys) {
            if (game.keys[LEFT_ARROW_KEY_CODE]) {
                this.speedX = -4;
            }
            if (game.keys[RIGHT_ARROW_KEY_CODE]) {
                this.speedX = 4;
            }
            if (game.keys[UP_ARROW_KEY_CODE]) {
                this.speedY = -4;
            }
            if (game.keys[DOWN_ARROW_KEY_CODE]) {
                this.speedY = 4;
            }
            if (game.keys[SPACE_KEY_CODE]) {
                this.shoot();
            }
        }
    };
    this.stop = function() {
        this.speedX = this.speedY = 0;
        // alert('stopted')
    };
    this.shoot = function() {
        console.log('shot');
    };
    console.log('new player created')
}

function Home(x, y, width, height) {
    Unit.apply(this, arguments);

    this.health = 200;
    this.image = new Image();

    // this.image.onload = function() {
    //     var pattern = game.context.createPattern(this.image, 'repeat');
    //     // alert(pattern);
    //     game.context.fillStyle = pattern;
    //     game.context.rect(x, y, width, height);
    //     game.context.fill();
    // }.bind(this);
    this.speedX = 0;
    this.speedY = 0;
    // this.image.src = 'images/player.png';
    // this.image.src = 'images/Machulazz_face.png';
    // this.image.src = 'images/green_circle.png';
    this.image.src = 'images/home.png';

    this.update = function() {
        // game.context.shadowOffsetX = 5;
        // game.context.shadowOffsetY = 5;
        // game.context.shadowBlur = 10;
        // game.context.shadowColor = '#0F0'; //'#050'; 
        game.context.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    this.updatePosition = function() {
        this.x += this.speedX;
        this.y += this.speedY;

        this.checkBounds();
        this.checkCrashesWithWalls();
        // this.checkCrashesWithEnemies1();
    };
    this.checkBounds = function() {
        var canvasEdges = game.getCanvasEdges();
        var canvasLeft = canvasEdges[0];
        var canvasRight = canvasEdges[1];
        var canvasTop = canvasEdges[2];
        var canvasBottom = canvasEdges[3];

        var edges = this.getEdges();
        var left = edges[0];
        var right = edges[1];
        var top = edges[2];
        var bottom = edges[3];

        // left
        if (left < canvasLeft) {
            this.x = canvasLeft;
        }
        if (right > canvasRight) {
            this.x = canvasRight - this.width;
        }
        if (top < canvasTop) {
            this.y = canvasTop;
        }
        if (bottom > canvasBottom) {
            this.y = canvasBottom - this.height;
        }
    };
    this.checkCrashesWithWalls = function() {
        for (var i = 0; i < walls.length; i++) {
            if (this.hasIntersection(walls[i])) {
                // alert('crash');  
                //player.stop();
                // walls = [];
                var edges = this.getEdges();
                var left = edges[0];
                var right = edges[1];
                var top = edges[2];
                var bottom = edges[3];

                var otherEdges = walls[i].getEdges();
                var otherLeft = otherEdges[0];
                var otherRight = otherEdges[1];
                var otherTop = otherEdges[2];
                var otherBottom = otherEdges[3];

                if (right >= otherLeft && left < otherLeft && bottom > otherTop && top < otherBottom) {
                    this.x -= 1; //= otherLeft - this.width;
                }
                if (left <= otherRight && right > otherRight && bottom > otherTop && top < otherBottom) {
                    this.x += 1; //= otherRight + 1;
                }
                if (top <= otherBottom && bottom > otherBottom && right > otherLeft && left < otherRight) {
                    this.y += 1; //= otherBottom + 1;
                }
                if (bottom >= otherTop && top < otherTop && right > otherLeft && left < otherRight) {
                    this.y -= 1; //= otherTop - this.width;
                }
            }
        }
    };
    this.updateSpeeds = function() {
        this.speedX = 0;
        this.speedY = 0;
    };
    this.stop = function() {
        this.speedX = this.speedY = 0;
        // alert('stopted')
    };
    console.log('new home created')
}

function Enemy(x, y, width, height) {
    Unit.apply(this, arguments);

    this.health = Math.round(this.width / 2);
    this.image = new Image();
    this.speedX = 0;
    this.speedY = 0;
    // this.image.src = 'images/enemy.png';
    this.image.src = 'images/red_circle.png';
    // this.image.src = 'images/Machulazz_face.png';
    // this.image.src = 'images/green_circle.png';
    // this.image.src = 'images/�����.jpg';
    // this.image.src = 'images/sergey.jpg';

    this.update = function() {
        game.context.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    this.updatePosition = function() {
        this.x += this.speedX;
        this.y += this.speedY;

        this.checkBounds();
        this.checkCrashesWithHome();
        this.checkCrashesWithPlayer();
        this.checkCrashesWithEnemies();
        this.checkCrashesWithWalls();
    };
    this.checkBounds = function() {
        var canvasEdges = game.getCanvasEdges();
        var canvasLeft = canvasEdges[0];
        var canvasRight = canvasEdges[1];
        var canvasTop = canvasEdges[2];
        var canvasBottom = canvasEdges[3];

        var edges = this.getEdges();
        var left = edges[0];
        var right = edges[1];
        var top = edges[2];
        var bottom = edges[3];

        // left
        if (left < canvasLeft) {
            this.x = canvasLeft;
        }
        if (right > canvasRight) {
            this.x = canvasRight - this.width;
        }
        if (top < canvasTop) {
            this.y = canvasTop;
        }
        if (bottom > canvasBottom) {
            this.y = canvasBottom - this.height;
        }
    };
    this.checkCrashesWithWalls = function() {
        for (var i = 0; i < walls.length; i++) {
            if (this.hasIntersection(walls[i])) {
                // alert('crash');
                //player.stop();
                // walls = [];
                var edges = this.getEdges();
                var left = edges[0];
                var right = edges[1];
                var top = edges[2];
                var bottom = edges[3];

                var otherEdges = walls[i].getEdges();
                var otherLeft = otherEdges[0];
                var otherRight = otherEdges[1];
                var otherTop = otherEdges[2];
                var otherBottom = otherEdges[3];

                if (right >= otherLeft && left < otherLeft && bottom > otherTop && top < otherBottom) {
                    this.x -= 1; //= otherLeft - this.width;
                }
                if (left <= otherRight && right > otherRight && bottom > otherTop && top < otherBottom) {
                    this.x += 1; //= otherRight + 1;
                }
                if (top <= otherBottom && bottom > otherBottom && right > otherLeft && left < otherRight) {
                    this.y += 1; //= otherBottom + 1;
                }
                if (bottom >= otherTop && top < otherTop && right > otherLeft && left < otherRight) {
                    this.y -= 1; //= otherTop - this.width;
                }
            }
        }
    };
    this.checkCrashesWithEnemies = function() {
        for (var i = 0; i < enemies.length; i++) {
            if (this.hasIntersection(enemies[i])) {
                // alert('crash');
                //player.stop();
                // walls = [];
                var edges = this.getEdges();
                var left = edges[0];
                var right = edges[1];
                var top = edges[2];
                var bottom = edges[3];

                var otherEdges = enemies[i].getEdges();
                var otherLeft = otherEdges[0];
                var otherRight = otherEdges[1];
                var otherTop = otherEdges[2];
                var otherBottom = otherEdges[3];

                if (right >= otherLeft && left < otherLeft && bottom > otherTop && top < otherBottom) {
                    this.x -= 1; //= otherLeft - this.width;
                }
                if (left <= otherRight && right > otherRight && bottom > otherTop && top < otherBottom) {
                    this.x += 1; //= otherRight + 1;
                }
                if (top <= otherBottom && bottom > otherBottom && right > otherLeft && left < otherRight) {
                    this.y += 1; //= otherBottom + 1;
                }
                if (bottom >= otherTop && top < otherTop && right > otherLeft && left < otherRight) {
                    this.y -= 1; //= otherTop - this.width;
                }
            }
        }
    };
    this.checkCrashesWithPlayer = function() {
        if (this.hasIntersection(player)) {
            // alert('crash');
            //player.stop();
            // walls = [];
            var edges = this.getEdges();
            var left = edges[0];
            var right = edges[1];
            var top = edges[2];
            var bottom = edges[3];

            var otherEdges = player.getEdges();
            var otherLeft = otherEdges[0];
            var otherRight = otherEdges[1];
            var otherTop = otherEdges[2];
            var otherBottom = otherEdges[3];

            if (right >= otherLeft && left < otherLeft && bottom > otherTop && top < otherBottom) {
                this.x -= 1; //= otherLeft - this.width;
            }
            if (left <= otherRight && right > otherRight && bottom > otherTop && top < otherBottom) {
                this.x += 1; //= otherRight + 1;
            }
            if (top <= otherBottom && bottom > otherBottom && right > otherLeft && left < otherRight) {
                this.y += 1; //= otherBottom + 1;
            }
            if (bottom >= otherTop && top < otherTop && right > otherLeft && left < otherRight) {
                this.y -= 1; //= otherTop - this.width;
            }
        }
    };

    this.checkCrashesWithHome = function() {
        if (this.hasIntersection(home)) {
            game.gameOver();
        }
    };
    this.updateSpeeds = function() {

        this.speedX = randomIntInRange(-1, 1);
        this.speedY = randomIntInRange(-1, 1);

        // this.speedX = 0;
        // this.speedY = -1;
        // this.speedX *= 2;
        // this.speedY *= 2;
    };
    this.stop = function() {
        this.speedX = this.speedY = 0;
    };
    this.shoot = function() {
        console.log('shot');
    };
    console.log('new enemy created')
}

function Weapon(x, y, width, height) {
    Component.apply(this, arguments)
}

function PlayerWeapon(x, y, width, height) {
    Weapon.apply(this, arguments);
}

function EnemyWeapon(x, y, width, height) {
    Weapon.apply(this, arguments);
}