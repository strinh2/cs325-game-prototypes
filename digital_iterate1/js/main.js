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
        game.load.image('asteroid', 'assets/asteroid_mini.png');
        game.load.image('background', 'assets/space_2.jpg');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('player', 'assets/player.png');
        game.load.image('pet0', 'assets/spaceship1.png');
        game.load.image('pet1', 'assets/spaceship1_lowHealth.png');
        game.load.spritesheet('pet', 'assets/spaceship_Spritesheet.png', 50, 60);
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
    var pets;
    var nextPetAt;
    var petDelay;
    var petTimer;
    var numPets;
    var currentPets = [];
    var keys = [];

    var clients;
    var clientText;
    var currentClients = [3];
    var numClients;
    var numNewClients;
    var clientDelay;
    var nextClientAt;
    var clientTimer;

    //Arrays to hold matching client values
    var description = [];
    var moneys = [];
    var requires = [];
    var colors = [];
    var patterns = [];
    var titles = [];
    var orders = [];
    var stack= [];

    var planetMs;
    var livingPlanetMs = [];
    var nextplanetMAt;
    var planetMDelay;

    var hp = '';
    var hpText;

    var profit = 0;
    var totalMoney = 0;
    var profitText;
    var profitString;
    var gameText;
    var strike = 0;

    var gameOver = false;
    var numPokeOrders = 0;
    function create() {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = "#ADD8E6";
        //background = game.add.tileSprite(0, 0, 1200, 800, 'background');

        //initialize an array to hold all of the client descriptions
        description[0] = "0 for ground zero";
        description[1] = "but the loneliest number is the\n number 1";
        description[2] = "2 can be as bad as one";
        description[3] = "3 for third wheel";
        description[4] = "too dank 4me";
        description[5] = "5head";
        description[6] = "We have an undergoing investigation\n and need to see your client history.";
        description[7] = "Hey I'm looking for something \nyellow, striped, likes to fight and can generate \nelectricity!";

        //Initialize the titles for each client
        titles[0] = "Zero the Hero";
        titles[1] = "First the worst";
        titles[2] = "Second the Best";
        titles[3] = "Third the one with the hairy chest";
        titles[4] = "Fourth the one with the wedding dress";
        titles[5] = "Fifth..who has five kids anyway";
        titles[6] = "Popo";
        titles[7] = "Mr. A. Ketchup";


        //initialize an array to hold all client money values
        moneys[0] = 1000;
        moneys[1] = 10000;
        moneys[2] = 20000;
        moneys[3] = 30000;
        moneys[4] = 40000;
        moneys[5] = 50000;
        moneys[6] = 1;
        moneys[7] = 75000;

        //initialize an array to hold all client required features values
        requires[0] = "0 likes to fight";
        requires[1] = "1 likes to fight";
        requires[2] = "2 likes to fight";
        requires[3] = "3 likes to fight";
        requires[4] = "4 likes to fight";
        requires[5] = "5 likes to fight";
        requires[6] = "Not funtime handcuffs";
        requires[7] = "Likes to fight";

        //initialize an array to hold all client preferred colors
        colors[0] = "0 white";
        colors[1] = "1 yellow";
        colors[2] = "2 grey";
        colors[3] = "3 black";
        colors[4] = "4 white";
        colors[5] = "5 yellow";
        colors[6] = "black and blue";
        colors[7] = "yellow";

        //initialize an array to hold all client preferred patterns
        patterns[0] = "0 clear";
        patterns[1] = "1 spot";
        patterns[2] = "2 stripes";
        patterns[3] = "3 clear";
        patterns[4] = "4 spots";
        patterns[5] = "5 stripes";
        patterns[6] = "bruises";
        patterns[7] = "stripes";

        //initialize an array to hold all pet's key sprites.
        keys[0] = "pet0";
        keys[1] = "pet1";
       // keys[2] = "pet2";
       // keys[3] = "pet3";
       // keys[4] = "pet4";
       // keys[5] = "pet5";
         
        //Stack to keep track of the unused orders
        stack = [description.length];
        var k;
        for (k = 0; k < description.length; k++) {
            stack[k] = null;
        }
        var n;
        for (n = 0; n < description.length; n++) {
            var rand = game.rnd.integerInRange(0, description.length - 1);
            while (stack[rand] != null) {
                rand = game.rnd.integerInRange(0, description.length - 1);
            }
            stack[rand] = n;
        }
        
        console.log("stack order");
        var v;
        for (v = 0; v < stack.length; v++) {
            console.log(stack[v]);
        }

        //Create the clients. 
        clients = game.add.group();
        clients.enableBody = true;
        clients.physicsBodyType = Phaser.Physics.ARCADE;
        clients.createMultiple(50, 'client');
        clients.setAll('anchor.x', 0.0);
        clients.setAll('anchor.y', 0.5);
        clients.setAll('checkWorldBounds', false);
        nextClientAt = 5000;                      
        clientDelay = 5000;
        clientTimer = 1000;

        var i;
        for (i = 0; i < 3; i++) {
            currentClients[i] = null;
        }
        numClients = 0;
        numNewClients = description.length;   

                

        //game.physics.arcade.enable(client, Phaser.Physics.ARCADE);
        //client.anchor.setTo(0.5, 1);
        //client.tint = 0xff00ff;

        //Drag and Drop!  //Adapted from the html 5 game devs help thread: http://www.html5gamedevs.com/topic/13869-drag-and-drop/
        //player = game.add.sprite(500, 500, 'player');

        //Create the pets 
        pets = game.add.group();
        pets.enableBody = true;
        //pets.physicsBodyType = Phaser.Physics.ARCADE;
        pets.createMultiple(50, 'pet1');
        pets.setAll('anchor.x', 0.5);
        pets.setAll('anchor.y', 0.5);
        pets.setAll('checkWorldBounds', false);
        nextPetAt = 5000;
        petDelay = 5000;
        petTimer = 1000;

        //pet.anchor.x = 0.5;
        //game.physics.arcade.enable(pet, Phaser.Physics.ARCADE);
        //pet.width = 150;
        //pet.height = 150;
        pets.forEach(function (pet) {
            //pet.frame = 0;
            game.physics.arcade.enable(pet);
            pet.anchor.x = 0.5;
            pet.inputEnabled = true;
            pet.input.enableDrag();
            pet.originalPosition = pet.position;
            //pet.events.onDragStop.add(function (currentSprite) {
           //     stopDrag(currentSprite, clients);
            //}, this);
        });            

        numPets = 0;
        

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

        



        
        //profitboard   //Adapted from Space Invaders example
        profitString = 'profit: ';
        profitText = game.add.text(1050, 25, profitString + profit, { font: '42px Arial', fill: '#fff' });
        profitText.anchor.setTo(0.5, 0.5);
        profitText.visible = true;

        hp = 'Growth: ';
        hpText = game.add.text(10, 10, hp, { font: '42px Arial', fill: '#00ffff' });
        hpText.visible = true;

        gameText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '32px Arial', fill: '#000000' });
        gameText.anchor.setTo(0.5, 0.5);
        gameText.visible = false;

        addClient();
        addPet();
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
               
            //Give the players more clients at intervals if they're not already maxed for the first 30 seconds.
            if (nextClientAt < game.time.now) {
                nextClientAt = game.time.now + 2000;
                addClient();
            }
          
            //Clients get impatient and leave after 15 seconds of not being served!
            if (clientTimer < game.time.now) {
                clientTimer = game.time.now + 1000;
                clients.forEachAlive(function (client) {
                    client.damage(2);
                });
            }

            //Remove and update the number of clients when one 'leaves'. No returning customers in this iteration.
            var i;
            for (i = 0; i < 3; i++) {
                if (currentClients[i] != null && !currentClients[i].alive) {
                    if (currentClients[i].children[0] != null) {
                        currentClients[i].children[0].destroy();
                    }
                    currentClients[i].removeChild(clientText);
                    currentClients[i] = null;  //garbage collector should clean up the removed clients
                    numClients--;
                }
            }     

        //Give the players more pets at 5 second intervals if they're not already maxed at 15.
            if (nextPetAt < game.time.now) {
                nextPetAt = game.time.now + 1000;
                addPet();
            }

            // move pets
            pets.forEachAlive(function (pet) {
                game.physics.arcade.velocityFromRotation(pet.rotation, game.rnd.integerInRange(100, 200), pet.body.velocity);
            });


            //Check if the player has dragged a pet into a client (ie made an order!)
            pets.forEach(function (pet) {                
                pet.events.onDragStop.add(function (pet) {
                    if (!game.physics.arcade.overlap(pet, clients, processOrder)) {
                        pet.position.copyFrom(pet.originalPosition);
                    }
                }, null, this);
            });

        //update the profit scoreboard, but do it in a satisfying way that players can see
            if (profit != totalMoney) {
                if ((totalMoney - profit) < 501) {
                    profitText.text = profitString + (profit += 25); 
                }
                else if ((totalMoney - profit) < 1001) {
                    profitText.text = profitString + (profit += 250);
                }
                else {
                    profitText.text = profitString + (profit += 500);
                }
                
            }              




            //Update health
            /**hpText.setText(hp + player.health);
            if (player.health == 100) {
                profitText.text = profitString + profit;
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
        currentSprite.x = endSprite.x;
        currentSprite.y = endSprite.y;
        currentSprite.anchor.setTo(endSprite.anchor.x, endSprite.anchor.y); 
        })) { currentSprite.position.copyFrom(currentSprite.originalPosition);
        }
    }

    function processOrder(pet, client) {
        //If the order matches
        if (pet.mystuff.required = client.mystuff.required) {
            if (pet.mystuff.color = client.mystuff.color) {
                if (pet.mystuff.pattern = client.mystuff.color) {
                    totalMoney += 1000;
                }
                totalMoney += 500;
            }
            totalMoney += client.mystuff.money;
            //orders.push(client.mystuff.index); 5 NOW
            client.children[0].destroy();
            client.removeChild(clientText);
        }
        else {     //If the order is incorrect!
            strike++;
        }
        orders.push(client.mystuff.index); //always..for testing
        var i;
        for (i = 0; i < orders.length; i++) {
           console.log("Keys currently in orders: " + orders[i]);
        }
        
        pet.kill();
        client.kill();
    }

    //Add a client to the game when called.
    function addClient() {
        if(numClients < 3 && numNewClients > 0){
            var client = clients.getFirstExists(false);

            // spawn at an open client spot
            if (currentClients[0] == null) {
                client.reset(0, 175);
                currentClients[0] = client;
            }
            else if(currentClients[1] == null){
                client.reset(0, 425);
                currentClients[1] = client;
            }
            else if(currentClients[2] == null){
                client.reset(0, 675);
                currentClients[2] = client;                
            }
            //Initialize the client information.
            var indeces = stack.pop();

            client.mystuff = {};

            client.mystuff.required = null;
            client.mystuff.color = null;
            client.mystuff.pattern = null;
            client.mystuff.descr = null;
            client.mystuff.money = null;
            client.mystuff.index = null;
            client.mystuff.title = null;

            client.mystuff.required = requires[indeces];
            client.mystuff.color = colors[indeces];
            client.mystuff.pattern = patterns[indeces];
            client.mystuff.descr = description[indeces];
            client.mystuff.money = moneys[indeces];
            client.mystuff.index = indeces;
            client.mystuff.title = titles[indeces];

            //If a police office shows up
            if (indeces == 6) {
                callPopo();
            }
            
            //Add text to the clients. 
            var clientText = game.add.text(0, 0, client.mystuff.descr, { font: "24px Arial", fill: "#000000", align: "left" });
            client.addChild(clientText);
            //'Likes to Fight asdf kl;jljl lkjlj;lkj\n;kj jkljkl'
            client.alive = true;
            client.setHealth(15);
            numClients++;
            numNewClients--;
        }        
    }

    function callPopo() {
        game.paused = true;  
        
        var i;
        for (i = 0; i < orders.length; i++) {
            if (orders[i] == 0 || orders[i] == 7) {  //Shouldn't have supplied that poke client!                
                numPokeOrders++;
            }
            
        }

        if (numPokeOrders > 1) {
            gameText.visible = true;
            gameText.text = "Hold up, we're investigating an underground animal fighting ring and need \n to see your previous clients.";
            gameText.text += "\n\n\nYou have been arrested for the crime of repeatedly supplying \nanimals to a vicious fighting ring that has resulted in numerous cute fuzzy \nanimals being rendered 'unconscious'";
            
            gameOver = true;            
        }

        if (gameOver) {
            //the "click to restart" handler
            //game.input.onTap.addOnce(restart,this);
        }
        else {

            game.paused = false;
        }
    }

    //Only render the amount of pets we need (and initialize them)
    function addPet() {
        if (numPets < 15 && numNewClients > 0) {
            var pet = pets.getFirstExists(false);
            var rand = game.rnd.integerInRange(0, keys.length-1);
            // spawn at a random location to the right
            pet.reset(1280, game.rnd.integerInRange(15, 789));
            pet.loadTexture(keys[rand], 0, false);
            //pet.frame = rand;
            pet.angle = 180;

            console.log("keys length:" + keys.length);

            //Initialize the pet information.        
            pet.mystuff = {};
            
            pet.mystuff.required = null;
            pet.mystuff.color = null;
            pet.mystuff.pattern = null;
            pet.mystuff.index = null;

            pet.mystuff.required = requires[rand];
            pet.mystuff.color = colors[rand];
            pet.mystuff.pattern = patterns[rand];
            pet.mystuff.index = rand;

            //Add text to the new pets. Adapted from the html5 example: http://www.html5gamedevs.com/topic/7837-how-do-i-align-text-with-a-sprite/
            var petText = game.add.text(0, 0, pet.mystuff.required, { font: "20px Arial", fill: "#ffffff", align: "left" });
            pet.addChild(petText);
            petText.x = (pet.width - petText.width) / 2;
            petText.y = (pet.height - petText.height) / 2;

            // put every living pet in an array
            pets.forEachAlive(function (pet) {            
            currentPets.push(pet);
            });
            pet.alive = true;
            numPets++;
        }
    }
    //Adapted from the invaders example
    /**function restart() {
        //Resets the game
        //resets the life count
        lives.callAll('revive');
        //  And brings the aliens back from the dead :)
        aliens.removeAll();
        createAliens();

        //revives the player
        player.revive();
        //hides the text
        stateText.visible = false;
    }
    **/
};
