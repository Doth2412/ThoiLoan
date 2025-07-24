var ConfigParser = cc.Class.extend({
    ctor: function () {
        this.configs = {};
        this.configFiles = [
            'ArmyCamp',
            'Barrack',
            'BuilderHut',
            'ClanCastle',
            'Defence',
            'DefenceBattle',
            'InitGame',
            'Laboratory',
            'Obstacle',
            'Resource',
            'Storage',
            'TownHall',
            'TownHallRequire',
            'Troop',
            'TroopBase',
            'Wall'

        ];
        this.loadAllConfigs();
    },
    loadAllConfigs: function () {
        var self = this;
        this.configFiles.forEach(function (configName) {
            try {
                var jsonPath = "res/Config/" + configName + ".json";
                var jsonStr = jsb.fileUtils.getStringFromFile(jsonPath);
                self.configs[configName] = JSON.parse(jsonStr);
            } catch (error) {
                cc.error("Failed to load config: " + configName, error);
            }
        });
    },

    getConfig: function (configName) {
        if (this.configs[configName]) {
            return this.configs[configName];
        }
        cc.warn("Config not found: " + configName);
        return null;
    },
});

var configParser = null;
ConfigParser.getInstance = function () {
    if (!configParser) {
        configParser = new ConfigParser();
    }
    return configParser;
};