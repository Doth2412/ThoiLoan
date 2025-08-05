var BuyBuildingController = {
    currentBuyingBuilding: null,
    mainUIInstance: null,
    placementIndicator: null,

    startBuyBuilding: function (mainUIInstance, buildingData) {
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
        var isInBuyingPhase = true;
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
        cancelBtn.addClickEventListener(function() { this.cancelBuyBuilding(); }.bind(this));
        confirmBtn.addClickEventListener(function() { this.onConfirmBuyClicked(); }.bind(this));
        this.placementIndicator = placementIndicator;
    },

    onConfirmBuyClicked: function() {
        var newBuilding = this.currentBuyingBuilding || this.mainUIInstance.activeBuilding;
        if (!newBuilding) return;
        var buildingNode = newBuilding.compositeNode;
        var tempGridPos = this.mainUIInstance.gridSystem.localToGrid(buildingNode.getPosition().x, buildingNode.getPosition().y);
        newBuilding.posX = tempGridPos.x;
        newBuilding.posY = tempGridPos.y;
        var isValidPlacement = this.mainUIInstance.buildingManager.canPlaceBuildingAt(newBuilding.buildingIndex, newBuilding.posX, newBuilding.posY);
        if (isValidPlacement) {
            var actionConfig = {
                actionType: 'BUILD',
                target: newBuilding,
                mainUIInstance: this.mainUIInstance,
                onCancel: function() { cc.log("Build action was canceled by user from gem popup."); }
            };
            UseGController.requestAction(actionConfig);
        }
    },

    startConcreteBuild: function(buildingToBuild, mainUIInstance) {
        this.mainUIInstance = mainUIInstance;
        this.currentBuyingBuilding = buildingToBuild;
        var builderRequestResult = BuilderManager.getInstance().requestBuildUpgrade(buildingToBuild);
        if (builderRequestResult.success) {
            buildingToBuild.compositeNode.setOpacity(255);
            this.mainUIInstance.buildingManager.hidePlacementIndicator(buildingToBuild.buildingIndex);
            buildingToBuild.isInBuyingPhase = false;
            this.mainUIInstance.isDragging = false;
            if (builderRequestResult.builderAssigned) {
                buildingToBuild.setState(BUILDING_STATES.CONSTRUCTING);
                buildingToBuild.startBuildingTime = Math.floor(Date.now() / 1000);
                var config = ItemConfigUtils.getBuildingConfig(buildingToBuild, 1);
                buildingToBuild.finishBuildingTime = buildingToBuild.startBuildingTime + config.buildTime;
                BuildingsManager.getInstance().toggleUpgradingIndicator(buildingToBuild, true);
            } else {
                buildingToBuild.setState(BUILDING_STATES.OPERATING);
                cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.BUILDER_STATUS_UPDATED);
            }
            gv.testnetwork.connector.sendBuyBuildingRequest(buildingToBuild.buildingType, buildingToBuild.posX, buildingToBuild.posY);
            this.mainUIInstance.buildingManager.updateBuildingPosition(buildingToBuild.buildingIndex, buildingToBuild.posX, buildingToBuild.posY);
            if (this.placementIndicator && this.placementIndicator.getParent()) {
                this.placementIndicator.removeFromParent();
                this.placementIndicator = null;
            }
            if (this.mainUIInstance && this.mainUIInstance.hudLayerInstance) {
                this.mainUIInstance.hudLayerInstance.setVisible(true);
            }
            InputManager.getInstance().setMode(INPUT_MODE.NONE);
            BuildingsController.getInstance().deActivateAsset(this.mainUIInstance, buildingToBuild);
            this.mainUIInstance.activeBuilding = null;
            this.currentBuyingBuilding = null;
        } else {
            cc.error("startConcreteBuild failed: " + builderRequestResult.reason);
        }
    },

    findVacantSpot: function (buildingData, mainUIInstance) {
        var gridSystem = mainUIInstance.gridSystem;
        var startGridPos = {x: 20, y: 20};
        if (gridSystem && mainUIInstance.mapElement) {
            var visibleSize = cc.director.getVisibleSize();
            var nodeSpacePos = mainUIInstance.mapElement.convertToNodeSpace(cc.p(visibleSize.width / 2, visibleSize.height / 2));
            startGridPos = gridSystem.localToGrid(nodeSpacePos.x, nodeSpacePos.y);
        }
        var buildingConfig = BUILDING_UI_CONFIG[buildingData.buildingName] || ItemConfigUtils.getBuildingConfig({buildingType: buildingData.buildingName});
        var buildingSize = buildingConfig && buildingConfig.size ? buildingConfig.size : {width: 1, height: 1};
        if (!gridSystem) {
            return this.setFallbackPosition(buildingData, {x: 20, y: 20}, buildingData.buildingName);
        }
        var gridWidth = gridSystem.gridWidth;
        var gridHeight = gridSystem.gridHeight;
        var centerX = Math.floor(startGridPos.x);
        var centerY = Math.floor(startGridPos.y);
        var maxRadius = Math.max(gridWidth, gridHeight);
        for (var radius = 0; radius < maxRadius; radius++) {
            for (var dy = -radius; dy <= radius; dy++) {
                for (var dx = -radius; dx <= radius; dx++) {
                    if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
                    var x = centerX + dx;
                    var y = centerY + dy;
                    if (x < 0 || y < 0 || x + buildingSize.width > gridWidth || y + buildingSize.height > gridHeight) continue;
                    if (BuildingsManager.getInstance().checkIfSpotIsVacant(x, y, buildingSize)) {
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
        cc.warn("BuyBuildingController: No vacant spot for " + buildingName + ". Using fallback (" + buildingData.posX + ", " + buildingData.posY + ")");
    },

    cancelBuyBuilding: function () {
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
        if (!building) return;
        if (typeof building.level === 'undefined' || building.level === null || building.level === 0) {
            building.level = 1;
        }
        building.setState(BUILDING_STATES.OPERATING);
        BuildingsManager.getInstance().toggleUpgradingIndicator(building, false);
        BuilderManager.getInstance().onBuildingOperationComplete(building);
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
};
