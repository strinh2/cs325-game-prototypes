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
        game.load.image('catY', 'assets/cat/catYellow.png');
        game.load.image('catG', 'assets/cat/catGrey.png');
        game.load.image('catB', 'assets/cat/catBlack.png');
        game.load.image('catW', 'assets/cat/catWhite.png');
        game.load.spritesheet('pet', 'assets/spaceship_Spritesheet.png', 50, 60);
        game.load.image('strikes', 'assets/strike.png');
        game.load.image('planetS', 'assets/planetS.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('explosion', 'assets/explosion3.png', 127, 127);
        game.load.image('trash', 'assets/trash.png');
        //game.load.atlasJSONHash('catRight', 'assets/cat/catRight.png', 'assets/cat/catRight.json');
        game.load.spritesheet('catRight', 'assets/cat/catRight.png', 140, 140);
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
    var clientDelay;
    var nextClientAt;
    var clientTimer;
    var clientRush = false;

    //Arrays to hold matching client values
    var description = [];
    var moneys = [];
    var requires = [];
    var colors = [];
    var patterns = [];
    var titles = [];
    var orders = [];
    var stack = [];


    var planetMs;
    var livingPlanetMs = [];
    var nextplanetMAt;
    var planetMDelay;

    //var hp = '';
    

    var profit = 0;
    var totalMoney = 0;
    var profitText;
    var profitString;
    
    var gameOverTime = 30000;
    var startOverTime = true;

    var gameText;
    var stateText;
    var strikeText;

    var strike = 0;
    var strikeSprites;
    var strikeDisplayed = false;

    var gameOver = false;
    var numPokeOrders = 0;
    var pokeWarning = false;
    var policeTimer = 4000;
    var walkTimer = 3000;

    var trashbin;
    function create() {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = "#ADD8E6";
        //background = game.add.tileSprite(0, 0, 1200, 800, 'background');
        

        //Initialize the titles for each client
        titles[0] = "Mr. B Takeshi";
        titles[1] = "Mr. Z Galifianakis";
        titles[2] = "Mr. M Cera";
        titles[3] = "Mr. J Smith";
        titles[4] = "Mr. H Lector";
        titles[5] = "Ms. F Addison";
        titles[6] = "Popo";
        titles[7] = "Mr. A Ketchup";
        titles[8] = "Ms. J Smith";
        titles[9] = "Ms. K Stewart";
        titles[10] = "Ms. M Kasumi";

        //initialize an array to hold all client money values
        moneys[0] = 70000;
        moneys[1] = 0;
        moneys[2] = 30000;
        moneys[3] = 50000;
        moneys[4] = 45000;
        moneys[5] = 30000;
        moneys[6] = "";
        moneys[7] = 75000;
        moneys[8] = 40000;
        moneys[9] = 25000;
        moneys[10] = 70000;

        //initialize an array to hold all client required feature values
        requires[0] = "ADAMANT";
        requires[1] = "FRIENDLY";
        requires[2] = "FRIENDLY";
        requires[3] = "POWDERY";
        requires[4] = "LEAN";
        requires[5] = "TOTALLY NOT A ROBOT";
        requires[6] = "ADAMANT"; //Police
        requires[7] = "ADAMANT";
        requires[8] = "FRIENDLY";
        requires[9] = "SPARKLES IN THE SUN";
        requires[10] = "ADAMANT";

        //initialize an array to hold all of the client descriptions
        description[0] = "I'm looking for a pok-I mean pet \nthat likes to fight, is \n";
        description[1] = "Oh, I don't have any money. Did \nyou know that one is the loneliest \nnumber? My favorite color is\n";
        description[2] = "Hey I heard you could buy frien-err \npets here. I'm looking for \nsomeone ";
        description[3] = "I-i heard you got some pretty nnice \nproduct here. Hook me up with \nsumthin ";
        description[4] = "Good afternoon, I have a refined \npalate and am in search of \nsomething savory, ";
        description[5] = "Apologies for the lack of expression, \nmy face is tired. I'd like something \n";
        description[6] = "I'm with the Police Department and \n need to check your transactions. \nI like ";
        description[7] = "Hey I'm looking for something \nthat likes to fight, is \n ";
        description[8] = "HI I'm-What? We all look the same? \nYou're imagining things. I want \nsomething  ";
        description[9] = "I'm lookin for something that \n";
        description[10] = "Hi, I'd like something that likes \nto fight, is ";

        //initialize an array to hold all client preferred colors
        colors[0] = "white";
        colors[1] = "yellow";
        colors[2] = "grey";
        colors[3] = "black";
        colors[4] = "white";

        //initialize an array to hold all client preferred patterns...not in this iteration :/
        patterns[0] = "clear";
        patterns[1] = "stripes";
        patterns[2] = "spots";
        //patterns[3] = "clear";

        //initialize an array to hold all pet's key sprites.
        keys[0] = "catW";
        keys[1] = "catY";
        keys[2] = "catG";
        keys[3] = "catB";
       // keys[4] = "pet4";
       // keys[5] = "pet5";
         
        //Stack to keep track of the unused clients
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

                

        //game.physics.arcade.enable(client, Phaser.Physics.ARCADE);
        //client.anchor.setTo(0.5, 1);
        //client.tint = 0xff00ff;

        //Drag and Drop!  //Adapted from the html 5 game devs help thread: http://www.html5gamedevs.com/topic/13869-drag-and-drop/
        //player = game.add.sprite(500, 500, 'player');

        //Create the pets 
        pets = game.add.group();
        pets.enableBody = true;
        //pets.physicsBodyType = Phaser.Physics.ARCADE;
        pets.createMultiple(50, 'catW');
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
            // Add animations
            //pet.animations.add('catRight'); No pet animations for this iteration of the game.
            

            //pet.events.onDragStop.add(function (currentSprite) {
           //     stopDrag(currentSprite, clients);
            //}, this);
        });            

        numPets = 0;
        
        strikeSprites = game.add.group();
        strikeSprites.enableBody = true;
        strikeSprites.physicsBodyType = Phaser.Physics.ARCADE;
        strikeSprites.createMultiple(3, 'strikes');
        strikeSprites.setAll('anchor.x', 0.5);
        strikeSprites.setAll('anchor.y', 0.5);
        strikeSprites.setAll('checkWorldBounds', false);

        

        //The trashbin
        trashbin = game.add.sprite(1150, 750, 'trash');
        trashbin.anchor.setTo(0.5, 0.5);
        game.physics.enable(trashbin, Phaser.Physics.ARCADE);
        trashbin.body.collideWorldBounds = false;
        

        



        
        //profitboard   //Adapted from Space Invaders example
        profitString = 'Profit: ';
        profitText = game.add.text(1050, 25, profitString + profit, { font: '42px Arial', fill: '#008000' });
        profitText.anchor.setTo(0.5, 0.5);
        profitText.visible = true;

        //hp = 'Growth: ';
        strikeText = game.add.text(75, 25, 'Strikes: ', { font: '42px Arial', fill: '#ff0000' });
        strikeText.anchor.setTo(0.5, 0.5);
        strikeText.visible = true;

        gameText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '40px Arial', fill: '#FF0000', weight: 'bold' });
        gameText.anchor.setTo(0.5, 0.5);
        gameText.visible = false;

        stateText = game.add.text(game.world.centerX, game.world.centerY - 100, 'GAME OVER!', { font: '64px Arial', fill: '#FF0000', weight: 'bold', align: 'center'});
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;

        addClient();
        addPet();

    }

    
    function update() {
               
            //Give the players more clients at intervals if they're not already maxed for the first 30 seconds //(which is extended with every successful order).
            if ((nextClientAt < game.time.now && game.time.now < gameOverTime) || clientRush) {
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

            //Remove and update the number of clients when one 'leaves'. 
            var i;
            for (i = 0; i < 3; i++) {
                if (currentClients[i] != null && !currentClients[i].alive) {
                    var m;
                    for (m = currentClients[i].children.length - 1; m >= 0; m--) {  //Remove the child texts in reverse because arrays are dynamically allocated.
                        if (currentClients[i].children[m] != null) {
                            currentClients[i].children[m].destroy();
                            //currentClients[i].removeChildAt(m);
                        }
                    }
                    currentClients[i] = null;  //garbage collector should clean up the removed clients (As they should be different every time)
                    numClients--;
                    
                }
            }     
            console.log("NumClients: " + numClients);

        //Give the players more pets at 5 second intervals if they're not already maxed at 15.
            if (nextPetAt < game.time.now) {
                nextPetAt = game.time.now + 1000;
                addPet();
            }

            // Keep pets moving and animated
            /** pets.forEachAlive(function (pet) {
                /**game.physics.arcade.velocityFromRotation(pet.rotation, game.rnd.integerInRange(100, 200), pet.body.velocity);
                if (game.time.now > walkTimer) {
                    walkTimer += 3000;
                    pet.play(('right', 1, false, false));
                }  
                 
            }); **/

            
            //Check if the player has dragged a pet into a client (ie made an order!)
            pets.forEach(function (pet) {                
                pet.events.onDragStop.add(function (pet) {
                    if (!game.physics.arcade.overlap(pet, clients, processOrder)) {
                        pet.position.copyFrom(pet.originalPosition);
                    }
                    if (!game.physics.arcade.overlap(pet, trashbin, releasePet)) {
                        pet.position.copyFrom(pet.originalPosition);
                    }
                }, null, this);
            });

            displayStrikes();

        //update the profit scoreboard, but do it in a satisfying way that players can see
            if (profit != totalMoney) {
                if ((totalMoney - profit) < 501) {
                    profitText.text = profitString + (profit += 50); 
                }
                else if ((totalMoney - profit) < 1001) {
                    profitText.text = profitString + (profit += 250);
                }
                else {
                    profitText.text = profitString + (profit += 1000);
                }                
            }            
        
            //Is the game over by natural causes?
            if ((numClients == 0 && game.time.now > gameOverTime) || strike >= 3) {
                gameOver = true;
                gameText.alpha = 1.0;
                gG();
            }

            if (numClients == 0 && startOverTime) {
                startOverTime = false;
                gameOverTime = game.time.now + gameOverTime + 5000;
            }
            
        //Check if the game is over or if the game is paused by an event and clear up any text
            if (!gameOver && gameText.visible && policeTimer < game.time.now) {
                //if (!gameOver) {                    
                    pets.forEach(function (pet) {
                        pet.input.draggable = true;
                    });
                //}
                gameText.addColor('#FF0000', 0);
                gameText.visible = false;
                gameText.alpha = 1.0;
            }          

            }



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
        if (pet.mystuff.required == client.mystuff.required) {            
            if (pet.mystuff.color == client.mystuff.color) {
                if (pet.mystuff.pattern == client.mystuff.color) {
                    totalMoney += 1000;
                }
                totalMoney += 500;
            }
            totalMoney += client.mystuff.money;
            orders.push(client.mystuff.index); //change back soon
            gameOverTime += 5000; //Add an extra boost to the initial guaranteed survival time

        }
        else if (client.mystuff.index == 6) { //Unless its a police officer who accepts bribes            
            gameText.text = "Oh wow, this little guy is for me? Thanks! In exchange \nlet me remove a strike and speed up any future \ninvestigations a bit~";
            //gameText.addColor('##00008B', 0);
            gameText.alpha = 0.7;
            gameText.visible = true;
            if (policeTimer > 3000) {  //Reduce future police timers capping at 3 seconds.
                policeTimer -= 1000;
            }
            //policeTimer += 3000;
            strike--;  //If the player has any strikes, remove them
            orders.push(client.mystuff.index); //change back soon
            gameOverTime += 5000; //Add an extra boost to the initial guaranteed survival time

        }
        else if (client.mystuff.index == 1) {
            orders.push(client.mystuff.index); 
            gameOverTime += 5000; //Add an extra boost to the initial guaranteed survival time

        }
        else {     //If the order is incorrect
            strike++;
        }
        //orders.push(client.mystuff.index); //always..for testing
        var i;
        for (i = 0; i < orders.length; i++) {
           console.log("Keys currently in orders: " + orders[i]);
        }
        //Clean up the text of the objects before removing them from the game
        var m;
        for (m = client.children.length - 1; m >= 0; m--) { //Always end an order when matched
            if (client.children[m] != null) {
                client.children[m].destroy();
                //client.removeChildAt(m);
            }
        }
        //Also always clean up and end a pet sprite when matched as well
        if (pet.children[0] != null) {
            pet.children[0].destroy();
            //pet.removeChildAt(m);
        }
        numPets--;
        pet.kill();
        client.kill();
        addClient();  //Always add more clients when a match is made. Bad publicity can also garner interest
        addClient();
        //numClients--;
    }

    //Add a client to the game when called.
    function addClient() {
        if(numClients < 3){
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
            
            
            if (stack.length == 0) {   //Reuse customers after they have all appeared
                stack = null;
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
            }

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
            client.mystuff.color = colors[game.rnd.integerInRange(0, colors.length-1)];
            client.mystuff.pattern = patterns[game.rnd.integerInRange(0, patterns.length - 1)];
            client.mystuff.descr = description[indeces];
            client.mystuff.money = moneys[indeces];
            client.mystuff.index = indeces;
            client.mystuff.title = titles[indeces];

            //If a police officer shows up
            if (indeces == 6) {
                callPopo(indeces);
            }
            
            //Add text to the clients. 
            var clientText = game.add.text(14, -28, client.mystuff.descr + client.mystuff.required + " and " + client.mystuff.color, { font: "24px Arial", fill: "#000000", align: "left" });
            client.addChild(clientText);
            //'Likes to Fight asdf kl;jljl lkjlj;lkj\n;kj jkljkl'
            //Print the title in the right spot
            var clientTitle = game.add.text(100, -100, client.mystuff.title, { font: "30px Arial", fill: "#000000", align: "up", weight: "bold" });
            client.addChild(clientTitle);
            //Print the Money value of each client in the right spot
            var clientMoney = game.add.text(290, 80, client.mystuff.money, { font: "26px Arial", fill: "#008000", align: "right", weight: "bold" });
            client.addChild(clientMoney);

            client.alive = true;
            client.setHealth(20);
            numClients++;
        }        
    }

    function callPopo(index) {
        var clientKey = null;
        numPokeOrders = 0;
        if (!game.paused) {
            pets.forEachAlive(function (pet) {
                pet.input.draggable = false;
            });

            gameText.visible = true;
            gameText.text = "This is the Police. We're investigating ";
            policeTimer += game.time.now;

            if (index == 6) { //Personalized text for each investigation
                gameText.text += "an underground animal \nfighting ring and need to see your previous clients.";
            }

            var i;
            for (i = 0; i < orders.length; i++) {
                if (orders[i] == 0 || orders[i] == 7 || orders[i] == 10) {  //Shouldn't have supplied that poke client!                
                    numPokeOrders++;
                    clientKey = titles[orders[i]];
                }
            }
            if (numPokeOrders == 1 && !pokeWarning) {  //If only one criminal in the investigation has been supplied.
                gameText.text += "\n\n\n It appears that you have supplied a criminal once before,  \n" + clientKey + " is part of a vicious fighting ring that has \ninvolved innocent pets. Don't sell pets to fight again. \nThis is your only warning.";
                pokeWarning = true;
            }
            else if (numPokeOrders > 1) {      //Repeat sales to criminals? You're going to jail.                  
                for (i = 0; i < currentClients.length; i++) {
                    if (currentClients[i] != null) {
                        currentClients[i].kill();
                    }
                }
                gameText.text += "\n\n\nYou are under arrest for the crime of repeatedly supplying \nanimals to a vicious fighting ring including: " + clientKey + "\nthat has caused numerous warm, fuzzy animals to \nbe mercilessly beaten into unconsciousness.";
                game.paused = true;
                gameOver = true;
            }
            //Reinitialize the variable for multiple function calls
            numPokeOrders = 0;

            /**if (gameOver) {
                //the "click to restart" handler
                //game.input.onTap.addOnce(restart,this);
                
            }
            else {
                game.paused = false;
            } **/
        }
    }

    //Game over
    function gG() { 
        
        stateText.visible = true;
        
        if (strike == 3) {
            gameText.text = "\n Your license to sell animals has been revoked \n after too many complaints of incorrect orders.";
        }
        else {
            gameText.text = "\n Clients have lost interest in your store so and it's time to close up \n shop. Congrats on your profit of " + profit + " kitty tears!";
        }
        gameText.visible = true;
        game.paused = true;
    }

    function displayStrikes() {
        if (strikeDisplayed) {
            if (strike == 3) {
                strikeSprites.forEachAlive(function (strikeImage) {
                    strikeImage.kill();
                });
                var x;
                for (x = 0; x < 3; x++) {
                    var strikeImage = strikeSprites.getFirstExists(false);
                    strikeImage.reset((175 + (75) * x), 25);
                    strikeImage.anchor.setTo(0.5, 0.5);
                    strikeImage.alpha = 0.9;
                }
            }
            else if (strike == 2) {
                strikeSprites.forEachAlive(function (strikeImage) {
                    strikeImage.kill();
                });
                var x;
                for (x = 0; x < 2; x++) {
                    var strikeImage = strikeSprites.getFirstExists(false);
                    strikeImage.reset((175 + (75) * x), 25);
                    strikeImage.anchor.setTo(0.5, 0.5);
                    strikeImage.alpha = 0.9;
                }
            }
            else if (strike == 1) {
                strikeSprites.forEachAlive(function (strikeImage) {
                    strikeImage.kill();
                });
                var strikeImage = strikeSprites.getFirstExists(false);
                strikeImage.reset(175, 25);
                strikeImage.anchor.setTo(0.5, 0.5);
                strikeImage.alpha = 0.9;
            }
            else {
                strikeSprites.forEachAlive(function (strikeImage) {
                    strikeImage.kill();
                });
                strikeDisplayed = false;
            }
        }
        else { //First time a strike is displayed
            if (strike > 0) {
                var strikeImage = strikeSprites.getFirstExists(false);
                strikeImage.reset(175, 25);
                strikeImage.anchor.setTo(0.5, 0.5);
                strikeImage.alpha = 0.9;
                strikeDisplayed = true;
            }
        }
    }

    //Only render the amount of pets we need (and initialize them)
    function addPet() {
        if (numPets < 15) {
            var pet = pets.getFirstExists(false);
            var rand = game.rnd.integerInRange(0, keys.length-1);
            // spawn at a random location to the right
            //pet.reset(1280, game.rnd.integerInRange(15, 789));
            pet.reset(game.rnd.integerInRange(game.world.centerX, 1100), game.rnd.integerInRange(75, 700));
            pet.loadTexture(keys[rand], 0, false);
            //pet.frame = rand;
            //pet.angle = 180;

            console.log("keys length:" + keys.length);

            //Initialize the pet information.   
            var rand2 = game.rnd.integerInRange(0, requires.length - 1);
            pet.mystuff = {};
            
            pet.mystuff.required = null;
            pet.mystuff.color = null;
            pet.mystuff.pattern = null;
            pet.mystuff.index = null;

            pet.mystuff.required = requires[rand2];
            pet.mystuff.color = colors[rand];
            pet.mystuff.pattern = patterns[rand2];
            pet.mystuff.index = rand2;

            //Add text to the new pets. Adapted from the html5 example: http://www.html5gamedevs.com/topic/7837-how-do-i-align-text-with-a-sprite/
            var petText = game.add.text(0, 0, pet.mystuff.required, { font: "20px Arial", fill: "#ffffff", align: "left" });
            pet.addChild(petText);
            petText.anchor.x = 0.5;
            petText.anchor.y = 0.5;
            petText.x = ((pet.width - petText.width) / 2) + 15;
            petText.y = (pet.height - 100) / 2;

            // put every living pet in an array
            pets.forEachAlive(function (pet) {            
            currentPets.push(pet);
            });
            pet.alive = true;
            numPets++;
        }
    }

    function releasePet(pet, trashbin) {
        //Also always clean up and end a pet sprite when matched as well
        if (pet.children[0] != null) {
            pet.children[0].destroy();
            //pet.removeChildAt(m);
        }
        numPets--;
        pet.kill();
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
