const BUILDING_ANIMATION_METADATA = {
    "RES_1": {
        "idle": {
            basePathPrefix: "Art/Buildings/gold mine/RES_1_",
            basePathSuffix: "/idle/image",
                frameIndexPadding: 4,
                frameDelay: 0.15,
                frameCount: 1,
                offset: { x: 0, y: -75 }
            },
            "operating": {
                basePathPrefix: "res/Art/Effects/RES_1_",
                basePathSuffix: "_effect/",
                frameIndexPadding: 2,
                frameDelay: 0.15,
                frameCount: 10,
                offset: { x: 0, y: -35 }
            }
        },
    "RES_2": {
        "idle": {
            basePathPrefix: "Art/Buildings/elixir collector/RES_2_",
            basePathSuffix: "/idle/image",
            frameIndexPadding: 4,
            frameDelay: 0.3,
            frameCount: 1,
            offset: {x: 0, y: -75}
        },
        "operating": {
            basePathPrefix: "res/Art/Effects/RES_2_",
            basePathSuffix: "_effect/",
            frameIndexPadding: 2,
            frameDelay: 0.15,
            frameCount: 10,
            offset: { x: 0, y: -35 }
        },
    },
    "BARRACK_WORKING": {
        basePath: "res/Art/Effects/barack_working/",
        frameCount: 5,
        frameIndexPadding: 2,
        frameDelay: 0.1,
        offset: { x: 53, y: 53 }
    },
    "ARMY_CAMP_WORKING": {
        basePath: "res/Art/Effects/armycam_2/",
        frameCount: 5,
        frameIndexPadding: 2,
        frameDelay: 0.1,
        offset: { x: 0, y: 210 } // Placeholder offset
    }
}

var GENERATOR_SPLASH_EFFECT_METADATA = {
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

var LEVELUP_EFFECT_METADATA = {
    "LEVELUP": {
        basePath: "res/Art/Effects/levelup/",
        frameCount: 12,
        frameIndexPadding: 2,
        frameDelay: 0.05,
        offset: { x: 0, y: 100 }
    }
};

var BARRACK_STATUS_TOOLTIP_ASSET = "res/Art/Effects/status_building.png";