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
        game.load.image('client', 'assets/client.png');
        game.load.image('cowboyBullet', 'assets/cowboyBullet.png');
        game.load.image('asteroid', 'assets/asteroid_mini.png');
        game.load.image('background', 'assets/space_2.jpg');
        game.load.image('blastImage', 'assets/blast2Image.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('laserImage', 'assets/laserImage.png');
        game.load.image('player', 'assets/player.png');
        game.load.image('playerCopy', 'assets/spaceship1.png')
        game.load.image('planetM', 'assets/planet.png');
        game.load.image('planetS', 'assets/planetS.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('explosion', 'assets/explosion3.png', 127, 127);
        game.load.image('blue', 'assets/blue.png');

    }
    
    //Inialize variables

    var size = 0;
    var index = 0;

    var currentSpeed = 0;
    var background;
    var explosions;
    var player;
    var outputText;
    var bullets;
    var timer = 1000;


    var clients;
    var clientText;
    var currentClients = [3];
    var numClients;
    var clientDelay;
    var nextClientAt;
    var clientTimer;
    var planetMs;
    var livingPlanetMs = [];
    var nextplanetMAt;
    var planetMDelay;

    var hp = '';
    var hpText;

    var score = 0;
    var scoreText;
    var scoreString;
    var gameText;


    function create() {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = "#ffffff";
        //background = game.add.tileSprite(0, 0, 1200, 800, 'background');


    
        //Create the clients. 
        clients = game.add.group();
        clients.enableBody = true;
        clients.physicsBodyType = Phaser.Physics.ARCADE;
        clients.createMultiple(50, 'client');
        clients.setAll('anchor.x', 0.0);
        clients.setAll('anchor.y', 0.5);
        clients.setAll('checkWorldBounds', false);
        nextClientAt = 5000;                      
        clientDelay = 10000;
        clientTimer = 1000;

        var i;
        for (i = 0; i < 3; i++) {
            currentClients[i] = null;
        }
        numClients = 0;
        addClient();        
        //game.physics.arcade.enable(client, Phaser.Physics.ARCADE);
        //client.anchor.setTo(0.5, 1);
        //client.tint = 0xff00ff;

        //Drag and Drop!  //Adapted from the html 5 game devs help thread: http://www.html5gamedevs.com/topic/13869-drag-and-drop/
        //player = game.add.sprite(500, 500, 'player');
        /**player.anchor.x = 0.5;
        game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
        player.width = 150;
        player.height = 150;
        player.inputEnabled = true;
        player.input.enableDrag();
        player.originalPosition = player.position.clone();
        player.events.onDragStop.add(function(currentSprite){
            stopDrag(currentSprite, clients);
        }, this);
    **/
   
  

        //The player
        /**player = game.add.sprite(250, 500, 'player');
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.allowRotation = true;
        player.alive = true;
        player.setHealth(5);
        player.width = 50;
        player.height = 50;
        **/




        



        
        //Scoreboard   //Adapted from Space Invaders example
        scoreString = 'Score: ';
        scoreText = game.add.text(1050, 25, scoreString + score, { font: '42px Arial', fill: '#fff' });
        scoreText.anchor.setTo(0.5, 0.5);
        scoreText.visible = true;

        hp = 'Growth: ';
        hpText = game.add.text(10, 10, hp, { font: '42px Arial', fill: '#00ffff' });
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
               

            /**Spawn cowboys  //Adapted from the tutorial: https://leanpub.com/html5shootemupinanafternoon/read#leanpub-auto-enemy-sprite-group
            if (nextcowboyAt < game.time.now && cowboys.countDead() >= 0) {
                nextcowboyAt = game.time.now + game.rnd.integerInRange(7500, 20000);
                var cowboy = cowboys.getFirstExists(false);

                // spawn at a random location to the right
                cowboy.reset(1280, game.rnd.integerInRange(15, 789));
                cowboy.angle = game.rnd.integerInRange(90, 270);
                //Add text to the new pets. Adapted from the html5 example: http://www.html5gamedevs.com/topic/7837-how-do-i-align-text-with-a-sprite/
                var cowboyText = game.add.text(0, 0, 'Likes to Fight', { font: "30px Arial", fill: "#ffffff", align: "left" });
                cowboy.addChild(cowboyText);
                cowboyText.x = (cowboy.width - cowboyText.width) / 2;
                cowboyText.y = (cowboy.height - cowboyText.height) / 2;
                //cowboys.forEachAlive(function (cowboy) {
                    // put every living cowboy in an array
                    livingcowboys.push(cowboy);
                //});
                cowboy.alive = true;
            }
            **/


            //Give the players more clients at 10 second intervals if they're not already maxed.
            if (nextClientAt < game.time.now) {
                nextClientAt = game.time.now + clientDelay;
                addClient();
            }
          
            //Clients get impatient and leave after 15 seconds of not being served!
            if (clientTimer < game.time.now) {
                clientTimer = game.time.now + 1000;
                clients.forEachAlive(function (client) {
                    client.damage(1);
                });
            }

            //Remove and update the number of clients when one 'leaves'
            var i;
            for (i = 0; i < 3; i++) {
                if (currentClients[i] != null && !currentClients[i].alive) {
                    currentClients[i] = null;
                    numClients--;
                }
            }
            



            //The keys to be used in this game
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);
                
            //Adapted from tutorial http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-2/
            //Read in user inputs, just in case somebody plays this.
            /**if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
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
            **/



            //Update health
            /**hpText.setText(hp + player.health);
            if (player.health == 100) {
                scoreText.text = scoreString + score;
                gameText.text = "You Won! You're now big enough to brave the outer reaches of space!";
                gameText.visible = true;
                **/
            }


            //var accelerateTrue = false;
            //Gravity between player and small planets
                //planetSs.forEachAlive(function (planetS) {
                   // if (game.physics.arcade.distanceBetween(player, planetS) <= 300) {
                      //  accelerateTrue;
                      //  player.rotation = planetS.rotation;
                      //  game.physics.arcade.accelerateToObject(player, planetS, 100);
                   // }
               // });

            //  Run collisions
           /* game.physics.arcade.overlap(player, asteroids, collisionAsteroid, null, this);
            game.physics.arcade.overlap(player, planetSs, collisionPlanetS, null, this);
            game.physics.arcade.overlap(player, planetMs, collisionPlanetM, null, this);
            game.physics.arcade.overlap(player, stars, collisionStar, null, this);
            game.physics.arcade.overlap(planetSs, stars, planetSStar, null, this);
            game.physics.arcade.overlap(planetMs, stars, planetMStar, null, this);
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
           */     
        
        /**
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
    **/

    //Adapted from the html5 helpthread example: http://www.html5gamedevs.com/topic/13869-drag-and-drop/
    function stopDrag(currentSprite, endSprite){
        if (!game.physics.arcade.overlap(currentSprite, endSprite, function() {
        currentSprite.input.draggable = false;
        currentSprite.position.copyFrom(endSprite.position); 
        currentSprite.anchor.setTo(endSprite.anchor.x, endSprite.anchor.y); 
        })) { currentSprite.position.copyFrom(currentSprite.originalPosition);
        }
    }

    //Add a client to the game when called.
    function addClient() {
        if(numClients < 3){
            var client = clients.getFirstExists(false);

            // spawn at an open client spot
            if (currentClients[0] == null) {
                client.reset(100, 200);
                currentClients[0] = client;
                //Add text to the clients. 
                var clientText = game.add.text(0, 0, 'Likes to Fight asdf kl;jljl lkjlj;lkj\n;kj jkljkl', { font: "30px Arial", fill: "#000000", align: "left" });
                client.addChild(clientText);
                client.alive = true;
                client.setHealth(15);
                numClients++;
            }
            else if(currentClients[1] == null){
                client.reset(100, 400);
                currentClients[1] = client;
                //Add text to the clients. 
                var clientText = game.add.text(0, 0, 'Likes to Fight 2', { font: "30px Arial", fill: "#000000", align: "left" });
                client.addChild(clientText);
                client.alive = true;
                client.setHealth(15);
                numClients++;
            }
            else if(currentClients[2] == null){
                client.reset(100, 600);
                currentClients[2] = client;
                //Add text to the clients. 
                var clientText = game.add.text(0, 0, 'Likes to Fight 3', { font: "30px Arial", fill: "#000000", align: "left" });
                client.addChild(clientText);
                client.alive = true;
                client.setHealth(15);
                numClients++;
                
            }
        }
    }

    /**
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
        player.heal(2);
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

    **/
};
