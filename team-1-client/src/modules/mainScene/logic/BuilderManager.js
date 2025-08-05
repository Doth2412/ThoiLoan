var BuilderManager = cc.Class.extend({
    playerDataManager: null,
    buildingsManager: null,
    busyBuilders: null, // Sẽ lưu trữ key theo định dạng "assetType_index"
    _builderHutAssignments: null,
    pendingBuildUpgradeRequest: null,
    _builders: null,
    _pathfinder: null,
    _gridSystem: null,
    _mainUIInstance: null,

    ctor: function() {
        this.playerDataManager = PlayerDataManager.getInstance();
        this.buildingsManager = BuildingsManager.getInstance();
        this.busyBuilders = {};
        this._builderHutAssignments = {};
        this.pendingBuildUpgradeRequest = null;
        this._builders = {};
    },

    init: function(pathfinder, gridSystem, mainUIInstance) {
        this._pathfinder = pathfinder;
        this._gridSystem = gridSystem;
        this._mainUIInstance = mainUIInstance;
        var self = this;
        cc.eventManager.addCustomListener("BUILDING_MOVED", function(event) {
            self._handleBuildingMoved(event);
        });
    },

    _getAssetKey: function(asset) {
        // 1. Kiểm tra asset và assetType có hợp lệ không
        if (!asset || !asset.assetType) {
            cc.warn("BuilderManager: Asset không hợp lệ hoặc thiếu assetType.", asset);
            return null;
        }

        var index;
        // 2. Dựa vào assetType để lấy đúng index
        if (asset.assetType === 'building') {
            index = asset.buildingIndex;
        } else if (asset.assetType === 'obstacle') {
            index = asset.obstacleIndex;
        }

        // 3. Kiểm tra xem index có tồn tại không
        if (typeof index === 'undefined' || index === null) {
            cc.warn("BuilderManager: Không tìm thấy index hợp lệ cho assetType: " + asset.assetType, asset);
            return null;
        }

        // 4. Trả về key đã được tạo một cách nhất quán
        return asset.assetType + "_" + index;
    },

    handleDirectTransfer: function(taskToFinish, newActionConfig) {
        var newAsset = newActionConfig.target;
        var builderId = this.getBuilderIdForTask(taskToFinish);
        var builderInstance = this._builders[builderId];

        if (!builderInstance || builderId === -1) {
            if(newActionConfig.onCancel) newActionConfig.onCancel();
            return;
        }

        // --- BƯỚC 1: Hoàn thành dứt điểm nhiệm vụ cũ (Task A) ---
        cc.log("Silently finishing old task: " + (taskToFinish.buildingType || taskToFinish.obstacleType));
        if (taskToFinish.assetType === 'obstacle') {
            var bm = BuildingsManager.getInstance();
            bm.toggleUpgradingIndicator(taskToFinish, false);
            bm.removeObstacle(taskToFinish.obstacleIndex);
            gv.testnetwork.connector.sendRemoveObstacleComplete(taskToFinish.obstacleType, taskToFinish.obstacleIndex, builderId);
        } else if (taskToFinish.assetType === 'building') {
            if (taskToFinish.buildingState === BUILDING_STATES.CONSTRUCTING) {
                taskToFinish.level = 1;
                taskToFinish.setState(BUILDING_STATES.OPERATING);
                BuildingsManager.getInstance().toggleUpgradingIndicator(taskToFinish, false);
                gv.testnetwork.connector.sendBuildComplete(taskToFinish.buildingType, taskToFinish.buildingIndex);
            } else if (taskToFinish.buildingState === BUILDING_STATES.UPGRADING) {
                taskToFinish.level++;
                taskToFinish.setState(BUILDING_STATES.OPERATING);
                BuildingsManager.getInstance().toggleUpgradingIndicator(taskToFinish, false);
                UpgradeBuildingController._playLevelUpEffect(taskToFinish);
                gv.testnetwork.connector.sendUpgradeBuildingComplete(taskToFinish.buildingType, taskToFinish.buildingIndex, 1);
            }
        }
        PlayerDataManager.getInstance().notifyResourceUpdate("gold");
        PlayerDataManager.getInstance().notifyResourceUpdate("oil");

        // --- BƯỚC 2: Cập nhật lại dữ liệu của thợ xây ---
        var oldAssetKey = this._getAssetKey(taskToFinish);
        var newAssetKey = this._getAssetKey(newAsset);
        if (oldAssetKey) delete this.busyBuilders[oldAssetKey];
        if (newAssetKey) this.busyBuilders[newAssetKey] = builderId;
        cc.log("Builder #" + builderId + " task directly transferred from " + oldAssetKey + " to " + newAssetKey);

        // --- BƯỚC 3: Bắt đầu cụ thể nhiệm vụ mới (Task B) ---
        // **LOẠI BỎ LỆNH GỌI UseGController._executeCoreAction**
        this._executeConcreteAction(newActionConfig, builderId);

        // --- BƯỚC 4: Ra lệnh cho thợ xây di chuyển ---
        builderInstance.rerouteToTask(newAsset);
    },

    requestAction: function(actionConfig) {
        var requirements = UseGController._getRequirements(actionConfig);
        var missingResource = UseGController._checkMissingResources(requirements);
        if (missingResource.amount > 0) {
            UseGController._showBuyResourcePopup(missingResource, actionConfig);
            return;
        }
        if (requirements && !requirements.needsBuilder) {
            this._executeConcreteAction(actionConfig, -1); // -1 vì không có thợ xây được gán
            return;
        }
        if (this.getFreeBuildersCount() > 0) {
            var builderId = this.assignBuilderToTask(actionConfig.target);
            this._executeConcreteAction(actionConfig, builderId);
            var builderInstance = this._builders[builderId];
            if (builderInstance) {
                var assignedHutIndex = this._builderHutAssignments[builderId];
                var hut = BuildingsManager.getInstance().getBuildingByIndex(assignedHutIndex);
                if (hut) {
                    builderInstance.startMovingToBuilding(hut.compositeNode.getPosition(), actionConfig.target);
                }
            }
        } else {
            var buildingToRush = this.getBuildingToFinishForFreeBuilder();
            if (!buildingToRush) {
                if (actionConfig.onCancel) actionConfig.onCancel();
                return;
            }
            var remainingTime = Math.max(0, buildingToRush.finishBuildingTime - Math.floor(Date.now() / 1000));
            var popupConfig = {
                type: "FREE_BUILDER",
                amount: remainingTime,
                targetToRush: buildingToRush,
                mainUIInstance: actionConfig.mainUIInstance,
                successCallback: function() {
                    this.handleDirectTransfer(buildingToRush, actionConfig);
                }.bind(this),
                cancelCallback: actionConfig.onCancel
            };
            UIController.showUseGemPopupWithOptions(actionConfig.mainUIInstance, popupConfig);
        }
    },

    /**
     * HÀM QUAN TRỌNG: Bổ sung các case còn thiếu
     */
    _executeConcreteAction: function(actionConfig, builderId) {
        var requirements = UseGController._getRequirements(actionConfig);
        if (requirements.resourceType && requirements.cost > 0) {
            var pdm = PlayerDataManager.getInstance();
            pdm.subtractResources(requirements.resourceType, requirements.cost);
            pdm.notifyResourceUpdate(requirements.resourceType);
        }
        var target = actionConfig.target;
        var actionType = actionConfig.actionType;
        var mainScene = actionConfig.mainUIInstance;
        switch (actionType) {
            case 'UPGRADE':
                target.setState(BUILDING_STATES.UPGRADING);
                target.startBuildingTime = Math.floor(Date.now() / 1000);
                var nextLevelConfig = ItemConfigUtils.getBuildingConfig(target, target.level + 1);
                target.finishBuildingTime = target.startBuildingTime + nextLevelConfig.buildTime;
                BuildingsManager.getInstance().toggleUpgradingIndicator(target, true);
                gv.testnetwork.connector.sendUpgradeBuildingRequest(target.buildingType, target.buildingIndex);
                cc.log("BuilderManager: Started UPGRADE for " + target.buildingType);
                break;
            case 'BUILD':
                var buyBuildingController = BuyBuildingController;
                if (target.buildingType === "BDH_1") {
                    cc.log("BuilderManager: Instantly building a new Builder Hut.");
                    BuyBuildingController.finishConstructingBuilding(target);
                    if (buyBuildingController.placementIndicator && buyBuildingController.placementIndicator.getParent()) {
                        buyBuildingController.placementIndicator.removeFromParent();
                        buyBuildingController.placementIndicator = null;
                    }
                    if (mainScene && mainScene.hudLayerInstance) {
                        mainScene.hudLayerInstance.setVisible(true);
                    }
                    if (typeof InputManager !== 'undefined' && InputManager.getInstance()) {
                        InputManager.getInstance().setMode(INPUT_MODE.NONE);
                    }
                    if (mainScene.activeBuilding) {
                        BuildingsController.getInstance().deActivateAsset(mainScene, mainScene.activeBuilding);
                        mainScene.activeBuilding = null;
                    }
                    buyBuildingController.currentBuyingBuilding = null;

                    // Dừng lại tại đây, không chạy logic xây dựng thông thường
                    break;
                }
                target.setState(BUILDING_STATES.CONSTRUCTING);
                target.startBuildingTime = Math.floor(Date.now() / 1000);
                var config = ItemConfigUtils.getBuildingConfig(target, 1);
                target.finishBuildingTime = target.startBuildingTime + config.buildTime;
                BuildingsManager.getInstance().toggleUpgradingIndicator(target, true);
                gv.testnetwork.connector.sendBuyBuildingRequest(target.buildingType, target.posX, target.posY);
                cc.log("BuilderManager: Started BUILD for " + target.buildingType);
                target.isInBuyingPhase = false;

                // Ẩn các nút xác nhận/hủy
                if (buyBuildingController.placementIndicator && buyBuildingController.placementIndicator.getParent()) {
                    buyBuildingController.placementIndicator.removeFromParent();
                    buyBuildingController.placementIndicator = null;
                }

                if (mainScene && mainScene.hudLayerInstance) {
                    mainScene.hudLayerInstance.setVisible(true);
                }
                if (mainScene.activeBuilding) {
                    BuildingsController.getInstance().deActivateAsset(mainScene, mainScene.activeBuilding);
                    mainScene.activeBuilding = null;
                }
                // Đặt lại trạng thái của game
                if (typeof InputManager !== 'undefined' && InputManager.getInstance()) {
                    InputManager.getInstance().setMode(INPUT_MODE.NONE);
                }
                buyBuildingController.currentBuyingBuilding = null;
                break;
            case 'REMOVE_OBSTACLE':
                target.setState(BUILDING_STATES.CONSTRUCTING);
                var obsConfig = ItemConfigUtils.getBuildingConfig({ buildingType: target.obstacleType });
                target.finishBuildingTime = Math.floor(Date.now() / 1000) + obsConfig.buildTime;
                BuildingsManager.getInstance().toggleUpgradingIndicator(target, true);
                gv.testnetwork.connector.sendRemoveObstacleRequest(target.obstacleType, target.obstacleIndex);
                cc.log("BuilderManager: Started REMOVE_OBSTACLE for " + target.obstacleType);
                break;
        }
        if (actionConfig.mainUIInstance) {
            if (mainScene.interactionPanel) mainScene.interactionPanel.hidePanel();
            if (mainScene.activeBuilding) {
                BuildingsController.getInstance().deActivateAsset(mainScene, mainScene.activeBuilding);
                mainScene.activeBuilding = null;
            }
        }
    },

    requestBuildUpgrade: function (building) {
        if (building.buildingType === "BDH_1" && building.level === 0) {
            return { success: true, builderAssigned: false };
        }
        if (this.assignBuilderToTask(building) !== -1) {
            return { success: true, builderAssigned: true };
        }
        return { success: false, builderAssigned: false, reason: "Failed to assign builder." };
    },

    assignBuilderToTask: function(asset) {
        var freeBuilderId = this.findFreeBuilderId();
        if (freeBuilderId !== -1) {
            var availableHut = this.findAvailableBuilderHut();
            if (availableHut) {
                var assetKey = this._getAssetKey(asset);
                if (assetKey) {
                    this.busyBuilders[assetKey] = freeBuilderId;
                    this._builderHutAssignments[freeBuilderId] = availableHut.buildingIndex;
                    cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.BUILDER_STATUS_UPDATED);
                    this.requestBuilderForBuilding(asset, availableHut);
                    return freeBuilderId;
                }
            }
        }
        return -1;
    },

    freeBuilderFromTask: function(asset) {
        var assetKey = this._getAssetKey(asset);
        if (assetKey && this.busyBuilders.hasOwnProperty(assetKey)) {
            var builderId = this.busyBuilders[assetKey];
            delete this.busyBuilders[assetKey];
            if (this._builderHutAssignments.hasOwnProperty(builderId)) {
                delete this._builderHutAssignments[builderId];
            }
            cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.BUILDER_STATUS_UPDATED);
        }
    },

    getBuilderIdForTask: function(asset) {
        var assetKey = this._getAssetKey(asset);
        if (assetKey && this.busyBuilders.hasOwnProperty(assetKey)) {
            return this.busyBuilders[assetKey];
        }
        return -1;
    },

    getBuildingToFinishForFreeBuilder: function() {
        var targetAsset = null;
        var minRemainingTime = Infinity;
        var now = Math.floor(Date.now() / 1000);

        // Lặp qua tất cả các thợ đang bận
        for (var assetKey in this.busyBuilders) {
            if (!this.busyBuilders.hasOwnProperty(assetKey)) continue;

            var parts = assetKey.split('_');
            var assetType = parts[0];
            var assetIndex = parseInt(parts[1]);
            var asset = null;

            // =================================================================
            // SỬA LỖI Ở ĐÂY: Thêm logic để tìm cả obstacle, không chỉ building
            // =================================================================
            if (assetType === 'building') {
                // Logic cũ: Chỉ tìm trong danh sách nhà chính
                asset = this.buildingsManager.getBuildingByIndex(assetIndex);
            } else if (assetType === 'obstacle') {
                // Logic mới: Tìm trong danh sách vật cản nếu assetType là 'obstacle'
                // Giả định rằng BuildingsManager của bạn có hàm getObstacleByIndex
                if (this.buildingsManager.getObstacleByIndex) {
                    asset = this.buildingsManager.getObstacleByIndex(assetIndex);
                }
            }
            // =================================================================

            // Log cảnh báo nếu không tìm thấy asset tương ứng với key
            if (!asset) {
                cc.warn("BuilderManager: Could not find asset for key: " + assetKey);
                continue; // Bỏ qua và xét asset tiếp theo
            }

            // Kiểm tra xem asset có đang trong trạng thái xây/nâng cấp hợp lệ không
            var isCorrectState = (asset.buildingState === BUILDING_STATES.CONSTRUCTING || asset.buildingState === BUILDING_STATES.UPGRADING);
            var isTimeValid = (typeof asset.finishBuildingTime === 'number' && asset.finishBuildingTime > now);

            if (isCorrectState && isTimeValid) {
                var remainingTime = asset.finishBuildingTime - now;
                if (remainingTime < minRemainingTime) {
                    minRemainingTime = remainingTime;
                    targetAsset = asset;
                }
            }
        }

        if (targetAsset) {
            cc.log("BuilderManager: Selected asset to rush: " + (targetAsset.buildingType || targetAsset.obstacleType));
        } else {
            cc.log("BuilderManager: No suitable asset found to rush.");
        }
        return targetAsset;
    },

    // =================================================================
    // SỬA LỖI Ở ĐÂY: Thêm lại các hàm bị thiếu
    // =================================================================
    getTotalBuilders: function() {
        var count = 0;
        var allBuildings = this.buildingsManager.getAllBuildings();
        for (var i = 0; i < allBuildings.length; i++) {
            if (allBuildings[i].buildingType === "BDH_1" && allBuildings[i].buildingState === BUILDING_STATES.OPERATING) {
                count++;
            }
        }
        return count > 0 ? count : 1;
    },

    getFreeBuildersCount: function() {
        return Math.max(0, this.getTotalBuilders() - Object.keys(this.busyBuilders).length);
    },
    // =================================================================

    findFreeBuilderId: function() {
        var totalBuilders = this.getTotalBuilders();
        var busyIds = [];
        for (var taskKey in this.busyBuilders) {
            if (this.busyBuilders.hasOwnProperty(taskKey)) {
                busyIds.push(this.busyBuilders[taskKey]);
            }
        }
        for (var i = 1; i <= totalBuilders; i++) {
            if (busyIds.indexOf(i) === -1) return i;
        }
        return -1;
    },

    findAvailableBuilderHut: function() {
        var allHuts = this.buildingsManager.getAllBuildings().filter(function(b) { return b.buildingType === "BDH_1" && b.buildingState === BUILDING_STATES.OPERATING; });
        var assignedHutIndices = [];
        for (var builderId in this._builderHutAssignments) {
            if (this._builderHutAssignments.hasOwnProperty(builderId)) {
                assignedHutIndices.push(this._builderHutAssignments[builderId]);
            }
        }
        for (var i = 0; i < allHuts.length; i++) {
            if (assignedHutIndices.indexOf(allHuts[i].buildingIndex) === -1) {
                return allHuts[i];
            }
        }
        return null;
    },

    requestBuilderForBuilding: function(building, assignedHut) {
        if (!building || !assignedHut) return;
        if (!this._pathfinder || !this._gridSystem || !this._mainUIInstance) return;

        var builderId = this.getBuilderIdForTask(building);
        if (builderId === -1) return;

        var builderInstance = this._builders[builderId];
        if (!builderInstance) {
            builderInstance = new Builder(this._pathfinder, this._gridSystem);
            this._builders[builderId] = builderInstance;
            if (this._mainUIInstance && this._mainUIInstance.mapElement) {
                this._mainUIInstance.mapElement.addChild(builderInstance);
            }
        }

        if (builderInstance.builderState === BUILDER_STATE.MOVING && builderInstance.targetBuilding === building) return;

        var startPos = assignedHut.compositeNode.getPosition();
        builderInstance.startMovingToBuilding(startPos, building);
    },

    onBuildingOperationComplete: function(completedAsset) {
        var builderId = this.getBuilderIdForTask(completedAsset);
        if (builderId !== -1) {
            var builderInstance = this._builders[builderId];
            if (builderInstance) {
                var assignedHutIndex = this._builderHutAssignments[builderId];
                var hut = this.buildingsManager.getBuildingByIndex(assignedHutIndex);
                if (hut) {
                    builderInstance.returnToHutAndHide(hut);
                } else {
                    builderInstance.stopAllActionsAndHide();
                }
            }
        }
        this.freeBuilderFromTask(completedAsset);
    },

    _handleBuildingMoved: function(event) {
        var movedBuilding = event.getUserData().building;
        var builderId = this.getBuilderIdForTask(movedBuilding);
        if (builderId !== -1 && this._builders[builderId]) {
            var builderInstance = this._builders[builderId];
            if (builderInstance.builderState === BUILDER_STATE.WORKING && builderInstance.targetBuilding === movedBuilding) {
                builderInstance.stopAllActions();
                builderInstance.startMovingToBuilding(builderInstance.getPosition(), movedBuilding);
            }
        }
    },

    repopulateBusyBuildersFromLogin: function() {
        this.busyBuilders = {};
        this._builderHutAssignments = {};
        var allAssets = BuildingsManager.getInstance().getAllBuildings();
        if (!allAssets) return;

        var operationalHuts = allAssets.filter(function(b) { return b.buildingType === "BDH_1" && b.buildingState === BUILDING_STATES.OPERATING; });
        var hutIndex = 0;

        for (var i = 0; i < allAssets.length; i++) {
            var asset = allAssets[i];
            if (asset.buildingState === BUILDING_STATES.CONSTRUCTING || asset.buildingState === BUILDING_STATES.UPGRADING) {
                var assetKey = this._getAssetKey(asset);
                if (assetKey) {
                    var builderId = this.findFreeBuilderId();
                    if (builderId !== -1 && !this.busyBuilders[assetKey]) {
                        this.busyBuilders[assetKey] = builderId;
                        if (operationalHuts.length > 0) {
                            var assignedHut = operationalHuts[hutIndex % operationalHuts.length];
                            this._builderHutAssignments[builderId] = assignedHut.buildingIndex;
                            hutIndex++;
                        }
                    }
                }
            }
        }
        cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.BUILDER_STATUS_UPDATED);
    },

    createAndDisplayBuilderVisuals: function() {
        for (var buildingIndex in this.busyBuilders) {
            if (this.busyBuilders.hasOwnProperty(buildingIndex)) {
                var builderId = this.busyBuilders[buildingIndex];
                var building = this.buildingsManager.getBuildingByIndex(buildingIndex);
                var hut = this.buildingsManager.getBuildingByIndex(this._builderHutAssignments[builderId]);
                if (building && hut) {
                    this.requestBuilderForBuilding(building, hut);
                }
            }
        }
    },

    cleanupAllBuildersVisuals: function() {
        for (var builderId in this._builders) {
            if (this._builders.hasOwnProperty(builderId)) {
                var builderInstance = this._builders[builderId];
                if (builderInstance && cc.sys.isObjectValid(builderInstance)) {
                    builderInstance.removeFromParent(true);
                }
            }
        }
        this._builders = {};
        this.busyBuilders = {};
        this._builderHutAssignments = {};
        this.pendingBuildUpgradeRequest = null;
    }
});

BuilderManager._instance = null;
BuilderManager.getInstance = function () {
    if (!this._instance) {
        this._instance = new BuilderManager();
    }
    return this._instance;
};
