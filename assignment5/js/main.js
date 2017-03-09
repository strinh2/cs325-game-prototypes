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
    
    var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
    
    

    function preload() {
        // Load the assets to be used in game.
        game.load.image('cowboys', 'assets/spaceship2.png');
        game.load.image('cowboyBullet', 'assets/cowboyBullet.png');
        game.load.image('asteroid', 'assets/asteroid_mini.png');
        game.load.image('background', 'assets/space_2.jpg');
        game.load.image('blastImage', 'assets/blast2Image.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('laserImage', 'assets/laserImage.png');
        game.load.image('player', 'assets/player.png');
        game.load.image('planetM', 'assets/planet.png');
        game.load.image('planetS', 'assets/planetS.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('explosion', 'assets/explosion3.png', 127, 127);
        game.load.image('blue', 'assets/blue.png');

    }
    
    //Inialize variables

    var size = 0;


    //var manager = null;
    //var flameEmitter = null;

    var currentSpeed = 0;
    var background;
    var explosions;
    var player;
    var outputText;
    var bullets;
    var timer = 1000;

    var cowboys;
    var nextcowboyAt;
    var cowboyDelay;
    var livingcowboys = [];
    var cowboyShootTimer = 0;

    var playerTrail;
    var healTime = 1000;
    var asteroids;
    var nextAsteroidAt;
    var asteroidDelay;

    var planetMs;
    var livingPlanetMs = [];
    var nextplanetMAt;
    var planetMDelay;

    var planetSs;
    var livingplanetSs = [];
    var nextplanetSAt;
    var planetSDelay;

    var stars;
    var livingstars = [];
    var nextstarAt;
    var starDelay;

    var hp = '';
    var hpText;

    var score = 0;
    var scoreText;
    var scoreString;
    var gameText;


    function create() {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //manager = game.plugins.add(Phaser.ParticleStorm);

        //  The scrolling background
        background = game.add.tileSprite(0, 0, 1200, 800, 'background');                 
       
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(25, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        //The player
        player = game.add.sprite(250, 500, 'player');
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.allowRotation = true;
        player.alive = true;
        player.setHealth(5);
        player.width = 50;
        player.height = 50;

        //Trail    /Adapted from Firelight Phaser example
        /**var flame = {
            lifespan: 3000,
            image: 'blue',
            bringToTop: true,
            blendMode: 'ADD',
            hsv: { initial: 0, value: 70, control: 'linear' },
            alpha: { initial: 0, value: 1, control: [{ x: 0, y: 1 }, { x: 0.5, y: 0.8 }, { x: 1, y: 0 }] },
            scale: { min: 0.5, max: 1.5 },
            vx: { min: -0.2, max: 0.2 },
            vy: { min: -1, max: -2 }
        };

        var spark = {
            lifespan: 3500,
            image: 'blue',
            bringToTop: true,
            blendMode: 'ADD',
            alpha: { initial: 0, value: 1, control: [{ x: 0, y: 1 }, { x: 0.5, y: 0.9 }, { x: 1, y: 0 }] },
            scale: { initial: 0, value: 1, control: 'linear' },
            vx: { min: -0.2, max: 0.2 },
            vy: { min: -1, max: -2 }
        };


        manager.addData('flame', flame);
        manager.addData('spark', spark);

        flameEmitter = manager.createEmitter();
        flameEmitter.addToWorld();

        flameEmitter.emit('spark', 400, 450, { repeat: -1, frequency: 140 });
        flameEmitter.emit('flame', 400, 450, { repeat: -1, frequency: 40 });
        **/

        //  Add an emitter for the player               //Adapted from: http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-2/
           //playerTrail = game.add.emitter(player.x, player.y + 10, 400);
           //playerTrail.width = player.width - 25;
           //playerTrail.makeParticles('blue');
           //playerTrail.setXSpeed(30, -30);
           //playerTrail.setYSpeed(-30, 80);
           //playerTrail.rotation = player.rotation;
           //playerTrail.setAlpha(1, 0.01, 800);
           //playerTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
           //playerTrail.start(false, 5000, 10);

        //Create the cowboys. 
        cowboys = game.add.group();
        cowboys.enableBody = true;
        cowboys.physicsBodyType = Phaser.Physics.ARCADE;
        cowboys.createMultiple(50, 'cowboys');
        cowboys.setAll('anchor.x', 0.5);
        cowboys.setAll('anchor.y', 0.5);
        cowboys.setAll('checkWorldBounds', true);
        nextcowboyAt = 20000;                       //Adapted from the tutorial https://leanpub.com/html5shootemupinanafternoon/read#leanpub-auto-enemy-sprite-group
        cowboyDelay = 30000;

        //Create a group of asteroids 
        asteroids = game.add.group();
        asteroids.enableBody = true;
        asteroids.physicsBodyType = Phaser.Physics.ARCADE;
        asteroids.createMultiple(50, 'asteroid');
        asteroids.setAll('anchor.x', 0.5);
        asteroids.setAll('anchor.y', 0.5);
        asteroids.setAll('checkWorldBounds', true);
        asteroids.setAll('outOfBoundsKill', true);
        asteroidDelay = 1000;
        nextAsteroidAt = 0;
        
        //Create a group of planetMs 
        planetMs = game.add.group();
        planetMs.enableBody = true;
        planetMs.physicsBodyType = Phaser.Physics.ARCADE;
        planetMs.createMultiple(15, 'planetM');
        planetMs.setAll('anchor.x', 0.5);
        planetMs.setAll('anchor.y', 0.5);
        planetMs.setAll('checkWorldBounds', true);
        planetMs.setAll('outOfBoundsKill', false);
        planetMDelay = 10000;
        nextplanetMAt = 5000;

        //Create a group of planetS 
        planetSs = game.add.group();
        planetSs.enableBody = true;
        planetSs.physicsBodyType = Phaser.Physics.ARCADE;
        planetSs.createMultiple(20, 'planetS');
        planetSs.setAll('anchor.x', 0.5);
        planetSs.setAll('anchor.y', 0.5);
        planetSs.setAll('checkWorldBounds', true);
        planetSs.setAll('outOfBoundsKill', false);
        planetSDelay = 5000;
        nextplanetSAt = 0;

        //Create a group of stars
        stars = game.add.group();
        stars.enableBody = true;
        stars.physicsBodyType = Phaser.Physics.ARCADE;
        stars.createMultiple(15, 'star');
        stars.setAll('anchor.x', 0.5);
        stars.setAll('anchor.y', 0.5);
        stars.setAll('checkWorldBounds', true);
        stars.setAll('outOfBoundsKill', false);
        starDelay = 15000;
        nextstarAt = game.rnd.integerInRange(15000, 30000);
        
        //Scoreboard   //Adapted from Space Invaders example
        scoreString = 'Score: ';
        scoreText = game.add.text(1050, 25, scoreString + score, { font: '42px Arial', fill: '#fff' });
        scoreText.anchor.setTo(0.5, 0.5);
        scoreText.visible = true;

        hp = 'HP: ';
        hpText = game.add.text(10, 10, hp + player.health, { font: '42px Arial', fill: '#00ffff' });
        hpText.visible = true;

        gameText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '32px Arial', fill: '#fff' });
        gameText.anchor.setTo(0.5, 0.5);
        gameText.visible = false;


        //Explosions  
        explosions = game.add.group();
        explosions.createMultiple(25, 'explosion');
        explosions.forEach(setupUnits, this);
    }

    //Adapted from Invaders
    function setupUnits(unit) {
        unit.anchor.x = 0.5;
        unit.anchor.y = 0.5;
        unit.animations.add('explosion');
    }

    
    function update() {
               
        if (player.alive) {

            //Reset the player's movement to always move
            currentSpeed = 50;
            //player.body.velocity.setTo(0, 0);   //Acceleration increases difficulty

            //  Scroll the background
            background.tilePosition.x += -0.75;

            //Spawn cowboys  //Adapted from the tutorial: https://leanpub.com/html5shootemupinanafternoon/read#leanpub-auto-enemy-sprite-group
            if (nextcowboyAt < game.time.now && cowboys.countDead() >= 0) {
                nextcowboyAt = game.time.now + game.rnd.integerInRange(7500, 20000);
                var cowboy = cowboys.getFirstExists(false);

                // spawn at a random location top of the screen
                cowboy.reset(game.rnd.integerInRange(15, 1280), 0);
                cowboys.forEachAlive(function (cowboy) {
                    // put every living cowboy in an array
                    livingcowboys.push(cowboy);
                });
                cowboy.alive = true;
            }

            // Accelerate the cowboys towards the player
            for (var i = 0; i < livingcowboys.length; i++) {
                livingcowboys[i].rotation = game.physics.arcade.accelerateToObject(livingcowboys[i], player, 150, 150, 150);
            }

            //Spawn asteroids  
            if (nextAsteroidAt < game.time.now) {
                nextAsteroidAt = game.time.now + asteroidDelay;
                var asteroid = asteroids.getFirstExists(false);
                var randLocation = game.rnd.integerInRange(0, 5);

                
                // spawn at a random location                 
                if (randLocation == 1) {        //Spawn at a random location above
                    asteroid.reset(game.rnd.integerInRange(15, 1280), 0);
                    asteroid.angle = game.rnd.integerInRange(0, 180);
                }
                else if (randLocation == 2) {        //Spawn at a random location to the left
                    asteroid.reset(0, game.rnd.integerInRange(15, 789));
                    asteroid.angle = game.rnd.integerInRange(-90, 90);
                }
                else if (randLocation == 3) {        //Spawn at a random location to the bottom
                    asteroid.reset(game.rnd.integerInRange(15, 1280), 785);
                    asteroid.angle = game.rnd.integerInRange(180, 360);
                }
                else {        //Spawn at a random location to the right
                    asteroid.reset(1280, game.rnd.integerInRange(15, 789));
                    asteroid.angle = game.rnd.integerInRange(90, 270);
                }
                
                asteroid.alive = true;
                asteroid.setHealth(2);
                
                game.physics.arcade.velocityFromRotation(asteroid.rotation, game.rnd.integerInRange(100, 250), asteroid.body.velocity);
            }
            //Planets and stars die offscreen
            if (game.time.now > timer) {
                timer = game.time.now + 1000;
                planetMs.forEachAlive(function (planetM) {
                    planetM.damage(1);
                });

                planetSs.forEachAlive(function (planetS) {
                    planetS.damage(1);
                });

                stars.forEachAlive(function (star) {
                    star.damage(1);
                });

            }
            //Spawn medium sized planets
            if (nextplanetMAt < game.time.now) {
                planetMDelay = game.rnd.integerInRange(15000, 20000);
                nextplanetMAt = game.time.now + planetMDelay;
                var planetM = planetMs.getFirstExists(false);
                
                //Spawn at a random location to the right
                planetM.reset(1280, game.rnd.integerInRange(15, 789));
                planetM.angle = 180;
                planetM.alive = true;
                planetM.setHealth(100);

                planetMs.forEachAlive(function (planetM) {
                    // put every living planetM in an array
                    livingPlanetMs.push(planetM);
                });
                game.physics.arcade.velocityFromRotation(planetM.rotation, game.rnd.integerInRange(25, 50), planetM.body.velocity);
                
            }

            //Spawn small sized planets
            if (nextplanetSAt < game.time.now) {
                planetSDelay = game.rnd.integerInRange(7500, 14000);
                nextplanetSAt = game.time.now + planetSDelay;
                var planetS = planetSs.getFirstExists(false);

                //Spawn at a random location to the right
                planetS.reset(1280, game.rnd.integerInRange(15, 789));
                planetS.angle = 180;
                planetS.alive = true;
                planetS.setHealth(100);

                planetSs.forEachAlive(function (planetS) {
                    // put every living planetS in an array
                    livingplanetSs.push(planetS);
                });
                game.physics.arcade.velocityFromRotation(planetS.rotation, game.rnd.integerInRange(25, 50), planetS.body.velocity);
            }

            //Spawn star
            if (nextstarAt < game.time.now) {
                starDelay = 30000;
                nextstarAt = game.time.now + starDelay;
                var star = stars.getFirstExists(false);

                //Spawn at a random location to the right
                star.reset(1280, game.rnd.integerInRange(15, 789));
                star.angle = 180;
                star.alive = true;
                star.setHealth(100);

                stars.forEachAlive(function (star) {
                    // put every living star in an array
                    livingstars.push(star);
                });
                game.physics.arcade.velocityFromRotation(star.rotation, game.rnd.integerInRange(25, 50), star.body.velocity);

            }

            //The keys to be used in this game
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);
                
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
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                currentSpeed = 300;
            }

            game.physics.arcade.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity);


            if (game.time.now > cowboyShootTimer) {
                cowboyShoot();
            }

            //Update health
            hpText.setText(hp + player.health);
            if (player.health == 100) {
                scoreText.text = scoreString + score;
                gameText.text = "You Won! You're now big enough to brave the outer reaches of space!";
                gameText.visible = true;
            }

            resizePlayer();

            //  Run collisions
            game.physics.arcade.overlap(player, asteroids, collisionAsteroid, null, this);
            game.physics.arcade.overlap(player, planetSs, collisionPlanetS, null, this);
            game.physics.arcade.overlap(player, planetMs, collisionPlanetM, null, this);
            game.physics.arcade.overlap(player, stars, collisionStar, null, this);
            game.physics.arcade.overlap(planetSs, stars, planetSStar, null, this);
            game.physics.arcade.overlap(planetMs, stars, planetMStar, null, this);
            game.physics.arcade.overlap(asteroids, planetSs, collisionAsteroidPlanetS, null, this);
            game.physics.arcade.overlap(asteroids, planetMs, collisionAsteroidPlanetM, null, this);
            game.physics.arcade.overlap(asteroids, stars, collisionAsteroidStar, null, this);
            game.physics.arcade.overlap(planetSs, planetMs, planetCollision, null, this);
            game.physics.arcade.overlap(player, bullets, shotPlayer, null, this);
            game.physics.arcade.overlap(player, cowboys, cowboyPlayer, null, this);
            game.physics.arcade.overlap(stars, bullets, shotStar, null, this);
            game.physics.arcade.overlap(asteroids, bullets, shotAsteroid, null, this);
            game.physics.arcade.overlap(planetMs, bullets, shotPlanetM, null, this);
            game.physics.arcade.overlap(planetSs, bullets, shotPlanetS, null, this);
            game.physics.arcade.overlap(asteroids, cowboys, cowboyAsteroid, null, this);
            game.physics.arcade.overlap(planetMs, cowboys, cowboyPlanetM, null, this);
            game.physics.arcade.overlap(planetSs, cowboys, cowboyPlanetS, null, this);
            game.physics.arcade.overlap(stars, cowboys, cowboyStar, null, this);
                
        
           //  Keep the playerTrail lined up with the ship
          //playerTrail.emitX = player.x;
          //playerTrail.emitY = player.y;
        }
        else {
            //Game over
            //Update health
            hpText.text = hp + player.health;
            var explosion = explosions.getFirstExists(false);
            explosion.reset(player.body.x, player.body.y);
            explosion.play('explosion', 30, false, true);

            gameText.text = "GAME OVER";
            gameText.addColor("#ff0000", 0);
            gameText.visible = true;
        }
    }

    function collisionPlanetS(player, planetS) {
        //Kills planetS and makes the player bigger!
        if (player.health >= 15) {
            planetS.kill();
            player.heal(5);

            //  Increase the score
            score += 50;
            scoreText.text = scoreString + score;

            //planetS explodes on impact         //Adapted from Invaders example
            var explosion = explosions.getFirstExists(false);
            explosion.reset(planetS.x, planetS.y);
            explosion.play('explosion', 30, false, true);
        }
        else {
            player.kill();           

            //player explodes on impact         //Adapted from Invaders example
            var explosion = explosions.getFirstExists(false);
            explosion.reset(player.x, player.y);
            explosion.play('explosion', 30, false, true);
        }
    }

    function planetCollision(planetS, planetM) {
        //Rides the planet's gravity
        planetS.kill();
    }

    //Cowboy player impact
    function cowboyPlayer(player, cowboy) {
        //captures player if too small
        if (player.health < 15) {
            player.kill();
            gameText.text = "Game Over! You have been captured by the cowboys to have your ores harvested :(";
            gameText.addColor("#ff0000", 0);
            gameText.visible = true;
        }
        else {
            cowboy.kill();   //Destroys cowboy if large enough, but still takes damage due to explosive engine.
            player.damage(5);
            //  Increase the score
            score += 50;
            scoreText.text = scoreString + score;
            var explosion = explosions.getFirstExists(false);
            explosion.reset(cowboy.x, cowboy.y);
            explosion.play('explosion', 30, false, true);
        }
    }

    function shotPlayer(player, bullet) {
        //damages player
        bullet.kill();
        player.damage(5);
        var explosion = explosions.getFirstExists(false);
        explosion.reset(bullet.x, bullet.y);
        explosion.play('explosion', 30, false, true);
    }

    function shotAsteroid(asteroid, bullet) {
        bullet.kill();
        asteroid.kill();
        var explosion = explosions.getFirstExists(false);
        explosion.reset(bullet.x, bullet.y);
        explosion.play('explosion', 30, false, true);
    }
    function shotPlanetM(planetM, bullet) {
        bullet.kill();
    }
    function shotPlanetS(planetS, bullet) {
        bullet.kill();
    }
    function shotStar(star, bullet) {
        bullet.kill();
    }

    function cowboyAsteroid(asteroid, cowboy) {
        asteroid.kill();
        cowboy.kill();
        //  Increase the score
        score += 25;
        scoreText.text = scoreString + score;
        var explosion = explosions.getFirstExists(false);
        explosion.reset(cowboy.x, cowboy.y);
        explosion.play('explosion', 30, false, true);
    }

    function cowboyPlanetM(planetM, cowboy) {
        cowboy.kill();
        //  Increase the score
        score += 30;
        scoreText.text = scoreString + score;
        var explosion = explosions.getFirstExists(false);
        explosion.reset(cowboy.x, cowboy.y);
        explosion.play('explosion', 30, false, true);
    }
    function cowboyPlanetS(planetS, cowboy) {
        cowboy.kill();
        //  Increase the score
        score += 40;
        scoreText.text = scoreString + score;
        var explosion = explosions.getFirstExists(false);
        explosion.reset(cowboy.x, cowboy.y);
        explosion.play('explosion', 30, false, true);
    }

    function cowboyStar(star, cowboy) {
        cowboy.kill();
        //  Increase the score
        score += 30;
        scoreText.text = scoreString + score;
        var explosion = explosions.getFirstExists(false);
        explosion.reset(cowboy.x, cowboy.y);
        explosion.play('explosion', 30, false, true);
    }

    function collisionAsteroidPlanetS(asteroid, planetS) {
        //Rides the planet's gravity
         asteroid.rotation = planetS.rotation;
         game.physics.arcade.velocityFromRotation(asteroid.rotation, game.rnd.integerInRange(150, 300), asteroid.body.velocity);
    }

    function collisionAsteroidPlanetM(asteroid, planetM) {
        //Rides the planet's gravity
        asteroid.rotation = planetM.rotation;
        game.physics.arcade.velocityFromRotation(asteroid.rotation, game.rnd.integerInRange(175, 325), asteroid.body.velocity);
    }
    function collisionAsteroidStar(asteroid, star) {
        //gg asteroid
        asteroid.kill();
        var explosion = explosions.getFirstExists(false);
        explosion.reset(asteroid.x, asteroid.y);
        explosion.play('explosion', 30, false, true);
    }

    function collisionPlanetM(player, planetM) {
        //Kills planetM and makes the player bigger!
        if (player.health >= 50) {
            planetM.kill();
            player.heal(10);

            //  Increase the score
            score += 100;
            scoreText.text = scoreString + score;

            //planetM explodes on impact         //Adapted from Invaders example
            var explosion = explosions.getFirstExists(false);
            explosion.reset(planetM.x, planetM.y);
            explosion.play('explosion', 30, false, true);
        }
        else {
            //Player wasn't big enough to survive the impact:(
            player.kill();

            //player explodes on impact         //Adapted from Invaders example
            var explosion = explosions.getFirstExists(false);
            explosion.reset(player.x, player.y);
            explosion.play('explosion', 30, false, true);
        }
    }

    function collisionStar(player, star) {        
            player.kill();

            //player explodes on impact         //Adapted from Invaders example
            var explosion = explosions.getFirstExists(false);
            explosion.reset(player.x, player.y);
            explosion.play('explosion', 30, false, true);
        
    }
    
    function planetSStar(planetS, star) {
        planetS.kill();

        //planetS explodes on impact         //Adapted from Invaders example
        var explosion = explosions.getFirstExists(false);
        explosion.reset(planetS.x, planetS.y);
        explosion.play('explosion', 30, false, true);

    }

    function planetMStar(planetM, star) {
        planetM.kill();

        //planetM explodes on impact         //Adapted from Invaders example
        var explosion = explosions.getFirstExists(false);
        explosion.reset(planetM.x, planetM.y);
        explosion.play('explosion', 30, false, true);

    }

    function resizePlayer() {
        if (player.health >= 95) {
            player.width = 300;
            player.height = 300;
        }
        if (player.health >= 90) {
            player.width = 285;
            player.height = 285;
        }
        else if (player.health >= 85) {
            player.width = 270;
            player.height = 270;
        }
        else if (player.health >= 80) {
            player.width = 255
            player.height = 255;
        }
        else if (player.health >= 75) {
            player.width = 240;
            player.height = 240;
        }
        else if (player.health >= 70) {
            player.width = 225;
            player.height = 225;
        }
        else if (player.health >= 65) {
            player.width = 210;
            player.height = 210;
        }
        else if (player.health >= 60) {
            player.width = 195;
            player.height = 195;
        }
        else if (player.health >= 55) {
            player.width = 180;
            player.height = 180;
        }
        else if (player.health >= 50) {
            player.width = 165;
            player.height = 165;
        }
        else if (player.health >= 45) {
            player.width = 150;
            player.height = 150;
        }
        else if (player.health >= 40) {
            player.width = 135;
            player.height = 135;
        }
        else if (player.health >= 35) {
            player.width = 120;
            player.height = 120;
        }
        else if (player.health >= 30) {
            player.width = 105;
            player.height = 105;
        }
        else if (player.health >= 25) {
            player.width = 90;
            player.height = 90;
        }
        else if (player.health >= 20) {
            player.width = 75;
            player.height = 75;
        }
        else if (player.health >= 15) {
            player.width = 60;
            player.height = 60;
        }
        else if (player.health >= 10) {
            player.width = 45;
            player.height = 45;
        }
        else if (player.health >= 5) {
            player.width = 30;
            player.height = 30;
        }

    }

    function collisionAsteroid(player, asteroid) {
        //Kills asteroid and makes the player bigger!
        asteroid.kill();
        player.heal(1);
        //  Increase the score
        score += 10;
        scoreText.text = scoreString + score;

        //asteroid ship explodes on impact         //Adapted from Invaders example
        var explosion = explosions.getFirstExists(false);
        explosion.reset(asteroid.x, asteroid.y);
        explosion.play('explosion', 30, false, true);
    }

    //Adapted from the space invaders example
    function cowboyShoot() {

        var bullet = bullets.getFirstExists(false);
        //update the cowboy's array before shooting to make sure dead men don't shoot
        livingcowboys.length = 0;
        livingcowboys = [];
        cowboys.forEachAlive(function (cowboy) {
            // put every living enemy in an array
            livingcowboys.push(cowboy);
        });
        if (bullet && livingcowboys.length > 0) {

            var randomcowboy = game.rnd.integerInRange(0, livingcowboys.length - 1);
            var shooter = livingcowboys[randomcowboy];
            // And fire the bullet from this enemy
            bullet.reset(shooter.x , shooter.y);
            bullet.angle = shooter.angle;
            bullet.setHealth(1);
            //game.physics.arcade.velocityFromAngle(bullet.angle, 250, bullet.body.velocity);\

            game.physics.arcade.moveToObject(bullet, player, 265);
            cowboyShootTimer = game.time.now + 1500;
        }
    }
    //function render() {
        //flameEmitter.debug(10, 522);

    //}


};
