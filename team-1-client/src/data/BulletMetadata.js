const BULLET_METADATA = {
    "CANNON_BALL": {
        assetType: 'sprite',
        path: 'res/Art/BattleEffect/cannon_bullet.png',
        speed: 400,
        hitEffect: {
            basePath: 'res/Art/BattleEffect/cannon_hit/',
            frameCount: 11,
            frameIndexPadding: 2,
            frameDelay: 0.05
        }
    },
    "ARCHER_ARROW": {
        assetType: 'sprite',
        path: 'res/Art/BattleEffect/archerbullet3.png',
        speed: 500
        // No hit effect
    },
    "MORTAR_SHELL": {
        assetType: 'animation',
        path: 'res/Art/BattleEffect/mortal_bullet_normal/',
        frameCount: 10,
        frameIndexPadding: 2,
        frameDelay: 0.05,
        speed: 200,
        hitEffect: {
            basePath: 'res/Art/BattleEffect/mortalbullet_explosion/',
            frameCount: 12,
            frameIndexPadding: 2,
            frameDelay: 0.05
        }
    }
};