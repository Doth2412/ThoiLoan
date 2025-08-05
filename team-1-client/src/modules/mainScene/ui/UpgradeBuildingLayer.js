var UpgradeBuildingLayer = cc.Layer.extend({
    // --- CÁC THUỘC TÍNH GIỮ NGUYÊN ---
    uiContainerNode: null,
    backgroundImage: null,
    topViewPanel: null,
    closeButton: null,
    upgradeLabel: null,
    informationLeftPanel: null,
    previewBase: null,
    previewPanel: null,
    previewAnim: null,
    timeToUpgradeLabel: null,
    timeToUpgradeText: null,
    informationRightPanel: null,
    barTemplate: null,
    barFill: null,
    barText: null,
    barIcon: null,
    confirmUpgradeButton: null,
    costAmountText: null,
    costResourceImage: null,
    notiText: null,
    requirementsStatusLabel: null,
    mainUIInstance: null,
    currentBuilding: null,
    buildingNextLevelConfig: null,

    ctor: function (uiContainerNodeFromMainUI, mainUIInstance) {
        this._super();
        this.uiContainerNode = uiContainerNodeFromMainUI;
        this.mainUIInstance = mainUIInstance;
        this._setupUIElements();
    },

    onEnter: function() {
        this._super();

        var glView = cc.director.getOpenGLView();
        var frameSize = glView.getFrameSize();

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
    },

    onExit: function() {
        this._super();
    },

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

    _setupUIElements: function () {
        this.backgroundImage = ccui.helper.seekWidgetByName(this.uiContainerNode,"backGroundImage");
        this.topViewPanel = ccui.helper.seekWidgetByName(this.uiContainerNode, "topViewPanel");
        this.closeButton = ccui.helper.seekWidgetByName(this.uiContainerNode, "closeButton");
        this.upgradeLabel = ccui.helper.seekWidgetByName(this.uiContainerNode, "upgradeLabel");
        this.informationLeftPanel = ccui.helper.seekWidgetByName(this.uiContainerNode, "informationLeftPanel");
        this.previewBase = ccui.helper.seekWidgetByName(this.uiContainerNode, "previewBase");
        this.previewImage = ccui.helper.seekWidgetByName(this.uiContainerNode, "previewImage");
        this.previewAnim = ccui.helper.seekWidgetByName(this.uiContainerNode, "previewAnim");
        this.timeToUpgradeLabel = ccui.helper.seekWidgetByName(this.uiContainerNode, "timeToUpgradeLabel");
        this.timeToUpgradeText = ccui.helper.seekWidgetByName(this.uiContainerNode, "timeToUpgradeText");
        this.informationRightPanel = ccui.helper.seekWidgetByName(this.uiContainerNode, "informationRightPanel");
        this.barTemplate = ccui.helper.seekWidgetByName(this.uiContainerNode, "barBackGround");
        this.barFill = ccui.helper.seekWidgetByName(this.uiContainerNode, "barFill");
        this.barText = ccui.helper.seekWidgetByName(this.uiContainerNode, "text");
        this.barIcon = ccui.helper.seekWidgetByName(this.uiContainerNode, "icon");
        this.confirmUpgradeButton = ccui.helper.seekWidgetByName(this.uiContainerNode, "confirmUpgradeButton");
        this.costAmountText = ccui.helper.seekWidgetByName(this.uiContainerNode, "costAmountText");
        this.costResourceImage = ccui.helper.seekWidgetByName(this.uiContainerNode, "costResourceImage");
        this.notiText = new ccui.Text("", res.rowdies_regular_29_07_ttf, 11);
        this.notiText.setName("notiText");
        this.backgroundImage.addChild(this.notiText);
        this.notiText.setPosition(cc.p(this.backgroundImage.getContentSize().width * 4 / 5, 40));
        this.notiText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.notiText.setAnchorPoint(cc.p(0.5, 0.5));
        this.notiText.enableOutline(cc.color(0, 0, 0), 1);
        this.notiText.setColor(cc.color(255, 0, 0));
        this.notiText.setVisible(false);

        this.backgroundImage.loadTexture(res.bg_png);
        this.closeButton.loadTextures(res.close_png, res.button_press_png, res.button_disable_png);
        this.closeButton.setScale(0.8);

        UISetup.setupLabel(this.upgradeLabel);
        UISetup.setupLabel(this.timeToUpgradeLabel);
        UISetup.setupLabel(this.timeToUpgradeText);
        UISetup.setupLabel(this.costAmountText);
        UISetup.setupLabel(this.barText);
        this.prerequisiteLabel = new cc.LabelTTF("", res.rowdies_regular_29_07_ttf, 15);
        if (this.prerequisiteLabel) {
            this.prerequisiteLabel.setAnchorPoint(0.5, 0);
            this.prerequisiteLabel.setPosition(this.uiContainerNode.width / 2, 60); // Place below main panel
            this.prerequisiteLabel.setColor(cc.color(255, 80, 80));
            this.prerequisiteLabel.setTextHorizontalAlignment && this.prerequisiteLabel.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.uiContainerNode.addChild(this.prerequisiteLabel, 99);
            this.prerequisiteLabel.setVisible(false);
        }

        this.requirementsStatusLabel = new cc.LabelTTF("", res.rowdies_regular_29_07_ttf, 15);
        this.requirementsStatusLabel.setColor(cc.color(255, 0, 0));
        this.requirementsStatusLabel.setAnchorPoint(0.5, 0.5);
        var infoPanelSize = this.informationRightPanel.getContentSize();
        this.requirementsStatusLabel.setPosition(infoPanelSize.width * 3 , infoPanelSize.height * 1.25);
        this.uiContainerNode.addChild(this.requirementsStatusLabel, 5);
        this.requirementsStatusLabel.setVisible(false);

        var topPanelSize = this.topViewPanel.getContentSize();
        this.upgradeLabel.setPosition(cc.p(topPanelSize.width / 2, topPanelSize.height / 2.5));
        this.upgradeLabel.setContentSize(cc.size(topPanelSize.width * 0.8, this.upgradeLabel.getContentSize().height));
        this.closeButton.addClickEventListener(this.onCloseButtonClicked.bind(this));
        this.confirmUpgradeButton.loadTextures(res.button_png, res.button_press_png, res.button_png)
        // Gán sự kiện cho nút ở đây
        this.confirmUpgradeButton.addClickEventListener(this.onUpgradeButtonClicked.bind(this));
    },

    setTargetAsset: function (building) {
        this.currentBuilding = building;
        var uiConfig = BUILDING_UI_CONFIG[building.buildingType]
        var baseSizeKey = uiConfig.size.width + "x" + uiConfig.size.height;
        var baseConfig = BASE_SPRITE_CONFIG[baseSizeKey];
        var currentBuildingLevel = building.level;
        var nextLevel = currentBuildingLevel + 1;
        this.buildingNextLevelConfig = ItemConfigUtils.getBuildingConfig(building, nextLevel);
        this.upgradeLabel.setString("Nâng công trình đến cấp " + (building.level + 1));
        this.previewBase.loadTexture(baseConfig.res, ccui.Widget.LOCAL_TEXTURE);
        this.barTemplate.loadTexture(res.info_bar_png, ccui.Widget.LOCAL_TEXTURE);
        this.barFill.loadTexture(res.info_bar_bg_png, ccui.Widget.LOCAL_TEXTURE);
        this.barIcon.loadTexture(res.gold_capacity_icon_png, ccui.Widget.LOCAL_TEXTURE);

        this._updatePreviewImage(nextLevel);
        this._updateUpgradeCostAndTimeUI();

        if (building.buildingType === "TOW_1") {
            var prerequisites = UpgradeBuildingController.getTownHallUpgradePrerequisites(building, nextLevel);
            if (prerequisites.message && prerequisites.message !== "") {
                this.requirementsStatusLabel.setString(prerequisites.message);
            } else if (prerequisites.met) {
                this.requirementsStatusLabel.setString("Tất cả các công trình yêu cầu đã được xây dựng.");
            } else {
                this.requirementsStatusLabel.setString("Không thể xác định yêu cầu công trình.");
            }
            this.requirementsStatusLabel.setVisible(true);
        } else {
            this.requirementsStatusLabel.setString("");
            this.requirementsStatusLabel.setVisible(false);
        }

        var canActuallyUpgrade = UpgradeBuildingController.canUpgradeBuilding(this.currentBuilding);
        UISetup.enableButton(this.confirmUpgradeButton, canActuallyUpgrade);
        if(!canActuallyUpgrade && building.buildingType !== "TOW_1") {
            this.notiText.setVisible(true);
            this.notiText.setString("Yêu cầu nhà chính cấp: " + this.buildingNextLevelConfig.townHallLevelRequired);
        } else {
            this.notiText.setVisible(false);
        }
    },

    _updatePreviewImage: function(nextLevel) {
        if (!this.previewImage) {
            cc.error("UpgradeBuildingLayer: this.previewImage is null! Cannot update preview.");
            return;
        }
        this.previewImage.loadTexture("", ccui.Widget.LOCAL_TEXTURE);
        if (!(this.currentBuilding && this.buildingNextLevelConfig)) {
            return;
        }
        var buildingType = this.currentBuilding.buildingType;
        var assetPath = AssetUtils.getBuildingLevelIdleAssetPath(buildingType, nextLevel);
        if (assetPath) {
            this.previewImage.loadTexture(assetPath, ccui.Widget.LOCAL_TEXTURE);
        }
    },

    _updateUpgradeCostAndTimeUI: function() {
        if (!this.buildingNextLevelConfig) {
            this.timeToUpgradeText.setString("N/A");
            this.costAmountText.setString("N/A");
            if (this.costResourceImage) {
                this.costResourceImage.loadTexture("", ccui.Widget.LOCAL_TEXTURE);
            }
            return;
        }
        this.timeToUpgradeText.setString(Utils.formatTime(this.buildingNextLevelConfig.buildTime) || "N/A");
        var cost = 0;
        var costResourceIconPath = "";
        if (this.buildingNextLevelConfig.gold && this.buildingNextLevelConfig.gold > 0) {
            cost = this.buildingNextLevelConfig.gold;
            costResourceIconPath = res.buff_gold_png;
        } else if (this.buildingNextLevelConfig.elixir && this.buildingNextLevelConfig.elixir > 0) {
            cost = this.buildingNextLevelConfig.elixir;
            costResourceIconPath = res.buff_elixir_png;
        }
        this.costAmountText.setString(cost > 0 ? cost.toString() : "0");
        if (this.costResourceImage) {
            this.costResourceImage.loadTexture(costResourceIconPath, ccui.Widget.LOCAL_TEXTURE);
        }
    },

    onCloseButtonClicked: function(){
        UIController.toggleUpgradeBuildingUI(this.mainUIInstance, null);
    },

    // =================================================================
    // HÀM ĐÃ ĐƯỢC TÁI CẤU TRÚC
    // =================================================================
    onUpgradeButtonClicked: function() {
        if (!this.currentBuilding) {
            cc.error("onUpgradeButtonClicked: currentBuilding is null.");
            return;
        }

        // 1. Đóng UI nâng cấp ngay lập tức để người dùng thấy map
        this.onCloseButtonClicked();

        // 2. Tạo actionConfig để gửi cho UseGController
        const actionConfig = {
            actionType: 'UPGRADE',
            target: this.currentBuilding,
            mainUIInstance: this.mainUIInstance,
            onCancel: function() {
                // Logic khi người dùng hủy popup (nếu cần)
                // Ví dụ: có thể mở lại UI này hoặc chỉ đơn giản là không làm gì cả
                cc.log("Upgrade action was canceled by user from gem popup.");
                if (this.mainUIInstance.activeBuilding) {
                    BuildingsController.getInstance().deActivateAsset(this.mainUIInstance, this.mainUIInstance.activeBuilding);
                    this.mainUIInstance.activeBuilding = null;
                }
            }.bind(this)
        };

        // 3. Giao toàn bộ việc cho UseGController
        UseGController.requestAction(actionConfig);
    }
})
