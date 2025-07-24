/**
 * ResourceGeneratorManager - Manages resource generation functionality
 * Handles all resource generator operations separately from BuildingsManager
 */

var ResourceGeneratorManager = cc.Class.extend({
    buildingManager: null,
    mainScene: null,

    ctor: function(buildingManager, mainScene) {
        this.buildingManager = buildingManager;
        this.mainScene = mainScene;
    },

    /**
     * Update all resource generators
     * Called periodically to update resource generation
     */
    updateResourceGenerators: function() {
        var buildings = this.buildingManager.getAllBuildings();
        for (var i = 0; i < buildings.length; i++) {
            var building = buildings[i];
            if (building instanceof ResourceGenerator) {
                building.updateGeneration();
            }
        }
    },

    /**
     * Get all resource generator buildings
     * @returns {Array} Array of ResourceGenerator instances
     */
    getResourceGenerators: function() {
        var generators = [];
        var buildings = this.buildingManager.getAllBuildings();
        for (var i = 0; i < buildings.length; i++) {
            var building = buildings[i];
            if (building instanceof ResourceGenerator) {
                generators.push(building);
            }
        }
        return generators;
    },

    /**
     * Get resource generator by building ID
     * @param {string} buildingIndex - Building ID
     * @returns {ResourceGenerator|null} ResourceGenerator instance or null
     */
    getResourceGeneratorByIndex: function (buildingIndex) {
        if (!this.buildingManager) {
            cc.warn("ResourceGeneratorManager: buildingManager not available");
            return null;
        }
        var buildings = this.buildingManager.getAllBuildings();
        for (var i = 0; i < buildings.length; i++) {
            var building = buildings[i];
            if (building.buildingIndex === buildingIndex && building instanceof ResourceGenerator) {
                return building;
            }
        }
        return null;
    },

    /**
     * Harvest resources from a resource generator
     * @param {string} buildingIndex - Building ID
     * @returns {Object} Harvest result
     */
    harvestResourceGenerator: function(buildingIndex) {
        var generator = this.getResourceGeneratorByIndex(buildingIndex);
        if (generator) {
            return generator.harvest();
        }
        return {
            success: false,
            amount: 0,
            message: "Resource generator not found"
        };
    },

    /**
     * Get harvestable resource generators (for UI indicators)
     * @returns {Array} Array of ResourceGenerator instances that can be harvested
     */
    getHarvestableGenerators: function() {
        var harvestable = [];
        var generators = this.getResourceGenerators();
        for (var i = 0; i < generators.length; i++) {
            if (generators[i].canHarvest()) {
                harvestable.push(generators[i]);
            }
        }
        return harvestable;
    },

    /**
     * Logs the initial state of all resource generators after calculating offline production.
     * This should be called once after loading the game state.
     */
    logInitialResourceState: function() {
        cc.log("===== Initial Resource Generator States (Post-Offline Calculation) =====");
        var generators = this.getResourceGenerators();
        if (generators.length === 0) {
            cc.log("No resource generators found.");
            return;
        }

        for (var i = 0; i < generators.length; i++) {
            var generator = generators[i];
            // Force the initial generation calculation by passing true
            generator.updateGeneration(true);

            var info = generator.getStatusInfo();
            cc.log(
                "-> " + generator.buildingType + " (Index: " + generator.buildingIndex + "): " +
                "State: " + info.state + ", " +
                "Resources: " + Math.floor(info.accumulatedResources) + "/" + info.capacity + " " + info.resourceType
            );
        }
        cc.log("=======================================================================");
    },

    /**
     * Force update all resource generator states
     * @param {string} reason - Reason for the update (for logging)
     */
    updateAllResourceGeneratorStates: function(reason) {
        var generators = this.getResourceGenerators();
        for (var i = 0; i < generators.length; i++) {
            generators[i].forceUpdateState(reason || "Bulk state update");
        }
    },

    /**
     * Get resource generation summary
     * @returns {Object} Summary of all resource generators
     */
    getResourceGenerationSummary: function() {
        var generators = this.getResourceGenerators();
        var summary = {
            totalGenerators: generators.length,
            operatingCount: 0,
            idleCount: 0,
            constructingCount: 0,
            upgradingCount: 0,
            harvestableCount: 0,
            totalHarvestable: { gold: 0, oil: 0 },
            generationRates: { gold: 0, oil: 0 }
        };

        for (var i = 0; i < generators.length; i++) {
            var generator = generators[i];
            var status = generator.getStatusInfo();
            
            // Count by state
            switch (status.state) {
                case "OPERATING":
                    summary.operatingCount++;
                    break;
                case "IDLE":
                    summary.idleCount++;
                    break;
                case "CONSTRUCTING":
                    summary.constructingCount++;
                    break;
                case "UPGRADING":
                    summary.upgradingCount++;
                    break;
            }
            
            // Count harvestable
            if (status.canHarvest) {
                summary.harvestableCount++;
                var resourceType = status.resourceType.toLowerCase();
                if (summary.totalHarvestable[resourceType] !== undefined) {
                    summary.totalHarvestable[resourceType] += status.harvestableAmount;
                }
            }
            
            // Sum generation rates (only for operating generators)
            if (status.state === "OPERATING") {
                var resourceType = status.resourceType.toLowerCase();
                if (summary.generationRates[resourceType] !== undefined) {
                    summary.generationRates[resourceType] += status.generationRate;
                }
            }
        }
        
        return summary;
    },

    /**
     * Harvest all available resources from all generators
     * @returns {Object} Combined harvest result
     */
    harvestAllResources: function() {
        var harvestableGenerators = this.getHarvestableGenerators();
        var results = {
            success: true,
            totalHarvested: { gold: 0, oil: 0 },
            individualResults: [],
            failedHarvests: 0
        };
        
        for (var i = 0; i < harvestableGenerators.length; i++) {
            var generator = harvestableGenerators[i];
            var result = generator.harvest();
            
            results.individualResults.push({
                generatorId: generator.id,
                generatorName: generator.name,
                result: result
            });
            
            if (result.success) {
                var resourceType = result.resourceType.toLowerCase();
                if (results.totalHarvested[resourceType] !== undefined) {
                    results.totalHarvested[resourceType] += result.amount;
                }
            } else {
                results.failedHarvests++;
            }
        }
        
        if (results.failedHarvests > 0) {
            results.success = false;
        }
        
        cc.log("ResourceGeneratorManager: Harvested all resources - Gold: " + results.totalHarvested.gold + ", Oil: " + results.totalHarvested.oil + " (Failures: " + results.failedHarvests + ")");
        
        return results;
    }
});
