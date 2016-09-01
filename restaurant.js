function RestaurantManager (game) {
    this.game = game;
    this.fireSprites = [];
    this.playerSprite = null;
}

RestaurantManager.prototype.turnOnFire = function () {
    var fire1 = spriteLoader.getSprite('fire1');
    fire1.x = 96;
    fire1.y = 70;
    fire1.alpha = 1;
    fire1.animations.play('burn', 6, true);

    var fire2 = spriteLoader.getSprite('fire2');
    fire2.x = 162;
    fire2.y = 70;
    fire2.alpha = 1;
    fire2.animations.play('burn', 6, true);

    this.fireSprites.push(fire1, fire2);
};

RestaurantManager.prototype.turnOffFire = function () {
    _.each(this.fireSprites, function (fire) {
        fire.destroy();
    });
};

RestaurantManager.prototype.setupPlayer = function () {
    var player = spriteLoader.getSprite('player');
    player.x = 320;
    player.y = 70;
    player.alpha = 1;
    player.animations.play('wait', 1, true);

    this.playerSprite = player;
};
