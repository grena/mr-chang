function EventManager (game) {
    this.game = game;

    this.currentEvent = null;
    this.triggerInterval = 13;      // In seconds, minimum interval between 2 events
    this.percentTrigger = 10;      // Every second, how many percent to start a new event
    this.nextTriggerTick = 0;
    this.isLocked = false;         // When locked, no event can start

    this.yesBtn = null;
    this.noBtn = null;
    this.foodSprite = null;

    this.eatTimer = null;
    this.eatCountdown = 10;
    this.eatCountdownText = null;
    this.eatCountdownMusic = null;
    this.sfxCounddown = null;
    this.sfxTempleBell = null;

    this.musicLoose = null;
    this.musicWin = null;
}

EventManager.prototype.updateEvent = function () {
    if (this.nextTriggerTick === 0) {
        this.nextTriggerTick = this.game.time.totalElapsedSeconds() + _.random(18, 25);
    }

    if (this.currentEvent && this.currentEvent.isStarted) {
        this.currentEvent.update();
    } else {
        this.tryNewEvent();
    }
};

EventManager.prototype.tryNewEvent = function () {
    if (this.isLocked) {
        return;
    }

    var currentTime = this.game.time.totalElapsedSeconds();

    if (currentTime > this.nextTriggerTick) {
        console.log('TICK SAKE');
        if (_.random(1, 100) <= this.percentTrigger) {
            this.triggerSake();
            //this.lastTriggeredTime = currentTime;
            this.nextTriggerTick = currentTime + this.currentEvent.duration + this.triggerInterval;
            console.log('next = ', this.nextTriggerTick);
        } else {
            this.nextTriggerTick++;
        }
    }
};

EventManager.prototype.triggerSake = function () {
    this.currentEvent = new EventSake(this.game);
    this.currentEvent.start();
};

EventManager.prototype.eatFood = function () {
    var updateCounter = function () {
        this.eatCountdown--;
        this.eatCountdownText.setText(this.eatCountdown);

        if (this.eatCountdown === 0) {
            this.sfxTempleBell.play();
            this.eatTimer.stop();
            this.showResult({defeat: true, timer: true});
        } else {
            this.sfxCounddown.play();
        }
    }.bind(this);

    var choseToEat = function (eat) {
        this.eatTimer.stop();
        this.sfxTempleBell.play();

        var peopleInKitchen = characterManager.isSomeoneInKitchen();

        if (eat && peopleInKitchen || !eat && !peopleInKitchen) {
            this.showResult({defeat: true});
        } else {
            this.showResult({victory: true});
        }
    }.bind(this);

    if (this.currentEvent) {
        this.currentEvent.stop();
    }

    this.eatCountdownMusic = game.add.audio('music-eat', 0.5);
    this.musicLoose = game.add.audio('music-loose', 0.3);
    this.musicWin = game.add.audio('music-win', 0.1);
    this.sfxTempleBell = game.add.audio('temple-bell', 0.5);
    this.sfxCounddown = game.add.audio('tick', 0.5);

    characterManager.stopCharacters();
    musicPlay.stop();

    this.eatCountdownMusic.play();

    changTalk("Moi avoir prepare vous MEILLEUR plat de Monsieur Chang, vous gouter !", 4000).onComplete.add(function () {
        this.foodSprite = spriteLoader.getSprite('food_' + _.random(1, 9));
        this.foodSprite.x = 320;
        this.foodSprite.y = 315;
        this.foodSprite.anchor.x = 0.5;
        this.foodSprite.anchor.y = 0.5;
        this.foodSprite.alpha = 1;

        this.yesBtn = this.game.add.button(50, 300, 'button_yes', function () { choseToEat(true); }, this, 'over.png', 'out.png', 'over.png');
        this.noBtn = this.game.add.button(430, 300, 'button_no', function () { choseToEat(false); }, this, 'over.png', 'out.png', 'over.png');

        //  Create our Timer
        this.eatTimer = game.time.create(false);
        this.eatTimer.loop(1000, updateCounter, this);
        this.eatTimer.start();

        this.sfxCounddown.play();

        this.eatCountdownText = game.add.text(320, 80, this.eatCountdown, { font: '120px Press Start 2P', fill: '#ffea00', align: 'center' });
        this.eatCountdownText.anchor.x = 0.5;
    }.bind(this));
};

EventManager.prototype.lock = function () {
    this.isLocked = true;
};

EventManager.prototype.showResult = function (options) {
    this.eatCountdownMusic.fadeOut(3000);
    this.game.add.tween(this.eatCountdownText).to({ alpha: 0 }, 3000, 'Linear', true);
    this.foodSprite.destroy();
    this.yesBtn.destroy();
    this.noBtn.destroy();

    if (options.defeat) {
        this.musicLoose.fadeIn(3000);
    }

    if (options.victory) {
        this.musicWin.fadeIn(3000);
    }

    var peopleInKitchen = characterManager.isSomeoneInKitchen();
    var changTalked = null;

    if (options.defeat && options.timer) {
        // Timer defeat
        changTalked = changTalk("VOUS MEME PAS MANGER PLAT CHANG !!! VOUS SORTIR !!", 10000);
    }

    if (options.defeat && !options.timer && peopleInKitchen) {
        // Eat humans!
        changTalked = changTalk("MOI VOIR VOUS AIMER VIANDE HUMAINE ! VOUS CANNIBALE !!! MOUAHAHAH !", 10000);
    }

    if (options.defeat && !options.timer && !peopleInKitchen) {
        // Good food but not ate :(
        changTalked = changTalk("VOUS AVOIR PAS MANGE MON MEILLEUR PLAT !! VOUS SORTIR !!", 10000);
    }

    if (options.victory && peopleInKitchen) {
        // No eat human!
        changTalked = changTalk("OUPS. Moi pas avoir vu moi mettre vous viande humain, vous pas dire police ?!", 10000);
    }

    if (options.victory && !peopleInKitchen) {
        // Eat good food!
        changTalked = changTalk("Moi heureux de voir vous bon appetit ! Vous revenir chez Monsieur Chang ?!", 10000);
    }

    if (options.victory) {
        changTalked.onComplete.add(function () {
            systemTalk("Vous avez gagne !!!", 10000)
        });
    }

    if (options.defeat) {
        changTalked.onComplete.add(function () {
            systemTalk("Vous avez perdu...", 10000)
        });
    }
};
