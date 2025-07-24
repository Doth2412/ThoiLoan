// UIController.js - UI Management functions extracted from MainScene.js

/**
 * Sets up the main HUD layer from JSON
 * @param {Object} rootNode - The main uiRootNode
 * @param {Object} mainUIInstance - Reference to the main UI instance
 */
function setupHUD(rootNode, mainUIInstance) {
    var uiContainerNodeFromJSON = rootNode.getChildByName("uiContainer");
    uiContainerNodeFromJSON.retain();
    uiContainerNodeFromJSON.removeFromParent(false);
    mainUIInstance.hudLayerInstance = new MainHUDLayer(uiContainerNodeFromJSON, mainUIInstance);
    rootNode.addChild(mainUIInstance.hudLayerInstance, HUD_LAYER_Z_ORDER);
}

/**
 * Sets initial resource values in the HUD
 * @param {Object} mainUIInstance - Reference to the main UI instance
 */
function initHudResources(mainUIInstance) {
    if (mainUIInstance.hudLayerInstance && gv.playerDataManager && mainUIInstance.hudLayerInstance.updateResourceBar) {

        mainUIInstance.hudLayerInstance.updateResourceBar("gold");
        mainUIInstance.hudLayerInstance.updateResourceBar("oil");
        mainUIInstance.hudLayerInstance.updateResourceBar("gem");
        mainUIInstance.hudLayerInstance.updateResourceBar("exp");
    } else {
        cc.log("MainUI: hudLayerInstance or PlayerDataManager.getInstance() is null or missing updateResourceBar method.");
    }
}

/**
 * Creates and adds the interaction panel to the scene
 * @param {Object} mainUIInstance - Reference to the main UI instance
 */
function initInteractionPanel(mainUIInstance) {
    mainUIInstance.interactionPanel = new InteractionPanel(mainUIInstance);
    mainUIInstance.uiRootNode.addChild(mainUIInstance.interactionPanel, HUD_LAYER_Z_ORDER + 1);
}

/**
 * Initializes the main shop UI from JSON
 * @param {Object} mainUIInstance - Reference to the main UI instance
 */
function initShopUI(mainUIInstance) {
    var shopJsonData = ccs.load(res.shop_scene_json);
    var loadedShopNode = shopJsonData.node;
    mainUIInstance.shopUINode = new MainShopUI(loadedShopNode, mainUIInstance);
    mainUIInstance.uiRootNode.addChild(mainUIInstance.shopUINode, SHOP_UI_Z_ORDER);
    mainUIInstance.shopUINode.setVisible(false);
}

/**
 * Initializes the shop category UI from JSON
 * @param {Object} mainUIInstance - Reference to the main UI instance
 */
function initShopCategoryUI(mainUIInstance) {
    var shopCategoryJsonData = ccs.load(res.shop_category_json);
    var loadedShopCategoryNode = shopCategoryJsonData.node;
    mainUIInstance.shopCategoryUINode = new ShopCategoryUI(loadedShopCategoryNode, mainUIInstance);
    mainUIInstance.uiRootNode.addChild(mainUIInstance.shopCategoryUINode, SHOP_CATEGORY_UI_Z_ORDER);
    mainUIInstance.shopCategoryUINode.setVisible(false);
}

function initUpgradeBuildingUI(mainUIInstance) {
    var upgradeBuildingJsonData = ccs.load(res.upgrade_layer_json);
    var loadedUpgradeBuildingLayer = upgradeBuildingJsonData.node;
    mainUIInstance.upgradeBuildingUINode = new UpgradeBuildingLayer(loadedUpgradeBuildingLayer, mainUIInstance);
    mainUIInstance.uiRootNode.addChild(mainUIInstance.upgradeBuildingUINode, UPGRADE_BUILDING_UI_Z_ORDER);
    mainUIInstance.upgradeBuildingUINode.setVisible(false);
    cc.log("MainUI: UpgradeBuidlingUI instance created and added to scene, initially hidden.");
}

function initTrainTroopUI(mainUIInstance) {
    var trainTroopJsonData = ccs.load(res.train_troop_json);
    var trainTroopBuildingLayer = trainTroopJsonData.node;
    mainUIInstance.trainTroopUINode = new TrainTroopLayer(trainTroopBuildingLayer, mainUIInstance);
    mainUIInstance.uiRootNode.addChild(mainUIInstance.trainTroopUINode, UPGRADE_BUILDING_UI_Z_ORDER);
    mainUIInstance.trainTroopUINode.setVisible(false);
    cc.log("MainUI: trainTroopUINode instance created and added to scene, initially hidden.");
}

function initUseGemPopUpPanel(mainUIInstance) {
    mainUIInstance.useGemPopupUINode = new GUIUseGemPopup(res.use_gem_pop_up_0_json);
    mainUIInstance.uiRootNode.addChild(mainUIInstance.useGemPopupUINode, UPGRADE_BUILDING_UI_Z_ORDER + 10); // Higher Z-order
    mainUIInstance.useGemPopupUINode.setVisible(false);
}

function initTroopInfoUI(mainUIInstance) {
    mainUIInstance.troopInfoUINode = new GUITroopInfo(res.troop_info_json);
    mainUIInstance.uiRootNode.addChild(mainUIInstance.troopInfoUINode, UPGRADE_BUILDING_UI_Z_ORDER + 10); // Higher Z-order
    mainUIInstance.troopInfoUINode.setVisible(false);
}

function initBuildingInfoUI(mainUIInstance) {
    mainUIInstance.buildingInfoUINode = new GUIBuildingInfo(res.building_info_ui_json);
    mainUIInstance.uiRootNode.addChild(mainUIInstance.buildingInfoUINode, UPGRADE_BUILDING_UI_Z_ORDER + 10); // Higher Z-order
    mainUIInstance.buildingInfoUINode.setVisible(false);
}

function initBattleOptionsUI(mainUIInstance) {
    mainUIInstance.battleOptionsUINode = new GUIBattleOptions(res.battle_options_ui_json);
    mainUIInstance.uiRootNode.addChild(mainUIInstance.battleOptionsUINode, 100);
    mainUIInstance.battleOptionsUINode.setVisible(false);
}

function openMainShopView(mainUIInstance) {
    if (mainUIInstance.shopCategoryUINode) {
        mainUIInstance.shopCategoryUINode.setVisible(false);
    }
    if (mainUIInstance.shopUINode) {
        mainUIInstance.shopUINode.setVisible(true);
        cc.log("MainUI: Main Shop UI shown.");
    }
}

function openShopCategoryView(mainUIInstance, categoryName, itemsData) {
    if (mainUIInstance.shopUINode) {
        mainUIInstance.shopUINode.setVisible(false);
    }
    if (mainUIInstance.shopCategoryUINode) {
        mainUIInstance.shopCategoryUINode.displayCategory(categoryName, itemsData);
        cc.log("MainUI: Shop Category UI shown for " + categoryName);
    }
}

function closeShopViews(mainUIInstance) {
    if (mainUIInstance.shopUINode && mainUIInstance.shopUINode.isVisible()) {
        mainUIInstance.shopUINode.setVisible(false);
        cc.log("MainUI: Main Shop UI hidden.");
    }
    if (mainUIInstance.shopCategoryUINode && mainUIInstance.shopCategoryUINode.isVisible()) {
        mainUIInstance.shopCategoryUINode.setVisible(false);
        cc.log("MainUI: Shop Category UI hidden.");
    }
}

/**
 * Toggles the main shop UI visibility
 * @param {Object} mainUIInstance - Reference to the main UI instance
 */
function toggleShopUI(mainUIInstance) { // This one opens the MAIN shop.
    var currentlyVisible = mainUIInstance.shopUINode.isVisible();
    if (currentlyVisible) {
        closeShopViews(mainUIInstance);
    } else {
        closeShopViews(mainUIInstance); // FIXME chiu
        mainUIInstance.shopUINode.setVisible(true);
        cc.log("MainUI: Main Shop UI shown.");
    }
}

function toggleTrainTroopUI(mainUIInstance, building) {
    var currentlyVisible = mainUIInstance.trainTroopUINode.isVisible();
    if (currentlyVisible) {
        mainUIInstance.trainTroopUINode.setVisible(false);
        return;
    }
    mainUIInstance.trainTroopUINode._setTargetAsset(building);
    mainUIInstance.trainTroopUINode.setVisible(true);
    cc.log("MainUI: Train Troop UI shown.");
}

function toggleUpgradeBuildingUI(mainUIInstance, building) {
    if (!mainUIInstance.upgradeBuildingUINode) {
        cc.error("UIController.toggleUpgradeBuildingUI: upgradeBuildingUINode is null. Cannot toggle UI. Please check initialization.");
        return;
    }
    var currentlyVisible = mainUIInstance.upgradeBuildingUINode.isVisible();
    if (currentlyVisible) {
        mainUIInstance.upgradeBuildingUINode.setVisible(false);
        return;
    }
    mainUIInstance.upgradeBuildingUINode.setTargetAsset(building); 
    mainUIInstance.upgradeBuildingUINode.setVisible(true);
    cc.log("MainUI: UpgradeBuildingUI shown for building: " + (building && building.buildingType ? building.buildingType : "N/A"));
}


function toggleBattleOptionsUI(mainUIInstance) {
    var currentlyVisible = mainUIInstance.battleOptionsUINode.isVisible();
    if (currentlyVisible) {
        mainUIInstance.battleOptionsUINode.setVisible(false);
        return;
    }
    mainUIInstance.battleOptionsUINode.setVisible(true);
}


function showUseGemPopupWithOptions(mainUIInstance, popupConfig) {
    mainUIInstance.useGemPopupUINode.showPopup(popupConfig);
}

function handleItemPurchase(mainUIInstance, itemID) {
    var centerX = 20;
    var centerY = 20;

    var buildingData = {
        buildingName: itemID,
        posX: centerX,
        posY: centerY,
        level: 1
    };

    UIController.closeShopViews(mainUIInstance);
    BuyBuildingController.startBuyBuilding(mainUIInstance, buildingData);
}


function showFinishNowUI(targetAsset, mainScene) {
    if (!targetAsset || !(targetAsset.buildingState === BUILDING_STATES.CONSTRUCTING || targetAsset.buildingState === BUILDING_STATES.UPGRADING)) {
        cc.warn("UIController.showFinishNowUI: Invalid targetAsset or asset not constructing/upgrading. State: " + (targetAsset ? targetAsset.buildingState : 'N/A'));
        return;
    }

    var now = Math.floor(Date.now() / 1000);
    var finishTime = targetAsset.finishBuildingTime;

    if (typeof finishTime !== 'number' || finishTime <= now) {
        cc.warn("UIController.showFinishNowUI: No valid future finishTime found on asset or process already completed. Finish time: " + finishTime);
        if (mainScene && mainScene.interactionPanel && typeof mainScene.interactionPanel.refreshPanelForAsset === 'function') {
            mainScene.interactionPanel.refreshPanelForAsset(targetAsset);
        }
        return;
    }

    var remainingTime = Math.max(0, finishTime - now);

    var popupConfig = {
        type: "TIME",
        amount: remainingTime,
        target: targetAsset,
        mainUIInstance: mainScene
    };
    showUseGemPopupWithOptions(mainScene, popupConfig);
}

window.UIController = {
    setupHUD: setupHUD,
    initHudResources: initHudResources,
    initInteractionPanel: initInteractionPanel,
    initShopUI: initShopUI,
    initShopCategoryUI: initShopCategoryUI,
    initUpgradeBuildingUI: initUpgradeBuildingUI,
    initUseGemPopUpPanel: initUseGemPopUpPanel,
    initTrainTroopUI: initTrainTroopUI,
    openMainShopView: openMainShopView,
    openShopCategoryView: openShopCategoryView,
    closeShopViews: closeShopViews,
    toggleShopUI: toggleShopUI,
    toggleUpgradeBuildingUI: toggleUpgradeBuildingUI,
    showUseGemPopupWithOptions: showUseGemPopupWithOptions,
    handleItemPurchase: handleItemPurchase,
    toggleTrainTroopUI: toggleTrainTroopUI,
    showFinishNowUI: showFinishNowUI,
    initTroopInfoUI: initTroopInfoUI,
    initBuildingInfoUI: initBuildingInfoUI,
    initBattleOptionsUI: initBattleOptionsUI,
    toggleBattleOptionsUI: toggleBattleOptionsUI,
};