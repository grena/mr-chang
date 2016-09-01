function Character (game, sprite) {
    this.game = game;
    this.sprite = sprite;

    this.createdAt = this.game.time.totalElapsedSeconds();

    this.x = 0;
    this.y = 0;
    this.destinationX = null;
    //this.speed = 1;
    this.speed = _.random(1, 3);

    this.waitingUntilTime = 0;

    this.resetPosition();
}

Character.prototype.resetPosition = function () {
    var restaurant = spriteLoader.getSprite('restaurant');
    this.sprite.anchor.x = 0.5;
    this.sprite.alignTo(restaurant, Phaser.RIGHT_BOTTOM, 0, -10);

    this.x = this.sprite.x;
    this.y = this.sprite.y;
    this.x = 680;

    this.sprite.alpha = 1;
};

Character.prototype.move = function () {
    if (this.destinationX > this.x) {
        this.x += (this.speed + this.x) > this.destinationX ? 1 : this.speed;
    } else {
        this.x -= (this.speed - this.x) > this.destinationX ? 1 : this.speed;
    }
};

Character.prototype.setDestination = function (x) {
    if (x == this.x) {
        return;
    }

    this.waitingUntilTime = 0;
    this.destinationX = x;
    this.animate();
};

Character.prototype.animate = function () {
    if (this.destinationX === null) {
        this.sprite.animations.play('wait', 1, true);
    } else if (this.destinationX > this.x) {
        // walk right
        if (this.sprite.scale.x < 0) {
            this.sprite.scale.x *= -1;
        }
        this.sprite.animations.play('walk', 4, true);
    } else if (this.destinationX < this.x) {
        // walk left
        if (this.sprite.scale.x > 0) {
            this.sprite.scale.x *= -1;
        }
        this.sprite.animations.play('walk', 4, true);
    }
};

Character.prototype.render = function () {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
};

Character.prototype.isWalking = function () {
    return this.destinationX !== null;
};

Character.prototype.isWaiting = function () {
    return this.waitingUntilTime > this.game.time.totalElapsedSeconds();
};

Character.prototype.isInKitchen = function () {
    return this.x < -50;
};

Character.prototype.isOutside = function () {
    return this.x > 670;
};

Character.prototype.wait = function (seconds) {
    this.setDestination(null);
    this.waitingUntilTime = this.game.time.totalElapsedSeconds() + seconds;
};

Character.prototype.isArrived = function () {
    return this.x == this.destinationX;
};
