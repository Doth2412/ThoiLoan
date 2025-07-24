const PVP_MAP_INTERNAL_Z_ORDER = {
    BACKGROUND_QUARTERS: 2,
    TMX_MAP: 1,
    ASSET_LAYER: 3,
};

var PVPBattleScene = cc.Layer.extend({
    // --- Properties adapted from BattleScene ---
    pvpBackground: null,
    battleHUD: null,
    resultUI: null,
    gameLayer: null,
    gridSystem: null,
    gridDrawer: null,
    gridNode: null,
    gridVisible: false,
    deployZoneDrawer: null,
    pathfindingGrid: null,
    _enemyBuildings: null,
    _targetSelector: null,
    cameraController: null,
    calculatedMapBounds: null,
    tmxMapNode: null,
    mapData: null,
    opponentData: null,
    mapContainerNode: null,
    mapElement: null, // This will be the asset layer
    backgroundQuarters: [null, null, null, null],

    // --- Manager Classes ---
    pvpBattleFactory: null,
    battleTroopManager: null,
    battleInputManager: null,
    _fireBulletListener: null,
    _buildingDestroyedListener: null,
    _starsUpdateListener: null,
    _battleEnded: false,
    _battleStarted: false,

    ctor: function (opponentData, troopToFightData) {
        this._super();
        this.opponentData = opponentData;
        this.troopToFightData = troopToFightData; // Store troop data
        var visibleSize = cc.director.getVisibleSize();
        var visibleOrigin = cc.director.getVisibleOrigin();
        this.gameLayer = new cc.Node();
        this.addChild(this.gameLayer);

        // --- Initialization flow from BattleScene ---
        this._initPVPBackground(visibleOrigin, visibleSize);
        this._initGrid();
        this._initPathfindingSystems();

        // Instantiate the factory and load the opponent's base
        this.pvpBattleFactory = new PVPBattleFactory(this.gridSystem, this.pathfindingGrid, this.mapElement);
        this._loadOpponentBase();

        // Instantiate managers that depend on world data
        this.battleTroopManager = new BattleTroopManager(this.mapElement, this.gridSystem, this.pathfinder, this._targetSelector, this._enemyBuildings, this);

        // Initialize UI and other systems
        this._initCamera();
        // Initialize event listeners
        this._initBuildingDestroyedListener();
        this._initFireBulletListener();
        this._initStarsUpdateListener();
        this.scheduleUpdate();

        cc.log("PVPBattleScene initialized for opponent: " + opponentData.username);
    },

    onEnter: function() {
        this._super();
        var visibleOrigin = cc.director.getVisibleOrigin();
        var visibleSize = cc.director.getVisibleSize();

        // 1. Khởi tạo Manager ĐẦU TIÊN
        this._initBattleManager();

        // 2. Khởi tạo UI (phụ thuộc vào Manager)
        this._initBattleHUD(visibleOrigin, visibleSize, this.opponentData.username);
        this._initResultUI(visibleOrigin, visibleSize);

        // 3. Set dữ liệu cho UI (phụ thuộc vào UI đã được tạo)
        this.battleHUD.setTroopData(this.troopToFightData);

        // 4. Khởi tạo Input Manager CUỐI CÙNG (phụ thuộc vào UI)
        this.battleInputManager = new BattleInputManager(this, this.mapElement, this.battleHUD, this.battleTroopManager, this.gridSystem, this.pathfindingGrid, this.deployZoneDrawer);
        this.battleInputManager.initListeners();
        this._findAndSetFont(this);

        cc.log("PVPBattleScene onEnter: Battle state and UI fully initialized.");
    },

    update: function(dt) {
        if (this._battleEnded) {
            return;
        }
        this.battleTroopManager.update(dt);
        if (this._enemyBuildings) {
            var activeTroops = this.battleTroopManager.getActiveTroops();
            for (var i = 0; i < this._enemyBuildings.length; i++) {
                var building = this._enemyBuildings[i];
                if (building && building.buildingType && building.buildingType.startsWith("DEF_")) {
                    building.update(dt, activeTroops, this.gridSystem);
                }
            }
        }
    },

    onExit: function () {
        this._super();
        this.unschedule(this._updateTimer);
        BattleManager.getInstance().reset();
        this.battleInputManager.cleanup();
    },

    startBattle: function() {
        this.battleHUD.resultPanel.setVisible(true);
        this.battleHUD.findNextButton.setVisible(false)
        this._battleStarted = true;
        this._startBattleTimer();
    },

    _startBattleTimer: function() {
        this._initTimer();
    },

    toggleGrid: function () {
        this.gridVisible = !this.gridVisible;
        this.gridNode.setVisible(this.gridVisible);
    },

    _initPVPBackground: function (visibleOrigin, visibleSize) {
        this.pvpBackground = new GUIDungeonBackGround(res.map_back_ground_json);
        this.gameLayer.addChild(this.pvpBackground, 0); // Add the parent GUI node

        // The root node of the loaded GUI is our container
        this.mapContainerNode = this.pvpBackground._rootNode;

        // Find the TMX map node and set its Z-order
        this.tmxMapNode = this.mapContainerNode.getChildByName("map");
        this.tmxMapNode.setLocalZOrder(PVP_MAP_INTERNAL_Z_ORDER.TMX_MAP);


        // Create and configure the asset layer (mapElement)
        this.mapElement = new cc.Node();
        this.mapElement.setName("assetLayer");
        this.mapElement.setContentSize(this.tmxMapNode.getContentSize());
        this.mapElement.setAnchorPoint(this.tmxMapNode.getAnchorPoint());
        this.mapElement.setPosition(this.tmxMapNode.getPosition());
        this.mapElement.setScale(this.tmxMapNode.getScale());
        this.mapContainerNode.addChild(this.mapElement, PVP_MAP_INTERNAL_Z_ORDER.ASSET_LAYER);

        // Setup background quarters
        this._setupMapElements();

        // Calculate map bounds
        var totalRect = this._calculateTotalMapRect(this.mapContainerNode);
        if (totalRect) {
            this.calculatedMapBounds = {
                left: totalRect.x,
                right: totalRect.x + totalRect.width,
                bottom: totalRect.y,
                top: totalRect.y + totalRect.height
            };
        }
    },

    _setupMapElements: function() {
        if (!this.mapContainerNode) {
            cc.log("setupMapElements: mapContainerNode is null. Skipping.");
            return;
        }
        // Correct the names in this array
        const quarterNames = ["topLeft", "topRight", "botLeft", "botRight"];

        for (let i = 0; i < quarterNames.length; i++) {
            // Use a different map for backgroundQuarters indices if needed,
            // but for finding them, this is the main fix.
            const quarter = this.mapContainerNode.getChildByName(quarterNames[i]);
            this.backgroundQuarters[i] = quarter; // Note: this might not map to the visually correct index, but it will find the node.
            if (quarter) {
                cc.log("Found quarter: " + quarter.getName() + ", setting Z-order.");
                quarter.setLocalZOrder(PVP_MAP_INTERNAL_Z_ORDER.BACKGROUND_QUARTERS);
            } else {
                cc.warn("Could not find quarter: " + quarterNames[i]);
            }
        }
    },

    _initGrid: function () {
        var mapSize = this.tmxMapNode.getContentSize();
        this.gridSystem = new GridSystem(76, 57, mapSize.width / 2, 57);
        this.gridDrawer = new GridDrawer(this.gridSystem);
        this.gridNode = this.gridDrawer.createGridNode();
        this.mapElement.addChild(this.gridNode);
        this.gridNode.setVisible(false);
    },

    _initPathfindingSystems: function () {
        this.pathfindingGrid = new PathfindingGrid();
        this.pathfinder = new Pathfinder(this.pathfindingGrid);
        this._targetSelector = new TargetSelector(this.pathfindingGrid, 10);
        this._enemyBuildings = [];
    },

    _loadOpponentBase: function () {
        this.pathfindingGrid.reset();
        this.pathfinder.invalidateCache();

        var worldData = this.pvpBattleFactory.createWorldFromOpponentData(this.opponentData, this);
        this._enemyBuildings = worldData.enemyBuildings;
        this.mapData = worldData.mapData;

        var allMapAssets = this._getAllEnemyBuildings();
        this.pathfindingGrid.calculateNoDeployZones(allMapAssets);
        this.deployZoneDrawer = new DeployZoneDrawer(this.gridSystem, this.pathfindingGrid);
        var boundaryNode = this.deployZoneDrawer.getBoundaryNode();
        boundaryNode.setVisible(false);
        this.mapElement.addChild(boundaryNode, 2);

        this._targetSelector.rebuildBuckets(this._enemyBuildings);
    },

    _initCamera: function () {
        this.cameraController = new CameraController(this.gameLayer);
        var mapBounds = this.calculatedMapBounds;
        if (mapBounds) {
            this.cameraController.updateBounds(mapBounds);
            var centerX = (mapBounds.left + mapBounds.right) / 2;
            var centerY = (mapBounds.bottom + mapBounds.top) / 2;
            this.cameraController.setPosition(centerX, centerY);
        }
    },

    _initBattleManager: function() {
        var battleManager = BattleManager.getInstance();
        if (!this.opponentData) {
            cc.log.error("PVPBattleScene Error: Khởi tạo trận đấu với dữ liệu đối thủ không hợp lệ (null hoặc undefined).");
            fr.view(UIManager);
            return;
        }
        let totalGoldBuildingHealth = 0;
        let totalElixirBuildingHealth = 0;

        this._enemyBuildings.forEach((building) => {
            if (building.buildingType.startsWith("TOW_") || building.buildingType.startsWith("STO_1")) {
                totalGoldBuildingHealth += building.maxHealth;
            }
            if (building.buildingType.startsWith("TOW_") || building.buildingType.startsWith("STO_2")) {
                totalElixirBuildingHealth += building.maxHealth;
            }
        });

        battleManager.initializeLootParameters({
            totalGold: Math.ceil(this.mapData.resourse.gold / 5),
            totalElixir: Math.ceil(this.mapData.resourse.oil/ 5),
            totalGoldHealth: totalGoldBuildingHealth,
            totalElixirHealth: totalElixirBuildingHealth,
        });

        battleManager.totalHealth = 0;
        battleManager.totalBuildingCount = 0;
        this._enemyBuildings.forEach((building) => {
            if (!building.buildingType.startsWith("WAL_")) {
                battleManager.totalHealth += building.health;
                if (!building.buildingType.startsWith("TRA_")) {
                    battleManager.totalBuildingCount++;
                }
            }
        });
    },


    _initBattleHUD: function (visibleOrigin, visibleSize, identifier) {
        var battleHUD = new GUIBattleHUD(res.battle_ui_json, identifier, true);
        battleHUD.resultPanel.setVisible(false);
        battleHUD.findNextButton.setVisible(true);
        var contentNode = battleHUD._rootNode;
        var scale = Math.min(visibleSize.width / contentNode.getContentSize().width, visibleSize.height / contentNode.getContentSize().height);
        contentNode.setScale(scale);
        contentNode.setAnchorPoint(0.5, 0.5);
        contentNode.setPosition(visibleOrigin.x + visibleSize.width / 2, visibleOrigin.y + visibleSize.height / 2);
        this.addChild(battleHUD, 1);
        this.battleHUD = battleHUD;
        if (this.battleHUD.endButton) {
            this.battleHUD.endButton.addClickEventListener(this._endBattle.bind(this));
        }
        this.battleHUD.setVisible(true);
    },

    _initResultUI: function (visibleOrigin, visibleSize) {
        var resultUI = new GUIResultUI();
        var contentNode = resultUI._rootNode;
        var scale = Math.min(visibleSize.width / contentNode.getContentSize().width, visibleSize.height / contentNode.getContentSize().height);
        contentNode.setScale(scale);
        contentNode.setAnchorPoint(0.5, 0.5);
        contentNode.setPosition(visibleOrigin.x + visibleSize.width / 2, visibleOrigin.y + visibleSize.height / 2);
        this.addChild(resultUI, 2);
        this.resultUI = resultUI;
        this.resultUI.setVisible(false);
    },

    _initTimer: function() {
        this._remainingTimeInSeconds = BATTLE_DURATION_SECONDS;
        this._updateTimerLabel();
        this.schedule(this._updateTimer, 1.0);
    },

    _updateTimer: function(dt) {
        if (this._remainingTimeInSeconds > 0) {
            this._remainingTimeInSeconds--;
            this._updateTimerLabel();
        } else {
            cc.log("Battle timer has ended!");
            this.unschedule(this._updateTimer);
            this._endBattle();
        }
    },

    _updateTimerLabel: function() {
        if (this.battleHUD && this.battleHUD.timerLabel) {
            const timeString = Utils.formatTime(this._remainingTimeInSeconds);
            this.battleHUD.timerLabel.setString("Thời gian còn lại: " + timeString);
        }
    },

    _endBattle: function() {
        if (this._battleEnded) return;
        this._battleEnded = true;
        this.unscheduleUpdate();
        this._showResultUI();
    },

    _showResultUI: function() {
        if (this.resultUI && !this.resultUI.isVisible()) {
            cc.log("PvP Battle ended. Showing result UI.");
            var battleManager = BattleManager.getInstance();
            const usedTroops = this.battleHUD.getUsedTroops();

            // Deduct used troops from client-side player data
            var playerDataManager = PlayerDataManager.getInstance();
            playerDataManager.deductUsedTroops(usedTroops);

            // Prestige calculation
            var playerPrestige = PlayerDataManager.getInstance().playerData.prestigePoint;
            var opponentPrestige = this.opponentData.prestige || 0;

            var prestigeChange = 0;
            if(this._battleStarted) {
                var winAmount = (playerPrestige > opponentPrestige) ? 5 : 10;
                var loseAmount = (playerPrestige > opponentPrestige) ? -10 : -5;

                if (battleManager.starsWon > 0) { // Player wins
                    prestigeChange = winAmount;
                } else { // Player loses
                    prestigeChange = loseAmount;
                }
                PlayerDataManager.getInstance().updatePrestige(prestigeChange);
                cc.log(battleManager.getOpponent() + " - " + battleManager.starsWon + " stars, Prestige Change: " + prestigeChange);
                gv.testnetwork.connector.sendPVPBattleResult(
                    this.opponentData.username,
                    battleManager.starsWon > 0 ? 1 : 0, // 1 for win, 0 for lose
                    parseInt(battleManager.lootedGold),
                    parseInt(battleManager.lootedElixir),
                    usedTroops
                );
            }

            this.resultUI.updateStats(
                battleManager.starsWon,
                battleManager.lootedGold,
                battleManager.lootedElixir,
                usedTroops,
                prestigeChange // Pass prestige change to result UI
            );

            this.battleHUD.setVisible(false);
            this.resultUI.setVisible(true);
            this.unschedule(this._updateTimer);
        }
    },

    _initBuildingDestroyedListener: function() {
        cc.log(this._sceneId + ": Đang đăng ký listener cho BUILDING_DESTROYED.");
        this._buildingDestroyedListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: BattleEvents.BUILDING_DESTROYED,
            callback: this._onBuildingDestroyed.bind(this)
        });
        cc.eventManager.addListener(this._buildingDestroyedListener, this);
    },

    _onBuildingDestroyed: function(event) {
        cc.log(this._sceneId + ": <<<<< HANDLER ĐƯỢC THỰC THI >>>>>"); // Thêm log ở đây
        if (this._battleEnded) return;
        var eventData = event.getUserData();
        if (!eventData || !eventData.building) return;
        var destroyedBuilding = eventData.building;

        this._removeDestroyedBuildingFromWorld(destroyedBuilding);

        if (destroyedBuilding.buildingType.startsWith("WAL_")) {
            this.pathfindingGrid.removeWall(destroyedBuilding.gridX, destroyedBuilding.gridY);
            this.pathfinder.invalidateCache();
        }

        this.battleTroopManager.retargetTroopsForDestroyedBuilding(destroyedBuilding.id);
        this._checkForFinalResourceBuilding(destroyedBuilding.buildingType);
    },

    _initFireBulletListener: function() {
        this._fireBulletListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: BattleEvents.FIRE_BULLET,
            callback: this._onFireBullet.bind(this)
        });
        cc.eventManager.addListener(this._fireBulletListener, this);
    },

    _onFireBullet: function(event) {
        var eventData = event.getUserData();
        if (!eventData) return;
        var bullet = new Bullet(
            eventData.attacker,
            eventData.target,
            eventData.damage,
            eventData.bulletType,
            this,
            eventData.startPos,
            eventData.attacker.splashRadius || 0
        );
        this.mapElement.addChild(bullet, 10000);
    },

    _initStarsUpdateListener: function() {
        this._starsUpdateListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: BattleEvents.STARS_UPDATED,
            callback: this._onStarsUpdated.bind(this)
        });
        cc.eventManager.addListener(this._starsUpdateListener, this);
    },

    _onStarsUpdated: function(event) {
        var stars = event.getUserData().stars;
        if (stars >= 3) {
            this._endBattle();
        }
    },

    _removeDestroyedBuildingFromWorld: function(building) {
        if (building && typeof building.cleanup === 'function') {
            building.cleanup();
        }
        const index = this._enemyBuildings.findIndex(b => b.id === building.id);
        if (index > -1) {
            this._enemyBuildings.splice(index, 1);
        }
    },

    _checkForFinalResourceBuilding: function(destroyedBuildingType) {
        if (!(destroyedBuildingType.startsWith("TOW_") || destroyedBuildingType.startsWith("STO_"))) return;
        let goldBuildingExists = this._enemyBuildings.some(b => b.buildingType.startsWith("TOW_") || b.buildingType.startsWith("STO_1"));
        let elixirBuildingExists = this._enemyBuildings.some(b => b.buildingType.startsWith("TOW_") || b.buildingType.startsWith("STO_2"));

        const battleManager = BattleManager.getInstance();
        if (!goldBuildingExists) battleManager.lootedGold = battleManager.totalGold;
        if (!elixirBuildingExists) battleManager.lootedElixir = battleManager.totalElixir;

        if (!goldBuildingExists || !elixirBuildingExists) {
            cc.eventManager.dispatchCustomEvent(BattleEvents.LOOT_UPDATED, {
                totalLootedGold: Math.floor(battleManager.lootedGold),
                totalLootedElixir: Math.floor(battleManager.lootedElixir)
            });
        }
    },

    _getAllEnemyBuildings: function () {
        return this._enemyBuildings || [];
    },

    _calculateTotalMapRect: function (rootNode) {
        var topLeft = rootNode.getChildByName("topLeft");
        var topRight = rootNode.getChildByName("topRight");
        var botLeft = rootNode.getChildByName("botLeft");
        var botRight = rootNode.getChildByName("botRight");
        if (!topLeft || !topRight || !botLeft || !botRight) return null;
        var totalRect = cc.rectUnion(topLeft.getBoundingBox(), topRight.getBoundingBox());
        totalRect = cc.rectUnion(totalRect, botLeft.getBoundingBox());
        totalRect = cc.rectUnion(totalRect, botRight.getBoundingBox());
        return totalRect;
    },

    _findAndSetFont: function (node) {
        if (!node) return;
        if (node.getName() && (node.getName().endsWith("Text") || node.getName().endsWith("Label"))) {
            node.setFontName(res.rowdies_regular_29_07_ttf);
            node.enableOutline(cc.color(0, 0, 0), 1);
        }
        var children = node.getChildren();
        for (var i = 0; i < children.length; i++) {
            this._findAndSetFont(children[i]);
        }
    }
});