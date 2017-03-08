var game = new Phaser.Game(640, 400, Phaser.AUTO, 'Mr. Chang', { preload: preload, create: create, update: update, render: render }, false, false);
var spriteLoader = new SpriteLoader(game);
var restaurantManager = new RestaurantManager(game);
var characterManager = new CharacterManager(game);
var eventManager = new EventManager(game);

var restaurant;

//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ['Press Start 2P']
    }
};

var TEXT_CHANG_WELCOME = 'Vous etre bienvenu chez Monsieur Chang ! Moi apporter vous nourriture, vous installer tranquillement !';
var TEXT_CHANG_OPEN = 'Moi voir vous bien assis. Moi ouvrir restaurant pour que gens rentrent ! Hehe..';
var TEXT_SYSTEM_INTRO = "Monsieur Chang est connu pour ses plats... etranges. Une fois servi, ne MANGEZ SURTOUT PAS le plat si quelqu'un n'est jamais sorti de LA CUISINE !!!";

var GAME_TIMER = null;
var GAME_STARTED = false;
var musicPlay;
var musicEat;

function preload() {
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    game.load.script('underscore', '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js');

    game.load.script('filterX', 'BlurX.js');
    game.load.script('filterY', 'BlurY.js');

    game.load.json('sprites', 'assets/sprites.json');
    spriteLoader.loadTextureAtlases();

    game.load.bitmapFont('gem', 'assets/fonts/gem.png', 'assets/fonts/gem.xml');

    game.load.audio('music-play', ['assets/sfx/music-play.mp3']);
    game.load.audio('music-eat', ['assets/sfx/music-eat.mp3']);
    game.load.audio('music-loose', ['assets/sfx/music-loose.mp3']);
    game.load.audio('music-win', ['assets/sfx/music-win.mp3']);
    game.load.audio('tick', ['assets/sfx/metal-small2.wav']);
    game.load.audio('bell', ['assets/sfx/bell.mp3']);
    game.load.audio('temple-bell', ['assets/sfx/temple-bell.mp3']);
    game.load.audio('drink', ['assets/sfx/bottle.wav']);

    game.load.image('chang', 'assets/gfx/chang.png');
    game.load.image('burger', 'assets/gfx/burger.png');
    game.load.image('explosion', 'assets/gfx/explosion.png');
}

function create() {
    // Load music
    musicPlay = game.add.audio('music-play', 0.5);
    musicPlay.play();

    characterManager.sfxBell = game.add.audio('bell', 0.2);

    // Load restaurant
    restaurant = spriteLoader.getSprite('restaurant');

    // TO REMOVE
    //restaurant.alpha = 1;
    //restaurantManager.turnOnFire();
    //restaurantManager.setupPlayer();
    //startGame();
    // -TO REMOVE

    // Load intro
    game.add.tween(restaurant).to({ alpha: 1 }, 5000, 'Linear', true).onComplete.add(function () {

        // Mr Chang intro
        changTalk(TEXT_CHANG_WELCOME, 10000).onComplete.add(function () {
            systemTalk(TEXT_SYSTEM_INTRO, 10000).onComplete.add(function () {
                systemTalk("<== CUISINE                   ENTREE ==>", 5000).onComplete.add(function () {
                    restaurantManager.turnOnFire();
                    restaurantManager.setupPlayer();

                    changTalk(TEXT_CHANG_OPEN, 8000).onComplete.add(function () {
                        startGame();
                    });
                });
            });
        });
    });
}

function update() {
    if (!GAME_STARTED) {
        return;
    }

    characterManager.populate();
    characterManager.moveCharacters();

    eventManager.updateEvent();
}

function render() {
    characterManager.drawCharacters();
    //game.debug.pointer( game.input.activePointer );
}

function startGame() {
    GAME_TIMER = game.time.create(false);
    var gameDuration = 160000; // 160 000

    // Delete all characters
    characterManager.clearAll();

    // Create a timer to lock just before the end (18 seconds before)
    var lockEventTimer = game.time.create(false);
    lockEventTimer.add(gameDuration - 18000, function () {
        eventManager.lock();
    }, this);

    lockEventTimer.start();

    // Create a timer for game duration
    var timer = game.time.create(false);
    timer.add(gameDuration, function () {
        GAME_STARTED = false;
        eventManager.eatFood();
    }, this);

    timer.start();
    GAME_STARTED = true;
}

function systemTalk(text, duration) {
    // Display text
    var strText = game.add.text(30, 270, text, { font: '14px Press Start 2P', fill: '#cecece', align: 'left', wordWrap: true, wordWrapWidth: 600 });

    // Create a timer for talk duration
    var timer = game.time.create(false);
    timer.add(duration, function () {
        strText.destroy();
    }, this);

    timer.start();

    return timer;
}

function changTalk(text, duration) {
    var chang = game.add.image(-300, 160, 'chang');
    var strText;

    // Display chang and his text
    game.add.tween(chang)
        .to({ x: 0 }, 400, 'Linear', true)
        .onComplete
        .add(function () {
            strText = game.add.text(265, 270, text, { font: '14px Press Start 2P', fill: '#ffffff', align: 'left', wordWrap: true, wordWrapWidth: 370 });
        });

    // Create a timer for talk duration
    var timer = game.time.create(false);
    timer.add(duration, function () {
        strText.destroy();
        game.add.tween(chang)
            .to({ x: -300 }, 400, 'Linear', true)
            .onComplete
            .add(function () {
                chang.destroy();
            });
    }, this);

    timer.start();

    return timer;
}
