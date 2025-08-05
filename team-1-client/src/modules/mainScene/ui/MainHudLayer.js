const DEFAULT_VISUAL_ICON_Z_ORDER = 2;
const DEFAULT_AMOUNT_LABEL_Z_ORDER = 3;
const DEFAULT_PROGRESS_TIMER_Z_ORDER = 1;
const VISUAL_ICON_OFFSET_X = 10;
const VISUAL_ICON_OFFSET_Y = 15;
const RESOURCE_BAR_DEFAULT_PERCENTAGE = 100;

var MainHUDLayer = cc.Layer.extend({
    uiContainerNode: null,
    mainUIInstance: null,

    goldProgress: null,
    elixirProgress: null,
    oilProgress: null,
    gemProgress: null,
    expProgress: null,

    goldLabel: null,
    elixirLabel: null,
    oilLabel: null,
    gemLabel: null,
    prestigeLabel: null,
    playerNameLabel: null,
    builderTextLabel: null, builderDescLabel: null,
    campTextLabel: null, campDescLabel: null,
    guardTextLabel: null, guardDescLabel: null,


    ctor: function (uiContainerNodeFromMainUI, mainUIInstance) {
        this.mainUIInstance = mainUIInstance;
        this._super();
        this.uiContainerNode = uiContainerNodeFromMainUI;
        this.addChild(this.uiContainerNode);

        this.initHUD();
        if (typeof cc.eventManager !== 'undefined') {
            cc.eventManager.addCustomListener(PLAYER_DATA_EVENTS.RESOURCE_UPDATED, this._onResourceUpdated.bind(this));
            cc.eventManager.addCustomListener(PLAYER_DATA_EVENTS.BUILDER_STATUS_UPDATED, this._updateBuilderStatus.bind(this));
            cc.eventManager.addCustomListener(PLAYER_DATA_EVENTS.ARMY_STATUS_UPDATED, this._updateArmyStatus.bind(this));
        }
        cc.eventManager.addCustomListener("INITIAL_DATA_LOADED", this.performInitialUpdate.bind(this));
    },

    onEnter: function() {
        this._super();
        this.updateResourceBar('gold');
        this.updateResourceBar('oil');
        this.updateResourceBar('gem');
        this._updateBuilderStatus();
        this._updateArmyStatus();
        this._updatePrestigeStatus(); // Call new function
    },

    performInitialUpdate: function() {
        cc.log("MainHUDLayer: Initial data loaded. Performing first update.");
        this.updateResourceBar('gold');
        this.updateResourceBar('oil');
        this.updateResourceBar('gem');
        this._updateBuilderStatus();
        this._updateArmyStatus();
        this._updatePrestigeStatus(); // Call new function
    },

    initHUD: function () {
        this.setupUIElements();
    },

    setupResourceGroup: function (config) {
        var findNodeFromHUD = (name, parent = this.uiContainerNode) => parent.getChildByName(name);
        var container = findNodeFromHUD(config.containerNodeName);
        if(config.containerNodeName === "expBackGround") {
            this.playerNameLabel = container.getChildByName("playerName");
            this.playerNameLabel.setString(PlayerDataManager.getInstance().playerData.playerInfoName);
        }
        if (config.isContainerItselfBackground && config.backgroundRes) {
            container.setTexture(config.backgroundRes);
        } else if (config.backgroundNodeName && config.backgroundRes) {
            var bgSprite = container.getChildByName(config.backgroundNodeName);
            bgSprite.setTexture(config.backgroundRes);
        }
        if (config.existingVisualIconName && config.existingVisualIconRes) {
            var existingIcon = container.getChildByName(config.existingVisualIconName);

            if (existingIcon) {
                var iconPos = existingIcon.getPosition();
                var iconAnchor = existingIcon.getAnchorPoint();
                var iconScaleX = existingIcon.getScaleX();
                var iconScaleY = existingIcon.getScaleY();
                var iconName = existingIcon.getName();

                existingIcon.removeFromParent(true);

                var visualIconSprite = new cc.Sprite(config.existingVisualIconRes);
                visualIconSprite.setPosition(iconPos);
                visualIconSprite.setAnchorPoint(iconAnchor);
                visualIconSprite.setScaleX(iconScaleX);
                visualIconSprite.setScaleY(iconScaleY);
                visualIconSprite.setName(iconName);

                container.addChild(visualIconSprite, config.visualIconZOrder || DEFAULT_VISUAL_ICON_Z_ORDER);
                this[config.groupName + "VisualIcon"] = visualIconSprite;
            }
        } else if (config.visualIconRes) {
            var visualIconSprite = new cc.Sprite(config.visualIconRes);
            if (visualIconSprite.getTexture()) {
                var currentPos = visualIconSprite.getPosition();
                visualIconSprite.setPosition(currentPos.x + VISUAL_ICON_OFFSET_X, currentPos.y + VISUAL_ICON_OFFSET_Y);
                container.addChild(visualIconSprite, config.visualIconZOrder || DEFAULT_VISUAL_ICON_Z_ORDER);
                this[config.groupName + "VisualIcon"] = visualIconSprite;
            }
        }

        this[config.groupName + "Progress"] = this.createProgressTimer(
            container, // Pass the found container
            config.fillNodeName,
            config.fillBarRes,
            config.rightToLeftFill !== undefined ? config.rightToLeftFill : true
        );

        var amountLabel = ccui.helper.seekWidgetByName(container, config.amountLabelName) ||
            container.getChildByName(config.amountLabelName);
        UISetup.setupLabel(amountLabel);
        this[config.groupName + "AmountLabel"] = amountLabel;
        amountLabel.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        var currentPos = amountLabel.getPosition();
        if (config.groupName === "exp") amountLabel.setVisible(false);
        else amountLabel.setPosition(currentPos.x + 100, currentPos.y - 7);
        amountLabel.setLocalZOrder(DEFAULT_AMOUNT_LABEL_Z_ORDER);

        if (config.capacityLabelName) {
            var capacityLabel = container.getChildByName(config.capacityLabelName);
            UISetup.setupLabel(capacityLabel);
            capacityLabel.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            currentPos = capacityLabel.getPosition();

            this[config.groupName + "CapacityLabel"] = capacityLabel;
            if (config.groupName === "exp") capacityLabel.setPosition(currentPos.x + 70, currentPos.y - 2);
            else capacityLabel.setPosition(currentPos.x, currentPos.y - 10);
        }
    },

    setupUIElements: function () {
        var findWidget = (name, parent = this.uiContainerNode) => ccui.helper.seekWidgetByName(parent, name);
        var findNode = (name, parent = this.uiContainerNode) => parent.getChildByName(name);
        // --- Resource Bars ---
        this.setupResourceGroup({
            groupName: "gold", containerNodeName: "goldIcon",
            visualIconRes: res.gold_icon_png, visualIconZOrder: DEFAULT_AMOUNT_LABEL_Z_ORDER,
            backgroundNodeName: "goldBackGround", backgroundRes: res.bg_bar_4_png,
            fillNodeName: "goldFill", fillBarRes: res.gold_bar_png,
            amountLabelName: "goldAmount", capacityLabelName: "goldLabel"
        });
        this.setupResourceGroup({
            groupName: "elixir", containerNodeName: "elixirIcon",
            visualIconRes: res.elixir_icon_png, visualIconZOrder: DEFAULT_AMOUNT_LABEL_Z_ORDER,
            backgroundNodeName: "elixirBackGround", backgroundRes: res.bg_bar_4_png,
            fillNodeName: "elixirFill", fillBarRes: res.elixir_bar_png,
            amountLabelName: "elixirAmount", capacityLabelName: "elixirLabel"
        });
        this.setupResourceGroup({
            groupName: "oil", containerNodeName: "oilIcon",
            visualIconRes: res.dark_elixir_icon_png, visualIconZOrder: DEFAULT_AMOUNT_LABEL_Z_ORDER,
            backgroundNodeName: "oilBackGround", backgroundRes: res.bg_bar_4_png,
            fillNodeName: "oilFill", fillBarRes: res.dark_elixir_bar_png,
            amountLabelName: "oilAmount", capacityLabelName: "oilLabel"
        });
        this.setupResourceGroup({
            groupName: "gem", containerNodeName: "gemIcon",
            visualIconRes: res.g_icon_png, visualIconZOrder: DEFAULT_AMOUNT_LABEL_Z_ORDER,
            backgroundNodeName: "gemBackGround", backgroundRes: res.bg_bar_4_png,
            fillNodeName: "gemFill", fillBarRes: res.g_bar_png, rightToLeftFill: false,
            amountLabelName: "gemAmount"
        });
        this.setupResourceGroup({
            groupName: "exp", containerNodeName: "expBackGround",
            isContainerItselfBackground: true,
            backgroundRes: res.exp_bg_bar_png,
            visualIconZOrder: DEFAULT_AMOUNT_LABEL_Z_ORDER,
            existingVisualIconName: "expIcon", existingVisualIconRes: res.exp_icon_png,
            fillNodeName: "expFill", fillBarRes: res.exp_bar_png, rightToLeftFill: false,
            amountLabelName: "campText", capacityLabelName: "playerName"
        });


        const statusDisplayConfigs = [
            {
                groupName: "builder",
                containerNodeName: "builderBackGround",
                backgroundRes: res.bg_bar_1_png,
                existingVisualIconName: "builderIcon",
                existingVisualIconRes: res.builder_icon_png,
                textNodeName: "builderText",
                labelNodeName: "builderLabel"
            },
            {
                groupName: "camp",
                containerNodeName: "campBackGround",
                backgroundRes: res.bg_bar_1_png,
                existingVisualIconName: "campIcon",
                existingVisualIconRes: res.army_icon_png,
                textNodeName: "campText",
                labelNodeName: "campLabel"
            },
            {
                groupName: "guard",
                containerNodeName: "guardBackground",
                backgroundRes: res.bg_bar_1_png,
                existingVisualIconName: "guardIcon",
                existingVisualIconRes: res.shield_png,
                textNodeName: "guardText",
                labelNodeName: "guardLabel"
            },
            {
                groupName: "prestige",
                containerNodeName: "prestigeBackGround",
                backgroundRes: res.trophy_bg_bar_png,
                existingVisualIconName: "prestigeIcon",
                existingVisualIconRes: res.trophy_png,
                textNodeName: "prestigeText"
            }
        ];

        statusDisplayConfigs.forEach(config => {
            var container = findNode(config.containerNodeName);
            if (container) {
                container.setTexture(config.backgroundRes);
                var icon = container.getChildByName(config.existingVisualIconName);
                icon.setTexture(config.existingVisualIconRes);
                if (config.textNodeName) {
                    const textLabel = ccui.helper.seekWidgetByName(container, config.textNodeName) || container.getChildByName(config.textNodeName);
                    if (textLabel) {
                        UISetup.setupLabel(textLabel); // Ensure outline and font are set
                        textLabel.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                        if (config.groupName === "prestige") {
                            textLabel.setColor(cc.color(255, 215, 0)); // Gold color
                        }
                    }
                    this[config.groupName + "TextLabel"] = textLabel;
                }
                if (config.labelNodeName) {
                    const descLabel = ccui.helper.seekWidgetByName(container, config.labelNodeName) || container.getChildByName(config.labelNodeName);
                    if (descLabel && typeof descLabel.setFontName === 'function') {
                        descLabel.setFontName(res.rowdies_regular_29_07_ttf);
                    }
                    UISetup.setupLabel(descLabel);
                    this[config.groupName + "DescLabel"] = descLabel;
                }
            }
        });
        var attackButton = findWidget("attack");
        var shopButton = findWidget("shop");
        var settingButton = findWidget("setting");
        attackButton.loadTextures(res.attack_png, res.attack2_png, res.button_disable_png, ccui.Widget.LOCAL_TEXTURE);
        shopButton.loadTextures(res.shop_png, res.shop2_png, res.button_disable_png, ccui.Widget.LOCAL_TEXTURE);
        settingButton.loadTextures(res.setting_png, res.setting2_png, res.button_disable_png, ccui.Widget.LOCAL_TEXTURE);

        if (attackButton) attackButton.addClickEventListener(() => {
            UIController.toggleBattleOptionsUI(this.mainUIInstance);
        });
        if (shopButton) {
            shopButton.addClickEventListener(() => {
                this.mainUIInstance.toggleShopUI();
            });
        }
        if (settingButton) settingButton.addClickEventListener(() => {
            debugLog("mainScene", "Settings Button Clicked!");
        });
    },

    createProgressTimer: function (containerNode, fillNodeName, fillResourcePath, rightToLeft = true) {
        var fillSpriteNode = containerNode.getChildByName(fillNodeName);
        var progressTimerZOrder = DEFAULT_PROGRESS_TIMER_Z_ORDER;
        var fillSprite = new cc.Sprite(fillResourcePath);
        var progressTimer = new cc.ProgressTimer(fillSprite);
        progressTimer.setType(cc.ProgressTimer.TYPE_BAR);
        progressTimer.setMidpoint(rightToLeft ? cc.p(1, 0.5) : cc.p(0, 0.5));
        progressTimer.setBarChangeRate(cc.p(1, 0));
        progressTimer.setPercentage(RESOURCE_BAR_DEFAULT_PERCENTAGE);
        progressTimer.setPosition(fillSpriteNode.getPosition());
        progressTimer.setAnchorPoint(fillSpriteNode.getAnchorPoint());
        progressTimer.setScaleX(fillSpriteNode.getScaleX());
        progressTimer.setScaleY(fillSpriteNode.getScaleY());
        var parent = fillSpriteNode.getParent();
        parent.addChild(progressTimer, progressTimerZOrder);
        fillSpriteNode.removeFromParent(true);
        return progressTimer;
    },

    _onResourceUpdated: function (event) {
        var eventData = event.getUserData();
        this.goldAmountLabel.setString(parseInt(eventData.gold).toString());
        this.elixirAmountLabel.setString(parseInt(eventData.oil).toString());
        this.gemAmountLabel.setString(parseInt(eventData.gem).toString());

        // Cập nhật các thanh progress bar
        var goldCapacity = PlayerDataManager.getInstance().getResourceCapacity('gold');
        if (this.goldProgress) {
            this.goldProgress.setPercentage(goldCapacity > 0 ? (eventData.gold / goldCapacity) * 100 : 0);
        }

        var oilCapacity = PlayerDataManager.getInstance().getResourceCapacity('oil');
        if (this.elixirProgress) { // Tên biến trong code của bạn là elixirProgress
            this.elixirProgress.setPercentage(oilCapacity > 0 ? (eventData.oil / oilCapacity) * 100 : 0);
        }
    },

    updateResourceBar: function (resourceType) {
        var bar = null;
        var amountLabel = null;
        var capacityLabel = null;
        var currentAmount = PlayerDataManager.getInstance().getResourceAmount(resourceType);
        var capacity = PlayerDataManager.getInstance().getResourceCapacity(resourceType);

        switch (resourceType) {
            case "gold":
                bar = this.goldProgress;
                amountLabel = this.goldAmountLabel;
                capacityLabel = this.goldCapacityLabel;
                break;
            case "oil":
                bar = this.elixirProgress;
                amountLabel = this.elixirAmountLabel;
                capacityLabel = this.elixirCapacityLabel;
                break;
            case "exp":
                bar = this.expProgress;
                amountLabel = this.expAmountLabel; // This might be "campText" from setup, verify
                capacityLabel = this.expCapacityLabel; // This might be "playerName" from setup, verify
                break;
            case "gem":
                bar = this.gemProgress;
                amountLabel = this.gemAmountLabel;
                break;
        }

        if (bar) {
            const percentage = (capacity && capacity > 0) ? (currentAmount / capacity) * 100 : 0;
            bar.setPercentage(percentage);
        }
        if (amountLabel) {
            amountLabel.setString(parseInt(currentAmount).toString());
        }
        if (capacityLabel) {
            // Only update capacity label if it exists and is relevant (e.g., for gold, elixir, oil)
            capacityLabel.setString(parseInt(capacity).toString());
        }
    },

    _updateBuilderStatus: function (event) {
        // Use BuilderManager to get builder counts
        var builderManager = BuilderManager.getInstance();
        var free = builderManager.getFreeBuildersCount();
        var total = builderManager.getTotalBuilders();
        if (this.builderTextLabel) {
            this.builderTextLabel.setString(free + "/" + total);
        }
    },

    _updateArmyStatus: function (event) {
        var buildingManager = BuildingsManager.getInstance();
        var troopManager = TroopManager.getInstance();
        var currentArmySize = troopManager.getCurrentArmySize();
        var totalHousingSpace = buildingManager.getTotalHousingSpace();
        if (this.campTextLabel) {
            this.campTextLabel.setString(currentArmySize + "/" + totalHousingSpace);
        }
        cc.log("Army status: " + currentArmySize + "/" + totalHousingSpace);
    },

    _updatePrestigeStatus: function() {
        var playerData = PlayerDataManager.getInstance().playerData;
        if (this.prestigeTextLabel) {
            this.prestigeTextLabel.setString(playerData.prestigePoint.toLocaleString());
        }
    },
});