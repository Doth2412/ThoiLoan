// PlayerData.js (New File - Optional, PlayerDataManager.getInstance() can also be used directly)
var PlayerData = cc.Class.extend({
    ctor: function () {
        // Basic PlayerInfo
        this.playerInfoID = 0;
        this.playerInfoName = "";
        
        // Player Data
        this.playerId = 0;
        this.sentServerTime = 0;
        this.logoutTime = 0;

        this.username = "";
        this.prestigePoint = 0;
        
        // Resources
        this.gold = 0;
        this.oil = 0;
        this.gem = 0;
        
        // Map/Game data
        this.builderNumber = 0;
        this.buildings = [];
        this.obstacles = [];
        
        // Troops
        this.army = [];
        
        // Player Maps
        this.playerMaps = [];

        // Legacy name field (for backwards compatibility)
        this.name = "";
    },
});

