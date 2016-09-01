function SpriteLoader (game) {
    this.game = game;
    this.sprites = [];
}

SpriteLoader.prototype.loadTextureAtlases = function () {
    this.game.load.atlas('restaurant', 'assets/gfx/restaurant.png', 'assets/gfx/restaurant.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('characters', 'assets/gfx/characters.png', 'assets/gfx/characters.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('button_yes', 'assets/gfx/button_yes.png', 'assets/gfx/button_yes.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('button_no', 'assets/gfx/button_no.png', 'assets/gfx/button_no.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('food', 'assets/gfx/food.png', 'assets/gfx/food.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
};

SpriteLoader.prototype.getSprite = function (name) {
    var spritesJson =  this.game.cache.getJSON('sprites');
    var spriteJson = _.findWhere(spritesJson, {name: name});

    var sprite = this.game.add.sprite(0, 0, spriteJson.sheet, spriteJson.mainFrame);
    sprite.alpha = 0;
    sprite.scale.setTo(spriteJson.scale, spriteJson.scale);

    _.each(spriteJson.animations, function (animation) {
        sprite.animations.add(animation.name, animation.frames);
    });

    return sprite;
};
