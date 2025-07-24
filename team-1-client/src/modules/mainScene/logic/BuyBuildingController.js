const BuyBuildingController = {
    currentBuyingBuilding: null,
    mainUIInstance: null,
    placementIndicator: null,
    _pendingBuildApprovedListener: null,

    onPendingBuildRequestApproved: function(event) {
        var eventData = event.getUserData();
        if (eventData.isNewConstruction && eventData.building === this.currentBuyingBuilding) {
            cc.log("BuyBuildingController: Pending request approved. Retrying confirmation.");
            this.confirmBuyingBuilding();
        }
    },

    startBuyBuilding: function (mainUIInstance, buildingData) {
        if (!this._pendingBuildApprovedListener) {
            this._pendingBuildApprovedListener = cc.eventManager.addCustomListener(
                "PENDING_BUILD_REQUEST_APPROVED",
                this.onPendingBuildRequestApproved.bind(this)
            );
        }
        if (mainUIInstance.activeBuilding) {
            BuildingsController.getInstance().deActivateAsset(mainUIInstance, mainUIInstance.activeBuilding);
            mainUIInstance.activeBuilding = null;
        }
        if (typeof InputManager !== 'undefined' && InputManager.getInstance()) {
            InputManager.getInstance().setMode(INPUT_MODE.PLACING_BUILDING);
        }
        if (mainUIInstance.hudLayerInstance) {
            mainUIInstance.hudLayerInstance.setVisible(false);
        }
        this.mainUIInstance = mainUIInstance;
        let isInBuyingPhase = true;
        this.findVacantSpot(buildingData, mainUIInstance);
        var newBuilding = BuildingsManager.getInstance().createAndSetupBuilding(mainUIInstance, buildingData, isInBuyingPhase);
        if (newBuilding) {
            newBuilding.setState(BUILDING_STATES.PLACING);
            mainUIInstance.activeBuilding = newBuilding;
            this.currentBuyingBuilding = newBuilding;
            this.setupPlacementIndicator();
            BuildingsController.getInstance().handleAssetTouchBegan(mainUIInstance, newBuilding, true);

        }
    },

    setupPlacementIndicator: function () {
        var placementIndicator = cc.Node();
        this.placementIndicator = placementIndicator;
        this.currentBuyingBuilding.compositeNode.addChild(placementIndicator, 5, "placementIndicator");
        placementIndicator.setPosition(0, this.currentBuyingBuilding.posY * 10);

        var confirmBtn = ccui.Button();
        placementIndicator.addChild(confirmBtn, 1);
        confirmBtn.loadTextures(res.accept_png, res.button_press_png, res.button_disable_png);
        confirmBtn.setPosition(-50, 0);
        confirmBtn.setScale(0.5);
        confirmBtn.setSwallowTouches(true);


        var cancelBtn = ccui.Button();
        placementIndicator.addChild(cancelBtn, 1);
        cancelBtn.loadTextures(res.cancel_png, res.button_press_png, res.button_disable_png);
        cancelBtn.setPosition(50, 0);
        cancelBtn.setScale(0.5);
        cancelBtn.setSwallowTouches(true);

        cancelBtn.addClickEventListener(() => {
            this.cancelBuyBuilding();
        });
        confirmBtn.addClickEventListener(() => {
            this.confirmBuyingBuilding();
        });

        this.placementIndicator = placementIndicator;
    },

    findVacantSpot: function (buildingData, mainUIInstance) {
        var gridSystem = mainUIInstance.gridSystem;
        var mapElement = mainUIInstance.mapElement;
        var startGridPos = {x: 20, y: 20};

        if (gridSystem && mapElement) {
            // Step 1: Get the center of the screen in screen coordinates.
            var visibleSize = cc.director.getVisibleSize();
            var screenCenterPoint = cc.p(visibleSize.width / 2, visibleSize.height / 2);

            // Step 2: Use the game's proven method to convert the screen point to the map's local coordinates.
            var nodeSpacePos = mapElement.convertToNodeSpace(screenCenterPoint);

            // Step 3: Convert the local map coordinate into a grid position.
            startGridPos = gridSystem.localToGrid(nodeSpacePos.x, nodeSpacePos.y);
        }

        const buildingConfig =
            BUILDING_UI_CONFIG[buildingData.buildingName] ||
            ItemConfigUtils.getBuildingConfig({buildingType: buildingData.buildingName});
        const buildingSize = buildingConfig && buildingConfig.size ? buildingConfig.size : {width: 1, height: 1};

        if (!gridSystem) {
            cc.warn("BuyBuildingController: gridSystem not available.");
            return this.setFallbackPosition(buildingData, {x: 20, y: 20}, buildingData.buildingName);
        }
        const gridWidth = gridSystem.gridWidth;
        const gridHeight = gridSystem.gridHeight;
        const centerX = Math.floor(startGridPos.x);
        const centerY = Math.floor(startGridPos.y);
        const maxRadius = Math.max(gridWidth, gridHeight);
        const buildingsManager = BuildingsManager.getInstance();

        for (let radius = 0; radius < maxRadius; radius++) {
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
                    const x = centerX + dx;
                    const y = centerY + dy;
                    if (x < 0 || y < 0 || x + buildingSize.width > gridWidth || y + buildingSize.height > gridHeight)
                        continue;

                    if (buildingsManager.checkIfSpotIsVacant(x, y, buildingSize)) {
                        buildingData.posX = x;
                        buildingData.posY = y;
                        return;
                    }
                }
            }
        }

        this.setFallbackPosition(buildingData, {x: 20, y: 20}, buildingData.buildingName);
    },

    setFallbackPosition: function (buildingData, fallback, buildingName) {
        buildingData.posX = typeof buildingData.posX === 'number' ? buildingData.posX : fallback.x;
        buildingData.posY = typeof buildingData.posY === 'number' ? buildingData.posY : fallback.y;
        cc.warn("BuyBuildingController: No vacant spot found for building ${buildingName}. Using fallback position (${buildingData.posX}, ${buildingData.posY})");
    },

    confirmBuyingBuilding: function () {
        cc.log("BuyBuildingController: Confirming purchase for building " + this.currentBuyingBuilding.buildingType);
        var newBuilding = this.currentBuyingBuilding || this.mainUIInstance.activeBuilding;
        if (!newBuilding) {
            cc.error("BuyBuildingController: No active building to confirm buying.");
            return;
        }
        var configForCost = ItemConfigUtils.getBuildingConfig({buildingType: newBuilding.buildingType, level: 1});
        var resourceType = null;
        var costAmount = 0;

        if (configForCost.gold && configForCost.gold !== 0) {
            resourceType = "gold";
            costAmount = configForCost.gold;
        } else if (configForCost.elixir && configForCost.elixir !== 0) {
            resourceType = "oil";
            costAmount = configForCost.elixir;
        }

        var buildingNode = newBuilding.compositeNode;
        var currentScreenPos = buildingNode.getPosition();
        var tempGridPos = this.mainUIInstance.gridSystem.localToGrid(currentScreenPos.x, currentScreenPos.y);

        newBuilding.posX = tempGridPos.x;
        newBuilding.posY = tempGridPos.y;

        var isValidPlacement = this.mainUIInstance.buildingManager.canPlaceBuildingAt(
            newBuilding.buildingIndex,
            newBuilding.posX,
            newBuilding.posY
        );
        if (isValidPlacement) {
            if (resourceType && costAmount > 0) {
                var currentResourceAmount = PlayerDataManager.getInstance().getResourceAmount(resourceType);
                if (currentResourceAmount < costAmount) {
                    cc.log("Insufficient resources to buy " + newBuilding.buildingType);
                    var missingAmountValue = costAmount - currentResourceAmount;
                    var popupConfig = {
                        type: resourceType.toUpperCase(),
                        target: newBuilding,
                        amount: missingAmountValue,
                        resource: resourceType,
                        mainUIInstance: this.mainUIInstance
                    };
                    UIController.showUseGemPopupWithOptions(this.mainUIInstance, popupConfig);
                    return;
                } else {
                    PlayerDataManager.getInstance().subtractResources(resourceType, costAmount);
                    cc.log("Resources deducted: " + costAmount + " " + resourceType);
                }
            }
            if (newBuilding.buildingType === "BDH_1") {
                gv.testnetwork.connector.sendBuyBuildingRequest(newBuilding.buildingType, newBuilding.posX, newBuilding.posY);
                newBuilding.isInBuyingPhase = false;
                newBuilding.setState(BUILDING_STATES.OPERATING);
                this.mainUIInstance.buildingManager.hidePlacementIndicator(newBuilding.buildingIndex);
                buildingNode.setOpacity(255);
                this.mainUIInstance.isDragging = false;
                this.mainUIInstance.buildingManager.updateBuildingPosition(
                    newBuilding.buildingIndex,
                    newBuilding.posX,
                    newBuilding.posY
                );
                this.mainUIInstance.originalBuildingGridPos = null;
                if (this.placementIndicator && this.placementIndicator.getParent()) {
                    this.placementIndicator.removeFromParent();
                    this.placementIndicator = null;
                }
                if (this.mainUIInstance.interactionPanel) {
                    var actions = ActionConfigs.getActionsForAsset(newBuilding, this.mainUIInstance);
                    this.mainUIInstance.interactionPanel.showPanel(newBuilding, actions);
                }
                if (this.mainUIInstance && this.mainUIInstance.hudLayerInstance) {
                    this.mainUIInstance.hudLayerInstance.setVisible(true);
                }
                InputManager.getInstance().setMode(INPUT_MODE.NONE);
                cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.BUILDER_STATUS_UPDATED);
                return;
            }
            var builderRequestResult = BuilderManager.getInstance().requestBuildUpgrade(newBuilding, true, this.mainUIInstance);
            if (builderRequestResult.success) {
                if (this._pendingBuildApprovedListener) {
                    cc.eventManager.removeListener(this._pendingBuildApprovedListener);
                    this._pendingBuildApprovedListener = null;
                }
                buildingNode.setOpacity(255);
                this.mainUIInstance.buildingManager.hidePlacementIndicator(newBuilding.buildingIndex);
                newBuilding.isInBuyingPhase = false;
                this.mainUIInstance.isDragging = false;
                newBuilding.setState(BUILDING_STATES.CONSTRUCTING);
                newBuilding.startBuildingTime = Math.floor(Date.now() / 1000);
                var config = ItemConfigUtils.getBuildingConfig(newBuilding, 1);
                if (!config || typeof config.buildTime !== 'number') {
                    cc.error("BuyBuildingController: Missing buildTime in config for " + newBuilding.buildingType);
                    BuilderManager.getInstance().cancelOrRollbackAssignment(newBuilding.buildingIndex);
                    PlayerDataManager.getInstance().addResources(resourceType, costAmount);
                    newBuilding.setState(BUILDING_STATES.PLACING);
                    newBuilding.isInBuyingPhase = true;
                    return;
                }
                newBuilding.finishBuildingTime = newBuilding.startBuildingTime + config.buildTime;
                BuildingsManager.getInstance().toggleUpgradingIndicator(newBuilding, true);
                gv.testnetwork.connector.sendBuyBuildingRequest(newBuilding.buildingType, newBuilding.posX, newBuilding.posY);
                this.mainUIInstance.buildingManager.updateBuildingPosition(
                    newBuilding.buildingIndex,
                    newBuilding.posX,
                    newBuilding.posY
                );
                this.mainUIInstance.originalBuildingGridPos = null;
                if (this.mainUIInstance.interactionPanel) {
                    var actions = ActionConfigs.getActionsForAsset(newBuilding, this.mainUIInstance);
                    this.mainUIInstance.interactionPanel.showPanel(newBuilding, actions);
                }
                if (this.placementIndicator && this.placementIndicator.getParent()) {
                    this.placementIndicator.removeFromParent();
                    this.placementIndicator = null;
                }
                if (this.mainUIInstance && this.mainUIInstance.hudLayerInstance) {
                    this.mainUIInstance.hudLayerInstance.setVisible(true);
                }
                InputManager.getInstance().setMode(INPUT_MODE.NONE);
                BuildingsController.getInstance().deActivateAsset(this.mainUIInstance, newBuilding);
                this.mainUIInstance.activeBuilding = null;
            } else if (builderRequestResult.showPopup) {
                var popupConfig = builderRequestResult.popupConfig;
                popupConfig.successCallback = this.confirmBuyingBuilding.bind(this);
                UIController.showUseGemPopupWithOptions(this.mainUIInstance, popupConfig);
                this.mainUIInstance.buildingManager.hidePlacementIndicator(newBuilding.buildingIndex);
                this.mainUIInstance.activeBuilding = null;
                this.mainUIInstance.isDragging = false;
                return;
            } else {
                cc.log("BuyBuildingController: All builders are busy.");
            }
        } else {
            cc.log("Cannot confirm invalid placement for " + newBuilding.buildingType);
        }
    },

    cancelBuyBuilding: function () {
        if (this._pendingBuildApprovedListener) {
            cc.eventManager.removeListener(this._pendingBuildApprovedListener);
            this._pendingBuildApprovedListener = null;
        }
        if (this.currentBuyingBuilding) {
            BuilderManager.getInstance().cancelOrRollbackAssignment(this.currentBuyingBuilding);

            this.mainUIInstance.buildingManager.removeBuilding(this.currentBuyingBuilding.buildingIndex);
            this.currentBuyingBuilding = null;
        }
        this.mainUIInstance.activeBuilding = null;
        this.mainUIInstance.isDragging = false;
        if (this.mainUIInstance.interactionPanel) {
            this.mainUIInstance.interactionPanel.hidePanel();
        }
        if (this.mainUIInstance && this.mainUIInstance.hudLayerInstance) {
            this.mainUIInstance.hudLayerInstance.setVisible(true);
        }
        InputManager.getInstance().setMode(INPUT_MODE.NONE);
    },

    finishConstructingBuilding: function (building) {
        var buildingNode = building.compositeNode;
        if (!building) {
            cc.error("BuyBuildingController.finishConstructingBuilding: Invalid building object provided.");
            return;
        }
        cc.log("BuyBuildingController: Finishing construction for " + building.buildingType + " index " + building.buildingIndex);
        if (typeof building.level === 'undefined' || building.level === null || building.level === 0) {
            building.level = 1;
            cc.log("BuyBuildingController: Set building " + building.buildingType + " index " + building.buildingIndex + " to level 1.");
        }
        building.setState(BUILDING_STATES.OPERATING);
        BuildingsManager.getInstance().toggleUpgradingIndicator(building, false);
        BuilderManager.getInstance().onBuildingOperationComplete(building);
        cc.log("BuyBuildingController: Construction finished for " + building.buildingType + " index " + building.buildingIndex + ". Builder freed. State: " + building.buildingState);
        PlayerDataManager.getInstance().notifyResourceUpdate("gold");
        PlayerDataManager.getInstance().notifyResourceUpdate("oil");
        if (typeof PlayerDataManager !== 'undefined' && PlayerDataManager.getInstance().notifyBuildingUpdated) {
            PlayerDataManager.getInstance().notifyBuildingUpdated(building);
        }
        if (this.mainUIInstance && this.mainUIInstance.interactionPanel && this.mainUIInstance.activeBuilding === building) {
            var actions = ActionConfigs.getActionsForAsset(building, this.mainUIInstance);
            this.mainUIInstance.interactionPanel.showPanel(building, actions);
        }
    },
    validateUpgradeBuilding: function (buildingIndex) {
        cc.log(buildingIndex);
        var building = BuildingsManager.getInstance().placedBuildings[buildingIndex];
        if (!building) {
            cc.warn("ClientUpgradeLogic: Building with index " + buildingIndex + " not found for upgrade validation.");
            return false;
        }
        var buildingType = building.buildingType;
        var currentLevel = building.level;
        var nextLevel = currentLevel + 1;
        var buildingNextLevelConfig = ItemConfigUtils.getBuildingConfig(building, nextLevel)
        if (!buildingNextLevelConfig) {
            cc.warn("ClientUpgradeLogic: Upgrade data not found for " + buildingType + " to level " + nextLevel + ".");
            return false;
        }
        var costAndResourceType = this.getCostAndResourceType(buildingNextLevelConfig)
        var cost = costAndResourceType.cost;
        var resourceType = costAndResourceType.resourceType;
        if (typeof cost !== 'number' || typeof resourceType !== 'string') {
            cc.warn("ClientUpgradeLogic: Invalid cost or resourceType in config for " + buildingType + " level " + nextLevel + ".");
            return false;
        }
        var currentResourceAmount = PlayerDataManager.getInstance().getResourceAmount(resourceType);
        if (currentResourceAmount < cost) {
            cc.warn("ClientUpgradeLogic: Insufficient " + resourceType + " for upgrade. Need: " + cost + ", Have: " + currentResourceAmount + ".");
            return false;
        }
        cc.log("ClientUpgradeLogic: Validation successful for upgrading " + buildingType + " to level " + nextLevel + ".");
        return true;
    },
    getCostAndResourceType: function (buildingNextLevelConfig) {
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
    }
}
