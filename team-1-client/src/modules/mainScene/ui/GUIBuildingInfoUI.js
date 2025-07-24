/**
 * GUIBuildingInfo.js
 *
 * This class represents the Building Information UI.
 * It uses a robust and safe method for handling UI templates by manually
 * managing the memory of detached template nodes.
 */
var GUIBuildingInfo = GUIBase.extend({
    _statTemplates: null, // Object to hold the master template nodes

    /**
     * Maps building type prefixes to a generic list of attributes they should display.
     */
    buildingAttributeMapper: {
        "TOW": ["capacityGold", "capacityElixir", "hitpoints"],
        "STO": ["capacity", "hitpoints"],
        "RES": ["productivity", "capacity", "hitpoints"],
        "DEF": ["damagePerSecond", "hitpoints"],
        "AMC": ["capacity", "hitpoints"],
        "BAR": ["hitpoints"],
        "BDH": ["hitpoints"]
    },

    /**
     * Maps a specific attribute key to its UI configuration.
     */
    attributeUIConfig: {
        "hitpoints":          { template: "hp",       label: "Máu",           icon: res.heal_icon_png },
        "damagePerSecond":    { template: "dmg",      label: "Sát thương",    icon: res.dama_def_png },
        "capacity":           { template: "capacity", label: "Sức chứa",      icon: res.troop_capacity_icon_png },
        "capacityGold":       { template: "capacity", label: "Sức chứa", icon: res.gold_capacity_icon_png },
        "capacityElixir":     { template: "capacity", label: "Sức chứa",  icon: res.elixir_capacity_icon_png },
        "productivity":       { template: "resRate",  label: "Sản lượng",     icon: res.gold_production_rate_icon_png },
        "productivityGold":   { template: "resRate",  label: "Sản lượng", icon: res.gold_production_rate_icon_png },
        "productivityElixir": { template: "resRate",  label: "Sản lượng",  icon: res.elixir_production_rate_icon_png }
    },

    /**
     * Constructor for GUIBuildingInfo.
     */
    ctor: function() {
        this._super(res.building_info_ui_json, true);
        this._initStatTemplates();
        this._findAndSetFont(this);
        this.previewAnim.setVisible(false);
        this.closeButton.addClickEventListener(() => {
            this.hide();
        });
    },

    /**
     * This method is called automatically when the scene exits.
     * We MUST release the templates we manually retained in the constructor.
     */
    onExit: function() {
        this._super(); // It's good practice to always call the superclass's onExit

        cc.log("[GUIBuildingInfo] onExit: Releasing manually retained stat templates.");
        for (var key in this._statTemplates) {
            if (this._statTemplates.hasOwnProperty(key)) {
                this._statTemplates[key].release();
            }
        }
        this._statTemplates = null;
    },

    /**
     * Prepares the master templates by detaching them and retaining them for manual management.
     * @private
     */
    _initStatTemplates: function() {
        this._statTemplates = {};
        var templateNames = ["capacity", "hp", "resRate", "dmg"];

        templateNames.forEach(name => {
            var templateNode = this[name]; // e.g., this.capacity
            if (templateNode) {
                templateNode.removeFromParent();
                templateNode.retain();
                this._statTemplates[name] = templateNode;
            } else {
                cc.warn("[GUIBuildingInfo] Template node not found: " + name);
            }
        });

        this.buildingStatView.removeAllItems();
    },

    /**
     * Shows and populates the building information UI based on a building's data.
     */
    showInfo: function(building) {
        var assetPath = AssetUtils.getBuildingLevelIdleAssetPath(building.buildingType, building.level);
        if(building.buildingType === "BAR_2") assetPath = res.bar_2_png;
        this.previewImage.loadTexture(assetPath, ccui.Widget.LOCAL_TEXTURE);
        this.previewImage.setScale(0.4);
        this.previewBase.loadTexture(res._3_png, ccui.Widget.LOCAL_TEXTURE);

        if (!building || !building.buildingType || !building.level) {
            return;
        }

        var buildingStatView = this.buildingStatView;
        buildingStatView.removeAllItems();

        var prefix = building.buildingType.substring(0, 3);
        var buildingTypeKey = (prefix === "STO" || prefix === "RES") ? building.buildingType : prefix;
        var attributesToShow = this.buildingAttributeMapper[buildingTypeKey] || this.buildingAttributeMapper[prefix];

        if (!attributesToShow) {
            this.show();
            return;
        }

        const baseConfig = ItemConfigUtils.getBuildingConfig({ buildingType: building.buildingType }, null);
        if (!baseConfig) return;
        const fullConfig = baseConfig[building.buildingType];
        if (!fullConfig) return;

        var currentLevelConfig = fullConfig[building.level];
        if (!currentLevelConfig) return;

        var levelKeys = Object.keys(fullConfig).filter(Number);
        if (levelKeys.length === 0) {
            this.show();
            return;
        }
        var maxLevel = levelKeys.reduce((a, b) => Math.max(a, b), 0);
        var maxLevelConfig = fullConfig[maxLevel];
        if (!maxLevelConfig) return;

        for (var i = 0; i < attributesToShow.length; i++) {
            var genericAttrKey = attributesToShow[i];
            var uiConfKey = genericAttrKey;
            var jsonKey = genericAttrKey;

            if ((prefix === "STO" || prefix === "RES") && (jsonKey === "capacity" || jsonKey === "productivity")) {
                var resourceType = currentLevelConfig.type;
                if (resourceType) {
                    var capitalizedType = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
                    uiConfKey = jsonKey + capitalizedType;
                }
            }

            var uiConfig = this.attributeUIConfig[uiConfKey];
            if (!uiConfig || !currentLevelConfig.hasOwnProperty(jsonKey) || !maxLevelConfig.hasOwnProperty(jsonKey)) {
                continue;
            }

            var template = this._statTemplates[uiConfig.template];
            if (!template) continue;

            var newItem = template.clone();
            this._findAndSetFont(newItem);

            // --- START OF MODIFICATION ---
            var currentValue, maxValue, percent, labelText;
            // A live instance from the map will have a buildingIndex, a shop preview will not.
            var isLiveInstance = (building.buildingIndex !== undefined);

            // Handle special capacity logic for different building types
            // ES5 FIX: Replaced .includes() with .indexOf() !== -1 for compatibility
            if (genericAttrKey.indexOf("capacity") !== -1) {
                var buildingIsResourceGenerator = (prefix === "STO" || prefix === "RES");
                var buildingIsArmyCamp = (prefix === "AMC");

                if (buildingIsResourceGenerator && isLiveInstance && typeof building.accumulatedResources === 'number') {
                    // Live Resource Generator: Show current stored vs capacity
                    currentValue = building.accumulatedResources;
                    maxValue = currentLevelConfig.capacity;
                    percent = (maxValue > 0) ? (currentValue / maxValue) * 100 : 0;
                    labelText = uiConfig.label + ": " + currentValue + "/" + maxValue;

                } else if (buildingIsArmyCamp && isLiveInstance && typeof building.getCurrentHousingSpace === 'function') {
                    // Live Army Camp: Show current troops vs capacity
                    currentValue = building.getCurrentHousingSpace();
                    maxValue = currentLevelConfig.capacity;
                    percent = (maxValue > 0) ? (currentValue / maxValue) * 100 : 0;
                    labelText = uiConfig.label + ": " + currentValue + "/" + maxValue;

                } else {
                    // Default case (Shop view OR other building types): Show current level stat vs max level stat
                    currentValue = currentLevelConfig[jsonKey];
                    maxValue = maxLevelConfig[jsonKey];
                    percent = (maxValue > 0) ? (currentValue / maxValue) * 100 : 100;
                    labelText = uiConfig.label + ": " + currentValue;
                }
            } else {
                // Normal logic for all other attributes (hitpoints, damage, productivity etc.)
                currentValue = currentLevelConfig[jsonKey];
                maxValue = maxLevelConfig[jsonKey];
                percent = (maxValue > 0) ? (currentValue / maxValue) * 100 : 100;
                labelText = uiConfig.label + ": " + currentValue;
                if (genericAttrKey === 'productivity') {
                    labelText += "/giờ";
                }
            }
            // --- END OF MODIFICATION ---

            this._updateStatItem(newItem, labelText, percent, uiConfig.icon);
            buildingStatView.pushBackCustomItem(newItem);
        }

        this.show();
    },

    /**
     * Helper function to update a stat item's text, progress bar, and icon.
     * @private
     */
    _updateStatItem: function(item, labelText, percent, iconPath) {
        var textLabel = ccui.helper.seekWidgetByName(item, "text");
        var barFill = ccui.helper.seekWidgetByName(item, "barFill");
        var icon = ccui.helper.seekWidgetByName(item, "icon");

        if (textLabel) textLabel.setString(labelText);
        if (barFill) barFill.setPercent(percent);
        if (icon && iconPath) icon.loadTexture(iconPath, ccui.Widget.LOCAL_TEXTURE);
    },

    /**
     * Helper function to apply custom font to all text nodes.
     * @private
     */
    _findAndSetFont: function (node) {
        if (!node) return;
        if (node.getName() && (node.getName().endsWith("Text") || node.getName().endsWith("Label") || node.getName().endsWith("text"))) {
            node.setFontName(res.rowdies_regular_29_07_ttf);
            node.enableOutline(cc.color(0, 0, 0), 1);
        }
        var children = node.getChildren();
        for (var i = 0; i < children.length; i++) {
            this._findAndSetFont(children[i]);
        }
    },
});
