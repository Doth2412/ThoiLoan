package dispatcher.handlers;

import cmd.CmdDefine;
import cmd.receive.map.*;
import cmd.send.map.*;
import model.result.*;
import service.MapService;
import util.LoggerUtil;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.DataCmd;
import bitzero.server.entities.User;
import bitzero.util.ExtensionUtility;

/**
 * Handles map-related requests including building operations
 * Implements RequestHandler interface to integrate with CentralDispatcher
 */
public class MapHandler extends BaseClientRequestHandler implements RequestHandler {

    @Override
    public void handleClientRequest(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "MapHandler.handleClientRequest called for user: {}, command ID: {}",
                user.getName(), dataCmd.getId());
        switch (dataCmd.getId()) {
            case CmdDefine.BUILD_COMPLETE:
                buildCompleteHandler(dataCmd, user);
                break;
            case CmdDefine.MOVE_BUILDING:
                moveBuildingHandler(user, dataCmd);
                break;
            case CmdDefine.BUY_BUILDING_CONFIRM:
                buyBuildingHandler(user, dataCmd);
                break;
            case CmdDefine.BUY_BUILDING_CANCEL:
                cancelBuyBuildingHandler(user, dataCmd);
                break;
            case CmdDefine.UPGRADE_BUILDING:
                upgradeBuildingHandler(user, dataCmd);
                break;
            case CmdDefine.UPGRADE_BUILDING_COMPLETE:
                upgradeBuildingCompleteHandler(user, dataCmd);
                break;
            case CmdDefine.REMOVE_OBSTACLE:
                removeObstacleHandler(user, dataCmd);
                break;
            case CmdDefine.REMOVE_OBSTACLE_COMPLETE:
                removeObstacleCompleteHandler(user, dataCmd);
                break;
            default:
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "MapHandler.handleClientRequest: Unknown command ID" + dataCmd.getId());
                break;
        }
    }

    @Override
    public void handleRequest(DataCmd dataCmd, User user) {
        short cmdId = dataCmd.getId();
        try {
            if (CmdDefine.BUILD_COMPLETE == cmdId) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "MapHandler: Routing to buildCompleteHandler for cmdId: " + cmdId);
                buildCompleteHandler(dataCmd, user);
            } else if (CmdDefine.MOVE_BUILDING == cmdId) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "MapHandler: Routing to moveBuildingHandler for cmdId: " + cmdId);
                moveBuildingHandler(user, dataCmd);
            } else if (CmdDefine.BUY_BUILDING_CONFIRM == cmdId) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "MapHandler: Routing to buyBuildingHandler for cmdId: " + cmdId);
                buyBuildingHandler(user, dataCmd);
            } else if (CmdDefine.BUY_BUILDING_CANCEL == cmdId) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "MapHandler: Routing to cancelBuyBuildingHandler for cmdId: " + cmdId);
                cancelBuyBuildingHandler(user, dataCmd);
            } else if (CmdDefine.UPGRADE_BUILDING == cmdId) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "MapHandler: Routing to upgradeBuildingHandler for cmdId: " + cmdId);
                upgradeBuildingHandler(user, dataCmd);

            } else {
                LoggerUtil.log(ExtensionLogLevel.WARN, "Unknown command ID in MapHandler: " + cmdId);
            }
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "Error handling request " + cmdId + ": " + e.getMessage(), e);
            throw new RuntimeException("Request handling failed for " + cmdId, e);
        }
    }

    /**
     * Handles build complete requests from clients
     * 
     * @param dataCmd The DataCmd object containing build complete request data
     * @param user    The user making the request
     */
    public void buildCompleteHandler(DataCmd dataCmd, User user) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "Processing build complete request for user: " + user.getName());
        try {
            RequestBuildComplete request = new RequestBuildComplete(dataCmd);
            MapService mapService = MapService.getInstance();
            boolean success = mapService.processBuildComplete(user, request);

            if (success) {
                ResponseBuildComplete response = ResponseBuildComplete.success(
                        request.getBuildingID(),
                        request.getBuildingIndex());
                ExtensionUtility.getExtension().send(response, user.getSession());

                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "Success response sent to user: {} for building: {}",
                        user.getName(), request.getBuildingID());
            }

            else {
                ResponseBuildComplete response = ResponseBuildComplete.actionInvalid();
                ExtensionUtility.getExtension().send(response, user.getSession());

                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "Failure response sent to user: {} for building: {}",
                        user.getName(), request.getBuildingID());
            }

        } catch (Exception e) {

            ResponseBuildComplete response = ResponseBuildComplete.serviceInvalid();
            ExtensionUtility.getExtension().send(response, user.getSession());

            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Error response sent to user: {} due to exception: {}",
                    user.getName(), e.getMessage());
        }
    }


    /**
     * Handles move building requests from clients
     * 
     * @param user    The user making the request
     * @param dataCmd The DataCmd object containing move building request data
     */
    public void moveBuildingHandler(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "Processing move building request for user: " + user.getName());

        try {
            RequestMoveBuilding request = new RequestMoveBuilding(dataCmd);
            MapService mapService = MapService.getInstance();
            MoveBuildingResult result = mapService.handleMoveBuilding(user, request);

            ResponseMoveBuilding response;
            if (result.isSuccess()) {
                response = ResponseMoveBuilding.success(
                        result.getBuildingIndex(),
                        result.getOldPositionX(),
                        result.getOldPositionY(),
                        result.getNewPositionX(),
                        result.getNewPositionY());

                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "Success response sent to user: {} for building index: {}, moved from ({}, {}) to ({}, {})",
                        user.getName(), result.getBuildingIndex(),
                        result.getOldPositionX(), result.getOldPositionY(),
                        result.getNewPositionX(), result.getNewPositionY());
            } else {
                response = ResponseMoveBuilding.actionInvalid(result.getMessage());

                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "Validation failure response sent to user: {} for building index: {}, reason: {}",
                        user.getName(), request.getBuildingIndex(), result.getMessage());
            }

            ExtensionUtility.getExtension().send(response, user.getSession());

        } catch (Exception e) {
            ResponseMoveBuilding response = ResponseMoveBuilding.serviceInvalid();
            ExtensionUtility.getExtension().send(response, user.getSession());

            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Service error response sent to user: {} due to exception: {}",
                    user.getName(), e.getMessage(), e);
        }
    }

    public void upgradeBuildingHandler(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "Processing upgrade building request for user: " + user.getName());

        try {

            RequestUpgradeBuilding request = new RequestUpgradeBuilding(dataCmd);
            MapService mapService = MapService.getInstance();
            UpgradeBuildingResult result = mapService.handleUpgradeBuilding(user, request);

            ResponseUpgradeBuilding response;
            if (result.isSuccess()) {
                response = ResponseUpgradeBuilding.success(
                        result.getBuildingTypeId(),
                        result.getBuildingIndex());

                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "Success response sent to user: {} for building type: {}, index: {}",
                        user.getName(), result.getBuildingTypeId(),
                        result.getBuildingIndex());
            } else {
                response = ResponseUpgradeBuilding.failure(result.getMessage());

                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "Failure response sent to user: {} for building type: {}, reason: {}",
                        user.getName(), request.getBuildingTypeId(), result.getMessage());
            }

        } catch (Exception e) {
            // Handle unexpected errors with a service failure response
            // ResponseBuildComplete response = ResponseBuildComplete.serviceInvalid();
            // ExtensionUtility.getExtension().send(response, user.getSession());

            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Service error response sent to user: {} due to exception: {}",
                    user.getName(), e.getMessage(), e);
        }
    }

    /**
     * Handles cancel building construction requests from clients
     * 
     * @param user    The user making the request
     * @param dataCmd The DataCmd object containing cancel building request data
     */
    public void cancelBuyBuildingHandler(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "Processing cancel building request for user: " + user.getName());

        try {
            RequestCancelBuyBuilding request = new RequestCancelBuyBuilding(dataCmd);
            MapService mapService = MapService.getInstance();
            CancelBuildingResult result = mapService.handleCancelBuilding(user, request);
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "Cancel building service call completed for user: {}, success: {}, message: {}",
                    user.getName(), result.isSuccess(), result.getMessage());

            // Create and send response based on the result
            ResponseCancelBuyBuilding response;
            if (result.isSuccess()) {
                response = ResponseCancelBuyBuilding.success(
                        result.getBuildingTypeId(),
                        request.getBuildingIndex(),
                        result.getRefundedGold(),
                        result.getRefundedOil());

                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "Successfully cancelled building" + result.getBuildingTypeId() + "for user: "  + user.getName()
                        + "refunded gold " + result.getRefundedGold() + "oil: " +  result.getRefundedOil(),
                        result.getBuildingTypeId(), user.getName(),
                        result.getRefundedGold(), result.getRefundedOil());
            } else {
                response = ResponseCancelBuyBuilding.failure(result.getMessage());
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "Failed to cancel building for user: {}, reason: {}",
                        user.getName(), result.getMessage());
            }

            ExtensionUtility.getExtension().send(response, user.getSession());
        } catch (Exception e) {
            ResponseUpgradeBuilding response = ResponseUpgradeBuilding
                    .serviceInvalid("Unexpected error: " + e.getMessage());
            ExtensionUtility.getExtension().send(response, user.getSession());

            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Service error in cancel building handler for user: {} due to exception: {}",
                    user.getName(), e.getMessage(), e);
        }
    }

    public void removeObstacleHandler(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "Processing remove obstacle request for user: " + user.getName());

        try {
            RequestRemoveObstacle request = new RequestRemoveObstacle(dataCmd);
            MapService mapService = MapService.getInstance();
            RemoveObstacleResult result = mapService.handleRemoveObstacle(user, request);
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "Remove obstacle service call completed for user:" + user.getName() + " success: " + result.isSuccess()
                            +  " message: " +  result.getMessage());
            ResponseRemoveObstacle response;
            if (result.isSuccess()) {
                response = ResponseRemoveObstacle.success(
                        result.getObstacleType(),
                        result.getObstacleIndex(),
                        result.getUsedGold(),
                        result.getUsedOil(),
                        result.getRemoveStartTime());

                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "Successfully start remove obstacle" + result.getObstacleType() +
                                "obstacle index: " + request.getObstacleIndex() +
                                 "cost gold " + result.getUsedGold() + " or oil: " +  result.getUsedOil());
            } else {
                response = ResponseRemoveObstacle.failure(result.getMessage());
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "Failed to remove obstacle reason: " + result.getMessage());
            }
            ExtensionUtility.getExtension().send(response, user.getSession());
        } catch (Exception e) {
            ResponseRemoveObstacle response = ResponseRemoveObstacle
                    .serviceInvalid("Unexpected error: " + e.getMessage());
            ExtensionUtility.getExtension().send(response, user.getSession());

            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Service error in cancel building handler for user: {} due to exception: {}",
                    user.getName(), e.getMessage(), e);
        }
    }

    public void removeObstacleCompleteHandler(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "Processing remove obstacle complete for user: " + user.getName());

        try {
            RequestRemoveObstacleComplete request = new RequestRemoveObstacleComplete(dataCmd);
            MapService mapService = MapService.getInstance();
            RemoveObstacleCompleteResult result = mapService.handleRemoveObstacleComplete(user, request);
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "Remove obstacle service call completed for user:" + user.getName() + " success: " + result.isSuccess()
                            +  " message: " +  result.getMessage());
            ResponseRemoveObstacleComplete response;
            if (result.isSuccess()) {
                response = ResponseRemoveObstacleComplete.success(
                        result.getObstacleType(),
                        request.getObstacleIndex());
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "Successfully start remove obstacle" + result.getObstacleType() +
                                "obstacle index: " + request.getObstacleIndex());
            } else {
                response = ResponseRemoveObstacleComplete.failure(result.getMessage());
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "Failed to remove obstacle reason: " + result.getMessage());
            }
            ExtensionUtility.getExtension().send(response, user.getSession());
        } catch (Exception e) {
            ResponseRemoveObstacleComplete response = ResponseRemoveObstacleComplete
                    .serviceInvalid("Unexpected error: " + e.getMessage());
            ExtensionUtility.getExtension().send(response, user.getSession());

            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Service error in cancel building handler for user: {} due to exception: {}",
                    user.getName(), e.getMessage(), e);
        }
    }

    /**
     * Handles buy building requests from clients
     * 
     * @param user    The user making the request
     * @param dataCmd The DataCmd object containing buy building request data
     */
    public void buyBuildingHandler(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "Processing buy building request for user: " + user.getName());

        try {
            RequestBuyBuilding request = new RequestBuyBuilding(dataCmd);
            MapService mapService = MapService.getInstance();
            BuyBuildingResult result = mapService.handleBuyBuilding(user, request);

            ResponseBuyBuilding response;
            if (result.isSuccess()) {
                response = ResponseBuyBuilding.success(
                        result.getBuildingId(),
                        result.getBuildingTypeId(),
                        result.getPositionX(),
                        result.getPositionY());

                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "Success response sent to user: {} for building: {} at position ({}, {})",
                        user.getName(), result.getBuildingTypeId(),
                        result.getPositionX(), result.getPositionY());
            } else {
                response = ResponseBuyBuilding.actionInvalid(result.getMessage());

                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "Validation failure response sent to user: {} for building type: {}, reason: {}",
                        user.getName(), request.getBuildingTypeId(), result.getMessage());
            }
            ExtensionUtility.getExtension().send(response, user.getSession());

        } catch (Exception e) {
            ResponseBuyBuilding response = ResponseBuyBuilding.serviceInvalid("Unexpected error: " + e.getMessage());
            ExtensionUtility.getExtension().send(response, user.getSession());

            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Service error response sent to user: {} due to exception: {}",
                    user.getName(), e.getMessage(), e);
        }
    }

    public void upgradeBuildingCompleteHandler(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "Processing upgrade building complete request for user: " + user.getName());

        try {
            RequestUpgradeBuildingComplete request = new RequestUpgradeBuildingComplete(dataCmd);
            MapService mapService = MapService.getInstance();
            UpgradeBuildingCompleteResult result = mapService.handleUpgradeBuildingComplete(user, request);

            ResponseUpgradeBuildingComplete response;
            if (result.isSuccess()) {
                response = ResponseUpgradeBuildingComplete.success(
                        result.getBuildingTypeId(),
                        result.getBuildingIndex());

                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "Success response sent to user: {} for building type: {}, index: {}",
                        user.getName(), result.getBuildingTypeId(),
                        result.getBuildingIndex());
            } else {
                response = ResponseUpgradeBuildingComplete.failure(result.getMessage());

                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "Failure response sent to user: {} , reason: {}",
                        user.getName(), result.getMessage());
            }
            ExtensionUtility.getExtension().send(response, user.getSession());
        } catch (Exception e) {
            ResponseUpgradeBuildingComplete response = ResponseUpgradeBuildingComplete
                    .serviceInvalid("Unexpected error: " + e.getMessage());
            ExtensionUtility.getExtension().send(response, user.getSession());

            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Service error response sent to user: {} due to exception: {}",
                    user.getName(), e.getMessage(), e);
        }
    }
}
