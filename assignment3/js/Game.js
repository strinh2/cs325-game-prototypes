"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var player;
    var background;

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

            background = game.add.tileSprite(0, 0, 800, 800, 'background');

            //Add the user into the game at one of the spawnpoints
            var rand = game.rnd.integerInRange(0, 5);
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
                locationX = game.world.CenterX;
                locationY = game.world.centerY;
            }
            player = game.add.sprite(locationX, locationY, 'player');
            
            player.anchor.setTo( 0.5, 0.5 );
            
            // Turn on the arcade physics engine for this sprite.
            game.physics.enable( player, Phaser.Physics.ARCADE );
            // Make it bounce off of the world bounds.
            player.body.collideWorldBounds = true;
            
            // Add some text using a CSS style.
            // Center it in X, and position its top 15 pixels from the top of the world.
            var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
            var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
            text.anchor.setTo( 0.5, 0.0 );
            
            // When you click on the sprite, you go back to the MainMenu.
            //bouncy.inputEnabled = true;
            //bouncy.events.onInputDown.add( function() { quitGame(); }, this );
        },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            //Reset player velocity
            player.body.velocity.setTo(0, 0);

            var playerAngle = this.game.math.angleBetween(player.x, player.y, this.game.input.activePointer.x, this.game.input.activePointer.y);
                
            //Move towards the mouse when clicked
            if (game.input.mousePointer.isDown) {
                player.rotation = playerAngle;
                game.physics.arcade.moveToPointer(player, 400);
            }

            //Stop once reached cursor
            if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y)) {
                player.body.velocity.setTo(0, 0);
            }
            //else {
                //player.body.velocity.setTo(0, 0);
            //}
        }
    };
};
