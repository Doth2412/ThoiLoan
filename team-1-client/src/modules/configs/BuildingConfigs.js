// This file contains the configuration objects for buildings, obstacles, and related UI elements.

const BASE_SPRITE_CONFIG = {
    "2x2": { res: res._2_png, name: "Base 2x2" },
    "3x3": { res: res._3_png, name: "Base 3x3" }, 
    "4x4": { res: res._4_png, name: "Base 4x4" }, 
    "5x5": { res: res._5_png, name: "Base 5x5" }, 
};

const BUILDING_UI_CONFIG = {
    "TOW_1": {
        level: 1,
        name: "Nhà chính",
        size: {width: 4, height: 4}, 
        buildingRes: res.tow_1_1_idle_image0000_png,
        offset: {x: -1, y: -40},
        assetFolderName: "townhall",
    },
    "AMC_1": {
        level: 1,
        name: "Trại lính",
        size: {width: 5, height: 5},
        buildingRes: res.amc_1_1_idle_image0000_png,
        offset: {x: 0, y: 0},
        assetFolderName: "army camp",
    },
    "RES_1": {
        level: 1,
        name: "Mỏ vàng",
        size: { width: 3, height: 3 },
        buildingRes: res.res_1_1_idle_image0000_png,
        offset: { x: 0, y: -30 },
        assetFolderName: "gold mine",
    },
    "RES_2": {
        level: 1,
        name: "Mỏ dầu",
        size: {width: 3, height: 3}, 
        buildingRes: res.res_2_1_idle_image0000_png,
        offset: {x: 0, y: -30},
        assetFolderName: "elixir collector",
    },

    "BDH_1": {
        level: 1,
        name: "Nhà thợ xây",
        size: {width: 2, height: 2},
        buildingRes: res.builder_hut_idle_image0000_png,
        offset: {x: 0, y: -50},
        assetFolderName: "builder hut",
    },
    "CLC_1": {
        level: 1,
        name: "Clan Castle",
        size: {width: 3, height: 3},
        buildingRes: res.clc_1_0_idle_image0000_png,
        offset: {x:0, y: -30} ,
        assetFolderName: "clan_castle",
    },
    "DEF_1": {
        level: 1,
        name: "Pháo",
        size: {width: 3, height: 3},
        buildingRes: res.canon_1_idle_image0000_png,
        offset: {x:0, y: -45} ,
        assetFolderName: "cannon",
    },
    "DEF_2": {
        level: 1,
        name: "Tháp cung",
        size: { width: 3, height: 3 },
        buildingRes: res.def_2_1_shadow_png,
        offset: { x: 0, y: 45},
        assetFolderName: "AcherTower",
    },
    "DEF_3": {
        level: 1,
        name: "Máy bắn đá",
        size: { width: 3, height: 3 },
        buildingRes: res.def_3_1_idle_image0000_png,
        offset: { x: 0, y: -100 },
        assetFolderName: "Motar",
    },
    "STO_1": {
        level: 1,
        name: "Kho vàng",
        size: { width: 3, height: 3 },
        buildingRes: res.sto_1_1_idle_image0000_png,
        offset: { x: 5, y: -100 },
        assetFolderName: "gold storage",
    },
    "STO_2": {
        level: 1,
        name: "Kho dầu",
        size: { width: 3, height: 3 },
        buildingRes: res.sto_2_1_idle_image0000_png,
        offset: { x: 0, y: -30 },
        assetFolderName: "elixir storage",
    },
    "BAR_1": {
        level: 1,
        name: "Nhà lính",
        size: { width: 3, height: 3 },
        buildingRes: res.bar_1_1_idle_image0000_png,
        offset: { x: 0, y: -160 },
        assetFolderName: "barrack",
    },
    "BAR_2": {
        level: 1,
        name: "Nhà X-men",
        size: { width: 3, height: 3 },
        buildingRes: res.bar_2_png,
        offset: { x: 0, y: -30 },
        assetFolderName: "barrack 2",
    },
    "WAL_1": {
        level: 1,
        name: "Tường",
        size: { width: 3, height: 3 },
        buildingRes: res.wal_1_png,
        offset: { x: 0, y: -87 },
        assetFolderName: "barrack 2",
    },
};

// OBSTACLE_BASE_SPRITE_CONFIG: Configuration for obstacle base sprites.
const OBSTACLE_BASE_SPRITE_CONFIG = {
    "2x2": { res: res.grass_0_2_obs_png, name: "Obstacle Base 2x2" }, 
    "3x3": { res: res.grass_0_3_obs_png, name: "Obstacle Base 3x3" }, 
};

// OBSTACLE_CONFIG: Defines properties for each obstacle type.
const OBSTACLE_CONFIG = {
    "OBS_1": { 
        name: "Obstacle Type 1 (e.g., Small Rock)", 
        obstacleRes: res.obs_1_idle_image0000_png, 
        size: {width:2, height:2}, 
        offset: {x:0, y: -30} ,
    },
    "OBS_2": { 
        name: "Obstacle Type 2 (e.g., Bush)", 
        obstacleRes: res.obs_2_idle_image0000_png, 
        size: {width:2, height:2}, 
        offset: {x:0, y: -30} ,
    },
    "OBS_3": { 
        name: "Obstacle Type 3", 
        obstacleRes: res.obs_3_idle_image0000_png, 
        size: {width:2, height:2}, 
        offset: {x:0, y: -30} 
    },
    "OBS_4": { 
        name: "Obstacle Type 4", 
        obstacleRes: res.obs_4_idle_image0000_png, 
        size: {width:2, height:2}, 
        offset: {x:0, y: -30} 
    },
    "OBS_5": { 
        name: "Obstacle Type 5", 
        obstacleRes: res.obs_5_idle_image0000_png, 
        size: {width:2, height:2}, 
        offset: {x:0, y: -30} 
    },
    "OBS_6": { 
        name: "Obstacle Type 6", 
        obstacleRes: res.obs_6_idle_image0000_png, 
        size: {width:2, height:2}, 
        offset: {x:0, y: -30} 
    },
    "OBS_7": { 
        name: "Obstacle Type 7", 
        obstacleRes: res.obs_7_idle_image0000_png, 
        size: {width:3, height:3}, 
        offset: {x:0, y: -60} 
    },
    "OBS_8": { 
        name: "Obstacle Type 8", 
        obstacleRes: res.obs_8_idle_image0000_png, 
        size: {width:3, height:3}, 
        offset: {x:-5, y: -60} 
    },
    "OBS_9": { 
        name: "Obstacle Type 9", 
        obstacleRes: res.obs_9_idle_image0000_png, 
        size: {width:2, height:2}, 
        offset: {x:0, y: -30} 
    },
    "OBS_10": { 
        name: "Obstacle Type 10", 
        obstacleRes: res.obs_10_idle_image0000_png, 
        size: {width:2, height:2}, 
        offset: {x:0, y: -30} 
    },
    "OBS_11": { 
        name: "Obstacle Type 11", 
        obstacleRes: res.obs_11_idle_image0000_png, 
        size: {width:2, height:2}, 
        offset: {x:0, y: -30} 
    },
    "OBS_12": { 
        name: "Obstacle Type 12", 
        obstacleRes: res.obs_12_idle_image0000_png, 
        size: {width:2, height:2}, 
        offset: {x:0, y: -30} 
    },
    "OBS_13": { 
        name: "Obstacle Type 13", 
        obstacleRes: res.obs_13_idle_image0000_png, 
        size: {width:2, height:2}, 
        offset: {x:0, y: -30} 
    },
    "OBS_14": { 
        name: "Obstacle Type 14", 
        obstacleRes: res.obs_14_idle_image0000_png, 
        size: {width:3, height:3}, 
        offset: {x:0, y: -60} 
    },
    "OBS_15": {
        name: "Obstacle Type 15",
        obstacleRes: res.obs_15_idle_image0000_png,
        size: {width:1, height:1},
        offset: {x:0, y: -60}
    },
    "OBS_16": {
        name: "Obstacle Type 16",
        obstacleRes: res.obs_16_idle_image0000_png,
        size: {width:2, height:2},
        offset: {x:0, y: -20}
    },
    "OBS_17": {
        name: "Obstacle Type 17",
        obstacleRes: res.obs_17_idle_image0000_png,
        size: {width:2, height:2},
        offset: {x:-5, y: -30}
    },
    "OBS_18": {
        name: "Obstacle Type 18",
        obstacleRes: res.obs_18_idle_image0000_png,
        size: {width:2, height:2},
        offset: {x:0, y: -60}
    },
    "OBS_19": {
        name: "Obstacle Type 19",
        obstacleRes: res.obs_19_idle_image0000_png,
        size: {width:2, height:2},
        offset: {x:0, y: -30}
    },
    "OBS_20": {
        name: "Obstacle Type 20",
        obstacleRes: res.obs_20_idle_image0000_png,
        size: {width:3, height:3},
        offset: {x:0, y: -70}
    },
    "OBS_21": {
        name: "Obstacle Type 21",
        obstacleRes: res.obs_21_idle_image0000_png,
        size: {width:3, height:3},
        offset: {x:0, y: 0}
    },
    "OBS_22": {
        name: "Obstacle Type 22",
        obstacleRes: res.obs_22_idle_image0000_png,
        size: {width:3, height:3},
        offset: {x:0, y: 0}
    },
    "OBS_23": {
        name: "Obstacle Type 23",
        obstacleRes: res.obs_23_idle_image0000_png,
        size: {width:3, height:3},
        offset: {x:0, y: 0}
    },
    "OBS_24": {
        name: "Obstacle Type 24",
        obstacleRes: res.obs_24_idle_image0000_png,
        size: {width:2, height:2},
        offset: {x:0, y: -30}
    },
    "OBS_25": {
        name: "Obstacle Type 25",
        obstacleRes: res.obs_25_idle_image0000_png,
        size: {width:2, height:2},
        offset: {x:0, y: -100}
    },
    "OBS_26": {
        name: "Obstacle Type 26",
        obstacleRes: res.obs_26_idle_image0000_png,
        size: {width:2, height:2},
        offset: {x:0, y: -100}
    },
    "OBS_27": {
        name: "Obstacle Type 27",
        obstacleRes: res.obs_27_idle_image0000_png,
        size: {width:2, height:2},
        offset: {x:0, y: -100}
    },

};

const SELECTION_INDICATOR_CONFIG = {
    "2x2": { res: res.arrowmove2_png, name: "Select Indicator 2x2" },
    "3x3": { res: res.arrowmove3_png, name: "Select Indicator 3x3" },
    "4x4": { res: res.arrowmove4_png, name: "Select Indicator 4x4" },
    "5x5": { res: res.arrowmove5_png, name: "Select Indicator 5x5" },
};

const PLACEMENT_INDICATOR_CONFIG = {
    "2x2": { 
        validRes: res.green_2_png, 
        invalidRes: res.red_2_png, 
        name: "Placement Base 2x2" 
    },
    "3x3": { 
        validRes: res.green_3_png, 
        invalidRes: res.red_3_png, 
        name: "Placement Base 3x3" 
    },
    "4x4": { 
        validRes: res.green_4_png, 
        invalidRes: res.red_4_png, 
        name: "Placement Base 4x4" 
    },
    "5x5": { 
        validRes: res.green_5_png, 
        invalidRes: res.red_5_png, 
        name: "Placement Base 5x5" 
    },
};
