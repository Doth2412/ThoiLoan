var UpgradeBuildingController = {
    /**
     * Bắt đầu quá trình nâng cấp một cách cụ thể.
     * Hàm này chỉ được gọi bởi UseGController sau khi tài nguyên đã được trừ.
     */
    startUpgradeBuilding: function(building, mainUIInstance) {
        var builderRequestResult = BuilderManager.getInstance().requestBuildUpgrade(building);

        if (builderRequestResult.success && builderRequestResult.builderAssigned) {
            building.setState(BUILDING_STATES.UPGRADING);
            building.startBuildingTime = Math.floor(Date.now() / 1000);
            var buildingNextLevelConfig = ItemConfigUtils.getBuildingConfig(building, building.level + 1);
            building.finishBuildingTime =  building.startBuildingTime + buildingNextLevelConfig.buildTime;
            BuildingsManager.getInstance().toggleUpgradingIndicator(building, true);

            gv.testnetwork.connector.sendUpgradeBuildingRequest(building.buildingType, building.buildingIndex);
            cc.log("startUpgradeBuilding: Upgrade started for " + building.buildingType);
        } else {
            cc.error("startUpgradeBuilding: Failed to get a builder. This should not happen.");
        }
    },

    finishUpgradeBuilding: function(building){
        gv.testnetwork.connector.sendUpgradeBuildingComplete(building.buildingType, building.buildingIndex, 1);
        cc.log("UpgradeBuildingController: Finalizing upgrade for " + building.buildingType + " with index " + building.buildingIndex);

        building.level++;
        building.setState(BUILDING_STATES.OPERATING);
        BuildingsManager.getInstance().toggleUpgradingIndicator(building, false);

        var buildingType = building.buildingType;
        var newLevel = building.level;

        if (buildingType.startsWith("DEF_")) {
            var newAssetPaths = AssetUtils.getDefensiveBuildingAssetPaths(buildingType, newLevel);
            if (building.basePlatformSprite && newAssetPaths.base) {
                building.basePlatformSprite.setTexture(newAssetPaths.base);
            }
            if (building.buildingSprite && newAssetPaths.anim) {
                building.buildingSprite.setTexture(newAssetPaths.anim);
            }
        } else {
            var newAssetPath = AssetUtils.getBuildingLevelIdleAssetPath(buildingType, newLevel);
            if (building.buildingSprite && newAssetPath) {
                building.buildingSprite.setTexture(newAssetPath);
            }
        }

        BuilderManager.getInstance().onBuildingOperationComplete(building);

        cc.log("UpgradeBuildingController: Upgrade finished for " + building.buildingType + ". Builder freed.");
        PlayerDataManager.getInstance().notifyResourceUpdate("gold");
        PlayerDataManager.getInstance().notifyResourceUpdate("oil");

        this._playLevelUpEffect(building);
    },

    handleUpgradeBuildingCompletePacket: function(upgradeBuildingCompletePacket) {
        if (upgradeBuildingCompletePacket.success) {
            cc.log("UPGRADE_BUILDING_COMPLETE: Success reported by server for buildingIndex: " + upgradeBuildingCompletePacket.buildingIndex);
        } else {
            cc.warn("UPGRADE_BUILDING_COMPLETE: Upgrade failed on server for buildingIndex: " + upgradeBuildingCompletePacket.buildingIndex + ". Message: " + upgradeBuildingCompletePacket.message);
        }
    },

    _playLevelUpEffect: function(building) {
        var effectData = LEVELUP_EFFECT_METADATA["LEVELUP"];
        if (!effectData) return;

        var buildingWorldPos = building.compositeNode.getParent().convertToWorldSpace(building.compositeNode.getPosition());
        var buildingSize = building.compositeNode.getContentSize();
        var effectPos = cc.p(buildingWorldPos.x + buildingSize.width / 2 + effectData.offset.x, buildingWorldPos.y + buildingSize.height / 2 + effectData.offset.y);
        var parentNode = building.compositeNode;

        var frames = [];
        for (var i = 0; i < effectData.frameCount; i++) {
            var frameIndexStr = i.toString();
            while (frameIndexStr.length < effectData.frameIndexPadding) {
                frameIndexStr = '0' + frameIndexStr;
            }
            var framePath = effectData.basePath + frameIndexStr + ".png";
            var texture = cc.textureCache.addImage(framePath);
            if (texture) {
                var rect = cc.rect(0, 0, texture.getContentSize().width, texture.getContentSize().height);
                frames.push(new cc.SpriteFrame(texture, rect));
            }
        }

        if (frames.length > 0) {
            var animation = new cc.Animation(frames, effectData.frameDelay);
            var animateAction = cc.Animate.create(animation);
            var effectSprite = new cc.Sprite();
            effectSprite.setPosition(parentNode.convertToNodeSpace(effectPos));
            parentNode.addChild(effectSprite);
            effectSprite.runAction(cc.sequence(animateAction, cc.removeSelf()));
        }
    },

    canUpgradeBuilding: function(building){
        var nextLevel = building.level + 1;
        var buildingNextLevelConfig = ItemConfigUtils.getBuildingConfig(building, nextLevel);
        if (!buildingNextLevelConfig) return false;

        var currentPlayerTownHallLevel = BuildingsManager.getInstance().getTownHallLevel();
        if (buildingNextLevelConfig.townHallLevelRequired > currentPlayerTownHallLevel) {
            return false;
        }

        if (building.buildingType === "TOW_1") {
            var prerequisites = this.getTownHallUpgradePrerequisites(building, nextLevel);
            if (!prerequisites.met) return false;
        }
        return true;
    },

    getTownHallUpgradePrerequisites: function(townHallBuilding, nextLevel) {
        if (!townHallBuilding || townHallBuilding.buildingType !== "TOW_1") {
            return { met: true, message: "" };
        }
        var requirements = gv.configs.TownHallRequire[townHallBuilding.buildingType][townHallBuilding.level.toString()];
        if (!requirements || Object.keys(requirements).length === 0) {
            return { met: true, message: "Tất cả các công trình yêu cầu đã được xây dựng." };
        }
        var missingBuildings = [];
        var allBuildings = BuildingsManager.getInstance().placedBuildings || [];
        for (var type in requirements) {
            if (!requirements.hasOwnProperty(type)) continue;
            var reqDetails = requirements[type];
            var countAtLevelOrAbove = allBuildings.filter(function(b) { return b.buildingType === type && b.level >= reqDetails.level; }).length;
            if (countAtLevelOrAbove < reqDetails.num) {
                missingBuildings.push({ type: type, required: reqDetails.num, current: countAtLevelOrAbove, requiredLevel: reqDetails.level });
            }
        }
        if (missingBuildings.length > 0) {
            var message = "Yêu cầu các công trình sau:\n" + missingBuildings.map(function(m) {
                return "- " + (BUILDING_UI_CONFIG[m.type] ? BUILDING_UI_CONFIG[m.type].name : m.type) + ": " + m.current + "/" + m.required + " (Cấp " + m.requiredLevel + ")";
            }).join("\n");
            return { met: false, message: message.trim() };
        }
        return { met: true, message: "Tất cả các công trình yêu cầu đã được xây dựng." };
    },
};
