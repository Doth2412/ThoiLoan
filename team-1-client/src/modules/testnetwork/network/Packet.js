/**
 * Created by KienVN on 10/2/2017.
 */

gv.CMD = gv.CMD || {};
gv.CMD.HAND_SHAKE = 0;
gv.CMD.USER_LOGIN = 1;

gv.CMD.USER_INFO = 1001;
gv.CMD.INIT_MAP = 1002;

gv.CMD.BUILD_COMPLETE = 2001;
gv.CMD.MOVE_BUILDING = 2002;
gv.CMD.BUY_BUILDING_CONFIRM = 2003;
gv.CMD.BUY_BUILDING_CANCEL = 2004;
gv.CMD.UPGRADE_BUILDING = 2005;
gv.CMD.UPGRADE_BUILDING_COMPLETE = 2006;
gv.CMD.REMOVE_OBSTACLE = 2007;
gv.CMD.REMOVE_OBSTACLE_COMPLETE = 2008;

gv.CMD.HARVEST_RESOURCE = 3001;
gv.CMD.USE_G = 3002;

gv.CMD.UPDATE_BARRACK_QUEUE = 4001;
gv.CMD.UPDATE_PLAYER_ARMY = 4002;

gv.CMD.BATTLE_RESULT = 5010;
gv.CMD.FIND_BATTLE = 5011;
gv.CMD.PVP_BATTLE_RESULT = 5020;

testnetwork = testnetwork || {};
testnetwork.packetMap = {};

/** Outpacket */

//Handshake
CmdSendHandshake = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setControllerId(gv.CONTROLLER_ID.SPECIAL_CONTROLLER);
        this.setCmdId(gv.CMD.HAND_SHAKE);
    },
    putData: function () {
        //pack
        this.packHeader();
        //update
        this.updateSize();
    }
})
CmdSendUserInfo = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.USER_INFO);
    },
    pack: function () {
        this.packHeader();
        this.updateSize();
    }
})
CmdSendLogin = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.USER_LOGIN);
    },
    pack: function (user) {
        this.packHeader();
        this.putString(user);
        this.updateSize();
    }
})
CmdSendMove = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.MOVE);
    },
    pack: function (direction) {
        this.packHeader();
        this.putShort(direction);
        this.updateSize();
    }
})
CmdSendMoveBuilding = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.MOVE_BUILDING);
    },
    pack: function (buildingType, buildingIndex, newPositionX, newPositionY) {
        this.packHeader();
        this.putString(buildingType);
        this.putInt(buildingIndex);
        this.putInt(newPositionX);
        this.putInt(newPositionY);
        this.updateSize();
    }
})

/**
 * TO USE:
 * var packet = new CmdSendBuyBuildingConfirm();
 * packet.pack("BARRACKS", 10, 15);
 * this.gameClient.sendPacket(packet);
 */
CmdSendBuyBuildingConfirm = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.BUY_BUILDING_CONFIRM);
    },
    pack: function (buildingTypeId, positionX, positionY) {
        this.packHeader();
        this.putString(buildingTypeId);
        this.putInt(positionX);
        this.putInt(positionY);
        this.updateSize();
    }
})

CmdSendBuyBuildingCancel = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.BUY_BUILDING_CANCEL);
    },
    pack: function (buildingIndex) {
        this.packHeader();
        this.putInt(buildingIndex);
        this.updateSize();
    }
})
CmdSendBuildComplete = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.BUILD_COMPLETE);
    },
    pack: function (buildingTypeId, buildingIndex) {
        this.packHeader();
        this.putString(buildingTypeId);
        this.putInt(buildingIndex);
        this.updateSize();
    }
})
CmdSendUpgradeBuilding = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.UPGRADE_BUILDING);
    },
    pack: function (buildingTypeId, buildingIndex) {
        this.packHeader();
        this.putString(buildingTypeId);
        this.putInt(buildingIndex);
        this.updateSize();
    }
})

CmdSendUpgradeBuildingComplete = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.UPGRADE_BUILDING_COMPLETE);
    },
    pack: function (buildingTypeId, buildingIndex, builderIndex) {
        this.packHeader();
        this.putString(buildingTypeId);
        this.putInt(buildingIndex);
        this.putInt(builderIndex);
        this.updateSize();
    }
})

CmdSendRemoveObstacle = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.REMOVE_OBSTACLE);
    },
    pack: function (obstacleType, obstacleIndex) {
        this.packHeader();
        this.putString(obstacleType);
        this.putInt(obstacleIndex);
        this.updateSize();
    }
})

CmdSendRemoveObstacleComplete = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.REMOVE_OBSTACLE_COMPLETE);
    },
    pack: function (obstacleType, obstacleIndex, builderIndex) {
        this.packHeader();
        this.putString(obstacleType);
        this.putInt(obstacleIndex);
        this.putInt(builderIndex);
        this.updateSize();
    }
})

CmdSendUpdateBarrackQueue = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(1000); // Allocate a reasonable buffer size
        this.setCmdId(gv.CMD.UPDATE_BARRACK_QUEUE);
    },
    pack: function (buildingType, buildingIndex, startQueueTime, trainingQueue) {
        this.packHeader();
        // Building identifier
        this.putString(buildingType);
        this.putInt(buildingIndex);
        // Timestamp for server-side validation
        this.putInt(startQueueTime / 1000);
        // The number of troop stacks in the queue
        var queueSize = trainingQueue ? trainingQueue.length : 0;
        this.putInt(queueSize);

        // Serialize each troop stack in the queue
        for (var i = 0; i < queueSize; i++) {
            var troopSlot = trainingQueue[i];
            this.putString(troopSlot.troopType);
            this.putInt(troopSlot.troopAmount);
        }

        this.updateSize();
    }
})

CmdSendUpdatePlayerArmy = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(1000); // Allocate a reasonable buffer size
        this.setCmdId(gv.CMD.UPDATE_PLAYER_ARMY);
    },
    pack: function (army) {
        this.packHeader();
        // The number of troop stacks in the queue
        var armySize = army ? army.length : 0;
        this.putInt(armySize);
        // Serialize each troop stack in the queue
        for (var i = 0; i < armySize; i++) {
            var troop = army[i];
            this.putString(troop.troopType);
            this.putInt(troop.troopAmount);
        }
        this.updateSize();
    }
})

/**
 * Packet for requesting to harvest resources from a resource generator building
 * Enhanced to send comprehensive harvest action details and updated player information
 *
 * TO USE:
 * var harvestActionData = {
 *     buildingId: "RES_1_001",
 *     buildingIndex: 5,
 *     resourceGeneratorType: "RES_1",
 *     resourceType: "GOLD",
 *     amountHarvested: 150,
 *     harvestTime: Date.now(),
 *     generatorState: "OPERATING"
 * };
 * var playerInfoData = {
 *     playerId: 12345,
 *     username: "player123",
 *     updatedResources: { gold: 2150, oil: 800, gems: 50 },
 *     resourceCapacities: { maxGold: 5000, maxOil: 3000, maxGems: 1000 },
 *     harvestTimestamp: Date.now()
 * };
 * var packet = new CmdSendHarvestResource();
 * packet.pack(harvestActionData, playerInfoData);
 * this.gameClient.sendPacket(packet);
 */
CmdSendHarvestResource = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(2000); // Increased buffer size for comprehensive data
        this.setCmdId(gv.CMD.HARVEST_RESOURCE);
    },
    pack: function (harvestActionData, playerInfoData) {
        this.packHeader();

        // === HARVEST ACTION DATA ===
        // Building identification and harvest details
        this.putString(harvestActionData.buildingType);
        this.putInt(harvestActionData.buildingIndex);
        this.putString(harvestActionData.resourceType);
        this.putInt(harvestActionData.amountHarvested);
        this.putLong(harvestActionData.harvestTime);
        this.putString(harvestActionData.generatorState);
        // === PLAYER INFORMATION DATA ===
        // Player identification
        this.putInt(playerInfoData.playerId);                   // Player unique identifier
        this.putString(playerInfoData.username);                // Player username
        // Updated resource amounts after harvest
        this.putInt(playerInfoData.updatedResources.gold);      // Player's total gold after harvest
        this.putInt(playerInfoData.updatedResources.oil);       // Player's total oil after harvest
        this.putInt(playerInfoData.updatedResources.gem);      // Player's current gem

        // Player resource capacity limits for validation
        this.putInt(playerInfoData.resourceCapacities.maxGold); // Player's maximum gold capacity
        this.putInt(playerInfoData.resourceCapacities.maxOil);  // Player's maximum oil capacity
        this.putInt(playerInfoData.resourceCapacities.maxGem); // Player's maximum gem capacity

        // Timestamp when player data was updated
        this.putLong(playerInfoData.harvestTimestamp);          // When player data was updated

        this.updateSize();
    }
})

CmdSendUseG = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(2000);
        this.setCmdId(gv.CMD.USE_G);
    },
    pack: function (useGActionData) {
        this.packHeader();
        this.putInt(useGActionData.usedAmount);
        this.putString(useGActionData.resourceType);
        this.updateSize();
    }
})

CmdSendBattleResult = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(2000);
        this.setCmdId(gv.CMD.BATTLE_RESULT);
    },
    pack: function (mapIndex, stars, lootedGold, lootedElixir, usedTroops) {
        this.packHeader();
        this.putInt(mapIndex);
        this.putInt(stars);
        this.putInt(lootedGold);
        this.putInt(lootedElixir);
        var troopTypes = Object.keys(usedTroops);
        this.putInt(troopTypes.length);
        for (var i = 0; i < troopTypes.length; i++) {
            var troopType = troopTypes[i];
            this.putString(troopType);
            this.putInt(usedTroops[troopType]);
        }
        this.updateSize();
    }
})

CmdSendFindBattle = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(2000);
        this.setCmdId(gv.CMD.FIND_BATTLE);
    },
    pack: function (playerName, prestigePoint) {
        this.packHeader();
        this.putString(playerName);
        this.putInt(prestigePoint);
        this.updateSize();
    }
})

CmdSendPVPBattleResult = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(2000);
        this.setCmdId(gv.CMD.PVP_BATTLE_RESULT);
    },
    pack: function (defendPlayerID, isWon, lootedGold, lootedElixir, usedTroops) {
        this.packHeader();
        this.putString(defendPlayerID);
        this.putByte(isWon ? 1 : 0); // Add the boolean flag
        this.putInt(lootedGold);
        this.putInt(lootedElixir);
        var troopTypes = Object.keys(usedTroops);
        this.putInt(troopTypes.length);
        for (var i = 0; i < troopTypes.length; i++) {
            var troopType = troopTypes[i];
            this.putString(troopType);
            this.putInt(usedTroops[troopType]);
        }
        this.updateSize();
    }
})

/**
 * InPacket
 */

//Handshake
testnetwork.packetMap[gv.CMD.HAND_SHAKE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        this.token = this.getString();
    }
});

testnetwork.packetMap[gv.CMD.USER_LOGIN] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
    }
});

testnetwork.packetMap[gv.CMD.USER_INFO] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        var userInfoPacket = {
            playerInfoID: 0,
            playerInfoName: "",
            playerID: 0,
            sentServerTime: 0,
            logoutTime: 0,
            username: "",
            prestigePoint: 0,
            gold: 0,
            oil: 0,
            gem: 0,
            builderNumber: 0,
            buildings: [],
            obstacles: []
        };

        userInfoPacket.playerInfoID = this.getInt();
        userInfoPacket.playerInfoName = this.getString();

        userInfoPacket.playerID = this.getInt();
        userInfoPacket.sentServerTime = this.getLong();
        userInfoPacket.logoutTime = this.getLong();
        userInfoPacket.username = this.getString();
        userInfoPacket.prestigePoint = this.getInt();

        userInfoPacket.gold = this.getInt();
        userInfoPacket.oil = this.getInt();
        userInfoPacket.gem = this.getInt();
        var buildingCount = this.getInt();
        userInfoPacket.buildings = [];
        for (var i = 0; i < buildingCount; i++) {
            var buildingData = { // Create an intermediate object
                buildingIndex: this.getInt(),
                buildingName: this.getString(),
                level: this.getInt(),
                posX: this.getInt(),
                posY: this.getInt(),
                buildingState: this.getString(),
                stateStartTime: this.getLong(),
                type: this.getString()
            };

            cc.log("Parsed Building Data from Server:", JSON.stringify(buildingData, null, 2));
            userInfoPacket.buildings.push(buildingData);
            if (userInfoPacket.buildings[i].buildingName === "BDH_1") {
                userInfoPacket.builderNumber++;
            }
        }

        // 1. Read the separate list of barrack queues
        var barrackQueueCount = this.getInt();
        var barrackQueueData = [];
        for (var j = 0; j < barrackQueueCount; j++) {
            var queueInfo = {
                buildingIndex: this.getInt(), startTime: this.getLong(), trainingQueue: []
            };

            var troopsInQueue = this.getInt();
            for (var k = 0; k < troopsInQueue; k++) {
                queueInfo.trainingQueue.push({
                    troopType: this.getString(), troopAmount: this.getInt()
                });
            }
            barrackQueueData.push(queueInfo);
        }
        cc.log("Parsed Barrack Queue Data from Server:", JSON.stringify(barrackQueueData, null, 2));


        // 2. "Stitch" the queue data back to the original buildings list
        for (var j = 0; j < barrackQueueData.length; j++) {
            var queueInfo = barrackQueueData[j];
            // Find the building with the matching index
            for (var i = 0; i < userInfoPacket.buildings.length; i++) {
                if (userInfoPacket.buildings[i].buildingIndex === queueInfo.buildingIndex) {
                    cc.log("Stitching queue data for building index: " + queueInfo.buildingIndex);
                    // Found it! Attach the queue data.
                    userInfoPacket.buildings[i].trainingQueue = queueInfo.trainingQueue;
                    // Overwrite startTime as well, as it pertains to the queue
                    userInfoPacket.buildings[i].stateStartTime = queueInfo.startTime;
                    break; // Move to the next queue
                }
            }
        }

        var troopCount = this.getInt();
        userInfoPacket.army = [];
        for (var j = 0; j < troopCount; j++) {
            userInfoPacket.army.push({
                troopType: this.getString(), troopAmount: this.getInt(),
            });
        }

        var obstacleCount = this.getInt();
        userInfoPacket.obstacles = [];
        for (var k = 0; k < obstacleCount; k++) {
            userInfoPacket.obstacles.push({
                obstacleIndex: this.getInt(),
                obstacleID: this.getString(),
                type: this.getString(),
                posX: this.getInt(),
                posY: this.getInt(),
                isRemoved: this.getByte() === 1
            });
        }

        var mapCount = this.getInt();
        userInfoPacket.playerMaps = [];
        for (var l = 0; l < mapCount; l++) {
            userInfoPacket.playerMaps.push({
                mapIndex: this.getInt(),
                stars: this.getInt(),
                remainingGold: this.getInt(),
                remainingElixir: this.getInt()
            });
        }

        this.userInfo = userInfoPacket;

        if (gv && PlayerDataManager.getInstance()) {
            PlayerDataManager.getInstance().updateWithUserInfoData(userInfoPacket);
            cc.log("PlayerDataManager updated with USER_INFO data:", JSON.stringify(userInfoPacket, null, 2));
            cc.log("USER_INFO data processed and stored in PlayerDataManager.");
        } else {
            cc.warn("PlayerDataManager not available or missing updateWithUserInfoData method.");
        }
        cc.log("USER_INFO packet received with " + buildingCount + " buildings, " + troopCount + " troops, and " + obstacleCount + " obstacles");
    }
});

testnetwork.packetMap[gv.CMD.INIT_MAP] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        // Create an object to hold the data as it's read
        var initMapPacket = {};

        initMapPacket.playerId = this.getInt(); // Player ID

        // PlayerData
        initMapPacket.gold = this.getInt();
        initMapPacket.oil = this.getInt();
        initMapPacket.gem = this.getInt();
        initMapPacket.builderNumber = this.getInt();

        // Building Locations
        var buildingCount = this.getInt();
        initMapPacket.buildings = [];
        for (var i = 0; i < buildingCount; i++) {
            initMapPacket.buildings.push({
                buildingName: this.getString(), posX: this.getInt(), posY: this.getInt()
            });
        }

        // Obstacle Data
        var obstacleCount = this.getInt();
        initMapPacket.obstacles = [];
        for (var j = 0; j < obstacleCount; j++) {
            initMapPacket.obstacles.push({
                obstacleIndex: this.getInt(),
                obstacleID: this.getString(),
                type: this.getString(),
                posX: this.getInt(),
                posY: this.getInt(),
                isRemoved: this.getByte() === 1
            });
        }

        // Update PlayerDataManager with the new data
        PlayerDataManager.getInstance().updateWithInitMapData(initMapPacket);
        // --- END NEW/MODIFIED PART ---

        // Keep PlayerDataManager.getInstance() if other parts still use it, or remove if fully replaced.
        //PlayerDataManager.getInstance() = initMapPacket; // Or remove this line if PlayerDataManager is the sole source.

        cc.log("INIT_MAP data processed and stored in PlayerDataManager.");

        cc.log("INIT_MAP packet received with " + buildingCount + " buildings and " + obstacleCount + " obstacles");

        cc.eventManager.dispatchCustomEvent("MAP_INITIALIZED_AND_PROCESSED", initMapPacket);
    }
});

testnetwork.packetMap[gv.CMD.BUY_BUILDING_CONFIRM] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        var buyBuildingPacket = {};

        buyBuildingPacket.success = this.getByte() === 1;
        buyBuildingPacket.message = this.getString();
        buyBuildingPacket.buildingId = this.getString();
        buyBuildingPacket.buildingTypeId = this.getString();
        buyBuildingPacket.positionX = this.getInt();
        buyBuildingPacket.positionY = this.getInt();
        buyBuildingPacket.purchaseTime = this.getLong();

        this.buyBuildingData = buyBuildingPacket;

        if (gv && PlayerDataManager.getInstance()) {

            PlayerDataManager.getInstance().updateWithBuyBuildingData(this.buyBuildingData);
        } else {
            cc.warn("PlayerDataManager not available for BUY_BUILDING_CONFIRM update");
        }

        // Log based on success, now that PlayerDataManager has been called (if available)
        if (this.buyBuildingData.success) {
            cc.log("BUY_BUILDING_CONFIRM packet received for building: " + this.buyBuildingData.buildingId + ". Message: " + this.buyBuildingData.message);
        } else {
            cc.log("BUY_BUILDING_CONFIRM packet received with failure. Message: " + this.buyBuildingData.message);
        }
    }
});

testnetwork.packetMap[gv.CMD.UPDATE_BARRACK_QUEUE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        var success = this.getByte() === 1;
        var message = this.getString();

        if (success) {
            cc.log("Server successfully updated barrack queue. Message: " + message);
        } else {
            cc.error("Server failed to update barrack queue. Reason: " + message);
            // Here you might want to revert the client-side queue to its previous state
            // or show an error message to the user.
        }
    }
});

testnetwork.packetMap[gv.CMD.HARVEST_RESOURCE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        var harvestPacket = {};

        // Operation Result
        harvestPacket.success = this.getByte() === 1;
        harvestPacket.message = this.getString();

        // Building Data
        harvestPacket.buildingIndex = this.getInt();
        harvestPacket.harvestTime = this.getLong();

        // Resource Data
        harvestPacket.harvestedAmount = this.getInt();
        harvestPacket.resourceType = this.getString();

        // Updated Resource Totals
        harvestPacket.updatedResources = {
            gold: this.getInt(), oil: this.getInt(), gem: this.getInt()
        };

        // Next Harvest Time
        harvestPacket.nextHarvestTime = this.getLong();

        this.harvestData = harvestPacket;

        // Update the player data manager if available
        if (gv && PlayerDataManager.getInstance()) {
            PlayerDataManager.getInstance().updateWithHarvestData(harvestPacket);
            cc.log("HARVEST_RESOURCE data processed and stored in PlayerDataManager");
        } else {
            cc.warn("PlayerDataManager not available for HARVEST_RESOURCE update");
        }

        cc.log("HARVEST_RESOURCE packet received - Success: " + harvestPacket.success + ", Amount: " + harvestPacket.harvestedAmount + " " + harvestPacket.resourceType);
    }
});

testnetwork.packetMap[gv.CMD.USE_G] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        var useGPacket = {};

        // Operation Result
        useGPacket.success = this.getByte() === 1;
        useGPacket.message = this.getString();

        // Resource Data
        useGPacket.usedAmount = this.getInt();
        useGPacket.resourceType = this.getString();

        // Updated Resource Totals
        useGPacket.updatedResources = {
            gold: this.getInt(), oil: this.getInt(), gem: this.getInt()
        };
        PlayerDataManager.getInstance().updateWithUseGData(useGPacket);
    }
});

testnetwork.packetMap[gv.CMD.MOVE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        this.x = this.getInt();
        this.y = this.getInt();
    }
});

testnetwork.packetMap[gv.CMD.UPGRADE_BUILDING] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        var upgradeBuildingPacket = {};

        // Read response data according to server format
        upgradeBuildingPacket.success = this.getByte() === 1;
        upgradeBuildingPacket.message = this.getString();
        upgradeBuildingPacket.buildingTypeId = this.getString();
        upgradeBuildingPacket.buildingIndex = this.getInt();

        this.upgradeBuildingData = upgradeBuildingPacket;

        // Optionally update PlayerDataManager or trigger events here if needed
        cc.log("UPGRADE_BUILDING packet received - Success: " + upgradeBuildingPacket.success + ", buildingTypeId: " + upgradeBuildingPacket.buildingTypeId + ", buildingIndex: " + upgradeBuildingPacket.buildingIndex + ", message: " + upgradeBuildingPacket.message);
    }
});

testnetwork.packetMap[gv.CMD.UPGRADE_BUILDING_COMPLETE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        var upgradeBuildingCompletePacket = {};
        // Read response data according to server format
        upgradeBuildingCompletePacket.success = this.getByte() === 1;
        upgradeBuildingCompletePacket.message = this.getString();
        upgradeBuildingCompletePacket.buildingIndex = this.getInt();
        upgradeBuildingCompletePacket.upgradeTime = this.getLong();
        upgradeBuildingCompletePacket.buildingTypeId = this.getString();

        this.upgradeBuildingCompleteData = upgradeBuildingCompletePacket;

        cc.log("UPGRADE_BUILDING_COMPLETE packet received - Success: " + upgradeBuildingCompletePacket.success + ", buildingTypeId: " + upgradeBuildingCompletePacket.buildingTypeId + ", buildingIndex: " + upgradeBuildingCompletePacket.buildingIndex + ", upgradeTime: " + upgradeBuildingCompletePacket.upgradeTime + ", message: " + upgradeBuildingCompletePacket.message);

        // Move all client-side handling to UpgradeBuildingController
        UpgradeBuildingController.handleUpgradeBuildingCompletePacket(upgradeBuildingCompletePacket);
    }
});

testnetwork.packetMap[gv.CMD.REMOVE_OBSTACLE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        var removeObstaclePacket = {};
        // Read response data according to server format
        removeObstaclePacket.success = this.getByte() === 1;
        removeObstaclePacket.message = this.getString();
        removeObstaclePacket.obstacleType = this.getString();
        removeObstaclePacket.obstacleIndex = this.getInt();
        removeObstaclePacket.usedGold = this.getInt();
        removeObstaclePacket.usedOil = this.getInt();
        removeObstaclePacket.removeStartTime = this.getLong();
        cc.log("REMOVE_OBSTACLE packet received - Success: " + removeObstaclePacket.success + ", obstacleType: " + removeObstaclePacket.obstacleType + ", obstacleIndex: " + removeObstaclePacket.obstacleIndex + ", message: " + removeObstaclePacket.message);
    }
});

testnetwork.packetMap[gv.CMD.REMOVE_OBSTACLE_COMPLETE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        var removeObstaclePacket = {};
        // Read response data according to server format
        removeObstaclePacket.success = this.getByte() === 1;
        removeObstaclePacket.message = this.getString();
        removeObstaclePacket.obstacleType = this.getString();
        removeObstaclePacket.obstacleIndex = this.getInt();
        cc.log("REMOVE_OBSTACLE packet received - Success: " + removeObstaclePacket.success + ", obstacleType: " + removeObstaclePacket.obstacleType + ", obstacleIndex: " + removeObstaclePacket.obstacleIndex + ", message: " + removeObstaclePacket.message);
    }
});

testnetwork.packetMap[gv.CMD.BATTLE_RESULT] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        var battleResult = {};
        // Read response data according to server format
        battleResult.success = this.getByte() === 1;
        battleResult.message = this.getString();

        var mapCount = this.getInt();
        battleResult.playerMaps = [];
        for (var i = 0; i < mapCount; i++) {
            battleResult.playerMaps.push({
                mapIndex: this.getInt(),
                stars: this.getInt(),
                remainingGold: this.getInt(),
                remainingElixir: this.getInt()
            });
        }

        if (gv && PlayerDataManager.getInstance()) {
            PlayerDataManager.getInstance().updateWithBattleResultData(battleResult);
        }
    }
});

testnetwork.packetMap[gv.CMD.FIND_BATTLE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        var findBattleResponse = {};
        findBattleResponse.success = this.getByte() === 1;
        findBattleResponse.message = this.getString();
        if (findBattleResponse.success) {
            var opponentData = {};
            opponentData.username = this.getString();
            opponentData.resources = {
                gold: this.getInt(),
                oil: this.getInt(),
                gems: this.getInt()
            };
            opponentData.prestige = this.getInt();

            var buildingCount = this.getInt();
            opponentData.buildings = [];
            for (var i = 0; i < buildingCount; i++) {
                opponentData.buildings.push({
                    type: this.getString(),
                    level: this.getInt(),
                    position: {
                        x: this.getInt(),
                        y: this.getInt()
                    }
                });
            }

            var obstacleCount = this.getInt();
            opponentData.obstacles = [];
            for (var j = 0; j < obstacleCount; j++) {
                opponentData.obstacles.push({
                    type: this.getString(),
                    position: {
                        x: this.getInt(),
                        y: this.getInt()
                    }
                });
            }
            findBattleResponse.opponent = opponentData;
        }
        cc.eventManager.dispatchCustomEvent(BattleEvents.FIND_BATTLE_RESPONSE, findBattleResponse);
    }
});


testnetwork.packetMap[gv.CMD.PVP_BATTLE_RESULT] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        var battleResult = {};
        // Read response data according to server format
        battleResult.success = this.getByte() === 1;
        battleResult.message = this.getString();
        battleResult.lootedGold =  this.getInt();
        battleResult.lootedElixir =  this.getInt();
        cc.log("PVP_BATTLE_RESULT packet received - Success: " + battleResult.success + ", Looted Gold: " + battleResult.lootedGold + ", Looted Elixir: " + battleResult.lootedElixir + ", Message: " + battleResult.message);
    }
});



