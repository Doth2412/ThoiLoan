
var TROOP_TYPE = {
    GIANT: 'GIANT',
    THIEF: 'THIEF',
    WARRIOR: 'WARRIOR',
    ARCHER: 'ARCHER'
};

// Troop type mapping from ARM_# to TROOP_TYPE
TargetSelector.ARM_TO_TROOP_TYPE = {
    "ARM_1": TROOP_TYPE.WARRIOR,
    "ARM_2": TROOP_TYPE.ARCHER,
    "ARM_3": TROOP_TYPE.THIEF,
    "ARM_4": TROOP_TYPE.GIANT
};

TargetSelector.getTroopTypeFromArm = function(armType) {
    return TargetSelector.ARM_TO_TROOP_TYPE[armType] || TROOP_TYPE.WARRIOR;
};

// Target category constants for building types
var TARGET_CATEGORY = {
    DEFENSE: 'DEFENSE',
    RESOURCE: 'RESOURCE',
    ANY: 'ANY'
};

/**
 * TargetSelector class for troop target selection and spatial partitioning.
 * Uses a grid-based bucketing system to efficiently find nearby buildings for targeting.
 */
function TargetSelector(pathfindingGrid, bucketSize) {
    if (typeof bucketSize === 'undefined') bucketSize = 10;
    this.pathfindingGrid = pathfindingGrid;
    this.bucketSize = bucketSize;
    this.numBucketX = Math.ceil(pathfindingGrid.gridWidth / bucketSize);
    this.numBucketY = Math.ceil(pathfindingGrid.gridHeight / bucketSize);
    this._initializeBuckets();
}

TargetSelector.TROOP_TYPE = TROOP_TYPE;
TargetSelector.TARGET_CATEGORY = TARGET_CATEGORY;

/**
 * Initializes the 2D array of buckets for spatial partitioning.
 */
TargetSelector.prototype._initializeBuckets = function() {
    this.buckets = [];
    for (var col = 0; col < this.numBucketX; col++) {
        this.buckets[col] = [];
        for (var row = 0; row < this.numBucketY; row++) {
            this.buckets[col][row] = [];
        }
    }
};

/**
 * Determines all bucket indices a given building occupies based on its grid area.
 */
TargetSelector.prototype._getBucketIndicesForBuilding = function(building) {
    var minCol = Math.floor(building.gridX / this.bucketSize);
    var minRow = Math.floor(building.gridY / this.bucketSize);
    var maxCol = Math.floor((building.gridX + building.width - 1) / this.bucketSize);
    var maxRow = Math.floor((building.gridY + building.height - 1) / this.bucketSize);
    var indices = [];
    for (var col = minCol; col <= maxCol; col++) {
        for (var row = minRow; row <= maxRow; row++) {
            if (col >= 0 && col < this.numBucketX && row >= 0 && row < this.numBucketY) {
                indices.push({col: col, row: row});
            }
        }
    }
    return indices;
};

/**
 * Adds a building's ID to all relevant buckets it occupies.
 */
TargetSelector.prototype.addBuildingToBuckets = function(building) {
    var bucketIndices = this._getBucketIndicesForBuilding(building);
    for (var i = 0; i < bucketIndices.length; i++) {
        var col = bucketIndices[i].col;
        var row = bucketIndices[i].row;
        this.buckets[col][row].push(building.id);
    }
};

/**
 * Removes a building's ID from all relevant buckets it occupies.
 */
TargetSelector.prototype.removeBuildingFromBuckets = function(building) {
    var bucketIndices = this._getBucketIndicesForBuilding(building);
    for (var i = 0; i < bucketIndices.length; i++) {
        var col = bucketIndices[i].col;
        var row = bucketIndices[i].row;
        var bucket = this.buckets[col][row];
        for (var j = bucket.length - 1; j >= 0; j--) {
            if (bucket[j] === building.id) {
                bucket.splice(j, 1);
            }
        }
    }
};

/**
 * Retrieves unique building IDs from buckets within a given search radius around a central point.
 */
TargetSelector.prototype.getBuildingsInBuckets = function(centerX, centerY, searchRadiusInBuckets) {
    var centerCol = Math.floor(centerX / this.bucketSize);
    var centerRow = Math.floor(centerY / this.bucketSize);
    var foundBuildingIds = {};
    for (var dCol = -searchRadiusInBuckets; dCol <= searchRadiusInBuckets; dCol++) {
        for (var dRow = -searchRadiusInBuckets; dRow <= searchRadiusInBuckets; dRow++) {
            var col = centerCol + dCol;
            var row = centerRow + dRow;
            if (col >= 0 && col < this.numBucketX && row >= 0 && row < this.numBucketY) {
                var bucket = this.buckets[col][row];
                for (var i = 0; i < bucket.length; i++) {
                    foundBuildingIds[bucket[i]] = true;
                }
            }
        }
    }
    return Object.keys(foundBuildingIds);
};

/**
 * Clears and repopulates all buckets with the current list of buildings.
 */
TargetSelector.prototype.rebuildBuckets = function(allBuildingsList) {
    for (var col = 0; col < this.numBucketX; col++) {
        for (var row = 0; row < this.numBucketY; row++) {
            this.buckets[col][row] = [];
        }
    }
    for (var buildingIndex = 0; buildingIndex < allBuildingsList.length; buildingIndex++) {
        this.addBuildingToBuckets(allBuildingsList[buildingIndex]);
    }
};

/**
 * Returns the target priorities for a given troop type.
 * @param {string} troopType - The type of the troop (e.g., GIANT, THIEF, etc.)
 * @returns {Array} Array of target categories in priority order.
 */
TargetSelector.getTroopTargetPriorities = function(troopType) {
    var TROOP_TYPE = TargetSelector.TROOP_TYPE;
    var TARGET_CATEGORY = TargetSelector.TARGET_CATEGORY;
    if (troopType === TROOP_TYPE.GIANT) {
        return [TARGET_CATEGORY.DEFENSE, TARGET_CATEGORY.ANY];
    } else if (troopType === TROOP_TYPE.THIEF) {
        return [TARGET_CATEGORY.RESOURCE, TARGET_CATEGORY.ANY];
    } else {
        return [TARGET_CATEGORY.ANY];
    }
};

/**
 * Finds the nearest valid target building for a troop, based on troop priorities and path cost.
 *
 * Strategy:
 * 1. Iterate through the troop's target priorities in order (e.g., DEFENSE, then ANY for a Giant).
 * 2. For each priority level, find ALL available buildings on the map that match that category.
 * 3. If any matching buildings are found, calculate the path cost to each of them.
 * 4. Select the one with the lowest path cost. Prefer paths that don't break walls.
 * 5. If a valid target is found for a high priority level, return it immediately without checking lower priorities.
 *
 * Returns: { targetBuilding, path } or null if no valid target found.
 */
TargetSelector.prototype.findNearestTarget = function(troop, allBuildingsList, pathfinder) {
    var priorities = TargetSelector.getTroopTargetPriorities(troop.type);
    var TARGET_CATEGORY = TargetSelector.TARGET_CATEGORY;
    var troopX = troop.currentX;
    var troopY = troop.currentY;

    var doesPathBreakWalls = function(path) {
        if (!path) return false;
        for (var i = 0; i < path.length; i++) {
            if (path[i].isWallSegment) {
                return true;
            }
        }
        return false;
    };

    // This avoids iterating over every single building on the map.
    var buildingMap = {};
    for (var i = 0; i < allBuildingsList.length; i++) {
        buildingMap[allBuildingsList[i].id] = allBuildingsList[i];
    }

    // Start with a reasonable search radius.
    var searchRadiusInBuckets = 3;
    var candidateBuildingIds = this.getBuildingsInBuckets(troopX, troopY, searchRadiusInBuckets);

    // As a fallback, if no buildings are in the initial bucket search, search the whole map.
    if (candidateBuildingIds.length === 0) {
        candidateBuildingIds = Object.keys(buildingMap);
    }

    var availableBuildings = [];
    for (var i = 0; i < candidateBuildingIds.length; i++) {
        var building = buildingMap[candidateBuildingIds[i]];
        if (building && building.buildingState !== BATTLE_BUILDING_STATE.DESTROYED) {
            availableBuildings.push(building);
        }
    }

    // NEW: Separate walls from other buildings
    var nonWallBuildings = [];
    var wallBuildings = [];
    for (var i = 0; i < availableBuildings.length; i++) {
        var building = availableBuildings[i];
        if (building.buildingType.startsWith("WAL_")) {
            wallBuildings.push(building);
        } else {
            nonWallBuildings.push(building);
        }
    }

    // Iterate through priority levels (e.g., DEFENSE first for GIANT, then ANY)
    for (var priorityLevelIndex = 0; priorityLevelIndex < priorities.length; priorityLevelIndex++) {
        var currentCategory = priorities[priorityLevelIndex];
        var candidateBuildingsForCategory = [];

        // First, consider only non-wall buildings for this priority category
        for (var j = 0; j < nonWallBuildings.length; j++) {
            var building = nonWallBuildings[j];
            if (currentCategory === TARGET_CATEGORY.ANY || building.category === currentCategory) {
                candidateBuildingsForCategory.push(building);
            }
        }

        // Try to find a target among non-wall buildings
        var result = this._findBestTargetAmongCandidates(troop, candidateBuildingsForCategory, pathfinder, doesPathBreakWalls);
        if (result) {
            return result;
        }
    }

    // If no non-wall targets were found for any priority, then consider walls as targets
    // This means all primary targets are destroyed or unreachable without breaking walls,
    // or the troop's priority is "ANY" and there are only walls left.
    if (wallBuildings.length > 0) {
        cc.log("No non-wall targets found. Considering walls as targets.");
        // Treat walls as "ANY" category for targeting purposes
        var result = this._findBestTargetAmongCandidates(troop, wallBuildings, pathfinder, doesPathBreakWalls);
        if (result) {
            return result;
        }
    }

    return null;
};

TargetSelector.prototype._findBestTargetAmongCandidates = function(troop, candidates, pathfinder, doesPathBreakWalls) {
    var troopX = troop.currentX;
    var troopY = troop.currentY;

    var targetsInRange = [];
    var targetsOutOfRange = [];

    for (var k = 0; k < candidates.length; k++) {
        var b = candidates[k];
        var interactionPoints = this.pathfindingGrid.getWalkableInteractionPoints(b.id);
        if (!interactionPoints || interactionPoints.length === 0) {
            // Fallback for buildings with no defined perimeter (e.g., 1x1 buildings)
            interactionPoints = [{x: Math.floor(b.gridX + b.width / 2), y: Math.floor(b.gridY + b.height / 2)}];
        }

        var closestPointDistSq = Infinity;
        var isInRange = false;
        for (var p_idx = 0; p_idx < interactionPoints.length; p_idx++) {
            var p = interactionPoints[p_idx];
            var dx = p.x - troopX;
            var dy = p.y - troopY;
            var distSq = dx * dx + dy * dy;
            if (distSq < closestPointDistSq) {
                closestPointDistSq = distSq;
            }
            if (Math.max(Math.abs(dx), Math.abs(dy)) <= troop.attackRange) {
                isInRange = true;
            }
        }
        
        if (isInRange) {
            targetsInRange.push({ building: b, distSq: closestPointDistSq });
        } else {
            targetsOutOfRange.push(b);
        }
    }

    if (targetsInRange.length > 0) {
        targetsInRange.sort(function(a, b) { return a.distSq - b.distSq; });
        return {
            targetBuilding: targetsInRange[0].building,
            path: []
        };
    }

    if (targetsOutOfRange.length === 0) {
        return null;
    }

    var bestTargetNoWallBreak = null;
    var bestPathCostNoWallBreak = Infinity;
    var bestTargetWithWallBreak = null;
    var bestPathCostWithWallBreak = Infinity;

    for (var buildingIndex = 0; buildingIndex < targetsOutOfRange.length; buildingIndex++) {
        var building = targetsOutOfRange[buildingIndex];
        var interactionPoints = this.pathfindingGrid.getWalkableInteractionPoints(building.id);
        if (!interactionPoints || interactionPoints.length === 0) {
            interactionPoints = [{x: Math.floor(building.gridX + building.width / 2), y: Math.floor(building.gridY + building.height / 2)}];
        }

        var bestPoint = null;
        var bestPointDist = Infinity;
        for(var p_idx = 0; p_idx < interactionPoints.length; p_idx++) {
            var p = interactionPoints[p_idx];
            var dx = p.x - troopX;
            var dy = p.y - troopY;
            var distSq = dx*dx + dy*dy;
            if(distSq < bestPointDist) {
                bestPointDist = distSq;
                bestPoint = p;
            }
        }

        if (bestPoint) {
            var pathResult = pathfinder.findPath(troopX, troopY, bestPoint.x, bestPoint.y, troop.attackRange);

            if (pathResult && pathResult.path) {
                var pathCost = pathResult.cost;
                var breaksWalls = doesPathBreakWalls(pathResult.path);

                if (breaksWalls) {
                    if (pathCost < bestPathCostWithWallBreak) {
                        bestPathCostWithWallBreak = pathCost;
                        bestTargetWithWallBreak = { targetBuilding: building, path: pathResult.path };
                    }
                } else {
                    if (pathCost < bestPathCostNoWallBreak) {
                        bestPathCostNoWallBreak = pathCost;
                        bestTargetNoWallBreak = { targetBuilding: building, path: pathResult.path };
                    }
                }
            }
        }
    }

    if (bestTargetNoWallBreak) {
        return bestTargetNoWallBreak;
    }
    if (bestTargetWithWallBreak) {
        return bestTargetWithWallBreak;
    }
    return null;
};

/**
 * Finds a path to a specific target building for a troop.
 * This is used when a troop needs to re-evaluate its path to an already determined final target,
 * especially after environmental changes like a wall being destroyed.
 *
 * Returns: { targetBuilding, path } or null if no valid path found.
 */
TargetSelector.prototype.findPathToSpecificTarget = function(troop, specificTargetBuilding, allBuildingsList, pathfinder) {
    var troopX = troop.currentX;
    var troopY = troop.currentY;

    var doesPathBreakWalls = function(path) {
        if (!path) return false;
        for (var i = 0; i < path.length; i++) {
            if (path[i].isWallSegment) {
                return true;
            }
        }
        return false;
    };

    var building = specificTargetBuilding;
    var interactionPoints = this.pathfindingGrid.getWalkableInteractionPoints(building.id);
    if (!interactionPoints || interactionPoints.length === 0) {
        // Fallback for buildings with no defined perimeter (e.g., 1x1 buildings)
        interactionPoints = [{x: Math.floor(building.gridX + building.width / 2), y: Math.floor(building.gridY + building.height / 2)}];
    }

    var bestPoint = null;
    var bestPointDist = Infinity;
    for(var p_idx = 0; p_idx < interactionPoints.length; p_idx++) {
        var p = interactionPoints[p_idx];
        var dx = p.x - troopX;
        var dy = p.y - troopY;
        var distSq = dx*dx + dy*dy;
        if(distSq < bestPointDist) {
            bestPointDist = distSq;
            bestPoint = p;
        }
    }

    if (bestPoint) {
        var pathResult = pathfinder.findPath(troopX, troopY, bestPoint.x, bestPoint.y, troop.attackRange);

        if (pathResult && pathResult.path) {
            return { targetBuilding: specificTargetBuilding, path: pathResult.path };
        }
    }
    return null;
};

