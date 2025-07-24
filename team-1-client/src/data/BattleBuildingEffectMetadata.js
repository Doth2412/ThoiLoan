var EXPLOSION_ANIMATION_METADATA = {
    "explosion_1": {
        basePath: "res/Art/BattleEffect/explosion_1/",
        frameIndexPadding: 2,
        frameDelay: 0.15,
        offset: { x: 0, y: 130 },
        directions: {
            "default": {
                startFrame: 0,
                frameCount: 11
            }
        }
    }
};

var DESTROYED_BUILDING_SPRITE_MAP = {
    "DEFAULT": [
        { path: "res/Art/BattleEffect/junk_contructs_0.png", offset: { x: 0, y: 80 } },
        { path: "res/Art/BattleEffect/junk_contructs_1.png", offset: { x: 0, y: 80 } }
    ],
    "RES_": [
        { path: "res/Art/BattleEffect/junk_elixirdrill.png", offset: { x: 0, y: 80 } }
    ],
    "TOW_": [
        { path: "res/Art/BattleEffect/junk_mainhouse.png", offset: { x: 0, y: 110 } }
    ],
    "WAL_": [
        { path: "res/Art/BattleEffect/junk_wall_0.png", offset: { x: 0, y: 40 } }
    ]
};

var SPLASH_EFFECT_METADATA = {
    "GOLD_SPLASH": {
        path: "res/Art/BattleEffect/gold_01.png",
        numberOfParticles: 3,
        particleSpeed: 200,
        spreadAngle: 120,
        duration: 1.0,
        fadeOutDuration: 0.5,
        startOffset: { x: 0, y: 100 },
        randomStartOffsetRange: 20
    },
    "ELIXIR_SPLASH": {
        path: "res/Art/BattleEffect/elixir_01.png",
        numberOfParticles: 3,
        particleSpeed: 200,
        spreadAngle: 120,
        duration: 1.0,
        fadeOutDuration: 0.5,
        startOffset: { x: 0, y: 100 },
        randomStartOffsetRange: 20
    }
};
