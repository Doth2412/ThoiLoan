package cmd.send.user;

import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import config.data.AllGameConfigsPayload;
import util.LoggerUtil;

import com.google.gson.Gson;

import java.nio.ByteBuffer;
import java.util.logging.Logger;

public class ResponseReceiveConfig extends BaseMsg {
    /*
     * ResponseReceiveConfig Data Packet Format
     * --------------------------------------
     * This packet contains all game configurations serialized as a JSON string.
     * 
     * Binary Format:
     * - 4 bytes: Total packet size (added by packBuffer)
     * - 2 bytes: JSON string length prefix
     * - N bytes: JSON string containing AllGameConfigsPayload
     * 
     * JSON Structure:
     * {
     * "buildingConfig": { // Building configurations
     * "townHall": { ... }, // TownHall.json
     * "defences": { ... }, // Defence.json
     * "resources": { ... }, // Resource.json
     * "storage": { ... }, // Storage.json
     * "army": { // Army related buildings
     * "barracks": { ... }, // Barrack.json
     * "armyCamps": { ... }, // ArmyCamp.json
     * "clanCastle": { ... } // ClanCastle.json
     * },
     * "walls": { ... }, // Wall.json
     * "obstacles": { ... } // Obstacle.json
     * },
     * "dungeonConfig": { // Dungeon system configurations
     * "levels": [ ... ], // Array of dungeon levels
     * "rewards": { ... } // Dungeon rewards
     * },
     * "troopConfig": { // Troop configurations
     * "baseStats": { ... }, // TroopBase.json - Base stats for troops
     * "upgrades": { ... }, // Troop.json - Upgrade paths and costs
     * "training": { // Training requirements
     * "costs": { ... },
     * "times": { ... }
     * }
     * },
     * "resourceConfig": { // Resource system configurations
     * "types": [ ... ], // Available resource types
     * "generation": { ... }, // Resource generation rates
     * "capacities": { ... } // Storage capacities
     * },
     * "initGameConfig": { // Initial game settings from InitGame.json
     * "startingResources": { ... }, // Resources given to new players
     * "townHallRequirements": {...},// From TownHallRequire.json
     * "playerData": { // Initial player settings
     * "level": number,
     * "gems": number,
     * "shield": number
     * }
     * }
     * }
     * 
     * Note: This configuration is sent to clients during initialization and
     * contains all the static game data needed for client operation. The data
     * is loaded from JSON files in the conf/Config json/ directory.
     */

    private AllGameConfigsPayload configPayload;
    private static final Gson gson = new Gson();

    public ResponseReceiveConfig(short error, AllGameConfigsPayload configPayload) {
        super(CmdDefine.RECEIVE_CONFIG, error);
        this.configPayload = configPayload;
    }

    @Override
    public byte[] createData() {
        try {
            // Pre-serialize to calculate size
            String configJson = configPayload != null ? gson.toJson(configPayload) : "{}";

            // LoggerUtil.log(ExtensionLogLevel.INFO, "Game Configuration JSON:\n" +
            // configJson);

            byte[] jsonBytes = configJson.getBytes("UTF-8");

            // Calculate required buffer size (json length + size prefix)
            int requiredSize = jsonBytes.length + 2;
            ByteBuffer bf = ByteBuffer.allocate(requiredSize + 4);

            putStr(bf, configJson);
            return packBuffer(bf);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create response data: " + e.getMessage(), e);
        }
    }
}
