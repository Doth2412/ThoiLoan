const TroopManager = cc.Class.extend({
    army: null,
    housingSpace: null,
    currentAmount: null,
    ctor: function() {
        this.army = [];
    },

    initFromPlayerData: function() {
        var playerData = PlayerDataManager.getInstance().playerData;

        if (playerData && playerData.army) {
            this.setPlayerArmy(playerData.army);
        }
    },

    /**
     * The central coordinator for processing all offline training in parallel.
     * This version contains the final bug fixes and debug logs.
     */
    processAllBarracksOfflineTraining: function() {
        cc.log("TroopManager: --- Starting Offline Training Calculation ---");
        var buildingsManager = BuildingsManager.getInstance();
        if (!buildingsManager) {
            cc.error("TroopManager: Cannot process offline training, BuildingsManager not found.");
            return;
        }

        var barracks = buildingsManager.getAllBuildings().filter(b => b instanceof Barrack);
        if (barracks.length === 0) {
            return;
        }

        // PHASE 1: Read-Only Calculation
        var masterLog = [];
        cc.log("TroopManager: Phase 1 - Calculating completion logs from " + barracks.length + " barracks.");
        for (var i = 0; i < barracks.length; i++) {
            var barrack = barracks[i];
            var completionLog = barrack.calculateOfflineCompletionLog();
            if (completionLog.length > 0) {
                masterLog = masterLog.concat(completionLog);
            }
        }

        if (masterLog.length === 0) {
            cc.log("TroopManager: No troops were completed offline. Finalizing states.");
            for (var i = 0; i < barracks.length; i++) {
                barracks[i].finalizeOfflineState(0);
            }
            return;
        }

        // PHASE 2: Sorted Troop Collection
        cc.log("TroopManager: Phase 2 - Sorting and collecting " + masterLog.length + " completed troops.");
        masterLog.sort((a, b) => a.completionTime - b.completionTime);

        var barrackCollectedCount = {};
        barracks.forEach(function(b) {
            barrackCollectedCount[b.buildingIndex] = 0;
        });

        for (var j = 0; j < masterLog.length; j++) {
            var logEntry = masterLog[j];
            var currentArmySize = this.getCurrentArmySize();
            var totalHousingSpace = buildingsManager.getTotalHousingSpace();
            var troopHousingSpace = ItemConfigUtils.getTroopBaseConfig(logEntry.troopType).housingSpace;

            if (currentArmySize + troopHousingSpace <= totalHousingSpace) {
                this.onCompleteTrainingTroop(logEntry.troopType, 1, logEntry.sourceBarrack);

                var sourceBarrack = logEntry.sourceBarrack;
                barrackCollectedCount[sourceBarrack.buildingIndex]++;

            } else {
                cc.log("--> STOP. Cannot collect. Army camp would be full.");
                break;
            }
        }

        // PHASE 3: Finalize Barrack States
        cc.log("TroopManager: Phase 3 - Finalizing all barrack states.");
        for (var i = 0; i < barracks.length; i++) {
            var barrack = barracks[i];
            var collectedCount = barrackCollectedCount[barrack.buildingIndex];
            barrack.finalizeOfflineState(collectedCount);
        }

        cc.eventManager.dispatchCustomEvent("BARRACK_OFFLINE_PROCESSING_COMPLETE");
        cc.log("TroopManager: --- Offline Training Processing Complete ---");
    },

    loadExistingTroopsIntoCamps: function(uiManager) {
        if (!this.army || this.army.length === 0) {
            return;
        }

        var allBuildings = BuildingsManager.getInstance().getAllBuildings();
        var armyCamps = allBuildings.filter(b => b instanceof ArmyCamp && b.buildingState === BUILDING_STATES.OPERATING);

        if (armyCamps.length === 0) {
            return;
        }

        var armyToPlace = JSON.parse(JSON.stringify(this.army));

        for (var i = 0; i < armyToPlace.length; i++) {
            var troopSlot = armyToPlace[i];
            for (var j = 0; j < troopSlot.troopAmount; j++) {
                var placed = false;
                for (var k = 0; k < armyCamps.length; k++) {
                    var camp = armyCamps[k];
                    var troopInstanceForCheck = new Troop(troopSlot.troopType, 1);
                    if (camp.isAvailable(troopInstanceForCheck)) {
                        uiManager.spawnTroopInCampOnLoad({
                            troopType: troopSlot.troopType,
                            targetCamp: camp
                        });
                        placed = true;
                        break;
                    }
                }
            }
        }
    },

    onCompleteTrainingTroop: function(troopType, troopAmount, sourceBarrackObject){
        this.addTroopToArmy(troopType, troopAmount);
        gv.testnetwork.connector.sendUpdatePlayerArmyRequest(this.army);
        for(let i = 0; i < troopAmount; i++) {
            setTimeout(() => this._handleTroopSpawn(troopType, sourceBarrackObject), i * 500);
        }
    },

    _handleTroopSpawn: function(troopType, sourceBarrackObject) {
        var targetArmyCamp = BuildingsManager.getInstance().findAvailableArmyCamp(troopType);
        if (!sourceBarrackObject || !targetArmyCamp) {
            cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.ARMY_STATUS_UPDATED);
            return;
        }

        let pfGrid = BuildingsManager.getInstance().getPathfindingGrid();
        if (!pfGrid) {
            this.dispatchAnimationEvent(troopType, sourceBarrackObject, targetArmyCamp, null);
            cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.ARMY_STATUS_UPDATED);
            return;
        }

        let pathfinder = new Pathfinder(pfGrid);
        let sourceGridX = sourceBarrackObject.posX;
        let sourceGridY = sourceBarrackObject.posY;
        let targetGridPos = { x: targetArmyCamp.posX, y: targetArmyCamp.posY };

        let pathResult = pathfinder.findPath(sourceGridX, sourceGridY, targetGridPos.x, targetGridPos.y);
        let pathNodes = pathResult && pathResult.path ? pathResult.path : null;

        this.dispatchAnimationEvent(troopType, sourceBarrackObject, targetArmyCamp, pathNodes);
        cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.ARMY_STATUS_UPDATED);
    },

    dispatchAnimationEvent: function(troopType, sourceBuilding, targetBuilding, pathNodes) {
        var troopConfig = ItemConfigUtils.getTroopBaseConfig(troopType);
        var resourceImageKey = troopConfig && troopConfig.displayImageKey ? troopConfig.displayImageKey : "arm_1_1_idle_image0000_png";
        let eventData = {
            troopType: troopType,
            sourceBuilding: sourceBuilding,
            targetBuilding: targetBuilding,
            path: pathNodes,
            resourceImageKey: resourceImageKey
        };
        cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.SHOW_TROOP_DEPLOYMENT_ANIMATION, eventData);
    },

    addTroopToArmy:function (troopType, amount) {
        amount = amount || 1;
        for (var i = 0; i < this.army.length; i++) {
            if (this.army[i].troopType === troopType) {
                this.army[i].troopAmount += amount;
                return;
            }
        }
        this.army.push({ troopType: troopType, troopAmount: amount });
    },

    removeTroopFromArmy: function(troopType) {
        for (var i = 0; i < this.trainingQueue.length; i++) {
            if (this.trainingQueue[i].troopType === troopType) {
                this.trainingQueue[i].troopAmount--;
                return;
            }
        }
    },

    setPlayerArmy: function (army) {
        this.army = army;
    },

    assignTroopToArmyCamp: function (troopType) {
        var armyCamp = BuildingsManager.getInstance().findAvailableArmyCamp(troopType);
        return armyCamp;
    },

    getCurrentArmySize: function () {
        let totalHousingSpace = 0;
        for( let i = 0; i < this.army.length; i++) {
            var troopSlot = this.army[i];
            var troopConfig = ItemConfigUtils.getTroopBaseConfig(troopSlot.troopType);
            if (troopConfig && troopConfig.housingSpace) {
                totalHousingSpace += troopSlot.troopAmount * troopConfig.housingSpace;
            }
        }
        return totalHousingSpace;
    },

    clearArmyForTesting: function() {
        this.army = [];
        gv.testnetwork.connector.sendUpdatePlayerArmyRequest(this.army);
        cc.eventManager.dispatchCustomEvent("ARMY_CLEARED_FOR_TESTING");
    }
});

TroopManager._instance = null;
TroopManager.getInstance = function() {
    if (!this._instance) {
        this._instance = new TroopManager();
    }
    return this._instance;
};
