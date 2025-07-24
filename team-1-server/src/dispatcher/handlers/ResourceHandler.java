package dispatcher.handlers;

import cmd.CmdDefine;
import cmd.receive.resources.RequestHarvestResource;
import cmd.receive.resources.RequestUseG;
import cmd.send.resources.ResponseHarvestResource;
import cmd.send.resources.ResponseUseG;
import model.result.UseGResult;
import service.ResourceService;
import util.LoggerUtil;
import util.server.ServerConstant;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.DataCmd;
import bitzero.server.entities.User;
import bitzero.util.ExtensionUtility;
import model.result.HarvestResourceResult;
import model.PlayerInfo;
import model.Resources;
import model.building.ResourceGenerator;
import model.building.Building;

/**
 * Handles resource-related requests including harvesting and resource
 * management
 * Implements RequestHandler interface to integrate with CentralDispatcher
 */
public class ResourceHandler extends BaseClientRequestHandler implements RequestHandler {
    @Override
    public void handleClientRequest(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "ResourceHandler.handleClientRequest called for user: {}, command ID: {}",
                user.getName(), dataCmd.getId());
        switch (dataCmd.getId()) {
            case CmdDefine.HARVEST_RESOURCE:
                harvestResourceHandler(user, dataCmd);
                break;
            case CmdDefine.USE_G:
                useGHandler(user, dataCmd);
                break;
            default:
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "ResourceHandler.handleClientRequest: Unknown command ID {} for user {}",
                        dataCmd.getId(), user.getName());
                break;
        }
    }

    @Override
    public void handleRequest(DataCmd dataCmd, User user) {
        short cmdId = dataCmd.getId();
        try {
            if (CmdDefine.HARVEST_RESOURCE == cmdId) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "ResourceHandler: Routing to harvestResourceHandler for cmdId: " + cmdId);
                harvestResourceHandler(user, dataCmd);
            }
            else if(CmdDefine.USE_G == cmdId){
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "ResourceHandler: Routing to useGHandler for cmdId: " + cmdId);
                useGHandler(user, dataCmd);
            }else {
                LoggerUtil.log(ExtensionLogLevel.WARN, "Unknown command ID in ResourceHandler: " + cmdId);
            }
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "Error handling request " + cmdId + ": " + e.getMessage(), e);
            throw new RuntimeException("Request handling failed for " + cmdId, e);
        }
    }

    /**
     * Handles resource harvesting requests from clients
     * Coordinates with ResourceService to process the harvest operation
     * 
     * @param user    The user making the request
     * @param dataCmd The DataCmd object containing harvest request data
     */
    public void harvestResourceHandler(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "Processing harvest resource request for user: " + user.getName());

        try {
            RequestHarvestResource request = new RequestHarvestResource(dataCmd);
            ResourceService resourceService = ResourceService.getInstance();
            HarvestResourceResult result = resourceService.processHarvestResource(user, request);

            ResponseHarvestResource response;
            if (result.isSuccess()) {
                PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
                Resources updatedResources = playerInfo.getPlayer().getResources();
                ResourceGenerator generator = null;

                for (Building building : playerInfo.getPlayer().getBuildings()) {
                    if (building.getBuildingIndex() == request.getBuildingIndex()) {
                        generator = (ResourceGenerator) building;
                        break;
                    }
                }

                long nextHarvestTime = System.currentTimeMillis() +
                        (long) ((generator.getCapacity() * 0.01) / generator.getProductionRate() * 1000);
                response = ResponseHarvestResource.success(
                        request.getBuildingIndex(),
                        result.getResourceAmount(),
                        result.getResourceType(),
                        result.getHarvestTime(),
                        updatedResources,
                        nextHarvestTime);

                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "Success response sent to user: {}, harvested {} {} from building index: {}",
                        user.getName(), result.getResourceAmount(),
                        result.getResourceType(), request.getBuildingIndex());
            } else {
                response = ResponseHarvestResource.validationFailure(result.getMessage());
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "Validation failure response sent to user: {} for building index: {}, reason: {}",
                        user.getName(), request.getBuildingIndex(), result.getMessage());
            }

            ExtensionUtility.getExtension().send(response, user.getSession());
        } catch (Exception e) {
            ResponseHarvestResource response = ResponseHarvestResource.serviceInvalid();
            ExtensionUtility.getExtension().send(response, user.getSession());
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Service error response sent to user: {} due to exception: {}",
                    user.getName(), e.getMessage(), e);
        }
    }

    public void useGHandler(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "Processing use G request for user: " + user.getName());

        try {
            RequestUseG request = new RequestUseG(dataCmd);
            ResourceService resourceService = ResourceService.getInstance();
            UseGResult result = resourceService.processUseG(user, request);

            ResponseUseG response;
            if (result.isSuccess()) {
                PlayerInfo playerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
                Resources updatedResources = playerInfo.getPlayer().getResources();
                response = ResponseUseG.success(
                        result.getUsedAmount(),
                        result.getResourceType(),
                        updatedResources);

                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "Success response sent to user: {}, harvested {} {} from building index: {}",
                        user.getName(), result.getUsedAmount());
            } else {
                response = ResponseUseG.validationFailure(result.getMessage());
            }

            ExtensionUtility.getExtension().send(response, user.getSession());
        } catch (Exception e) {
            ResponseUseG response = ResponseUseG.serviceInvalid();
            ExtensionUtility.getExtension().send(response, user.getSession());
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Service error response sent to user: {} due to exception: {}",
                    user.getName(), e.getMessage(), e);
        }
    }

}
