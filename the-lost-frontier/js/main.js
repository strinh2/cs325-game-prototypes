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
    
    //To do list: Health for enemies, numerous enemies, exhaust/varying ship images

    function preload() {
        // Load the assets to be used in game.
        game.load.image('hunters', 'assets/spaceship2_small.png');
        game.load.image('hunterBullet', 'assets/hunterBullet.png');
        game.load.image('background', 'assets/space_small.jpg');
        game.load.image('bullet', 'assets/bullet_small.png');
        game.load.image('player', 'assets/spaceship1.png');
        game.load.image('player_med', 'assets/spaceship1_lowHealth.png');
        game.load.image('player_low', 'assets/spaceship1_noHealth.png');
        game.load.image('planet', 'assets/planet.jpg');
        game.load.spritesheet('explosion', 'assets/explosion3.png',127,127);
    }
    
    
    var currentSpeed = 0;
    var hunters;
    var background;
    var bullets;
    var bulletTime = 0;
    var hunterBullets;
    var hunterShootTimer = 0;
    //var enemyBullet;
    var firingTimer = 0;

    var explosions;
    var player;
    var playershield = 0;
    var shield = '';
    var shieldText;
    var outputText;

    var nextHunterAt;
    var hunterDelay;
    var livingHunters = [];

    var planet;
    var nextPlanetAt;
    var planetDelay;
    //var planetPool;

    function create() {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  The scrolling background
        background = game.add.tileSprite(0, 0, 1200, 800, 'background');           
        
        // Player's bullets        (Adapted from Invaders example)
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(25, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
        
        //Hunter's bullets        (Adapted from Invaders example)
        hunterBullets = game.add.group();
        hunterBullets.enableBody = true;
        hunterBullets.physicsBodyType = Phaser.Physics.ARCADE;
        hunterBullets.createMultiple(30, 'hunterBullet');
        hunterBullets.setAll('anchor.x', 0.5);
        hunterBullets.setAll('anchor.y', 1);
        hunterBullets.setAll('outOfBoundsKill', true);
        hunterBullets.setAll('checkWorldBounds', true);

        //The player
        player = game.add.sprite(100, 200, 'player');
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = false;
        player.body.allowRotation = true;
        player.alive = true;
        player.setHealth(100);
        //player.animations.add('explosion', [0,1,2,3,4,5,6,7,8,9,10,11,12,13],);

        //Create the hunters. Adapted from the tutorial https://leanpub.com/html5shootemupinanafternoon/read#leanpub-auto-enemy-sprite-group
        hunters = game.add.group();
        hunters.enableBody = true;
        hunters.physicsBodyType = Phaser.Physics.ARCADE;
        hunters.createMultiple(50, 'hunters');
        hunters.setAll('anchor.x', 0.5);
        hunters.setAll('anchor.y', 0.5);
        hunters.setAll('checkWorldBounds', true);
        //livingHunters.length = 0;

        nextHunterAt = 0;
        hunterDelay = 10000;
        //spawnHunters();          
        
        

        //shieldboard
        shield = 'Shields: ';
        
        shieldText = game.add.text(10, 10, shield + player.health, { font: '34px Arial', fill: '#0cf943' });
        shieldText.visible = true;
        
        
        //stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '84px Arial', fill: '#fff' });
        //stateText.anchor.setTo(0.5, 0.5);
        //stateText.visible = false;                    

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        text.anchor.setTo(0.5, 0.0);

        //Explosions
        explosions = game.add.group();
        explosions.createMultiple(25, 'explosion');
        explosions.forEach(setupUnits, this);
    }

    function setupUnits(unit) {
        unit.anchor.x = 0.5;
        unit.anchor.y = 0.5;
        unit.animations.add('explosion');
    }

    //Create the hunters. Adapted from the tutorial https://leanpub.com/html5shootemupinanafternoon/read#leanpub-auto-enemy-sprite-group
    function spawnHunters() {

       
        
    /**
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 10; x++) {
                // Create a sprite at the center of the screen using the enemy ship image.
                //hunters = game.add.sprite(game.world.centerX, game.world.centerY, 'hunters');

                var hunter = hunters.create(x * 48, y * 50, 'hunters');
                hunters.anchor.setTo(0.5, 0.5);
                // Turn on the arcade physics engine for this sprite.
                game.physics.enable(hunters, Phaser.Physics.ARCADE);
                // Make it bounce off of the world bounds.
                //hunters.body.collideWorldBounds = true;
                hunters.alive = true;
                hunters.setHealth(2);
            }
        }
        **/
    }
    
    function update() {
        
        //To randomly spawn planets. 
        //Adapted from the tutorial: https://leanpub.com/html5shootemupinanafternoon/read#leanpub-auto-enemy-sprite-group
        if (this.nextPlanetAt < this.time.now && this.planetPool.countDead() > 0) {
            this.nextPlanetAt = this.time.now + this.planetDelay;
            var pln = this.planetPool.getFirstExists(false);
            // spawn at a random location at the top of the screen.
            pln.reset(this.rnd.integerInRange(20, 780), 0);
            // also randomize the speed
            pln.body.velocity.y = this.rnd.integerInRange(30, 60);
        }

        

        
        if (player.alive) {
            //fix camera to follow player
            //game.camera.focusOnXY(player.x, player.y);
            //game.camera.deadzone = new Phaser.Rectangle(200, 380, 1, 1);
            //game.camera.setPosition(player.x, player.y);

            //Reset the player's movement
            player.body.angularVelocity = 0;
            currentSpeed = 50;
            player.body.velocity.setTo(0, 0);
            //  Scroll the background
            background.tilePosition.x += -0.5;

            //Spawn hunters  //Adapted from the tutorial: https://leanpub.com/html5shootemupinanafternoon/read#leanpub-auto-enemy-sprite-group
            if (nextHunterAt < game.time.now && hunters.countDead() >= 0) {
                nextHunterAt = game.time.now + hunterDelay;
                var hunter = hunters.getFirstExists(false);
                // spawn at a random location top of the screen
                hunter.reset(game.rnd.integerInRange(20, 780), 0);
                // also randomize the speed
                hunter.body.velocity.y = game.rnd.integerInRange(30, 60);
                hunter.body.velocity.x = game.rnd.integerInRange(30, 60);
                //hunters.forEachAlive(function (hunter) {
                    // put every living enemy in an array
                    //livingHunters.push(hunter);
                //});
                hunter.alive = true;
                hunter.setHealth(2);
            }
            
            // Accelerate the 'hunters' sprite towards the cursor
            hunters.rotation = game.physics.arcade.accelerateToObject(hunters, player, 50, 50, 50);             
            
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
          
                    

            if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                //player.angle -= 4;                
                player.angle -= 4;                               
                currentSpeed= 150;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                //player.angle -= 4;                
                player.body.rotation += 4;
                currentSpeed = 150;
                //player.body.velocity.x = 100;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {                
                currentSpeed = 200;
                //player.body.velocity.y = -100;
            }
            //else if (game.input.keyboard.justReleased(Phaser.Keyboard.DOWN)) {
                
                    //var currentAngle = player.angle;
                   // player.angle = currentAngle - 180;                   
                //currentSpeed = 150;                
                //player.body.velocity.y = -100;
            //}           
            
            if (currentSpeed != 0) {
                game.physics.arcade.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity);
            }
                 
            //When the player fires a bullet
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                fireBullet();
            }
             
            if (game.time.now > hunterShootTimer) {
                //hunterShoot(hunters);
            }

            //  Run collisions
            //game.physics.arcade.overlap(hunters, player, collision, null, this);
            //game.physics.arcade.overlap(bullets, hunters, shotEnemy, null, this);
            //game.physics.arcade.overlap(hunterBullets, player, hitPlayer, null, this);
            //Update Health
            if (player.health <= 20) {
                shieldText.addColor("#ff0000", 0);
            }
            else if (player.health <= 60) {
                shieldText.addColor("#ffff00", 0);
            }
            shieldText.setText(shield + player.health);
            
        }
    }

    function hunterShoot(hunter) {

        //  Grab the first bullet we can from the pool
        //var hunterBullet = hunterBullets.getFirstExists(false);

        // And fire the bullet from this enemy
        //hunterBullet.reset(hunter.body.x, hunter.body.y);

        //game.physics.arcade.moveToObject(hunterBullet, player, 120);
        //hunterFireTimer = game.time.now + 2000;

        /** 
        livingEnemies.length = 0;

        aliens.forEachAlive(function (alien) {

            // put every living enemy in an array
            livingEnemies.push(alien);
        });


        if (enemyBullet && livingEnemies.length > 0) {

            var random = game.rnd.integerInRange(0, livingEnemies.length - 1);

            // randomly select one of them
            var shooter = livingEnemies[random];
            
        }
        **/
    }

    function fireBullet() {
        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > bulletTime) {
            //  Grab the first bullet we can from the pool
            var bullet = bullets.getFirstExists(false);

            if (bullet) {
                //  And fire it
                bullet.reset(player.x, player.y + 8);
                bullet.body.rotation = player.body.rotation;
                game.physics.arcade.velocityFromRotation(player.rotation, 400, bullet.body.velocity); 
                bulletTime = game.time.now + 400;
            }
        }
    }

    function resetBullet(bullet) {

        //  Called if the bullet goes out of the screen
        bullet.kill();
    }

    function collision(hunters, player) {
        player.damage(20);
        hunters.kill();
    }

    function shotEnemy(bullet, hunters) {
        bullet.kill();
        //For some reason damage/health dont work for the enemies:/
        hunters.damage(1);

        //  Create an Explosion on impact
        var explosion = explosions.getFirstExists(false);
        explosion.reset(hunters.body.x, hunters.body.y);
        explosion.play('explosion', 30, false, true);
    }
     
};
