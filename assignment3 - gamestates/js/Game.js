"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var player;
    var background;
    var footprints;
    var footTimer = 0;
    var map;
    var groundLayer;
    var backgroundLayer;

    var spotLights;
    var nextLightAt = 0;
    var lightDelay = 0;
    var counter;
    var lightLifeTimer;
    var livingSpotLights = [];

    var chocoPuffs;

    var sugarLevel;
    var maxSugarLevel;
    var sugarText;
    var sugarTimer;
    var scoreText;
    var scoreString;
    var score = 0;
    var gameText;

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
            game.stage.backgroundColor = "#010160";
 
            //Add the tilemap and tileset image. The first parameter in addTilesetImage
            //is the name you gave the tilesheet when importing it into Tiled, the second
            //is the key to the asset in Phaser
            map = game.add.tilemap('tilemap');
            map.addTilesetImage('walls', 'tiles');


 
            //Add both the background and ground layers. We won't be doing anything with the
            //GroundLayer though
             backgroundLayer = map.createLayer('BackgroundLayer');
             groundLayer = map.createLayer('GroundLayer');
 
            //Before you can use the collide function you need to set what tiles can collide
            map.setCollisionBetween(0, 707, true, 'GroundLayer');
 
            //Change the world size to match the size of this layer
            groundLayer.resizeWorld();
 
       

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
                locationX = 350; //Spawn in the middle if 5 is returned.
                locationY = 400;
            }

            player = game.add.sprite(locationX, locationY, 'player');
            player.enableBody = true;
            player.anchor.setTo( 0.5, 0.5 );            
            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.body.collideWorldBounds = true;
            player.alive = true;
            player.setHealth(35);
           
            //footprints
            footprints = game.add.group();
            footprints.enableBody = true;
            game.physics.enable(footprints, Phaser.Physics.ARCADE);
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
            spotLights.setAll('outOfBoundsKill', true);
            nextLightAt = 1000;                       
            lightDelay = 10000;
            counter = 3000;
            lightLifeTimer = 1000;

            //The collectable kokoa puffs~
            //The enemy spotlights
            chocoPuffs = game.add.group();
            chocoPuffs.enableBody = true;
            chocoPuffs.physicsBodyType = Phaser.Physics.ARCADE;
            chocoPuffs.createMultiple(50, 'chocopuff');
            chocoPuffs.setAll('anchor.x', 0.5);
            chocoPuffs.setAll('anchor.y', 0.5);
            chocoPuffs.setAll('checkWorldBounds', true);
            chocoPuffs.setAll('outOfBoundsKill', true);
            //nextLightAt = 1000;
            //lightDelay = 10000;
            //counter = 10000;
            //lightLifeTimer = 1000;

            //sugarboard
            sugarLevel = 'Sugar Level: ';        
            sugarText = game.add.text(10, 10, sugarLevel + player.health, { font: '24px Arial', fill: '#00ffff' });
            sugarText.visible = true;
            sugarText.alpha = 0.5;
            sugarTimer = 2000;

            gameText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '80px Arial', fill: '#fff' });
            gameText.anchor.setTo(0.5, 0.5);
            gameText.visible = false;

            //Scoreboard   
            scoreString = 'Score: ';
            scoreText = game.add.text(600, 25, scoreString + score, { font: '24px Arial', fill: '#fff' });
            scoreText.anchor.setTo(0.5, 0.5);
            scoreText.visible = true;
            scoreText.alpha = 0.5;            
            
        },        
        spawnLights: function () {   //Spawn the enemy spotlights
          /**  var randRotation = game.rnd.integerInRange(0, 5);

            lightDelay = game.rnd.integerInRange(0, 11000);
            nextLightAt = game.time.now + lightDelay;
            var spotLight = spotLights.getFirstExists(false);

            // spawn at a random location 
            spotLight.reset(game.rnd.integerInRange(15, 790), game.rnd.integerInRange(15, 790));

            //Randomize the rotation of the spotlight
            if (randRotation == 1) {
                spotLight.angle = 0;
            }
            else if (randRotation == 2) {
                spotLight.angle = 90;
            }
            else if (randRotation == 3) {
                spotLight.angle = 180;
            }
            else {
                spotLight.angle = -90; //If the number returns 4, set the spotlight to face west
            }
            spotLights.forEachAlive(function (spotLight) {
                // put every living spotLight in an array
                livingSpotLights.push(spotLight);
            });
            //spotLight.alive = true;
            **/
        },
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            this.game.physics.arcade.collide(player, groundLayer);
            //Reset player velocity
            player.body.velocity.setTo(0, 0);            
                
            //Move towards the mouse when clicked
            if (game.input.mousePointer.isDown) {
                var playerAngle = this.game.math.angleBetween(player.x, player.y, this.game.input.activePointer.x, this.game.input.activePointer.y);
                player.rotation = playerAngle;
                game.physics.arcade.moveToPointer(player, 200);

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
            // Remove the spotlights after a certain amount of time by damaging them every second, unless a certain time has passed.
            if (game.time.now > lightLifeTimer && counter > 3000) {
                for (var i = 0; i < livingSpotLights.length; i++) {
                    livingSpotLights[i].damage(1);
                }
                lightLifeTimer = game.time.now + 1000;
            }
            //Spawn the enemy spotlights
            if (nextLightAt < game.time.now && spotLights.countDead() >= 0) {
                //spawnLights();
                var randRotation = game.rnd.integerInRange(0, 5);

                //Update the nextLight at to a randomized value, but over time spotlights will spawn more rapidly
                if (counter > 3000) {
                    lightDelay = game.rnd.integerInRange(0, 15000);
                    nextLightAt = game.time.now + lightDelay;
                    counter = counter - 500;
                }
                else {
                    lightDelay = game.rnd.integerInRange(0, 3001);
                    nextLightAt = game.time.now + lightDelay;   
                }
                
                var spotLight = spotLights.getFirstExists(false);

                // spawn at a random location 
                spotLight.reset(game.rnd.integerInRange(15, 790), game.rnd.integerInRange(15, 790));
                
                //Randomize the rotation of the spotlight  
                spotLight.rotation = game.rnd.integerInRange(0, 800);
                game.physics.arcade.velocityFromRotation(spotLight.rotation, 100, spotLight.body.velocity);
                spotLights.forEachAlive(function (spotLight) {
                    // put every living spotLight in an array
                    livingSpotLights.push(spotLight);
                });
                spotLight.alive = true;
                spotLight.setHealth(game.rnd.integerInRange(10, 15));   //Spotlights live no more than 15  but no less than 10 seconds.
            }

            //Collisions!
            if (game.physics.arcade.overlap(player, spotLights, null, null, this)) {
                player.kill();
            }
            //If a spotlight runs into a footprint, follow that footprint
            if (game.physics.arcade.overlap(spotLights, footprints, null, null, this)) {
                game.physics.arcade.velocityFromRotation(footprints.rotation, 100, spotLights.body.velocity);
            }
            
            //Decrease the sugar levels and check for lose conditions!
            if (game.time.now > sugarTimer) {
                player.damage(1);
                sugarText.text = sugarLevel + player.health;
                sugarTimer = 1000 + game.time.now;
                //If the user's sugar levels hit 0, game over
                if (!player.alive) {
                    gameText.text = 'Game Over';
                    gameText.visible = true;
                    //game.pause();
                    //quitGame();
                    //the "click to restart" handler
                    //game.input.onTap.addOnce(restart, this);
                }
            }
            //Update max sugar level
            if (player.health > maxSugarLevel) {
                maxSugarLevel = player.health;
            }
        }
    };
};
