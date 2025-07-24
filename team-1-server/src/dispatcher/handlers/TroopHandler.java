package dispatcher.handlers;

import bitzero.util.common.business.Debug;
import cmd.CmdDefine;
import cmd.receive.troops.RequestUpdateBarrackQueue;
import cmd.receive.troops.RequestUpdatePlayerArmy;
import cmd.send.troops.ResponseUpdateBarrackQueue;
import cmd.send.troops.ResponseUpdatePlayerArmy;
import model.building.Barrack;
import model.result.UpdateBarrackQueueResult;
import model.result.UpdatePlayerArmyResult;
import service.TroopService;
import util.LoggerUtil;
import util.server.ServerConstant;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.DataCmd;
import bitzero.server.entities.User;
import bitzero.util.ExtensionUtility;
import model.PlayerInfo;
import model.building.Building;

public class TroopHandler extends BaseClientRequestHandler implements RequestHandler {

    @Override
    public void handleClientRequest(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "TroopHandler.handleClientRequest called for user: {}, command ID: {}",
                user.getName(), dataCmd.getId());
        switch (dataCmd.getId()) {
            case CmdDefine.UPDATE_BARRACK_QUEUE:
                updateBarrackQueueHandler(dataCmd, user);
                break;
            case CmdDefine.UPDATE_PLAYER_ARMY:
                updatePlayerArmyHandler(dataCmd, user);
                break;
            default:
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "TroopHandler.handleClientRequest: Unknown command ID {} for user {}",
                        dataCmd.getId(), user.getName());
                break;
        }
    }

    @Override
    public void handleRequest(DataCmd dataCmd, User user) {
        short cmdId = dataCmd.getId();
        try {
            if (CmdDefine.UPDATE_BARRACK_QUEUE == cmdId) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "MapHandler: Routing to buildCompleteHandler for cmdId: " + cmdId);
                updateBarrackQueueHandler(dataCmd, user);
            } else if (CmdDefine.UPDATE_PLAYER_ARMY == cmdId) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "MapHandler: Routing to buildCompleteHandler for cmdId: " + cmdId);
                updatePlayerArmyHandler(dataCmd, user);
            }
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "Error handling request " + cmdId + ": " + e.getMessage(), e);
            throw new RuntimeException("Request handling failed for " + cmdId, e);
        }
    }

    public void updateBarrackQueueHandler(DataCmd dataCmd, User user) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "Updating barrack queue for user: {}", user.getName());
        try {
            RequestUpdateBarrackQueue request = new RequestUpdateBarrackQueue(dataCmd);
            TroopService troopService = TroopService.getInstance();
            UpdateBarrackQueueResult result = troopService.processUpdateBarrackQueue(user, request);

            ResponseUpdateBarrackQueue response;
            if (result.isSuccess()) {
                PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
                Barrack barrack = null;

                // Find the specific barrack that was updated
                for (Building building : playerInfo.getPlayer().getBuildings()) {
                    if (building.getBuildingIndex() == request.getBuildingIndex() &&
                            building instanceof Barrack) {
                        barrack = (Barrack) building;
                        break;
                    }
                }
                if (barrack != null) {
                    response = ResponseUpdateBarrackQueue.success(
                            request.getBuildingIndex(),
                            result.getBuildingType(),
                            result.getStartTime(),
                            result.getTrainingQueue()
                    );
                    Debug.info(ExtensionLogLevel.INFO,
                            "Success response sent to user: " + user.getName() + " building: " + request.getBuildingIndex() + " trainingQueue: " + result.getTrainingQueue());
                } else {
                    response = ResponseUpdateBarrackQueue.validationFailure("Barrack not found");
                    LoggerUtil.log(ExtensionLogLevel.WARN,
                            "Barrack not found for user: {} with building index: {}",
                            user.getName(), request.getBuildingIndex());
                }
            } else {
                response = ResponseUpdateBarrackQueue.validationFailure(result.getMessage());
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "Validation failure response sent to user: {} for barrack index: {}, reason: {}",
                        user.getName(), request.getBuildingIndex(), result.getMessage());
            }

            ExtensionUtility.getExtension().send(response, user.getSession());
        } catch (Exception e) {
            ResponseUpdateBarrackQueue response = ResponseUpdateBarrackQueue.serviceInvalid();
            ExtensionUtility.getExtension().send(response, user.getSession());
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Service error response sent to user: {} due to exception: {}",
                    user.getName(), e.getMessage(), e);
        }
    }

    public void updatePlayerArmyHandler(DataCmd dataCmd, User user) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "Updating barrack queue for user: {}", user.getName());
        // Add your implementation here
        try {
            // Unpack the request data
            RequestUpdatePlayerArmy request = new RequestUpdatePlayerArmy(dataCmd);
            TroopService troopService = TroopService.getInstance();
            UpdatePlayerArmyResult result = troopService.processUpdatePlayerArmy(user, request);

            ResponseUpdatePlayerArmy response;
            if (result.isSuccess()) {
                response = ResponseUpdatePlayerArmy.success(
                        result.getPlayerArmy()
                );
                Debug.info(ExtensionLogLevel.INFO,
                        "Success response sent to user: " + user.getName() + " army: " + result.getPlayerArmy());
            } else {
                response = ResponseUpdatePlayerArmy.validationFailure(result.getMessage());
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "Validation failure response sent to user: {} for barrack index: {}, reason: {}",
                        user.getName(), result.getMessage());
            }

            ExtensionUtility.getExtension().send(response, user.getSession());
        } catch (Exception e) {
            ResponseUpdateBarrackQueue response = ResponseUpdateBarrackQueue.serviceInvalid();
            ExtensionUtility.getExtension().send(response, user.getSession());
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Service error response sent to user: {} due to exception: {}",
                    user.getName(), e.getMessage(), e);
        }
    }
}
