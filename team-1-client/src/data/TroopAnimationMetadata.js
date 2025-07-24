// TroopAnimationMetadata.js
// Defines animation metadata for all troop types and levels.
// This object is used by Troop.js to load and play animations correctly.

const TROOP_ANIMATION_METADATA = {
    "ARM_1": {
        "1": {
            "attack01": {
                basePath: "Art/Troops/ARM_1_1/ARM_1_1/attack01/image",
                frameIndexPadding: 4,
                frameDelay: 0.1,
                offset: { x: 0, y: 27 },
                directions: {
                    S:  { startFrame: 0,  frameCount: 13 },
                    SW: { startFrame: 13, frameCount: 13 },
                    W:  { startFrame: 26, frameCount: 13 },
                    NW: { startFrame: 39, frameCount: 13 },
                    N: { startFrame: 52, frameCount: 13 },
                    NE: { startFrame: 39, frameCount: 13 },
                    E: { startFrame: 26, frameCount: 13 },
                    SE: { startFrame: 13, frameCount: 13 }
                }
            },
            "idle": {
                basePath: "Art/Troops/ARM_1_1/ARM_1_1/idle/image",
                frameIndexPadding: 4,
                frameDelay: 0.15,
                offset: { x: 0, y: 27 },
                directions: {
                    S:  { startFrame: 0, frameCount: 6 },
                    SW: { startFrame: 6, frameCount: 6 },
                    W:  { startFrame: 12, frameCount: 6 },
                    NW: { startFrame: 18, frameCount: 6 },
                    N: { startFrame: 24, frameCount: 6 },
                    NE: { startFrame: 18, frameCount: 6 },
                    E: { startFrame: 12, frameCount: 6 },
                    SE: { startFrame: 6, frameCount: 6 }
                }
            },
            "dead": {
                basePath: "Art/Troops/ARM_1_1/ARM_1_1/dead/image",
                frameIndexPadding: 4,
                frameDelay: 0.15,
                offset: { x: 0, y: 0 },
                directions: {
                    S:  { startFrame: 0, frameCount: 1 },
                    SW: { startFrame: 0, frameCount: 1 },
                    W: { startFrame: 0, frameCount: 1 },
                    NW: { startFrame: 0, frameCount: 1 },
                    N: { startFrame: 0, frameCount: 1 },
                    NE: { startFrame: 0, frameCount: 1 },
                    E: { startFrame: 0, frameCount: 1 },
                    SE: { startFrame: 0, frameCount: 1 }
                }
            },
            "run": {
                basePath: "Art/Troops/ARM_1_1/ARM_1_1/run/image",
                frameIndexPadding: 4,
                frameDelay: 0.1,
                offset: { x: 0, y: 27 },
                directions: {
                    S:  { startFrame: 0,  frameCount: 14 },
                    SW: { startFrame: 14, frameCount: 14 },
                    W:  { startFrame: 28, frameCount: 14 },
                    NW: { startFrame: 42, frameCount: 14 },
                    N: { startFrame: 56, frameCount: 14 },
                    NE: { startFrame: 42, frameCount: 14 },
                    E: { startFrame: 28, frameCount: 14 },
                    SE: { startFrame: 14, frameCount: 14 }
                }
            },
        }
    },
    "ARM_2": {
        "1": {
            "bulletType": "ARCHER_ARROW",
            "attack01": {
                basePath: "Art/Troops/ARM_2_1/ARM_2_1/attack01/image",
                frameIndexPadding: 4,
                frameDelay: 0.1,
                offset: { x: 0, y: 27 },
                directions: {
                    S:  { startFrame: 0,  frameCount: 13, bulletOriginOffset: { x: 0, y: 50 } },
                    SW: { startFrame: 13, frameCount: 13, bulletOriginOffset: { x: -25, y: 45 } },
                    W:  { startFrame: 26, frameCount: 13, bulletOriginOffset: { x: -30, y: 40 } },
                    NW: { startFrame: 39, frameCount: 13, bulletOriginOffset: { x: -25, y: 45 } },
                    N: { startFrame: 52, frameCount: 13, bulletOriginOffset: { x: 0, y: 50 } },
                    NE: { startFrame: 65, frameCount: 13, bulletOriginOffset: { x: 25, y: 45 } },
                    E: { startFrame: 26, frameCount: 13, bulletOriginOffset: { x: 30, y: 40 } },
                    SE: { startFrame: 13, frameCount: 13, bulletOriginOffset: { x: 25, y: 45 } }
                }
            },
            "idle": {
                basePath: "Art/Troops/ARM_2_1/ARM_2_1/idle/image",
                frameIndexPadding: 4,
                frameDelay: 0.15,
                offset: { x: 0, y: 27 },
                directions: {
                    S:  { startFrame: 0, frameCount: 6 },
                    SW: { startFrame: 6, frameCount: 6 },
                    W:  { startFrame: 12, frameCount: 6 },
                    NW: { startFrame: 18, frameCount: 6 },
                    N: { startFrame: 24, frameCount: 6 },
                    NE: { startFrame: 18, frameCount: 6 },
                    E: { startFrame: 12, frameCount: 6 },
                    SE: { startFrame: 6, frameCount: 6 }
                }
            },
            "dead": {
                basePath: "Art/Troops/ARM_2_1/ARM_2_1/dead/image",
                frameIndexPadding: 4,
                frameDelay: 0.15,
                directions: {
                    S:  { startFrame: 0, frameCount: 1 },
                    SW: { startFrame: 0, frameCount: 1 },
                    W: { startFrame: 0, frameCount: 1 },
                    NW: { startFrame: 0, frameCount: 1 },
                    N: { startFrame: 0, frameCount: 1 },
                    NE: { startFrame: 0, frameCount: 1 },
                    E: { startFrame: 0, frameCount: 1 },
                    SE: { startFrame: 0, frameCount: 1 }
                }
            },
            "run": {
                basePath: "Art/Troops/ARM_2_1/ARM_2_1/run/image",
                frameIndexPadding: 4,
                frameDelay: 0.1,
                offset: { x: 0, y: 27 },
                directions: {
                    S:  { startFrame: 0,  frameCount: 16 },
                    SW: { startFrame: 16, frameCount: 16 },
                    W:  { startFrame: 32, frameCount: 16 },
                    NW: { startFrame: 48, frameCount: 16 },
                    N: { startFrame: 64, frameCount: 16 },
                    NE: { startFrame: 48, frameCount: 16 },
                    E: { startFrame: 32, frameCount: 16 },
                    SE: { startFrame: 16, frameCount: 16 }
                }
            },
        }

    },
    "ARM_3": {
        "1": {
            "attack01": {
                basePath: "Art/Troops/ARM_3_1/ARM_3_1/attack01/image",
                frameIndexPadding: 4,
                frameDelay: 0.1,
                offset: { x: 0, y: 27 },
                directions: {
                    S:  { startFrame: 0,  frameCount: 13 },
                    SW: { startFrame: 13, frameCount: 13 },
                    W:  { startFrame: 26, frameCount: 13 },
                    NW: { startFrame: 39, frameCount: 13 },
                    N: { startFrame: 52, frameCount: 13 },
                    NE: { startFrame: 39, frameCount: 13 },
                    E: { startFrame: 26, frameCount: 13 },
                    SE: { startFrame: 13, frameCount: 13 }
                }
            },
            "idle": {
                basePath: "Art/Troops/ARM_3_1/ARM_3_1/idle/image",
                frameIndexPadding: 4,
                frameDelay: 0.15,
                offset: { x: 0, y: 27 },
                directions: {
                    S:  { startFrame: 0, frameCount: 6 },
                    SW: { startFrame: 6, frameCount: 6 },
                    W:  { startFrame: 12, frameCount: 6 },
                    NW: { startFrame: 18, frameCount: 6 },
                    N: { startFrame: 24, frameCount: 6 },
                    NE: { startFrame: 18, frameCount: 6 },
                    E: { startFrame: 12, frameCount: 6 },
                    SE: { startFrame: 6, frameCount: 6 }
                }
            },
            "dead": {
                basePath: "Art/Troops/ARM_3_1/ARM_3_1/dead/image",
                frameIndexPadding: 4,
                frameDelay: 0.15,
                directions: {
                    S:  { startFrame: 0, frameCount: 1 },
                    SW: { startFrame: 0, frameCount: 1 },
                    W: { startFrame: 0, frameCount: 1 },
                    NW: { startFrame: 0, frameCount: 1 },
                    N: { startFrame: 0, frameCount: 1 },
                    NE: { startFrame: 0, frameCount: 1 },
                    E: { startFrame: 0, frameCount: 1 },
                    SE: { startFrame: 0, frameCount: 1 }
                }
            },
            "run": {
                basePath: "Art/Troops/ARM_3_1/ARM_3_1/run/image",
                frameIndexPadding: 4,
                frameDelay: 0.1,
                offset: { x: 0, y: 27 },
                directions: {
                    S:  { startFrame: 0,  frameCount: 12},
                    SW: { startFrame: 12, frameCount: 12 },
                    W:  { startFrame: 24, frameCount: 12 },
                    NW: { startFrame: 36, frameCount: 12 },
                    N: { startFrame: 48, frameCount: 12 },
                    NE: { startFrame: 36, frameCount: 12 },
                    E: { startFrame: 24, frameCount: 12 },
                    SE: { startFrame: 12, frameCount: 12 }
                }
            },
        }
    },
    "ARM_4": {
        "1": {
            "attack01": {
                basePath: "Art/Troops/ARM_4_1/ARM_4_1/attack01/image",
                frameIndexPadding: 4,
                frameDelay: 0.1,
                offset: { x: 0, y: 27 },
                directions: {
                    S:  { startFrame: 0,  frameCount: 13 },
                    SW: { startFrame: 13, frameCount: 13 },
                    W:  { startFrame: 26, frameCount: 13 },
                    NW: { startFrame: 39, frameCount: 13 },
                    N: { startFrame: 52, frameCount: 13 },
                    NE: { startFrame: 39, frameCount: 13 },
                    E: { startFrame: 26, frameCount: 13 },
                    SE: { startFrame: 13, frameCount: 13 }
                }
            },
            "idle": {
                basePath: "Art/Troops/ARM_4_1/ARM_4_1/idle/image",
                frameIndexPadding: 4,
                frameDelay: 0.15,
                offset: { x: 0, y: 27 },
                directions: {
                    S:  { startFrame: 0, frameCount: 6 },
                    SW: { startFrame: 6, frameCount: 6 },
                    W:  { startFrame: 12, frameCount: 6 },
                    NW: { startFrame: 18, frameCount: 6 },
                    N: { startFrame: 24, frameCount: 6 },
                    NE: { startFrame: 18, frameCount: 6 },
                    E: { startFrame: 12, frameCount: 6 },
                    SE: { startFrame: 6, frameCount: 6 }
                }
            },
            "dead": {
                basePath: "Art/Troops/ARM_4_1/ARM_4_1/dead/image",
                frameIndexPadding: 4,
                frameDelay: 0.15,
                directions: {
                    S:  { startFrame: 0, frameCount: 1 },
                    SW: { startFrame: 0, frameCount: 1 },
                    W: { startFrame: 0, frameCount: 1 },
                    NW: { startFrame: 0, frameCount: 1 },
                    N: { startFrame: 0, frameCount: 1 },
                    NE: { startFrame: 0, frameCount: 1 },
                    E: { startFrame: 0, frameCount: 1 },
                    SE: { startFrame: 0, frameCount: 1 }
                }
            },
            "run": {
                basePath: "Art/Troops/ARM_4_1/ARM_4_1/run/image",
                frameIndexPadding: 4,
                frameDelay: 0.1,
                offset: { x: 0, y: 27 },
                directions: {
                    S:  { startFrame: 0,  frameCount: 16 },
                    SW: { startFrame: 16, frameCount: 16 },
                    W:  { startFrame: 32, frameCount: 16 },
                    NW: { startFrame: 48, frameCount: 16 },
                    N: { startFrame: 64, frameCount: 16 },
                    NE: { startFrame: 48, frameCount: 16 },
                    E: { startFrame: 32, frameCount: 16 },
                    SE: { startFrame: 16, frameCount: 16 }
                }
            },
        }

    },
};
