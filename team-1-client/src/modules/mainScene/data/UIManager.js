// Import UI functions from UIController.js

const GAME_LAYER_Z_ORDER = 0;
const HUD_LAYER_Z_ORDER = 10;
const GRID_NODE_Z_ORDER = 1; // Grid should be behind buildings
const SHOP_UI_Z_ORDER = 50;
const SHOP_CATEGORY_UI_Z_ORDER = 51;

// Define explicit Z-order for the children of mapContainerNode
const MAP_INTERNAL_Z_ORDER = {
    TMX_MAP: 1,
    BACKGROUND_QUARTERS: 2,
    ASSET_LAYER: 3, // For buildings, troops, etc.
};

const UPGRADE_BUILDING_UI_Z_ORDER = 50;
const SELECTED_BUILDING_Z_ORDER = 1601;

const ISO_TILE_WIDTH = 76;
const ISO_TILE_HEIGHT = 57;

const TAP_THRESHOLD_DISTANCE_SQ = 100;
// The max time in milliseconds a touch can last to be considered a tap.
const TAP_THRESHOLD_TIME = 200;

var UIManager = cc.Layer.extend({
    gameLayer: null,
    uiRootNode: null, // The single, scalable container for all UI elements
    hudLayerInstance: null,
    mapElement: null, // This will become the new ASSET_LAYER
    tmxMapNode: null, // Reference to the actual TMX map
    mapContainerNode: null,
    backgroundQuarters: [null, null, null, null],
    gridSystem: null,
    gridDrawer: null,
    gridNode: null,
    gridVisible: false,
    cameraController: null,
    buildingManager: null,
    activeBuilding: null,
    originalBuildingGridPos: null,
    originalBuildingZOrder: 0,
    isDragging: false,
    interactionPanel: null,
    shopUINode: null,
    shopCategoryUINode: null,
    upgradeBuildingUINode: null,
    trainTroopUINode: null,
    useGemPopupUINode: null,
    buildingsController: null,
    troopInfoUINode: null,
    buildingInfoUINode: null,
    battleOptionsUINode: null,
    isFullyLoaded: false,
    inTransitTroops: [],
    ctor: function () {
        this._super();
        this.originalBuildingZOrder = 0;
        this.buildingsController = BuildingsController.getInstance();
        gv.configs = Configs.getInstance();

        this.touchStartPos = null;
        this.touchStartTime = 0;
        this.isTap = false;
        this.init();
    },

    init: function () {
        this._super();

        this.gameLayer = new cc.Node();
        this.addChild(this.gameLayer, GAME_LAYER_Z_ORDER);

        var json_main = ccs.load(res.main_scene_json);
        this.uiRootNode = json_main.node;
        this.addChild(this.uiRootNode, HUD_LAYER_Z_ORDER);

        this.uiRootNode.setAnchorPoint(0, 0);
        this.uiRootNode.setPosition(0, 0);

        this._anchorHUDElements();

        this._setupMapContainerAndElement(this.uiRootNode);
        UIController.setupHUD(this.uiRootNode, this);

        TroopManager.getInstance().initFromPlayerData();
        this._setupMapElements();
        this._initCamera();
        this._initGrid();
        this._initTroopDeploymentListener();

        // === FIX: Khởi tạo một trình lắng nghe sự kiện duy nhất cho Army Camp ===
        this._initUpdateAMCVisualsListener();


        this.buildingsController.initBuildingManagerAndLoadData(this);

        if (!this.buildingManager) {
            cc.error("MainScene: BuildingsManager initialization failed - buildingManager is null");
        } else {
            cc.log("MainScene: BuildingsManager initialized successfully");
        }

        TroopManager.getInstance().processAllBarracksOfflineTraining();
        TroopManager.getInstance().loadExistingTroopsIntoCamps(this);
        cc.log("UIManager: Manually triggered loading of existing troops into camps AFTER offline calculation.");
        UIController.initInteractionPanel(this);
        UIController.initShopUI(this);

        UIController.initInteractionPanel(this);
        UIController.initShopUI(this);
        UIController.initShopCategoryUI(this);
        this._setupEventListeners();
        UIController.initHudResources(this);
        UIController.initUpgradeBuildingUI(this);
        UIController.initTrainTroopUI(this);
        UIController.initUseGemPopUpPanel(this);
        UIController.initTroopInfoUI(this);
        UIController.initBuildingInfoUI(this);
        UIController.initBattleOptionsUI(this);

        if (this.useGemPopupUINode == null) {
            cc.error("MainUI: useGemPopupUINode is null. Ensure UIController.initUseGemPopUpPanel is called.");
        }

        this.scheduleUpdate();
        cc.log("MainUI initialized successfully.");

        if (this.buildingManager && this.buildingManager.getPathfindingGrid()) {
            // this.buildingManager.getPathfindingGrid().logGridState();
        } else {
            cc.warn("UIManager: Could not log PathfindingGrid state, buildingManager or pathfindingGrid not available.");
        }

        // Hacky fix: call builder visual 1ms after init all building to avoid race condition
        this.scheduleOnce(function() {
            BuilderManager.getInstance().createAndDisplayBuilderVisuals();
        }, 1);
    },

    _anchorHUDElements: function() {
        const PADDING = 5; // Bạn có thể tùy chỉnh giá trị này

        var visibleSize = cc.director.getVisibleSize();
        var visibleOrigin = cc.director.getVisibleOrigin();

        // << SỬA LỖI 1: Lấy node "uiContainer" trước >>
        var uiContainerNode = this.uiRootNode.getChildByName("uiContainer");
        if (!uiContainerNode) {
            cc.error("FATAL: uiContainer node not found in MainScene.json. Cannot anchor HUD elements.");
            return;
        }

        // Hàm tiện ích để ghim một node
        const anchorNode = (nodeName, anchorPoint) => {
            // << SỬA LỖI 2: Tìm nút con từ uiContainerNode thay vì từ gốc >>
            var node = uiContainerNode.getChildByName(nodeName);
            if (!node) {
                cc.warn("Could not find node: " + nodeName + " inside uiContainer.");
                return;
            }

            var originalPos = node.getPosition();
            var newX = originalPos.x;
            var newY = originalPos.y;

            // Logic tính toán vị trí với PADDING (giữ nguyên, giờ nó sẽ hoạt động)
            if (anchorPoint.x === 0) { // Ghim Trái
                newX = visibleOrigin.x + originalPos.x + PADDING;
            }
            else if (anchorPoint.x === 0.5) { // Ghim Giữa
                const DESIGN_CENTER_X = DESIGN_RESOLUTION_WIDTH / 2;
                var offsetFromCenter = originalPos.x - DESIGN_CENTER_X;
                newX = (visibleOrigin.x + visibleSize.width / 2) + offsetFromCenter;
            } else if (anchorPoint.x === 1) { // Ghim Phải
                var offsetFromRight = DESIGN_RESOLUTION_WIDTH - originalPos.x;
                newX = visibleOrigin.x + visibleSize.width - offsetFromRight - PADDING;
            }

            if (anchorPoint.y === 0) { // Ghim Dưới
                newY = visibleOrigin.y + originalPos.y + PADDING;
            } else if (anchorPoint.y === 1) { // Ghim Trên
                var offsetFromTop = DESIGN_RESOLUTION_HEIGHT - originalPos.y;
                newY = visibleOrigin.y + visibleSize.height - offsetFromTop - PADDING;
            }

            node.setPosition(newX, newY);
        };

        // --- Các phần còn lại giữ nguyên ---
        const topLeftNodes = ["expBackGround", "prestigeBackGround"];
        const topCenterNodes = ["builderBackGround", "campBackGround", "guardBackground"];

        topLeftNodes.forEach(name => anchorNode(name, cc.p(0, 1)));
        topCenterNodes.forEach(name => anchorNode(name, cc.p(0.5, 1)));

        const topRightNodes = ["goldIcon", "elixirIcon", "oilIcon", "gemIcon"];
        topRightNodes.forEach(name => anchorNode(name, cc.p(1, 1)));

        anchorNode("attack", cc.p(0, 0));
        anchorNode("shop", cc.p(1, 0));
        anchorNode("setting", cc.p(1, 0));

        cc.log("HUD elements have been anchored correctly inside uiContainer.");
    },

    onExit: function () {
        this._super();
        this._removeTroopDeploymentListener && this._removeTroopDeploymentListener();
        this._removeUpdateAMCVisualsListener && this._removeUpdateAMCVisualsListener();


        // Clean up builder visuals
        BuilderManager.getInstance().cleanupAllBuildersVisuals();

        var buildingsManager = BuildingsManager.getInstance();
        if (buildingsManager && buildingsManager.hasBeenInitialized) {
            cc.log("UIManager: Discarding visual node references from BuildingsManager.");

            this.inTransitTroops = [];

            buildingsManager.getAllBuildings().forEach(building => {
                building.compositeNode = null;
                building.baseSprite = null;
                building.buildingSprite = null;
                building.animationSprite = null;
                building.selectionIndicator = null;
                building.placementIndicator = null;
                building.upgradingIndicator = null;
                building.upgradingProgressBar = null;
                if (building instanceof ArmyCamp) {
                    building.troopList = [];
                }
            });

            buildingsManager.getAllObstacles().forEach(obstacle => {
                obstacle.compositeNode = null;
                obstacle.baseSprite = null;
                obstacle.obstacleSprite = null;
                obstacle.selectionIndicator = null;
                obstacle.upgradingIndicator = null;
                obstacle.upgradingProgressBar = null;
            });
            cc.log("UIManager: Cleared troop lists from all army camps on exit.");
        }
    },

    spawnTroopInCampOnLoad: function(spawnData) {

        var { troopType, targetCamp } = spawnData;

        var visualTroop = new Troop(troopType, 1);
        this.mapElement.addChild(visualTroop);

        var campBBox = targetCamp.compositeNode.getBoundingBoxToWorld();
        var insetX = campBBox.width * 0.15;
        var insetY = campBBox.height * 0.25;
        var randomX = campBBox.x + insetX + (Math.random() * (campBBox.width * 0.7));
        var randomY = campBBox.y + insetY + (Math.random() * (campBBox.height * 0.5));
        var randomWorldPos = cc.p(randomX, randomY);
        var randomNodePos = this.mapElement.convertToNodeSpace(randomWorldPos);

        visualTroop.setPosition(randomNodePos);

        targetCamp.addTroopToArmyCamp(visualTroop);

        var finalGridPos = this.gridSystem.localToGrid(randomNodePos.x, randomNodePos.y);
        this._updateTroopZOrder(visualTroop, finalGridPos);
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        visualTroop.currentDirection = randomDirection;
        visualTroop.playAnimation("idle", visualTroop.currentDirection, true);
    },

    _initTroopDeploymentListener: function() {
        if (!this.gameLayer) return;
        this._troopDeploymentListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: PLAYER_DATA_EVENTS.SHOW_TROOP_DEPLOYMENT_ANIMATION,
            callback: this._handleShowTroopDeploymentAnimation.bind(this)
        });
        cc.eventManager.addListener(this._troopDeploymentListener, 1);
    },

    _removeTroopDeploymentListener: function() {
        if (this._troopDeploymentListener) {
            cc.eventManager.removeListener(this._troopDeploymentListener);
            this._troopDeploymentListener = null;
        }
    },

    _updateTroopZOrder: function(troop, gridPos) {
        if (!troop || !gridPos || typeof gridPos.x === 'undefined' || typeof gridPos.y === 'undefined') {
            cc.warn("UIManager: _updateTroopZOrder called with invalid arguments.");
            return;
        }
        troop.gridX = gridPos.x;
        troop.gridY = gridPos.y;
        const newZOrder = MAX_Z_ORDER - (40 * gridPos.x + gridPos.y);
        troop.setLocalZOrder(newZOrder);
    },

    _createAndInitializeTroop: function(troopType, sourceBuilding) {
        if (!troopType || !sourceBuilding) {
            cc.warn("UIManager: Cannot create troop animation without troopType and sourceBuilding.");
            return null;
        }

        var visualTroop = new Troop(troopType, 1);
        this.mapElement.addChild(visualTroop);

        var sourceWorldPos = sourceBuilding.getVisualCenterPosition ? sourceBuilding.getVisualCenterPosition() : cc.p(0, 0);
        var sourceGridPos = { x: sourceBuilding.posX, y: sourceBuilding.posY };

        if (cc.pSameAs(sourceWorldPos, cc.p(0, 0))) {
            cc.warn("UIManager: Could not determine source building position for troop deployment animation.");
        }

        var initialPosition = this.mapElement.convertToNodeSpace(sourceWorldPos);
        visualTroop.setPosition(initialPosition);
        this._updateTroopZOrder(visualTroop, sourceGridPos);

        return visualTroop;
    },

    _handleNoPathAnimation: function(visualTroop, targetBuilding) {
        cc.warn("No path provided for troop deployment animation. Placing troop at target.");
        if (targetBuilding && typeof targetBuilding.getVisualCenterPosition === 'function') {
            var targetWorldPos = targetBuilding.getVisualCenterPosition();
            var targetNodePos = this.mapElement.convertToNodeSpace(targetWorldPos);
            visualTroop.setPosition(targetNodePos);
            this._updateTroopZOrder(visualTroop, { x: targetBuilding.posX, y: targetBuilding.posY });
        }
        visualTroop.playAnimation("idle", visualTroop.currentDirection, true);
    },

    _buildMovementActions: function(visualTroop, pathNodes) {
        var actionsArray = [];
        var currentPosition = visualTroop.getPosition();

        if (pathNodes.length > 0) {
            var firstNodePos = this.gridSystem.gridToLocal(pathNodes[0].x, pathNodes[0].y);
            visualTroop.currentDirection = Utils.calculateDirection(currentPosition, firstNodePos);
        }

        for (var i = 0; i < pathNodes.length; i++) {
            var gridNode = pathNodes[i];
            var nextNodePos = this.gridSystem.gridToLocal(gridNode.x, gridNode.y);
            var directionForSegment = Utils.calculateDirection(currentPosition, nextNodePos);

            var updateAndAnimateCallback = (function(dir, newGridPos) {
                return function() {
                    this._updateTroopZOrder(visualTroop, newGridPos);
                    visualTroop.playAnimation("run", dir, true);
                };
            })(directionForSegment, gridNode);
            actionsArray.push(cc.callFunc(updateAndAnimateCallback, this));

            var moveSpeed = visualTroop.moveSpeed;
            var duration = moveSpeed > 0 ? 10.0 / moveSpeed : 0.2;
            actionsArray.push(cc.moveTo(duration, nextNodePos));

            currentPosition = nextNodePos;
        }
        return actionsArray;
    },

    _createFinalPositioningAction: function(visualTroop, targetBuilding) {
        return cc.callFunc(function() {
            if (!targetBuilding || !targetBuilding.compositeNode) {
                cc.warn("UIManager: Target building not valid for final positioning.");
                visualTroop.playAnimation("idle", visualTroop.currentDirection, true);
                return;
            }

            if (targetBuilding instanceof ArmyCamp) {
                targetBuilding.addTroopToArmyCamp(visualTroop);
            }
            this.inTransitTroops = this.inTransitTroops.filter(function(t) {
                return t !== visualTroop;
            });
            var finalGridPos = this.gridSystem.localToGrid(visualTroop.getPositionX(), visualTroop.getPositionY());
            this._updateTroopZOrder(visualTroop, finalGridPos);
            const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            visualTroop.currentDirection = randomDirection;
            visualTroop.playAnimation("idle", visualTroop.currentDirection, true);

        }.bind(this));
    },

    _handleShowTroopDeploymentAnimation: function(event) {
        var eventData = event.getUserData();
        if (!eventData) {
            cc.warn("UIManager: Received troop deployment event with no data.");
            return;
        }

        var { troopType, sourceBuilding, targetBuilding, path } = eventData;

        var visualTroop = this._createAndInitializeTroop(troopType, sourceBuilding);
        if (!visualTroop) {
            return;
        }

        visualTroop.targetBuilding = targetBuilding;
        this.inTransitTroops.push(visualTroop);

        if (!path || path.length === 0) {
            this._handleNoPathAnimation(visualTroop, targetBuilding);
            return;
        }

        var movementActions = this._buildMovementActions(visualTroop, path);
        var finalAction = this._createFinalPositioningAction(visualTroop, targetBuilding);
        movementActions.push(finalAction);

        if (movementActions.length > 0) {
            visualTroop.runAction(cc.sequence(movementActions));
        } else {
            this._handleNoPathAnimation(visualTroop, targetBuilding);
        }
    },

    _setupMapContainerAndElement: function(rootNode) {
        this.mapContainerNode = rootNode.getChildByName("mapContainer");
        if (this.mapContainerNode) {
            this.mapContainerNode.retain();
            this.mapContainerNode.removeFromParent(false);
            this.gameLayer.addChild(this.mapContainerNode);
            this.mapContainerNode.release();

            this.tmxMapNode = this.mapContainerNode.getChildByName("map");
            if (this.tmxMapNode) {
                this.tmxMapNode.setLocalZOrder(MAP_INTERNAL_Z_ORDER.TMX_MAP);
            } else {
                cc.error("MainUI: 'map' (TMX Map) child not found in mapContainerNode.");
                this.tmxMapNode = new cc.Node();
            }

            this.mapElement = new cc.Node();
            this.mapElement.setName("assetLayer");

            this.mapElement.setContentSize(this.tmxMapNode.getContentSize());
            this.mapElement.setAnchorPoint(this.tmxMapNode.getAnchorPoint());
            this.mapElement.setPosition(this.tmxMapNode.getPosition());
            this.mapElement.setScale(this.tmxMapNode.getScale());

            this.mapContainerNode.addChild(this.mapElement, MAP_INTERNAL_Z_ORDER.ASSET_LAYER);

        } else {
            cc.error("MainUI: mapContainerNode not found in JSON. Creating a fallback.");
            this.mapContainerNode = new cc.Node();
            this.gameLayer.addChild(this.mapContainerNode);
            this.mapElement = this.mapContainerNode;
            this.tmxMapNode = new cc.Node();
        }
    },

    _setupEventListeners: function() {
        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.onKeyPressed.bind(this)
        });
        cc.eventManager.addListener(keyboardListener, this);

        var armyClearedListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "ARMY_CLEARED_FOR_TESTING",
            callback: this._handleClearArmyVisuals.bind(this)
        });
        cc.eventManager.addListener(armyClearedListener, this);
    },

    _initCamera: function() {
        this.cameraController = new CameraController(this.gameLayer, this);
        var mapBounds = this.getMapBounds();
        this.cameraController.updateBounds(mapBounds);
    },

    _initGrid: function() {
        var mapSize = this.mapElement.getContentSize();
        var isoTileWidth = ISO_TILE_WIDTH;
        var isoTileHeight = ISO_TILE_HEIGHT;

        var desiredMapOriginX = mapSize.width / 2;
        var desiredMapOriginY = isoTileHeight;

        this.gridSystem = new GridSystem(isoTileWidth, isoTileHeight, desiredMapOriginX, desiredMapOriginY);
        this.gridDrawer = new GridDrawer(this.gridSystem);
        this.gridNode = this.gridDrawer.createGridNode();

        if (this.gridNode) {
            this.gridNode.setPosition(0, 0);
            this.mapElement.addChild(this.gridNode, GRID_NODE_Z_ORDER);
            this.gridNode.setVisible(this.gridVisible);
        } else {
            cc.error("MainUI: Failed to create gridNode from GridDrawer.");
        }
    },

    _setupMapElements: function() {
        if (!this.mapContainerNode) {
            cc.log("setupMapElements: mapContainerNode is null. Skipping.");
            return;
        }
        const quarterNames = ["upperLeft", "upperRight", "lowerLeft", "lowerRight"];
        for (let i = 0; i < quarterNames.length; i++) {
            const quarter = this.mapContainerNode.getChildByName(quarterNames[i]);
            this.backgroundQuarters[i] = quarter;
            if (quarter) {
                quarter.setLocalZOrder(MAP_INTERNAL_Z_ORDER.BACKGROUND_QUARTERS);
            }
        }
    },

    onKeyPressed: function(keyCode, event) {
        if (keyCode === cc.KEY.g) {
            this.toggleGrid();
        }
        if (keyCode === cc.KEY.m) {
            TroopManager.getInstance().clearArmyForTesting();
        }
    },

    toggleGrid: function() {
        if (this.gridNode) {
            this.gridVisible = !this.gridVisible;
            this.gridNode.setVisible(this.gridVisible);
            cc.log("Grid visibility toggled to: " + this.gridVisible);
        } else {
            cc.log("MainUI: Cannot toggle grid - gridNode is not initialized.");
        }
    },

    getMapBounds: function () {
        if (this.mapElement) {
            var mapSize = this.mapElement.getContentSize();

            var halfWidth = mapSize.width / 2;
            var halfHeight = mapSize.height / 2;

            return {
                left: -halfWidth + 470,
                right: halfWidth + 430,
                bottom: -halfHeight + 250,
                top: halfHeight + 240
            };
        }
        cc.warn("MainUI: getMapBounds - mapElement not available. Cannot determine map bounds.");
        return null;
    },

    toggleShopUI: function() {
        UIController.toggleShopUI(this);
    },

    toggleUpgradeBuildingUI: function(building){
        UIController.toggleUpgradeBuildingUI(this, building);
    },

    toggleTrainTroopUI: function(building){
        UIController.toggleTrainTroopUI(this, building);
    },

    openMainShopView: function() {
        UIController.openMainShopView(this);
    },

    openShopCategoryView: function(categoryName, itemsData) {
        UIController.openShopCategoryView(this, categoryName, itemsData);
    },

    closeShopViews: function() {
        UIController.closeShopViews(this);
    },

    update: function (dt) {
        if (this.buildingManager) {
            this.buildingManager.updateResourceGenerators();
            this.buildingManager.updateObstacles(dt);
        }
    },

    handleItemPurchase: function(itemId){
        UIController.handleItemPurchase(this, itemId);
    },

    // === CÁC HÀM XỬ LÝ ARMY CAMP ĐÃ ĐƯỢC SỬA LẠI ===

    _initUpdateAMCVisualsListener: function() {
        if (!this.gameLayer) return;
        this._updateAMCVisualsListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "UPDATE_AMC_VISUALS",
            callback: this._handleUpdateAMCVisuals.bind(this)
        });
        cc.eventManager.addListener(this._updateAMCVisualsListener, 1);
    },

    _removeUpdateAMCVisualsListener: function() {
        if (this._updateAMCVisualsListener) {
            cc.eventManager.removeListener(this._updateAMCVisualsListener);
            this._updateAMCVisualsListener = null;
        }
    },

    _handleUpdateAMCVisuals: function(event) {
        var eventData = event.getUserData();
        if (!eventData || !eventData.building) {
            cc.warn("UIManager: Received UPDATE_AMC_VISUALS event with no building data.");
            return;
        }
        this._repositionTroopsForCamp(eventData.building);
    },

    // Hàm dùng chung để tái định vị lính
    _repositionTroopsForCamp: function(armyCamp) {
        if (armyCamp.troopList && armyCamp.troopList.length > 0) {
            cc.log("UIManager: Repositioning " + armyCamp.troopList.length + " troops for army camp.");
            for (var i = 0; i < armyCamp.troopList.length; i++) {
                var troop = armyCamp.troopList[i];
                if (troop && troop instanceof Troop) {
                    this._repositionSingleTroop(troop, armyCamp);
                }
            }
        }

        // Cũng kiểm tra và di chuyển lính đang trên đường đến camp này
        cc.log("UIManager: Checking " + this.inTransitTroops.length + " in-transit troops.");
        for (var j = 0; j < this.inTransitTroops.length; j++) {
            var inTransitTroop = this.inTransitTroops[j];
            if (inTransitTroop && inTransitTroop.targetBuilding === armyCamp) {
                cc.log("UIManager: In-transit troop found! Recalculating path to new camp location.");
                this._repositionSingleTroop(inTransitTroop, armyCamp);
            }
        }
    },

    _repositionSingleTroop: function(troop, targetCamp) {
        troop.stopAllActions();

        var pfGrid = this.buildingManager.getPathfindingGrid();
        if (!pfGrid) {
            cc.error("UIManager._repositionSingleTroop: PathfindingGrid not available.");
            return;
        }
        var pathfinder = new Pathfinder(pfGrid);

        var startGridPos = { x: troop.gridX, y: troop.gridY };

        // Logic tìm điểm đến (endGridPos) giữ nguyên...
        var endGridPos = null;
        var campConfig = ItemConfigUtils.getBuildingConfig(targetCamp);
        var campX = targetCamp.posX;
        var campY = targetCamp.posY;
        var campWidth = campConfig.width;
        var campHeight = campConfig.height;

        var walkablePointsInsideCamp = [];
        for (var x = campX; x < campX + campWidth; x++) {
            for (var y = campY; y < campY + campHeight; y++) {
                if (pfGrid.isTraversable(x, y)) {
                    walkablePointsInsideCamp.push({ x: x, y: y });
                }
            }
        }

        if (walkablePointsInsideCamp.length > 0) {
            endGridPos = walkablePointsInsideCamp[Math.floor(Math.random() * walkablePointsInsideCamp.length)];
        } else {
            cc.warn("UIManager: Could not find any walkable points in target camp during reposition. Using camp origin as fallback.");
            endGridPos = { x: campX, y: campY };
        }

        var pathResult = pathfinder.findPath(startGridPos.x, startGridPos.y, endGridPos.x, endGridPos.y);
        var path = pathResult && pathResult.path ? pathResult.path : null;

        if (!path || path.length === 0) {
            cc.warn("UIManager: No path found for repositioning troop. Moving directly.");
            var directMoveNodePos = this.gridSystem.gridToLocal(endGridPos.x, endGridPos.y);

            // Áp dụng logic if/else ngay cả trong trường hợp này
            if (this.inTransitTroops.indexOf(troop) !== -1) {
                finalAction = this._createFinalPositioningAction(troop, targetCamp);
            } else {
                finalAction = cc.callFunc(function() {
                    this._updateTroopZOrder(troop, endGridPos);
                    troop.playAnimation("idle", troop.currentDirection, true);
                }.bind(this));
            }
            troop.runAction(cc.sequence(cc.moveTo(1.0, directMoveNodePos), finalAction));
            return;
        }
        var movementActions = this._buildMovementActions(troop, path);
        let finalAction;
        if (this.inTransitTroops.indexOf(troop) !== -1) {
            finalAction = this._createFinalPositioningAction(troop, targetCamp);
        } else {
            finalAction = cc.callFunc(function() {
                var finalGridPos = this.gridSystem.localToGrid(troop.getPositionX(), troop.getPositionY());
                this._updateTroopZOrder(troop, finalGridPos);
                const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
                const randomDirection = directions[Math.floor(Math.random() * directions.length)];
                troop.currentDirection = randomDirection;
                troop.playAnimation("idle", troop.currentDirection, true);
            }.bind(this));
        }
        movementActions.push(finalAction);
        if (movementActions.length > 0) {
            troop.runAction(cc.sequence(movementActions));
        }
    },

    _handleClearArmyVisuals: function() {
        cc.log("--- DEBUG: Removing all visual troops from camps. ---");
        var buildingsManager = BuildingsManager.getInstance();
        if (!buildingsManager) return;

        // Remove troops currently idle in camps
        var armyCamps = buildingsManager.getAllBuildings().filter(b => b instanceof ArmyCamp);
        for (var i = 0; i < armyCamps.length; i++) {
            var camp = armyCamps[i];
            if (camp.troopList && camp.troopList.length > 0) {
                // Iterate backwards when removing items from an array
                for (var j = camp.troopList.length - 1; j >= 0; j--) {
                    var troop = camp.troopList[j];
                    if (troop && cc.sys.isObjectValid(troop)) {
                        troop.removeFromParent(true);
                    }
                }
                camp.troopList = []; // Clear the camp's internal list
            }
        }

        // Remove troops that are currently walking from a barrack to a camp
        if (this.inTransitTroops && this.inTransitTroops.length > 0) {
            for (var k = this.inTransitTroops.length - 1; k >= 0; k--) {
                var inTransitTroop = this.inTransitTroops[k];
                if (inTransitTroop && cc.sys.isObjectValid(inTransitTroop)) {
                    inTransitTroop.stopAllActions();
                    inTransitTroop.removeFromParent(true);
                }
            }
            this.inTransitTroops = []; // Clear the in-transit list
        }

        // Finally, update any UI elements that show army capacity
        cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.ARMY_STATUS_UPDATED);
        cc.log("--- DEBUG: Visual army cleared. ---");
    }
});
