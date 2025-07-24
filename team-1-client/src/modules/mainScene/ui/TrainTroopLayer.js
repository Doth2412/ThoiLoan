const troopData = [
    {troopType: "ARM_1"}, {troopType: "ARM_2"}, {troopType: "ARM_3"}, {troopType: "ARM_4"}, {troopType: "ARM_5"},
    {troopType: "ARM_6"}, {troopType: "ARM_7"}, {troopType: "ARM_8"}, {troopType: "ARM_9"}, {troopType: "ARM_10"},
];

var TrainTroopLayer = cc.Layer.extend({
    // --- UI ELEMENT PROPERTIES ---
    uiContainerNode: null, // Node được load từ JSON
    backGround: null,
    backButton: null,
    closeButton: null,
    shopLabel: null,
    troopQueuePanel: null,
    queueArrow: null,
    queueSlotTemplate: null,
    overTimeLabel: null,
    overTimeText: null,
    finishNowLabel: null,
    finishNowButton: null,
    finishNowText: null,
    finishNowIcon: null,
    troopPanel: null,
    troopSlotTemplate: null,
    mainUIInstance: null,

    // --- STATE PROPERTIES ---
    trainTroopQueueSlots: null,
    barrackCapacity: null,
    currentBarrackObject: null,
    _barrackUpdateListener: null,

    ctor: function (uiContainerNodeFromMainUI, mainUIInstance) {
        this._super();
        this.uiContainerNode = uiContainerNodeFromMainUI;
        this.mainUIInstance = mainUIInstance;
        this.currentBarrackObject = null;
        this._setupUIElements();
        this._setupTrainTroopQueue();
        this.scheduleUpdate();
    },

    onEnter: function() {
        this._super();

        // --- SỬA LỖI BACKGROUND ĐEN MỜ ---
        var glView = cc.director.getOpenGLView();
        var frameSize = glView.getFrameSize(); // Lấy kích thước viewport thực tế

        var backgroundOverlay = new ccui.Layout();
        backgroundOverlay.setContentSize(frameSize);
        backgroundOverlay.setAnchorPoint(0.5, 0.5);
        backgroundOverlay.setPosition(frameSize.width / 2, frameSize.height / 2);
        backgroundOverlay.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        backgroundOverlay.setBackGroundColor(cc.color(0, 0, 0));
        backgroundOverlay.setBackGroundColorOpacity(150);
        backgroundOverlay.setTouchEnabled(true);

        this.addChild(backgroundOverlay, 0);
        this.addChild(this.uiContainerNode, 1);
        this._addEventListeners();
    },

    onExit: function() {
        this._removeEventListeners();
        this._super();
    },

    // --- LOGIC RESPONSIVE ---
    _updateLayout: function() {
        if (!this.uiContainerNode) return;

        var visibleSize = cc.director.getVisibleSize();
        var visibleOrigin = cc.director.getVisibleOrigin();
        var panelSize = this.uiContainerNode.getContentSize();

        if (panelSize.width === 0 || panelSize.height === 0) return;

        var scaleX = visibleSize.width / panelSize.width;
        var scaleY = visibleSize.height / panelSize.height;
        var scale = Math.min(scaleX, scaleY);

        this.uiContainerNode.setScale(scale);
        this.uiContainerNode.setAnchorPoint(0.5, 0.5);
        this.uiContainerNode.setPosition(
            visibleOrigin.x + visibleSize.width / 2,
            visibleOrigin.y + visibleSize.height / 2
        );
    },

    setVisible: function(isVisible) {
        this._super(isVisible);
        if (isVisible) {
            this._updateLayout();
        }
    },

    // --- CÁC HÀM CŨ GIỮ NGUYÊN ---
    _addEventListeners: function() {
        this._barrackUpdateListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "BARRACK_QUEUE_CHANGED",
            callback: this.onBarrackQueueChanged.bind(this)
        });
        cc.eventManager.addListener(this._barrackUpdateListener, 1);
    },

    _removeEventListeners: function() {
        if (this._barrackUpdateListener) {
            cc.eventManager.removeListener(this._barrackUpdateListener);
            this._barrackUpdateListener = null;
        }
    },

    onBarrackQueueChanged: function(event) {
        const eventData = event.getUserData();
        if (this.currentBarrackObject && eventData.barrackId === this.currentBarrackObject.buildingId) {
            this._loadQueueUI();
        }
    },

    _setupUIElements: function () {
        this.backGround = this.uiContainerNode.getChildByName("shopBackGround");
        this.closeButton = ccui.helper.seekWidgetByName(this.uiContainerNode, "closeButton");
        this.shopLabel = ccui.helper.seekWidgetByName(this.uiContainerNode, "shopLabel");
        this.troopQueuePanel = ccui.helper.seekWidgetByName(this.uiContainerNode, "troopQueuePanel");
        this.queueArrow = this.troopQueuePanel.getChildByName("queueArrow");
        this.queueSlotTemplate = ccui.helper.seekWidgetByName(this.uiContainerNode, "queueSlot");
        this.overTimeLabel = ccui.helper.seekWidgetByName(this.uiContainerNode, "overTimeLabel");
        this.overTimeText = ccui.helper.seekWidgetByName(this.uiContainerNode, "overTimeText");
        this.finishNowLabel = ccui.helper.seekWidgetByName(this.uiContainerNode, "finishNowLabel");
        this.finishNowButton = ccui.helper.seekWidgetByName(this.uiContainerNode, "finishNowButton");
        this.finishNowText = ccui.helper.seekWidgetByName(this.uiContainerNode, "finishNowText");
        this.finishNowIcon = ccui.helper.seekWidgetByName(this.uiContainerNode, "finishNowIcon");
        this.troopPanel = ccui.helper.seekWidgetByName(this.uiContainerNode, "troopPanel");
        this.troopSlotTemplate = ccui.helper.seekWidgetByName(this.uiContainerNode, "troop");

        this.backGround.setTexture(res.shop_background_png);
        this.closeButton.loadTextures(res.close_png, res.button_press_png, res.button_disable_png);
        this.queueArrow.setTexture(res.queue_arrow_png);
        this.finishNowButton.loadTextures(res.finish_now_button_png, res.button_press_png, res.finish_now_button_png);
        this.finishNowIcon.loadTexture(res.g_icon_png, ccui.Widget.LOCAL_TEXTURE);

        UISetup.setupLabel(this.shopLabel);
        UISetup.setupLabel(this.overTimeLabel);
        UISetup.setupLabel(this.overTimeText);
        UISetup.setupLabel(this.finishNowLabel);
        UISetup.setupLabel(this.finishNowText);

        this.finishNowButton.addClickEventListener(this.onFinishNow.bind(this));
        this.troopQueuePanel.setVisible(false);

        var troopCostBackGround = ccui.helper.seekWidgetByName(this.uiContainerNode, "troopCostBackGround");
        var troopInfoButton = ccui.helper.seekWidgetByName(this.uiContainerNode, "troopInfo");
        var troopResource = ccui.helper.seekWidgetByName(this.uiContainerNode, "troopResource");

        troopCostBackGround.loadTexture(res.troop_cost_background_png, ccui.Widget.LOCAL_TEXTURE)
        troopInfoButton.loadTextures(res.info_png, res.button_press_png, res.button_disable_png);
        troopInfoButton.setPosition(this.troopSlotTemplate.width * 80 / 100, this.troopSlotTemplate.height * 85 / 100);
        troopResource.loadTexture(res.troop_resource_png, ccui.Widget.LOCAL_TEXTURE);

        var troopCost = this.troopSlotTemplate.getChildByName("troopCost");
        troopCost.setFontName(res.rowdies_regular_29_07_ttf);
        troopCost.enableOutline(cc.color(0, 0, 0), 1);

        this.troopSlotTemplate.retain();

        var slotIcon = ccui.helper.seekWidgetByName(this.uiContainerNode, "slotIcon");
        var cancelButton = ccui.helper.seekWidgetByName(this.uiContainerNode, "cancelButton");

        slotIcon.loadTexture(res.arm_1_png, ccui.Widget.LOCAL_TEXTURE);
        cancelButton.loadTextures(res.cancel_button_png, res.button_press_png, res.button_disable_png);
        this.queueSlotTemplate.loadTextures(res.icon1_png, res.button_press_png, res.icon1_png);
        this.queueSlotTemplate.setScale(0.7, 0.7);
        this.queueSlotTemplate.retain();
        this.closeButton.addClickEventListener(this.onCloseButtonClicked.bind(this))
    },

    _setTargetAsset: function (barrack) {
        this.troopPanel.removeAllChildren();
        this.currentBarrackObject = barrack;
        this.barrackCapacity = ItemConfigUtils.getBuildingConfig(barrack).queueLength;
        for (var i = 0; i < troopData.length; i++) {
            var troopType = troopData[i].troopType;
            var troopSlot = this.troopSlotTemplate.clone();
            troopSlot.troopType = troopType;
            troopSlot.setPosition(
                this.troopPanel.width * (12 + (20 * (i % 5))) / 100,
                this.troopPanel.height * (75 - (50 * Math.floor(i / 5))) / 100
            );
            troopSlot.loadTextures(res.slot1_png, res.button_press_png, res.slot1_png);

            var troopIcon = ccui.helper.seekWidgetByName(troopSlot, "troopIcon");
            var resourceKey = troopType.toLowerCase() + "_png";
            troopIcon.loadTexture(res[resourceKey], ccui.Widget.LOCAL_TEXTURE);

            var troopInfoButton = ccui.helper.seekWidgetByName(troopSlot, "troopInfo");
            troopInfoButton.loadTextures(res.info_png, res.button_press_png, res.button_disable_png);

            troopInfoButton.addClickEventListener(function (sender) {
                var parentSlot = sender.getParent();
                var selectedTroopType = parentSlot.troopType;
                var troopLevel = 1;

                if (this.mainUIInstance && this.mainUIInstance.troopInfoUINode) {
                    this.mainUIInstance.troopInfoUINode._setTargetAsset(selectedTroopType, troopLevel);
                    this.mainUIInstance.troopInfoUINode.show();
                } else {
                    cc.error("TrainTroopLayer: Could not find troopInfoUINode on mainUIInstance.");
                }
            }.bind(this));

            var troopCost = ccui.helper.seekWidgetByName(troopSlot, "troopCost");
            var troopConfig = ItemConfigUtils.getTroopConfig(troopType);
            troopCost.setString(troopConfig.trainingElixir);

            var isEnable = this._isTroopTrainable(troopType, barrack);

            if (isEnable) {
                troopSlot.setColor(cc.color(255, 255, 255));
            } else {
                troopSlot.setColor(cc.color(128, 128, 128));
            }

            troopSlot.addClickEventListener(function (sender) {
                var isSlotEnabled = this._isTroopTrainable(sender.troopType, this.currentBarrackObject);
                if (isSlotEnabled) {
                    this.addTroopToQueue(sender.troopType);
                }
            }.bind(this));

            this.troopPanel.addChild(troopSlot);
        }

        this._loadQueueUI();
    },

    _setupTrainTroopQueue: function () {
        this.troopQueuePanel.removeChildByName("queueSlot");
        this.troopQueuePanel.removeChildByName("resultSlot");
        this.trainTroopQueueSlots = [];
        var slotSpacing = 11;
        var firstSlotOffset = 4;
        var baseX = 8;
        for (var i = 0; i < QUEUE_MAX_LENGTH; i++) {
            var queueSlot = this.queueSlotTemplate.clone();
            queueSlot.setName("queueSlot" + i);
            var xPercent;
            if (i === 0) {
                xPercent = baseX + (slotSpacing * (QUEUE_MAX_LENGTH - 1 - i)) + firstSlotOffset;
            } else {
                xPercent = baseX + (slotSpacing * (QUEUE_MAX_LENGTH - 1 - i));
            }
            queueSlot.setPosition(
                this.troopPanel.width * xPercent / 100,
                this.troopPanel.height * 30 / 100
            );
            var numberLabel = new ccui.Text("", res.rowdies_regular_29_07_ttf, 16);
            numberLabel.setColor(cc.color.WHITE);
            numberLabel.enableOutline(cc.color(0, 0, 0), 1);
            numberLabel.setAnchorPoint(1, 0);
            queueSlot.addChild(numberLabel, 2, "numberLabel");
            queueSlot.setVisible(false);
            this.troopQueuePanel.addChild(queueSlot);
            this.trainTroopQueueSlots.unshift(queueSlot);
        }
    },

    _isTroopTrainable: function (troopType, building) {
        var troopBaseConfig = ItemConfigUtils.getTroopBaseConfig(troopType);
        var barracksLevelRequired = troopBaseConfig.barracksLevelRequired;
        var barrackLevel = building.level;
        return barracksLevelRequired <= barrackLevel;
    },

    _createCustomProgressBar: function () {
        var containerNode = new cc.Node();
        var backgroundSprite = new cc.Sprite(res.bg_train_bar_png);
        backgroundSprite.setAnchorPoint(0.5, 0.5);
        backgroundSprite.setPosition(0, 0);
        containerNode.addChild(backgroundSprite, 0);
        var fillingSprite = new cc.Sprite(res.train_bar_png);
        var progressTimer = new cc.ProgressTimer(fillingSprite);
        progressTimer.setType(cc.ProgressTimer.TYPE_BAR);
        progressTimer.setMidpoint(cc.p(0, 0.5));
        progressTimer.setBarChangeRate(cc.p(1, 0));
        progressTimer.setPercentage(0);
        progressTimer.setPosition(0, 0);
        containerNode.addChild(progressTimer, 1);
        var timeLabel = new ccui.Text("00:00:00", res.rowdies_regular_29_07_ttf, 16);
        timeLabel.setColor(cc.color.WHITE);
        timeLabel.enableOutline(cc.color(0, 0, 0), 1);
        timeLabel.setPosition(0, 0);
        containerNode.addChild(timeLabel, 2);
        containerNode.progressTimer = progressTimer;
        containerNode.timeLabel = timeLabel;
        containerNode.setContentSize(backgroundSprite.getContentSize());
        return containerNode;
    },

    _loadQueueUI: function () {
        if (!this.currentBarrackObject) {
            this.troopQueuePanel.setVisible(false);
            return;
        }
        for (var i = 0; i < this.trainTroopQueueSlots.length; i++) {
            var slot = this.trainTroopQueueSlots[i];
            var slotIcon = ccui.helper.seekWidgetByName(slot, "slotIcon");
            if (slotIcon) slotIcon.setVisible(false);
            var numberLabel = slot.getChildByName("numberLabel");
            if (numberLabel) numberLabel.setString("");
            if (slot.progressBarNode) {
                slot.removeChild(slot.progressBarNode);
                slot.progressBarNode = null;
            }
            slot.setVisible(false);
        }
        var displayQueue = this.currentBarrackObject.trainingQueue;
        for (var j = 0; j < displayQueue.length; j++) {
            if (j >= this.trainTroopQueueSlots.length) break;
            var data = displayQueue[j];
            var slotIdx = this.trainTroopQueueSlots.length - 1 - j;
            var slot = this.trainTroopQueueSlots[slotIdx];
            var resourceKey = data.troopType.toLowerCase() + "_png";
            var slotIcon = ccui.helper.seekWidgetByName(slot, "slotIcon");
            if (slotIcon) {
                slotIcon.loadTexture(res[resourceKey], ccui.Widget.LOCAL_TEXTURE);
                slotIcon.setVisible(true);
            }
            var numberLabel = slot.getChildByName("numberLabel");
            if (numberLabel) numberLabel.setString("x" + data.troopAmount);
            slot.setVisible(true);
            this._setupCancelButton(slot, data.troopType);
            if (j === 0) {
                var progressBarNode = this._createCustomProgressBar();
                slot.addChild(progressBarNode);
                progressBarNode.setPosition(slot.width / 2, 0);
                slot.progressBarNode = progressBarNode;
            }
        }
    },

    addTroopToQueue: function (troopType) {
        if (!this.currentBarrackObject) return;
        var playerDataManager = PlayerDataManager.getInstance();
        var troopConfig = ItemConfigUtils.getTroopConfig(troopType);
        var cost = troopConfig.trainingElixir;
        if (playerDataManager.getResourceAmount("oil") < cost) {
            cc.log("TrainTroopLayer: Not enough oil. Showing Use Gem popup.");
            
            var missingAmount = cost - playerDataManager.getResourceAmount("oil");
            var popupConfig = {
                type: "OIL",
                amount: missingAmount,
                resource: "oil",
                mainUIInstance: this.mainUIInstance,
                successCallback: this.addTroopToQueue.bind(this, troopType)
            };
            
            if (this.mainUIInstance && this.mainUIInstance.useGemPopupUINode) {
                UIController.showUseGemPopupWithOptions(this.mainUIInstance, popupConfig);
            }
            return; // Stop here until the player buys resources or cancels.
        }
        var wasAdded = this.currentBarrackObject.addTroopToQueue(troopType);
        if (wasAdded) {
            playerDataManager.subtractResources("oil", cost);
        }
    },

    removeTroopFromQueue: function (troopType) {
        if (!this.currentBarrackObject) return;
        this.currentBarrackObject.removeTroopFromQueue(troopType);
        var playerDataManager = PlayerDataManager.getInstance();
        var troopConfig = ItemConfigUtils.getTroopConfig(troopType);
        if (troopConfig && typeof troopConfig.trainingElixir === 'number') {
            playerDataManager.addResources("oil", troopConfig.trainingElixir);
        }
    },

    _setupCancelButton: function (slot, troopType) {
        var cancelButton = slot.getChildByName("cancelButton");
        if (cancelButton) {
            cancelButton.setVisible(true);
            cancelButton.setTouchEnabled(true);
            cancelButton.addClickEventListener(function () {
                this.removeTroopFromQueue(troopType);
            }.bind(this));
        }
    },

    onCloseButtonClicked: function () {
        UIController.toggleTrainTroopUI(this.mainUIInstance, null);
    },

    getCurrentQueueTotalTime: function () {
        if (!this.currentBarrackObject) return 0;
        var totalQueueTime = 0;
        var queue = this.currentBarrackObject.trainingQueue;
        for (var i = 0; i < queue.length; i++) {
            var troop = queue[i];
            var trainingTime = ItemConfigUtils.getTroopBaseConfig(troop.troopType).trainingTime;
            totalQueueTime += troop.troopAmount * trainingTime;
        }
        if (queue.length > 0) {
            totalQueueTime -= this.currentBarrackObject.trainingProgress;
        }
        return totalQueueTime;
    },

    getGemCostForTimeFinish: function (remainingSeconds) {
        return Math.ceil(remainingSeconds / 120);
    },

    onFinishNow: function () {
        if (!this.currentBarrackObject || this.currentBarrackObject.trainingQueue.length === 0) {
            return;
        }
        var totalRemainingTime = this.getCurrentQueueTotalTime();
        var gemCost = this.getGemCostForTimeFinish(totalRemainingTime);
        var playerDataManager = PlayerDataManager.getInstance();
        if (playerDataManager.getResourceAmount("gem") < gemCost) {
            return;
        }
        if (playerDataManager.subtractResources("gem", gemCost)) {
            this.currentBarrackObject.finishAllTrainingInstantly();
        }
    },

    canFinishNow: function () {
        var totalQueueHousingSpace = this.getTotalQueueHousingSpace();
        if (totalQueueHousingSpace + TroopManager.getInstance().getCurrentArmySize()
            > BuildingsManager.getInstance().getTotalHousingSpace()) {
            return false;
        }
        return true;
    },

    getTotalQueueHousingSpace: function () {
        if (!this.currentBarrackObject) return 0;
        var totalQueueHousingSpace = 0;
        var queue = this.currentBarrackObject.trainingQueue;
        for (var i = 0; i < queue.length; i++) {
            var troopType = queue[i].troopType;
            totalQueueHousingSpace += ItemConfigUtils.getTroopBaseConfig(troopType).housingSpace * queue[i].troopAmount;
        }
        return totalQueueHousingSpace;
    },

    update: function (dt) {
        if (!this.troopQueuePanel || !this.currentBarrackObject || this.currentBarrackObject.trainingQueue.length === 0) {
            if(this.troopQueuePanel) this.troopQueuePanel.setVisible(false);
            return;
        }
        this.troopQueuePanel.setVisible(true);
        var activeTroop = this.currentBarrackObject.trainingQueue[0];
        var trainingProgress = this.currentBarrackObject.trainingProgress;
        var timePerTroop = ItemConfigUtils.getTroopBaseConfig(activeTroop.troopType).trainingTime;
        var remainingQueueTime = this.getCurrentQueueTotalTime();
        var timeLeftForCurrentTroop = Math.ceil(timePerTroop - trainingProgress);
        this.overTimeText.setString(remainingQueueTime > 0 ?  Utils.formatTime(Math.ceil(remainingQueueTime)) : "0s");
        this.finishNowText.setString(this.getGemCostForTimeFinish(remainingQueueTime) + "G");
        UISetup.enableButton(this.finishNowButton, this.canFinishNow());
        var rightmostSlot = this.trainTroopQueueSlots[this.trainTroopQueueSlots.length - 1];
        if (rightmostSlot && rightmostSlot.progressBarNode) {
            var progressBarNode = rightmostSlot.progressBarNode;
            var percentage = (trainingProgress / timePerTroop) * 100;
            progressBarNode.timeLabel.setString(timeLeftForCurrentTroop > 0 ? timeLeftForCurrentTroop + "s" : "0s");
            progressBarNode.progressTimer.setPercentage(percentage);
        }
    },
});