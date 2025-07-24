var ItemConfigUtils = {
    getBuildingConfig: function (building, level = 1) {
        if (!building || !building.buildingType) {
            cc.log("Item data" + building)
            cc.log("ItemConfigUtils: Invalid item data or configs not available");
            return null;
        }

        const configMappings = {
            // Resources
            "RES": gv.configs.Resource,
            "STO": gv.configs.Storage,
            "DEF": gv.configs.Defence,
            "TOW": gv.configs.TownHall,
            "BAR": gv.configs.Barrack,
            "AMC": gv.configs.ArmyCamp,
            "CLC": gv.configs.ClanCastle,
            "LAB": gv.configs.Laboratory,
            "OBS": gv.configs.Obstacle,
            "WAL": gv.configs.Wall,
            "BDH": gv.configs.BuilderHut
        };

        // Extract prefix from item ID (first 3 characters)
        const prefix = building.buildingType.substring(0, 3);

        // Get the config object based on prefix
        const configObject = configMappings[prefix];

        if (level === null) {
            return configObject;
        }

        if (!configObject) {
            cc.log("ItemConfigUtils: No config found for prefix: " + prefix);
            return null;
        }

        const itemConfig = configObject[building.buildingType];
        return itemConfig && itemConfig[level] ? itemConfig[level] : itemConfig;
    },

    getTroopConfig: function (troopType, troopLevel = 1) {
        const prefix = troopType.substring(0, 3);
        const configObject = gv.configs.Troop;
        const troopConfig = configObject[troopType];
        return troopConfig && troopConfig[troopLevel] ? troopConfig[troopLevel] : troopConfig;
    },

    getTroopBaseConfig: function (troopType) {
        const configObject = gv.configs.TroopBase;
        return configObject[troopType];
    },

    getResourceType: function (config) {
        if (config.gold !== 0) {
            return RESOURCE_TYPES.OIL;
        }
        return RESOURCE_TYPES.GOLD;
    },
};