const UpgradeBuildingController = {

    requestAndStartUpgrade: function(building, mainUIInstance) {
        var builderRequestResult = BuilderManager.getInstance().requestBuildUpgrade(building, false, mainUIInstance);

        if (builderRequestResult.success) {
            // Có builder, bắt đầu nâng cấp ngay
            cc.log("Upgrade request successful, builder assigned. Starting upgrade.");
            this.initiateUpgradeProcess(building);

        } else if (builderRequestResult.showPopup) {
            // Hết builder, hiển thị popup và đưa vào hàng đợi
            cc.log("No free builders for upgrade. Showing popup.");
            var popupConfig = builderRequestResult.popupConfig;
            popupConfig.successCallback = this.requestAndStartUpgrade.bind(this, building, mainUIInstance);

            UIController.showUseGemPopupWithOptions(mainUIInstance, popupConfig);

        } else {
            // Trường hợp lỗi khác
            cc.warn("Upgrade request failed: " + builderRequestResult.reason);
        }
    },

    startUpgradeBuilding: function(building){
        // Builder assignment is handled by BuilderManager before this is called
        var buildingNextLevelConfig = ItemConfigUtils.getBuildingConfig(building, building.level + 1);
        var costAndResourceType = this.getCostAndResourceType(buildingNextLevelConfig);
        var cost = costAndResourceType.cost;
        var resourceType = costAndResourceType.resourceType;

        PlayerDataManager.getInstance().subtractResources(resourceType, cost);
        building.setState(BUILDING_STATES.UPGRADING);
        building.startBuildingTime = Math.floor(Date.now() / 1000);
        building.finishBuildingTime =  building.startBuildingTime + buildingNextLevelConfig.buildTime;
        BuildingsManager.getInstance().toggleUpgradingIndicator(building, true);
    },

    finishUpgradeBuilding: function(building){
        // Send the packet to the server to notify it of completion.
        gv.testnetwork.connector.sendUpgradeBuildingComplete(building.buildingType, building.buildingIndex, 1);

        cc.log("UpgradeBuildingController: Finalizing upgrade for " + building.buildingType + " with index " + building.buildingIndex);

        building.level++;
        building.setState(BUILDING_STATES.OPERATING);
        BuildingsManager.getInstance().toggleUpgradingIndicator(building, false);

        var buildingType = building.buildingType;
        var newLevel = building.level;

        if (buildingType.startsWith("DEF_")) {
            const newAssetPaths = AssetUtils.getDefensiveBuildingAssetPaths(buildingType, newLevel);
            if (building.basePlatformSprite && newAssetPaths.base) {
                building.basePlatformSprite.setTexture(newAssetPaths.base);
                cc.log("Updated " + buildingType + " base platform sprite to level " + newLevel);
            }
            if (building.buildingSprite && newAssetPaths.anim) {
                building.buildingSprite.setTexture(newAssetPaths.anim);
                cc.log("Updated " + buildingType + " turret sprite to level " + newLevel);
            }
        } else {
            // Logic for non-defensive buildings
            var newAssetPath = AssetUtils.getBuildingLevelIdleAssetPath(buildingType, newLevel);
            if (building.buildingSprite) {
                if (newAssetPath) {
                    building.buildingSprite.setTexture(newAssetPath);
                    cc.log("Updated " + building.buildingType + " (Index: " + building.buildingIndex + ") sprite to level " + newLevel + " using asset: " + newAssetPath);
                } else {
                    cc.warn("Could not update sprite for " + building.buildingType + " (Index: " + building.buildingIndex + ") to level " + newLevel + ". Asset path not found.");
                }
            } else {
                cc.warn("Building " + building.buildingType + " (Index: " + building.buildingIndex + ") has no buildingSprite to update for level " + newLevel);
            }
        }

        BuilderManager.getInstance().onBuildingOperationComplete(building);

        cc.log("UpgradeBuildingController: Upgrade finished for " + building.buildingType + ". Builder freed.");
        PlayerDataManager.getInstance().notifyResourceUpdate("gold");
        PlayerDataManager.getInstance().notifyResourceUpdate("oil");

        this._playLevelUpEffect(building);
    },

    _playLevelUpEffect: function(building) {
        const effectData = LEVELUP_EFFECT_METADATA["LEVELUP"];
        if (!effectData) {
            cc.warn("UpgradeBuildingController._playLevelUpEffect: Levelup effect data not found.");
            return;
        }

        const buildingWorldPos = building.compositeNode.getParent().convertToWorldSpace(building.compositeNode.getPosition());
        const buildingSize = building.compositeNode.getContentSize();
        const effectOriginX = buildingWorldPos.x + buildingSize.width / 2 + effectData.offset.x;
        const effectOriginY = buildingWorldPos.y + buildingSize.height / 2 + effectData.offset.y;
        const effectPos = cc.p(effectOriginX, effectOriginY);

        const parentNode = building.compositeNode;

        // Load frames for the levelup animation
        const frames = [];
        for (let i = 0; i < effectData.frameCount; i++) {
            let frameIndex = i.toString();
            while (frameIndex.length < effectData.frameIndexPadding) {
                frameIndex = '0' + frameIndex;
            }
            const framePath = effectData.basePath + frameIndex + ".png";
            const texture = cc.textureCache.addImage(framePath);
            if (texture) {
                const rect = cc.rect(0, 0, texture.getContentSize().width, texture.getContentSize().height);
                frames.push(new cc.SpriteFrame(texture, rect));
            } else {
                cc.warn("UpgradeBuildingController._playLevelUpEffect: Failed to load levelup frame: " + framePath);
            }
        }

        if (frames.length > 0) {
            const animation = new cc.Animation(frames, effectData.frameDelay);
            const animateAction = cc.Animate.create(animation);

            const effectSprite = new cc.Sprite();
            effectSprite.retain(); // Retain the sprite
            effectSprite.setPosition(parentNode.convertToNodeSpace(effectPos));
            parentNode.addChild(effectSprite);

            const removeAction = cc.callFunc(() => {
                effectSprite.removeFromParent(true);
            });

            effectSprite.runAction(cc.sequence(animateAction, removeAction));
        } else {
            cc.warn("UpgradeBuildingController._playLevelUpEffect: No frames loaded for levelup effect.");
        }
    },

    canUpgradeBuilding: function(building){
        var nextLevel = building.level + 1;
        var buildingNextLevelConfig = ItemConfigUtils.getBuildingConfig(building, nextLevel);

        if (!buildingNextLevelConfig) {
            return false; // Cannot upgrade if there's no config for the next level
        }
        // Existing Town Hall level requirement from building's own config (e.g. Barracks Lvl 2 needs TH Lvl 3)
        var currentPlayerTownHallLevel = BuildingsManager.getInstance().getTownHallLevel();
        if (buildingNextLevelConfig && typeof buildingNextLevelConfig.townHallLevelRequired === 'number') {
            if (buildingNextLevelConfig.townHallLevelRequired > currentPlayerTownHallLevel) {
                return false; // Player's current TH is too low for this upgrade
            }
        }

        // Check specific building prerequisites if the building being upgraded IS a Town Hall
        if (building.buildingType === "TOW_1") {
            var prerequisites = this.getTownHallUpgradePrerequisites(building, nextLevel);
            if (!prerequisites.met) {
                return false; // Missing required buildings for Town Hall upgrade
            }
        }

        return true;
    },


    /**
     * @param {number} buildingIndex - The index of the building to validate for upgrade.
     * @returns {boolean} True if the upgrade is valid, false otherwise.
     */
    validateUpgradeBuilding: function(buildingIndex) {
        cc.log("Validating upgrade for building index: " + buildingIndex); // Keep original log
        var building = BuildingsManager.getInstance().placedBuildings[buildingIndex];
        if (!building) {
            cc.warn("ClientUpgradeLogic: Building with index " + buildingIndex + " not found for upgrade validation.");
            return false;
        }

        var buildingType = building.buildingType;
        var currentLevel = building.level;
        var nextLevel = currentLevel + 1;

        // Town Hall specific building prerequisites
        if (buildingType === "TOW_1") {
            var prerequisites = this.getTownHallUpgradePrerequisites(building, nextLevel);
            if (!prerequisites.met) {
                cc.warn("ClientUpgradeLogic: Town Hall upgrade prerequisites not met for " + buildingType + " to level " + nextLevel + ". Message: " + prerequisites.message);
                return false;
            }
        }

        var buildingNextLevelConfig = ItemConfigUtils.getBuildingConfig(building, nextLevel);
        if (!buildingNextLevelConfig) {
            cc.warn("ClientUpgradeLogic: Upgrade data (config) not found for " + buildingType + " to level " + nextLevel + ".");
            return false;
        }

        // Existing: Check general Town Hall level requirement from the upgrading building's config
        // (e.g., Barracks Lvl X requires player's Town Hall to be Lvl Y)
        var currentPlayerTownHallLevel = BuildingsManager.getInstance().getTownHallLevel();
        if (typeof buildingNextLevelConfig.townHallLevelRequired === 'number') {
            if (buildingNextLevelConfig.townHallLevelRequired > currentPlayerTownHallLevel) {
                cc.warn("ClientUpgradeLogic: Player's Town Hall level " + currentPlayerTownHallLevel + " is too low. " + buildingType + " Lvl " + nextLevel + " requires Town Hall Lvl " + buildingNextLevelConfig.townHallLevelRequired + ".");
                return false;
            }
        }

        // Existing resource validation
        var costAndResourceType = this.getCostAndResourceType(buildingNextLevelConfig);
        if (!costAndResourceType) {
            cc.warn("ClientUpgradeLogic: Could not determine cost and resource type for " + buildingType + " level " + nextLevel + ".");
            return false;
        }
        var cost = costAndResourceType.cost;
        var resourceType = costAndResourceType.resourceType;

        if (typeof cost !== 'number' || typeof resourceType !== 'string') {
            cc.warn("ClientUpgradeLogic: Invalid cost or resourceType in config for " + buildingType + " level " + nextLevel + ".");
            return false;
        }

        var currentResourceAmount = PlayerDataManager.getInstance().getResourceAmount(resourceType);
        if (currentResourceAmount < cost) {
            cc.warn("ClientUpgradeLogic: Insufficient " + resourceType + " for upgrade. Need: " + cost + ", Have: " + currentResourceAmount + ".");
            return false; // This will trigger the gem purchase popup in UpgradeBuildingLayer
        }

        cc.log("ClientUpgradeLogic: Validation successful for upgrading " + buildingType + " to level " + nextLevel + ".");
        return true;
    },

    getCostAndResourceType: function(buildingNextLevelConfig) {
        if (buildingNextLevelConfig.gold && buildingNextLevelConfig.gold !== 0) {
            return {
                cost: buildingNextLevelConfig.gold,
                resourceType: "gold"
            };
        } else if (buildingNextLevelConfig.elixir && buildingNextLevelConfig.elixir !== 0) {
            return {
                cost: buildingNextLevelConfig.elixir,
                resourceType: "oil"
            };
        }
    },

    /**
     * Handles the client-side logic for a UPGRADE_BUILDING_COMPLETE packet from the server.
     * @param {Object} upgradeBuildingCompletePacket - The parsed packet data from the server.
     */
    handleUpgradeBuildingCompletePacket: function(upgradeBuildingCompletePacket) {
        if (upgradeBuildingCompletePacket.success) {
            cc.log("UPGRADE_BUILDING_COMPLETE: Success reported by server for buildingIndex: " + upgradeBuildingCompletePacket.buildingIndex + ". Client-side logic should have already run.");
        } else {
            cc.warn("UPGRADE_BUILDING_COMPLETE: Upgrade failed on server for buildingIndex: " + upgradeBuildingCompletePacket.buildingIndex + ". Message: " + upgradeBuildingCompletePacket.message);
            // TODO: Implement client-side rollback if the optimistic update proves wrong.
        }
    },

    /**
     * Initiates the full upgrade process for a building.
     * This includes pre-upgrade actions like harvesting for resource generators.
     * @param {Building} building - The building instance to upgrade.
     */
    initiateUpgradeProcess: function(building) {
        if (building instanceof ResourceGenerator) {
            if (building.canHarvest()) {
                building.harvest();
            }
        }
        // Gửi yêu cầu lên server CHỈ KHI bắt đầu nâng cấp
        gv.testnetwork.connector.sendUpgradeBuildingRequest(building.buildingType, building.buildingIndex);
        this.startUpgradeBuilding(building);
    },

    getTownHallUpgradePrerequisites: function(townHallBuilding, nextLevel) { // nextLevel is townHallBuilding.level + 1
        if (!townHallBuilding || townHallBuilding.buildingType !== "TOW_1") {
            return { met: true, missing: [], message: "" };
        }

        if (!gv.configs || !gv.configs.TownHallRequire || !gv.configs.TownHallRequire[townHallBuilding.buildingType]) {
            cc.warn("UpgradeBuildingController.getTownHallUpgradePrerequisites: TownHallRequire.json or config for " + townHallBuilding.buildingType + " not found in gv.configs.");
            return { met: true, missing: [], message: "" }; // Config missing, assume no prerequisites for safety
        }

        // The key in TownHallRequire.json (e.g., "1", "2") refers to the CURRENT level of the Town Hall.
        // These are the requirements to upgrade FROM this current level TO the nextLevel.
        var currentTownHallLevelKey = townHallBuilding.level.toString();
        var requirements = gv.configs.TownHallRequire[townHallBuilding.buildingType][currentTownHallLevelKey];

        // No more requirements for this level
        if (!requirements || Object.keys(requirements).length === 0) {

            return { met: true, missing: [], message: "Tất cả các công trình yêu cầu đã được xây dựng." };
        }

        var missingBuildings = [];
        var buildingsManager = BuildingsManager.getInstance();
        var allBuildings = buildingsManager.placedBuildings || [];

        for (var type in requirements) {
            if (!requirements.hasOwnProperty(type)) continue;

            var reqDetails = requirements[type];
            var requiredNum = reqDetails.num || 0;
            var requiredLevel = reqDetails.level || 1;

            var countAtLevelOrAbove = 0;
            var highestLevelOwned = 0; // Highest level of this 'type' of building the player owns

            for (var i = 0; i < allBuildings.length; i++) {
                var b = allBuildings[i];
                if (b.buildingType === type) {
                    if (b.level >= requiredLevel) {
                        countAtLevelOrAbove++;
                    }
                    if (b.level > highestLevelOwned) {
                        highestLevelOwned = b.level;
                    }
                }
            }

            if (countAtLevelOrAbove < requiredNum) {
                missingBuildings.push({
                    type: type,
                    typeName: BUILDING_UI_CONFIG[type] ? BUILDING_UI_CONFIG[type].name : type,
                    required: requiredNum,
                    current: countAtLevelOrAbove,
                    requiredLevel: requiredLevel,
                    currentLevel: highestLevelOwned
                });
            }
        }

        if (missingBuildings.length > 0) {
            var message = "Yêu cầu các công trình sau:\n";
            for (var j = 0; j < missingBuildings.length; j++) {
                var m = missingBuildings[j];
                message += "- " + m.typeName + ": " + m.current + "/" + m.required +
                    " (Cấp yêu cầu: " + m.requiredLevel +
                    ", Cấp cao nhất hiện tại: " + m.currentLevel + ")\n";
            }
            return { met: false, missing: missingBuildings, message: message.trim() };
        }

        return { met: true, missing: [], message: "Tất cả các công trình yêu cầu đã được xây dựng." };
    },
}
