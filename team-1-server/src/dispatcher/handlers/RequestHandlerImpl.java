package dispatcher.handlers;

import util.LoggerUtil;

import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.DataCmd;
import bitzero.server.entities.User;
import bitzero.util.common.business.Debug;
import cmd.CmdDefine;

public class RequestHandlerImpl implements RequestHandler {
    private AuthHandler authHandler;
    private MapHandler mapHandler;
    private ResourceHandler resourceHandler;
    private ShopHandler shopHandler;
    private TroopHandler troopHandler;
    private BattleHandler battleHandler;

    public RequestHandlerImpl() {
        this.authHandler = new AuthHandler();
        this.mapHandler = new MapHandler();
        this.resourceHandler = new ResourceHandler();
        this.shopHandler = new ShopHandler();
        this.troopHandler = new TroopHandler();
        this.battleHandler = new BattleHandler();
    }

    @Override
    public void handleRequest(DataCmd dataCmd, User user) {
        LoggerUtil.log(ExtensionLogLevel.WARN,
                String.format("Routing requestType: %s for player %s", dataCmd.getId(), user.getId()));
        Debug.warn("Routing requestType: " + dataCmd.getId() + " for player " + user.getId());
        switch (dataCmd.getId()) {
            // AuthHandler Cases
            case CmdDefine.CUSTOM_LOGIN:
                this.authHandler.loginHandler(dataCmd, user);
                break;
            case CmdDefine.LOGOUT:
                this.authHandler.logoutHandler(user);
                break;
            case CmdDefine.GET_USER_INFO:
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        String.format("RequestHandlerImpl: Routing to getUserInfoHandler for player %s, command ID %s",
                                user.getId(), dataCmd.getId()));
                this.authHandler.getUserInfoHandler(user);
                break;
            // // MapHandler Cases
            // case 2001:
            // this.mapHandler.initMapHandler(request.getData(), player);
            // break;
            // case "placeBuilding":
            // this.mapHandler.placeBuildingHandler(request.getData(), player);
            // break;
            // case "moveBuilding":
            // this.mapHandler.moveBuildingHandler(request.getData(), player);
            // break;
            // case "upgradeBuilding":
            // this.mapHandler.upgradeBuildingHandler(request.getData(), player);
            // break;
            // case "cancelBuildingAction":
            // this.mapHandler.cancelBuildingActionHandler(request.getData(), player);
            // break;
            // case "removeObstacle":
            // this.mapHandler.removeObstacleHandler(request.getData(), player);
            // break;

            // // ResourceHandler Cases
            // case "harvestResource":
            // this.resourceHandler.harvestResourceHandler(request.getData(), player);
            // break;
            // case "getResource":
            // this.resourceHandler.getResourceHandler(request.getData(), player);
            // break;
            // case "addResource":
            // this.resourceHandler.addResourceHandler(request.getData(), player);
            // break;
            // case "deduceResource":
            // this.resourceHandler.deduceResourceHandler(request.getData(), player);
            // break;

            // // ShopHandler Cases
            // case "getShopData":
            // this.shopHandler.GetShopDataHandler(request.getData(), player);
            // break;
            // case "purchaseItem":
            // this.shopHandler.PurchaseItemHandler(request.getData(), player);
            // break;

            // // TroopHandler Cases
            // case "trainTroop":
            // this.troopHandler.trainTroopHandler(request.getData(), player);
            // break;
            // case "cancelTraining":
            // this.troopHandler.cancelTrainingHandler(request.getData(), player);
            // break;
            // case "finishTraining":
            // this.troopHandler.finishTraining(request.getData(), player);
            // break;
            // case "finishTrainingInstantly":
            // this.troopHandler.finishTrainingInstantly(request.getData(), player);
            // break;
            // case "getTrainingStatus":
            // this.troopHandler.getTrainingStatusHandler(request.getData(), player);
            // break;

            // // BattleHandler Cases
            // case "searchOpponent":
            // this.battleHandler.searchOpponentHandler(request.getData(), player);
            // break;
            // case "startAttack":
            // this.battleHandler.startAttackHandler(request.getData(), player);
            // break;
            // case "deployTroop":
            // this.battleHandler.deployTroopHandler(request.getData(), player);
            // break;
            // case "endAttack":
            // this.battleHandler.endAttackHandler(request.getData(), player);
            // break;

            default:
                LoggerUtil.log(ExtensionLogLevel.ERROR, String.format("Unknown requestType: %s", dataCmd.getId()));
                // Optionally, throw an error or send an error response
                break;
        }
    }
}
