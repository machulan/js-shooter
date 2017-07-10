(function() {
    /**
     * Модуль с классами компонент игры.
     */

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


    function Component(center, radius) {
        this.center = center;
        // this.x = center.x;
        // this.y = center.y;
        this.radius = radius;
    }

    Component.numberSquare = function(number) {
        return number * number;
    }

    Component.prototype.distanceSquareTo = function(component) {
        var self = this;
        return Component.numberSquare(self.center.x - component.center.x) + Component.numberSquare(self.center.y - component.center.y);
    }

    Component.prototype.distanceTo = function(component) {
        var self = this;
        return Math.floor(Math.sqrt(self.distanceSquareTo(component)));
    }

    Component.prototype.hasIntersectionWith = function(component) {
        // all the components are circles
        var radiiSum = this.radius + component.radius;
        return Component.numberSquare(radiiSum) > this.distanceSquareTo(component);
    }

    Component.prototype.checkBounds = function() {
        var self = this;
        var bounds = self.getBounds();
        var rendererBounds = renderer.getBounds();
        return rendererBounds.left <= bounds.left &&
            bounds.right <= rendererBounds.right &&
            rendererBounds.top <= bounds.top &&
            bounds.bottom <= rendererBounds.bottom;
    }

    Component.prototype.getBounds = function() {
        var self = this;
        return {
            left: self.center.x - self.radius,
            right: self.center.x + self.radius,
            top: self.center.y - self.radius,
            bottom: self.center.y + self.radius
        };
    }

    // Tree

    function Tree(center, radius) {
        Component.apply(this, arguments);
        this.image = resourses.get('images/tree.png');
        renderer.makeCircle({ center: this.center, radius: this.radius, image: this.image });
    }

    Tree.prototype = Object.create(Component.prototype);
    Tree.prototype.constructor = Tree;

    Tree.prototype.update = function() {
        var self = this;
        renderer.clearCircle({ center: self.center, radius: self.radius });
        renderer.makeCircle({ center: self.center, radius: self.radius, image: self.image });
    }

    Tree.prototype.burn = function() {
        var self = this;
        console.log('tree burning...');
        console.log('tree burned...');

        renderer.clearCircle({ center: self.center, radius: self.radius });

        window.trees = window.trees.filter(function(tree) { return tree != self }, self);

        window.player.reduceHealthBy(Math.round(self.radius / 7));
    }

    // Rock

    function Rock(center, radius) {
        Component.apply(this, arguments);
        this.image = resourses.get('images/rock.png');
        renderer.makeCircle({ center: this.center, radius: this.radius, image: this.image });
    }

    Rock.prototype = Object.create(Component.prototype);
    Rock.prototype.constructor = Rock;

    Rock.prototype.update = function() {
        var self = this;
        renderer.clearCircle({ center: self.center, radius: self.radius });
        renderer.makeCircle({ center: self.center, radius: self.radius, image: self.image });
    }

    // Player

    function Player(center, radius) {
        Component.apply(this, arguments);
        this.angle = 0;
        this.speed = { x: 0, y: 0, rotation: 0 };

        this.fireRate = 10; // per second (1000 ms) (max 50)
        this.bulletNumber = 100;
        this.maxBulletNumber = 300;

        this.bombRate = 1; // per second (1000 ms) (bomb per 5 seconds (0.2))
        this.bombNumber = 2;
        this.maxBombNumber = 2;

        this.cureRate = 1;
        this.curePower = 50;
        this.cureNumber = 1;
        this.maxCureNumber = 3;

        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.dead = false;

        this.score = 0;

        this.image = resourses.get('images/player.png');
        renderer.makeTurnedCircle({ center: this.center, radius: this.radius, image: this.image, angle: this.angle });
    }

    Player.prototype = Object.create(Component.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.reduceHealthBy = function(value) {
        var self = this;
        self.health -= value;
        self.health = Math.max(self.health, 0);
        if (self.health == 0) {
            self.die();
        }
    }

    Player.prototype.die = function() {
        var self = this;
        self.dead = true;
        // updateDie
        self.image = resourses.get('images/shit-piece.png');
        renderer.clearCircle({ center: self.center, radius: self.radius });
        renderer.makeTurnedCircle({
            center: self.center,
            radius: Math.round(self.radius * 0.8),
            angle: Math.PI,
            image: self.image
        });
        setTimeout(function() {
            renderer.clearCircle({ center: self.center, radius: self.radius });
            window.gameOver();
        }.bind(self), 1000);

        // flies hatch in this place
        var center1 = Object.assign({}, self.center);
        var center2 = Object.assign({}, self.center);
        window.flies.push(new Fly(center1, 20));
        window.flies.push(new Fly(center2, 15));
    }

    Player.prototype.update = function() {
        var self = this;
        self.updateHealth();
        self.updateBombing();
        self.updateShooting();
        self.updateRotationSpeed();
        self.updateSpeed();
        self.updateAngle();
        self.speedsWasReduced = false;
        self.triedToReduceSpeedX = false;
        self.triedToReduceSpeedY = false;
        self.updatePosition();
    }

    Player.prototype.stop = function() {
        var self = this;
        self.speed.x = self.speed.y = 0;
    }

    Player.prototype.stopRotation = function() {
        var self = this;
        self.speed.rotation = 0;
    }

    Player.prototype.addScore = function(score) {
        var self = this;
        self.score += score;
    }

    Player.prototype.updateHealth = function() {
        var self = this;

        var keys = window.keys;
        if (keys) {
            if (keys[F_KEY_CODE]) {
                self.cure();
            }
        }
    }

    Player.prototype.cure = function() {
        var self = this;
        var currentTime = window.getTime();

        if (!self.previousCureTime)
            self.previousCureTime = window.getTime() - Math.round(1000 / self.cureRate);

        if (self.cureNumber > 0 && currentTime - self.previousCureTime >= Math.round(1000 / self.cureRate) &&
            self.health < self.maxHealth) {
            self.addHealth(self.curePower);

            self.previousCureTime = currentTime;

            self.cureNumber--;
        }
    }

    Player.prototype.addHealth = function(health) {
        var self = this;
        self.health += health;
        self.health = Math.min(self.health, self.maxHealth);
    }

    Player.prototype.updateShooting = function() {
        var self = this;

        var keys = window.keys;
        if (keys) {
            if (keys[SPACE_KEY_CODE]) {
                self.shoot();
            }
        }
    }

    Player.prototype.shoot = function() {
        var self = this;
        var currentTime = window.getTime();

        if (!self.previousShotTime)
            self.previousShotTime = window.getTime() - Math.round(1000 / self.fireRate);

        if (self.bulletNumber > 0 && currentTime - self.previousShotTime >= Math.round(1000 / self.fireRate)) {
            var center = Object.assign({}, self.center);
            center.x += Math.round(25 * Math.sin(self.angle + 0.65)); // 36 0.5
            center.y += (-1) * Math.round(25 * Math.cos(self.angle + 0.65)); //33 0.6 // 36 0.5 
            window.bullets.push(new Bullet(center, 8, self.angle)); // 10
            self.previousShotTime = currentTime;

            self.bulletNumber--;
        }
    }

    Player.prototype.addBullets = function(bulletNumber) {
        var self = this;
        self.bulletNumber += bulletNumber;
        self.bulletNumber = Math.min(self.bulletNumber, self.maxBulletNumber);
    }

    Player.prototype.addCure = function() {
        var self = this;
        self.cureNumber++;
        self.cureNumber = Math.min(self.cureNumber, self.maxCureNumber);
    }

    Player.prototype.addBomb = function() {
        var self = this;
        self.bombNumber++;
        self.bombNumber = Math.min(self.bombNumber, self.maxBombNumber);
    }

    Player.prototype.updateBombing = function() {
        var self = this;
        var keys = window.keys;
        if (keys) {
            if (keys[B_KEY_CODE]) {
                self.bomb();
            }
        }
    }

    Player.prototype.bomb = function() {
        var self = this;
        var currentTime = window.getTime();

        if (!self.previousBombTime)
            self.previousBombTime = window.getTime() - Math.round(1000 / self.bombRate);

        if (self.bombNumber > 0 && currentTime - self.previousBombTime >= Math.round(1000 / self.bombRate)) {
            var center = Object.assign({}, self.center);
            window.bombs.push(new Bomb(center, 25));
            self.bombNumber--;

            self.previousBombTime = currentTime;
        }
    }

    Player.prototype.updateRotationSpeed = function() {
        var self = this;

        // debugger;

        self.stopRotation();

        var keys = window.keys;
        if (keys) {
            // console.log('keys is not empty!');
            if (keys[Q_KEY_CODE]) {
                // console.log('turning left');
                self.speed.rotation = -0.2;
            }
            if (keys[E_KEY_CODE]) {
                // console.log('turning right');
                self.speed.rotation = 0.2;
            }
        }
    }

    Player.prototype.updateSpeed = function() {
        var self = this;

        // debugger;

        self.stop();

        var keys = window.keys;
        if (keys) {
            // console.log('keys is not empty!');
            if (keys[LEFT_ARROW_KEY_CODE] || keys[A_KEY_CODE]) {
                // console.log('left');
                self.speed.x = -6;
            }
            if (keys[RIGHT_ARROW_KEY_CODE] || keys[D_KEY_CODE]) {
                // console.log('right');
                self.speed.x = 6;
            }
            if (keys[UP_ARROW_KEY_CODE] || keys[W_KEY_CODE]) {
                // console.log('up');
                self.speed.y = -6;
            }
            if (keys[DOWN_ARROW_KEY_CODE] || keys[S_KEY_CODE]) {
                // console.log('down');
                self.speed.y = 6;
            }
        }
    }

    Player.prototype.updateAngle = function() {
        var self = this;
        self.angle += self.speed.rotation;
    }

    Player.prototype.updatePosition = function() {
        var self = this;
        self.center.x += self.speed.x;
        self.center.y += self.speed.y;

        // debugger;

        // check on intersections
        var hasIntersectionWithTrees = window.trees.some(function(tree) {
            // return false;
            // TODO intersections
            // in x: 160, y: 152
            // если по одной из осей
            return self.hasIntersectionWith(tree);
        });

        var hasIntersectionWithRocks = window.rocks.some(function(rock) {
            return self.hasIntersectionWith(rock);
        });

        if (!self.checkBounds() || hasIntersectionWithTrees || hasIntersectionWithRocks) {
            self.center.x -= self.speed.x;
            self.center.y -= self.speed.y;

            if (!self.speedsWasReduced) {
                // reduce speed.x and speed.y to 1 (2)
                // console.log('speeds was reduced');
                self.speed.x = Math.sign(self.speed.x) * 1;
                self.speed.y = Math.sign(self.speed.y) * 1;
                self.speedsWasReduced = true;
                self.updatePosition();
            }
            if (!self.triedToReduceSpeedX) {
                var prevSpeedX = self.speed.x;
                self.speed.x = 0;
                self.triedToReduceSpeedX = true;
                self.updatePosition();
                self.speed.x = prevSpeedX;
            }

            if (!self.triedToReduceSpeedY) {
                self.speed.y = 0;
                self.triedToReduceSpeedY = true;
                self.updatePosition();
            }

        } else {
            // check intersection with spiders

            // window.spiders.forEach(function(spider) {
            //     if (self.hasIntersectionWith(spider)) {
            //         self.reduceHealthBy(1);
            //     }
            // });

            // if (!(self.speed.x == 0 && self.speed.y == 0)) {
            self.center.x -= self.speed.x;
            self.center.y -= self.speed.y;
            renderer.clearCircle({ center: self.center, radius: self.radius });
            self.center.x += self.speed.x;
            self.center.y += self.speed.y;
            renderer.makeTurnedCircle({ center: self.center, radius: self.radius, image: self.image, angle: self.angle });
            // }
        }
    }

    function Home(center, radius) {
        Component.apply(this, arguments);
        this.image = resourses.get('images/home.png');
        renderer.makeCircle({ center: this.center, radius: this.radius, image: this.image });
    }

    Home.prototype = Object.create(Component.prototype);
    Home.prototype.constructor = Home;

    Home.prototype.update = function() {
        renderer.clearCircle({ center: center, radius: radius });
        // Wall.prototype.updatePosition();
        renderer.makeCircle({ center: center, radius: radius, image: image });
    }

    // Spider (Enemy)

    function Spider(center, radius) {
        Component.apply(this, arguments);
        if (!Spider.images) {
            Spider.images = [resourses.get('images/spider_frame_0.png'), resourses.get('images/spider_frame_3.png'),
                resourses.get('images/spider_frame_1.png'), resourses.get('images/spider_frame_2.png'),
                resourses.get('images/spider_frame_1.png'), resourses.get('images/spider_frame_3.png')
            ];
        }
        this.frameNumber = 0;
        this.imageNumber = 0;

        renderer.makeCircle({ center: this.center, radius: this.radius, image: Spider.images[0] });

        this.speed = { x: 0, y: 0 };
        this.maxHealth = this.radius;
        this.health = this.maxHealth;
    }

    Spider.prototype = Object.create(Component.prototype);
    Spider.prototype.constructor = Spider;

    Spider.prototype.reduceHealthBy = function(value) {
        var self = this;
        self.health -= value;
        if (self.health <= 0) {
            self.die();
        }
    }

    Spider.prototype.die = function() {
        var self = this;
        // updateDie
        renderer.clearCircle({ center: self.center, radius: self.radius });
        renderer.makeTurnedCircle({
            center: self.center,
            radius: Math.round(self.radius * 0.8),
            angle: Math.PI,
            image: Spider.images[0]
        });
        setTimeout(function() {
            renderer.clearCircle({ center: self.center, radius: self.radius });
        }.bind(self), 3000);

        // flies hatch in this place
        var center1 = Object.assign({}, self.center);
        var center2 = Object.assign({}, self.center);
        window.flies.push(new Fly(center1, 20));
        window.flies.push(new Fly(center2, 15));

        // update player score
        window.player.addScore(self.maxHealth);

        window.spiders = window.spiders.filter(function(spider) { return spider != self }, self);
    }

    Spider.prototype.update = function() {
        var self = this;
        self.updateFeeding();
        self.updateSpeed();
        self.speedsWasReduced = false;
        self.triedToReduceSpeedX = false;
        self.triedToReduceSpeedY = false;

        // if (self.speed.x != 0 && self.speed.y != 0) {
        self.frameNumber = (self.frameNumber + 1) % 10; // 10
        self.imageNumber = Math.floor(self.frameNumber / 2); // 5
        // }
        self.updatePosition();
    }

    Spider.prototype.updateFeeding = function() {
        var self = this;
        window.flies.forEach(function(fly) {
            if (self.hasIntersectionWith(fly)) {
                self.health = Math.min(self.health + fly.kill(), self.maxHealth);
            }
        });
    }

    Spider.prototype.stop = function() {
        var self = this;
        self.speed.x = self.speed.y = 0;
    }

    Spider.prototype.updateSpeed = function() {
        var self = this;

        // if (randomIntInRange(0, 3) == 0) {
        //     self.stop();
        // }
        // var distanceSquareToPlayer = self.distanceSquareTo(window.player);

        // if (10000 < distanceSquareToPlayer && distanceSquareToPlayer < 20000) {
        //     // spider wants sting the player
        //     // var power = 1;
        //     // self.speed.x = Math.round(power * (window.player.center.x - self.center.x) / distanceSquareToPlayer);
        //     // self.speed.y = Math.round(power * (window.player.center.y - self.center.y) / distanceSquareToPlayer);
        //     // self.speed.x = Math.round(self.speed.x / Math.abs(self.speed.x));
        //     // self.speed.y = Math.round(self.speed.y / Math.abs(self.speed.y));
        //     // self.speed.x = 30;
        // } else {
        if (randomIntInRange(0, 10) == 0) {
            var xSign = randomIntInRange(-1, 1);
            self.speed.x = randomIntInRange(1, 7) * xSign;

            var ySign = randomIntInRange(-1, 1);
            self.speed.y = randomIntInRange(1, 7) * ySign;
        }
        // }
    }

    Spider.prototype.updatePosition = function() {
        var self = this;

        // intersection with player
        if (!window.player.dead && self.hasIntersectionWith(window.player)) {
            window.player.reduceHealthBy(1);
        }

        // trying to move
        self.center.x += self.speed.x;
        self.center.y += self.speed.y;

        if (!self.checkBounds()) {
            self.center.x -= self.speed.x;
            self.center.y -= self.speed.y;
            return;
        } else { // for game performance
            var hasIntersectionWithRocks = window.rocks.some(function(rock) {
                return self.hasIntersectionWith(rock);
            });
            // var hasIntersectionWithTrees = window.trees.some(function(tree) {
            //     return self.hasIntersectionWith(tree);
            // });

            var hasIntersectionWithSpiders = window.spiders.some(function(spider) {
                return spider != self && self.hasIntersectionWith(spider);
            });
            // var hasIntersectionWithSpiders = false;
            if (hasIntersectionWithRocks || hasIntersectionWithSpiders) {
                self.center.x -= self.speed.x;
                self.center.y -= self.speed.y;
                return;
            }
        }

        if (!(self.speed.x == 0 && self.speed.y == 0)) {
            self.center.x -= self.speed.x;
            self.center.y -= self.speed.y;
            renderer.clearCircle({ center: self.center, radius: self.radius });
            self.center.x += self.speed.x;
            self.center.y += self.speed.y;

            renderer.makeCircle({ center: self.center, radius: self.radius, image: Spider.images[self.imageNumber] });
        }

        // // check on intersections with rocks
        // window.rocks.forEach(function(rock) {
        //     if (self.hasIntersectionWith(rock)) {
        //         rock.update();
        //     }
        // });

        // check on intersections
        // window.trees.forEach(function(tree) {
        //     if (self.hasIntersectionWith(tree)) {
        //         tree.update();
        //     }
        // });
    }

    // Spider's lair

    function Lair(center, radius) {
        Component.apply(this, arguments);
        this.image = resourses.get('images/lair.png');
        renderer.makeCircle({ center: this.center, radius: this.radius, image: this.image });

        this.maxHealth = 300;
        this.health = 300;
        this.safetyDistance = 10000;

        this.minSpiderRadius = 20;
        this.maxSpiderRadius = this.radius;

        this.spiderCreationFrameProbability = Lair.spiderCreationProbability / window.framesPerSecond;
        this.spiderCreationFrameProbabilityRange = Math.round(1 / this.spiderCreationFrameProbability)
    }

    Lair.maxSpidersCount = 30;

    Lair.spiderCreationProbability = 1 / 1.5; // per second   

    Lair.prototype = Object.create(Component.prototype);
    Lair.prototype.constructor = Lair;

    Lair.prototype.die = function() {
        var self = this;
        renderer.clearCircle({ center: self.center, radius: self.radius });

        // update player score
        window.player.addScore(self.maxHealth);

        window.lairs = window.lairs.filter(function(lair) { return lair != self }, self);
    }

    Lair.prototype.reduceHealthBy = function(value) {
        var self = this;
        self.health -= value;
        if (self.health <= 0) {
            self.die();
        }
    }

    Lair.prototype.restoreHealthBy = function(value) {
        var self = this;
        self.health = Math.min(self.health + value, self.maxHealth);
    }

    Lair.prototype.update = function() {
        var self = this;

        // intersection with player
        if (!window.player.dead && self.hasIntersectionWith(window.player)) {
            window.player.reduceHealthBy(3);
        }

        if (window.spiders.length < Lair.maxSpidersCount) {
            var hasIntersectionWithSpiders = window.spiders.some(function(spider) {
                return self.hasIntersectionWith(spider); //self.distanceSquareTo(spider) > self.safetyDistance;
            });
            if (!hasIntersectionWithSpiders && randomIntInRange(0, self.spiderCreationFrameProbabilityRange) == 0) {
                self.createSpider();
            }
        }
        renderer.clearCircle({ center: self.center, radius: self.radius });
        renderer.makeCircle({ center: self.center, radius: self.radius, image: self.image });
    }

    Lair.prototype.createSpider = function() {
        var self = this;
        var radius = randomIntInRange(self.minSpiderRadius, self.maxSpiderRadius);
        self.restoreHealthBy(radius);
        var center = Object.assign({}, self.center);
        window.spiders.push(new Spider(center, radius));
    }

    // Fly (Bonuce)

    function Fly(center, radius) {
        Component.apply(this, arguments);
        this.image = resourses.get('images/fly.png');
        renderer.makeCircle({ center: this.center, radius: this.radius, image: this.image });

        this.speed = { x: 0, y: 0 };
        this.health = radius;

        this.frameNumber = 0;
        this.maxFrameNumber = Math.round(window.framesPerSecond * Fly.lifetime / 1000);
    }

    Fly.prototype = Object.create(Component.prototype);
    Fly.prototype.constructor = Fly;

    Fly.lifetime = 30000; // ms

    Fly.prototype.kill = function() {
        var self = this;
        var vitality = self.health;
        self.die();
        return vitality;
    }

    Fly.prototype.reduceHealthBy = function(value) {
        var self = this;
        self.health -= value;
        if (self.health <= 0) {
            self.die();
        }
    }

    Fly.prototype.die = function() {
        var self = this;
        renderer.clearCircle({ center: self.center, radius: self.radius });
        window.flies = window.flies.filter(function(fly) { return fly != self }, self);
    }

    Fly.prototype.update = function() {
        var self = this;
        self.frameNumber++;

        self.updateSpeed();
        self.speedsWasReduced = false;
        self.triedToReduceSpeedX = false;
        self.triedToReduceSpeedY = false;
        self.updatePosition();

        if (self.frameNumber >= self.maxFrameNumber) {
            self.die();
        }
    }

    Fly.prototype.stop = function() {
        var self = this;
        self.speed.x = self.speed.y = 0;
    }

    Fly.prototype.updateSpeed = function() {
        var self = this;

        // self.stop();
        if (randomIntInRange(0, 10) == 0) {
            self.speed.x = randomIntInRange(-10, 10);
            self.speed.y = randomIntInRange(-10, 10);
        }
    }

    Fly.prototype.updatePosition = function() {
        var self = this;
        self.center.x += self.speed.x;
        self.center.y += self.speed.y;

        if (!self.checkBounds()) {
            self.center.x -= self.speed.x;
            self.center.y -= self.speed.y;
            return;
        }

        if (!(self.speed.x == 0 && self.speed.y == 0)) {
            self.center.x -= self.speed.x;
            self.center.y -= self.speed.y;
            renderer.clearCircle({ center: self.center, radius: self.radius });
            self.center.x += self.speed.x;
            self.center.y += self.speed.y;

            // check on intersections with rocks
            // window.rocks.forEach(function(rock) {
            //     if (self.hasIntersectionWith(rock)) {
            //         rock.update();
            //     }
            // });

            renderer.makeCircle({ center: self.center, radius: self.radius, image: self.image });
        }

        // // check on intersections with rocks
        // window.rocks.forEach(function(rock) {
        //     if (self.hasIntersectionWith(rock)) {
        //         rock.update();
        //     }
        // });


        // check on intersections
        // window.trees.forEach(function(tree) {
        //     if (self.hasIntersectionWith(tree)) {
        //         tree.update();
        //     }
        // });
    }

    function Bomb(center, radius) {
        Component.apply(this, arguments);
        if (!Bomb.images) {
            Bomb.images = [resourses.get('images/bomb_frame_0.png'), resourses.get('images/bomb_frame_1.png'),
                resourses.get('images/bomb_frame_2.png'), resourses.get('images/bomb_frame_3.png'),
                resourses.get('images/bomb_frame_2.png'), resourses.get('images/bomb_frame_1.png')
            ];
        }

        this.frameNumber = 0;
        renderer.makeCircle({ center: this.center, radius: this.radius, image: Bomb.images[0] });

        this.injuryRadius = 10; // 15

        this.maxFrameNumber = Math.round(window.framesPerSecond * Bomb.delay / 1000);
        // setTimeout(function() { this.explode(); }.bind(this), 3000);
    }

    Bomb.delay = 3000; // ms

    Bomb.prototype = Object.create(Component.prototype);
    Bomb.prototype.constructor = Bomb;

    Bomb.prototype.update = function() {
        var self = this;
        renderer.clearCircle({ center: self.center, radius: self.radius });

        self.frameNumber++; // 10
        self.imageNumber = Math.floor((self.frameNumber % 10) / 2); // 5

        renderer.makeCircle({ center: self.center, radius: self.radius, image: Bomb.images[self.imageNumber] });

        if (self.frameNumber >= self.maxFrameNumber) {
            self.explode();
        }
    }

    Bomb.prototype.explode = function() {
        console.log('Bomb exploded!');
        var self = this;

        // console.log('center: ', self);

        renderer.clearCircle({ center: self.center, radius: self.radius });
        window.explosions.push(new Explosion(self.center, self.radius * 4));

        // spiders injury

        window.spiders.forEach(function(spider) {
            var distanceToSpider = self.distanceSquareTo(spider) / 10000;
            if (distanceToSpider <= self.injuryRadius) {
                // debugger;
                spider.reduceHealthBy(Math.round(150 / distanceToSpider));
            }
        });

        // trees injury

        window.trees.forEach(function(tree) {
            var distanceToTree = self.distanceSquareTo(tree) / 1000 / 2;
            if (distanceToTree <= self.injuryRadius) {
                tree.burn();
            }
        });

        //lairs injury

        window.lairs.forEach(function(lair) {
            var distanceToLair = self.distanceSquareTo(lair) / 10000;
            if (distanceToLair <= self.injuryRadius) {
                lair.reduceHealthBy(Math.round(100 / distanceToLair));
            }
        });

        // player injury
        var distanceToPlayer = self.distanceSquareTo(window.player) / 10000;
        if (distanceToPlayer <= self.injuryRadius) {
            window.player.reduceHealthBy(Math.round(90 / distanceToPlayer));
        }

        // window.spiders[0].reduceHealthBy(100);
        window.bombs.shift();
    }

    function Explosion(center, radius) {
        Component.apply(this, arguments);
        if (!Explosion.images) {
            Explosion.images = [resourses.get('images/explosion_frame_0.png'),
                resourses.get('images/explosion_frame_1.png'),
                resourses.get('images/explosion_frame_2.png')
            ];
        }
        // console.log(this.radius);

        this.frameNumber = 0;
        this.maxFrameNumber = 3; //7
        this.imageNumber = 0;

        // this.interval = setInterval(function() { this.update() }.bind(this), 20); // 30

        // console.log('explosion constructor');
        // this.frameNumber = 0;
        // renderer.makeCircle({ center: this.center, radius: this.radius, image: Bomb.images[0] });

        // this.injuryRadius = 15;
        // setInterval()
        // renderer.makeCircle({ center: this.center, radius: 50, image: Explosion.images[0] });

        // setTimeout(function() {
        //     // renderer.makeCircle({ center: this.center, radius: 50, image: Explosion.images[0] });
        //     renderer.clearCircle({ center: this.center, radius: 50 });
        // }.bind(this), 1000);
    }

    Explosion.prototype = Object.create(Component.prototype);
    Explosion.prototype.constructor = Explosion;

    Explosion.prototype.update = function() {
        var self = this;
        // if (self.imageNumber < Explosion.images.length) {
        //     renderer.makeCircle({ center: self.center, radius: 20 * (self.imageNumber + 1), image: Explosion.images[self.imageNumber] });
        // } else {
        //     renderer.clearCircle({ center: self.center, radius: 20 * Explosion.images.length });
        //     clearInterval(self.interval);
        // }
        if (self.frameNumber < self.maxFrameNumber) {
            renderer.makeCircle({
                center: self.center,
                radius: Math.min(Math.round(40 * Math.sqrt((self.frameNumber + 1))), self.radius), // 30 // TODO
                image: Explosion.images[0]
            });
            self.frameNumber++;
            // renderer.makeCircle({ center: self.center, radius: 2 * (self.frameNumber + 1) * (self.frameNumber + 1), image: Explosion.images[0] });
        } else {
            self.disappear();
        }
        // self.imageNumber++;
    }

    Explosion.prototype.disappear = function() {
        var self = this;
        renderer.clearCircle({ center: self.center, radius: Math.min(Math.round(50 * Math.sqrt((self.frameNumber))), self.radius) });
        // remove explosion
        window.explosions = window.explosions.filter(function(explosion) {
            return explosion != self;
        });
    }

    function Bullet(center, radius, angle) {
        Component.apply(this, arguments);
        this.image = resourses.get('images/bullet.png');
        this.speed = { x: Math.round(30 * Math.sin(angle)), y: (-1) * Math.round(30 * Math.cos(angle)) };
        this.angle = angle;
        renderer.makeTurnedCircle({ center: this.center, radius: this.radius, image: this.image, angle: this.angle });
    }

    Bullet.prototype = Object.create(Component.prototype);
    Bullet.prototype.constructor = Bullet;

    Bullet.prototype.update = function() {
        var self = this;
        // self.updateSpeed();
        // self.updatePosition();
        renderer.clearCircle({ center: self.center, radius: self.radius });

        self.center.x += self.speed.x;
        self.center.y += self.speed.y;

        if (!self.checkBounds()) {
            self.explode();
            return;
        }

        // trees injury

        var hasIntersectionWithTrees = false;
        window.trees.forEach(function(tree) {
            if (self.hasIntersectionWith(tree)) {
                hasIntersectionWithTrees = true;
                tree.burn(); // TODO tree.burn();
            }
        });
        if (hasIntersectionWithTrees) {
            self.explode();
            return;
        }

        // rocks injury

        var hasIntersectionWithRocks = window.rocks.some(function(rock) {
            return self.hasIntersectionWith(rock);
        });
        if (hasIntersectionWithRocks) {
            self.explode();
            return;
        }

        // spider injury

        var hasIntersectionWithSpiders = false;
        window.spiders.forEach(function(spider) {
            if (self.hasIntersectionWith(spider)) {
                hasIntersectionWithSpiders = true;
                spider.reduceHealthBy(5); // TODO tree.burn(); // TODO bulletPower changes depending on the distance between player and spider
            }
        });

        if (hasIntersectionWithSpiders) {
            self.explode();
            return;
        }

        // lairs injury

        var hasIntersectionWithLairs = false;
        window.lairs.forEach(function(lair) {
            if (self.hasIntersectionWith(lair)) {
                hasIntersectionWithLairs = true;
                lair.reduceHealthBy(2); // TODO tree.burn(); // TODO bulletPower changes depending on the distance between player and spider
            }
        });

        if (hasIntersectionWithLairs) {
            self.explode();
            return;
        }


        // self.center.x -= self.speed.x;
        // self.center.y -= self.speed.y;
        // renderer.clearCircle({ center: self.center, radius: self.radius });
        // self.center.x += self.speed.x;
        // self.center.y += self.speed.y;
        renderer.makeTurnedCircle({ center: self.center, radius: self.radius, image: self.image, angle: self.angle });
    }

    Bullet.prototype.explode = function() {
        var self = this;
        renderer.clearCircle({ center: self.center, radius: self.radius });
        window.explosions.push(new Explosion(self.center, 3 * self.radius));
        window.bullets = window.bullets.filter(function(bullet) {
            return bullet != self;
        });
    }

    function Bonus(center, radius, image) {
        Component.apply(this, arguments);

        this.image = image;
        this.frameNumber = 0;
        this.speed = { rotation: 0.1 };
        this.angle = 0;
        this.creationTime = window.getTime();
        this.maxFrameNumber = 200;

        // this.timeout = setTimeout(function() { // TODO fix bonus on pause
        //     if (this) { this.disappear(); };
        // }.bind(this), 10000);
    }

    Bonus.prototype = Object.create(Component.prototype);
    Bonus.prototype.constructor = Bonus;

    Bonus.prototype.update = function() {
        var self = this;
        // self.frameNumber = (self.frameNumber + 1) % 10; // 10
        // self.imageNumber = Math.floor(self.frameNumber / 2); // 5

        // self.angle += self.speed.rotation;

        renderer.clearCircle({ center: self.center, radius: self.radius });
        self.radius = 20 * (Math.sin((window.getTime() + self.creationTime) / 3) + 1.7); // 500 120 / 1.5 // 30 3 1.7
        self.radius = Math.max(self.radius, 15); // 25
        self.radius = Math.min(self.radius, 20); // 30
        renderer.makeTurnedCircle({ center: self.center, radius: self.radius, angle: self.angle, image: self.image });
    }

    Bonus.prototype.disappear = function() {
        var self = this;
        renderer.clearCircle({ center: self.center, radius: self.radius });
        window.bonuses = window.bonuses.filter(function(bonus) {
            return bonus != self;
        });
    }

    function CureBonus(center) {
        if (!CureBonus.image) {
            CureBonus.image = resourses.get('images/cure-bonus.png');
        }
        Bonus.call(this, center, 20, CureBonus.image);
    }

    CureBonus.size = 20;

    CureBonus.prototype = Object.create(Bonus.prototype);
    CureBonus.prototype.constructor = CureBonus;

    CureBonus.prototype.update = function() {
        var self = this;
        Bonus.prototype.update.apply(self, arguments);

        self.frameNumber++;

        if (self && self.hasIntersectionWith(window.player)) {
            window.player.addCure();
            // clearTimeout(self.timeout);
            self.disappear();
        }

        if (self.frameNumber >= self.maxFrameNumber) {
            self.disappear();
        }
    }

    function BulletBonus(center) {
        if (!BulletBonus.image) {
            BulletBonus.image = resourses.get('images/bullet-bonus.png');
        }
        Bonus.call(this, center, 20, BulletBonus.image);

        // console.log(Bullet BulletBonus); //Bonus.hasIntersectionWith
    }

    BulletBonus.size = 20;

    BulletBonus.prototype = Object.create(Bonus.prototype);
    BulletBonus.prototype.constructor = BulletBonus;

    BulletBonus.prototype.update = function() {
        var self = this;
        Bonus.prototype.update.apply(self, arguments);

        self.frameNumber++;

        if (self && self.hasIntersectionWith(window.player)) {
            window.player.addBullets(50);
            // clearTimeout(self.timeout);
            self.disappear();
        }

        if (self.frameNumber >= self.maxFrameNumber) {
            self.disappear();
        }
    }

    function BombBonus(center) {
        if (!BombBonus.image) {
            BombBonus.image = resourses.get('images/bomb-bonus.png');
        }
        Bonus.call(this, center, 20, BombBonus.image);

        // console.log(Bullet BulletBonus); //Bonus.hasIntersectionWith
    }

    BombBonus.size = 20;

    BombBonus.prototype = Object.create(Bonus.prototype);
    BombBonus.prototype.constructor = BombBonus;

    BombBonus.prototype.update = function() {
        var self = this;
        Bonus.prototype.update.apply(self, arguments);

        self.frameNumber++;

        if (self && self.hasIntersectionWith(window.player)) {
            window.player.addBomb();
            // clearTimeout(self.timeout);
            self.disappear();
        }

        if (self.frameNumber >= self.maxFrameNumber) {
            self.disappear();
        }
    }


    window.components = {
        Component: Component,
        Tree: Tree,
        Rock: Rock,
        Player: Player,
        Home: Home,
        Fly: Fly,
        Spider: Spider,
        Lair: Lair,
        Bullet: Bullet,
        Explosion: Explosion,
        BulletBonus: BulletBonus,
        CureBonus: CureBonus,
        BombBonus: BombBonus
    };
})();