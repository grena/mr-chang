function EventSake (game) {
    this.game = game;
    this.isStarted = false;

    this.startedAt = -1;

    this.blurXfilter = game.add.filter('BlurX');
    this.blurYfilter = game.add.filter('BlurY');

    this.duration = 0;

    // Initial blur level
    this.blurXfilter.blur = 100;
    this.blurYfilter.blur = 1;
}

EventSake.prototype.start = function () {
    this.duration = _.random(9, 15);

    changTalk("Moi donner vous verre de SAKE pour patienter!", 5000).onComplete.add(function () {
        var drinkAudio = game.add.audio('drink', 0.7);
        drinkAudio.play();

        this.blurSprite(restaurant);
        _.each(characterManager.characters, function (character) {
            this.blurSprite(character.sprite);
        }.bind(this));
        _.each(restaurantManager.fireSprites, function (sprite) {
            this.blurSprite(sprite);
        }.bind(this));

        this.isStarted = true;
        this.startedAt = this.game.time.totalElapsedSeconds();
    }.bind(this));
};

EventSake.prototype.update = function () {
    if (!this.isStarted) {
        return;
    }

    // See if event ended
    if (this.game.time.totalElapsedSeconds() >= (this.duration + this.startedAt)) {
        return this.stop();
    }

    // Continue to blur potential new clients in restaurant
    _.each(characterManager.characters, function (character) {
        if (_.isEmpty(character.sprite.filters)) {
            this.blurSprite(character.sprite);
        }
    }.bind(this));

    // Randomize blur effect
    this.blurXfilter.blur = _.random(1, 800);
    this.blurYfilter.blur = _.random(1, 800);
};

EventSake.prototype.stop = function () {
    console.log('STOPING SAKE');

    // Unblur sprites
    this.unblurSprite(restaurant);
    _.each(characterManager.characters, function (character) {
        this.unblurSprite(character.sprite);
    }.bind(this));
    _.each(restaurantManager.fireSprites, function (sprite) {
        this.unblurSprite(sprite);
    }.bind(this));

    this.isStarted = false;
};

EventSake.prototype.blurSprite = function (sprite) {
    sprite.filters = [this.blurXfilter, this.blurYfilter];
};

EventSake.prototype.unblurSprite = function (sprite) {
    sprite.filters = null;
};
