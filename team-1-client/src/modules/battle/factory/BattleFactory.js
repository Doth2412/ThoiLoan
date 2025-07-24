/**
 * BattleFactory.js: Handles loading map data and creating all visual and logical
 * game objects (buildings, walls, obstacles) for the battle.
 */
var BattleFactory = cc.Class.extend({
    gridSystem: null,
    pathfindingGrid: null,
    tmxMapNode: null,

    ctor: function(gridSystem, pathfindingGrid, tmxMapNode) {
        this.gridSystem = gridSystem;
        this.pathfindingGrid = pathfindingGrid;
        this.tmxMapNode = tmxMapNode;
    },

    /**
     * Loads map data from JSON and creates all buildings, obstacles, and walls.
     * @param {number} mapIndex - The index of the map to load.
     * @returns {{enemyBuildings: Array<EnemyBuilding>, mapData: Object}}
     */
    createWorldFromMap: function(mapIndex, battleScene) {
        var jsonStr = jsb.fileUtils.getStringFromFile(res["_" + mapIndex + "_map"]);
        var mapData = JSON.parse(jsonStr);
        if (!mapData || !mapData.house) {
            cc.error("BattleFactory: Failed to load or parse map data for index: " + mapIndex);
            return { enemyBuildings: [], mapData: null };
        }

        var enemyBuildings = [];
        var enemyAsset = mapData.house;

        // 1. Create logical objects and place them on the pathfinding grid
        for (var i = 0; i < enemyAsset.length; i++) {
            var assetData = enemyAsset[i];
            assetData.buildingType = assetData.objType;

            if (assetData.objType.startsWith("TRA")) continue;

            if (assetData.objType.startsWith("WAL")) {
                assetData.gridX = assetData.cell % BATTLE_GRID_WIDTH;
                assetData.gridY = Math.floor(assetData.cell / BATTLE_GRID_WIDTH);
                var wallConfig = ItemConfigUtils.getBuildingConfig(assetData);
                if (wallConfig) {
                    var logicalWall = new EnemyBuilding(assetData, wallConfig, battleScene);
                    logicalWall.id = "wall_" + assetData.gridX + "_" + assetData.gridY; 
                    logicalWall.buildingType = assetData.objType;
                    logicalWall.level = assetData.level;
                    logicalWall.gridX = assetData.gridX;
                    logicalWall.gridY = assetData.gridY;
                    logicalWall.width = wallConfig.width; 
                    logicalWall.height = wallConfig.height; 

                    enemyBuildings.push(logicalWall);
                    this.pathfindingGrid.placeWall(logicalWall.gridX, logicalWall.gridY, logicalWall.id); // Pass buildingId
                    this.pathfindingGrid.placeBuilding(logicalWall.id, logicalWall.gridX, logicalWall.gridY, logicalWall.width, logicalWall.height);
                } else {
                    cc.error("BattleFactory: Missing config for wall type: " + assetData.objType);
                }
            } else if (assetData.objType.startsWith("OBS")) {
                this._createObstacle(assetData);
            } else {
                var config = ItemConfigUtils.getBuildingConfig(assetData);
                if (config) {
                    var logicalBuilding = new EnemyBuilding(assetData, config, battleScene);
                    enemyBuildings.push(logicalBuilding);
                    this.pathfindingGrid.placeBuilding(logicalBuilding.id, logicalBuilding.gridX, logicalBuilding.gridY, logicalBuilding.width, logicalBuilding.height);
                }
            }
        }

        // 2. Create visual sprites for the logical objects
        for (var j = 0; j < enemyBuildings.length; j++) {
            var building = enemyBuildings[j];
            if (building.buildingType.startsWith("WAL")) {
                this._createWallSprite(building);
            } else {
                this._createEnemyBuildingSprite(building);
            }
        }

        return { enemyBuildings: enemyBuildings, mapData: mapData };
    },

    /**
     * Creates the visual representation of an enemy building.
     * (Moved from BattleScene._createEnemyBuilding)
     */
    _createEnemyBuildingSprite: function (enemyBuildingData) {
        var config = BUILDING_UI_CONFIG[enemyBuildingData.buildingType];
        var compositeNode = new cc.Node();
        enemyBuildingData.compositeNode = compositeNode;
        var screenPos = this.gridSystem.gridToLocal(enemyBuildingData.gridX, enemyBuildingData.gridY);
        compositeNode.setPosition(screenPos);

        var buildingConfig = ItemConfigUtils.getBuildingConfig(enemyBuildingData);
        cc.log(JSON.stringify(buildingConfig));
        var coreX = enemyBuildingData.gridX + buildingConfig.width/2;
        var coreY = enemyBuildingData.gridY + buildingConfig.height/2;
        let zOrder = MAX_Z_ORDER -  (44 * coreY + coreX);
        cc.log("Building " + enemyBuildingData.buildingType + " at (" + coreX + ", " + coreY + ") with zOrder: " + zOrder);
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
                var baseOffsetX = baseMeta.offset.x;
                var baseOffsetY = baseMeta.offset.y;
                basePlatformSprite.setPosition(baseOffsetX, baseOffsetY);

                enemyBuildingData.basePlatformSprite = basePlatformSprite;
            }
            if (assetPaths.anim) {
                var turretSprite = new cc.Sprite(assetPaths.anim);
                compositeNode.addChild(turretSprite, 1);
                turretSprite.setAnchorPoint(0.5, 0);
                var animMeta = DEFENSIVE_ANIMATION_METADATA[enemyBuildingData.buildingType][enemyBuildingData.level].defenseAnim;
                var animOffsetX = (animMeta && animMeta.idle && animMeta.idle.offset && typeof animMeta.idle.offset.x === 'number') ? animMeta.idle.offset.x : buildingOffsetX;
                var animOffsetY = (animMeta && animMeta.idle && animMeta.idle.offset && typeof animMeta.idle.offset.y === 'number') ? animMeta.idle.offset.y : buildingOffsetY;
                turretSprite.setPosition(animOffsetX, animOffsetY);

                enemyBuildingData.turretSprite = turretSprite;
        turretSprite.setName("buildingSprite");
        enemyBuildingData._createHealthBar();
    }
        } else {
            var assetPath = AssetUtils.getBuildingLevelIdleAssetPath(enemyBuildingData.buildingType, enemyBuildingData.level);
            var buildingSprite = new cc.Sprite(assetPath);
            buildingSprite.setAnchorPoint(0.5, 0);
            buildingSprite.setPosition(buildingOffsetX, buildingOffsetY);
            compositeNode.addChild(buildingSprite);
            buildingSprite.setName("buildingSprite");
            enemyBuildingData.turretSprite = buildingSprite;
            enemyBuildingData._createHealthBar(); 
        }

        var buildingConfig = ItemConfigUtils.getBuildingConfig(enemyBuildingData, enemyBuildingData.level);
        var basePath = res["grass_" + buildingConfig.width + "_goblin_png"];
        var baseSprite = new cc.Sprite(basePath);
        baseSprite.setAnchorPoint(0.5, 0);
        baseSprite.setScale(BASE_SPRITE_SCALE_FACTOR);
        baseSprite.setPosition(screenPos);
        this.tmxMapNode.addChild(baseSprite);
        this.tmxMapNode.addChild(compositeNode, zOrder);
        return compositeNode;
    },

    /**
     * Creates the visual representation of a wall segment.
     * (Moved from BattleScene._createWallSprite)
     */
    _createWallSprite: function (logicalWall) {
        var config = BUILDING_UI_CONFIG[logicalWall.buildingType];
        var gridX = logicalWall.gridX;
        var gridY = logicalWall.gridY;

        var compositeNode = new cc.Node();
        logicalWall.compositeNode = compositeNode;
        var screenPos = this.gridSystem.gridToLocal(gridX, gridY);
        compositeNode.setPosition(screenPos);

        var zOrder = GRID_BASE_Z_ORDER + (BATTLE_GRID_WIDTH - gridY);
        compositeNode.setLocalZOrder(zOrder);

        var wallNeighbor = this._wallNeighborDetector(gridX, gridY);
        var imageNumber = parseInt(wallNeighbor, 2);
        var assetPath = res[logicalWall.buildingType.toLowerCase() + "_" + logicalWall.level + "_idle_image000" + imageNumber + "_png"];

        var wallSprite = new cc.Sprite(assetPath);
        if (!wallSprite || !wallSprite.getTexture() || (wallSprite.getTexture().isLoaded && !wallSprite.getTexture().isLoaded())) {
            cc.error("BattleFactory: Failed to load wall sprite from path: " + assetPath);
            return;
        }

        wallSprite.setAnchorPoint(0.5, 0);
        var offsetX = (config.offset && typeof config.offset.x === 'number') ? config.offset.x : 0;
        var offsetY = (config.offset && typeof config.offset.y === 'number') ? config.offset.y : 0;
        wallSprite.setPosition(offsetX, offsetY);
        compositeNode.addChild(wallSprite);

        logicalWall.turretSprite = wallSprite;
        logicalWall._createHealthBar(); 

        var baseSprite = new cc.Sprite(res["grass_1_goblin_png"]);
        baseSprite.setAnchorPoint(0.5, 0);
        baseSprite.setScale(BASE_SPRITE_SCALE_FACTOR);
        baseSprite.setPosition(screenPos);
        this.tmxMapNode.addChild(baseSprite);
        this.tmxMapNode.addChild(compositeNode, zOrder);
    },

    /**
     * Creates the visual representation of an obstacle.
     * (Moved from BattleScene._createObstacle)
     */
    _createObstacle: function (obstacleData) {
        var config = ItemConfigUtils.getBuildingConfig(obstacleData, obstacleData.level);
        var uiConfig = OBSTACLE_CONFIG[obstacleData.objType];
        if (!config) {
            cc.warn("BattleFactory: Missing config for obstacle type " + obstacleData.objType);
            return null;
        }

        var posX = obstacleData.cell % BATTLE_GRID_WIDTH;
        var posY = Math.floor(obstacleData.cell / BATTLE_GRID_WIDTH);
        var obstacleId = "obstacle_" + obstacleData.cell;

        this.pathfindingGrid.placeBuilding(obstacleId, posX, posY, config.width, config.height);

        var compositeNode = new cc.Node();
        var screenPos = this.gridSystem.gridToLocal(posX, posY);
        compositeNode.setPosition(screenPos);

        var zOrder = GRID_BASE_Z_ORDER + (BATTLE_GRID_WIDTH - posY);
        compositeNode.setLocalZOrder(zOrder);
        var obstacleRes = res[obstacleData.objType.toLowerCase() + "_idle_image0000_png"];
        var obstacleSprite = new cc.Sprite(obstacleRes);
        compositeNode.addChild(obstacleSprite);
        obstacleSprite.setAnchorPoint(0.5, 0);

        var offsetX = uiConfig.offset.x;
        var offsetY = uiConfig.offset.y;
        cc.log("Creating obstacle " + obstacleData.objType + " at (" + posX + ", " + posY + ") with offset: " + offsetX + ", " + offsetY);
        obstacleSprite.setPosition(offsetX, offsetY);

        var obstacleConfig = ItemConfigUtils.getBuildingConfig(obstacleData, obstacleData.level);
        var basePath = res["grass_" + obstacleConfig.width + "_obs_goblin_png"];
        var baseSprite = new cc.Sprite(basePath);
        baseSprite.setAnchorPoint(0.5, 0);
        baseSprite.setScale(BASE_SPRITE_SCALE_FACTOR);
        baseSprite.setPosition(screenPos);
        this.tmxMapNode.addChild(baseSprite);
        this.tmxMapNode.addChild(compositeNode, zOrder);
        return compositeNode;
    },

    /**
     * Detects neighboring walls to select the correct sprite.
     */
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
    }
});
