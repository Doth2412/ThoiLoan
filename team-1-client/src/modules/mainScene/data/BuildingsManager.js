// BuildingsManager.js

const GRID_BASE_Z_ORDER = 1;
const MAX_Z_ORDER = 1600;
const BASE_SPRITE_LOCAL_Z = 0;
const BUILDING_SPRITE_LOCAL_Z = 1;
const OBSTACLE_BASE_SPRITE_LOCAL_Z = 0;
const OBSTACLE_SPRITE_LOCAL_Z = 1;
const BASE_SPRITE_SCALE_FACTOR = 2.0;
const OBSTACLE_BASE_SPRITE_SCALE_FACTOR = 2.0;
const SELECTION_INDICATOR_LOCAL_Z = 2; // Ensure it's above building and base
const UPGRADING_INDICATOR_LOCAL_Z = 2;

var BuildingsManager = cc.Class.extend({
    gridSystem: null,
    mapElement: null,
    placedBuildings: null,
    placedObstacles: null,
    resourceGeneratorManager: null,
    barrackManager: null,
    mainScene: null,
    hasBeenInitialized: false,

    ctor: function () {
        this.placedBuildings = [];
        this.placedObstacles = [];
        this.resourceGeneratorManager = new ResourceGeneratorManager(this, this.mainScene);
        this.barrackManager = new BarrackManager(this, this.mainScene);
        this.pathfindingGrid = new PathfindingGrid();
        if (!this._gemPurchaseListener) {
            this._gemPurchaseListener = cc.eventManager.addCustomListener(
                "GEM_PURCHASE_COMPLETE",
                this._onGemPurchaseComplete.bind(this)
            );
        }
    },

    initFromPlayerData: function (mainUIInstance) {
        if (this.hasBeenInitialized) {
            return;
        }

        this.mapElement = mainUIInstance.mapElement;
        this.gridSystem = mainUIInstance.gridSystem;
        this.mainScene = mainUIInstance;


        var playerDataManager = PlayerDataManager.getInstance();
        var buildingsData = playerDataManager.getInitBuildingsData();
        var obstaclesData = playerDataManager.getInitObstaclesData();

        this.loadBuildingsFromSave(buildingsData);
        this.loadObstaclesFromSave(obstaclesData);

        this.hasBeenInitialized = true;
    },

    attachAllVisualsToScene: function (mainUIInstance) {
        this.placedBuildings.forEach(building => {
            if (building.compositeNode.getParent()) {
                building.compositeNode.removeFromParent(false);
            }
            if (building.baseSprite.getParent()) {
                building.baseSprite.removeFromParent(false);
            }
            mainUIInstance.mapElement.addChild(building.compositeNode);
            mainUIInstance.mapElement.addChild(building.baseSprite);
        });

        this.placedObstacles.forEach(obstacle => {
            if (obstacle.compositeNode.getParent()) {
                obstacle.compositeNode.removeFromParent(false);
            }
            if (obstacle.baseSprite.getParent()) {
                obstacle.baseSprite.removeFromParent(false);
            }
            mainUIInstance.mapElement.addChild(obstacle.compositeNode);
            mainUIInstance.mapElement.addChild(obstacle.baseSprite);
        });
    },

    getPathfindingGrid: function () {
        return this.pathfindingGrid;
    },

    createBuilding: function (buildingInitData) {
        var buildingIndex = this.placedBuildings.length;
        var config = BUILDING_UI_CONFIG[buildingInitData.buildingName];
        if (!config) {
            cc.warn("BuildingsManager: Missing config for building: " + buildingInitData.buildingName);
            return null;
        }

        var buildingData = {
            buildingType: buildingInitData.buildingName,
            level: buildingInitData.level,
            buildingIndex: buildingIndex,
            posX: buildingInitData.posX,
            posY: buildingInitData.posY,
            buildingState: buildingInitData.buildingState,
            stateStartTime: buildingInitData.stateStartTime,
            accumulatedResources: buildingInitData.accumulatedResources,
            trainingQueue: buildingInitData.trainingQueue,
            config: config,
            assetType: 'building',
            compositeNode: null,
            baseSprite: null,
            buildingSprite: null,
            selectionIndicator: null,
            upgradingIndicator: null,
            upgradingProgressBar: null,
            isInBuyingPhase: false

        };

        var newBuilding;
        switch (true) {
            case buildingData.buildingType.startsWith("RES"):
                newBuilding = new ResourceGenerator(buildingData);
                break;
            case buildingData.buildingType.startsWith("BAR"):
                newBuilding = new Barrack(buildingData);
                break;
            case buildingData.buildingType.startsWith("AMC"):
                newBuilding = new ArmyCamp(buildingData);
                break;
            default:
                newBuilding = new Building(buildingData);
                break;
        }
        this.placedBuildings.push(newBuilding);
        return newBuilding;
    },

    createVisualsForBuilding: function (building, mainUIInstance) {
        if (!building || building.compositeNode) {
            return;
        }

        var config = building.config;
        var screenPos = mainUIInstance.gridSystem.gridToLocal(building.posX, building.posY);

        var compositeNode = new cc.Node();
        var baseSizeKey = config.size.width + "x" + config.size.height;
        var baseConfig = BASE_SPRITE_CONFIG[baseSizeKey];
        var baseSprite = new cc.Sprite(baseConfig.res);
        var assetPath = AssetUtils.getBuildingLevelIdleAssetPath(building.buildingType, building.level);
        var buildingSprite = new cc.Sprite(assetPath);
        var animationSprite = null;

        if (building.buildingType.startsWith("RES_")) {
            animationSprite = new cc.Sprite(assetPath);
        }

        var selectionIndicator = new cc.Sprite(SELECTION_INDICATOR_CONFIG[baseSizeKey].res);
        var upgradingIndicator = new cc.Sprite(res.upgrading_png);
        var upgradingProgressBar = this.createCustomProgressBar();

        compositeNode.update = function (dt) {
            if (this.logic && typeof this.logic.update === 'function') {
                this.logic.update(dt);
            }
        };

        building.compositeNode = compositeNode;
        building.baseSprite = baseSprite;
        building.buildingSprite = buildingSprite;
        building.animationSprite = animationSprite;
        building.selectionIndicator = selectionIndicator;
        building.upgradingIndicator = upgradingIndicator;
        building.upgradingProgressBar = upgradingProgressBar;

        building.compositeNode.logic = building;
        building.compositeNode.scheduleUpdate();

        var coreX = building.posX + config.size.width / 2;
        var coreY = building.posY + config.size.height / 2;
        let zOrder = MAX_Z_ORDER - (40 * coreX + coreY);

        compositeNode.setPosition(screenPos);
        compositeNode.setLocalZOrder(zOrder);

        baseSprite.setAnchorPoint(0.5, 0);
        baseSprite.setScale(BASE_SPRITE_SCALE_FACTOR);
        baseSprite.setPosition(screenPos);
        mainUIInstance.mapElement.addChild(baseSprite, 0);

        var buildingOffsetX = (config.offset && typeof config.offset.x === 'number') ? config.offset.x : 0;
        var buildingOffsetY = (config.offset && typeof config.offset.y === 'number') ? config.offset.y : 0;
        buildingSprite.setAnchorPoint(0.5, 0);
        buildingSprite.setPosition(buildingOffsetX, buildingOffsetY);
        compositeNode.addChild(buildingSprite, BUILDING_SPRITE_LOCAL_Z);

        if (animationSprite) {
            animationSprite.setAnchorPoint(0.5, 0);
            animationSprite.setPosition(buildingOffsetX, buildingOffsetY);
            compositeNode.addChild(animationSprite, BUILDING_SPRITE_LOCAL_Z + 1);
        }

        selectionIndicator.setAnchorPoint(0.5, 0);
        selectionIndicator.setPosition(0, 0);
        selectionIndicator.setVisible(false);
        compositeNode.addChild(selectionIndicator, SELECTION_INDICATOR_LOCAL_Z);

        upgradingIndicator.setAnchorPoint(0.5, 0);
        upgradingIndicator.setPosition(0, 0);
        compositeNode.addChild(upgradingIndicator, UPGRADING_INDICATOR_LOCAL_Z);

        upgradingIndicator.setVisible(false);
        upgradingProgressBar.setVisible(false);

        upgradingProgressBar.setPosition(0, 0);
        compositeNode.addChild(upgradingProgressBar, UPGRADING_INDICATOR_LOCAL_Z + 1);

        mainUIInstance.mapElement.addChild(compositeNode);

        if (building instanceof ResourceGenerator) {
            building._initializeHarvestIcon();
            building.setupVisualComponents();
        } else if (typeof building.setupVisualComponents === 'function') {
            building.setupVisualComponents();
        }
    },

    createAndAttachAllVisuals: function (mainUIInstance) {
        cc.log("BuildingsManager: Creating and attaching all visuals.");
        this.placedBuildings.forEach(building => {
            this.createVisualsForBuilding(building, mainUIInstance);
        });
        this.placedObstacles.forEach(obstacle => {
            this.createVisualsForObstacle(obstacle, mainUIInstance);
        });
    },

    toggleUpgradingIndicator: function (targetAsset, showIndicator) {
        if (!targetAsset || !targetAsset.upgradingIndicator || !targetAsset.upgradingProgressBar) {
            return;
        }
        var isVisible = !!showIndicator;
        targetAsset.upgradingIndicator.setVisible(isVisible);
        targetAsset.upgradingProgressBar.setVisible(isVisible);
    },

    createCustomProgressBar: function () {
        var containerNode = new cc.Node();
        var backgroundSprite = new cc.Sprite(res.bg_bar_4_png);
        backgroundSprite.setAnchorPoint(0.5, 0.5);
        backgroundSprite.setPosition(3, 0);
        containerNode.addChild(backgroundSprite, 0);
        var fillingSprite = new cc.Sprite(res.g_bar_png);
        var progressTimer = new cc.ProgressTimer(fillingSprite);
        progressTimer.setType(cc.ProgressTimer.TYPE_BAR);
        progressTimer.setMidpoint(cc.p(0, 0.5));
        progressTimer.setBarChangeRate(cc.p(1, 0));
        progressTimer.setPercentage(0);
        progressTimer.setPosition(0, 0);
        containerNode.addChild(progressTimer, 1);
        var timeLabel = new ccui.Text("0s", res.rowdies_regular_29_07_ttf, 16);
        timeLabel.enableOutline(cc.color(0, 0, 0), 1);
        timeLabel.setTextColor(cc.color.WHITE);
        timeLabel.setColor(cc.color.WHITE);
        timeLabel.setPosition(0, 0);
        containerNode.addChild(timeLabel, 2);
        containerNode.progressTimer = progressTimer;
        containerNode.timeLabel = timeLabel;
        containerNode.setContentSize(backgroundSprite.getContentSize());
        return containerNode;
    },

    createObstacleLogic: function (obstacleInitData) {
        var config = OBSTACLE_CONFIG[obstacleInitData.type];
        if (!config) {
            cc.warn("BuildingsManager: Missing config for obstacle: " + obstacleInitData.type);
            return null;
        }
        var obstacleData = {
            obstacleType: obstacleInitData.obstacleID,
            obstacleIndex: this.placedObstacles.length,
            posX: obstacleInitData.posX,
            posY: obstacleInitData.posY,
            config: config,
            assetType: 'obstacle',
            compositeNode: null,
            baseSprite: null,
            obstacleSprite: null,
            selectionIndicator: null
        };
        var newObstacle = new Obstacle(obstacleData);
        this.placedObstacles.push(newObstacle);
        return newObstacle;
    },

    createVisualsForObstacle: function (obstacle, mainUIInstance) {
        if (!obstacle || obstacle.compositeNode) {
            return;
        }
        var config = obstacle.config;
        var screenPos = mainUIInstance.gridSystem.gridToLocal(obstacle.posX, obstacle.posY);
        var compositeNode = new cc.Node();
        var obstacleSprite = new cc.Sprite(config.obstacleRes);
        var baseSizeKey = config.size.width + "x" + config.size.height;
        var baseConfig = OBSTACLE_BASE_SPRITE_CONFIG[baseSizeKey];
        var obstacleBaseSprite = new cc.Sprite(baseConfig.res);
        var selectionIndicator = new cc.Sprite(SELECTION_INDICATOR_CONFIG[baseSizeKey].res);
        obstacle.compositeNode = compositeNode;
        obstacle.obstacleSprite = obstacleSprite;
        obstacle.baseSprite = obstacleBaseSprite;
        obstacle.selectionIndicator = selectionIndicator;
        var coreX = obstacle.posX + config.size.width / 2;
        var coreY = obstacle.posY + config.size.height / 2;
        let zOrder = MAX_Z_ORDER - (40 * coreX + coreY);
        compositeNode.setPosition(screenPos);
        compositeNode.setLocalZOrder(zOrder);
        obstacleBaseSprite.setAnchorPoint(0.5, 0);
        obstacleBaseSprite.setScale(OBSTACLE_BASE_SPRITE_SCALE_FACTOR);
        compositeNode.addChild(obstacleBaseSprite, OBSTACLE_BASE_SPRITE_LOCAL_Z);
        var offsetX = (config.offset && typeof config.offset.x === 'number') ? config.offset.x : 0;
        var offsetY = (config.offset && typeof config.offset.y === 'number') ? config.offset.y : 0;
        obstacleSprite.setAnchorPoint(0.5, 0);
        obstacleSprite.setPosition(offsetX, offsetY);
        compositeNode.addChild(obstacleSprite, OBSTACLE_SPRITE_LOCAL_Z);
        selectionIndicator.setAnchorPoint(0.5, 0);
        selectionIndicator.setPosition(0, 0);
        selectionIndicator.setVisible(false);
        compositeNode.addChild(selectionIndicator, SELECTION_INDICATOR_LOCAL_Z);
        var upgradingIndicator = new cc.Sprite(res.upgrading_png);
        var upgradingProgressBar = this.createCustomProgressBar();
        obstacle.upgradingIndicator = upgradingIndicator;
        obstacle.upgradingProgressBar = upgradingProgressBar;
        upgradingIndicator.setAnchorPoint(0.5, 0);
        upgradingIndicator.setPosition(0, 0);
        upgradingIndicator.setVisible(false);
        compositeNode.addChild(upgradingIndicator, UPGRADING_INDICATOR_LOCAL_Z);
        upgradingProgressBar.setPosition(0, 0);
        upgradingProgressBar.setVisible(false);
        compositeNode.addChild(upgradingProgressBar, UPGRADING_INDICATOR_LOCAL_Z + 1);
        mainUIInstance.mapElement.addChild(compositeNode);
        compositeNode.update = function (dt) {
            if (this.logic && typeof this.logic.update === 'function') {
                this.logic.update(dt);
            }
        };
        obstacle.compositeNode.logic = obstacle;
        obstacle.compositeNode.scheduleUpdate();
    },

    _onGemPurchaseComplete: function (event) {
        var data = event.getUserData();
        if (data.target.assetType !== 'obstacle') {
            return;
        }
        this.startRemoveObstacle(data.target);
    },

    updateObstacles: function (dt) {},

    onObstacleRemovalComplete: function (obstacle) {
        if (!obstacle) return;
        var builderManager = BuilderManager.getInstance();
        var builderId = builderManager.getBuilderIdForTask(obstacle);
        if (builderId !== -1) {
            gv.testnetwork.connector.sendRemoveObstacleComplete(obstacle.obstacleType, obstacle.obstacleIndex, builderId);
        } else {
            cc.warn("Could not find assigned builder for completed obstacle: " + obstacle.obstacleIndex);
        }
        builderManager.onBuildingOperationComplete(obstacle);
        this.toggleUpgradingIndicator(obstacle, false);
        this.removeObstacle(obstacle.obstacleIndex);
    },

    loadBuildingsFromSave: function (buildingDataArray) {
        if (!buildingDataArray) buildingDataArray = [];
        for (var i = 0; i < buildingDataArray.length; i++) {
            var buildingData = buildingDataArray[i];
            var newBuilding = this.createBuilding(buildingData);
            if (this.pathfindingGrid && newBuilding && newBuilding.config && newBuilding.config.size) {
                this.pathfindingGrid.placeBuilding(
                    "building_" + newBuilding.buildingIndex,
                    newBuilding.posX, newBuilding.posY,
                    newBuilding.config.size.width, newBuilding.config.size.height
                );
            }
        }
        if (this.resourceGeneratorManager) {
            this.resourceGeneratorManager.logInitialResourceState();
        }
    },

    loadObstaclesFromSave: function (obstacleDataArray) {
        if (!obstacleDataArray) obstacleDataArray = [];
        for (var i = 0; i < obstacleDataArray.length; i++) {
            var obstacleData = obstacleDataArray[i];
            var newObstacle = this.createObstacleLogic(obstacleData);
            if (this.pathfindingGrid && newObstacle && newObstacle.config && newObstacle.config.size) {
                this.pathfindingGrid.placeBuilding(
                    "obstacle_" + newObstacle.obstacleIndex,
                    newObstacle.posX,
                    newObstacle.posY,
                    newObstacle.config.size.width,
                    newObstacle.config.size.height
                );
            }
        }
    },

    updateBuildingPosition: function (buildingIndex, newGridX, newGridY) {
        var foundBuilding = this.placedBuildings.find(b => b.buildingIndex === buildingIndex);
        if (!foundBuilding) {
            cc.error("BuildingsManager: Could not find building with ID " + buildingIndex + " to update position.");
            return;
        }
        if (this.pathfindingGrid) {
            this.pathfindingGrid.removeBuilding("building_" + foundBuilding.buildingIndex);
        }
        foundBuilding.posX = newGridX;
        foundBuilding.posY = newGridY;
        if (this.pathfindingGrid && foundBuilding.config && foundBuilding.config.size) {
            this.pathfindingGrid.placeBuilding(
                "building_" + foundBuilding.buildingIndex,
                newGridX,
                newGridY,
                foundBuilding.config.size.width,
                foundBuilding.config.size.height
            );
        }
        var newZOrder = MAX_Z_ORDER - (40 * foundBuilding.posX + foundBuilding.posY);
        foundBuilding.compositeNode.setLocalZOrder(newZOrder);
        if (foundBuilding.buildingType.indexOf("AMC") === 0) {
            cc.eventManager.dispatchCustomEvent("ARMY_CAMP_MOVED", { building: foundBuilding });
        }
        cc.eventManager.dispatchCustomEvent("BUILDING_MOVED", { building: foundBuilding });
    },

    canPlaceBuildingAt: function (buildingIndex, targetGridX, targetGridY) {
        var size = this.placedBuildings[buildingIndex].config.size;
        if (targetGridX < 0 || targetGridY < 0 ||
            targetGridX + size.width > this.gridSystem.gridWidth ||
            targetGridY + size.height > this.gridSystem.gridHeight) {
            return false;
        }
        for (var i = 0; i < this.placedBuildings.length; i++) {
            if (i === buildingIndex) continue;
            var otherBuilding = this.placedBuildings[i];
            var otherSize = otherBuilding.config.size;
            if (targetGridX < otherBuilding.posX + otherSize.width &&
                targetGridX + size.width > otherBuilding.posX &&
                targetGridY < otherBuilding.posY + otherSize.height &&
                targetGridY + size.height > otherBuilding.posY) {
                return false;
            }
        }
        for (var j = 0; j < this.placedObstacles.length; j++) {
            var obstacle = this.placedObstacles[j];
            var obstacleSize = obstacle.config.size;
            if (targetGridX < obstacle.posX + obstacleSize.width &&
                targetGridX + size.width > obstacle.posX &&
                targetGridY < obstacle.posY + obstacleSize.height &&
                targetGridY + size.height > obstacle.posY) {
                return false;
            }
        }
        return true;
    },

    checkIfSpotIsVacant: function (targetGridX, targetGridY, buildingSize) {
        if (targetGridX < 0 || targetGridY < 0 ||
            targetGridX + buildingSize.width > this.gridSystem.gridWidth ||
            targetGridY + buildingSize.height > this.gridSystem.gridHeight) {
            return false;
        }
        for (var i = 0; i < this.placedBuildings.length; i++) {
            var otherBuilding = this.placedBuildings[i];
            var otherSize = otherBuilding.config.size;
            if (targetGridX < otherBuilding.posX + otherSize.width &&
                targetGridX + buildingSize.width > otherBuilding.posX &&
                targetGridY < otherBuilding.posY + otherSize.height &&
                targetGridY + buildingSize.height > otherBuilding.posY) {
                return false;
            }
        }
        for (var j = 0; j < this.placedObstacles.length; j++) {
            var obstacle = this.placedObstacles[j];
            var obstacleSize = obstacle.config.size;
            if (targetGridX < obstacle.posX + obstacleSize.width &&
                targetGridX + buildingSize.width > obstacle.posX &&
                targetGridY < obstacle.posY + obstacleSize.height &&
                targetGridY + buildingSize.height > obstacle.posY) {
                return false;
            }
        }
        return true;
    },

    showPlacementIndicator: function (buildingIndex, isValid) {
        var building = this.placedBuildings.find(b => b.buildingIndex === buildingIndex);
        if (!building || !building.compositeNode || !building.config || !building.config.size) return;
        if (building.placementIndicatorSprite) {
            building.placementIndicatorSprite.removeFromParent(true);
            building.placementIndicatorSprite = null;
        }
        if (building.baseSprite) {
            building.baseSprite.setVisible(false);
        }
        var baseSizeKey = building.config.size.width + "x" + building.config.size.height;
        var placementConfig = PLACEMENT_INDICATOR_CONFIG[baseSizeKey];
        if (!placementConfig) {
            if (building.baseSprite) building.baseSprite.setVisible(true);
            return;
        }
        var indicatorRes = isValid ? placementConfig.validRes : placementConfig.invalidRes;
        if (!indicatorRes) {
            if (building.baseSprite) building.baseSprite.setVisible(true);
            return;
        }
        var indicatorSprite = new cc.Sprite(indicatorRes);
        if (!indicatorSprite || !indicatorSprite.getTexture() || (indicatorSprite.getTexture().isLoaded && !indicatorSprite.getTexture().isLoaded())) {
            if (building.baseSprite) building.baseSprite.setVisible(true);
            return;
        }
        indicatorSprite.setAnchorPoint(0.5, 0);
        indicatorSprite.setScale(BASE_SPRITE_SCALE_FACTOR);
        indicatorSprite.setPosition(0, 0);
        indicatorSprite.setName(isValid ? "placement_valid_base" : "placement_invalid_base");
        building.compositeNode.addChild(indicatorSprite, BASE_SPRITE_LOCAL_Z);
        building.placementIndicatorSprite = indicatorSprite;
    },

    hidePlacementIndicator: function (buildingIndex) {
        var building = this.placedBuildings.find(b => b.buildingIndex === buildingIndex);
        if (building) {
            if (building.placementIndicatorSprite) {
                building.placementIndicatorSprite.removeFromParent(true);
                building.placementIndicatorSprite = null;
            }
            if (building.baseSprite) {
                building.baseSprite.setVisible(true);
            }
        }
    },

    removeBuilding: function (buildingIndex) {
        var building = this.placedBuildings[buildingIndex];
        if (!building) {
            return;
        }
        if (this.pathfindingGrid) {
            this.pathfindingGrid.removeBuilding("building_" + building.buildingIndex);
        }
        if (building.compositeNode) {
            building.compositeNode.unscheduleUpdate();
            building.compositeNode.removeFromParent(true);
        }
        if (building.baseSprite) {
            building.baseSprite.removeFromParent(true);
        }
        this.placedBuildings.splice(buildingIndex, 1);
        for (var i = buildingIndex; i < this.placedBuildings.length; i++) {
            this.placedBuildings[i].buildingIndex = i;
        }
    },

    removeObstacle: function (obstacleIndex) {
        var obstacle = this.placedObstacles[obstacleIndex];
        if (obstacle && this.pathfindingGrid) {
            this.pathfindingGrid.removeBuilding("obstacle_" + obstacle.obstacleIndex);
        }
        if (obstacle.compositeNode) {
            obstacle.compositeNode.unscheduleUpdate();
            obstacle.compositeNode.removeFromParent(true);
        }
        this.placedObstacles.splice(obstacleIndex, 1);
        for (var i = obstacleIndex; i < this.placedObstacles.length; i++) {
            this.placedObstacles[i].obstacleIndex = i;
        }
    },

    startRemoveObstacle: function(obstacle){
        if (BuilderManager.getInstance().assignBuilderToTask(obstacle) !== -1){
            var config = ItemConfigUtils.getBuildingConfig({buildingType: obstacle.obstacleType})
            if (!config|| typeof config.buildTime === 'undefined') {
                return;
            }
            var cost = config.gold || config.elixir || 0;
            var resourceType = config.gold ? 'gold' : 'oil';
            var removalTime = config.buildTime;
            PlayerDataManager.getInstance().subtractResources(resourceType, cost);
            obstacle.setState(BUILDING_STATES.CONSTRUCTING);
            obstacle.finishBuildingTime = Math.floor(Date.now() / 1000) + removalTime;
            this.toggleUpgradingIndicator(obstacle, true);
            gv.testnetwork.connector.sendRemoveObstacleRequest(obstacle.obstacleType, obstacle.obstacleIndex);
            BuildingsController.getInstance().deActivateAsset(this.mainScene, this.mainScene.activeBuilding);
            this.mainScene.activeBuilding = null;
        }
    },

    clearAllBuildings: function () {
        for (var i = 0; i < this.placedBuildings.length; i++) {
            var building = this.placedBuildings[i];
            if (building.compositeNode) {
                building.compositeNode.removeFromParent(true);
            }
        }
        this.placedBuildings = [];
    },

    clearAllObstacles: function () {
        for (var i = 0; i < this.placedObstacles.length; i++) {
            var obstacle = this.placedObstacles[i];
            if (obstacle.compositeNode) {
                obstacle.compositeNode.removeFromParent(true);
            }
        }
        this.placedObstacles = [];
    },

    getAllBuildings: function () {
        return this.placedBuildings;
    },

    getAllObstacles: function () {
        return this.placedObstacles;
    },

    logAllBuildings: function () {
        cc.log("Total Buildings: " + this.placedBuildings.length);
        for (var i = 0; i < this.placedBuildings.length; i++) {
            var building = this.placedBuildings[i];
            cc.log(" - " + building.buildingType + " (ID: " + building.buildingType + ") at (" + building.posX + "," + building.posY + ")");
        }
    },

    logAllObstacles: function () {
        for (var i = 0; i < this.placedObstacles.length; i++) {
            var obstacle = this.placedObstacles[i];
            cc.log(" - " + obstacle.type + " (ID: " + obstacle.id + ") at (" + obstacle.posX + "," + obstacle.posY + ")");
        }
    },

    handleBuildingPurchase: function (mainUIInstance, buildingData) {
        UIController.closeShopViews(mainUIInstance);
        let isInBuyingPhase = true;
        var newBuilding = this.createAndSetupBuilding(mainUIInstance, buildingData, isInBuyingPhase);
        BuildingsController.getInstance().handleAssetTouchBegan(mainUIInstance, newBuilding, true);
    },

    createAndSetupBuilding: function (mainUIInstance, buildingData, isInBuyingPhase) {
        var newBuilding = this.createBuilding(buildingData);
        if (!newBuilding) {
            return null;
        }
        newBuilding.isInBuyingPhase = isInBuyingPhase;
        this.createVisualsForBuilding(newBuilding, mainUIInstance);
        // --- REMOVED: Touch listener is now handled centrally ---
        // BuildingsController.getInstance().addTouchListenerToOneBuilding(mainUIInstance, newBuilding);
        if (this.pathfindingGrid && newBuilding.config && newBuilding.config.size) {
            this.pathfindingGrid.placeBuilding(
                "building_" + newBuilding.buildingIndex,
                newBuilding.posX,
                newBuilding.posY,
                newBuilding.config.size.width,
                newBuilding.config.size.height
            );
        }
        return newBuilding;
    },

    getTownHallLevel: function () {
        const allBuildings = this.getAllBuildings();
        for (let i = 0; i < allBuildings.length; i++) {
            if (allBuildings[i].buildingType === "TOW_1") {
                return allBuildings[i].level;
            }
        }
        return 0; // Return a default value if not found
    },

    update: function (dt) {},

    updateResourceGenerators: function () {
        return this.resourceGeneratorManager.updateResourceGenerators();
    },
    getResourceGenerators: function () {
        return this.resourceGeneratorManager.getResourceGenerators();
    },
    getResourceGeneratorByIndex: function (buildingIndex) {
        return this.resourceGeneratorManager.getResourceGeneratorByIndex(buildingIndex);
    },
    harvestResourceGenerator: function (buildingId) {
        return this.resourceGeneratorManager.harvestResourceGenerator(buildingId);
    },
    getHarvestableGenerators: function () {
        return this.resourceGeneratorManager.getHarvestableGenerators();
    },
    updateAllResourceGeneratorStates: function (reason) {
        return this.resourceGeneratorManager.updateAllResourceGeneratorStates(reason);
    },
    getResourceGenerationSummary: function () {
        return this.resourceGeneratorManager.getResourceGenerationSummary();
    },
    harvestAllResources: function () {
        return this.resourceGeneratorManager.harvestAllResources();
    },
    finishConstructionInstantly: function (buildingAsset) {
        gv.testnetwork.connector.sendBuildComplete(buildingAsset.buildingType, buildingAsset.buildingIndex);
        if (this.buildingType === "AMC_1") cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.ARMY_STATUS_UPDATED, {})
        var building = this.placedBuildings.find(b => b.buildingIndex === buildingAsset.buildingIndex);
        if (!building) {
            return;
        }
        building.buildingState = "IDLE";
        building.finishBuildingTime = 0;
        if (building.originalDataRef) {
            building.originalDataRef.buildingState = "IDLE";
        }
        building.isConstructing = false;
        if (building.upgradingIndicator) {
            building.upgradingIndicator.setVisible(false);
        }
        if (building.upgradingProgressBar) {
            building.upgradingProgressBar.setVisible(false);
        }
        if (building.upgradingProgressBar && building.upgradingProgressBar.progressTimer) {
            building.upgradingProgressBar.progressTimer.setPercentage(0);
        }
        if (building.upgradingProgressBar && building.upgradingProgressBar.timeLabel) {
            building.upgradingProgressBar.timeLabel.setString("");
        }
        if (typeof cc.eventManager !== 'undefined') {
            cc.eventManager.dispatchCustomEvent("BUILDING_CONSTRUCTION_FINISHED", {
                building: building
            });
        }
        BuilderManager.getInstance().onBuildingOperationComplete(building);
        PlayerDataManager.getInstance().notifyResourceUpdate("gold");
        PlayerDataManager.getInstance().notifyResourceUpdate("oil");
    },
    findAvailableArmyCamp: function (troopType) {
        var troopObj = new Troop(troopType, 1);
        for (var i = 0; i < this.placedBuildings.length; i++) {
            var building = this.getBuildingByIndex(i);
            if (building.buildingType.startsWith("AMC") && building.isAvailable(troopObj)) {
                return building;
            }
        }
        return null;
    },
    findArmyCampHasTroop: function (troop) {
        for (var i = 0; i < this.placedBuildings.length; i++) {
            var building = this.getBuildingByIndex(i);
            if (building.buildingType === "AMC" && building.hasTroop(troop)) {
                return i;
            }
        }
        return -1;
    },
    getBuildingByIndex: function (buildingIndex) {
        return this.placedBuildings[buildingIndex];
    },
    getTotalHousingSpace: function () {
        let totalHousingSpace = 0;
        for (let i = 0; i < this.placedBuildings.length; i++) {
            const building = this.placedBuildings[i];
            if (building.buildingType.startsWith("AMC") && building.buildingState === BUILDING_STATES.OPERATING) {
                totalHousingSpace += building.getHousingSpace();
            }
        }
        return totalHousingSpace;
    },
    getBuildingCountByType: function (buildingType) {
        var count = 0;
        for (var i = 0; i < this.placedBuildings.length; i++) {
            var building = this.placedBuildings[i];
            if (building && building.buildingType === buildingType) {
                count++;
            }
        }
        return count;
    },
});

BuildingsManager._instance = null;

BuildingsManager.getInstance = function () {
    if (!this._instance) {
        this._instance = new BuildingsManager();
    }
    return this._instance;
};
