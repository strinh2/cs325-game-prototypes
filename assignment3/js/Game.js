"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var player;
    var background;
    var footprints;
    var footTimer = 0;

    var spotLights;
    var nextLightAt;
    var lightDelay = 0;
    var lightLifeTime;

    var sugarLevel;
    var sugarText;
    var scoreText;
    var scoreString;
    var score = 0;

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

            //background = game.add.tileSprite(0, 0, 800, 800, 'background');

            //Start the Arcade Physics systems
            game.physics.startSystem(Phaser.Physics.ARCADE);
 
            //Change the background colour
            game.stage.backgroundColor = "#a9f0ff";
 
            //Add the tilemap and tileset image. The first parameter in addTilesetImage
            //is the name you gave the tilesheet when importing it into Tiled, the second
            //is the key to the asset in Phaser
            this.map = game.add.tilemap('tilemap');
            this.map.addTilesetImage('walls', 'tiles');
 
            //Add both the background and ground layers. We won't be doing anything with the
            //GroundLayer though
            this.backgroundLayer = this.map.createLayer('BackgroundLayer');
            this.groundLayer = this.map.createLayer('GroundLayer');
 
            //Before you can use the collide function you need to set what tiles can collide
            //this.map.setCollisionBetween(0, 505, true, 'GroundLayer');
 
            //Change the world size to match the size of this layer
            //this.groundLayer.resizeWorld();
 
       

            //Add the user into the game at one of the spawnpoints
            var rand = game.rnd.integerInRange(0, 6);
            var locationX;
            var locationY;
            //Spawn points are located at the corners and center of the map.
            if (rand == 1) {
                locationX = 50;  //spawn in left corner
                locationY = 50;
            }
            else if (rand == 2) {
                locationX = 750;//spawn in right corner
                locationY = 50;
            }
            else if (rand == 3) {
                locationX = 50;//spawn in bottom left corner
                locationY = 750;
            }
            else if (rand == 4) {
                locationX = 750;//spawn in bottom right corner
                locationY = 750;
            }
            else{     
                locationX = game.world.CenterX; //Spawn in the middle if 5 is returned.
                locationY = game.world.centerY;
            }
            player = game.add.sprite(locationX, locationY, 'player');            
            player.anchor.setTo( 0.5, 0.5 );            
            game.physics.enable( player, Phaser.Physics.ARCADE );
            player.body.collideWorldBounds = true;
            player.alive = true;
            player.setHealth(20);
           
            //footprints
            footprints = game.add.group();
            footprints.createMultiple(25, 'footprints');
            footprints.forEach(function (unit) {
                unit.anchor.x = 0.5;
                unit.anchor.y = 0.5;
                unit.animations.add('footprints');
            }, this);
            footTimer = 500;

            //The enemy spotlights
            spotLights = game.add.group();
            spotLights.enableBody = true;
            spotLights.physicsBodyType = Phaser.Physics.ARCADE;
            spotLights.createMultiple(50, 'light');
            spotLights.setAll('anchor.x', 0.5);
            spotLights.setAll('anchor.y', 0.5);
            spotLights.setAll('checkWorldBounds', true);
            nextLightAt = 0;                       
            lightDelay = game.rnd.integerInRange(0, 11000);
            lightLifeTime = 10000;


            //sugarboard
            sugarLevel = 'Sugar Level: ';        
            sugarText = game.add.text(10, 10, sugarLevel + player.health, { font: '24px Arial', fill: '#00ffff' });
            sugarText.visible = true;
            sugarText.alpha = 0.5;

            //Scoreboard   
            scoreString = 'Score: ';
            scoreText = game.add.text(600, 25, scoreString + score, { font: '24px Arial', fill: '#fff' });
            scoreText.anchor.setTo(0.5, 0.5);
            scoreText.visible = true;
            scoreText.alpha = 0.5;
            
            
        },        
        
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

            //Reset player velocity
            player.body.velocity.setTo(0, 0);            
                
            //Move towards the mouse when clicked
            if (game.input.mousePointer.isDown) {
                var playerAngle = this.game.math.angleBetween(player.x, player.y, this.game.input.activePointer.x, this.game.input.activePointer.y);
                player.rotation = playerAngle;
                game.physics.arcade.moveToPointer(player, 400);

                //Create a footstep
                if (game.time.now > footTimer) {
                    var footprint = footprints.getFirstExists(false);
                    //var printOffSet = 5 * Math.sin(game.math.degToRad(player.angle));
                    footprint.reset(player.x, player.y);
                    footprint.rotation = player.rotation;
                    footprint.play('footprints', 1, false, true);
                    footTimer = game.time.now + 500;
                } 
            }            
            //Stop once reached cursor
            if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y)) {
                player.body.velocity.setTo(0, 0);
            }
        },
        spawnLights: function () {   //Spawn the enemy spotlights
            var rand = game.rnd.integerInRange(0, 6);
            var locationX;
            var locationY;
        }
    };
};
