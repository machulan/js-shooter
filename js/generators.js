(function() {
    function BonusGenerator() {
        // components.BulletBonus(center)
        // components.CureBonus(center)
        this.bounds = renderer.getBounds();
        this.bulletBonusSize = components.BulletBonus.size;
        this.cureBonusSize = components.CureBonus.size;

        this.bulletBonusFrameProbability = BonusGenerator.bulletBonusProbability / window.framesPerSecond;
        this.cureBonusFrameProbability = BonusGenerator.cureBonusProbability / window.framesPerSecond;

        this.bulletBonusFrameProbabilityRange = Math.round(1 / this.bulletBonusFrameProbability);
        this.cureBonusFrameProbabilityRange = Math.round(1 / this.cureBonusFrameProbability);
    }

    BonusGenerator.bulletBonusProbability = 1 / 5; // per second
    BonusGenerator.cureBonusProbability = 1 / 5; // per second

    BonusGenerator.prototype.update = function() {
        var self = this;
        // 1 per 100
        if (randomIntInRange(0, self.bulletBonusFrameProbabilityRange) == 1) {
            var center = {
                x: randomIntInRange(self.bounds.left + self.bulletBonusSize, self.bounds.right - self.bulletBonusSize),
                y: randomIntInRange(self.bounds.top + self.bulletBonusSize, self.bounds.bottom - self.bulletBonusSize),
            };
            window.bonuses.push(new components.BulletBonus(center));
        }

        if (randomIntInRange(0, self.cureBonusFrameProbabilityRange) == 1) {
            var center = {
                x: randomIntInRange(self.bounds.left + self.cureBonusSize, self.bounds.right - self.cureBonusSize),
                y: randomIntInRange(self.bounds.top + self.cureBonusSize, self.bounds.bottom - self.cureBonusSize),
            };
            window.bonuses.push(new components.CureBonus(center));
        }
    }

    function FlyGenerator() {
        this.bounds = renderer.getBounds();

        this.minFlyRadius = 5;
        this.maxFlyRadius = 20;

        this.flyHatchingFrameProbability = FlyGenerator.flyHatchingProbability / window.framesPerSecond;
        this.flyHatchingFrameProbabilityRange = Math.round(1 / this.flyHatchingFrameProbability);
    }

    FlyGenerator.flyHatchingProbability = 1 / 3;

    FlyGenerator.prototype.update = function() {
        var self = this;
        // 1 per 100
        if (randomIntInRange(0, self.flyHatchingFrameProbabilityRange) == 1) {
            var radius = randomIntInRange(self.minFlyRadius, self.maxFlyRadius);
            var center = {
                x: randomIntInRange(self.bounds.left + radius, self.bounds.right - radius),
                y: randomIntInRange(self.bounds.top + radius, self.bounds.bottom - radius),
            };
            window.flies.push(new components.Fly(center, radius));
        }
    }

    function RockCreator() {
        this.bounds = renderer.getBounds();

        this.minRockRadius = 20;
        this.maxRockRadius = 40;
    }

    RockCreator.prototype.create = function() {
        var self = this;
        var radius = randomIntInRange(self.minRockRadius, self.maxRockRadius);
        var center = {
            x: randomIntInRange(self.bounds.left + radius, self.bounds.right - radius),
            y: randomIntInRange(self.bounds.top + radius, self.bounds.bottom - radius),
        };
        return new components.Rock(center, radius);
    }

    window.generators = {
        BonusGenerator: BonusGenerator,
        FlyGenerator: FlyGenerator,
        RockCreator: RockCreator
    };
})();