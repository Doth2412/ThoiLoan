package dispatcher.handlers;

import bitzero.util.ExtensionUtility;
import cmd.ErrorConst;
import cmd.receive.battle.RequestBattleResult;
import cmd.receive.battle.RequestFindBattle;
import cmd.receive.battle.RequestPVPBattleResult;
import cmd.send.battle.ResponseBattleResult;
import cmd.send.battle.ResponseFindBattle;
import cmd.send.battle.ResponsePVPBattleResult;
import model.Player;
import model.result.BattleResult;
import model.result.PVPBattleResult;
import service.BattleService;
import service.PvpBattleService;
import util.LoggerUtil;
import bitzero.server.entities.User;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.DataCmd;
import cmd.CmdDefine;

public class BattleHandler extends BaseClientRequestHandler implements RequestHandler {
    @Override
    public void handleClientRequest(User user, DataCmd dataCmd) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "MapHandler.handleClientRequest called for user: {}, command ID: {}",
                user.getName(), dataCmd.getId());
        switch (dataCmd.getId()) {
            case CmdDefine.BATTLE_RESULT:
                BattleResultHandler(dataCmd, user);
                break;
            case CmdDefine.FIND_BATTLE:
                FindBattleHandler(dataCmd, user);
                break;
            case CmdDefine.PVP_BATTLE_RESULT:
                PVPBattleResultHandler(dataCmd, user);
                break;

            default:
                LoggerUtil.log(ExtensionLogLevel.WARN,
                        "BattleHandler.handleClientRequest: Unknown command ID"
                                + dataCmd.getId());
                break;
        }
    }

    @Override
    public void handleRequest(DataCmd dataCmd, User user) {
        short cmdId = dataCmd.getId();
        try {
            if (CmdDefine.BATTLE_RESULT == cmdId) {
                LoggerUtil.log(ExtensionLogLevel.INFO,
                        "MapHandler: Routing to buildCompleteHandler for cmdId: " + cmdId);
                BattleResultHandler(dataCmd, user);
            } else {
                LoggerUtil.log(ExtensionLogLevel.WARN, "Unknown command ID in MapHandler: " + cmdId);
            }
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "Error handling request " + cmdId + ": " + e.getMessage(), e);
            throw new RuntimeException("Request handling failed for " + cmdId, e);
        }
    }

    private void BattleResultHandler(DataCmd dataCmd, User user) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "BattleResultHandler called for user: {}, command ID: {}",
                user.getName(), dataCmd.getId());
        RequestBattleResult request = new RequestBattleResult(dataCmd);
        BattleResult result;
        result = BattleService.getInstance().processBattleResult(user, request);

        ResponseBattleResult response;
        if (result.isSuccess()) {
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "BattleResultHandler: Battle result processed successfully for user: {}",
                    user.getName());
            response = ResponseBattleResult.success();
        } else {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "BattleResultHandler: Failed to process battle result for user: {}, error: {}",
                    user.getName(), result.getErrorMessage());
            response = ResponseBattleResult.failure(result.getErrorMessage());
        }
        ExtensionUtility.getExtension().send(response, user.getSession());

    }

    private void PVPBattleResultHandler(DataCmd dataCmd, User user) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "BattleResultHandler called for user: {}, command ID: {}",
                user.getName(), dataCmd.getId());
        RequestPVPBattleResult request = new RequestPVPBattleResult(dataCmd);
        PVPBattleResult result;
        result = PvpBattleService.getInstance().processBattleResult(user, request);

        ResponsePVPBattleResult response;
        if (result.isSuccess()) {
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "BattleResultHandler: Battle result processed successfully for user: {}",
                    user.getName());
            response = ResponsePVPBattleResult.success(result.getLootedGold(), result.getLootedElixir());
        } else {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "BattleResultHandler: Failed to process battle result for user: {}, error: {}",
                    user.getName(), result.getErrorMessage());
            response = ResponsePVPBattleResult.failure(result.getErrorMessage());
        }
        ExtensionUtility.getExtension().send(response, user.getSession());

    }

    private void FindBattleHandler(DataCmd dataCmd, User user) {
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "findBattleHandler called for user: {}, command ID: {}",
                user.getName(), dataCmd.getId());
        RequestFindBattle request = new RequestFindBattle(dataCmd);
        Player opponent = PvpBattleService.getInstance().findOpponent(user, request);

        ResponseFindBattle response;
        if (opponent != null) {
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "findBattleHandler: Opponent found for user: {}",
                    user.getName());
            response = new ResponseFindBattle(ErrorConst.SUCCESS, opponent);
        } else {
            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "findBattleHandler: No opponent found for user: {}",
                    user.getName());
            response = new ResponseFindBattle(ErrorConst.ACTION_INVALID, null);
        }
        ExtensionUtility.getExtension().send(response, user.getSession());
    }

}
