var AssetUtils = {
    /**
     * Retrieves asset paths for a defensive building's components (base and turret).
     * @param {string} buildingType - The building type key (e.g., 'DEF_1').
     * @param {number} level - The level of the building.
     * @returns {{base: string|null, anim: string|null}} An object with paths for the base and animation frame.
     */
    getDefensiveBuildingAssetPaths: function(buildingType, level) {
        const result = { base: null, anim: null };

        if (typeof DEFENSIVE_ANIMATION_METADATA !== 'undefined' && DEFENSIVE_ANIMATION_METADATA[buildingType] && DEFENSIVE_ANIMATION_METADATA[buildingType][level]) {
            const levelMeta = DEFENSIVE_ANIMATION_METADATA[buildingType][level];

            // Get base platform path, if it exists
            if (levelMeta.base && levelMeta.base.basePath) {
                result.base = levelMeta.base.basePath + ".png";
            }

            // Get idle animation frame path, if it exists
            if (levelMeta.defenseAnim && levelMeta.defenseAnim.idle && levelMeta.defenseAnim.idle.basePath) {
                const idleAnim = levelMeta.defenseAnim.idle;
                let frameIndex = (idleAnim.directions.S.startFrame || 0).toString();
                while (frameIndex.length < idleAnim.frameIndexPadding) {
                    frameIndex = '0' + frameIndex;
                }
                result.anim = idleAnim.basePath + frameIndex + ".png";
            }
        } else {
            cc.warn("AssetUtils: Could not find metadata for " + buildingType + " Lvl " + level);
        }
        return result;
    },

    /**
     * Returns the idle asset path for a given building type and level.
     * @param {string} buildingType - The building type key (e.g., 'RES_1').
     * @param {number} level - The level to get the asset for.
     * @returns {string|null} The asset path, or null if not found.
     */
    getBuildingLevelIdleAssetPath: function(buildingType, level) {
        if (!BUILDING_UI_CONFIG || !BUILDING_UI_CONFIG[buildingType]) {
            cc.warn("AssetUtils: BUILDING_UI_CONFIG missing or invalid for type: " + buildingType);
            return null;
        }
        var config = BUILDING_UI_CONFIG[buildingType];
        if (!config.assetFolderName) {
            cc.warn("AssetUtils: assetFolderName missing for buildingType: " + buildingType);
            return null;
        }
        if (buildingType == "BDH_1") return "Art/Buildings/" + config.assetFolderName + "/" + "/idle/image0000.png";
        if (buildingType.startsWith("DEF_")) {
            var assetPaths = this.getDefensiveBuildingAssetPaths(buildingType, level);
            if(buildingType.startsWith("DEF_2")){
                assetPaths = "Art/Buildings/defense_base/DEF_2_" + level + "_Shadow.png";
            }
            if (assetPaths.anim) {
                return assetPaths.anim;
            } else if (assetPaths.base) {
                return assetPaths.base;
            }
            cc.warn("AssetUtils: Could not find a valid primary asset path for " + buildingType + " Lvl " + level + ". Using fallback.");
            return "Art/Buildings/defense_base/" + buildingType + "_" + level + "_Shadow.png";
        }
        cc.log("Art/Buildings/" + config.assetFolderName + "/" + buildingType + "_" + level + "/idle/image0000.png")
        return "Art/Buildings/" + config.assetFolderName + "/" + buildingType + "_" + level + "/idle/image0000.png";
    }
};
