/**
 * BattleTroopManager.js: Manages the lifecycle of all troops in the battle,
 * including spawning, finding targets, and cleanup.
 */
var BattleTroopManager = cc.Class.extend({
    _activeTroops: null,
    _tmxMapNode: null,
    _gridSystem: null,
    _pathfinder: null,
    _targetSelector: null,
    _enemyBuildings: null,
    _battleScene: null,

    ctor: function(tmxMapNode, gridSystem, pathfinder, targetSelector, enemyBuildings, battleScene) {
        this._activeTroops = [];
        this._tmxMapNode = tmxMapNode;
        this._gridSystem = gridSystem;
        this._pathfinder = pathfinder;
        this._targetSelector = targetSelector;
        this._enemyBuildings = enemyBuildings;
        this._battleScene = battleScene;
    },

    getActiveTroops: function() {
        return this._activeTroops;
    },

    update: function(dt) {
        if (this._battleScene && this._battleScene._battleEnded) {
            // Stop all active troops if battle has ended
            for (var i = this._activeTroops.length - 1; i >= 0; i--) {
                this._activeTroops[i].stopAllMovementAndAttacks();
                this._activeTroops[i].unscheduleUpdate();
            }
            return;
        }
        this._cleanupDeadTroops();
    },

    spawnTroop: function (troopType, position) {
        var troop = new Troop(troopType, 1, this._enemyBuildings, this, this._pathfinder, this._targetSelector, this._battleScene); // Pass battleScene

        // ugly hack to fix the troop position offset
        // Because the troop's animations may have an offset that needs to be applied
        var offsetX = 0;
        var offsetY = 0;
        if (troop.animations) {
            offsetX = troop.animations["idle"]["S"].offset.x;
            offsetY = troop.animations["idle"]["S"].offset.y;
        }

        // Adjust the position by subtracting the offset
        var adjustedPosition = cc.p(position.x - offsetX, position.y - offsetY);
        troop.setPosition(adjustedPosition);

        var gridPos = this._gridSystem.localToGrid(adjustedPosition.x, adjustedPosition.y);
        var zOrder = MAX_Z_ORDER - (gridPos.y * 44 + gridPos.x);
        troop.setLocalZOrder(zOrder);
        this._tmxMapNode.addChild(troop);
        this._activeTroops.push(troop);
        troop.playAnimation("idle", "S", true);

        this.findNewTargetForTroop(troop, true);
    },

    _cleanupDeadTroops: function() {
        for (var i = this._activeTroops.length - 1; i >= 0; i--) {
            var troop = this._activeTroops[i];
            if (!troop.isAlive) {
                this._activeTroops.splice(i, 1);
            }
        }
    },

    retargetTroopsForDestroyedBuilding: function(destroyedBuildingId) {
        if (this._battleScene && this._battleScene._battleEnded) {
            return;
        }
        // cc.log("DEBUG: BattleTroopManager: Re-evaluating targets for all active troops. Destroyed Building ID: " + destroyedBuildingId);
        for (var i = 0; i < this._activeTroops.length; i++) {
            var troop = this._activeTroops[i];
            // cc.log("DEBUG: Checking troop: " + troop.id + ", Type: " + troop.troopType + ", State: " + troop.troopState + ", Final Target: " + (troop.finalTarget ? troop.finalTarget.id : "None") + ", Original Final Target: " + (troop._originalFinalTarget ? troop._originalFinalTarget.id : "None"));
            var isTargetingDestroyedBuilding = (troop.targetBuilding && troop.targetBuilding.id === destroyedBuildingId) ||
                                          (troop.finalTarget && troop.finalTarget.id === destroyedBuildingId);

            if (isTargetingDestroyedBuilding) {
                // cc.log("DEBUG: Troop (" + troop.troopType + ") was targeting the destroyed building. Finding new target.");
                troop.stopAllMovementAndAttacks();
                this.findNewTargetForTroop(troop, false);
            } else if (troop.troopState === TROOP_STATE.ATTACKING_WALL) {
                // If the troop is attacking a wall, check if a better path to its final target is now available.
                // cc.log("DEBUG: Troop (" + troop.troopType + ") is attacking a wall. Checking for better path to final target.");
                troop.recalculatePathToFinalTarget();
            }
        }
    },

    findNewTargetForTroop: function(troop, isInitialSpawn) {
        if (this._battleScene && this._battleScene._battleEnded) {
            troop.stopAllMovementAndAttacks(); 
            return;
        }
        if (this._enemyBuildings.length === 0) {
            cc.log("No more buildings to target. Troop " + troop.troopType + " will remain idle.");
            troop.stopAllMovementAndAttacks();
            return;
        }

        var gridPos = this._gridSystem.localToGrid(troop.getPosition().x, troop.getPosition().y);
        var logicalTroopType = TargetSelector.getTroopTypeFromArm(troop.troopType);
        
        var troopForTargeting = {
            type: logicalTroopType,
            currentX: gridPos.x,
            currentY: gridPos.y,
            attackRange: troop.attackRange
        };
        var targetResult = this._targetSelector.findNearestTarget(troopForTargeting, this._enemyBuildings, this._pathfinder);

        if (!targetResult || !targetResult.path) {
            var spawnStatus = isInitialSpawn ? " on spawn" : "";
            cc.warn("No valid target found for troop " + troop.troopType + spawnStatus + " from position (" + gridPos.x + "," + gridPos.y + ")");
            troop.stopAllMovementAndAttacks(); // Ensure troop stops if no target is found
            return;
        }

        // cc.log("Target found for " + troop.troopType + ": " + targetResult.targetBuilding.buildingType + ". Path length: " + targetResult.path.length);
        troop.setPath(targetResult.path);
        troop.startMovingAlongPath(this._gridSystem, targetResult.targetBuilding);
    }
});
