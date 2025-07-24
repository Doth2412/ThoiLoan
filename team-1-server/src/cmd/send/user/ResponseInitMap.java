package cmd.send.user;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import config.data.InitGameConfig;
import config.data.BuildingLocationData;
import config.data.ObstacleData;
import config.data.PlayerData;
import model.PlayerInfo;

import java.nio.ByteBuffer;
import java.util.Map;

public class ResponseInitMap extends BaseMsg {
    public InitGameConfig initConfig;
    public PlayerInfo info;

    public ResponseInitMap(short error, InitGameConfig _initConfig, PlayerInfo _info) {
        super(CmdDefine.INIT_MAP, error);
        info = _info;
        initConfig = _initConfig;
    }

    @Override
    public byte[] createData() {
        /*
         * InitMap Data Packet Format:
         * 
         * Player Data (16 bytes):
         * - int gold (4 bytes)
         * - int oil (4 bytes)
         * - int gem (4 bytes)
         * - int builderNumber (4 bytes)
         * 
         * Building Locations:
         * - int buildingCount (4 bytes)
         * - For each building:
         * - String buildingName (variable length with size prefix)
         * - int posX (4 bytes)
         * - int posY (4 bytes)
         * * Obstacle Data:
         * - int obstacleCount (4 bytes)
         * - For each obstacle:
         * - int obstacleIndex (4 bytes)
         * - String obstacleID (variable length with size prefix)
         * - String type (variable length with size prefix)
         * - int posX (4 bytes)
         * - int posY (4 bytes)
         * - boolean isRemoved (1 byte)
         */
        ByteBuffer bf = makeBuffer();
        if (info != null) {
            bf.putInt(info.getID());
        }
        if (initConfig != null) {
            // Pack player data
            PlayerData playerData = initConfig.getPlayerData();
            if (playerData != null) {
                bf.putInt(playerData.getGold());
                bf.putInt(playerData.getOil());
                bf.putInt(playerData.getGem());
                bf.putInt(playerData.getBuilderNumber());
            } else {
                // Default values if no player data
                bf.putInt(0); // gold
                bf.putInt(0); // oil
                bf.putInt(0); // gem
                bf.putInt(0); // builderNumber
            } // Pack building locations - use player's actual building positions if
              // available,
            // otherwise fall back to default positions from config
            if (info != null && info.getPlayer() != null && info.getPlayer().getBuildings() != null) {
                // Use actual player building positions (for existing players or new players
                // with initialized buildings)
                java.util.List<model.building.Building> playerBuildings = info.getPlayer().getBuildings();
                bf.putInt(playerBuildings.size());
                for (model.building.Building building : playerBuildings) {
                    putStr(bf, building.getBuildingID()); // building ID
                    model.util.Position position = building.getPosition();
                    if (position != null) {
                        bf.putInt(position.getX());
                        bf.putInt(position.getY());
                    } else {
                        // Fallback to (0,0) if position is null
                        bf.putInt(0);
                        bf.putInt(0);
                    }
                }
            } else {
                // Fallback to default building locations from config (for new players without
                // initialized buildings)
                Map<String, BuildingLocationData> buildings = initConfig.getBuildingLocations();
                if (buildings != null) {
                    bf.putInt(buildings.size());
                    for (Map.Entry<String, BuildingLocationData> entry : buildings.entrySet()) {
                        putStr(bf, entry.getKey()); // building name
                        BuildingLocationData location = entry.getValue();
                        bf.putInt(location.getPosX());
                        bf.putInt(location.getPosY());
                    }
                } else {
                    bf.putInt(0); // no buildings
                }
            } // Pack obstacle data - use player's actual obstacles if available,
            // otherwise fall back to default obstacles from config
            if (info != null && info.getPlayer() != null && info.getPlayer().getObstacles() != null) {
                // Use actual player obstacle state (for existing players or new players with
                // initialized obstacles)
                java.util.List<model.Obstacle> playerObstacles = info.getPlayer().getObstacles();
                bf.putInt(playerObstacles.size());
                for (model.Obstacle obstacle : playerObstacles) {
                    bf.putInt(obstacle.getObstacleIndex());
                    putStr(bf, obstacle.getObstacleID());
                    putStr(bf, obstacle.getType());
                    model.util.Position position = obstacle.getPosition();
                    if (position != null) {
                        bf.putInt(position.getX());
                        bf.putInt(position.getY());
                    } else {
                        // Fallback to (0,0) if position is null
                        bf.putInt(0);
                        bf.putInt(0);
                    }
                    // Pack isRemoved flag
                    bf.put((byte) (obstacle.isRemoved() ? 1 : 0));
                }
            } else {
                // Fallback to default obstacle locations from config (for new players without
                // initialized obstacles)
                Map<Integer, ObstacleData> obstacles = initConfig.getObstacleData();
                if (obstacles != null) {
                    bf.putInt(obstacles.size());
                    for (Map.Entry<Integer, ObstacleData> entry : obstacles.entrySet()) {
                        bf.putInt(entry.getKey()); // obstacle key as index
                        putStr(bf, entry.getValue().getType() + "_" + entry.getKey()); // obstacleID
                        putStr(bf, entry.getValue().getType()); // type
                        ObstacleData obstacle = entry.getValue();
                        bf.putInt(obstacle.getPosX());
                        bf.putInt(obstacle.getPosY());
                        bf.put((byte) 0); // isRemoved = false for new obstacles
                    }
                } else {
                    bf.putInt(0); // no obstacles
                }
            }
        }

        return packBuffer(bf);
    }
}
