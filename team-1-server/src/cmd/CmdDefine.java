package cmd;

public class CmdDefine {
    public static final short CUSTOM_LOGIN = 3;
    public static final short LOGOUT = 2;
    public static final short USER_MULTI_IDS = 1000;
    public static final short GET_USER_INFO = 1001;
    public static final short INIT_MAP = 1002;
    public static final short RECEIVE_CONFIG = 1003;

    // Multi-device login notification
    public static final short MULTI_DEVICE_LOGIN_NOTIFICATION = 1100;

    public static final short MAP_MULTI_IDS = 2000;
    public static final short BUILD_COMPLETE = 2001;
    public static final short MOVE_BUILDING = 2002;
    public static final short BUY_BUILDING_CONFIRM = 2003;
    public static final short BUY_BUILDING_CANCEL = 2004;
    public static final short UPGRADE_BUILDING = 2005;
    public static final short UPGRADE_BUILDING_COMPLETE = 2006;
    public static final short REMOVE_OBSTACLE = 2007;
    public static final short REMOVE_OBSTACLE_COMPLETE = 2008;

    public static final short RESOURCE_MULTI_IDS = 3000;
    public static final short HARVEST_RESOURCE = 3001;
    public static final short USE_G = 3002;

    public static final short TROOP_MULTI_IDS = 4000;
    public static final short UPDATE_BARRACK_QUEUE = 4001;
    public static final short UPDATE_PLAYER_ARMY = 4002;

    public static final short BATTLE_MULTI_IDS = 5000;
    public static final short BATTLE_RESULT = 5010;
    public static final short FIND_BATTLE = 5011;

    public static final short PVP_BATTLE_RESULT = 5020;

}
