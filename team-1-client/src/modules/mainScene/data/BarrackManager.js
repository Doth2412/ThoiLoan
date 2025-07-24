const BarrackManager = cc.Class.extend({
    buildingManager: null,
    mainScene: null,

    ctor: function(buildingManager, mainScene) {
        this.buildingManager = buildingManager;
        this.mainScene = mainScene;
    },

    isBarrackBuilding: function(buildingType){
        let barrackTypes = ['BAR_1'];
        return barrackTypes.indexOf(buildingType) !== -1;
    },


    /**
     * Handles the completion of a single troop's training.
     * This function should be called by your central game timer when a barrack's training for one unit is complete.
     * @param {object} barrackAsset - The specific barrack building object that has finished training a troop.
     */
    onCompleteTrainTroop: function(barrackAsset) {
        if (!barrackAsset || !barrackAsset.trainingQueue || barrackAsset.trainingQueue.length === 0) {
            cc.error("onCompleteTrainTroop called for a barrack with an empty queue. Check your timer logic.");
            return;
        }

        // Remove the troop from the front of the queue.
        const completedTroopType = barrackAsset.trainingQueue.shift();
        cc.log("Training complete for: " + completedTroopType);

        const troopData = Configs.getInstance().Troop[completedTroopType];
        if (!troopData) {
            cc.error("Could not find config for completed troop: " + completedTroopType);
            return;
        }

        // Add the troop to the player's permanent army data and update the housing count
        const playerInfo = PlayerDataManager.getInstance();
        playerInfo.addTrainedTroop(completedTroopType); // Assuming you have a method to add to the army roster
        playerInfo.increaseCurrentHousing(troopData.getHousingSpace()); // You'll need a method to track current army size

        // TODO Trigger Spawning on the Scene (UI Action)
        if (this.mainScene) {

            // This is where you would visually create the troop sprite on the map.
            // this.mainScene.spawnTrainedTroop(completedTroopType, spawnPosition);
            cc.log("Sent request to MainScene to spawn " + completedTroopType + " at " );
        } else {
            cc.error("MainScene is not available to spawn the troop.");
        }

        // --- 4. Start Training the Next Troop in the Queue ---
        // If the queue is not empty, the next troop automatically starts.
        // We do this by resetting the progress timer for this barrack.
        // The main game loop will see the new troop and start its timer.
        if (barrackAsset.trainingQueue.length > 0) {
            if (barrackAsset.hasOwnProperty('currentTrainingTime')) {
                barrackAsset.currentTrainingTime = 0; // Reset timer for the next troop
                const nextTroop = barrackAsset.trainingQueue[0];
                cc.log("Starting training for the next troop in line: " + nextTroop);
            }
        } else {
            cc.log("Training queue for this barrack is now empty.");
        }


        // TODO: Notify the UI to Update its Display ---
        // The TrainTroopUI needs to refresh its queue and army capacity text.
    },

    /**
     * Instantly completes the entire training queue for a specific barrack using Gems.
     * @param {string} barrackAsset - The barrack to complete instantly.
     */
    completeTrainingInstantly: function(barrackAsset) {
        if (!barrackAsset) {
            cc.error("completeTrainingInstantly: Could not find barrack with ID: " + barrackAsset.name);
            return;
        }
        if (!barrackAsset.barrackInstance) {
            cc.warn("completeTrainingInstantly: barrackAsset is not a barrack or barrackInstance is null.");
            return;
        }

        if (barrackAsset.barrackInstance.trainingQueue.length === 0) {
            cc.log("completeTrainingInstantly: The training queue is already empty.");
            // Optionally, tell the UI to show a message to the user.
            return;
        }

        let totalRemainingTime = 0;
        let totalHousingSpace = 0;
        const queue = barrackAsset.barrackInstance.trainingQueue;

        for (let i = 0; i < queue.length; i++) {
            const troopType = queue[i];
            const troopDataTrainingTime = Configs.getInstance().getTrainingTime(troopType);
            const troopHousingSpace = Configs.getInstance().getHousingSpace(troopType);
            totalRemainingTime += troopDataTrainingTime;
            totalHousingSpace += troopHousingSpace;
        }

        if (barrackAsset.hasOwnProperty('currentTrainingTime')) {
            totalRemainingTime -= barrackAsset.currentTrainingTime;
        }

        // const gemCost = this.calculateGemsForTime(totalRemainingTime);
        const gemCost = 1; // Placeholder for actual gem cost calculation logic
        cc.log("Total remaining time: " + totalRemainingTime + "s. Gem cost: " + gemCost);

        // --- 3. Perform Critical Validation Checks ---
        const playerInfo = PlayerDataManager.getInstance();

        // 3a. Check if player has enough Gems
        if (playerInfo.getResourceAmount("gem") < gemCost) {
            // TODO: Tell the UI to show a "Not enough Gems" popup.
            return;
        }

        // 3b. Check if there is enough space in the Army Camps
        const maxHousing = barrackAsset.getArmyCampCapacity();
        const currentHousing = playerInfo.troops.length;
        if ((currentHousing + totalHousingSpace) > maxHousing) {
            cc.log("Not enough space in Army Camps. Required: " + totalHousingSpace + ", Available: " + (maxHousing - currentHousing));
            // TODO: Tell the UI to show a "Army Camps are full" popup.
            return;
        }

        // --- 4. All Checks Passed: Execute the Transaction ---
        cc.log("All checks passed. Proceeding with instant completion.");

        // 4a. Deduct Gems
        playerInfo.subtractResources("gem", gemCost);

        // 4b. Move all troops from the queue to the player's army
        for (var completeTroopType of queue) {
            playerInfo.addTrainedTroop(completeTroopType);
        }
        playerInfo.increaseCurrentHousing(totalHousingSpace);

        // 4c. Clear the barrack's queue and reset its timer
        barrackAsset.trainingQueue = [];
        barrackAsset.currentTrainingTime = 0;

        // TODO Notify the UI to Update Everything ---
        cc.log("Instant training complete. Updating UI.");

        /*
        // --- Suggested UI Code ---
        // Tell the UI to refresh all relevant parts.
        this.mainScene.trainTroopUI.updateQueueDisplay(barrackAsset.trainingQueue); // Will show an empty queue
        this.mainScene.trainTroopUI.updateResourceLabels(); // To show changed Gem count
        this.mainScene.trainTroopUI.updateArmyCapacityLabel(); // To show new army size
        */

    },

    getArmyCampCapacity: function() {
        let totalCapacity = 0;
        const buildings = this.buildingManager.getAllBuildings();
        const configs = Configs.getInstance();
        for (let i = 0; i < buildings.length; i++) {
            const building = buildings[i];
            if (building.buildingType === 'AMC_1') {
                // Get the level-specific capacity from config
                const levelConfig = configs.ArmyCamp[building.buildingType][building.level];
                if (levelConfig && levelConfig.capacity) {
                    totalCapacity += levelConfig.capacity;
                }
            }
        }
        return totalCapacity;
    },

})

BarrackManager._instance = null; // A static property to hold the single instance

BarrackManager.getInstance = function () {
    if (!this._instance) {
        this._instance = new BarrackManager();
    }
    return this._instance;
};