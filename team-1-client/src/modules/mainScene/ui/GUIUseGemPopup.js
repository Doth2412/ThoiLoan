var GUIUseGemPopup = GUIBase.extend({

    useGemPopup: null,
    useGemLabel: null,
    useGemPrompt: null,
    convertResourceIcon: null,
    cancelButton: null,
    cancelText: null,
    useGemButton: null,
    useGemAmountText: null,
    gemIcon: null,

    popupType: null, // "TIME", "GOLD", "OIL", "FREE_BUILDER"
    missingAmount: 0,
    amountToReceive: 0,
    resourceType: null,
    gemCost: 0,
    targetAsset: null,
    targetToRush: null,
    mainUIInstance: null,
    userGemConvert: null,
    successCallback: null,
    cancelCallback: null,

    ctor: function (path) {
        this._super('ui/UseGemPopUp_0.json', true);
        this._setupUIElements();
    },

    showPopup: function (config) {
        this.popupType = config.type;
        this.missingAmount = config.amount;
        this.resourceType = config.resource || null;
        this.targetAsset = config.target || null;
        this.mainUIInstance = config.mainUIInstance || null;
        this.successCallback = config.successCallback || null;
        this.cancelCallback = config.cancelCallback || null;

        if (config.type === "FREE_BUILDER") {
            this.targetToRush = config.targetToRush;
        } else {
            this.targetToRush = null;
        }
        this._updatePopupUI();
        this.setVisible(true);
    },

    _setupUIElements: function () {
        this.cancelButton.addClickEventListener(this._onCancel.bind(this));
        this.useGemButton.addClickEventListener(this._onConfirm.bind(this));
        UISetup.setupLabel(this.useGemPrompt);
        UISetup.setupLabel(this.userGemConvert);
        UISetup.setupLabel(this.useGemLabel);
        UISetup.setupLabel(this.cancelText);
        UISetup.setupLabel(this.useGemAmountText);
        var parentSize = this.useGemPrompt.getParent().getContentSize();
        this.useGemPrompt.setPosition(cc.p(parentSize.width / 2, parentSize.height / 1.5));
        this.useGemPrompt.setContentSize(cc.size(200, 50));
        this.useGemLabel.setPosition(cc.p(parentSize.width / 2, parentSize.height / 1.1));
    },

    _updatePopupUI: function () {
        if (!this.useGemPrompt || !this.useGemAmountText || !this.convertResourceIcon || !this.userGemConvert) {
            return;
        }
        this.gemIcon.loadTexture(res.use_gem_popup_g_png, ccui.Widget.LOCAL_TEXTURE);

        switch (this.popupType) {
            case "TIME":
                this.useGemLabel.setString("HOÀN THÀNH NGAY");
                this.gemCost = Utils.getGemCostForTimeFinish(this.missingAmount);
                this.useGemPrompt.setString("Dùng " + this.gemCost + " gem để hoàn thành ngay");
                this.userGemConvert.setString(Utils.formatTime(this.missingAmount));
                this.convertResourceIcon.setVisible(false);
                break;
            case "GOLD":
            case "OIL":
                if (this.popupType === "GOLD") {
                    this.gemCost = Utils.getGemCostForGoldFinish(this.missingAmount); //
                } else {
                    this.gemCost = Utils.getGemCostForOilFinish(this.missingAmount); //
                }
                if (this.popupType === "GOLD") {
                    this.amountToReceive = Utils.getGoldForGemCost(this.gemCost);
                } else {
                    this.amountToReceive = Utils.getOilForGemCost(this.gemCost);
                }

                this.useGemPrompt.setString("Bạn có muốn dùng " + this.gemCost + " Gem để mua " + this.amountToReceive + " " + this.resourceType + "?");
                this.userGemConvert.setString(this.amountToReceive.toString());
                // =================================================================

                this.convertResourceIcon.setVisible(true);
                var iconRes = (this.popupType === "GOLD") ? res.gold_icon_png : res.elixir_icon_png;
                this.convertResourceIcon.loadTexture(iconRes, ccui.Widget.LOCAL_TEXTURE);
                break;
            case "FREE_BUILDER":
                this.useGemLabel.setString("TẤT CẢ THỢ ĐỀU BẬN");
                this.gemCost = Utils.getGemCostForTimeFinish(this.missingAmount);
                this.useGemPrompt.setString("Dùng " + this.gemCost + " gem để hoàn thành việc xây dựng " + this.targetToRush.buildingType + " và giải phóng thợ?");
                this.userGemConvert.setString(Utils.formatTime(this.missingAmount));
                this.convertResourceIcon.setVisible(false);
                break;
            default:
                this.gemCost = 0;
                this.useGemPrompt.setString("Unknown action");
                this.userGemConvert.setString("");
                this.convertResourceIcon.setVisible(false);
        }
        this.useGemAmountText.setString(this.gemCost.toString());
    },

    _onConfirm: function () {
        var playerDataManager = PlayerDataManager.getInstance();
        var currentGems = playerDataManager.getResourceAmount("gem");

        if (currentGems < this.gemCost) {
            this._handleClose();
            return;
        }
        var cb = this.successCallback;

        playerDataManager.subtractResources("gem", this.gemCost);
        gv.testnetwork.connector.sendUseGRequest({
            usedAmount: this.gemCost,
            resourceType: this.resourceType || "NONE",
        });
        if (this.popupType === "GOLD" || this.popupType === "OIL") {
            // =================================================================
            // SỬA ĐỔI: Cộng đúng lượng tài nguyên đã mua
            // =================================================================
            // Thay vì cộng `this.missingAmount`, hãy cộng `this.amountToReceive`
            playerDataManager.addResources(this.resourceType, this.amountToReceive);
            playerDataManager.notifyResourceUpdate(this.resourceType);
        }

        if (this.popupType === "TIME") {
            this._handleTimeFinish();
        }

        this._handleClose();

        if (cb) {
            cb();
        }
    },

    _handleTimeFinish: function () {
        var assetToFinish = this.targetAsset;
        if (!assetToFinish) return;

        cc.log("GUIUseGemPopup: Finishing task for " + (assetToFinish.buildingType || assetToFinish.obstacleType));
        if (assetToFinish.assetType === 'obstacle') {
            BuildingsManager.getInstance().onObstacleRemovalComplete(assetToFinish);
        } else if (assetToFinish.assetType === 'building') {
            if (assetToFinish.buildingState === BUILDING_STATES.CONSTRUCTING) {
                BuyBuildingController.finishConstructingBuilding(assetToFinish);
            } else if (assetToFinish.buildingState === BUILDING_STATES.UPGRADING) {
                UpgradeBuildingController.finishUpgradeBuilding(assetToFinish);
            }
        }
    },

    _onCancel: function () {
        if (this.cancelCallback) {
            this.cancelCallback();
        }
        this._handleClose();
    },

    _handleClose: function () {
        this.setVisible(false);
        this.successCallback = null;
        this.cancelCallback = null;
        this.targetAsset = null;
        this.targetToRush = null;
    },
});
