/**
 * Created by KienVN on 10/2/2017.
 */

var gv = gv||{};
var testnetwork = testnetwork||{};

testnetwork.Connector = cc.Class.extend({
    playerDataManager: null,
    ctor:function(gameClient)
    {
        this.playerDataManager = PlayerDataManager.getInstance();
        this.gameClient = gameClient;
        gameClient.packetFactory.addPacketMap(testnetwork.packetMap);
        gameClient.receivePacketSignal.add(this.onReceivedPacket, this);
        this._userName = "guest"; // Default username, can be set later
    },
    onReceivedPacket:function(cmd, packet)
    {
        cc.log("onReceivedPacket:", cmd);
        switch (cmd)
        {
            case gv.CMD.HAND_SHAKE:
                if (this._userName) {
                    this.sendLoginRequest(this._userName);
                } else {
                    cc.log("Error: Username not available for login after handshake.");
                }
                break;
            case gv.CMD.USER_LOGIN:
                this.sendGetUserInfo();
                cc.eventManager.dispatchCustomEvent("LOGIN_SUCCESS");
                break;
            case gv.CMD.USER_INFO:
                fr.view(UIManager);
                break;
            case gv.CMD.MOVE:
                // cc.log("MOVE:", packet.x, packet.y);
                // fr.getCurrentScreen().updateMove(packet.x, packet.y);
                break;
            case gv.CMD.INIT_MAP:
                cc.log("Give playerData");
                break;
        }
    },
    sendGetUserInfo:function()
    {
        cc.log("sendGetUserInfo");
        var pk = this.gameClient.getOutPacket(CmdSendUserInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },

    sendLoginRequest: function (userName) { // Added userName parameter
        cc.log("sendLoginRequest for user: " + userName);
        var pk = this.gameClient.getOutPacket(CmdSendLogin);
        pk.pack(userName); // Use the passed userName
        this.gameClient.sendPacket(pk);
    },

    sendMove: function (direction) {
        cc.log("SendMove:" + direction);
        // var pk = this.gameClient.getOutPacket(CmdSendMove);
        // pk.pack(direction);
        // this.gameClient.sendPacket(pk);
    },

    sendMoveBuildingRequest: function (buildingType, buildingIndex, newPositionX, newPositionY) {
        cc.log("sendMoveBuildingRequest: buildingId=" + buildingType + ", buildingIndex=" + buildingIndex + ", newPositionX=" + newPositionX + ", newPositionY=" + newPositionY);
        var pk = this.gameClient.getOutPacket(CmdSendMoveBuilding);
        pk.pack(buildingType, buildingIndex, newPositionX, newPositionY);
        this.gameClient.sendPacket(pk);
    },
    sendBuyBuildingRequest: function(buildingType, positionX, positionY) {
        cc.log("sendBuyBuildingRequest: buildingType=" + buildingType + ", positionX=" + positionX + ", positionY=" + positionY);
        var pk = this.gameClient.getOutPacket(CmdSendBuyBuildingConfirm);
        pk.pack(buildingType, positionX, positionY);
        this.gameClient.sendPacket(pk);
    },
    sendBuyBuildingCancelRequest: function(buildingIndex) {
        cc.log("sendBuyBuildingRequest: buildingIndex=" + buildingIndex);
        var pk = this.gameClient.getOutPacket(CmdSendBuyBuildingCancel);
        pk.pack(buildingIndex);
        this.gameClient.sendPacket(pk);
    },
    sendBuildComplete: function(buildingType, buildingIndex) {
        cc.log("sendBuildComplete: buildingType=" + buildingType + ", buildingIndex=" + buildingIndex);
        var pk = this.gameClient.getOutPacket(CmdSendBuildComplete);
        pk.pack(buildingType, buildingIndex);
        this.gameClient.sendPacket(pk);
    },
    sendUpgradeBuildingRequest: function(buildingTypeId, buildingIndex) {
        cc.log("sendUpgradeBuildingRequest: buildingTypeId=" + buildingTypeId + ", buildingIndex=" + buildingIndex);
        var pk = this.gameClient.getOutPacket(CmdSendUpgradeBuilding);
        pk.pack(buildingTypeId, buildingIndex);
        this.gameClient.sendPacket(pk);
    },
    sendUpgradeBuildingComplete: function(buildingTypeId, buildingIndex, builderIndex) {
        cc.log("sendUpgradeBuildingRequest: buildingTypeId=" + buildingTypeId + ", buildingIndex=" + buildingIndex + "builderIndex=" + builderIndex);
        var pk = this.gameClient.getOutPacket(CmdSendUpgradeBuildingComplete);
        pk.pack(buildingTypeId, buildingIndex, builderIndex);
        this.gameClient.sendPacket(pk);
    },
    sendRemoveObstacleRequest: function(obstacleType, obstacleIndex) {
        cc.log("sendUpgradeBuildingRequest: obstacleType=" + obstacleType + ", obstacleIndex=" + obstacleIndex);
        var pk = this.gameClient.getOutPacket(CmdSendRemoveObstacle);
        pk.pack(obstacleType, obstacleIndex);
        this.gameClient.sendPacket(pk);
    },
    sendRemoveObstacleComplete: function(obstacleType, obstacleIndex, builderIndex) {
        cc.log("sendUpgradeBuildingRequest: obstacleType=" + obstacleType + ", obstacleIndex=" + obstacleIndex + "builderIndex=" + builderIndex);
        var pk = this.gameClient.getOutPacket(CmdSendRemoveObstacleComplete);
        pk.pack(obstacleType, obstacleIndex, builderIndex);
        this.gameClient.sendPacket(pk);
    },
    sendHarvestResourceRequest: function (resourceGeneratorId, harvestedAmount, resourceType) {
        cc.log("sendHarvestResourceRequest: generator=" + resourceGeneratorId + 
            ", amount=" + harvestedAmount + ", type=" + resourceType);
        var resourceGenerator = null;
        resourceGenerator = BuildingsManager.getInstance().getResourceGeneratorByIndex(resourceGeneratorId);
        if (!resourceGenerator) {
            cc.error("Network: ResourceGenerator not found with ID: " + resourceGeneratorId);
            return;
        }

        var harvestActionData = {
            buildingType: resourceGenerator.buildingType || "RES_1", // TODO HUNG figure out why buildingType is null
            buildingIndex: resourceGenerator ? (resourceGenerator.buildingIndex || 0) : 0,
            resourceType: resourceType,
            amountHarvested: harvestedAmount,
            harvestTime: Math.floor(Date.now()),
            generatorState: resourceGenerator.state || "UNKNOWN"
        };
        cc.log("1/3");
        // Prepare updated player info data
        var playerInfoData = {
            playerId: this.playerDataManager.playerInfoID || 0,
            username: this.playerDataManager.playerInfoName || "guest",
            updatedResources: {
                gold: this.playerDataManager.gold || 0,
                oil: this.playerDataManager.oil || 0,
                gem: this.playerDataManager.gem || 0
            },
            resourceCapacities: {
                maxGold: this.playerDataManager.getResourceCapacity ? this.playerDataManager.getResourceCapacity( 'gold') : 100000,
                maxOil: this.playerDataManager.getResourceCapacity ? this.playerDataManager.getResourceCapacity('oil') : 50000,
                maxGem: this.playerDataManager.getResourceCapacity ? this.playerDataManager.getResourceCapacity('gem') : 10000
            },
            harvestTimestamp: Math.floor(Date.now())
        };
        
        // Log the comprehensive data being sent
        // cc.log("sendHarvestResourceRequest: Sending harvest action data:", JSON.stringify(harvestActionData, null, 2));
        // cc.log("sendHarvestResourceRequest: Sending player info data:", JSON.stringify(playerInfoData, null, 2));
        
        // Create and send the enhanced harvest resource packet
        var pk = this.gameClient.getOutPacket(CmdSendHarvestResource);
        pk.pack(harvestActionData, playerInfoData);
        this.gameClient.sendPacket(pk);
        
        cc.log("sendHarvestResourceRequest: Enhanced harvest packet sent successfully");
    },

    sendUseGRequest: function(usedAmount, resourceType){
        var pk = this.gameClient.getOutPacket(CmdSendUseG);
        pk.pack(usedAmount, resourceType);
        this.gameClient.sendPacket(pk);
    },

    sendUpdateBarrackQueueRequest: function(barrackType, barrackIndex, startQueueTime, queueData) {
       cc.log("sendUpdateBarrackQueueRequest: barrackType=" + barrackType +
              ", barrackId=" + barrackIndex + ", startTime=" + startQueueTime +
              ", queueData=" + JSON.stringify(queueData));
        var pk = this.gameClient.getOutPacket(CmdSendUpdateBarrackQueue);
        pk.pack(barrackType, barrackIndex, startQueueTime, queueData);
        this.gameClient.sendPacket(pk);
    },

    sendUpdatePlayerArmyRequest: function(armyData) {
        cc.log("sendUpdatePlayerArmyRequest: armyData=" + JSON.stringify(armyData));
        var pk = this.gameClient.getOutPacket(CmdSendUpdatePlayerArmy);
        pk.pack(armyData);
        this.gameClient.sendPacket(pk);
    },

    sendBattleResult: function(mapIndex, stars, lootedGold, lootedElixir, usedTroops) {
        cc.log("sendBattleResult: mapIndex=" + mapIndex +
            ", stars=" + stars + ", lootedGold=" + lootedGold +
            ", lootedElixir=" + lootedElixir + ", usedTroops=" + JSON.stringify(usedTroops));
        var pk = this.gameClient.getOutPacket(CmdSendBattleResult);
        pk.pack(mapIndex, stars, lootedGold, lootedElixir, usedTroops);
        this.gameClient.sendPacket(pk);
    },

    sendPVPBattleResult: function(defenderID, isWon, lootedGold, lootedElixir, usedTroops) {
        cc.log("sendBattleResult: defenderID=" + defenderID +
            ", isWon=" + isWon + ", lootedGold=" + lootedGold +
            ", lootedElixir=" + lootedElixir + ", usedTroops=" + JSON.stringify(usedTroops));
        var pk = this.gameClient.getOutPacket(CmdSendPVPBattleResult);
        pk.pack(defenderID, isWon, lootedGold, lootedElixir, usedTroops);
        this.gameClient.sendPacket(pk);
    },

    sendFindBattleRequest: function(username, prestigePoint) {
        cc.log("sendFindBattleRequest: Sending request to find battle.");
        var pk = this.gameClient.getOutPacket(CmdSendFindBattle);
        pk.pack(username, prestigePoint);
        this.gameClient.sendPacket(pk);
    },

    setUserName: function(userName) {
        cc.log("Setting username to: " + userName);
        this._userName = userName;
    }
});



