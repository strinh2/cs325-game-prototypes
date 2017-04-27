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
    
    var game = new Phaser.Game( 1000, 765, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    

    function preload() {
        // Load the assets to be used in game.
        game.load.image('background', 'assets/game3.png');
        game.load.image('background2', 'assets/background2.jpg');
        game.load.image('tv', 'assets/tv.png');
        game.load.image('bat', 'assets/bat.png');
        game.load.image('stove', 'assets/stove.png');
        game.load.image('outlet', 'assets/outlet.png');
        game.load.image('door', 'assets/door.png');
        game.load.image('window', 'assets/window.png');
        game.load.image('knife', 'assets/knife.png');
        game.load.image('floor', 'assets/floor.png');
        game.load.image('person', 'assets/person.png');
        game.load.image('plant', 'assets/plant.png');
        game.load.audio('clock1', 'assets/sfx/clock1.mp3');
        game.load.audio('clock2', 'assets/sfx/clock2.mp3');
        game.load.audio('staticSFX', 'assets/sfx/static.mp3');
        game.load.audio('smash', 'assets/sfx/smash.mp3');
        game.load.audio('plantSmash', 'assets/sfx/plantSmash.mp3');
        game.load.audio('gas', 'assets/sfx/gas.mp3');
        game.load.audio('electric', 'assets/sfx/electric.mp3');
        game.load.audio('knock', 'assets/sfx/knock.mp3');
        game.load.audio('wind', 'assets/sfx/window.mp3');
        game.load.audio('footstep', 'assets/sfx/footstep.mp3');
        game.load.audio('stab', 'assets/sfx/knife.mp3');
    }
    
    //Inialize variables
    var background;

    var gp = 0;
    var gpText;
    var gpString;
    var delay = 1000;

    var gameText;
    var stateText;
    var statusText;
    var statusAlpha;

    var timer = 45;
    var timerText;
    var timerString;
    var clock1;
    var clock2;
    var playClock1;
    var gameEndDelay = 3000;

    var victory = false;
    var bestEnding = false;
    var badEnding = false;
    var neutralEnding = false;

    var tv;
    var tvText;
    var tvHasBeenClicked = false;
    var bat;
    var batText;
    var plant;
    var plantText;
    var plantHasBeenClicked = false;
    var stove;
    var stoveText;
    var stoveHasBeenClicked = false;
    var stoveSet = false;
    var outlet;
    var outletText;
    var door;
    var doorText;
    var doorHasBeenClicked = false;
    var window;
    var windowText;
    var windowHasBeenClicked = false;
    var floor;
    var floorText;
    var floorHasBeenClicked = false;
    var knife;
    var knifeText;
    var person;
    var personText;

    var staticSFX;
    var smash;
    var plantSmash;
    var gas;
    var electric;
    var knock;
    var wind;
    var footstep;
    var stab;

    function create() {
        

        background = game.add.tileSprite(0, 0, 1000, 765, 'background');
        //Start the Arcade Physics systems
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Change the background colour
        game.stage.backgroundColor = "#010160";
        
        tv = game.add.sprite(130, 440, 'tv');
        tv.anchor.setTo(0.5, 0.5);
        game.physics.enable(tv, Phaser.Physics.ARCADE);
        tv.body.collideWorldBounds = true;
        tv.alive = true;
        tv.inputEnabled = true;
        //tv.animations.add('catRight');
        tv.events.onInputDown.add(clickTV, this);

        //Add text to the new tv 
        tvText = game.add.text(0, 0, "TV GP Cost: 2 \nOnly thing I can do is hit a button...", { font: "20px Chiller", fill: "#ffffff", align: "center" });
        tv.addChild(tvText);
        tvText.anchor.x = 0.5;
        tvText.anchor.y = 0.5;
        tvText.x = ((tv.width - tvText.width) / 2) + 30;
        tvText.y = tv.height - 50;
        tvText.alpha = 1.0;
        tvText.visible = false;

        plant = game.add.sprite(290, 156, 'plant');
        plant.anchor.setTo(0.5, 0.5);
        game.physics.enable(plant, Phaser.Physics.ARCADE);
        plant.body.collideWorldBounds = true;
        plant.alive = true;
        plant.body.allowRotation = true;
        plant.inputEnabled = true;
        plant.events.onInputDown.add(clickPlant, this);

        //Add text to the new plants. 
        plantText = game.add.text(0, 0, "Vase GP Cost: 15 \nMaybe this'll distract him", { font: "20px Chiller", fill: "#ffffff", align: "center" });
        plant.addChild(plantText);
        plantText.anchor.x = 0.5;
        plantText.anchor.y = 0.5;
        plantText.x = ((plant.width - plantText.width) / 2) + 40;
        plantText.y = plant.height - 150;
        plantText.alpha = 1.0;
        plantText.visible = false;

        stove = game.add.sprite(965, 404, 'stove');
        stove.anchor.setTo(0.5, 0.5);
        game.physics.enable(stove, Phaser.Physics.ARCADE);
        stove.body.collideWorldBounds = true;
        stove.alive = true;
        stove.body.allowRotation = true;
        stove.inputEnabled = true;
        stove.events.onInputDown.add(clickStove, this);

        //Add text to the new stoves. 
        stoveText = game.add.text(0, 0, "Stove GP Cost: 20 \nMaybe I can make some gas leak..", { font: "20px Chiller", fill: "#ffffff", align: "center" });
        stove.addChild(stoveText);
        stoveText.anchor.x = 0.5;
        stoveText.anchor.y = 0.5;
        stoveText.x = ((stove.width - stoveText.width) / 2) + 35;
        stoveText.y = stove.height + 10;
        stoveText.alpha = 1.0;
        stoveText.visible = false;

        outlet = game.add.sprite(963, 331, 'outlet');
        outlet.anchor.setTo(0.5, 0.5);
        game.physics.enable(outlet, Phaser.Physics.ARCADE);
        outlet.body.collideWorldBounds = true;
        outlet.alive = true;
        outlet.body.allowRotation = true;
        outlet.inputEnabled = true;
        outlet.events.onInputDown.add(clickOutlet, this);

        //Add text to the new outlets. 
        outletText = game.add.text(0, 0, "Outlet: It doesn't seem like there's \nanything I can do with this directly...", { font: "20px Chiller", fill: "#FFFFFF", align: "center" });
        outlet.addChild(outletText);
        outletText.anchor.x = 0.5;
        outletText.anchor.y = 0.5;
        outletText.x = ((outlet.width - outletText.width) / 2) + 30;
        outletText.y = outlet.height - 75;
        outletText.alpha = 1.0;
        outletText.visible = false;

        door = game.add.sprite(646, 338, 'door');
        door.anchor.setTo(0.5, 0.5);
        game.physics.enable(door, Phaser.Physics.ARCADE);
        door.body.collideWorldBounds = true;
        door.alive = true;
        door.body.allowRotation = true;
        door.inputEnabled = true;
        door.events.onInputDown.add(clickDoor, this);

        //Add text to the new doors. 
        doorText = game.add.text(0, 0, "Door GP Cost: 25 \nThis'll definitely distract him", { font: "20px Chiller", fill: "#ffffff", align: "center" });
        door.addChild(doorText);
        doorText.anchor.x = 0.5;
        doorText.anchor.y = 0.5;
        doorText.x = ((door.width - doorText.width) / 2) + 10;
        doorText.y = door.height - 550;
        doorText.alpha = 1.0;
        doorText.visible = false;

        window = game.add.sprite(78, 173, 'window');
        window.anchor.setTo(0.5, 0.5);
        game.physics.enable(window, Phaser.Physics.ARCADE);
        window.body.collideWorldBounds = true;
        window.alive = true;
        window.body.allowRotation = true;
        window.inputEnabled = true;
        window.events.onInputDown.add(clickWindow, this);

        //Add text to the new windows. 
        windowText = game.add.text(0, 0, "Window GP Cost: 20 \nThis might distract him..", { font: "20px Chiller", fill: "#ffffff", align: "center" });
        window.addChild(windowText);
        windowText.anchor.x = 0.5;
        windowText.anchor.y = 0.5;
        windowText.x = window.width - 120;
        windowText.y = window.height - 150;
        windowText.alpha = 1.0;
        windowText.visible = false;

        floor = game.add.sprite(720, 699, 'floor');
        floor.anchor.setTo(0.5, 0.5);
        game.physics.enable(floor, Phaser.Physics.ARCADE);
        floor.body.collideWorldBounds = true;
        floor.alive = true;
        floor.body.allowRotation = true;
        floor.inputEnabled = true;
        floor.events.onInputDown.add(clickFloor, this);

        //Add text to the new floors. 
        floorText = game.add.text(0, 0, "Floor GP Cost: 25 \nThis should distract him..", { font: "24px Chiller", fill: "#000000", align: "center", weight: 'bold' });
        floor.addChild(floorText);
        floorText.anchor.x = 0.5;
        floorText.anchor.y = 0.5;
        floorText.x = ((floor.width - floorText.width) / 2);
        floorText.y = floor.height - 130;
        floorText.alpha = 1.0;
        floorText.visible = false;


        person = game.add.sprite(530, 503, 'person');
        person.anchor.setTo(0.5, 0.5);
        game.physics.enable(person, Phaser.Physics.ARCADE);
        person.body.collideWorldBounds = true;
        person.alive = true;
        person.body.allowRotation = true;
        person.inputEnabled = true;
        person.events.onInputDown.add(clickPerson, this);

        //Add text to the new persons. 
        personText = game.add.text(0, 0, "They're not responding to anything I try...", { font: "20px Chiller", fill: "#ffffff", align: "center" });
        person.addChild(personText);
        personText.anchor.x = 0.5;
        personText.anchor.y = 0.5;
        personText.x = ((person.width - personText.width) / 2) + 30;
        personText.y = person.height - 350;
        personText.alpha = 1.0;
        personText.visible = false;

        bat = game.add.sprite(765, 520, 'bat');
        bat.anchor.setTo(0.5, 0.5);
        game.physics.enable(bat, Phaser.Physics.ARCADE);
        bat.body.collideWorldBounds = true;
        bat.alive = true;
        bat.body.allowRotation = true;
        bat.inputEnabled = true;
        bat.events.onInputDown.add(clickBat, this);
        bat.input.enableDrag();
        bat.originalPosition = bat.position.clone();
        //Draggable Bats
        bat.events.onDragStop.add(function (bat) {
            if (!game.physics.arcade.overlap(bat, tv, smashTV)) {
                bat.position.copyFrom(bat.originalPosition);
            }
        }, null, this);

        bat.events.onDragStop.add(function (bat) {
            if (!game.physics.arcade.overlap(bat, outlet, smashOutlet)) {
                bat.position.copyFrom(bat.originalPosition);
            }
        }, null, this);        
        bat.events.onDragStop.add(function (bat) {
            if (!game.physics.arcade.overlap(bat, person, notLikeThis)) {
                bat.position.copyFrom(bat.originalPosition);
            }
        }, null, this);

        //Add text to the new bat 
        batText = game.add.text(0, 0, "Bat GP Cost: 95 \nMaybe I can drag this somewhere..", { font: "20px Chiller", fill: "#00FFFF", align: "center" });
        bat.addChild(batText);
        batText.anchor.x = 0.5;
        batText.anchor.y = 0.5;
        batText.x = ((bat.width - batText.width) / 2) + 50;
        batText.y = bat.height - 200;
        batText.alpha = 1.0;
        batText.visible = false;

        knife = game.add.sprite(857, 350, 'knife');
        knife.anchor.setTo(0.5, 0.5);
        game.physics.enable(knife, Phaser.Physics.ARCADE);
        knife.body.collideWorldBounds = true;
        knife.alive = true;
        knife.body.allowRotation = true;
        knife.inputEnabled = true;
        knife.events.onInputDown.add(clickKnife, this);
        knife.input.enableDrag();
        knife.originalPosition = knife.position.clone();
        //Draggable knives
        knife.events.onDragStop.add(function (knife) {
            if (!game.physics.arcade.overlap(knife, outlet, smashOutlet)) {
                knife.position.copyFrom(knife.originalPosition);
            }
        }, null, this);

        knife.events.onDragStop.add(function (knife) {
            if (!game.physics.arcade.overlap(knife, person, notLikeThis)) {
                knife.position.copyFrom(knife.originalPosition);
            }
        }, null, this);

        //Add text to the new knife 
        knifeText = game.add.text(0, 0, "Knife GP Cost: 25 \nIt'd take a lot of effort to throw this...", { font: "20px Chiller", fill: "#00FFFF", align: "center" });
        knife.addChild(knifeText);
        knifeText.anchor.x = 0.5;
        knifeText.anchor.y = 0.5;
        knifeText.x = ((knife.width - knifeText.width) / 2) + 30;
        knifeText.y = knife.height - 25;
        knifeText.alpha = 1.0;
        knifeText.visible = false;        


        playClock1 = true;
        clock1 = game.add.audio('clock1');
        clock2 = game.add.audio('clock2');
        staticSFX = game.add.audio('staticSFX');
        smash = game.add.audio('smash');
        plantSmash = game.add.audio('plantSmash');
        gas = game.add.audio('gas');
        electric = game.add.audio('electric');
        knock = game.add.audio('knock');
        wind = game.add.audio('wind');
        footstep = game.add.audio('footstep');
        stab = game.add.audio('stab');

        gpString = "Ghost Points: ";
        gpText = game.add.text(125, 25, gpString + gp, { font: '42px Chiller', fill: '#fff' });
        gpText.anchor.setTo(0.5, 0.5);
        gpText.visible = true;
        gpText.alpha = 1;

        timerString = "Time Remaining: ";
        timerText = game.add.text(game.world.centerX - 60, 35, timerString + timer, { font: '64px Chiller', fill: '#ff0000' });
        timerText.anchor.setTo(0.5, 0.5);
        timerText.visible = true;

        gameText = game.add.text(game.world.centerX, game.world.centerY - 200, ' ', { font: '96px Chiller', fill: '#ff0000' });
        gameText.anchor.setTo(0.5, 0.5);
        gameText.visible = false;

        stateText = game.add.text(game.world.centerX, game.world.centerY + 100, ' ', { font: '50px Chiller', fill: '#fff' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;
        
        statusText = game.add.text(815, 25, "Status: ", { font: '42px Chiller', fill: '#00FFFF' });
        statusText.anchor.setTo(0.5, 0.5);
        statusText.visible = true;
        statusText.alpha = 1;        
    }
    
    function update() {
        //Update values every second and play the appropriate clock sfx
        if (game.time.now > delay) {
            delay = game.time.now + 1000;
            gp++;
            timer--;
            gpText.setText(gpString + gp);
            timerText.setText(timerString + timer);
            if (playClock1) {
                clock1.play();
                playClock1 = false;
            }
            else {
                clock2.play();
                playClock1 = true;
            }
        }
        //Draggable Bats
        bat.events.onDragStop.add(function (bat) {
            if (!game.physics.arcade.overlap(bat, tv, smashTV)) {
                bat.position.copyFrom(bat.originalPosition);
            }
        }, null, this);
        

        //Update tv to match the timer
        if (timer <= 10) {
            //tv.frame = 3;
        }
        else if (timer <= 25) {            
            //tv.frame = 2;
        }
        else if (timer > 25) {            
            //tv.frame = 1;
        }

        //Check for game over
        if (timer <= 0) {
            gameOver();
        }

        if (victory && game.time.now > gameEndDelay) {
            gameWon();
        }
    }

    //If the player has won
    function gameWon() {
        //Clean up the screen
        background = game.add.tileSprite(0, 0, 1000, 765, 'background2');
        game.paused = true;
        tv.kill();
        bat.kill();
        stove.kill();
        outlet.kill();
        door.kill();
        window.kill();
        knife.kill();
        floor.kill();
        plant.kill();
        statusText = game.add.text(850, 25, "Status: ", { font: '42px Chiller', fill: '#00FFFF' });
        statusText.anchor.setTo(0.5, 0.5);
        statusText.visible = true;
        statusText.alpha = 0.8;
        timerString = "Time Remaining: ";
        timerText = game.add.text(game.world.centerX , 35, timerString + timer, { font: '64px Chiller', fill: '#ff0000' });
        timerText.anchor.setTo(0.5, 0.5);
        timerText.visible = true;
        gpString = "Ghost Points: ";
        gpText = game.add.text(125, 25, gpString + gp, { font: '42px Chiller', fill: '#fff' });
        gpText.anchor.setTo(0.5, 0.5);
        gpText.visible = true;
        gpText.alpha = 0.8;
        

        if (bestEnding) {
            gameText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Congratulations!', { font: '96px Chiller', fill: '#00FFFF' });
            gameText.anchor.setTo(0.5, 0.5);
            gameText.visible = true;
            var str = "Noticing the fire, your loved frantically \nescaped. Due to the unfortunate accident \nnothing could not be salavaged from the house, \nand your friends and family will never know the truth \nabout what really happened that night. \nThey will remember you as a gentle parent, a \ncaring spouse, and a considerate friend.";
            stateText = game.add.text(game.world.centerX + 50, game.world.centerY + 100, str, { font: '50px Chiller', fill: '#fff' });
            stateText.anchor.setTo(0.5, 0.5);
            stateText.visible = true;
        }
        else if (neutralEnding) {
            smash.play();
            gameText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Congratulations', { font: '96px Chiller', fill: '#fff' });
            gameText.anchor.setTo(0.5, 0.5);
            gameText.visible = true;
            var str = "Your loved one fled the house in fear, and \n when they returned in the morning they \nfound the television to be damaged beyond repair. \nWhile they will never know the truth of what really \nhappened on either of those fateful nights, \nwhen asked they speak of you fondly. However\n they never did visit you again...";
            stateText = game.add.text(game.world.centerX + 50, game.world.centerY + 100, str, { font: '50px Chiller', fill: '#fff' });
            stateText.anchor.setTo(0.5, 0.5);
            stateText.visible = true;
        }
        else if (badEnding) {
            gameText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Its Over...', { font: '96px Chiller', fill: '#ff0000' });
            gameText.anchor.setTo(0.5, 0.5);
            gameText.visible = true;
            var str = "It wasn't supposed to end like this, but \n they could never be allowed to know the \nthe truth. No matter the cost. The things that I did \nthat day can never see the light of day, whether I'm\ndead or alive. This will be the last loose end\nand I'll be sure to take care of the evidence\n before morning comes.";
            stateText = game.add.text(game.world.centerX + 50, game.world.centerY + 100, str, { font: '50px Chiller', fill: '#ff0000' });
            stateText.anchor.setTo(0.5, 0.5);
            stateText.visible = true;
        }
    }
    function clickTV(sprite, pointer) {
              
        if (!tvHasBeenClicked) {
            if (gp >= 2) {
                gp += 2;
                //sprite.alpha = 0.5;
                timer += 2;
                tvHasBeenClicked = true;
                statusText.setText("Status: Got it!");
                statusText.alpha = 0.8;
                gpText.setText(gpString + gp);
                timerText.setText(timerString + timer);
                tvText.alpha = 0.8;
            }
            else { //Not enough GP to interact
                gp = 0;
                gpText.setText(gpString + gp);
                statusText.setText("Status: Ughh..not enough GP");
                statusText.alpha = 0.7;
            }
        }
        staticSFX.play();
        staticSFX.volume = 0.2;
        tvText.visible = true;
    }

    function clickBat(sprite, pointer) {
        batText.visible = true;
    }

    function smashTV(bat, tv) {
        if (gp >= 95) {            
            victory = true;
            gameEndDelay = game.time.now + 3000;
            timer += 3;
            neutralEnding = true;
            smash.play();
        }
        else {
            gp = 0;
            bat.position.copyFrom(bat.originalPosition);
            statusText.setText("Status: Ughh..not enough GP");
            statusText.alpha = 0.7;
        }
        batText.visible = true;
    }

    function gameOver() {
        //Clean up the screen
        background = game.add.tileSprite(0, 0, 1000, 765, 'background2');

        game.paused = true;
        tv.kill();
        bat.kill();
        stove.kill();
        outlet.kill();
        door.kill();
        window.kill();
        knife.kill();
        floor.kill();
        plant.kill();
        statusText = game.add.text(850, 25, "Status: ", { font: '42px Chiller', fill: '#00FFFF' });
        statusText.anchor.setTo(0.5, 0.5);
        statusText.visible = true;
        statusText.alpha = 0.8;
        timerString = "Time Remaining: ";
        timerText = game.add.text(game.world.centerX, 35, timerString + timer, { font: '64px Chiller', fill: '#ff0000' });
        timerText.anchor.setTo(0.5, 0.5);
        timerText.visible = true;
        gpString = "Ghost Points: ";
        gpText = game.add.text(125, 25, gpString + gp, { font: '42px Chiller', fill: '#fff' });
        gpText.anchor.setTo(0.5, 0.5);
        gpText.visible = true;
        gpText.alpha = 0.8;
        gameText = game.add.text(game.world.centerX, game.world.centerY - 200, 'GAME OVER', { font: '96px Chiller', fill: '#ff0000' });
        gameText.anchor.setTo(0.5, 0.5);
        gameText.visible = true;
        stateText = game.add.text(game.world.centerX + 50, game.world.centerY, 'YOU HAVE BEEN EXPOSED AND WILL FOREVER \nBE REMEMBERED AS A CRIMINAL', { font: '50px Chiller', fill: '#fff' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = true;
        //stateText.setText("YOU HAVE BEEN EXPOSED AND YOU WILL BE FOREVER \nBE REMEMBERED AS A CRIMINAL");
        //stateText.visible = true;
    }

    function clickPlant(sprite, pointer) {
        if (!plantHasBeenClicked) {
            if (gp >= 15) {
                gp += 10;
                //sprite.alpha = 0.5;
                timer += 3;
                plantHasBeenClicked = true;
                statusText.setText("Status: Got it!");
                statusText.alpha = 0.9;
                gpText.setText(gpString + gp);
                timerText.setText(timerString + timer);
                plantSmash.play();
                plantText.alpha = 0.8;
            }
            else { //Not enough GP to interact
                gp = 0;
                statusText.setText("Status: Ughh..not enough GP");
                statusText.alpha = 0.8;
                gpText.setText(gpString + gp);
            }
        }
        plantText.visible = true;
    }

    function clickStove(sprite, pointer) {
        if (!stoveHasBeenClicked) {
            if (gp >= 25) {
                gp -= 20;
                //sprite.alpha = 0.5;
                stoveHasBeenClicked = true;
                statusText.setText("Status: Got it!");
                statusText.alpha = 0.9;
                gpText.setText(gpString + gp);
                stoveSet = true;
                stoveText.setText("Stove: Gas is leaking...");
                gas.play();
                gas.volume = 0.1;

            }
            else { //Not enough GP to interact
                gp = 0;
                statusText.setText("Status: Ughh..not enough GP");
                statusText.alpha = 0.8;
                gpText.setText(gpString + gp);
            }
        }
        stoveText.visible = true;
    }

    function clickOutlet(sprite, pointer) {        
        outletText.visible = true;
    }

    function clickDoor(sprite, pointer) {
        if (!doorHasBeenClicked) {
            if (gp >= 25) {
                gp += 15;
                //sprite.alpha = 0.5;
                timer += 7;
                doorHasBeenClicked = true;
                statusText.setText("Status: Got it!");
                statusText.alpha = 0.9;
                gpText.setText(gpString + gp);
                timerText.setText(timerString + timer);
                knock.play();
                doorText.alpha = 0.8;
            }
            else { //Not enough GP to interact
                gp = 0;
                statusText.setText("Status: Ughh..not enough GP");
                statusText.alpha = 0.8;
                gpText.setText(gpString + gp);
            }
        }
        doorText.visible = true;
    }

    function clickWindow(sprite, pointer) {
        if (!windowHasBeenClicked) {
            if (gp >= 20) {
                gp += 10;
                //sprite.alpha = 0.5;
                timer += 5;
                windowHasBeenClicked = true;
                statusText.setText("Status: Got it!");
                statusText.alpha = 0.9;
                gpText.setText(gpString + gp);
                timerText.setText(timerString + timer);
                wind.play();
                windowText.alpha = 0.8;
            }
            else { //Not enough GP to interact
                gp = 0;
                statusText.setText("Status: Argh..not enough GP");
                statusText.alpha = 0.8;
                gpText.setText(gpString + gp);
            }
        }
        windowText.visible = true;
    }

    function clickFloor(sprite, pointer) {
        if (!floorHasBeenClicked) {
            if (gp >= 20) {
                gp += 10;
                //sprite.alpha = 0.5;
                timer += 5;
                floorHasBeenClicked = true;
                statusText.setText("Status: Yes! Success");
                statusText.alpha = 0.9;
                gpText.setText(gpString + gp);
                timerText.setText(timerString + timer);
                footstep.play();
                floorText.alpha = 0.8
            }
            else { //Not enough GP to interact
                gp = 0;
                statusText.setText("Status: Argh..not enough GP");
                statusText.alpha = 0.8;
                gpText.setText(gpString + gp);
            }
        }
        floorText.visible = true;
    }

    function clickKnife(sprite, pointer) {
        knifeText.visible = true;
    }

    function smashOutlet(Sprite, outlet) {
        if (gp >= 25 && stoveSet) {
            electric.play();
            victory = true;
            gameEndDelay = game.time.now + 3000;
            timer += 3;
            bestEnding = true;
        }
        else if (gp < 25) {
            gp = 0;
            knife.position.copyFrom(knife.originalPosition);
            statusText.setText("Status: Argh..not enough GP");
            statusText.alpha = 0.8;
        }
        knifeText.visible = true;
    }

    function clickPerson(sprite, pointer) {
        personText.visible = true;

    }

    function notLikeThis(sprite, person) {
        if (gp >= 25) {
            //play Audio
            gameEndDelay = game.time.now + 3000;
            timer += 3;
            victory = true;
            badEnding = true;
            stab.play();
        }
        else {
            gp = 0;
            knife.position.copyFrom(knife.originalPosition);
            statusText.setText("Status: Ughh..not enough GP");
            statusText.alpha = 0.8;
        }
        knifeText.visible = true;
    }
};
