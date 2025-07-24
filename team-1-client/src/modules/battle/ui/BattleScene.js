const BATTLE_GRID_WIDTH = 44;
const BATTLE_DURATION_SECONDS = 90;

var BattleScene = cc.Layer.extend({
    dungeonBackGround: null,
    battleHUD: null,
    preBattleHUD: null,
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
    mapIndex: null,

    // --- Manager Classes ---
    battleFactory: null,
    battleTroopManager: null,
    battleInputManager: null,
    _fireBulletListener: null,
    _battleEnded: false,

    ctor: function (mapIndex) {
        this._super();
        this.mapIndex = mapIndex;
        var visibleSize = cc.director.getVisibleSize();
        var visibleOrigin = cc.director.getVisibleOrigin();
        this.gameLayer = new cc.Node();
        this.addChild(this.gameLayer);


        this._initDungeonBackGround(visibleOrigin, visibleSize);
        this._initGrid();
        this._initPathfindingSystems();

        // Instantiate the factory and load the world
        this.battleFactory = new BattleFactory(this.gridSystem, this.pathfindingGrid, this.tmxMapNode);
        this._loadWorld(mapIndex);

        // Instantiate managers that depend on world data
        this.battleTroopManager = new BattleTroopManager(this.tmxMapNode, this.gridSystem, this.pathfinder, this._targetSelector, this._enemyBuildings, this);

        // Initialize UI and other systems
        this._initCamera();
        this._initBattleManager(mapIndex);
        this._initPreBattleHUD(visibleOrigin, visibleSize);
        this._initBattleHUD(visibleOrigin, visibleSize);
        this._initResultUI(visibleOrigin, visibleSize);

        this._initBuildingDestroyedListener();
        this._initFireBulletListener();
        this._initStarsUpdateListener();

        // Initialize the input manager last, as it depends on other components like the HUD
        this.battleInputManager = new BattleInputManager(this, this.tmxMapNode, this.battleHUD, this.battleTroopManager, this.gridSystem, this.pathfindingGrid, this.deployZoneDrawer);
        this.battleInputManager.initListeners();

        this._findAndSetFont(this);
        this.scheduleUpdate();
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
        this._battleEnded = true; 
        this.unscheduleUpdate(); 
        this._showResultUI();
    },

    _showResultUI: function() {
        if (this.resultUI && !this.resultUI.isVisible()) {
            var battleManager = BattleManager.getInstance();
            const usedTroops = this.battleHUD.getUsedTroops();

            this.resultUI.updateStats(
                battleManager.starsWon,
                Math.round(battleManager.lootedGold),
                Math.round(battleManager.lootedElixir),
                usedTroops
            );
            gv.testnetwork.connector.sendBattleResult(
                this.mapIndex,
                battleManager.starsWon,
                Math.round(battleManager.lootedGold),
                Math.round(battleManager.lootedElixir),
                usedTroops
            );

            var playerData = PlayerDataManager.getInstance().playerData;
            var mapEntry = playerData.playerMaps.find(map => map.mapIndex === this.mapIndex);

            var remainingGold = Math.max(0, battleManager.totalGold - battleManager.lootedGold);
            var remainingElixir = Math.max(0, battleManager.totalElixir - battleManager.lootedElixir);

            if (mapEntry) {
                mapEntry.stars = Math.max(mapEntry.stars, battleManager.starsWon); // Only update if new stars are higher
                mapEntry.remainingGold = remainingGold;
                mapEntry.remainingElixir = remainingElixir;
            } else {
                playerData.playerMaps.push({
                    mapIndex: this.mapIndex,
                    stars: battleManager.starsWon,
                    remainingGold: remainingGold,
                    remainingElixir: remainingElixir
                });
            }
            cc.eventManager.dispatchCustomEvent(BattleEvents.BATTLE_ENDED_UPDATE_GUI, {
                mapIndex: this.mapIndex,
                stars: battleManager.starsWon,
                remainingGold: remainingGold,
                remainingElixir: remainingElixir
            });
            this.battleHUD.setVisible(false);
            this.resultUI.setVisible(true);
            this.unschedule(this._updateTimer);
        }
    },

    _initStarsUpdateListener: function() {
        this._starsUpdateListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: BattleEvents.STARS_UPDATED,
            callback: this._onStarsUpdated.bind(this)
        });
        cc.eventManager.addListener(this._starsUpdateListener, 1);
    },

    _onStarsUpdated: function(event) {
        var stars = event.getUserData().stars;
        if (stars >= 3) {
            this._endBattle(); // End the battle immediately
        }
    },

    _initTimer: function() {
        this._remainingTimeInSeconds = BATTLE_DURATION_SECONDS;
        this._updateTimerLabel();
        this.schedule(this._updateTimer, 1.0);
    },

    loadTroopToFight: function(troopToFightData) {
        this.battleHUD.setTroopData(troopToFightData);
        if (this.preBattleHUD) {
            this.preBattleHUD.setVisible(false);
        }
        if (this.battleHUD) {
            this.battleHUD.setVisible(true);
        }
    },

    startBattle: function() {
        this._battleStarted = true;
        this._initTimer();
    },

    _initResultUI: function (visibleOrigin, visibleSize) {
        var resultUI = new GUIResultUI();
        var contentNode = resultUI._rootNode;
        var scale = Math.min(visibleSize.width / contentNode.getContentSize().width, visibleSize.height / contentNode.getContentSize().height);
        contentNode.setScale(scale);
        contentNode.setAnchorPoint(0.5, 0.5);
        contentNode.setPosition(visibleOrigin.x + visibleSize.width / 2, visibleOrigin.y + visibleSize.height / 2);
        this.addChild(resultUI, 2); // z-order 2 to appear above the HUD
        this.resultUI = resultUI;
        this.resultUI.setVisible(false);
    },

    _initPathfindingSystems: function () {
        this.pathfindingGrid = new PathfindingGrid();
        this.pathfinder = new Pathfinder(this.pathfindingGrid);
        this._targetSelector = new TargetSelector(this.pathfindingGrid, 10);
        this._enemyBuildings = [];
    },

    _loadWorld: function (mapIndex) {
        this.pathfindingGrid.reset();
        this._targetSelector.pathfindingGrid = this.pathfindingGrid;
        this.pathfinder.pathfindingGrid = this.pathfindingGrid;
        this.pathfinder.invalidateCache();

        var worldData = this.battleFactory.createWorldFromMap(mapIndex, this);
        this._enemyBuildings = worldData.enemyBuildings;
        this.mapData = worldData.mapData;

        if (!this.mapData) {
            return;
        }

        var allMapAssets = this._getAllEnemyBuildings();
        this.pathfindingGrid.calculateNoDeployZones(allMapAssets);

        this.deployZoneDrawer = new DeployZoneDrawer(this.gridSystem, this.pathfindingGrid);
        var boundaryNode = this.deployZoneDrawer.getBoundaryNode();
        boundaryNode.setVisible(false);
        this.tmxMapNode.addChild(boundaryNode, 2);

        this._targetSelector.rebuildBuckets(this._enemyBuildings);
    },

    _initCamera: function () {
        this.cameraController = new CameraController(this.gameLayer);
        var mapBounds = this._getMapBounds();
        if (mapBounds) {
            this.cameraController.updateBounds(mapBounds);
            var centerX = (mapBounds.left + mapBounds.right) / 2;
            var centerY = (mapBounds.bottom + mapBounds.top) / 2;
            this.cameraController.setPosition(centerX, centerY);
        }
    },

    _initGrid: function () {
        var tmxMapNode = this.dungeonBackGround._rootNode.getChildByName("dungeonMapBackGround");
        this.tmxMapNode = tmxMapNode;
        var mapSize = tmxMapNode.getContentSize();
        this.gridSystem = new GridSystem(76, 57, mapSize.width / 2, 57);
        this.gridDrawer = new GridDrawer(this.gridSystem);
        this.gridNode = this.gridDrawer.createGridNode();
        this.tmxMapNode.addChild(this.gridNode);
        this.gridNode.setVisible(false);
    },

    _initBattleManager: function(mapIndex){
        var battleManager = BattleManager.getInstance();
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

        var playerMaps = PlayerDataManager.getInstance().playerData.playerMaps;
        var mapData = playerMaps.find(map => map.mapIndex === mapIndex);

        let initialGold = this.mapData.resourse.gold;
        let initialElixir = this.mapData.resourse.elixir;

        if (mapData) {
            initialGold = mapData.remainingGold;
            initialElixir = mapData.remainingElixir;
        }

        battleManager.initializeLootParameters({
            totalGold: initialGold,
            totalElixir: initialElixir,
            totalGoldHealth: totalGoldBuildingHealth,
            totalElixirHealth: totalElixirBuildingHealth,
        });

        battleManager.totalHealth = 0;
        battleManager.totalBuildingCount = 0;
        this._enemyBuildings.forEach((building) => {
            if (!building.buildingType.startsWith("WAL_")) {
                battleManager.totalHealth += building.health;

                if( !building.buildingType.startsWith("TRA_")) {
                    battleManager.totalBuildingCount++;
                }
            }
            
            
        });
    },

    toggleGrid: function () {
        this.gridVisible = !this.gridVisible;
        this.gridNode.setVisible(this.gridVisible);
    },

    onExit: function () {
        this._super();
        this.unschedule(this._updateTimer);
        BattleManager.getInstance().reset();
        this.battleInputManager.cleanup(); // Cleanup input listeners
        if (this._buildingDestroyedListener) {
            cc.eventManager.removeListener(this._buildingDestroyedListener);
        }
        if (this._fireBulletListener) {
            cc.eventManager.removeListener(this._fireBulletListener);
        }
        if (this._starsUpdateListener) {
            cc.eventManager.removeListener(this._starsUpdateListener);
        }
    },

    _initBuildingDestroyedListener: function() {
        this._buildingDestroyedListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: BattleEvents.BUILDING_DESTROYED,
            callback: this._onBuildingDestroyed.bind(this)
        });
        cc.eventManager.addListener(this._buildingDestroyedListener, 1);
    },

    _onBuildingDestroyed: function(event) {
        if (this._battleEnded) {
            return; // Do not process if battle has ended
        }
        var eventData = event.getUserData();
        if (!eventData || !eventData.building) return;
        var destroyedBuilding = eventData.building;
        this._removeDestroyedBuildingFromWorld(destroyedBuilding);

        // If the destroyed building was a wall, update the pathfinding grid and invalidate pathfinder cache
        if (destroyedBuilding.buildingType.startsWith("WAL_")) {
            this.pathfindingGrid.removeWall(destroyedBuilding.gridX, destroyedBuilding.gridY);
            this.pathfinder.invalidateCache();
            this.pathfindingGrid.removeWall(destroyedBuilding.gridX, destroyedBuilding.gridY);
            this.pathfinder.invalidateCache();
        }
        this.battleTroopManager.retargetTroopsForDestroyedBuilding(destroyedBuilding.id);
        this._checkForFinalResourceBuilding(destroyedBuilding.buildingType);
    },

    _checkForFinalResourceBuilding: function(destroyedBuildingType) {
        if (!(destroyedBuildingType.startsWith("TOW_") || destroyedBuildingType.startsWith("STO_"))) return;
        let goldBuildingExists = false;
        let elixirBuildingExists = false;
        for (let i = 0; i < this._enemyBuildings.length; i++) {
            const building = this._enemyBuildings[i];
            if (building.buildingType.startsWith("TOW_") || building.buildingType.startsWith("STO_1")) goldBuildingExists = true;
            if (building.buildingType.startsWith("TOW_") || building.buildingType.startsWith("STO_2")) elixirBuildingExists = true;
        }
        const battleManager = BattleManager.getInstance();
        if ((destroyedBuildingType.startsWith("TOW_") || destroyedBuildingType.startsWith("STO_1")) && !goldBuildingExists) {
            battleManager.lootedGold = battleManager.totalGold;
        }
        if ((destroyedBuildingType.startsWith("TOW_") || destroyedBuildingType.startsWith("STO_2")) && !elixirBuildingExists) {
            battleManager.lootedElixir = battleManager.totalElixir;
        }
        if (!goldBuildingExists || !elixirBuildingExists) {
            cc.eventManager.dispatchCustomEvent(BattleEvents.LOOT_UPDATED, {
                totalLootedGold: Math.round(battleManager.lootedGold),
                totalLootedElixir: Math.round(battleManager.lootedElixir)
            });
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
        cc.log("BattleScene: Removed " + building.id + " from world state.");
    },

    _getAllEnemyBuildings: function () {
        return this._enemyBuildings || [];
    },

    _getMapBounds: function () {
        return this.calculatedMapBounds;
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
    },

    _initDungeonBackGround: function (visibleOrigin, visibleSize) {
        var dungeonBackground = new GUIDungeonBackGround(res.dungeon_map_back_ground_json);
        this.dungeonBackGround = dungeonBackground;
        var totalRect = this._calculateTotalMapRect(dungeonBackground._rootNode);
        if (totalRect) {
            this.calculatedMapBounds = {
                left: totalRect.x,
                right: totalRect.x + totalRect.width,
                bottom: totalRect.y,
                top: totalRect.y + totalRect.height
            };
        }
        this.gameLayer.addChild(dungeonBackground, 0);
    },

    _initBattleHUD: function (visibleOrigin, visibleSize) {
        var battleHUD = new GUIBattleHUD(res.battle_ui_json, this.mapIndex, false);
        this.addChild(battleHUD, 1);
        this.battleHUD = battleHUD;

        if (this.battleHUD.endButton) {
            this.battleHUD.endButton.addClickEventListener(this._endBattle.bind(this));
        }
        this.battleHUD.findNextButton.setVisible(false);
        this.battleHUD.setVisible(false);
    },

    _initPreBattleHUD: function (visibleOrigin, visibleSize) {
        var preBattleHUD = new GUIPreBattleHUD(res.pre_battle_ui_json, this.mapIndex, this);
        this.addChild(preBattleHUD, 1);
        this.preBattleHUD = preBattleHUD;
    },

    _initFireBulletListener: function() {
        this._fireBulletListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: BattleEvents.FIRE_BULLET,
            callback: this._onFireBullet.bind(this)
        });
        cc.eventManager.addListener(this._fireBulletListener, 1);
    },

    _onFireBullet: function(event) {
        var eventData = event.getUserData();
        if (!eventData) return;
        var bullet = new Bullet(
            eventData.attacker,
            eventData.target,
            eventData.damage,
            eventData.bulletType,
            this, // Pass self (BattleScene) to the bullet
            eventData.startPos,
            eventData.attacker.splashRadius || 0 
        );
            const BULLET_Z_ORDER = 10000;
            this.tmxMapNode.addChild(bullet, BULLET_Z_ORDER);
    },
});