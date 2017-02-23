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
    //This was a learning experience. sorry:(
    
    "use strict";
    
    var game = new Phaser.Game( 800, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    

    function preload() {
        // Load the assets to be used in game.
        game.load.image('background', 'assets/snow-night.jpg');
        game.load.image('player', 'assets/footprints/footprints1.png');
        //game.load.atlasJSONArray('footprints', 'footsteps.png', 'footsteps.json');
        game.load.spritesheet('footprints', 'assets/footsteps.png', 30, 30);
        game.load.image('light', 'assets/light.png');
        game.load.image('chocopuff', 'assets/chocopuff.jpg');
        game.load.tilemap('tilemap', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/grey.jpg');
        game.load.audio('snowStep', 'assets/footsteps.mp3');
        game.load.audio('whistle', 'assets/whistle.wav');
    }
    
    //Inialize variables

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
    var chocoLifeTimer;
    var chocoDelay
    var nextChocoAt;
    
    var snowStep;
    var snowStepTimer = 2000;
    var whistle;

    var sugarLevel;
    var maxSugarLevel;
    var sugarText;
    var sugarTimer;
    var scoreText;
    var scoreString;
    var score = 0;
    var gameText;

    function create() {
        

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
            locationX = 80;  //spawn in left corner
            locationY = 50;
        }
        else if (rand == 2) {
            locationX = 740;//spawn in right corner
            locationY = 70;
        }
        else if (rand == 3) {
            locationX = 80;//spawn in bottom left corner
            locationY = 750;
        }
        else if (rand == 4) {
            locationX = 720;//spawn in bottom right corner
            locationY = 720;
        }
        else {
            locationX = 350; //Spawn in the middle if 5 is returned.
            locationY = 400;
        }

        player = game.add.sprite(locationX, locationY, 'player');
        player.enableBody = true;
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.alive = true;
        player.setHealth(50);

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
        counter = 6000;
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
        nextChocoAt = 5000;
        chocoDelay = 10000;
        chocoLifeTimer = 1000;

        //Add the chocopuffs into the game at one of the default spawnpoints
        var chocoPuff1 = chocoPuffs.getFirstExists(false);
        chocoPuff1.reset(40, 40);
        var chocoPuff2 = chocoPuffs.getFirstExists(false);
        chocoPuff2.reset(770, 40);
        var chocoPuff3 = chocoPuffs.getFirstExists(false);
        chocoPuff3.reset(40, 770);
        var chocoPuff4 = chocoPuffs.getFirstExists(false);
        chocoPuff4.reset(770, 770);
        var chocoPuff5 = chocoPuffs.getFirstExists(false);
        chocoPuff5.reset(400, 400);
               
        
        //Add snowStep
        snowStep = game.add.audio('snowStep');
        
        //Add whistle sound
        whistle = game.add.audio('whistle');

        //sugarboard
        sugarLevel = 'Sugar Levels: ';
        sugarText = game.add.text(10, 10, sugarLevel + player.health, { font: '24px Arial', fill: '#ff0000' });
        sugarText.visible = true;
        sugarText.alpha = 0.7;
        sugarTimer = 2000;

        gameText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '80px Arial', fill: '#fff' });
        gameText.anchor.setTo(0.5, 0.5);
        gameText.visible = false;

        //Scoreboard   
        scoreString = 'Score: ';
        scoreText = game.add.text(600, 25, scoreString + score, { font: '24px Arial', fill: '#fff' });
        scoreText.anchor.setTo(0.5, 0.5);
        scoreText.visible = true;
        scoreText.alpha = 0.7;
    }

    
    function update() {
               
        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        this.game.physics.arcade.collide(player, groundLayer);
        //Reset player velocity
        player.body.velocity.setTo(0, 0);

        //Move towards the mouse when clicked
        if (game.input.mousePointer.isDown) {
            var playerAngle = this.game.math.angleBetween(player.x, player.y, this.game.input.activePointer.x, this.game.input.activePointer.y);
            player.rotation = playerAngle;
            game.physics.arcade.moveToPointer(player, 200);
            if (snowStepTimer < game.time.now) {
                snowStep.play();
                snowStep.volume = 0.5;
                snowStepTimer = 1500 + game.time.now;
            }

            //Create a footstep
            if (game.time.now > footTimer) {
                var footprint = footprints.getFirstExists(false);
                footprint.reset(player.x, player.y);
                footprint.rotation = player.rotation;
                footprint.play('footprints', 1, false, true);
                footTimer = game.time.now + 400;
                
            }
        }
        //Stop once reached cursor
        if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y)) {
            player.body.velocity.setTo(0, 0);
        }
        // Remove the spotlights after a certain amount of time by damaging them every second, unless a certain time has passed.
        if (game.time.now > lightLifeTimer) {  
            for (var i = 0; i < livingSpotLights.length; i++) {
                livingSpotLights[i].damage(1);
            }
            if (counter >= 3000) {
                lightLifeTimer = game.time.now + 2000;  
            }
            else {
                lightLifeTimer = game.time.now + 3750;  //SpotLights last longer endgame
            }
        }
        //Spawn the enemy spotlights
        if (nextLightAt < game.time.now && spotLights.countDead() >= 0) {
            //spawnLights();
            var randRotation = game.rnd.integerInRange(0, 5);

            //Update the nextLight at to a randomized value, but after a certain period of time time spotlights will spawn more rapidly
            if (counter > 3000) {
                lightDelay = game.rnd.integerInRange(0, 4000);
                nextLightAt = game.time.now + lightDelay;
                counter = counter - 500;
            }
            else {
                lightDelay = game.rnd.integerInRange(0, 2000);
                nextLightAt = game.time.now + lightDelay;
            }

            var spotLight = spotLights.getFirstExists(false);

            // spawn at a random location 
            spotLight.reset(game.rnd.integerInRange(15, 790), game.rnd.integerInRange(15, 790));
            spotLight.alive = true;
            spotLight.alpha = 0.6;
            spotLight.setHealth(game.rnd.integerInRange(5, 16));   //Spotlights live no more than 15 but no less than 6 seconds before lategame.
            //Randomize the rotation of the spotlight  
            spotLight.rotation = game.rnd.integerInRange(0, 800);
            game.physics.arcade.velocityFromRotation(spotLight.rotation, 100, spotLight.body.velocity);
            spotLights.forEachAlive(function (spotLight) {
                // put every living spotLight in an array
                livingSpotLights.push(spotLight);
            });
            
        }

        //Spawn the delicious chocoPuffs
        if (nextChocoAt < game.time.now) {

            //Update the nextLight at to a randomized value, but over time chocoPuffs will spawn more rapidly
            if (counter > 3000) {
                chocoDelay = game.rnd.integerInRange(3000, 10000);
                nextChocoAt = game.time.now + chocoDelay;
            }
            else {
                chocoDelay = game.rnd.integerInRange(0, 6000);
                nextChocoAt = game.time.now + chocoDelay;
            }

            var chocoPuff = chocoPuffs.getFirstExists(false);

            // spawn at a random location 
            chocoPuff.reset(game.rnd.integerInRange(40, 790), game.rnd.integerInRange(40, 790));

            
            chocoPuff.alive = true;            
        }

        //Collisions!
        if (game.physics.arcade.overlap(player, spotLights, null, null, this)) {
            player.kill();
            whistle.play();
            whistle.volume = 0.5;
        }
        //If a spotlight runs into a footprint, follow that footprint
        game.physics.arcade.overlap(spotLights, footprints, onTheTrail, null, this)
        game.physics.arcade.overlap(player, chocoPuffs, munch, null, this);

        //Decrease the sugar levels and check for lose conditions!
        if (game.time.now > sugarTimer) {
            player.damage(5);
            sugarText.text = sugarLevel + player.health;
            sugarTimer = 1000 + game.time.now;
            //If the user's sugar levels hit 0, game over
            if (!player.alive) {
                gameText.text = 'You Were Caught!';
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

    function onTheTrail(spotLight, footprint) {
        spotLight.rotation = game.physics.arcade.velocityFromRotation(footprint.rotation, 145, spotLight.body.velocity);
    }
    function munch(player, chocoPuff){
        player.heal(15);
        chocoPuff.kill();

        //Update the player's sugar levels and score
        sugarText.text = sugarLevel + player.health;
        score += 15;
        scoreText.text = scoreString + score;
    }
    
};
