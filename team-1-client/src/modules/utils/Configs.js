var Configs = cc.Class.extend({
    ctor: function () {
        var configParser = ConfigParser.getInstance();

        this.ArmyCamp = configParser.getConfig('ArmyCamp');
        this.Barrack = configParser.getConfig('Barrack');
        this.BuilderHut = configParser.getConfig('BuilderHut');
        this.ClanCastle = configParser.getConfig('ClanCastle');
        this.Defence = configParser.getConfig('Defence');
        this.DefenceBattle = configParser.getConfig('DefenceBattle');
        this.InitGame = configParser.getConfig('InitGame');
        this.Laboratory = configParser.getConfig('Laboratory');
        this.Obstacle = configParser.getConfig('Obstacle');
        this.Resource = configParser.getConfig('Resource');
        this.Storage = configParser.getConfig('Storage');
        this.TownHall = configParser.getConfig('TownHall');
        this.TownHallRequire = configParser.getConfig('TownHallRequire');
        this.Troop = configParser.getConfig('Troop');
        this.TroopBase = configParser.getConfig('TroopBase');
        this.Wall = configParser.getConfig('Wall');
    },

    getTrainingTime: function (troopType) {
        return this.TroopBase[troopType].trainingTime;
    },

    getHousingSpace: function (troopType) {
        return this.TroopBase[troopType].housingSpace;
    }
});


var configs = null;

Configs.getInstance = function () {
    if (!configs) {
        configs = new Configs();
    }
    return configs;
};
