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
    
    var game = new Phaser.Game( 1350, 765, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    

    function preload() {
        // Load the assets to be used in game.
        game.load.image('background', 'assets/game3_black.png');
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

    var timer = 60;
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
    var tv2;
    var tvText;
    var tvText2;
    var tvHasBeenClicked = false;
    var tvHasBeenClicked2 = false;
    var bat;
    var bat2;
    var batText;
    var batText2;
    var batHasBeenClicked = false;
    var plant;
    var plant2;
    var plantText;
    var plantText2;
    var plantHasBeenClicked = false;
    var plantHasBeenClicked2 = false;
    var stove;
    var stove2;
    var stoveText;
    var stoveText2;
    var stoveHasBeenClicked = false;
    var stoveHasBeenClicked2 = false;
    var stoveSet = false;
    var outlet;
    var outlet2;
    var outletText;
    var outletText2;
    var outletHasBeenClicked = false
    var door;
    var door2;
    var doorText;
    var doorText2;
    var doorHasBeenClicked = false;
    var doorHasBeenClicked2 = false;
    var window;
    var window2;
    var windowText;
    var windowText2;
    var windowHasBeenClicked = false;
    var windowHasBeenClicked2 = false;
    var floor;
    var floor2;
    var floorText;
    var floorText2;
    var floorHasBeenClicked = false;
    var floorHasBeenClicked2 = false;
    var knife;
    var knife2;
    var knifeText;
    var knifeText2;
    var knifeHasBeenClicked = false;
    var person;
    var person2;
    var personText;
    var personText2;
    var personHasBeenClicked = false;

    var staticSFX;
    var smash;
    var plantSmash;
    var gas;
    var electric;
    var knock;
    var wind;
    var footstep;
    var stab;

    var infoText;

    function create() {
        

        background = game.add.tileSprite(0, 0, 1350, 765, 'background');
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
        plantText = game.add.text(0, 0, "Plant GP Cost: 15 \nMaybe this'll distract him", { font: "20px Chiller", fill: "#ffffff", align: "center" });
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
        stoveText.x = ((stove.width - stoveText.width) / 2) + 10;
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
        batText = game.add.text(0, 0, "Bat GP Cost: 95 /nIt'd take a lot of effort to drag \nthis...", { font: "20px Chiller", fill: "#00FFFF", align: "center" });
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
        knifeText = game.add.text(0, 0, "Knife GP Cost: 30 \nMaybe I can drag this somewhere...", { font: "20px Chiller", fill: "#00FFFF", align: "center" });
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
        timerText = game.add.text(500 - 60, 35, timerString + timer, { font: '64px Chiller', fill: '#ff0000' });
        timerText.anchor.setTo(0.5, 0.5);
        timerText.visible = true;

        gameText = game.add.text(500, game.world.centerY - 200, ' ', { font: '96px Chiller', fill: '#ff0000' });
        gameText.anchor.setTo(0.5, 0.5);
        gameText.visible = false;

        stateText = game.add.text(500, game.world.centerY + 100, ' ', { font: '50px Chiller', fill: '#fff' });
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
                clock1.volume = 0.8;
                playClock1 = false;
            }
            else {
                clock2.play();
                clock2.volume = 0.8;
                playClock1 = true;
            }
            //Reduce the vibility of the spritetexts over time to reduce clutter, and then make them invisible again.
            if (stoveText.visible) {
                stoveText.alpha = stoveText.alpha - 0.1;
                if (stoveText.alpha <= 0) {
                    stoveText.visible = false;
                }
            }
            if (knifeText.visible) {
                knifeText.alpha = knifeText.alpha - 0.1;
                if (knifeText.alpha <= 0) {
                    knifeText.visible = false;
                }
            }
            if (batText.visible) {
                batText.alpha = batText.alpha - 0.1;
                if (batText.alpha <= 0) {
                    batText.visible = false;
                }
            }
            if (personText.visible) {
                personText.alpha = personText.alpha - 0.1;
                if (personText.alpha <= 0) {
                    personText.visible = false;
                }
            }
            if (floorText.visible) {
                floorText.alpha = floorText.alpha - 0.1;
                if (floorText.alpha <= 0) {
                    floorText.visible = false;
                }
            }
            if (windowText.visible) {
                windowText.alpha = windowText - 0.1 ;
                if (windowText.alpha <= 0) {
                    windowText.visible = false;
                }
            }
            if (doorText.visible) {
                doorText.alpha = doorText.alpha - 0.1;
                if (doorText.alpha <= 0) {
                    doorText.visible = false;
                }
            }
            if (outletText.visible) {
                outletText.alpha = outletText.alpha - 0.1;
                if (outletText.alpha <= 0) {
                    outletText.visible = false;
                }
            }
            if (plantText.visible) {
                plantText.alpha = plantText.alpha - 0.1;
                if (plantText.alpha <= 0) {
                    plantText.visible = false;
                }
            }
            if (tvText.visible) {
                tvText.alpha = tvText.alpha - 0.1;
                if (tvText.alpha <= 0) {
                    tvText.visible = false;
                }
            }
        }

        //Draggable Bats
        bat.events.onDragStop.add(function (bat) {
            if (!game.physics.arcade.overlap(bat, tv, smashTV)) {
                bat.position.copyFrom(bat.originalPosition);
            }
        }, null, this);
        

        
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
        background = game.add.tileSprite(0, 0, 1350, 765, 'background2');
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
        statusText = game.add.text(1020, 25, "Status: ", { font: '42px Chiller', fill: '#00FFFF' });
        statusText.anchor.setTo(0.5, 0.5);
        statusText.visible = true;
        statusText.alpha = 0.8;
        timerString = "Time Remaining: ";
        timerText = game.add.text(670, 35, timerString + timer, { font: '64px Chiller', fill: '#ff0000' });
        timerText.anchor.setTo(0.5, 0.5);
        timerText.visible = true;
        gpString = "Ghost Points: ";
        gpText = game.add.text(295, 25, gpString + gp, { font: '42px Chiller', fill: '#fff' });
        gpText.anchor.setTo(0.5, 0.5);
        gpText.visible = true;
        gpText.alpha = 0.8;
        

        if (bestEnding) {
            gameText = game.add.text(670, game.world.centerY - 260, 'Congratulations!', { font: '96px Chiller', fill: '#00FF00' });
            gameText.anchor.setTo(0.5, 0.5);
            gameText.visible = true;
            var str = "Noticing the fire, your loved one frantically \nescaped. Due to the unfortunate accident \nnothing could not be salavaged from the house, \nand your friends and family will never know the truth \nabout what really happened that night. \nThey will remember you as a gentle parent, a \ncaring spouse, and a considerate friend.";
            stateText = game.add.text(670 + 50, game.world.centerY, str, { font: '50px Chiller', fill: '#fff' });
            stateText.anchor.setTo(0.5, 0.5);
            stateText.visible = true;
            infoText = game.add.text(670 + 50, game.world.centerY + 300, "Congratulations! You have uncovered the best  of three endings! Try again \nto discover the other two endings!", { font: '50px Chiller', fill: '#00FF00' });
            infoText.anchor.setTo(0.5, 0.5);
            infoText.visible = true;
        }
        else if (neutralEnding) {
            smash.play();
            gameText = game.add.text(670, game.world.centerY - 260, 'You Suceeded...', { font: '96px Chiller', fill: '#00FFFF' });
            gameText.anchor.setTo(0.5, 0.5);
            gameText.visible = true;
            var str = "Your loved one fled the house in fear, and \n when they returned in the morning they \nfound the television to be damaged beyond repair. \nWhile they will never know the truth of what really \nhappened on either of those fateful nights, \nwhen asked they speak of you fondly. However\n they never did visit you again...";
            stateText = game.add.text(670 + 50, game.world.centerY, str, { font: '50px Chiller', fill: '#FFF' });
            stateText.anchor.setTo(0.5, 0.5);
            stateText.visible = true;
            infoText = game.add.text(670 + 50, game.world.centerY + 325, "Congrats...you have succeeded but it wasn't the cleanest cover up. This is\none of three endings, try again to discover them all!", { font: '50px Chiller', fill: '#00FFFF' });
            infoText.anchor.setTo(0.5, 0.5);
            infoText.visible = true;
        }
        else if (badEnding) {
            gameText = game.add.text(670, game.world.centerY - 260, 'Its Over...', { font: '96px Chiller', fill: '#ff0000' });
            gameText.anchor.setTo(0.5, 0.5);
            gameText.visible = true;
            var str = "It wasn't supposed to end like this, but \n they could never be allowed to know the \nthe truth. No matter the cost. The things that I did \nthat day can never see the light of day, whether I'm\ndead or alive. This will be the last loose end\nand I'll be sure to take care of the evidence\n before morning comes.";
            stateText = game.add.text(670 + 50, game.world.centerY, str, { font: '50px Chiller', fill: '#ff0000' });
            stateText.anchor.setTo(0.5, 0.5);
            stateText.visible = true;
            infoText = game.add.text(670 + 50, game.world.centerY + 325, "You have succeeded, but at a heavy cost. This is the least favorable ending of 3. \nTry again to discover them all!", { font: '50px Chiller', fill: '#fff' });
            infoText.anchor.setTo(0.5, 0.5);
            infoText.visible = true;
        }
    }
    function clickTV(sprite, pointer) {
              
        if (!tvHasBeenClicked) {
            if (gp >= 2) {
                gp += 2;
                timer += 2;
                statusText.setText("Status: Got it!");
                tvHasBeenClicked = true;
                statusText.alpha = 0.8;+
                gpText.setText(gpString + gp);
                timerText.setText(timerString + timer);
                tvText.alpha = 0.8;
                staticSFX.play();
                staticSFX.volume = 0.2;
                if (!tvHasBeenClicked2) {
                    //Add additional text to the new tv to the side
                    tv2 = game.add.text(1070, 630, "TV:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
                    tv2.anchor.setTo(0.5, 0.5);
                    tvText2 = game.add.text(1200, 630, "GP Cost: 2 \nOnly thing I can do directly is \nhit a button...", { font: "20px Chiller", fill: "#ffffff", align: "left" });
                    tvText2.anchor.x = 0.5;
                    tvText2.anchor.y = 0.5;
                    tvText2.visible = true;
                }
                tvText2.alpha = 0.7;
                tvHasBeenClicked2 = true;
            }
            else { //Not enough GP to interact
                //No penalty
                gpText.setText(gpString + gp);
                statusText.setText("Status: Ughh..not enough GP");
                statusText.alpha = 0.7;
            }
        }
        if (!tvHasBeenClicked2) {
            //Add additional text to the new tv to the side
            tv2 = game.add.text(1070, 630, "TV:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
            tv2.anchor.setTo(0.5, 0.5);
            tvText2 = game.add.text(1200, 630, "GP Cost: 2 \nOnly thing I can do directly is \nhit a button...", { font: "20px Chiller", fill: "#ffffff", align: "left" });
            tvText2.anchor.x = 0.5;
            tvText2.anchor.y = 0.5;
            tvText2.visible = true;
        }
        tvText.visible = true;
        tvHasBeenClicked2 = true;
    }

    function clickBat(sprite, pointer) {
        batText.visible = true;
        if (!batHasBeenClicked) {
            //Add additional text to the new bat to the side
            bat2 = game.add.text(1070, 540, "Bat:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
            bat2.anchor.setTo(0.5, 0.5);
            batText2 = game.add.text(1200, 540, "GP Cost: 95 \nIt'd take a lot of effort to drag \nthis...", { font: "20px Chiller", fill: "#ffffff", align: "left" });
            batText2.anchor.x = 0.5;
            batText2.anchor.y = 0.5;
            batText2.visible = true;
        }
        batHasBeenClicked = true;
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
            gp -= 20;
            if (gp < 0) {
                gp = 0;
            }
            bat.position.copyFrom(bat.originalPosition);
            statusText.setText("Status: Ughh..not enough GP");
            statusText.alpha = 0.7;
        }
        batText.visible = true;
    }

    function gameOver() {
        //Clean up the screen
        background = game.add.tileSprite(0, 0, 1350, 765, 'background2');

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
        statusText = game.add.text(1020, 25, "Status: ", { font: '42px Chiller', fill: '#00FFFF' });
        statusText.anchor.setTo(0.5, 0.5);
        statusText.visible = true;
        statusText.alpha = 0.8;
        timerString = "Time Remaining: ";
        timerText = game.add.text(670, 35, timerString + timer, { font: '64px Chiller', fill: '#ff0000' });
        timerText.anchor.setTo(0.5, 0.5);
        timerText.visible = true;
        gpString = "Ghost Points: ";
        gpText = game.add.text(295, 25, gpString + gp, { font: '42px Chiller', fill: '#fff' });
        gpText.anchor.setTo(0.5, 0.5);
        gpText.visible = true;
        gpText.alpha = 0.8;
        gameText = game.add.text(670, game.world.centerY - 200, 'GAME OVER', { font: '96px Chiller', fill: '#ff0000' });
        gameText.anchor.setTo(0.5, 0.5);
        gameText.visible = true;
        stateText = game.add.text(670 + 50, game.world.centerY, "YOU HAVE BEEN EXPOSED AND WILL FOREVER \nBE REMEMBERED AS A CRIMINAL! \n\nThere are 3 solutions, try again to discover them all!", { font: '50px Chiller', fill: '#fff' });
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
                if (!plantHasBeenClicked2) { //Make the sidebar text appear only once.
                    //Add additional text to the new plants to the side
                    plant2 = game.add.text(1070, 38, "Plant:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
                    plant2.anchor.setTo(0.5, 0.5);
                    plantText2 = game.add.text(1200, 38, "GP Cost: 15 \nMaybe this'll distract him...", { font: "20px Chiller", fill: "#ffffff", align: "left" });
                    plantText2.anchor.x = 0.5;
                    plantText2.anchor.y = 0.5;
                    //plantText2.alpha = 1.0;
                    plantText2.visible = true;
                }
                plantHasBeenClicked2 = true;
                plantText2.alpha = 0.7;
            }
            else { //Not enough GP to interact
                gp -= 3;
                if (gp < 0) {
                    gp = 0;
                }
                statusText.setText("Status: Ughh..not enough GP");
                statusText.alpha = 0.8;
                gpText.setText(gpString + gp);
            }
        }
        if (!plantHasBeenClicked2) { //Make the sidebar text appear only once.
            //Add additional text to the new plants to the side
            plant2 = game.add.text(1070, 38, "Plant:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
            plant2.anchor.setTo(0.5, 0.5);
            plantText2 = game.add.text(1200, 38, "GP Cost: 15 \nMaybe this'll distract him...", { font: "20px Chiller", fill: "#ffffff", align: "left" });
            plantText2.anchor.x = 0.5;
            plantText2.anchor.y = 0.5;
            //plantText2.alpha = 1.0;
            plantText2.visible = true;
        }
        plantText.visible = true;
        plantHasBeenClicked2 = true;
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
                if (!stoveHasBeenClicked2) {
                    //Add additional text to the new stoves to the side
                    stove2 = game.add.text(1070, 120, "Stove:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
                    stove2.anchor.setTo(0.5, 0.5);
                    stoveText2 = game.add.text(1220, 120, "Gas is leaking...", { font: "20px Chiller", fill: "#ffffff", align: "left" });
                    stoveText2.anchor.x = 0.5;
                    stoveText2.anchor.y = 0.5;
                    //stoveText2.alpha = 1.0;
                    stoveText2.visible = true;
                }
                else {
                    stoveText2.setText("Stove: Gas is leaking...");
                }
                stoveHasBeenClicked2 = true;
                stoveText2.alpha = 0.7;
                gas.play();
                gas.volume = 0.1;

            }
            else { //Not enough GP to interact
                gp -= 3;
                if (gp < 0) {
                    gp = 0;
                }
                statusText.setText("Status: Ughh..not enough GP");
                statusText.alpha = 0.8;
                gpText.setText(gpString + gp);
            }
        }
        if (!stoveHasBeenClicked2) {
            //Add additional text to the new stoves to the side
            stove2 = game.add.text(1070, 120, "Stove:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
            stove2.anchor.setTo(0.5, 0.5);
            stoveText2 = game.add.text(1220, 120, "GP Cost: 20 \nMaybe I can make some gas leak..", { font: "20px Chiller", fill: "#ffffff", align: "left" });
            stoveText2.anchor.x = 0.5;
            stoveText2.anchor.y = 0.5;
            //stoveText2.alpha = 1.0;
            stoveText2.visible = true;
        }
        stoveText.visible = true;
        stoveHasBeenClicked2 = true;
    }

    function clickOutlet(sprite, pointer) {        
        outletText.visible = true;
        if (!outletHasBeenClicked) {
            //Add additional text to the new outlets to the side
            outlet2 = game.add.text(1070, 185, "Outlet:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
            outlet2.anchor.setTo(0.5, 0.5);
            outletText2 = game.add.text(1225, 195, "It doesn't seem like there's anything \nI can do with this directly...", { font: "20px Chiller", fill: "#ffffff", align: "left" });
            outletText2.anchor.x = 0.5;
            outletText2.anchor.y = 0.5;
            // outletText2.alpha = 1.0;
            outletText2.visible = true;
        }
        outletHasBeenClicked = true;
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
                if (!doorHasBeenClicked2) {
                    //Add additional text to the new door to the side
                    door2 = game.add.text(1070, 265, "Door:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
                    door2.anchor.setTo(0.5, 0.5);
                    doorText2 = game.add.text(1200, 265, "GP Cost: 25 \nThis'll definitely distract him", { font: "20px Chiller", fill: "#ffffff", align: "left" });
                    doorText2.anchor.x = 0.5;
                    doorText2.anchor.y = 0.5;
                    doorText2.visible = true;
                    // doorText2.alpha = 1.0;
                }
                doorHasBeenClicked2 = true;
                doorText2.alpha = 0.7;
            }
            else { //Not enough GP to interact
                gp -= 10;
                if (gp < 0) {
                    gp = 0;
                }
                statusText.setText("Status: Ughh..not enough GP");
                statusText.alpha = 0.8;
                gpText.setText(gpString + gp);
            }
        }
        if (!doorHasBeenClicked2) {
            //Add additional text to the new door to the side
            door2 = game.add.text(1070, 265, "Door:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
            door2.anchor.setTo(0.5, 0.5);
            doorText2 = game.add.text(1200, 265, "GP Cost: 25 \nThis'll definitely distract him", { font: "20px Chiller", fill: "#ffffff", align: "left" });
            doorText2.anchor.x = 0.5;
            doorText2.anchor.y = 0.5;
            doorText2.visible = true;
            // doorText2.alpha = 1.0;
        }
        doorText.visible = true;
        doorHasBeenClicked2 = true;
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
                if (!windowHasBeenClicked2) {
                    //Add additional text to the new window to the side
                    window2 = game.add.text(1070, 330, "Window:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
                    window2.anchor.setTo(0.5, 0.5);
                    windowText2 = game.add.text(1200, 330, "GP Cost: 20\nThis might distract him..", { font: "20px Chiller", fill: "#ffffff", align: "left" });
                    windowText2.anchor.x = 0.5;
                    windowText2.anchor.y = 0.5;
                    windowText2.visible = true;
                    // windowText2.alpha = 1.0;
                    windowHasBeenClicked2 = true;
                }
                windowText2.alpha = 0.7;
            }
            else { //Not enough GP to interact
                gp -= 5;
                if (gp < 0) {
                    gp = 0;
                }
                statusText.setText("Status: Argh..not enough GP");
                statusText.alpha = 0.8;
                gpText.setText(gpString + gp);
            }
        }
        if (!windowHasBeenClicked2) {
            //Add additional text to the new window to the side
            window2 = game.add.text(1070, 330, "Window:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
            window2.anchor.setTo(0.5, 0.5);
            windowText2 = game.add.text(1200, 330, "GP Cost: 20\nThis might distract him..", { font: "20px Chiller", fill: "#ffffff", align: "left" });
            windowText2.anchor.x = 0.5;
            windowText2.anchor.y = 0.5;
            windowText2.visible = true;
            // windowText2.alpha = 1.0;
        }
        windowText.visible = true;
        windowHasBeenClicked2 = true;
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
                if (!floorHasBeenClicked2) {
                    //Add additional text to the new floor to the side
                    floor2 = game.add.text(1070, 395, "Floor:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
                    floor2.anchor.setTo(0.5, 0.5);
                    floorText2 = game.add.text(1200, 395, "GP Cost: 25 \nThis should distract him..", { font: "20px Chiller", fill: "#ffffff", align: "left" });
                    floorText2.anchor.x = 0.5;
                    floorText2.anchor.y = 0.5;
                    floorText2.visible = true;
                    // floorText2.alpha = 1.0;
                    floorHasBeenClicked2 = true;
                }
                floorText2.alpha = 0.7;
            }
            else { //Not enough GP to interact
                gp -= 5;
                statusText.setText("Status: Argh..not enough GP");
                statusText.alpha = 0.8;
                gpText.setText(gpString + gp);
            }
        }
        if (!floorHasBeenClicked2) {
            //Add additional text to the new floor to the side
            floor2 = game.add.text(1070, 395, "Floor:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
            floor2.anchor.setTo(0.5, 0.5);
            floorText2 = game.add.text(1200, 395, "GP Cost: 25 \nThis should distract him..", { font: "20px Chiller", fill: "#ffffff", align: "left" });
            floorText2.anchor.x = 0.5;
            floorText2.anchor.y = 0.5;
            floorText2.visible = true;
            // floorText2.alpha = 1.0;
        }
        floorText.visible = true;
        floorHasBeenClicked2 = true;
    }

    function clickKnife(sprite, pointer) {
        knifeText.visible = true;
        if (!knifeHasBeenClicked) {
            //Add additional text to the new knife to the side
            knife2 = game.add.text(1070, 460, "Knife:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
            knife2.anchor.setTo(0.5, 0.5);
            knifeText2 = game.add.text(1215, 460, "GP Cost: 30 \nMaybe I can drag this somewhere..", { font: "20px Chiller", fill: "#ffffff", align: "left" });
            knifeText2.anchor.x = 0.5;
            knifeText2.anchor.y = 0.5;
            knifeText2.visible = true;
        }
        knifeHasBeenClicked = true;
    }

    function smashOutlet(Sprite, outlet) {
        if (gp >= 30 && stoveSet) {            
            victory = true;
            gameEndDelay = game.time.now + 3000;
            timer += 3;
            bestEnding = true;
        }
        else if (gp < 30) {
            gp -= 5;
            if (gp < 0) {
                gp = 0;
            }
            knife.position.copyFrom(knife.originalPosition);
            statusText.setText("Status: Argh..not enough GP");
            statusText.alpha = 0.8;
        }
        knifeText.visible = true;
        outletText.visible = true;
        outletText.setText("Huh that made a pretty big spark...");
        if (!outletHasBeenClicked) {
            //Add additional text to the new outlets to the side
            outlet2 = game.add.text(1070, 185, "Outlet:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
            outlet2.anchor.setTo(0.5, 0.5);
            outletText2 = game.add.text(1225, 195, "Huh that made a pretty big spark...", { font: "20px Chiller", fill: "#ffffff", align: "left" });
            outletText2.anchor.x = 0.5;
            outletText2.anchor.y = 0.5;
            // outletText2.alpha = 1.0;
            outletText2.visible = true;
        }
        else {
            outletText2.setText("Huh that made a pretty big spark...");
        }
        electric.play();
    }

    function clickPerson(sprite, pointer) {
        personText.visible = true;
        if (!personHasBeenClicked) {
            personText.alpha = 1.0;
            //Add additional text to the new person to the side
            person2 = game.add.text(1070, 710, "Friend:", { font: "28px Chiller", fill: "#ffffff", align: "left" });
            person2.anchor.setTo(0.5, 0.5);
            personText2 = game.add.text(1200, 710, "They're not responding to me \ndirectly...", { font: "20px Chiller", fill: "#ffffff", align: "left" });
            personText2.anchor.x = 0.5;
            personText2.anchor.y = 0.5;
            personText2.visible = true;
            personText2.alpha = 0.7;
        }
        personHasBeenClicked = true;
    }

    function notLikeThis(sprite, person) {
        if (gp >= 30) {
            //play Audio
            gameEndDelay = game.time.now + 3000;
            timer += 3;
            victory = true;
            badEnding = true;
            stab.play();
        }
        else {
            gp -= 5;
            if (gp < 0) {
                gp = 0;
            }
            knife.position.copyFrom(knife.originalPosition);
            statusText.setText("Status: Ughh..not enough GP");
            statusText.alpha = 0.8;
        }        
        knifeText.visible = true;
    }
};
