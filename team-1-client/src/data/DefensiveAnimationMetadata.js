function generateDef1Levels() {
    const levels = {};
    for (let i = 1; i <= 10; i++) {
        levels[i] = {
            bulletType: "CANNON_BALL",
            base: {
                basePath: "Art/Buildings/defense_base/DEF_1_" + i + "_Shadow",
                frameIndexPadding: 4,
                frameDelay: 0.15,
                offset: { x: 0, y: 45},
                directions: {
                    S:  { startFrame: 0, frameCount: 1 },
                    SW: { startFrame: 0, frameCount: 1 },
                    W:  { startFrame: 0, frameCount: 1 },
                    NW: { startFrame: 0, frameCount: 1 },
                    N:  { startFrame: 0, frameCount: 1 },
                    NE: { startFrame: 0, frameCount: 1 },
                    E:  { startFrame: 0, frameCount: 1 },
                    SE: { startFrame: 0, frameCount: 1 }
                }
            },
            defenseAnim: {
                attack01: {
                    basePath: "Art/Buildings/cannon/canon_" + i + "/attack01/image",
                    frameIndexPadding: 4,
                    frameDelay: 0.1,
                    offset: { x: 0, y: -45},
                    directions: {
                        S:  { startFrame: 0,  frameCount: 7, bulletOriginOffset: { x: 0, y: 45*2 + 15} },
                        SW: { startFrame: 7, frameCount: 7, bulletOriginOffset: { x: 0, y: 45*2 + 15} },
                        W:  { startFrame: 14, frameCount: 7, bulletOriginOffset: { x: 0, y: 45*2 + 15} },
                        NW: { startFrame: 21, frameCount: 7, bulletOriginOffset: { x: 0, y: 45*2 + 15} },
                        N:  { startFrame: 28, frameCount: 7, bulletOriginOffset: { x: 0, y: 45*2 + 15} },
                        NE: { startFrame: 21, frameCount: 7, bulletOriginOffset: { x: 0, y: 45*2 + 15} },
                        E:  { startFrame: 14, frameCount: 7, bulletOriginOffset: { x: 0, y: 45*2 + 15} },
                        SE: { startFrame: 7, frameCount: 7, bulletOriginOffset: { x: 0, y: 45*2 + 15} }
                    }
                },
                cannon_fire: {
                    basePath: "res/Art/BattleEffect/cannon_fire/",
                    frameIndexPadding: 2,
                    frameDelay: 0.05,
                    directions: {
                        S:  { startFrame: 0, frameCount: 10, offset: { x: -95, y: -60 } },
                        SW: { startFrame: 0, frameCount: 10, offset: { x: -140, y: 5 } },
                        W:  { startFrame: 0, frameCount: 10, offset: { x: -130, y: -30 } },
                        NW: { startFrame: 0, frameCount: 10, offset: { x: -140, y: -5 } },
                        N:  { startFrame: 0, frameCount: 10, offset: { x: -95, y: 10 } },
                        NE: { startFrame: 0, frameCount: 10, offset: { x: -75, y: -10 } },
                        E:  { startFrame: 0, frameCount: 10, offset: { x: -50, y: -30 } },
                        SE: { startFrame: 0, frameCount: 10, offset: { x: -70, y: -60 } }
                    }
                },
                idle: {
                    basePath: "Art/Buildings/cannon/canon_" + i + "/idle/image",
                    frameIndexPadding: 4,
                    frameDelay: 0.15,
                    offset: { x: 0, y: -45},
                    directions: {
                        S:  { startFrame: 0, frameCount: 1 },
                        SW: { startFrame: 1, frameCount: 1 },
                        W:  { startFrame: 2, frameCount: 1 },
                        NW: { startFrame: 3, frameCount: 1 },
                        N:  { startFrame: 4, frameCount: 1 },
                        NE: { startFrame: 3, frameCount: 1 },
                        E:  { startFrame: 2, frameCount: 1 },
                        SE: { startFrame: 1, frameCount: 1 }
                    }
                },
                //TODO: spin the cannon (canon event!)
                // run: {
                //     basePath: "Art/Buildings/cannon/canon_" + i + "/run/image",
                //     frameIndexPadding: 4,
                //     frameDelay: 0.1,
                //     offset: { x: 0, y: 0 },
                //     directions: {
                //         S:  { startFrame: 0,  frameCount: 10 },
                //         SW: { startFrame: 10, frameCount: 10 },
                //         W:  { startFrame: 20, frameCount: 10 },
                //         NW: { startFrame: 30, frameCount: 10 },
                //         N:  { startFrame: 40, frameCount: 10 },
                //         NE: { startFrame: 30, frameCount: 10 },
                //         E:  { startFrame: 20, frameCount: 10 },
                //         SE: { startFrame: 10, frameCount: 10 }
                //     }
                // }
            }
        };
    }
    return levels;
}

function generateDef2Levels() {
    const levels = {};
    for (let i = 1; i <= 6; i++) {
        levels[i] = {
            bulletType: "ARCHER_ARROW",
            base: {
                basePath: "Art/Buildings/defense_base/DEF_2_" + i + "_Shadow",
                frameIndexPadding: 4,
                frameDelay: 0.15,
                offset: { x: -7, y: 40 },
                directions: {
                    S:  { startFrame: 0, frameCount: 1 },
                    SW: { startFrame: 0, frameCount: 1 },
                    W:  { startFrame: 0, frameCount: 1 },
                    NW: { startFrame: 0, frameCount: 1 },
                    N:  { startFrame: 0, frameCount: 1 },
                    NE: { startFrame: 0, frameCount: 1 },
                    E:  { startFrame: 0, frameCount: 1 },
                    SE: { startFrame: 0, frameCount: 1 }
                }
            },
            defenseAnim: {
                attack01: {
                    basePath: "Art/Buildings/AcherTower/DEF_2_" + i + "/DEF_2_" + i +"/attack01/image",
                    frameIndexPadding: 4,
                    frameDelay: 0.1,
                    offset: { x: 0, y: -60 },
                    directions: {
                        S:  { startFrame: 0,  frameCount: 13, bulletOriginOffset: { x: 0, y: 60 * 2 + 76} },
                        SW: { startFrame: 13, frameCount: 13, bulletOriginOffset: { x: 0, y: 60 * 2 + 76 } },
                        W:  { startFrame: 26, frameCount: 13, bulletOriginOffset: { x: 0, y: 60 * 2 + 76 } },
                        NW: { startFrame: 39, frameCount: 13, bulletOriginOffset: { x: 0, y: 60 * 2 + 76 } },
                        N:  { startFrame: 52, frameCount: 13, bulletOriginOffset: { x: 0, y: 60 * 2 + 76 } },
                        NE: { startFrame: 39, frameCount: 13, bulletOriginOffset: { x: 0, y: 60 * 2 + 76 } },
                        E:  { startFrame: 26, frameCount: 13, bulletOriginOffset: { x: 0, y: 60 * 2 + 76 } },
                        SE: { startFrame: 13, frameCount: 13, bulletOriginOffset: { x: 0, y: 60 * 2 + 76 } },
                    }
                },
                idle: {
                    basePath: "Art/Buildings/AcherTower/DEF_2_" + i + "/DEF_2_" + i +"/idle/image"  ,
                    frameIndexPadding: 4,
                    frameDelay: 0.15,
                    offset: { x: 0, y: -60 },
                    directions: {
                        S:  { startFrame: 0, frameCount: 1 },
                        SW: { startFrame: 1, frameCount: 1 },
                        W:  { startFrame: 2, frameCount: 1 },
                        NW: { startFrame: 3, frameCount: 1 },
                        N:  { startFrame: 4, frameCount: 1 },
                        NE: { startFrame: 3, frameCount: 1 },
                        E:  { startFrame: 2, frameCount: 1 },
                        SE: { startFrame: 1, frameCount: 1 }
                    }
                },
            }
        };
    }
    return levels;
}

function generateDef3Levels() {
    const levels = {};
    for (let i = 1; i <= 8; i++) {
        levels[i] = {
            bulletType: "MORTAR_SHELL",
            defenseAnim: {
                attack01: {
                    basePath: "Art/Buildings/Motar/DEF_3_" + i + "/DEF_3_" + i + "/attack01/image",
                    frameIndexPadding: 4,
                    frameDelay: 0.1,
                    offset: { x: 0, y: -75 },
                    directions: {
                        S:  { startFrame: 0,  frameCount: 5, bulletOriginOffset: { x: 0, y: 75 * 2 + 76 * 3 } },
                        SW: { startFrame: 5, frameCount: 5, bulletOriginOffset:  { x: 57 , y: 75 * 2 + 76 * 2 } },
                        W:  { startFrame: 10, frameCount: 5, bulletOriginOffset: { x: 57 * 1.5 , y: 75 * 2 + 76 * 1.5 } },
                        NW: { startFrame: 15, frameCount: 5, bulletOriginOffset: { x: 57 , y: 75 * 2 + 76 } },
                        N:  { startFrame: 20, frameCount: 5, bulletOriginOffset: { x: 0, y: 75 * 2 + 76 } },
                        NE: { startFrame: 15, frameCount: 5, bulletOriginOffset: { x: 57 , y: 75 * 2 + 76 } },
                        E:  { startFrame: 10, frameCount: 5, bulletOriginOffset: { x: 57 * 1.5 , y: 75 * 2 + 76 * 1.5 } },
                        SE: { startFrame: 5, frameCount: 5, bulletOriginOffset:  { x: 57 , y: 75 * 2 + 76 * 2 } }
                    }
                },
                idle: {
                    basePath: "Art/Buildings/Motar/DEF_3_" + i + "/DEF_3_" + i + "/idle/image"  ,
                    frameIndexPadding: 4,
                    frameDelay: 0.15,
                    offset: { x: 0, y: -75 },
                    directions: {
                        S:  { startFrame: 0, frameCount: 1 },
                        SW: { startFrame: 1, frameCount: 1 },
                        W:  { startFrame: 2, frameCount: 1 },
                        NW: { startFrame: 3, frameCount: 1 },
                        N:  { startFrame: 4, frameCount: 1 },
                        NE: { startFrame: 3, frameCount: 1 },
                        E:  { startFrame: 2, frameCount: 1 },
                        SE: { startFrame: 1, frameCount: 1 }
                    }
                },
            }
        };
    }
    return levels;
}

const DEFENSIVE_ANIMATION_METADATA = {
    DEF_1: generateDef1Levels(),
    DEF_2: generateDef2Levels(),
    DEF_3: generateDef3Levels(),
};
