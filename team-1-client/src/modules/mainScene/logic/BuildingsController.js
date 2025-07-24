var BuildingsController = cc.Class.extend({
    count: null,

    ctor: function () {
        var self = this;
        this._cancelBuildingInteractionListener = cc.eventManager.addCustomListener(
            "CANCEL_BUILDING_INTERACTION",
            function(event) {
                var mainUIInstance = UIController._getMainUIInstance ? UIController._getMainUIInstance() : null;
                if (!mainUIInstance || !mainUIInstance.activeBuilding) return;
                self.handleBuildingTouchEnded(mainUIInstance, null, true);
                self.deActivateAsset(mainUIInstance, mainUIInstance.activeBuilding);
                mainUIInstance.activeBuilding = null;
                mainUIInstance.isDragging = false;
            }
        );
        if (!this._pendingBuildApprovedListener) {
            this._pendingBuildApprovedListener = cc.eventManager.addCustomListener(
                "PENDING_BUILD_REQUEST_APPROVED",
                function (event) {
                    self.onPendingBuildRequestApproved(event);
                }
            );
        }
    },
    onPendingBuildRequestApproved: function (event) {
        var eventData = event.getUserData();
        if (eventData.isNewConstruction) {
            return;
        }

        cc.log("BuildingsController: Pending upgrade request approved for " + eventData.building.buildingType + ". Initiating process.");
        UpgradeBuildingController.initiateUpgradeProcess(eventData.building);
    },
    /**
     * Initialize building manager and load building/obstacle data
     * @param {Object} mainUIInstance - The MainUI instance
     */
    initBuildingManagerAndLoadData: function (mainUIInstance) {
        var buildingManager = BuildingsManager.getInstance();
        mainUIInstance.buildingManager = buildingManager;
        buildingManager.initFromPlayerData(mainUIInstance);
        buildingManager.createAndAttachAllVisuals(mainUIInstance);

        var allBuildings = buildingManager.getAllBuildings();
        allBuildings.forEach(function(building) {
            if (building._initializeState) {
                building._initializeState({ stateStartTime: building.stateStartTime });
            }
        });
        var allObstacles = buildingManager.getAllObstacles();
        allObstacles.forEach(function(obstacle) {
            if (obstacle.buildingState === BUILDING_STATES.CONSTRUCTING) {
                buildingManager.toggleUpgradingIndicator(obstacle, true);
            }
        });
        allBuildings.forEach(function(building) {
            if (building.validateAndCorrectStateAfterLoad) {
                building.validateAndCorrectStateAfterLoad();
            }
        });
        var pathfindingGrid = mainUIInstance.buildingManager.getPathfindingGrid();
        var pathfinder = new Pathfinder(pathfindingGrid);
        BuilderManager.getInstance().init(pathfinder, mainUIInstance.gridSystem, mainUIInstance);
        BuilderManager.getInstance().repopulateBusyBuildersFromLogin();
    },

    finalizeActiveBuildingMove: function (mainUIInstance) {
        var building = mainUIInstance.activeBuilding;
        if (!building || building.isInBuyingPhase || mainUIInstance.isDragging || !mainUIInstance.originalBuildingGridPos) {
            return;
        }
        cc.log("Finalizing move for " + building.buildingType + ". Snapping back to original position.");
        building.posX = mainUIInstance.originalBuildingGridPos.x;
        building.posY = mainUIInstance.originalBuildingGridPos.y;
        var originalScreenPos = mainUIInstance.gridSystem.gridToLocal(building.posX, building.posY);
        building.compositeNode.setPosition(originalScreenPos);
        building.baseSprite.setPosition(originalScreenPos);
        mainUIInstance.buildingManager.hidePlacementIndicator(building.buildingIndex);
        if (mainUIInstance.hudLayerInstance && !mainUIInstance.hudLayerInstance.isVisible()) {
            mainUIInstance.hudLayerInstance.setVisible(true);
        }
        mainUIInstance.originalBuildingGridPos = null;
    },

    deActivateAsset: function (mainUIInstance, asset) {
        if (!asset) return;
        this.restoreActiveBuildingZOrderIfModified(mainUIInstance, asset);
        asset.selectionIndicator.setVisible(false);
        asset.compositeNode.setOpacity(255);
        mainUIInstance.interactionPanel.hidePanel();
        mainUIInstance.buildingManager.hidePlacementIndicator(asset.buildingIndex);
    },

    handleAssetTouchBegan: function (mainUIInstance, touchedAsset, isDrag) {
        if (!mainUIInstance.activeBuilding && mainUIInstance.originalBuildingGridPos) {
            cc.log("Sanity Check: Clearing dangling originalBuildingGridPos.");
            mainUIInstance.originalBuildingGridPos = null;
        }

        var previousActiveAsset = mainUIInstance.activeBuilding;

        if (previousActiveAsset && previousActiveAsset.isInBuyingPhase && previousActiveAsset !== touchedAsset) {
            return;
        }

        if (previousActiveAsset && previousActiveAsset !== touchedAsset) {
            this.finalizeActiveBuildingMove(mainUIInstance);
            this.deActivateAsset(mainUIInstance, previousActiveAsset);
        }

        if (previousActiveAsset === touchedAsset && !isDrag) {
            if (touchedAsset.buildingType && touchedAsset.buildingType.startsWith("AMC")) {
                cc.eventManager.dispatchCustomEvent("UPDATE_AMC_VISUALS", { building: touchedAsset });
            }
            return;
        }

        mainUIInstance.activeBuilding = touchedAsset;

        if (touchedAsset.assetType === 'building') {
            mainUIInstance.isDragging = isDrag;
            touchedAsset.selectionIndicator.setVisible(true);
            if (!mainUIInstance.originalBuildingGridPos) {
                mainUIInstance.originalBuildingGridPos = cc.p(touchedAsset.posX, touchedAsset.posY);
            }
            var currentZ = touchedAsset.compositeNode.getLocalZOrder();
            if (currentZ !== SELECTED_BUILDING_Z_ORDER) {
                mainUIInstance.originalBuildingZOrder = currentZ;
            }
            touchedAsset.compositeNode.setLocalZOrder(SELECTED_BUILDING_Z_ORDER);

            if (isDrag) {
                if (mainUIInstance.hudLayerInstance && mainUIInstance.hudLayerInstance.isVisible()) {
                    mainUIInstance.hudLayerInstance.setVisible(false);
                    if (mainUIInstance.interactionPanel) {
                        mainUIInstance.interactionPanel.hidePanel();
                    }
                }
                touchedAsset.compositeNode.setOpacity(128);
                mainUIInstance.buildingManager.showPlacementIndicator(touchedAsset.buildingIndex, true);
            }
        } else { // Obstacle
            mainUIInstance.isDragging = false;
            mainUIInstance.originalBuildingGridPos = null;
            touchedAsset.selectionIndicator.setVisible(true);
            touchedAsset.compositeNode.setOpacity(255);
        }

        if (!isDrag && !touchedAsset.isInBuyingPhase) {
            if (touchedAsset.buildingType && touchedAsset.buildingType.startsWith("AMC")) {
                cc.eventManager.dispatchCustomEvent("UPDATE_AMC_VISUALS", { building: touchedAsset });
            }
            var actions = ActionConfigs.getActionsForAsset(touchedAsset, mainUIInstance);
            mainUIInstance.interactionPanel.showPanel(touchedAsset, actions);
        }
    },

    handleBuildingTouchMoved: function (mainUIInstance, touch) {
        if (!mainUIInstance.isDragging || !mainUIInstance.activeBuilding) {
            return;
        }
        if (mainUIInstance.activeBuilding && mainUIInstance.activeBuilding.compositeNode) {
            var mapTouchLocation = mainUIInstance.mapElement.convertToNodeSpace(touch.getLocation());
            var desiredAnchorPos = cc.pAdd(mapTouchLocation, mainUIInstance.dragStartOffset || cc.p(0, 0));
            var targetGridPos = mainUIInstance.gridSystem.localToGrid(desiredAnchorPos.x, desiredAnchorPos.y);
            var newScreenPos = mainUIInstance.gridSystem.gridToLocal(targetGridPos.x, targetGridPos.y);
            mainUIInstance.activeBuilding.compositeNode.setPosition(newScreenPos);
            mainUIInstance.activeBuilding.baseSprite.setPosition(newScreenPos);
            if (mainUIInstance.buildingManager) {
                var isValidPlacement = mainUIInstance.buildingManager.canPlaceBuildingAt(
                    mainUIInstance.activeBuilding.buildingIndex,
                    targetGridPos.x,
                    targetGridPos.y
                );
                mainUIInstance.buildingManager.showPlacementIndicator(mainUIInstance.activeBuilding.buildingIndex, isValidPlacement);
            }
        }
    },

    handleBuildingTouchEnded: function (mainUIInstance, touch, isCancel) {
        var building = mainUIInstance.activeBuilding;
        if (!building) return;
        mainUIInstance.isDragging = false;
        if (isCancel) {
            this.finalizeActiveBuildingMove(mainUIInstance);
            this.deActivateAsset(mainUIInstance, building);
            mainUIInstance.activeBuilding = null;
            return;
        }
        var buildingNode = building.compositeNode;
        var currentScreenPos = buildingNode.getPosition();
        var tempGridPos = mainUIInstance.gridSystem.localToGrid(currentScreenPos.x, currentScreenPos.y);
        var isValidPlacement = mainUIInstance.buildingManager.canPlaceBuildingAt(
            building.buildingIndex,
            tempGridPos.x,
            tempGridPos.y
        );
        if (building.isInBuyingPhase) {
            buildingNode.setOpacity(128);
            mainUIInstance.buildingManager.showPlacementIndicator(building.buildingIndex, isValidPlacement);
            var snappedScreenPos = mainUIInstance.gridSystem.gridToLocal(tempGridPos.x, tempGridPos.y);
            buildingNode.setPosition(snappedScreenPos);
            building.baseSprite.setPosition(snappedScreenPos);
            building.posX = tempGridPos.x;
            building.posY = tempGridPos.y;
            mainUIInstance.originalBuildingGridPos = null;
        } else {
            buildingNode.setOpacity(255);
            var finalScreenPos = mainUIInstance.gridSystem.gridToLocal(tempGridPos.x, tempGridPos.y);
            buildingNode.setPosition(finalScreenPos);
            building.baseSprite.setPosition(finalScreenPos);
            building.posX = tempGridPos.x;
            building.posY = tempGridPos.y;
            if (isValidPlacement) {
                mainUIInstance.buildingManager.updateBuildingPosition(building.buildingIndex, building.posX, building.posY);
                if (building.buildingType && building.buildingType.startsWith("AMC")) {
                    cc.eventManager.dispatchCustomEvent("UPDATE_AMC_VISUALS", { building: building });
                }
                gv.testnetwork.connector.sendMoveBuildingRequest(building.buildingType, building.buildingIndex, building.posX, building.posY);
                mainUIInstance.originalBuildingGridPos = null;
                if (mainUIInstance.hudLayerInstance && !mainUIInstance.hudLayerInstance.isVisible()) {
                    mainUIInstance.hudLayerInstance.setVisible(true);
                }
                mainUIInstance.buildingManager.hidePlacementIndicator(building.buildingIndex);
                if (mainUIInstance.interactionPanel) {
                    var actions = ActionConfigs.getActionsForAsset(mainUIInstance.activeBuilding, mainUIInstance);
                    mainUIInstance.interactionPanel.showPanel(mainUIInstance.activeBuilding, actions);
                }
            } else {
                mainUIInstance.buildingManager.showPlacementIndicator(building.buildingIndex, false);
            }
        }
    },

    restoreActiveBuildingZOrderIfModified: function (mainUIInstance, building) {
        var target = building || mainUIInstance.activeBuilding;
        if (target && target.compositeNode &&
            target.config && target.config.type !== 'obstacle') {
            if (target.compositeNode.getLocalZOrder() === SELECTED_BUILDING_Z_ORDER) {
                var zOrder = MAX_Z_ORDER - (40 * target.posX + target.posY);
                target.compositeNode.setLocalZOrder(zOrder);
            }
        }
    },

});

BuildingsController._instance = null;

BuildingsController.getInstance = function () {
    if (!this._instance) {
        this._instance = new BuildingsController();
    }
    return this._instance;
};
