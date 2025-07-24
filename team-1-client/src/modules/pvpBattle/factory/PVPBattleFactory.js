/**
 * PVPBattleFactory.js: Handles creating visual and logical objects for PvP battles.
 */
var PVPBattleFactory = cc.Class.extend({
    gridSystem: null,
    pathfindingGrid: null,
    mapElement: null,

    ctor: function(gridSystem, pathfindingGrid, mapElement) {
        this.gridSystem = gridSystem;
        this.pathfindingGrid = pathfindingGrid;
        this.mapElement = mapElement;
    },

    /**
     * Creates the entire opponent's world from their data.
     * @param {Object} opponentData - The data object for the opponent's base.
     * @param {PVPBattleScene} pvpBattleScene - The scene to add objects to.
     * @returns {{enemyBuildings: Array<EnemyBuilding>, mapData: Object}}
     */
    createWorldFromOpponentData: function(opponentData, pvpBattleScene) {
        var enemyBuildings = [];

        // --- 1. Create Logical Buildings and Obstacles ---
        // Process buildings first
        if (opponentData.buildings) {
            for (var i = 0; i < opponentData.buildings.length; i++) {
                var buildingData = opponentData.buildings[i];
                var config = ItemConfigUtils.getBuildingConfig({ buildingType: buildingData.type, level: buildingData.level });

                if (config) {
                    // Adapt data structure to be compatible with EnemyBuilding ctor
                    var adaptedData = {
                        objType: buildingData.type,
                        level: buildingData.level,
                        gridX: buildingData.position.x,
                        gridY: buildingData.position.y
                    };

                    var logicalBuilding = new EnemyBuilding(adaptedData, config, pvpBattleScene);

                    // *** CRITICAL FIX: Add the created building to the array ***
                    enemyBuildings.push(logicalBuilding);

                    // Place on pathfinding grid
                    if (this.pathfindingGrid) {
                        if (logicalBuilding.buildingType.startsWith("WAL_")) {
                            logicalBuilding.id = "wall_" + logicalBuilding.gridX + "_" + logicalBuilding.gridY;
                            this.pathfindingGrid.placeWall(logicalBuilding.gridX, logicalBuilding.gridY, logicalBuilding.id);
                        }
                        this.pathfindingGrid.placeBuilding(logicalBuilding.id, logicalBuilding.gridX, logicalBuilding.gridY, config.width, config.height);
                    }
                } else {
                    cc.warn("PVPBattleFactory: Missing config for building type: " + buildingData.type);
                }
            }
        }

        // Process obstacles
        if (opponentData.obstacles) {
            for (var j = 0; j < opponentData.obstacles.length; j++) {
                var obstacleData = opponentData.obstacles[j];
                var config = ItemConfigUtils.getBuildingConfig({ buildingType: obstacleData.type });
                if (config) {
                    var obstacleId = "obstacle_" + obstacleData.position.x + "_" + obstacleData.position.y;
                    if (this.pathfindingGrid) {
                        this.pathfindingGrid.placeBuilding(obstacleId, obstacleData.position.x, obstacleData.position.y, config.width, config.height);
                    }
                }
            }
        }

        // --- 2. Create Visual Sprites for all created objects ---
        // Create visuals for buildings (including walls)
        for (var k = 0; k < enemyBuildings.length; k++) {
            var building = enemyBuildings[k];
            if (building.buildingType.startsWith("WAL_")) {
                this._createWallSprite(building);
            } else {
                this._createEnemyBuildingSprite(building);
            }
        }

        // Create visuals for obstacles
        if (opponentData.obstacles) {
            for (var l = 0; l < opponentData.obstacles.length; l++) {
                var obstacle = opponentData.obstacles[l];
                var config = ItemConfigUtils.getBuildingConfig({ buildingType: obstacle.type });
                if(config){
                    this._createObstacleVisuals(obstacle, config);
                }
            }
        }

        return {
            enemyBuildings: enemyBuildings,
            mapData: { resourse: opponentData.resources || { gold: 0, elixir: 0 } }
        };
    },

    _createEnemyBuildingSprite: function (enemyBuildingData) {
        var config = BUILDING_UI_CONFIG[enemyBuildingData.buildingType];
        var compositeNode = new cc.Node();
        enemyBuildingData.compositeNode = compositeNode;
        var screenPos = this.gridSystem.gridToLocal(enemyBuildingData.gridX, enemyBuildingData.gridY);
        compositeNode.setPosition(screenPos);

        var buildingConfig = ItemConfigUtils.getBuildingConfig(enemyBuildingData);
        var coreX = enemyBuildingData.gridX + buildingConfig.width/2;
        var coreY = enemyBuildingData.gridY + buildingConfig.height/2;
        let zOrder = MAX_Z_ORDER -  (44 * coreY + coreX);
        compositeNode.setLocalZOrder(zOrder);

        var buildingOffsetX = (config.offset && typeof config.offset.x === 'number') ? config.offset.x : 0;
        var buildingOffsetY = (config.offset && typeof config.offset.y === 'number') ? config.offset.y : 0;

        if (enemyBuildingData.buildingType.startsWith("DEF_")) {
            var assetPaths = AssetUtils.getDefensiveBuildingAssetPaths(enemyBuildingData.buildingType, enemyBuildingData.level);
            if (assetPaths.base) {
                var basePlatformSprite = new cc.Sprite(assetPaths.base);
                compositeNode.addChild(basePlatformSprite, 0);
                basePlatformSprite.setAnchorPoint(0.5, 0);
                var baseMeta = DEFENSIVE_ANIMATION_METADATA[enemyBuildingData.buildingType][enemyBuildingData.level].base;
                basePlatformSprite.setPosition(baseMeta.offset.x, baseMeta.offset.y);
                enemyBuildingData.basePlatformSprite = basePlatformSprite;
            }
            if (assetPaths.anim) {
                var turretSprite = new cc.Sprite(assetPaths.anim);
                compositeNode.addChild(turretSprite, 1);
                turretSprite.setAnchorPoint(0.5, 0);
                var animMeta = DEFENSIVE_ANIMATION_METADATA[enemyBuildingData.buildingType][enemyBuildingData.level].defenseAnim;
                var animOffsetX = (animMeta && animMeta.idle.offset.x) ? animMeta.idle.offset.x : buildingOffsetX;
                var animOffsetY = (animMeta && animMeta.idle.offset.y) ? animMeta.idle.offset.y : buildingOffsetY;
                turretSprite.setPosition(animOffsetX, animOffsetY);
                enemyBuildingData.turretSprite = turretSprite;
                turretSprite.setName("buildingSprite");
            }
        } else {
            var assetPath = AssetUtils.getBuildingLevelIdleAssetPath(enemyBuildingData.buildingType, enemyBuildingData.level);
            var buildingSprite = new cc.Sprite(assetPath);
            buildingSprite.setAnchorPoint(0.5, 0);
            buildingSprite.setPosition(buildingOffsetX, buildingOffsetY);
            compositeNode.addChild(buildingSprite);
            buildingSprite.setName("buildingSprite");
            enemyBuildingData.turretSprite = buildingSprite;
        }

        var baseSizeKey = config.size.width + "x" + config.size.height;
        var baseConfig = BASE_SPRITE_CONFIG[baseSizeKey];
        if (baseConfig) {
            var baseSprite = new cc.Sprite(baseConfig.res);
            baseSprite.setAnchorPoint(0.5, 0);
            baseSprite.setScale(BASE_SPRITE_SCALE_FACTOR);
            baseSprite.setPosition(screenPos);
            this.mapElement.addChild(baseSprite, GRID_BASE_Z_ORDER);
        }

        this.mapElement.addChild(compositeNode, zOrder);
    },

    _createWallSprite: function (logicalWall) {
        var config = BUILDING_UI_CONFIG[logicalWall.buildingType];
        var compositeNode = new cc.Node();
        logicalWall.compositeNode = compositeNode;
        var screenPos = this.gridSystem.gridToLocal(logicalWall.gridX, logicalWall.gridY);
        compositeNode.setPosition(screenPos);

        var zOrder = MAX_Z_ORDER -  (44 * logicalWall.gridY + logicalWall.gridX);
        compositeNode.setLocalZOrder(zOrder);

        var wallNeighbor = this._wallNeighborDetector(logicalWall.gridX, logicalWall.gridY);
        var imageNumber = parseInt(wallNeighbor, 2);
        var assetPath = res[logicalWall.buildingType.toLowerCase() + "_" + logicalWall.level + "_idle_image000" + imageNumber + "_png"];

        var wallSprite = new cc.Sprite(assetPath);
        wallSprite.setAnchorPoint(0.5, 0);
        var offsetX = (config.offset && config.offset.x) ? config.offset.x : 0;
        var offsetY = (config.offset && config.offset.y) ? config.offset.y : 0;
        wallSprite.setPosition(offsetX, offsetY);
        compositeNode.addChild(wallSprite);
        logicalWall.turretSprite = wallSprite;

        var baseSprite = new cc.Sprite(res["grass_1_goblin_png"]);
        baseSprite.setAnchorPoint(0.5, 0);
        baseSprite.setScale(BASE_SPRITE_SCALE_FACTOR);
        baseSprite.setPosition(screenPos);
        this.mapElement.addChild(baseSprite, GRID_BASE_Z_ORDER);
        this.mapElement.addChild(compositeNode, zOrder);
    },

    _wallNeighborDetector: function (gridX, gridY) {
        var rightWall = "0";
        var upperWall = "0";
        var cellRight = this.pathfindingGrid.getCell(gridX + 1, gridY);
        if (cellRight && (cellRight.state === PathfindingGrid.CELL_STATE.WALL)) {
            rightWall = "1";
        }
        var cellAbove = this.pathfindingGrid.getCell(gridX, gridY + 1);
        if (cellAbove && (cellAbove.state === PathfindingGrid.CELL_STATE.WALL)) {
            upperWall = "1";
        }
        return upperWall + rightWall;
    },

    _createObstacleVisuals: function(obstacleData, config) {
        var uiConfig = OBSTACLE_CONFIG[obstacleData.type];
        var screenPos = this.gridSystem.gridToLocal(obstacleData.position.x, obstacleData.position.y);
        var compositeNode = new cc.Node();
        compositeNode.setPosition(screenPos);

        var zOrder = MAX_Z_ORDER - (40 * obstacleData.position.x + obstacleData.position.y);
        compositeNode.setLocalZOrder(zOrder);

        var obstacleRes = res[obstacleData.type.toLowerCase() + "_idle_image0000_png"];
        var obstacleSprite = new cc.Sprite(obstacleRes);
        obstacleSprite.setAnchorPoint(0.5, 0);
        var offsetX =  uiConfig.offset.x
        var offsetY = uiConfig.offset.y
        obstacleSprite.setPosition(offsetX, offsetY);
        compositeNode.addChild(obstacleSprite);

        var baseSizeKey = config.width + "x" + config.height;
        var baseConfig = OBSTACLE_BASE_SPRITE_CONFIG[baseSizeKey];
        if (baseConfig) {
            var baseSprite = new cc.Sprite(baseConfig.res);
            baseSprite.setAnchorPoint(0.5, 0);
            baseSprite.setScale(OBSTACLE_BASE_SPRITE_SCALE_FACTOR);
            baseSprite.setPosition(screenPos);
            this.mapElement.addChild(baseSprite, GRID_BASE_Z_ORDER);
        }

        this.mapElement.addChild(compositeNode, zOrder);
        return compositeNode;
    },
});
