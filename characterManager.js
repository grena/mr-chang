function CharacterManager (game) {
    this.game = game;
    this.characters = [];
    this.characterNames = ['man1', 'man2', 'man3', 'woman1', 'woman2', 'woman3'];

    this.maxCharacters = 12;     // To change with difficulty
    this.populateInterval = 4;  // In seconds
    this.latestPopulate = 0;
}

CharacterManager.prototype.populate = function () {
    var time = this.game.time.totalElapsedSeconds();

    var timeToPopulate = time > (this.latestPopulate + this.populateInterval);
    var hasFreeSlots = this.characters.length < this.maxCharacters;

    if (timeToPopulate && hasFreeSlots) {
        var name = _.sample(this.characterNames);
        this.addCharacter(name);
        this.sfxBell.play();

        this.latestPopulate = time;
        console.log('CharacterManager populating with: ', name);
    }
};

CharacterManager.prototype.addCharacter = function (name) {
    var sprite = spriteLoader.getSprite(name);
    var character = new Character(this.game, sprite);

    this.characters.push(character);
};

CharacterManager.prototype.stopCharacters = function () {
    _.each(this.characters, function (character) {
        character.wait(-1);
    }.bind(this));
};

CharacterManager.prototype.moveCharacters = function () {
    _.each(this.characters, function (character) {
        if (!character.isWalking() && !character.isWaiting()) {
            var pos = this.getRandomPosition(character);
            character.setDestination(pos);
        }

        if (character.isWalking()) {

            character.move();

            if (character.isArrived()) {
                if (character.isInKitchen()) {
                    console.log('KITCHEN');
                    character.wait(_.random(3, 20));
                } else if (character.isOutside()) {
                    console.log('REMOVING CHARAC');
                    this.latestPopulate = this.game.time.totalElapsedSeconds();
                    character.sprite.destroy();
                    this.characters = _.without(this.characters, character);
                    this.sfxBell.play();
                } else {
                    console.log('WAITING IN ', character.x);
                    character.wait(_.random(2, 8));
                }
            }
        }
    }.bind(this));
};

CharacterManager.prototype.getRandomPosition = function (character) {
    var kitchenProba = 10;  // In percent
    var outsideProba = 25; // In percent
    var kitchenX = -51;
    var outsideX = 681;

    if (_.random(1, 100) < kitchenProba && !character.isInKitchen()) {
        return kitchenX;
    }

    if (_.random(1, 100) < outsideProba && !character.isOutside()) {
        return outsideX;
    }

    return _.random(70, 600);
};

CharacterManager.prototype.drawCharacters = function () {
    _.each(this.characters, function (character) {
        character.render();
    });
};

CharacterManager.prototype.isSomeoneInKitchen = function () {
    return _.some(this.characters, function (character) {
        return character.isInKitchen();
    });
};

CharacterManager.prototype.clearAll = function () {
    this.characters = [];
};
