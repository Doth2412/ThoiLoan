var BuilderManager = cc.Class.extend({
    playerDataManager: null,
    buildingsManager: null,
    busyBuilders: null,
    _builderHutAssignments: null,
    pendingBuildUpgradeRequest: null,


    ctor: function() {
        this.playerDataManager = PlayerDataManager.getInstance();
        this.buildingsManager = BuildingsManager.getInstance();
        this.busyBuilders = {};
        this._builderHutAssignments = {};
        this.pendingBuildUpgradeRequest = null;
        this._builders = {};
        this._pathfinder = null;
        this._gridSystem = null;
        this._mainUIInstance = null;
        cc.log("BuilderManager initialized.");
    },

    init: function(pathfinder, gridSystem, mainUIInstance) {
        this._pathfinder = pathfinder;
        this._gridSystem = gridSystem;
        this._mainUIInstance = mainUIInstance;
        cc.log("BuilderManager initialized with pathfinder, gridSystem, and mainUIInstance.");

        this._buildingMovedListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "BUILDING_MOVED",
            callback: this._handleBuildingMoved.bind(this)
        });
        cc.eventManager.addListener(this._buildingMovedListener, 1);
    },

    _handleBuildingMoved: function(event) {
        var movedBuilding = event.getUserData().building;
        cc.log("BuilderManager: Received BUILDING_MOVED event for " + movedBuilding.buildingType + " index " + movedBuilding.buildingIndex);

        var builderId = this.getBuilderIdForTask(movedBuilding);
        if (builderId !== -1 && this._builders[builderId]) {
            var builderInstance = this._builders[builderId];
            if (builderInstance.builderState === BUILDER_STATE.WORKING && builderInstance.targetBuilding === movedBuilding) {
                cc.log("BuilderManager: Builder " + builderId + " is working on moved building. Repositioning.");
                builderInstance.stopAllActions();
                builderInstance.startMovingToBuilding(builderInstance.getPosition(), movedBuilding);
            } else {
                cc.log("BuilderManager: Builder " + builderId + " is not working on this moved building or not in WORKING state. Current state: " + builderInstance.builderState);
            }
        } else {
            cc.log("BuilderManager: No builder assigned to moved building " + movedBuilding.buildingType + " index " + movedBuilding.buildingIndex);
        }
    },

    requestBuilderForBuilding: function(building, assignedHut) {
        if (!building || !assignedHut) {
            cc.error("BuilderManager.requestBuilderForBuilding: Building or assignedHut is null.");
            return;
        }

        if (!this._pathfinder || !this._gridSystem || !this._mainUIInstance) {
            cc.error("BuilderManager not fully initialized. Missing pathfinder, gridSystem, or mainUIInstance.");
            return;
        }

        let builderId = this.getBuilderIdForTask(building);
        if (builderId === -1) {
            cc.warn("BuilderManager.requestBuilderForBuilding: No builder assigned to " + building.buildingType + " index " + building.buildingIndex + ". Cannot display visual builder.");
            return;
        }

        let builderInstance = this._builders[builderId];
        if (!builderInstance) {
            builderInstance = new Builder(this._pathfinder, this._gridSystem);
            this._builders[builderId] = builderInstance;
            if (this._mainUIInstance && this._mainUIInstance.mapElement) {
                this._mainUIInstance.mapElement.addChild(builderInstance);
            } else {
                cc.error("BuilderManager: Cannot add builder to mapElement. mainUIInstance or mapElement is null.");
                return;
            }
        }

        // =================================================================
        // THÊM BƯỚC KIỂM TRA: Nếu thợ xây đã trên đường đến đúng mục tiêu này,
        // thì không ra lệnh di chuyển mới nữa để tránh lỗi hình ảnh.
        // =================================================================
        if (builderInstance.builderState === BUILDER_STATE.MOVING && builderInstance.targetBuilding === building) {
            cc.log("BuilderManager: Builder " + builderId + " is already en route to this target. No new move command issued.");
            return;
        }

        const startPos = assignedHut.compositeNode.getPosition();
        builderInstance.startMovingToBuilding(startPos, building);
    },

    // =================================================================
    // SỬA LẠI HOÀN TOÀN HÀM NÀY
    // =================================================================
    onBuildingOperationComplete: function(completedAsset) {
        cc.log("BuilderManager: Operation complete for buildingIndex: " + completedAsset.buildingIndex);
        let builderId = this.getBuilderIdForTask(completedAsset);

        if (builderId !== -1) {
            let builderInstance = this._builders[builderId];

            // LOGIC MỚI: Kiểm tra xem có công việc nào đang chờ không
            if (this.pendingBuildUpgradeRequest && builderInstance) {
                const nextTaskBuilding = this.pendingBuildUpgradeRequest.building;
                cc.log("BuilderManager: Pending task found. Rerouting builder " + builderId + " directly.");
                // Ra lệnh cho thợ xây đi thẳng đến công trình mới
                builderInstance.startMovingToNewTask(nextTaskBuilding);
            }
            // LOGIC CŨ: Nếu không có việc chờ, cho thợ xây về nhà
            else if (builderInstance) {
                let assignedHutIndex = this._builderHutAssignments[builderId];
                let hut = this.buildingsManager.getBuildingByIndex(assignedHutIndex);
                if (hut) {
                    cc.log("BuilderManager: No pending task. Builder " + builderId + " returning to hut " + assignedHutIndex);
                    builderInstance.returnToHutAndHide(hut);
                } else {
                    cc.warn("BuilderManager: Could not find assigned hut for builder " + builderId + ". Hiding builder.");
                    builderInstance.stopAllActionsAndHide();
                }
            }
        } else {
            cc.warn("BuilderManager: No builderId found for completed asset index: " + completedAsset.buildingIndex);
        }

        // Luôn giải phóng thợ về mặt logic để bắt đầu chuỗi sự kiện cho công việc tiếp theo
        this.freeBuilderFromTask(completedAsset);
    },

    _findBuilderHutPosition: function() {
        const builderHuts = this.buildingsManager.getAllBuildings().filter(b => b.buildingType === "BDH_1" && b.buildingState === BUILDING_STATES.OPERATING);
        if (builderHuts.length > 0) {
            return builderHuts[0].compositeNode.getPosition();
        }
        return null;
    },

    findFreeBuilderId: function() {
        var totalBuilders = this.getTotalBuilders();
        var busyIds = [];
        for (var taskKey in this.busyBuilders) {
            if (this.busyBuilders.hasOwnProperty(taskKey)) {
                busyIds.push(this.busyBuilders[taskKey]);
            }
        }
        for (var i = 1; i <= totalBuilders; i++) {
            if (busyIds.indexOf(i) === -1) {
                return i;
            }
        }

        return -1;
    },

    assignBuilderToTask: function(asset) {
        let freeBuilderId = this.findFreeBuilderId();
        if (freeBuilderId !== -1) {
            let availableHut = this.findAvailableBuilderHut();
            if (availableHut) {
                if (typeof asset.buildingIndex !== 'undefined') {
                    this.busyBuilders[asset.buildingIndex] = freeBuilderId;
                    this._builderHutAssignments[freeBuilderId] = availableHut.buildingIndex;
                    cc.log("BuilderManager: Assigned Builder #" + freeBuilderId + " from Hut " + availableHut.buildingIndex + " to buildingIndex: " + asset.buildingIndex);
                    cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.BUILDER_STATUS_UPDATED);
                    this.requestBuilderForBuilding(asset, availableHut);
                    return freeBuilderId;
                } else {
                    cc.warn("BuilderManager: Asset provided to assignBuilderToTask does not have a buildingIndex.");
                }
            } else {
                cc.warn("BuilderManager: No available builder huts found.");
            }
        }
        cc.warn("BuilderManager: No free builders to assign to task.");
        return -1;
    },

    freeBuilderFromTask: function(asset) {
        if (typeof asset.buildingIndex !== 'undefined' && this.busyBuilders.hasOwnProperty(asset.buildingIndex)) {
            let builderId = this.busyBuilders[asset.buildingIndex];
            delete this.busyBuilders[asset.buildingIndex];
            if (this._builderHutAssignments.hasOwnProperty(builderId)) {
                delete this._builderHutAssignments[builderId];
                cc.log("BuilderManager: Freed Hut assignment for Builder #" + builderId);
            }
            cc.log("BuilderManager: Freed Builder #" + builderId + " from buildingIndex: " + asset.buildingIndex);
            cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.BUILDER_STATUS_UPDATED);
            this._processPendingRequest();
        } else {
            cc.warn("BuilderManager: No builder was busy with buildingIndex: " + asset.buildingIndex + " to free.");
        }
    },

    getBuilderIdForTask: function(asset) {
        if (typeof asset.buildingIndex !== 'undefined' && this.busyBuilders.hasOwnProperty(asset.buildingIndex)) {
            return this.busyBuilders[asset.buildingIndex];
        }
        return -1;
    },

    findAvailableBuilderHut: function() {
        const allHuts = this.buildingsManager.getAllBuildings().filter(b => b.buildingType === "BDH_1" && b.buildingState === BUILDING_STATES.OPERATING);

        var assignedHutIndices = [];
        for (var builderId in this._builderHutAssignments) {
            if (this._builderHutAssignments.hasOwnProperty(builderId)) {
                assignedHutIndices.push(this._builderHutAssignments[builderId]);
            }
        }

        for (let i = 0; i < allHuts.length; i++) {
            if (assignedHutIndices.indexOf(allHuts[i].buildingIndex) === -1) {
                return allHuts[i];
            }
        }

        return null;
    },

    getTotalBuilders: function() {
        let count = 0;
        const allBuildings = this.buildingsManager.getAllBuildings();
        for (let i = 0; i < allBuildings.length; i++) {
            if (allBuildings[i].buildingType === "BDH_1" &&
                allBuildings[i].buildingState !== BUILDING_STATES.CONSTRUCTING &&
                allBuildings[i].buildingState !== BUILDING_STATES.PLACING &&
                allBuildings[i].buildingState !== BUILDING_STATES.UPGRADING) {
                count++;
            }
        }
        return count > 0 ? count : 1;
    },

    getFreeBuildersCount: function() {
        const totalBuilders = this.getTotalBuilders();
        const busyCount = Object.keys(this.busyBuilders).length;
        return Math.max(0, totalBuilders - busyCount);
    },

    assignBuilderToBuilding: function(buildingIndex) {
        if (this.getFreeBuildersCount() > 0) {
            if (this.busyBuilders.hasOwnProperty(buildingIndex.toString())) {
                cc.warn("BuilderManager: Building " + buildingIndex + " already has a builder assigned.");
                return true;
            }
            this.busyBuilders[buildingIndex.toString()] = true;
            cc.log("BuilderManager: Assigned builder to buildingIndex: " + buildingIndex);

            if (typeof cc.eventManager !== 'undefined') {
                cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.BUILDER_STATUS_UPDATED);
            }
            return true;
        }
        cc.warn("BuilderManager: No free builders to assign to buildingIndex: " + buildingIndex);
        return false;
    },

    getBuildingToFinishForFreeBuilder: function() {
        cc.log("BuilderManager: getBuildingToFinishForFreeBuilder called.");
        if (typeof BUILDING_STATES !== 'undefined') {
            cc.log("BuilderManager: BUILDING_STATES.CONSTRUCTING = " + BUILDING_STATES.CONSTRUCTING + ", BUILDING_STATES.UPGRADING = " + BUILDING_STATES.UPGRADING);
        } else {
            cc.error("BuilderManager: BUILDING_STATES is undefined in getBuildingToFinishForFreeBuilder!");
            return null;
        }

        let targetBuilding = null;
        let minRemainingTime = Infinity;
        const allBuildings = this.buildingsManager.getAllBuildings();
        const now = Math.floor(Date.now() / 1000);

        if (!allBuildings || allBuildings.length === 0) {
            cc.warn("BuilderManager: No buildings returned from buildingsManager.getAllBuildings().");
        }

        for (var buildingIndexKey in this.busyBuilders) {
            const building = allBuildings.find(b => b.buildingIndex == buildingIndexKey);

            if (!building) {
                cc.warn("BuilderManager: Could not find building object for index: " + buildingIndexKey + " in allBuildings list.");
                continue;
            }

            const isCorrectState = (building.buildingState === BUILDING_STATES.CONSTRUCTING || building.buildingState === BUILDING_STATES.UPGRADING);
            const isTimeValid = (typeof building.finishBuildingTime === 'number' && building.finishBuildingTime > now);

            if (isCorrectState && isTimeValid) {
                const remainingTime = building.finishBuildingTime - now;
                if (remainingTime < minRemainingTime) {
                    minRemainingTime = remainingTime;
                    targetBuilding = building;
                    cc.log("BuilderManager: New best candidate to rush: " + building.buildingType + " with remaining time: " + remainingTime);
                }
            } else {
                cc.log("BuilderManager: Building " + building.buildingType + " is NOT a candidate to rush. Reasons: CorrectState=" + isCorrectState + ", TimeValid=" + isTimeValid);
            }
        }

        if (targetBuilding) {
            cc.log("BuilderManager: Selected building to rush: " + targetBuilding.buildingType);
        } else {
            cc.log("BuilderManager: No suitable building found to rush after checking all busy builders.");
        }
        return targetBuilding;
    },

    requestBuildUpgrade: function (building, isNewConstruction, mainUIInstance) {
        if (building.buildingType === "BDH_1") {
            return {
                success: true,
                builderAssigned: false,
                reason: "builder's hut does not need a builder to be built."
            };
        }

        if (this.getFreeBuildersCount() > 0) {
            if (this.assignBuilderToTask(building) !== -1) {
                return { success: true, builderAssigned: true };
            }

            return {
                success: false,
                builderAssigned: false,
                reason: "Failed to assign builder unexpectedly."
            };
        }

        this.pendingBuildUpgradeRequest = {
            building: building,
            isNewConstruction: isNewConstruction
        };
        cc.log("BuilderManager: No free builders. Pending request for " + building.buildingType + " index " + building.buildingIndex);

        var buildingToRush = this.getBuildingToFinishForFreeBuilder();
        if (!buildingToRush) {
            cc.log("BuilderManager: No free builders, and no specific building identified to rush at this moment.");
            return {
                success: false,
                builderAssigned: false,
                reason: "No free builders, and no rushable building found."
            };
        }

        var now = Math.floor(Date.now() / 1000);
        var remainingTime = 0;

        if (typeof buildingToRush.finishBuildingTime === 'number' && buildingToRush.finishBuildingTime > now) {
            remainingTime = buildingToRush.finishBuildingTime - now;
        }

        var popupConfig = {
            type: "FREE_BUILDER",
            targetToRush: buildingToRush,
            amount: remainingTime,
            resource: "TIME",
            mainUIInstance: mainUIInstance,
            originalTargetBuildingType: building.buildingType,
            pendingBuildRequest: this.pendingBuildUpgradeRequest
        };

        return {
            success: false,
            builderAssigned: false,
            reason: "No free builders.",
            showPopup: true,
            popupConfig: popupConfig
        };
    },

    _processPendingRequest: function() {
        if (this.pendingBuildUpgradeRequest && this.getFreeBuildersCount() > 0) {
            const request = this.pendingBuildUpgradeRequest;
            this.pendingBuildUpgradeRequest = null;

            cc.log("BuilderManager: A builder is now free. Notifying listeners for pending request: " + request.building.buildingType);

            cc.eventManager.dispatchCustomEvent("PENDING_BUILD_REQUEST_APPROVED", {
                building: request.building,
                isNewConstruction: request.isNewConstruction
            });
        }
    },


    cancelOrRollbackAssignment: function(asset) {
        if (typeof asset.buildingIndex !== 'undefined' && this.busyBuilders.hasOwnProperty(asset.buildingIndex)) {
            delete this.busyBuilders[asset.buildingIndex];
            cc.log("BuilderManager: Rolled back builder assignment for buildingIndex: " + asset.buildingIndex);
            if (typeof cc.eventManager !== 'undefined') {
                cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.BUILDER_STATUS_UPDATED);
            }
        }
    },

    cancelPendingBuildUpgradeRequest: function() {
        if (this.pendingBuildUpgradeRequest) {
            cc.log("BuilderManager: Cancelling pending build/upgrade request for " + this.pendingBuildUpgradeRequest.building.buildingType);
            this.pendingBuildUpgradeRequest = null;
        }
    },

    repopulateBusyBuildersFromLogin: function() {
        cc.log("BuilderManager: Repopulating busy builders from login data.");
        this.busyBuilders = {};
        this._builderHutAssignments = {};

        var allBuildings = BuildingsManager.getInstance().getAllBuildings();
        if (!allBuildings) {
            cc.warn("BuilderManager: Cannot repopulate builders, BuildingsManager has no buildings.");
            return;
        }

        const operationalHuts = this.buildingsManager.getAllBuildings().filter(b => b.buildingType === "BDH_1" && b.buildingState === BUILDING_STATES.OPERATING);
        let hutIndex = 0;

        for (var i = 0; i < allBuildings.length; i++) {
            var building = allBuildings[i];
            if (building.buildingState === BUILDING_STATES.CONSTRUCTING || building.buildingState === BUILDING_STATES.UPGRADING) {
                if (typeof building.buildingIndex !== 'undefined') {
                    var builderId = this.findFreeBuilderId();
                    if (builderId !== -1) {
                        this.busyBuilders[building.buildingIndex] = builderId;
                        cc.log("BuilderManager: Re-assigned Builder #" + builderId + " to buildingIndex: " + building.buildingIndex);

                        if (operationalHuts.length > 0) {
                            const assignedHut = operationalHuts[hutIndex % operationalHuts.length];
                            this._builderHutAssignments[builderId] = assignedHut.buildingIndex;
                            cc.log("BuilderManager: Assigned Builder #" + builderId + " to Hut " + assignedHut.buildingIndex + " during repopulation.");
                            hutIndex++;
                        } else {
                            cc.warn("BuilderManager: No operational builder huts available to assign during repopulation for buildingIndex: " + building.buildingIndex);
                        }
                    } else {
                        cc.warn("BuilderManager: Could not find a free builder ID to re-assign during login for buildingIndex: " + building.buildingIndex);
                    }
                }
            }
        }
        cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.BUILDER_STATUS_UPDATED);
    },

    createAndDisplayBuilderVisuals: function() {
        cc.log("BuilderManager: Creating and displaying builder visuals for " + Object.keys(this.busyBuilders).length + " tasks.");
        for (var buildingIndex in this.busyBuilders) {
            if (this.busyBuilders.hasOwnProperty(buildingIndex)) {
                var builderId = this.busyBuilders[buildingIndex];
                var building = this.buildingsManager.getBuildingByIndex(buildingIndex);
                var hut = this.buildingsManager.getBuildingByIndex(this._builderHutAssignments[builderId]);

                if (building && hut) {
                    this.requestBuilderForBuilding(building, hut);
                } else {
                    cc.warn("BuilderManager: Could not find building or hut for builder " + builderId + " task on building " + buildingIndex);
                }
            }
        }
    },

    cleanupAllBuildersVisuals: function() {
        cc.log("BuilderManager: Cleaning up all builder visuals.");
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
