(function() {
    testLevelMap = [
        'rock 1000 100 50',
        'rock 1000 180 40',
        'rock 1000 240 30',
        'tree 300 400 50',
        'tree 300 500 40',
        'tree 300 600 30',
        'tree 400 500 20',
        'fly 1000 300 15',
        'spider 700 200 30',
        'spider 700 500 100',
        'player 100 100 40'
    ];

    // components.Rock({ x: 1000, y: 100 }, 30),
    //     components.Fly({ x: 1000, y: 300 }, 15),
    //     components.Spider({ x: 700, y: 200 }, 30)

    simpleLevelMap = [
        // 'rock 650 330 30', // center rock

        // центральное кольцо
        'rock 510 420 30',
        'rock 500 350 30',
        'rock 530 280 30',
        'rock 600 260 27',
        'rock 670 280 30',

        'tree 720 320 25',
        'tree 740 370 30',

        'rock 730 430 30',
        'rock 700 480 30',

        'tree 645 485 30',
        'tree 600 470 20',
        'tree 560 450 25',

        // верхняя гряда
        'rock 400 29 40',
        'rock 460 65 35',
        'rock 500 110 25',
        'rock 550 120 30',
        'rock 600 110 25',
        'rock 650 110 25',
        'rock 700 110 30',
        'rock 770 120 35',

        // гряда справа от центрального кольца
        'rock 910 300 25',
        'rock 970 320 40',
        'rock 970 385 30',
        'rock 985 265 25',
        'rock 940 265 25',
        'rock 1050 360 45',
        'rock 1100 410 20',

        // левая верхняя гряда
        'rock 50 200 40',
        'rock 90 250 20',
        'rock 135 240 25',
        'rock 100 410 30',
        'rock 150 380 30',
        'rock 135 475 30',
        'rock 130 520 20',

        // левый лес
        'tree 30 420 30',
        'tree 100 520 30',
        'tree 120 450 30',
        'tree 170 430 25',
        'tree 165 500 30',
        'tree 210 370 30',
        'tree 205 295 30',
        'tree 150 325 20',
        'tree 120 290 25',
        'tree 95 350 35',
        'tree 180 200 30',
        'tree 250 330 25',
        'tree 305 250 40',
        'tree 230 225 25',
        'tree 270 170 35',
        'tree 190 245 20',
        'tree 185 130 25',
        'tree 245 90 30',
        'tree 295 45 25',
        'tree 240 35 20',
        'tree 175 45 45',

        // нижняя левая гряда
        'rock 340 630 30',
        'rock 410 640 40',
        'rock 355 565 25',
        'rock 505 645 30',
        'rock 150 380 30',
        'rock 340 510 20',
        'rock 310 470 30',
        'rock 550 605 25',
        'rock 580 660 40',

        // нижний лес
        'tree 430 450 25',
        'tree 390 510 40',
        'tree 455 400 30',
        'tree 375 425 35',
        'tree 485 470 30',
        'tree 430 450 25',
        'tree 510 545 30',
        'tree 450 520 25',
        'tree 400 580 30',
        'tree 545 495 20',
        'tree 675 555 30',
        'tree 610 540 35',
        'tree 640 615 40',

        // лес вокруг кольца
        'tree 470 300 25',
        'tree 505 250 15',
        'tree 555 240 25',
        'tree 640 225 35',
        'tree 710 250 25',
        'tree 715 200 30',
        'tree 770 260 35',
        'tree 770 320 20',
        'tree 840 295 45',
        'tree 660 165 25',

        // верхний лес
        'tree 560 25 25',
        'tree 575 70 20',
        'tree 630 50 40',
        'tree 705 20 25',
        'tree 740 70 30',
        'tree 750 10 20',
        'tree 835 85 25',
        'tree 845 140 30',
        'tree 810 30 35',

        // верхняя правая гряда
        'rock 1110 55 30',
        'rock 1085 15 20',
        'rock 1160 20 25',
        'rock 1165 80 35',
        'rock 1320 205 35',
        'rock 1285 270 40',
        'rock 1340 330 45',
        'rock 1345 270 20',
        'rock 1325 415 40',
        'rock 1340 480 30',
        'rock 1225 250 25',
        'rock 1110 115 25',
        'rock 1020 30 30',

        // нижняя правая гряда
        'rock 865 645 45',
        'rock 935 595 35',
        'rock 1005 580 25',

        // нижний правый лес
        'tree 950 640 35',
        'tree 1020 630 25',
        'tree 1060 565 40',
        'tree 1015 495 35',
        'tree 1020 420 30',
        'tree 975 450 25',
        'tree 965 535 30',
        'tree 1065 470 20',
        'tree 1135 445 35',
        'tree 1130 515 30',
        'tree 1170 595 45',

        // правый верхний лес
        'tree 1050 270 30',
        'tree 1060 190 40',



        // 'tree 300 400 50',
        // 'fly 1000 300 15',

        // паучьи норы
        'lair 70 70 60',
        'lair 60 600 50',
        'lair 1300 70 50',
        // пауки 
        'spider 50 50 25',
        'spider 50 620 30',
        // 'spider 200 200 30',
        // 'spider 200 400 60',
        // 'spider 200 600 35',
        // 'spider 300 100 30',
        // 'spider 400 550 60',
        // 'spider 450 150 40',
        // 'spider 550 600 50',
        // 'spider 650 600 25',
        // 'spider 700 100 30',
        // 'spider 720 600 25',
        // 'spider 900 500 40',
        // 'spider 900 200 50',
        // 'spider 1000 400 70',
        // 'spider 1200 100 30',
        // 'spider 1300 600 60',

        // 'player 625 380 40'
        'player 625 380 35'
    ];

    function Level(levelMap) {
        var self = this;
        self.levelMap = [];

        levelMap.forEach(function(levelMapItem) {
            var parts = levelMapItem.split(' ');
            var component = parts[0]
            if (component == 'rock' || component == 'tree' || component == 'spider' ||
                component == 'lair' || component == 'fly' || component == 'player') {
                self.levelMap.push({
                    type: component,
                    center: { x: +parts[1], y: +parts[2] },
                    radius: +parts[3]
                });
            }
        });
    }

    Level.prototype.construct = function() {
        var self = this;
        self.levelMap.forEach(function(item) {
            switch (item.type) {
                case 'rock':
                    window.rocks.push(new components.Rock(item.center, item.radius));
                    break;
                case 'tree':
                    window.trees.push(new components.Tree(item.center, item.radius));
                    break;
                case 'spider':
                    window.spiders.push(new components.Spider(item.center, item.radius));
                    break;
                case 'lair':
                    window.lairs.push(new components.Lair(item.center, item.radius));
                    break;
                case 'fly':
                    window.flies.push(new components.Fly(item.center, item.radius));
                    break;
                case 'player':
                    window.player = new components.Player(item.center, item.radius);
                    break;
                default:
                    throw new Error('Unknown levelMap item type ' + item.type);
            }
        });
    }


    window.levels = {
        testLevelMap: testLevelMap,
        simpleLevelMap: simpleLevelMap,
        Level: Level
    };
})();