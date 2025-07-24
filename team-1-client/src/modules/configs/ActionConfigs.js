const ACTION_TEMPLATES = {
    info: {
        label: "Thông tin",
        iconRes: { normal: res.info_icon_png, pressed: res.info_icon_2_png, disabled: res.button_disable_png },
        callback: function(targetAsset, mainScene) {
            // TODO: Implement Info panel display or logic
            mainScene.buildingInfoUINode.showInfo(targetAsset);
            mainScene.buildingInfoUINode.setVisible(true);
            BuildingsController.getInstance().deActivateAsset(mainScene, mainScene.activeBuilding);
                mainScene.activeBuilding = null;
        }
    },
    upgrade: {
        label: "Nâng cấp",
        iconRes: { normal: res.upgrade_icon_png, pressed: res.upgrade_icon_2_png, disabled: res.button_disable_png },
        callback: function(targetAsset, mainScene) {
            // TODO: Implement building upgrade logic
            mainScene.toggleUpgradeBuildingUI(targetAsset);
            BuildingsController.getInstance().deActivateAsset(mainScene, mainScene.activeBuilding);
            mainScene.activeBuilding = null;
        }
    },
    collect: {
        label: "Thu hoạch",
        iconRes: { normal: res.harvest_gold_png, pressed: res.harvest_gold_icon_2_png, disabled: res.harvest_gold_png },
        callback: function(targetAsset, mainScene) {
            if (!mainScene || !mainScene.buildingManager) {
                cc.warn("ActionConfigs: Cannot collect - MainScene or BuildingsManager not available");
                return;
            }

            var resourceGenerator = mainScene.buildingManager.getResourceGeneratorByIndex(targetAsset.buildingIndex);

            if (!resourceGenerator.canHarvest()) {
                cc.log("ActionConfigs: ResourceGenerator " + resourceGenerator.name + " has no resources to harvest");
                return;
            }

            var harvestResult = resourceGenerator.harvest();

            if (harvestResult.success) {
                cc.log("COLLECT SUCCESS: Harvested " + harvestResult.amount + " " + harvestResult.resourceType + " from " + resourceGenerator.name);
            } else {
                cc.warn("COLLECT FAILED: " + (harvestResult.message || "Unknown error") + " for " + resourceGenerator.name);
            }
        }
    },
    remove: {
        label: "Tháo dỡ",
        iconRes: { normal: res.remove_icon_png, pressed: res.remove_icon_2_png, disabled: res.button_disable_png },
        callback: function(obstacle, mainScene) {
            cc.log("Attempting to remove obstacle: " + obstacle.obstacleIndex);

            var config = ItemConfigUtils.getBuildingConfig({buildingType: obstacle.obstacleType})
            if (!config|| typeof config.buildTime === 'undefined') {
                cc.error("ActionConfigs/Remove: Obstacle config is missing cost or buildTime.");
                return;
            }

            var cost = config.gold || config.elixir || 0;
            var resourceType = config.gold ? 'gold' : 'oil';
            var removalTime = config.buildTime;

            var playerDataManager = PlayerDataManager.getInstance();
            var builderManager = BuilderManager.getInstance();

            if (playerDataManager.getResourceAmount(resourceType) < cost) {
                cc.log("Not enough " + resourceType + ". Triggering Use Gem Popup.");

                var missingAmount = cost - playerDataManager.getResourceAmount(resourceType);
                var popupTypeForGem = resourceType === 'gold' ? 'GOLD' : 'OIL';

                var popupConfig = {
                    type: popupTypeForGem,
                    amount: missingAmount,
                    resource: resourceType,
                    target: obstacle,
                    mainUIInstance: mainScene,
                    successCallback: function() {
                        ActionConfigs.handleObstacleAction(obstacle, mainScene);
                    }
                };

                UIController.showUseGemPopupWithOptions(mainScene, popupConfig);
                return; // Stop here until the player buys resources
            }

            // 3. If resources are sufficient, try to assign a builder
            // We use the new UNIFIED assignment function from the refactored manager.
            if (builderManager.assignBuilderToTask(obstacle) !== -1) {
                // A builder was successfully assigned. Proceed with the removal.
                // 4. Subtract resources
                playerDataManager.subtractResources(resourceType, cost);

                // 5. Set the obstacle's state to start the timer
                obstacle.setState(BUILDING_STATES.CONSTRUCTING); // Re-using this state for "removing"
                obstacle.finishBuildingTime = Math.floor(Date.now() / 1000) + removalTime;

                // 6. Show the progress bar
                BuildingsManager.getInstance().toggleUpgradingIndicator(obstacle, true);

                gv.testnetwork.connector.sendRemoveObstacleRequest(obstacle.obstacleType, obstacle.obstacleIndex);

                // 7. Hide the interaction panel
                BuildingsController.getInstance().deActivateAsset(mainScene, mainScene.activeBuilding);
                mainScene.activeBuilding = null;
                
                mainScene.interactionPanel.hidePanel();

            } else {
                // No free builder was found.
                cc.log("No free builders available to remove obstacle.");
                // You can optionally show a "all builders busy" message to the player here.
            }
        }
    },
    trainTroops: {
        label: "Luyện lính",
        iconRes: { normal: res.train_icon_png, pressed: res.button_press_png, disabled: res.button_disable_png },
        callback: function(targetAsset, mainScene) {
            cc.log("TRAIN TROOPS action for: " + targetAsset.buildingType);
            mainScene.toggleTrainTroopUI(targetAsset);
            BuildingsController.getInstance().deActivateAsset(mainScene, mainScene.activeBuilding);
                mainScene.activeBuilding = null;
        }
    },
    finishNow: {
        label: "Hoàn thành ngay",
        iconRes: {
            normal: res.upgrade_icon_png,
            pressed: res.upgrade_icon_2_png,
            disabled: res.button_disable_png
        },
        callback: function(targetAsset, mainScene) {
            if (!targetAsset) {
                cc.warn("ActionConfigs.finishNow: targetAsset is undefined. Aborting.");
                return;
            }
            cc.log("Finish Now button clicked for asset: " + (targetAsset.buildingType|| targetAsset.obstacleType) +
                   " with state: " + targetAsset.buildingState);
            if (typeof window.UIController !== 'undefined' && typeof window.UIController.showFinishNowUI === 'function') {
                window.UIController.showFinishNowUI(targetAsset, mainScene);
                BuildingsController.getInstance().deActivateAsset(mainScene, mainScene.activeBuilding);
                mainScene.activeBuilding = null;
            } else {
                cc.error("ActionConfigs.finishNow: UIController.showFinishNowUI is not defined or not accessible globally.");
            }
        }
    },
    cancelBuild: {
        label: "Hủy bỏ",
        iconRes: {
            normal: res.cancel_icon_png,
            pressed: res.cancel_icon_png,
            disabled: res.cancel_icon_png
        },
        callback: function(building, mainScene) {
            cc.log("Executing 'Cancel Build' action for: " + building.buildingType);

            // you can only remove buildings that are currently being constructed which is level 1
            var config = ItemConfigUtils.getBuildingConfig(building, 1);
            if (!config) {
                cc.error("CancelBuild: Could not find config for " + building.buildingType);
                return;
            }

            var cost = 0;
            var resourceType = null;
            if (config.gold > 0) {
                cost = config.gold;
                resourceType = "gold";
            } else if (config.elixir > 0) {
                cost = config.elixir;
                resourceType = "oil";
            }

            if (cost > 0 && resourceType) {
                // 2. Calculate and Refund 50% of Resources
                var refundAmount = Math.floor(cost * 0.5);
                PlayerDataManager.getInstance().addResources(resourceType, refundAmount);
                cc.log("Refunded " + refundAmount + " " + resourceType);
            }

            // 3. Free the Assigned Builder
            BuilderManager.getInstance().onBuildingOperationComplete(building);

            // 4. Remove the Building from the game
            BuildingsController.getInstance().deActivateAsset(mainScene, mainScene.activeBuilding);
                mainScene.activeBuilding = null;
            BuildingsManager.getInstance().removeBuilding(building.buildingIndex);
            gv.testnetwork.connector.sendBuyBuildingCancelRequest(building.buildingIndex);
        }
    }
};

const ASSET_ACTIONS_MAP = {
    building: {
        default: ["info"], // Default actions for any building
        "TOW_": ["info", "upgrade"],
        "RES_": ["info","upgrade", "collect"],
        "AMC_": ["info", "upgrade"],
        "CLC_": ["info"],
        "BAR_": ["info", "upgrade", "trainTroops"],
        "STO_": ["info", "upgrade"],
        "DEF_": ["info", "upgrade"],

    },
    obstacle: {
        default: ["remove"]
    }
};

var ActionConfigs = {
    getActionsForAsset: function(asset, mainScene) {
        if (asset.assetType === 'obstacle' && asset.buildingState === BUILDING_STATES.CONSTRUCTING) {
            let actionNames = ['finishNow'];

            // Map the action name to the full action template from ACTION_TEMPLATES
            return actionNames.map(function(actionName) {
                var template = ACTION_TEMPLATES[actionName];
                if (!template) return null;
                var newAction = {};
                for (var key in template) {
                    if (template.hasOwnProperty(key)) {
                        newAction[key] = template[key];
                    }
                }
                return newAction;
            }).filter(function(action) { return action !== null; });
        }

        // Show Finish Now for CONSTRUCTING or UPGRADING
        if (asset.assetType === 'building' && (asset.buildingState === 'CONSTRUCTING' || asset.buildingState === 'UPGRADING')) {
            let actionNames = ['info', 'finishNow'];

            // Only add the 'cancelBuild' option if the building is being newly constructed.
            if (asset.buildingState === 'CONSTRUCTING') {
                actionNames.push('cancelBuild');
            }

            return actionNames.map(function(actionName) {
                var template = ACTION_TEMPLATES[actionName];
                if (!template) return null;
                var newAction = {};
                for (var key in template) {
                    if (template.hasOwnProperty(key)) {
                        newAction[key] = template[key];
                    }
                }
                return newAction;
            }).filter(function(action) { return action !== null; });
        }

        const typeMap = ASSET_ACTIONS_MAP[asset.assetType];
        if (!typeMap) {
            cc.warn("ActionConfigs: No action map defined for assetType: " + asset.assetType);
            return [];
        }

        const assetKey = asset.assetType === 'building' ? asset.buildingType : asset.obstacleType;
        let actionNames = [];

        if (typeMap[assetKey]) {
            actionNames = typeMap[assetKey];
        } else {
            if (asset.assetType === 'building') {
                if (assetKey && assetKey.startsWith("TOW_")) {
                    actionNames = typeMap["TOW_"];
                } else if (assetKey && assetKey.startsWith("RES_")) {
                    actionNames = typeMap["RES_"] ;
                } else if (assetKey && assetKey.startsWith("AMC_")) {
                    actionNames = typeMap["AMC_"];
                } else if (assetKey && assetKey.startsWith("BAR_")) {
                    actionNames = typeMap["BAR_"];
                } else if (assetKey && assetKey.startsWith("CLC_")) {
                    actionNames = typeMap["CLC_"];
                } else if (assetKey && assetKey.startsWith("STO_")) {
                    actionNames = typeMap["STO_"];
                } else if (assetKey && assetKey.startsWith("DEF_")) {
                    actionNames = typeMap["DEF_"];
                }
                else {
                    actionNames = typeMap.default || [];
                }
            } else {
                 actionNames = typeMap.default || [];
            }
        }
        
        if (!actionNames || actionNames.length === 0) {
             // Fallback to a global default if no specific or type-default actions found
            actionNames = ASSET_ACTIONS_MAP.building.default;
            cc.log("ActionConfigs: No specific actions for " + assetKey + ", using assetType default.");
        }
        
        const resolvedActions = actionNames.map(actionName => {
            const template = ACTION_TEMPLATES[actionName];
            if (!template) {
                cc.warn("ActionConfigs: No action template found for action name: " + actionName);
                return null;
            }
            // Manual shallow copy for compatibility
            var newAction = {};
            for (var key in template) {
                if (template.hasOwnProperty(key)) {
                    newAction[key] = template[key];
                }
            }
            // Special handling for collect action - customize icon and state based on building type
            if (actionName === 'collect' && asset.assetType === 'building') {
                var collectIconData = this._getCollectIconForBuilding(asset.buildingType, mainScene, asset);
                newAction.iconRes = collectIconData.iconRes;
                newAction.isEnabled = collectIconData.isEnabled;
                
                // If disabled, override the callback to do nothing
                if (!collectIconData.isEnabled) {
                    newAction.callback = function(targetAsset, mainScene) {
                        cc.log("COLLECT action disabled for " + (targetAsset.name || targetAsset.buildingIndex) + " - no resources to harvest");
                    };
                }
            }

            // The following comments explain how the callback (part of 'newAction', copied from 'template')
            // is intended to be used by the InteractionPanel.
            // The callback in ACTION_TEMPLATES now expects mainScene as its second argument.
            // The InteractionPanel will call this with (asset, mainSceneInstanceFromPanel).
            // So, we don't need to pre-bind 'this' (which would be ActionConfigs) or mainScene here.
            // The call site in InteractionPanel needs to be: action.callback(this.currentAsset, this.mainSceneRef);
            return newAction;
        }).filter(action => action !== null);
        
        // Ensure uniqueness if somehow duplicates were introduced by config
        const uniqueActions = resolvedActions.reduce((acc, current) => {
            const x = acc.find(item => item.label === current.label);
            if (!x) {
                return acc.concat([current]);
            }
            return acc;
        }, []);        return uniqueActions;
    },

    /**
     * Get resource-specific collect icon and state based on building type and accumulated resources
     * @param {string} buildingName - Building name (e.g., "RES_1", "RES_2")
     * @param {Object} mainScene - MainScene instance for accessing building manager
     * @param {Object} asset - Building asset object
     * @returns {Object} Icon resource object with normal, pressed, disabled states and enabled flag
     */
    _getCollectIconForBuilding: function(buildingName, mainScene, asset) {

        var isEnabled = false;
        var hasAccumulatedResources = false;
        
        if (mainScene && mainScene.buildingManager && asset && asset.buildingIndex) {
            var resourceGenerator = mainScene.buildingManager.getResourceGeneratorByIndex(asset.buildingIndex);
            if (resourceGenerator) {
                // Check if generator can be harvested (has accumulated resources > 0)
                hasAccumulatedResources = resourceGenerator.canHarvest() && resourceGenerator.getHarvestableAmount() > 0;
                isEnabled = hasAccumulatedResources;
                
                cc.log("ActionConfigs: Building " + buildingName + " - ResourceGenerator found, harvestable: " + 
                       resourceGenerator.getHarvestableAmount() + ", enabled: " + isEnabled);
            } else {
                cc.log("ActionConfigs: Building " + buildingName + " - No ResourceGenerator found, assuming disabled");
            }
        } else {
            cc.log("ActionConfigs: Cannot check resources for " + buildingName + " - missing dependencies");
        }

        // Resource-specific icons based on building type
        var iconSet = this._getIconSetForBuildingType(buildingName);
        
        return {
            iconRes: {
                normal: isEnabled ? iconSet.normal : iconSet.disabled,
                pressed: isEnabled ? iconSet.pressed : iconSet.disabled,
                disabled: iconSet.disabled
            },
            isEnabled: isEnabled
        };
    },

    /**
     * Get icon set for building type (separate from state logic)
     * @param {string} buildingName - Building name (e.g., "RES_1", "RES_2", "RES_3")
     * @returns {Object} Icon set with normal, pressed, and disabled states
     */
    _getIconSetForBuildingType: function(buildingName) {
        // Default collect icon (for unknown types or fallback)
        var defaultIconSet = { 
            normal: res.harvest_gold_png, 
            pressed: res.harvest_gold_icon_2_png, 
            disabled: res.harvest_gold_png
        };

        if (!buildingName) {
            return defaultIconSet;
        }

        switch (buildingName) {
            case "RES_1":
                return {
                    normal: res.harvest_gold_png,
                    pressed: res.harvest_gold_icon_2_png,
                    disabled: res.harvest_gold_png
                };
            
            case "RES_2":
                return {
                    normal: res.harvest_elixir_png,
                    pressed: res.harvest_elixir_icon_2_png,
                    disabled: res.harvest_elixir_png
                };
            default:
                return defaultIconSet;
        }
    }
};


