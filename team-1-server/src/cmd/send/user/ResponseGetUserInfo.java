package cmd.send.user;

import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import model.BarrackQueueInfo;
import model.PlayerInfo;
import model.enums.TroopTrainingSlot;
import util.LoggerUtil;

import java.nio.ByteBuffer;

public class ResponseGetUserInfo extends BaseMsg {
    /*
     * ResponseGetUserInfo Data Packet Format:
     * 
     * Basic PlayerInfo (8+ bytes):
     * - int playerInfoID (4 bytes)
     * - String playerInfoName (variable length with size prefix)
     * 
     * Player Data:
     * - int playerID (4 bytes)
     * - long sentServerTime (8 bytes)
     * - long logoutTime (8 bytes)
     * - String username (variable length with size prefix)
     * - int prestigePoint (4 bytes)
     * 
     * Resources (12 bytes):
     * - int gold (4 bytes)
     * - int oil (4 bytes)
     * - int gems (4 bytes)
     * 
     * Buildings:
     * - int buildingCount (4 bytes)
     * - For each building:
     * - int buildingIndex (4 bytes)
     * - String buildingID (variable length with size prefix)
     * - int level (4 bytes)
     * - int posX (4 bytes)
     * - int posY (4 bytes)
     * - String buildingState (variable length with size prefix)
     * - String type (variable length with size prefix)
     * * Troops:
     * - int troopCount (4 bytes)
     * - For each troop:
     * - int troopIndex (4 bytes)
     * - String troopID (variable length with size prefix)
     * - long stateStartingTime (8 bytes)
     * - String buildingType (8 bytes)
     * 
     * Obstacles:
     * - int obstacleCount (4 bytes)
     * - For each obstacle:
     * - int obstacleIndex (4 bytes)
     * - String obstacleID (variable length with size prefix)
     * - String type (variable length with size prefix)
     * - int posX (4 bytes)
     * - int posY (4 bytes)
     * - boolean isRemoved (1 byte)
     *
     * Player Maps:
     * - int mapCount (4 bytes)
     * - For each map:
     * - int mapIndex (4 bytes)
     * - int stars (4 bytes)
     * - int remainingGold (4 bytes)
     * - int remainingElixir (4 bytes)
     */
    public PlayerInfo info;

    public ResponseGetUserInfo(short error, PlayerInfo _info) {
        super(CmdDefine.GET_USER_INFO, error);
        info = _info;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        if (info != null) {
            // Basic PlayerInfo data
            bf.putInt(info.getID());
            putStr(bf, info.getName());

            // Get Player object from PlayerInfo
            model.Player player = info.getPlayer();
            if (player != null) {
                // Player basic data
                bf.putInt(player.getPlayerID());
                bf.putLong(player.getSentServerTime());
                bf.putLong(player.getLogoutTime());
                putStr(bf, player.getUsername());
                bf.putInt(player.getPrestigePoint());

                // Resources
                model.Resources resources = player.getResources();
                if (resources != null) {
                    bf.putInt(resources.getGold());
                    bf.putInt(resources.getOil());
                    bf.putInt(resources.getGems());
                } else {
                    // Default values if no resources
                    bf.putInt(0); // gold
                    bf.putInt(0); // oil
                    bf.putInt(0); // gems
                }

                // Buildings
                java.util.List<model.building.Building> buildings = player.getBuildings();
                if (buildings != null) {
                    bf.putInt(buildings.size());
                    for (model.building.Building building : buildings) {
                        bf.putInt(building.getBuildingIndex());
                        putStr(bf, building.getBuildingID());
                        bf.putInt(building.getLevel());

                        // Position
                        model.util.Position position = building.getPosition();
                        if (position != null) {
                            bf.putInt(position.getX());
                            bf.putInt(position.getY());
                        } else {
                            bf.putInt(0);
                            bf.putInt(0);
                        }

                        // Building state
                        putStr(bf, building.getBuildingState().toString());
                        bf.putLong(building.getStateStartingTime());
                        putStr(bf, building.getType());
                    }
                } else {
                    bf.putInt(0); // no buildings

                }
                java.util.List<BarrackQueueInfo> barrackQueues = new java.util.ArrayList<>();
                if (buildings != null) {
                    for (model.building.Building building : buildings) {
                        if (building instanceof model.building.Barrack) {
                            model.building.Barrack barrack = (model.building.Barrack) building;
                            // Only add it to the list if the queue is not empty
                            if (barrack.getTrainingQueue() != null && !barrack.getTrainingQueue().isEmpty()) {
                                barrackQueues.add(new BarrackQueueInfo(
                                        barrack.getBuildingIndex(),
                                        barrack.getStateStartingTime(),
                                        barrack.getTrainingQueue()
                                ));
                            }
                        }
                    }
                }

                // 2. Serialize this new list into the byte buffer.
                bf.putInt(barrackQueues.size());
                for (BarrackQueueInfo queueInfo : barrackQueues) {
                    bf.putInt(queueInfo.buildingIndex);
                    bf.putLong(queueInfo.startTime);

                    // Serialize the queue itself
                    bf.putInt(queueInfo.trainingQueue.size());
                    for (model.enums.TroopTrainingSlot slot : queueInfo.trainingQueue) {
                        putStr(bf, slot.getTroopType());
                        bf.putInt(slot.getTroopAmount());
                    }
                }

                // Troops
                java.util.List<TroopTrainingSlot> army = player.getArmy();
                if (army != null) {
                    bf.putInt(army.size());
                    for (TroopTrainingSlot troop : army) {
                        putStr(bf, troop.getTroopType());
                        bf.putInt(troop.getTroopAmount());
                    }
                } else {
                    bf.putInt(0); // no troops
                }

                // Obstacles
                java.util.List<model.Obstacle> obstacles = player.getObstacles();
                if (obstacles != null) {
                    bf.putInt(obstacles.size());
                    for (model.Obstacle obstacle : obstacles) {
                        bf.putInt(obstacle.getObstacleIndex());
                        putStr(bf, obstacle.getObstacleID());
                        putStr(bf, obstacle.getType());

                        // Position
                        model.util.Position position = obstacle.getPosition();
                        if (position != null) {
                            bf.putInt(position.getX());
                            bf.putInt(position.getY());
                        } else {
                            bf.putInt(0);
                            bf.putInt(0);
                        }

                        // isRemoved flag
                        bf.put((byte) (obstacle.isRemoved() ? 1 : 0));
                    }
                } else {
                    bf.putInt(0); // no obstacles
                }

                // Player Maps
                java.util.List<model.PlayerMapData> playerMaps = player.getPlayerMaps();
                if (playerMaps != null) {
                    bf.putInt(playerMaps.size());
                    for (model.PlayerMapData mapData : playerMaps) {
                        bf.putInt(mapData.getMapIndex());
                        bf.putInt(mapData.getStars());
                        config.data.DungeonResource dungeonResources = mapData.getRemainingResources();
                        if (dungeonResources != null) {
                            bf.putInt(dungeonResources.getGold());
                            bf.putInt(dungeonResources.getElixir());
                        } else {
                            bf.putInt(0);
                            bf.putInt(0);
                        }
                    }
                } else {
                    bf.putInt(0); // no player maps
                }
            } else {
                // Default values if no player data
                bf.putInt(0); // playerID
                bf.putLong(0); // logoutTime
                putStr(bf, ""); // username
                bf.putInt(0); // prestigePoint

                // Default resources
                bf.putInt(0); // gold
                bf.putInt(0); // oil
                bf.putInt(0); // gems // No buildings
                bf.putInt(0);

                // No troops
                bf.putInt(0);

                // No obstacles
                bf.putInt(0);
            }
        }
        return packBuffer(bf);
    }

}