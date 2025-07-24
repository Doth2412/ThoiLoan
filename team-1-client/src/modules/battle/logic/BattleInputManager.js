/**
 * BattleInputManager.js: Manages all user input (keyboard and touch) for the BattleScene.
 */
var BattleInputManager = cc.Class.extend({
    _battleScene: null,
    _tmxMapNode: null,
    _battleHUD: null,
    _battleTroopManager: null,
    _gridSystem: null,
    _pathfindingGrid: null,
    _deployZoneDrawer: null,

    _keyboardListener: null,
    _mapTouchListener: null,

    ctor: function(battleScene, tmxMapNode, battleHUD, battleTroopManager, gridSystem, pathfindingGrid, deployZoneDrawer) {
        this._battleScene = battleScene;
        this._tmxMapNode = tmxMapNode;
        this._battleHUD = battleHUD;
        this._battleTroopManager = battleTroopManager;
        this._gridSystem = gridSystem;
        this._pathfindingGrid = pathfindingGrid;
        this._deployZoneDrawer = deployZoneDrawer;

        this._currentTouchLocation = null;
        this._continuousDeployKey = null;
    },

    initListeners: function() {
        this._addKeyboardListener();
        this._addMapTouchListener();
    },

    _addKeyboardListener: function () {
        this._keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this._onKeyPressed.bind(this)
        });
        cc.eventManager.addListener(this._keyboardListener, this._battleScene);
    },

    _onKeyPressed: function (keyCode) {
        if (keyCode === cc.KEY.g) {
            this._battleScene.toggleGrid();
        }
    },

    _addMapTouchListener: function () {
        this._mapTouchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this._handleTouchBegan.bind(this),
            onTouchMoved: this._handleTouchMoved.bind(this),
            onTouchEnded: this._stopContinuousDeployment.bind(this),
            onTouchCancelled: this._stopContinuousDeployment.bind(this)
        });

        cc.eventManager.addListener(this._mapTouchListener, this._tmxMapNode);
    },

    _handleTouchBegan: function (touch, event) {
        var selectedTroopType = this._battleHUD.getSelectedTroopType();
        if (!selectedTroopType) {
            return false;
        }

        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var gridPos = this._gridSystem.localToGrid(locationInNode.x, locationInNode.y);

        if (!this._pathfindingGrid.isDeployable(gridPos.x, gridPos.y)) {
            cc.log("Cannot deploy at (" + gridPos.x + "," + gridPos.y + "). Zone is not deployable.");
            if (this._deployZoneDrawer) {
                this._deployZoneDrawer.flashBoundary();
            }
            return false;
        }

        if (!this._battleScene._battleStarted) {
            this._battleScene.startBattle();
        }
        this._battleTroopManager.spawnTroop(selectedTroopType, locationInNode);
        this._battleHUD.decrementTroopCount(selectedTroopType);

        this._currentTouchLocation = locationInNode;
        this._startContinuousDeployment();

        return true;
    },

    _handleTouchMoved: function (touch, event) {
        var newLocationInNode = event.getCurrentTarget().convertToNodeSpace(touch.getLocation());
        var newGridPos = this._gridSystem.localToGrid(newLocationInNode.x, newLocationInNode.y);

        if (this._pathfindingGrid.isDeployable(newGridPos.x, newGridPos.y)) {
            this._currentTouchLocation = newLocationInNode;
            this._startContinuousDeployment();
        } else {
            this._stopContinuousDeployment();
        }
    },

    _startContinuousDeployment: function () {
        if (this._continuousDeployKey) {
            return; // Already deploying
        }
        var selectedTroopType = this._battleHUD.getSelectedTroopType();
        if (!selectedTroopType) {
            return; // No troop selected
        }
        this._continuousDeployKey = "continuousDeploy_" + Date.now();
        cc.director.getScheduler().schedule(this._continuousDeploy, this, 0.1, cc.REPEAT_FOREVER, 0.1, false, this._continuousDeployKey);
    },

    _stopContinuousDeployment: function () {
        if (this._continuousDeployKey) {
            cc.director.getScheduler().unschedule(this._continuousDeployKey, this);
            this._continuousDeployKey = null;
        }
    },

    _continuousDeploy: function (dt) {
        var selectedTroopType = this._battleHUD.getSelectedTroopType();
        if (!selectedTroopType) {
            this._stopContinuousDeployment();
            return;
        }

        var locationInNode = this._currentTouchLocation;
        var gridPos = this._gridSystem.localToGrid(locationInNode.x, locationInNode.y);

        if (!this._pathfindingGrid.isDeployable(gridPos.x, gridPos.y)) {
            cc.log("Cannot deploy at (" + gridPos.x + "," + gridPos.y + "). Zone is not deployable.");
            if (this._deployZoneDrawer) {
                this._deployZoneDrawer.flashBoundary();
            }
            this._stopContinuousDeployment();
            return;
        }

        this._battleTroopManager.spawnTroop(selectedTroopType, locationInNode);
        this._battleHUD.decrementTroopCount(selectedTroopType);
    },

    cleanup: function() {
        cc.log("Cleaning up BattleInputManager listeners.");
        if (this._keyboardListener) {
            cc.eventManager.removeListener(this._keyboardListener);
            this._keyboardListener = null;
        }
        if (this._mapTouchListener) {
            cc.eventManager.removeListener(this._mapTouchListener);
            this._mapTouchListener = null;
        }
        this._stopContinuousDeployment();
    }
});
