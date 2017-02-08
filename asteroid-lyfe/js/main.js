window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 1200, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image('cowboy', 'assets/space_cowboy_small.jpg');
        game.load.image('background', 'assets/space_small.jpg');
        game.load.image('bullet', 'assets/laser.png');
        game.load.image('player', 'assets/asteroid_small.png');
    }
    
    var cowboy;
    var background;
    var bullets;
    var bulletTime = 0;
    var player;
    var playerScore = 0;
    var score = "";
    var scoreText;
    var outputText;
    var cursors;
    
    function create() {  
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  The scrolling background
        background = game.add.tileSprite(0, 0, 1200, 800, 'background');
        
        
        
        // The enemy's bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        //The hero!
        player = game.add.sprite(400, 500, 'player');
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);

        //The enemy space cowboy
        cowboy = game.add.group();
        cowboy.enableBody = true;
        cowboy.physicsBodyType = Phaser.Physics.ARCADE;
        createcowboy();

        //Scoreboard
        score = 'Score: ';
        scoreText = game.add.text(10, 10, score + playerScore, { font: '34px Arial', fill: '#fff' });

        stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '84px Arial', fill: '#fff' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;

        //  And some controls to play the game with
        //cursors = game.input.keyboard.createCursorKeys();

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        text.anchor.setTo( 0.5, 0.0 );
    }

    function createcowboy(){
        // Create a sprite at the center of the screen using the 'cowboy' image.
        cowboy = game.add.sprite(game.world.centerX, game.world.centerY, 'cowboy');
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        cowboy.anchor.setTo(0.5, 0.5);
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable(cowboy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        cowboy.body.collideWorldBounds = true;

    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        cowboy.rotation = game.physics.arcade.accelerateToObject(cowboy, player, 300, 300, 300);
        
        // Make sure there is always at least one space cowboy present.
        /**if (cowboy.countLiving() < 1) {
            // Set the launch point to a random location below the bottom edge
            // of the stage
            this.launchMissile(this.game.rnd.integerInRange(50, this.game.width-50),
                this.game.height + 50);
        }
        **/

        if (player.alive) {
            //  Scroll the background
            background.tilePosition.x += -0.5;

            //  Reset the player, then check for movement keys
            //player.body.velocity.setTo(0, 0);

            if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                player.body.velocity.x = -150;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                player.body.velocity.x = 150;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            player.body.velocity.y = -150;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                player.body.velocity.y = 150;
            }
             
            // if (game.time.now > firingTimer) {
            //enemyFires();
            //}

            //  Run collision
            //game.physics.arcade.overlap(bullets, player, enemyHitsPlayer, null, this);
        }
       
    }

    
};
