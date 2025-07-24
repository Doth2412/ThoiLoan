const PLAYER_DATA_EVENTS = {
    BUILDING_UPDATED: "PLAYER_BUILDING_UPDATED",
    RESOURCE_UPDATED: "PLAYER_RESOURCES_UPDATED",
    TROOPS_UPDATED: "PLAYER_TROOPS_UPDATED",
    OBSTACLES_UPDATED: "PLAYER_OBSTACLES_UPDATED",
    BUILDER_STATUS_UPDATED: "BUILDER_STATUS_UPDATED",
    ARMY_STATUS_UPDATED: "ARMY_STATUS_UPDATED",
    SHOW_TROOP_DEPLOYMENT_ANIMATION: "SHOW_TROOP_DEPLOYMENT_ANIMATION"
};

var PlayerDataManager = cc.Class.extend({
    playerData: null,
    ctor: function (){
        this.playerData = new PlayerData();
    },

    updateWithInitMapData: function( initMapPacket) {
        cc.log("PlayerDataManager.updateWithInitMapData - Received initMapPacket:", JSON.stringify(initMapPacket, null, 2));
        this.playerData.playerId = initMapPacket.playerId;
        this.playerData.gold = initMapPacket.gold;
        this.playerData.oil = initMapPacket.oil;
        this.playerData.gem = initMapPacket.gem;
        this.playerData.builderNumber = initMapPacket.builderNumber;
        this.playerData.buildings = initMapPacket.buildings;
        this.playerData.obstacles = initMapPacket.obstacles;
        cc.log("PlayerDataManager updated with INIT_MAP data.");
    },

    updateWithUserInfoData: function (userInfoPacket) {
        // Basic PlayerInfo
        this.playerData.playerInfoID = userInfoPacket.playerInfoID;
        this.playerData.playerInfoName = userInfoPacket.playerInfoName;

        // Player Data
        this.playerData.playerId = userInfoPacket.playerID;
        this.playerData.sentServerTime = userInfoPacket.sentServerTime;
        this.playerData.logoutTime = userInfoPacket.logoutTime;
        this.playerData.username = userInfoPacket.username;
        this.playerData.prestigePoint = userInfoPacket.prestigePoint;

        // Resources
        this.playerData.gold = userInfoPacket.gold;
        this.playerData.oil = userInfoPacket.oil;
        this.playerData.gem = userInfoPacket.gem;

        this.playerData.builderNumber = userInfoPacket.builderNumber;
        // Buildings - merge with existing buildings or replace
        if (userInfoPacket.buildings && userInfoPacket.buildings.length > 0) {
            this.playerData.buildings = userInfoPacket.buildings;
        }

        // Obstacles - update with obstacles from USER_INFO
        if (userInfoPacket.obstacles && userInfoPacket.obstacles.length > 0) {
            this.playerData.obstacles = userInfoPacket.obstacles;
        }

        // Troops
        this.playerData.army = userInfoPacket.army || [];
        cc.log("PlayerDataManager: Received army data: " + JSON.stringify(this.playerData.army));
        TroopManager.getInstance().setPlayerArmy(this.playerData.army);

        // Player Maps
        this.playerData.playerMaps = userInfoPacket.playerMaps || [];

    },

    updateWithBattleResultData: function(battleResultPacket) {
        if (battleResultPacket.success) {
            // Update player maps
            if (battleResultPacket.playerMaps && battleResultPacket.playerMaps.length > 0) {
                battleResultPacket.playerMaps.forEach(updatedMap => {
                    let existingMap = this.playerData.playerMaps.find(map => map.mapIndex === updatedMap.mapIndex);
                    if (existingMap) {
                        Object.assign(existingMap, updatedMap);
                    } else {
                        this.playerData.playerMaps.push(updatedMap);
                    }
                });
            }
        }
    },

    /**
     * Updates player data after a successful resource harvest
     * @param {Object} harvestPacket - Data packet containing harvest results
     */
    updateWithHarvestData: function( harvestPacket) {
        // Only process if harvest was successful
        if (!harvestPacket.success) {
            return;
        }

        // Update resource totals
        this.playerData.gold = harvestPacket.updatedResources.gold;
        this.playerData.oil = harvestPacket.updatedResources.oil;
        this.playerData.gem = harvestPacket.updatedResources.gem;

        // Find and update the harvested building
        const harvestedBuilding = this.playerData.buildings.find(building => building.buildingIndex === harvestPacket.buildingIndex);
        if (harvestedBuilding) {
            harvestedBuilding.lastHarvestTime = harvestPacket.harvestTime;
            harvestedBuilding.nextHarvestTime = harvestPacket.nextHarvestTime;
        }

    },

    updateWithUseGData: function(useGPacket) {
        if (!useGPacket.success) {
            return;
        }

        // Update resource totals
        this.playerData.gold = useGPacket.updatedResources.gold;
        this.playerData.oil = useGPacket.updatedResources.oil;
        this.playerData.gem = useGPacket.updatedResources.gem;

    },

    /**
     * Get current amount of a specific resource
     * @param {string} resourceType - Resource type ("gold", "oil", "gem")
     * @returns {number} Current resource amount
     */
    getResourceAmount: function( resourceType) {
        switch (resourceType.toLowerCase()) {
            case "gold":
                return this.playerData.gold || 0;
            case "oil":
                return this.playerData.oil || 0;
            case "gem":
                return this.playerData.gem || 0;
            default:
                //cc.log("PlayerDataManager.getResourceAmount - Unknown resource type: " + resourceType);
                return 0;
        }
    },

    getArmy: function(){
        return this.playerData.army;
    },

    /**
     * Get resource capacity for a specific resource type
     * @param {string} resourceType - Resource type ("gold", "oil", "gem")
     * @returns {number} Resource capacity limit
     */
    getResourceCapacity: function(resourceType) {
        var lowerCaseResourceType = resourceType.toLowerCase();

        if (lowerCaseResourceType === "gem") {
            return this.playerData.gemCapacity || 10000; // Default gem capacity
        }

        if (lowerCaseResourceType !== "gold" && lowerCaseResourceType !== "oil") {
            cc.warn("PlayerDataManager.getResourceCapacity: Unknown resource type requested: " + resourceType);
            return 0;
        }

        var buildingsManager = BuildingsManager.getInstance();

        if (!buildingsManager) {
            cc.warn("PlayerDataManager.getResourceCapacity: BuildingsManager instance not available. Returning 0 for " + resourceType);
            return 0;
        }
        var totalCapacity = 0;
        var allBuildings = buildingsManager.getAllBuildings();

        for (var i = 0; i < allBuildings.length; i++) {
            var building = allBuildings[i];

            if (building.buildingState === 'CONSTRUCTING') {
                continue;
            }

            var buildingConfig = ItemConfigUtils.getBuildingConfig(building, building.level);
            if (!buildingConfig) {
                cc.warn("PlayerDataManager.getResourceCapacity: Could not get config for building " + building.buildingType + " (Level: " + building.level + ")");
                continue;
            }

            var configResourceType = buildingConfig.resourceType || buildingConfig.type; // Check 'resourceType' then 'type'
            var configCapacity = buildingConfig.capacity;

            // 1. Town Hall ("TOW_1") contributions
            if (building.buildingType === "TOW_1") {
                if (lowerCaseResourceType === "gold") {
                    if (typeof buildingConfig.capacityGold === 'number') {
                        totalCapacity += buildingConfig.capacityGold;
                    }
                } else if (lowerCaseResourceType === "oil") {
                    if (typeof buildingConfig.capacityElixir === 'number') {
                        totalCapacity += buildingConfig.capacityElixir;
                    } 
                }
            }

            else if (building.buildingType.startsWith("STO_")) {
                if (configResourceType) {
                    var effectiveConfigType = configResourceType.toLowerCase();
                    if (effectiveConfigType === "elixir") effectiveConfigType = "oil";

                    if (effectiveConfigType === lowerCaseResourceType) {
                        if (typeof configCapacity === 'number') {
                            totalCapacity += configCapacity;
                        } 
                    } 
                } else {
                    cc.warn("PlayerDataManager.getResourceCapacity: " + building.buildingType + " (Level: " + building.level + ") is missing 'resourceType' or 'type' in its configuration.");
                }
            }
        }

        // Fallback default minimum capacity
        if (totalCapacity === 0) {
            if (lowerCaseResourceType === "gold") {
                totalCapacity = 1000; // Default minimum gold
            } else if (lowerCaseResourceType === "oil") {
                totalCapacity = 1000; // Default minimum oil
            }
        }
        return totalCapacity;
    },

    /**
     * Check if player can receive additional resources without exceeding capacity
     * @param {string} resourceType - Resource type ("gold", "oil", "gem")
     * @param {number} amount - Amount to check
     * @returns {boolean} True if player can receive the resources
     */
    canReceiveResources: function( resourceType, amount) {
        const currentAmount = this.getResourceAmount(resourceType);
        const capacity = this.getResourceCapacity(resourceType);
        return (currentAmount + amount) <= capacity;
    },

    /**
     * Add resources to player's inventory
     * @param {string} resourceType - Resource type ("gold", "oil", "gem")
     * @param {number} amount - Amount to add
     * @returns {boolean} True if resources were successfully added
     */
    addResources: function(resourceType, amount) {
        if (amount <= 0) {
            return false;
        }

        const currentAmount = this.getResourceAmount(resourceType);
        const capacity = this.getResourceCapacity(resourceType);
        const finalAmount = Math.min(currentAmount + amount, capacity);
        const actualAdded = finalAmount - currentAmount;

        switch (resourceType.toLowerCase()) {
            case "gold":
                this.playerData.gold = finalAmount;
                break;
            case "oil":
                this.playerData.oil = finalAmount;
                break;
            case "gem":
                this.playerData.gem = finalAmount;
                break;
            default:
                cc.log("PlayerDataManager.addResources - Unknown resource type: " + resourceType);
                return false;
        }

        this.notifyResourceUpdate(resourceType);

        return actualAdded > 0;
    },

    /**
     * Subtract resources from player's inventory
     * @param {string} resourceType - Resource type ("gold", "oil", "gem")
     * @param {number} amount - Amount to subtract
     * @returns {boolean} True if resources were successfully subtracted
     */
    subtractResources: function( resourceType, amount) {
        if (amount <= 0) {
            return false;
        }

        const currentAmount = this.getResourceAmount(resourceType);
        cc.log(currentAmount + " current amount" + resourceType);
        cc.log(amount + " amount to subtract" + resourceType);
        if (currentAmount < amount) {
            return false; // Not enough resources
        }

        const finalAmount = currentAmount - amount;

        switch (resourceType.toLowerCase()) {
            case "gold":
                this.playerData.gold = finalAmount;
                break;
            case "oil":
                this.playerData.oil = finalAmount;
                break;
            case "gem":
                this.playerData.gem = finalAmount;
                break;
            default:
                cc.log("PlayerDataManager.subtractResources - Unknown resource type: " + resourceType);
                return false;
        }

        this.notifyResourceUpdate(resourceType);

        return true;
    },

    notifyBuildingUpdated: function( building) {
        if (typeof cc.eventManager !== 'undefined') {
            cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.BUILDING_UPDATED, {
                buildingIndex: building.buildingIndex,
                buildingId: building.id,
                level: building.level,
                position: {
                    x: building.posX,
                    y: building.posY
                },
                type: building.buildingName,
                isResourceGenerator: building.isResourceGenerator
            });
        }
    },

    notifyResourceUpdate: function(resourceType) {
        if (typeof cc.eventManager !== 'undefined') {
            cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.RESOURCE_UPDATED, {
                resourceType: resourceType,
            });
        }
    },
    notifyBuilderUpdate: function(builderUsed) {
        if (typeof cc.eventManager !== 'undefined') {
            cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.BUILDER_STATUS_UPDATED, {
                builderUsed: builderUsed
            });
        }
    },

    getInitBuildingsData: function(){
        return this.playerData.buildings;
    },

    getInitObstaclesData: function(){
        return this.playerData.obstacles;
    },

    updateWithBuyBuildingData: function(buyBuildingData) {
        if (buyBuildingData && buyBuildingData.success) {
            cc.log("PlayerDataManager: Buy building successful. Server Message: " + buyBuildingData.message);

            if (!this.playerData.buildings) {
                this.playerData.buildings = [];
            }

            var newBuildingIndex = 0;
            if (this.playerData.buildings.length > 0) {
                var maxIndex = -1;
                for (var i = 0; i < this.playerData.buildings.length; i++) {
                    if (typeof this.playerData.buildings[i].buildingIndex === 'number' && this.playerData.buildings[i].buildingIndex > maxIndex) {
                        maxIndex = this.playerData.buildings[i].buildingIndex;
                    }
                }
                newBuildingIndex = maxIndex + 1;
            } else {
                newBuildingIndex = 0;
            }

            var newBuilding = {

                buildingId: buyBuildingData.buildingId,
                buildingName: buyBuildingData.buildingTypeId,
                posX: buyBuildingData.positionX,
                posY: buyBuildingData.positionY,
                stateStartTime: buyBuildingData.purchaseTime,
                type: buyBuildingData.buildingTypeId,

                buildingIndex: newBuildingIndex,
                level: 1,
                buildingState: "IDLE",
                
                id: buyBuildingData.buildingId, 
                isResourceGenerator: false 
            };

            if (newBuilding.buildingName === "BDH_1") {
                BuilderManager.getInstance().getTotalBuilders();
            }

            this.playerData.buildings.push(newBuilding);
            this.notifyBuildingUpdated(newBuilding);
        } else {
            var errorMessage = "Buy building request failed.";
            if (buyBuildingData && buyBuildingData.message) {
                errorMessage = buyBuildingData.message;
            } else if (buyBuildingData === null || typeof buyBuildingData === 'undefined') {
                errorMessage = "Buy building failed: Received null or undefined data packet.";
            } else if (buyBuildingData && !buyBuildingData.success) {
                errorMessage = "Buy building failed: Server indicated failure. Message: " + (buyBuildingData.message || "No specific message.");
            }
            cc.warn("PlayerDataManager: " + errorMessage);
            
        }
    },

    updatePrestige: function(prestigeChange) {
        this.playerData.prestigePoint += prestigeChange;
        cc.log("Player prestige updated to: " + this.playerData.prestigePoint);
    },

    deductUsedTroops: function(usedTroops) {
        if (!usedTroops || Object.keys(usedTroops).length === 0) {
            return;
        }

        cc.log("Deducting used troops. Initial army: " + JSON.stringify(this.playerData.army));

        for (var troopType in usedTroops) {
            var usedAmount = usedTroops[troopType];
            var troopInArmy = this.playerData.army.find(t => t.troopType === troopType);

            if (troopInArmy) {
                troopInArmy.troopAmount -= usedAmount;
                if (troopInArmy.troopAmount < 0) {
                    troopInArmy.troopAmount = 0;
                }
            }
        }

        // Filter out troops with zero amount
        this.playerData.army = this.playerData.army.filter(t => t.troopAmount > 0);

        cc.log("Army after deduction: " + JSON.stringify(this.playerData.army));
        
        // Notify the rest of the game that the army has changed
        cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.ARMY_STATUS_UPDATED, {
            army: this.playerData.army
        });
    }
})

PlayerDataManager._instance = null;

PlayerDataManager.getInstance = function () {
    if (!this._instance) {
        this._instance = new PlayerDataManager();
    }
    return this._instance;
};