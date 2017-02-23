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
    
    var game = new Phaser.Game( 1200, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    

    function preload() {
        // Load the assets to be used in game.
        game.load.image('hunters', 'assets/spaceship3.png');
        game.load.image('hunterBullet', 'assets/hunterBullet.png');
        game.load.image('deafster', 'assets/deafster.jpg');
        game.load.image('deafBullet', 'assets/rocket.png');
        game.load.image('background', 'assets/space_2.jpg');
        game.load.image('bullet', 'assets/bullet_small.png');
        game.load.image('bulletImage', 'assets/bullet.png');
        game.load.image('blast', 'assets/blast2.png');
        game.load.image('blastImage', 'assets/blast2Image.png');
        game.load.image('laser', 'assets/laser.png');
        game.load.image('laserImage', 'assets/laserImage.png');
        game.load.spritesheet('player', 'assets/spaceship_Spritesheet.png', 50, 60, 3);
        game.load.spritesheet('playerHigh', 'assets/spaceship_SpritesheetHigh.png', 50, 60, 3);
        game.load.spritesheet('playerMed', 'assets/spaceship_SpritesheetMed.png', 50, 60, 3);
        game.load.spritesheet('playerLow', 'assets/spaceship_SpritesheetLow.png', 50, 60, 3);
        game.load.image('planet', 'assets/planet.jpg');
        game.load.spritesheet('explosion', 'assets/explosion3.png', 127, 127);
        game.load.audio('music', 'assets/footsteps.mp3');
    }
    
    //Inialize variables

    //Better movement?
    var ACCELERATION = 400;
    var DRAG = 300;
    var MAXSPEED = 300;

    var currentSpeed = 0;
    var background;
    var bullets;
    var bulletTime = 0;

    var firstBlastTime = false;
    var arsenalText;
    var bulletImage;
    var blasts;
    var blastTime = 0;
    var blastActive = false;
    var blastImage;
    var firstLaserTime
    var lasers;
    var laserTime = 0;
    var laserActive = false;
    var laserImage;

    var explosions;
    var player;
    var playershield = 0;
    var shield = '';
    var shieldText;
    var outputText;

    var hunters;
    var nextHunterAt;
    var hunterDelay;
    var livingHunters = [];
    var hunterBullets;
    var hunterShootTimer = 0;

    var deafsters;
    var deafAppear = false;
    var deafBullets;
    var deafShootTimer = 0;

    var score = 0;
    var scoreText;
    var scoreString;
    var gameText;

    var music;

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

        // Player's upgraded lasers        
        lasers = game.add.group();
        lasers.enableBody = true;
        lasers.physicsBodyType = Phaser.Physics.ARCADE;
        lasers.createMultiple(20, 'laser');
        lasers.setAll('anchor.x', 0.1);
        lasers.setAll('anchor.y', 0.1);
        lasers.setAll('outOfBoundsKill', true);
        lasers.setAll('checkWorldBounds', true);

        // Player's upgraded blasts        
        blasts = game.add.group();
        blasts.enableBody = true;
        blasts.physicsBodyType = Phaser.Physics.ARCADE;
        blasts.createMultiple(15, 'blast');
        blasts.setAll('anchor.x', 0.3);
        blasts.setAll('anchor.y', 1);
        blasts.setAll('outOfBoundsKill', true);
        blasts.setAll('checkWorldBounds', true);

        
        //Hunter's bullets        
        hunterBullets = game.add.group();
        hunterBullets.enableBody = true;
        hunterBullets.physicsBodyType = Phaser.Physics.ARCADE;
        hunterBullets.createMultiple(30, 'hunterBullet');
        hunterBullets.setAll('anchor.x', 0.5);
        hunterBullets.setAll('anchor.y', 0.5);
        hunterBullets.setAll('outOfBoundsKill', true);
        hunterBullets.setAll('checkWorldBounds', true);

        //deafster's bullets        
        deafBullets = game.add.group();
        deafBullets.enableBody = true;
        deafBullets.physicsBodyType = Phaser.Physics.ARCADE;
        deafBullets.createMultiple(30, 'deafBullet');
        deafBullets.setAll('anchor.x', 0.5);
        deafBullets.setAll('anchor.y', 0.5);
        //deafBullets.setAll('outOfBoundsKill', true);
        deafBullets.setAll('checkWorldBounds', true);

        //The player
        player = game.add.sprite(250, 500, 'player');
        player.frame = 0;
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.allowRotation = true;
        player.alive = true;
        player.setHealth(100);
        player.animations.add('player');
        player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
        player.body.drag.setTo(DRAG, DRAG);
        

        //Create the hunters. 
        hunters = game.add.group();
        hunters.enableBody = true;
        hunters.physicsBodyType = Phaser.Physics.ARCADE;
        hunters.createMultiple(50, 'hunters');
        hunters.setAll('anchor.x', 0.5);
        hunters.setAll('anchor.y', 0.5);
        hunters.setAll('checkWorldBounds', true);
        nextHunterAt = 0;                       //Adapted from the tutorial https://leanpub.com/html5shootemupinanafternoon/read#leanpub-auto-enemy-sprite-group
        hunterDelay = 5000;

        //Create a group of Deafsters //Originally gonna be a common enemy...
        deafsters = game.add.group();
        deafsters.enableBody = true;
        deafsters.physicsBodyType = Phaser.Physics.ARCADE;
        deafsters.createMultiple(3, 'deafster');
        deafsters.setAll('anchor.x', 0.5);
        deafsters.setAll('anchor.y', 0.5);
        deafsters.setAll('checkWorldBounds', true);
        deafsters.setAll('outOfBoundsKill', true);
        
        //Shieldboard
        shield = 'Shields: ';        
        shieldText = game.add.text(10, 10, shield + player.health, { font: '32px Arial', fill: '#00ffff' });
        shieldText.visible = true;
        
        //Scoreboard   //Adapted from Space Invaders example
        scoreString = 'Score: ';
        scoreText = game.add.text(1050, 25, scoreString + score, { font: '32px Arial', fill: '#fff' });
        scoreText.anchor.setTo(0.5, 0.5);
        scoreText.visible = true;

        gameText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '80px Arial', fill: '#fff' });
        gameText.anchor.setTo(0.5, 0.5);
        gameText.visible = false;

        //Current Arsenal Available in text/image form
        arsenalText = game.add.text(70, 770, 'Arsenal: ', { font: '32px Roman', fill: '#fff' });
        arsenalText.anchor.setTo(0.5, 0.5);
        
        //Add the bullet image
        bulletImage = game.add.sprite(150, 770, 'bulletImage');
        bulletImage.anchor.setTo(0.5, 0.5);
        bulletImage.alpha = 0.9;

        //Explosions  //Adapted from Invaders example
        explosions = game.add.group();
        explosions.createMultiple(25, 'explosion');
        explosions.forEach(setupUnits, this);

        //Add music
        music = game.add.audio('music');
        music.play();
        music.volume = 0.003;
    }

    //Adapted from Invaders example
    function setupUnits(unit) {
        unit.anchor.x = 0.5;
        unit.anchor.y = 0.5;
        unit.animations.add('explosion');
    }

    
    function update() {
               
        if (player.alive) {

            //Reset the player's movement
            player.body.acceleration.x = 0
            player.body.acceleration.y = 0
            currentSpeed = 0;
            //player.body.velocity.setTo(0, 0);   //Acceleration increases difficulty

            //  Scroll the background
            background.tilePosition.x += -0.5;

            //Spawn hunters  //Adapted from the tutorial: https://leanpub.com/html5shootemupinanafternoon/read#leanpub-auto-enemy-sprite-group
            if (nextHunterAt < game.time.now && hunters.countDead() >= 0) {
                nextHunterAt = game.time.now + hunterDelay;
                var hunter = hunters.getFirstExists(false);

                // spawn at a random location top of the screen
                hunter.reset(game.rnd.integerInRange(15, 1280), 0);
                hunters.forEachAlive(function (hunter) {
                    // put every living hunter in an array
                    livingHunters.push(hunter);
                });
                hunter.alive = true;
                hunter.setHealth(2);
            }
            // Accelerate the hunters towards the player
            for (var i = 0; i < livingHunters.length; i++) {
                var speed = game.rnd.integerInRange(25, 75);
                livingHunters[i].rotation = game.physics.arcade.accelerateToObject(livingHunters[i], player, 55, 55, 55);
            }
            
            //Oh boy, homing missiles 
            deafBullets.forEachAlive(function (deafBullet) {
                deafBullet.rotation = game.physics.arcade.accelerateToObject(deafBullet, player, 70);
            });
            
            //The keys to be used in this game
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.Z);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.X);
          
            //Adapted from tutorial http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-2/
            //Read in user inputs, just in case somebody plays this.
            if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                player.angle -= 4;                               
                currentSpeed = 200;
                //player.body.acceleration.x = -ACCELERATION;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                player.body.rotation += 4;
                currentSpeed = 200;
                //player.body.acceleration.x = ACCELERATION;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {                
                currentSpeed = 300;
                //player.body.acceleration.y = ACCELERATION;
                //player.body.acceleration.x = ACCELERATION;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                currentSpeed = -300;
                //player.body.acceleration.y = ACCELERATION;
                //player.body.acceleration.x = ACCELERATION;
            }
            
            if (currentSpeed != 0) {
                game.physics.arcade.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity);
            }
                 
            //When the player fires a bullet
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                fireBullet();
            }
            //When the player fires a laser
            if (game.input.keyboard.isDown(Phaser.Keyboard.X) && laserActive) {
                fireLaser();
            }
            //When the player fires a blast
            if (game.input.keyboard.isDown(Phaser.Keyboard.Z) && blastActive) {
                fireBlast();
            }
             
            if (game.time.now > hunterShootTimer) {
                hunterShoot();
            }
            if (game.time.now > deafShootTimer && deafAppear) {
                deafsterShoot(deafsters);
            }
            
            
            //  Run collisions
            game.physics.arcade.overlap(player, hunters, collisionDetect, null, this);
            game.physics.arcade.overlap(bullets, hunters, bulletHunter, null, this);
            game.physics.arcade.overlap(player, hunterBullets, shotPlayer, null, this);
            game.physics.arcade.overlap(lasers, hunters, laserHunter, null, this);
            game.physics.arcade.overlap(blasts, hunters, blastHunter, null, this);
            game.physics.arcade.overlap(deafBullets, hunters, friendlyFire, null, this);
            game.physics.arcade.overlap(player, deafsters, collisionDeaf, null, this);
            game.physics.arcade.overlap(bullets, deafsters, bulletDeaf, null, this);
            game.physics.arcade.overlap(lasers, deafsters, laserDeaf, null, this);
            game.physics.arcade.overlap(blasts, deafsters, blastDeaf, null, this);
            game.physics.arcade.overlap(player, deafBullets, rocketPlayer, null, this);
            game.physics.arcade.overlap(bullets, deafBullets, bulletOnMissileAction, null, this);
            game.physics.arcade.overlap(lasers, deafBullets, laserOnMissileAction, null, this);
            game.physics.arcade.overlap(blasts, deafBullets, blastOnMissileAction, null, this);

            //Update Health, sprite, text, and weapon power ups
            if (player.health <= 0) {
                player.setHealth(0);
            }
            else if (player.health <= 45 && player.health > 0) {
                shieldText.addColor("#ff0000", 0);
                blastActive = true;
                firstBlastTime = true;
                displayBlasts();
                player.frame = 2;
            }
            else if (player.health <= 70) {
                shieldText.addColor("#ffff00", 0);
                laserActive = true;
                firstLaserTime = true;
                displayLasers();                
                player.frame = 1;
            }
            shieldText.setText(shield + player.health);

            if (score == 100 && deafAppear == false) {
                spawnDeafster();
            }
            if (score >= 250) {
                scoreText.text = scoreString + score;

                //Adapted from space invaders
                hunterBullets.callAll('kill', this);
                lasers.callAll('kill', this);
                bullets.callAll('kill', this);
                blasts.callAll('kill', this);
                gameText.text = "You Won!";
                gameText.visible = true;
                music.stop();
            }
        }
        else {
                //Shield overload = ship destruction/capture
                var explosion = explosions.getFirstExists(false);
                explosion.reset(player.body.x, player.body.y);
                explosion.play('explosion', 30, false, true);

                hunterBullets.callAll('kill', this);
                bullets.callAll('kill', this);
                gameText.text = "GAME OVER";
                gameText.addColor("#ff0000", 0);
                gameText.visible = true;
                music.stop();
        }
    }

    //display arsenal images
    function displayBlasts() {
        if (blastActive && firstBlastTime) {
            blastImage = game.add.sprite(330, 770, 'blastImage');
            blastImage.anchor.setTo(0.5, 0.5);
            blastImage.alpha = 0.9;
            firstBlastTime = false;
        }
    }
    function displayLasers() {
        if (laserActive && firstLaserTime) {
            laserImage = game.add.sprite(230, 770, 'laserImage');
            laserImage.anchor.setTo(0.5, 0.5);
            laserImage.alpha = 0.9;
            firstLaserTime = false;
        }
    }

    
    //Create the deafster 
    function spawnDeafster() {
        var deafster = deafsters.getFirstExists(false);
        deafster.reset(1050, 400);
        deafster.alive = true;
        deafster.setHealth(20);
        deafAppear = true;
    }

    //Adapted from the space invaders example
    function hunterShoot() {
        
        var hunterBullet = hunterBullets.getFirstExists(false);
        //update the hunter's array before shooting to make sure dead men don't shoot:)
        livingHunters.length = 0;
        livingHunters = [];
        hunters.forEachAlive(function (hunter) {
            // put every living enemy in an array
            livingHunters.push(hunter);
        });
        if (hunterBullet && livingHunters.length > 0) {
            var randomHunter = game.rnd.integerInRange(0, livingHunters.length - 1);
            var shooter = livingHunters[randomHunter];
            // And fire the bullet from this enemy
            hunterBullet.reset(shooter.body.x + 2, shooter.body.y + 1.5);

            game.physics.arcade.moveToObject(hunterBullet, player, 150);
            hunterShootTimer = game.time.now + 1000;
        }
    }

    //Have the deafster's shoot.
    function deafsterShoot(deafster) {
        if (deafster.alive) {
            var deafBullet = deafBullets.getFirstExists(false);
            if (deafBullet) {
                // And fire the bullet from this enemy
                deafBullet.reset(1000, 400);
                deafBullet.rotation = game.physics.arcade.accelerateToObject(deafBullet, player, 65);
                deafShootTimer = game.time.now + 2000;
            }
        }
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

    function fireBlast() {
        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > blastTime) {
            // Grab the first blast we can from the pool
            var blast = blasts.getFirstExists(false);
            //Adapted from the tutorial http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-2/
            if (blast) {
                //  And fire it
                //  Make blast come out of tip of ship with right angle
                var blastOffSet = 5 * Math.sin(game.math.degToRad(player.angle));
                //blast.reset(player.x + blastOffset, player.y);
                blast.reset(player.x + blastOffSet, player.y + blastOffSet);
                blast.angle = player.angle;
                game.physics.arcade.velocityFromAngle(blast.angle, 400, blast.body.velocity);
                blast.body.velocity.x += player.body.velocity.x;
                blast.body.velocity.y += player.body.velocity.y;
                blastTime = game.time.now + 2500;
                blast.alive = true;
                blast.setHealth(2);
            }
        }
    }

    function fireLaser() {
        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > laserTime) {
            // Grab the first laser we can from the pool
            var laser = lasers.getFirstExists(false);
            
            //Adapted from the tutorial http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-2/
            if (laser) {
                //  And fire it
                //  Make the laser come out of tip of ship with right angle
                var laserOffSet = 5 * Math.sin(game.math.degToRad(player.angle));
                laser.reset(player.x + laserOffSet, player.y + laserOffSet);
                laser.angle = player.angle;
                game.physics.arcade.velocityFromAngle(laser.angle, 400, laser.body.velocity);
                laser.body.velocity.x += player.body.velocity.x;
                laser.body.velocity.y += player.body.velocity.y;
                laserTime = game.time.now + 1500;
            }
        }
    }

    function resetBullet(bullet) {
        //  Called if the bullet goes out of the screen
        bullet.kill();
    }

    function collisionDetect(player, hunter) {
        //Kills hunter and damages player.
        hunter.kill();
        player.damage(10);
        //  Increase the score
        score += 10;
        scoreText.text = scoreString + score;

        //Hunter ship explodes on impact         //Adapted from Invaders example
        var explosion = explosions.getFirstExists(false);
        explosion.reset(hunter.body.x, hunter.body.y);
        explosion.play('explosion', 30, false, true);        
    }

    function collisionDeaf(player, deafster) {
        //Kills player. Immediately. 
        player.kill();

        //Player ship explodes on impact
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('explosion', 30, false, true);
    }

    function friendlyFire(deafBullet, hunter) {
        //Kills both
        hunter.kill();
        deafBullet.kill();

        //Missile explodes on impact
        var explosion = explosions.getFirstExists(false);
        explosion.reset(deafBullet.body.x, deafBullet.body.y);
        explosion.play('explosion', 30, false, true);
    }

    function bulletHunter(bullet, hunter) {
        bullet.kill();        
        hunter.damage(1);
        //Update score
        if (!hunter.alive) {
            score += 10;
            scoreText.text = scoreString + score;
            //  Create an Explosion     
            var explosion = explosions.getFirstExists(false);
            explosion.reset(hunter.body.x, hunter.body.y);
            explosion.play('explosion', 30, false, true);
        }
        else {
            //  Create an Explosion on the bullet     
            var explosion = explosions.getFirstExists(false);
            explosion.reset(bullet.body.x, bullet.body.y);
            explosion.play('explosion', 30, false, true);
        }
    }

    function bulletDeaf(bullet, deafster) {
        bullet.kill();
        deafster.damage(1);
        //Update score
        if (!deafster.alive) {
            score += 9000;
            scoreText.text = scoreString + score;
            //  Create an Explosion     
            var explosion = explosions.getFirstExists(false);
            explosion.reset(bullet.body.x, bullet.body.y);
            explosion.play('explosion', 30, false, true);
        }
        //  Create an Explosion on every bullet  
        var explosion = explosions.getFirstExists(false);
        explosion.reset(bullet.body.x, bullet.body.y);
        explosion.play('explosion', 30, false, true);
    }

    function bulletOnMissileAction(bullet, deafBullet) {
        bullet.kill();
        deafBullet.kill();
        //Update score
        //  Create an Explosion     
        var explosion = explosions.getFirstExists(false);
        explosion.reset(deafBullet.body.x, deafBullet.body.y);
        explosion.play('explosion', 30, false, true);

    }

    function laserHunter(laser, hunter) {
        laser.kill();
        hunter.damage(2);
        //Update score
        if (!hunter.alive) {
            score += 10;
            scoreText.text = scoreString + score;
        }

        //  Create an Explosion on every laser    //Adapted from Invaders example
        var explosion = explosions.getFirstExists(false);
        explosion.reset(hunter.body.x, hunter.body.y);
        explosion.play('explosion', 30, false, true);
    }

    function laserDeaf(laser, deafster) {
        laser.kill();
        deafster.damage(2);
        //Update score
        if (!deafster.alive) {
            score += 9000;
            scoreText.text = scoreString + score;
        }

        //  Create an Explosion on every laser    
        var explosion = explosions.getFirstExists(false);
        explosion.reset(laser.body.x, laser.body.y);
        explosion.play('explosion', 30, false, true);
    }

    function laserOnMissileAction(laser, deafBullet) {
        //Lasers > missiles. Also missiles kinda OP already
        deafBullet.kill();
        laser.kill();

        //  Create an Explosion on every laser    
        var explosion = explosions.getFirstExists(false);
        explosion.reset(deafBullet.body.x, deafBullet.body.y);
        explosion.play('explosion', 30, false, true);
    }

    function blastHunter(blast, hunter) {
        blast.damage(1);
        hunter.damage(3);
        //Update score
            score += 10;
            scoreText.text = scoreString + score;

        //  Create an Explosion on every blast    
        var explosion = explosions.getFirstExists(false);
        explosion.reset(hunter.body.x, hunter.body.y);
        explosion.play('explosion', 30, false, true);
    }

    function blastDeaf(blast, deafster) {
        blast.damage(2);
        deafster.damage(3);
        //Update score
        if (!deafster.alive) {
            score += 9000;
            scoreText.text = scoreString + score;
        }

        //  Create an Explosion on every blast    
        var explosion = explosions.getFirstExists(false);
        explosion.reset(blast.body.x, blast.body.y);
        explosion.play('explosion', 30, false, true);
    }

    function blastOnMissileAction(blast, deafBullet) {
        blast.damage(1);
        deafBullet.kill();

        //  Create an Explosion on every blast    
        var explosion = explosions.getFirstExists(false);
        explosion.reset(deafBullet.body.x, deafBullet.body.y);
        explosion.play('explosion', 30, false, true);
    }

    function shotPlayer(player, hunterBullet) {
        //Kills hunterBullet and damages player.
        player.damage(5);
        hunterBullet.kill();        
    }
     
    function rocketPlayer(player, deafBullet) {
        //Kills deafBullet and damages player. Missiles kinda OP already
        player.damage(20);
        deafBullet.kill();

        //  Create an Explosion on every missile   
        var explosion = explosions.getFirstExists(false);
        explosion.reset(deafBullet.body.x, deafBullet.body.y);
        explosion.play('explosion', 30, false, true);
    }
};
