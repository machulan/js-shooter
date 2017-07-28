(function() {
    const SHOT_SOUND_SRC = 'audio/shot.mp3';
    const SOUND_SRC = 'audio/sound.mp3';

    function playShotSound() {
        var shotSound = new Audio(SHOT_SOUND_SRC);
        shotSound.volume = 0.1;
        shotSound.play();
        // new Audio(SHOT_SOUND_SRC).play();
    }

    function playExplosionSound(explosionPower) {
        // alert(explosionPower);
        var explosionSound = new Audio(SHOT_SOUND_SRC);
        explosionSound.volume = Math.min(1, explosionPower / 100);
        if (explosionPower < 50) {
            explosionSound.volume = 0;
        }
        explosionSound.play();
    }

    function playSound() {
        // new Audio(SOUND_SRC).play();
    }

    window.audio = {
        playShotSound: playShotSound,
        playExplosionSound: playExplosionSound,
        playSound: playSound
    }
})();