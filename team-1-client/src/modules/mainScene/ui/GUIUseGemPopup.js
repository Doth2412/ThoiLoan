// FinishNowUILayer.js
// UI Layer for the "Finish Now" prompt in construction

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

    popupType: null, // "TIME", "GOLD", "OIL"
    missingAmount: 0,
    resourceType: null,
    gemCost: 0,
    targetAsset: null,
    targetToRush: null,
    originalTargetBuildingType: null,
    userGemConvert: null,
    successCallback: null, 

    ctor: function (path) {
        this._super('ui/UseGemPopUp_0.json', true);
        this._setupUIElements();
    },

    showPopup: function (config) {
        this.popupType = config.type;
        this.missingAmount = config.amount; // For TIME, this is remainingSeconds. For GOLD/OIL, this is resource amount.
        this.resourceType = config.resource || null;
        this.targetAsset = config.target || null;
        this.mainUIInstance = config.mainUIInstance || null;
        this.successCallback = config.successCallback || null; 
        if (config.type === "FREE_BUILDER") {
            this.targetToRush = config.targetToRush;
            this.originalTargetBuildingType = config.originalTargetBuildingType;
        } else {
            this.targetToRush = null;
            this.originalTargetBuildingType = null;
        }
        this._updatePopupUI();
        this.setVisible(true);
    },

    _setupUIElements: function () {
        this.cancelButton.addClickEventListener(this._onCancel.bind(this));
        this.useGemButton.addClickEventListener(this._onConfirm.bind(this));
        UISetup.setupLabel(this.useGemPrompt);
        UISetup.setupLabel(this.userGemConvert);
        UISetup.setupLabel(this.useGemLabel)
        UISetup.setupLabel(this.cancelText)
        UISetup.setupLabel(this.useGemAmountText)
        var parentSize = this.useGemPrompt.getParent().getContentSize();
        this.useGemPrompt.setPosition(cc.p(parentSize.width / 2, parentSize.height / 1.5));
        this.useGemPrompt.setContentSize(cc.size(200, 50));
        this.useGemLabel.setPosition(cc.p(parentSize.width / 2, parentSize.height / 1.1));
    },

    _updatePopupUI: function () {
        if (!this.useGemPrompt || !this.useGemAmountText || !this.convertResourceIcon || !this.userGemConvert) {
            cc.error("GUIUseGemPopup: One or more UI elements are null in _updatePopupUI. Ensure ctor seeks them correctly.");
            return;
        }
        this.gemIcon.loadTexture(res.use_gem_popup_g_png, ccui.Widget.LOCAL_TEXTURE);
        this.useGemLabel.setString("THIẾU TÀI NGUYÊN");
        switch (this.popupType) {
            case "TIME":
                this.gemCost = Utils.getGemCostForTimeFinish(this.missingAmount);
                this.useGemPrompt.setString("Dùng " + this.gemCost + " gem để hoàn thành ngay");
                this.userGemConvert.setString(Utils.formatTime(this.missingAmount));
                this.convertResourceIcon.setVisible(false); // Hide resource icon for TIME type
                break;
            case "GOLD":
                this.gemCost = Utils.getGemCostForGoldFinish(this.missingAmount);
                this.useGemPrompt.setString("Bạn có muốn mua số tài nguyên còn thiếu?");
                this.userGemConvert.setString(this.missingAmount.toString());
                this.convertResourceIcon.setVisible(true);
                this.convertResourceIcon.loadTexture(res.gold_icon_png, ccui.Widget.LOCAL_TEXTURE);
                break;
            case "OIL":
                this.gemCost = Utils.getGemCostForOilFinish(this.missingAmount);
                this.useGemPrompt.setString("Bạn có muốn mua số tài nguyên còn thiếu?");
                this.userGemConvert.setString(this.missingAmount.toString());
                this.convertResourceIcon.setVisible(true);
                this.convertResourceIcon.loadTexture(res.elixir_icon_png, ccui.Widget.LOCAL_TEXTURE);
                break;
            case "FREE_BUILDER":
                this.gemCost = Utils.getGemCostForTimeFinish(this.missingAmount);
                this.useGemPrompt.setString(
                    "Dùng " + this.gemCost + " gem để hoàn thành việc xây dựng "
                );
                this.userGemConvert.setString(this.gemCost.toString());
                this.convertResourceIcon.setVisible(false);
                break;
            default:
                cc.log("GUIUseGemPopup: Unknown popup type: " + this.popupType);
                this.gemCost = 0;
                this.useGemPrompt.setString("Unknown action");
                this.userGemConvert.setString("");
                this.convertResourceIcon.setVisible(false);
        }
        this.useGemAmountText.setString(this.gemCost.toString());
    },

    _onConfirm: function () {
        var playerDataManager = PlayerDataManager.getInstance();

        if (this.popupType === "GOLD" || this.popupType === "OIL") {
            var resourceType = this.popupType.toLowerCase();
            var resourceAmount = 0;
            if(this.popupType === "GOLD") resourceAmount = Utils.getGoldForGemCost(this.gemCost);
            else if (this.popupType === "OIL") resourceAmount = Utils.getOilForGemCost(this.gemCost);
            if (!playerDataManager.canReceiveResources(resourceType, resourceAmount)) {
                cc.log("GUIUseGemPopup: Not enough storage capacity for " + resourceType + ". Purchase blocked.");
                // Optionally, show a user-friendly message here.
                this._handleClose();
                return;
            }
        }
        if (this.popupType === "TIME" || this.popupType === "FREE_BUILDER") {
            var assetToFinish = this.popupType === "FREE_BUILDER" ? this.targetToRush : this.targetAsset;

            // Check if the asset is still valid and in a state that can be rushed.
            if (!assetToFinish || (assetToFinish.buildingState !== BUILDING_STATES.CONSTRUCTING && assetToFinish.buildingState !== BUILDING_STATES.UPGRADING)) {
                cc.log("GUIUseGemPopup: Target asset has already completed its action. Closing popup.");
                this._handleClose();
                return; 
            }

            var now = Math.floor(Date.now() / 1000);
            var finishTime = assetToFinish.finishBuildingTime;
            var remainingTime = Math.max(0, finishTime - now);

            if (remainingTime <= 0) {
                cc.log("GUIUseGemPopup: Remaining time is zero or less. Closing popup.");
                this._handleClose();
                return; // Exit without charging gems
            }
            this.gemCost = Utils.getGemCostForTimeFinish(remainingTime);
        }

        gv.testnetwork.connector.sendUseGRequest({
            usedAmount: this.gemCost,
            resourceType: this.resourceType || "NONE",
        });
        const currentGems = playerDataManager.getResourceAmount("gem");
        if (currentGems < this.gemCost) {
            cc.log("GUIUseGemPopup: Not enough Gems! Needed: " + this.gemCost + ", Available: " + currentGems);
            // TODO: Show a user-friendly "Not enough Gems" message/popup here.
            this._handleClose();
            return;
        }
        playerDataManager.subtractResources("gem", this.gemCost);

        cc.log("GUIUseGemPopup: Successfully subtracted " + this.gemCost + " gems.");

        switch (this.popupType) {
            case "TIME":
                this._handleTimeAction();
                break;
            case "GOLD":
                this._handleResourcePurchase("gold", "GOLD");
                break;
            case "OIL":
                this._handleResourcePurchase("oil", "OIL");
                break;
            case "FREE_BUILDER":
                this._handleFreeBuilder();
                break;
            default:
                cc.warn("GUIUseGemPopup: Confirmed an unknown popup type: " + this.popupType);
                break;
        }

        // Refresh interaction panel if available
        if (
            this.mainUIInstance &&
            this.mainUIInstance.interactionPanel &&
            typeof this.mainUIInstance.interactionPanel.refreshPanelForAsset === 'function' &&
            this.targetAsset
        ) {
            this.mainUIInstance.interactionPanel.refreshPanelForAsset(this.targetAsset);
        }

        // Execute the success callback if present
        if (this.successCallback) {
            this.successCallback();
        }

        this._handleClose();
    },

    _handleClose: function () {
        this.hide();
    },

    _handleTimeAction: function () {
        const asset = this.targetAsset;
        cc.log(this.targetAsset.assetType + "DOTH");
        if (asset.assetType === 'building') {
            if (!asset) {
                this._handleClose();
                return;
            }
            if (asset.buildingState === BUILDING_STATES.CONSTRUCTING) {
                BuildingsManager.getInstance().finishConstructionInstantly(asset);
                asset.setState(BUILDING_STATES.OPERATING);
                asset.finishBuildingTime = Math.floor(Date.now() / 1000);
            } else if (asset.buildingState === BUILDING_STATES.UPGRADING) {
                UpgradeBuildingController.finishUpgradeBuilding(asset);
            }

            cc.eventManager.dispatchCustomEvent("BUILDING_FINISH_NOW_COMPLETE", {targetAsset: asset});
            return;
        }
        if (asset.assetType === 'obstacle') {
            if (!asset) {
                this._handleClose();
                return;
            }
            if (asset.buildingState === BUILDING_STATES.CONSTRUCTING) {
                BuildingsManager.getInstance().onObstacleRemovalComplete(asset);
            }
        }
    },

    _handleResourcePurchase: function (resourceKey, resourceType) {
        const playerDataManager = PlayerDataManager.getInstance();
        if(resourceType === "GOLD") playerDataManager.addResources(resourceKey, Utils.getGoldForGemCost(this.gemCost));
        else if (resourceType === "OIL") playerDataManager.addResources(resourceKey, Utils.getOilForGemCost(this.gemCost));
        cc.log("GUIUseGemPopup: Successfully added " + this.missingAmount + " " + resourceKey + " to player resources.");
        let amountAdded = 0;
        if(resourceType === "GOLD") amountAdded = Utils.getGoldForGemCost(this.gemCost);
        else if (resourceType === "OIL") amountAdded = Utils.getOilForGemCost(this.gemCost);
        if (this.targetAsset) {
            cc.eventManager.dispatchCustomEvent("GEM_PURCHASE_COMPLETE", {
                target: this.targetAsset,
                resourceType: resourceType
            });
        }
    },

    _handleFreeBuilder: function () {
        const buildingToFinish = this.targetToRush;
        if (!buildingToFinish) {
            this._handleClose();
            return;
        }


        if (buildingToFinish.buildingState === BUILDING_STATES.CONSTRUCTING) {
            BuildingsManager.getInstance().finishConstructionInstantly(buildingToFinish);
            buildingToFinish.setState(BUILDING_STATES.OPERATING);
            buildingToFinish.finishBuildingTime = Math.floor(Date.now() / 1000);
            BuilderManager.getInstance().onBuildingOperationComplete(buildingToFinish);
        } else if (buildingToFinish.buildingState === BUILDING_STATES.UPGRADING) {
            UpgradeBuildingController.finishUpgradeBuilding(buildingToFinish);
        }
        cc.eventManager.dispatchCustomEvent("BUILDING_FINISH_NOW_COMPLETE", {targetAsset: buildingToFinish});
    },


    _onCancel: function () {
        this.hide();
        BuildingsController.getInstance().deActivateAsset(this.mainUIInstance, this.mainUIInstance.activeBuilding);
        this.mainUIInstance.activeBuilding = null;
    },
});
