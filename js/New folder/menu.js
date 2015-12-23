var menuState = {

    create: function () {

        game.add.image(0, 0, 'background');

        var nameLabel = game.add.text(game.world.centerX, 80, 'Coin Box',
                        { font: '70px Arial', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);


        if (!localStorage.getItem('bestScore')); {
            localStorage.setItem('bestScore', 0);
        }

        if (game.global.score > localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', game.global.score);
        }

        var text = 'score: ' + game.global.score + '\nbest score: ' +
            localStorage.getItem('bestScore');
        var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, text,
                        { font: '25px Arial', fill: '#ffffff' });
        scoreLabel.anchor.setTo(0.5, 0.5);

        if (game.device.desktop) {
            var text = 'press the up arrow key to start';
        }
        else
            var text = 'touch the screen to start';

        var startLabel = game.add.text(game.world.centerX, -50, text,
                        { font: '25px Arial', fill: '#ffffff' });
        startLabel.anchor.setTo(0.5, 0.5);

        game.add.tween(nameLabel).to({ y: 80 }, 1000).easing(Phaser.Easing.Bounce.Out).start();

        game.add.tween(nameLabel).to({ angle: -2 }, 500).to({ angle: 2 }, 500).loop().start();

        this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
        this.muteButton.input.useHandCursor = true;

        if (game.sound.mute) {
            this.muteButton.frame = 1;
        }

        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

        upKey.onDown.addOnce(this.start, this);

        game.input.onDown.addOnce(this.start, this);

    },
    toggleSound: function () {
        game.sound.mute = !game.sound.mute;
        this.muteButton.frame = game.sound.mute ? 1 : 0;
    },
    start: function () {
        game.state.start('play');
    },
};