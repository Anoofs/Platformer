var playState = {

    create: function () {

        this.cursor = game.input.keyboard.createCursorKeys();

        this.player = game.add.sprite(game.world.centerX, game.world.centerY,
                    'player');
        this.player.anchor.setTo(0.5, 0.5);
        this.player.animations.add('right', [1, 2], 8, true);
        this.player.animations.add('left', [3, 4], 8, true);

        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');

        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin);
        this.coin.anchor.setTo(0.5, 0.5);

        this.scoreLabel = game.add.text(30, 30, 'score: 0',
                    { font: '18px Arial', fill: '#ffffff' });

        game.global.score = 0;

        this.createWorld();
        game.time.events.loop(2200, this.addEnemy, this);

        this.jumpSound = game.add.audio('jump');
        this.coinSound = game.add.audio('coin');
        this.deadSound = game.add.audio('dead');

        this.music = game.add.audio('music');
        this.music.loop = true;
        this.music.play();

        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.gravity = 0;

        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        }

        game.input.keyboard.addKeyCapture([Phaser.Keyboard.up, Phaser.Keyboard.left,
            Phaser.Keyboard.right]);

        if (!game.device.desktop) {
            // Display the mobile inputs
            this.addMobileInputs();
        }
    },
    addEnemy: function () {
        var enemy = this.enemies.getFirstDead();

        if (!enemy)
            return;

        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.world.centerX, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;

    },
    update: function () {
        // Tell Phaser that the player and the walls should collide
        game.physics.arcade.collide(this.player, this.layer);

        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);

        game.physics.arcade.collide(this.enemies, this.layer);

        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie,
                                    null, this);

        this.movePlayer();

        if (!this.player.inWorld) {
            this.playerDie();
        }

       // this.enemies.forEachAlive(this.checkPosition, this);
    },
    checkPosition: function () {
        if (enemy.y > this.player.y)
            enemy.kill();

    },
    movePlayer: function () {
        if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
            this.player.body.velocity.x = -200;
            this.player.animations.play('left');
        }
            // Player moving right
        else if (this.cursor.right.isDown || this.wasd.right.isDown ||
        this.moveRight) {
            this.player.body.velocity.x = 200;
        }
        else {
            this.player.body.velocity.x = 0;
            this.player.animations.stop();
            this.player.frame = 0;
        }

        if ((this.cursor.up.isDown || this.wasd.up.isDown) && this.player.body.onFloor()) {
            this.jumpSound.play();
            this.player.body.velocity.y = -320;
        }
    },

    createWorld: function () {

        this.map = game.add.tilemap('map');

        this.map.addTilesetImage('tileset');

        this.layer = this.map.createLayer('Tile Layer 1');

        this.layer.resizeWorld();

        this.map.setCollision(1);
    },

    takeCoin: function () {
        this.coin.scale.setTo(0, 0);
        game.add.tween(this.coin.scale).to({ x: 1, y: 1 }, 300).start();
        this.coinSound.play();
        game.global.score += 5;
        this.scoreLabel.text = 'score: ' + game.global.score;
        this.updateCoinPosition();
    },

    updateCoinPosition: function () {
        var coinSpawnPoints = [
        { x: 140, y: 60 }, { x: 360, y: 60 },
        { x: 60, y: 140 }, { x: 440, y: 140 },
        { x: 130, y: 300 }, { x: 370, y: 300 }
        ];

        for (var i = 0; i < coinSpawnPoints.length; ++i) {
            if (coinSpawnPoints[i].x == this.coin.x) {
                coinSpawnPoints.splice(i, 1);
            }
        }

        var newPoint = coinSpawnPoints[game.rnd.integerInRange(0, coinSpawnPoints.length - 1)];

        this.coin.reset(newPoint.x, newPoint.y);
    },

    playerDie: function () {
        if (!this.player.alive) {
            return;
        }

        this.player.kill();

        this.music.stop();
        this.deadSound.play();

        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 600, null, 15);

        game.time.events.add(1000, this.startMenu, this);

        //game.state.start('menu');
    },

    addMobileInputs: function () {
        this.jumpButton = game.add.sprite(350, 247, 'jumpButton');
        this.jumpButton.inputEnabled = true;
        this.jumpButton.events.onInputDown.add(this.jumpPlayer, this);
        this.jumpButton.alpha = 0.5;
        // Movement variables
        this.moveLeft = false;
        this.moveRight = false;
        // Add the move left button
        this.leftButton = game.add.sprite(50, 247, 'leftButton');
        this.leftButton.inputEnabled = true;
        this.leftButton.events.onInputOver.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputOut.add(function(){this.moveLeft=false;}, this);
        this.leftButton.events.onInputDown.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputUp.add(function(){this.moveLeft=false;}, this);
        this.leftButton.alpha = 0.5;
        // Add the move right button
        this.rightButton = game.add.sprite(130, 247, 'rightButton');
        this.rightButton.inputEnabled = true;
        this.rightButton.events.onInputOver.add(function(){this.moveRight=true;},
            this);
        this.rightButton.events.onInputOut.add(function(){this.moveRight=false;},
            this);
        this.rightButton.events.onInputDown.add(function(){this.moveRight=true;},
            this);
        this.rightButton.events.onInputUp.add(function () { this.moveRight = false; },
            this);
        this.rightButton.alpha = 0.5;
    },

    startMenu: function () {
        game.state.start('menu');
    }

};
