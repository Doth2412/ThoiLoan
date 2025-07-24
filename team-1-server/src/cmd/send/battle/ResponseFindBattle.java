package cmd.send.battle;

import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import model.Player;
import util.LoggerUtil;

import java.nio.ByteBuffer;

public class ResponseFindBattle extends BaseMsg {
    private boolean success;
    private String message;
    private Player opponent;

    public ResponseFindBattle(short error, Player opponent) {
        super(CmdDefine.FIND_BATTLE, error);
        this.opponent = opponent;
        this.success = (error == 0);
        this.message = (error == 0) ? "Success" : "Failure";
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();

        bf.put((byte) (success ? 1 : 0));
        putStr(bf, message);

        if (success && opponent != null) {
            putStr(bf, opponent.getUsername());
            bf.putInt(opponent.getResources().getGold());
            bf.putInt(opponent.getResources().getOil());
            bf.putInt(opponent.getResources().getGems());
            bf.putInt(opponent.getPrestigePoint());
            // Buildings
            bf.putInt(opponent.getBuildings().size());
            for (model.building.Building building : opponent.getBuildings()) {
                putStr(bf, building.getBuildingID());
                bf.putInt(building.getLevel());
                bf.putInt(building.getPosition().getX());
                bf.putInt(building.getPosition().getY());
            }

            // Obstacles
            bf.putInt(opponent.getObstacles().size());
            for (model.Obstacle obstacle : opponent.getObstacles()) {
                putStr(bf, obstacle.getObstacleID());
                bf.putInt(obstacle.getPosition().getX());
                bf.putInt(obstacle.getPosition().getY());
            }
        }

        LoggerUtil.log(ExtensionLogLevel.INFO,
                String.format("ResponseBattleResult: Created response with success=%s, message='%s', playerMaps=%s",
                        success, message, opponent.getUsername()));

        return packBuffer(bf);
    }
}
