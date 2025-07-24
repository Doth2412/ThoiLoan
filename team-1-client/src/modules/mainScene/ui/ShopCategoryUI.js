var ShopCategoryUI = cc.Layer.extend({
    categoryRootNode: null,
    mainUIInstance: null,
    shopItemTemplate: null,

    // UI Elements from ShopCategory.json
    closeButton: null,
    backButton: null,
    shopTitleLabel: null,
    shopItemScrollView: null,

    goldAmountText: null,
    oilAmountText: null,
    gAmountText: null,

    ctor: function (loadedShopCategoryNode, mainUIInstance) {
        this._super();
        this.categoryRootNode = loadedShopCategoryNode;
        this.mainUIInstance = mainUIInstance;

        var frameSize = cc.director.getOpenGLView().getFrameSize();

        // Create the background overlay
        var backgroundOverlay = new ccui.Layout();
        backgroundOverlay.setContentSize(frameSize);
        backgroundOverlay.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        backgroundOverlay.setBackGroundColor(cc.color(0, 0, 0));
        backgroundOverlay.setBackGroundColorOpacity(150);
        backgroundOverlay.setTouchEnabled(true);
        backgroundOverlay.setAnchorPoint(0.5, 0.5);
        backgroundOverlay.setPosition(frameSize.width / 2, frameSize.height / 2);
        this.addChild(backgroundOverlay, 0);
        this.addChild(this.categoryRootNode, 1);
        this.initShopCategoryUIElements();
    },

    initShopCategoryUIElements: function () {
        var findElement = (name, parent = this.categoryRootNode) => {
            // First, try to find within parent using ccui.helper
            var widget = ccui.helper.seekWidgetByName(parent, name);
            if (widget) return widget;
            return parent.getChildByName(name);
        };

        // Configure shopTitleLabel
        this.shopTitleLabel = findElement("shopTitle");
        UISetup.setupLabel(this.shopTitleLabel);
        this.shopTitleLabel.setString("Shop");

        // Configure closeButton
        this.closeButton = findElement("closeButton");
        this.closeButton.loadTextures(res.close_png, res.button_press_png, res.button_disable_png);
        this.closeButton.addClickEventListener(() => {
            this.mainUIInstance.closeShopViews();
        });

        // Configure backButton
        this.backButton = findElement("backButton");
        if (this.backButton.loadTextures && res.back_png) {
            this.backButton.loadTextures(
                res.back_png,
                res.button_press_png || res.back_png,
                res.button_disable_png || res.back_png,
                ccui.Widget.LOCAL_TEXTURE
            );
        }

        this.backButton.addClickEventListener(() => {
            if (this.mainUIInstance.openMainShopView) {
                this.mainUIInstance.openMainShopView();
            }
        });
        this.backButton.setTitleText("");

        // --- Item Scroll View ---        
        var backPanel = findElement("Panel_1");
        backPanel.setBackGroundImage(res.bg_png, ccui.Widget.LOCAL_TEXTURE);
        backPanel.setBackGroundImageCapInsets(cc.rect(90, 30, 129, 129));

        var panelChildren = backPanel.getChildren();
        for (var i = 0; i < panelChildren.length; i++) {
            var child = panelChildren[i];
            cc.log(
                "Panel child " + i + ": " +
                (child.getName() || "unnamed") +
                " (type: " + (child.__classname__ || "unknown") + ")"
            );
        }
        this.shopItemScrollView = findElement("ShopItem", backPanel);
        var template = findElement("shopSingularItem", this.shopItemScrollView);
        this.shopItemTemplate = template;
        this.shopItemTemplate.retain();
        template.setVisible(false);
        ["ShopSingularItem", "ShopSingularItem_1", "ShopSingularItem_2"].forEach(name => {
            var tempItem = findElement(name, this.shopItemScrollView);
            if (tempItem) tempItem.setVisible(false);
        });
        const goldAmountNode = findElement("goldAmount");
        if (goldAmountNode) {
            if (goldAmountNode.setTexture && res.res_bar_png) {
                goldAmountNode.setTexture(res.res_bar_png);
            }

            const goldIcon = findElement("goldIcon") || findElement("goldIcon", goldAmountNode);
            if (goldIcon.setTexture && res.icon_gold_bar_png) {
                goldIcon.setTexture(res.icon_gold_bar_png);
            }

            this.goldAmountText = findElement("goldAmountText", goldAmountNode);
            UISetup.setupLabel(this.goldAmountText);
        }

        // Initialize oilAmount display
        const oilAmountNode = findElement("oilAmount");
        if (oilAmountNode) {
            if (oilAmountNode.setTexture && res.res_bar_png) {
                oilAmountNode.setTexture(res.res_bar_png);
            }

            const oilIcon = findElement("oilIcon", oilAmountNode);
            if (oilIcon.setTexture && res.icon_elixir_bar_png) {
                oilIcon.setTexture(res.icon_elixir_bar_png);
            }

            this.oilAmountText = findElement("oilIconText", oilAmountNode);
            UISetup.setupLabel(this.oilAmountText);
        }

        // Initialize gAmount display
        const gAmountNode = findElement("gAmount");
        if (gAmountNode) {
            if (gAmountNode.setTexture && res.res_bar_png) {
                gAmountNode.setTexture(res.res_bar_png);
            }

            const gIcon = findElement("gIcon", gAmountNode);
            if (gIcon.setTexture && res.icon_g_bar_png) {
                gIcon.setTexture(res.icon_g_bar_png);
            }

            this.gAmountText = findElement("gAmountText", gAmountNode);
            UISetup.setupLabel(this.gAmountText);
        }

        cc.log("ShopCategoryUI: UI elements initialized.");
    },

    _updateLayout: function() {
        if (!this.categoryRootNode) return;

        // 1. Lấy kích thước màn hình thực tế
        var visibleSize = cc.director.getVisibleSize();
        var visibleOrigin = cc.director.getVisibleOrigin();

        // 2. Lấy kích thước gốc của panel
        var panelSize = this.categoryRootNode.getContentSize();
        if (panelSize.width === 0 || panelSize.height === 0) {
            return; // Bỏ qua nếu panel không có kích thước
        }

        // 3. Tính toán tỷ lệ scale để vừa màn hình
        var scaleX = visibleSize.width / panelSize.width;
        var scaleY = visibleSize.height / panelSize.height;
        var scale = Math.min(scaleX, scaleY);

        // 4. Áp dụng scale và vị trí cho node gốc của UI
        this.categoryRootNode.setScale(scale);
        this.categoryRootNode.setAnchorPoint(0.5, 0.5);
        this.categoryRootNode.setPosition(
            visibleOrigin.x + visibleSize.width / 2,
            visibleOrigin.y + visibleSize.height / 2
        );
    },

    displayCategory: function (categoryName, itemsData) {
        let playerDataManager = PlayerDataManager.getInstance();
        this.goldAmountText.setString(playerDataManager.playerData.gold);
        this.oilAmountText.setString(playerDataManager.playerData.oil);
        this.gAmountText.setString(playerDataManager.playerData.gem);
        this.shopTitleLabel.setString(categoryName.toUpperCase() || "ITEMS");

        this.shopItemScrollView.removeAllChildren();
        for (let i = 0; i < itemsData.length; i++) {
            var itemData = itemsData[i];
            var newItem = this._createAndConfigureShopItem(itemData);
            if (!newItem) continue;
            const itemWidth = newItem.getContentSize().width;
            const itemHeight = newItem.getContentSize().height;
            const margin = 10;
            newItem.setPosition(cc.p((itemWidth + margin) * i + itemWidth / 2, itemHeight / 2));

            this.shopItemScrollView.addChild(newItem);
        }
        const childrenCount = this.shopItemScrollView.getChildrenCount();
        if (childrenCount > 0) {
            const lastItem = this.shopItemScrollView.getChildren()[childrenCount - 1];
            if (lastItem) {
                const totalWidth = lastItem.getPositionX() + lastItem.getContentSize().width / 2;
                var viewHeight = this.shopItemScrollView.getContentSize().height;
                this.shopItemScrollView.setInnerContainerSize(cc.size(totalWidth, viewHeight));
            }
        } else {
            // Handle case with no items, e.g., set inner size to zero or default
            var viewHeight = this.shopItemScrollView.getContentSize().height;
            this.shopItemScrollView.setInnerContainerSize(cc.size(0, viewHeight));
        }
        this.shopItemScrollView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        this.shopItemScrollView.setBounceEnabled(true);


        this._updateLayout();
        this.setVisible(true);
    },

    _createAndConfigureShopItem: function(itemData) {
        var newItem = this.shopItemTemplate.clone();
        newItem.itemData = itemData; // Store item data for click handler
        newItem.setVisible(true);

        var itemConfig = ItemConfigUtils.getBuildingConfig(itemData);
        if(itemData.buildingType === "BDH_1"){
            var bdhCount = BuildingsManager.getInstance().getBuildingCountByType(itemData.buildingType);
            itemConfig = ItemConfigUtils.getBuildingConfig(itemData, bdhCount + 1) ;
        }

        if (!itemConfig) {
            return null;
        }

        // --- Get all UI elements from the template ---
        var itemName = ccui.helper.seekWidgetByName(newItem, "itemName");
        var itemTimeLabel = ccui.helper.seekWidgetByName(newItem, "itemTime");
        var itemTimeIcon = ccui.helper.seekWidgetByName(newItem, "itemTimeIcon");
        var itemLimitLabel = ccui.helper.seekWidgetByName(newItem, "itemLimit");
        var itemCostLabel = ccui.helper.seekWidgetByName(newItem, "itemCost");
        var itemCostTypeSprite = ccui.helper.seekWidgetByName(newItem, "itemCostTypeImage");
        var itemImgSprite = ccui.helper.seekWidgetByName(newItem, "itemImage");
        var itemEffectSprite = ccui.helper.seekWidgetByName(newItem, "backGroundImage");

        // --- Create and add the Info Button ---
        var infoButton = ccui.helper.seekWidgetByName(newItem, "infoButton");
        if (!infoButton) {
            infoButton = new ccui.Button();
            infoButton.setName("infoButton");
            infoButton.loadTextures(res.info_png, res.info_png, "", ccui.Widget.LOCAL_TEXTURE);

            var slotSize = newItem.getContentSize();
            infoButton.setPosition(cc.p(slotSize.width - 35, slotSize.height - 25));

            newItem.addChild(infoButton, 10); // Add with a high z-order

            infoButton.addClickEventListener(function() {
                cc.log("Info button clicked for item: " + itemData.buildingType);

                if (this.mainUIInstance && this.mainUIInstance.buildingInfoUINode) {
                    var buildingDataForInfo = {
                        buildingType: itemData.buildingType,
                        level: 1
                    };

                    this.mainUIInstance.buildingInfoUINode.showInfo(buildingDataForInfo);
                    this.mainUIInstance.buildingInfoUINode.setVisible(true);
                } else {
                    cc.warn("Could not open Building Info UI. mainUIInstance or buildingInfoUINode is not available.");
                }
            }.bind(this));
        }


        // --- Apply standard label setup ---
        UISetup.setupLabel(itemTimeLabel);
        UISetup.setupLabel(itemLimitLabel);
        UISetup.setupLabel(itemCostLabel);

        var thRequirementLabel = ccui.helper.seekWidgetByName(newItem, "thRequirementLabel");
        if (!thRequirementLabel) {
            thRequirementLabel = new ccui.Text("", res.rowdies_regular_29_07_ttf, 16);
            thRequirementLabel.setName("thRequirementLabel");
            newItem.addChild(thRequirementLabel, 5);
            thRequirementLabel.setPosition(cc.p(newItem.getContentSize().width / 2, 60));
            thRequirementLabel.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            thRequirementLabel.setAnchorPoint(cc.p(0.5, 0.5));
        }

        // --- Setup Item Name ---
        itemName.setFontName(res.rowdies_regular_29_07_ttf);
        itemName.enableOutline(cc.color(0, 0, 0), 1);
        itemName.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        itemName.setTextAreaSize(cc.size(newItem.width, 50));
        itemName.setAnchorPoint(cc.p(0.5, 0.5));
        itemName.setPosition(cc.p(newItem.width / 2, newItem.height - 30));
        itemName.setString(BUILDING_UI_CONFIG[itemData.buildingType].name);

        // --- Setup Static Item Info ---
        if (itemTimeLabel) itemTimeLabel.setString(itemConfig.buildTime ? Utils.formatTime(itemConfig.buildTime) : "0");
        if (itemTimeIcon && itemTimeIcon.loadTexture && res.time_png)
            itemTimeIcon.loadTexture(res.time_png, ccui.Widget.LOCAL_TEXTURE);
        if (itemImgSprite && itemImgSprite.loadTexture && itemData.image) {
            itemImgSprite.loadTexture(itemData.image, ccui.Widget.LOCAL_TEXTURE);
        }
        if (itemEffectSprite && itemEffectSprite.loadTexture && res.catalogy_bg2_png) {
            itemEffectSprite.loadTexture(res.catalogy_bg2_png, ccui.Widget.LOCAL_TEXTURE);
        }

        // --- Get Player and Item Data for Logic Checks ---
        var playerData = PlayerDataManager.getInstance().playerData;
        var currentTownHallLevel = BuildingsManager.getInstance().getTownHallLevel();
        var buildingTypeKey = itemData.buildingType;

        var maxAllowedCount = 0;
        var currentTownHallLevelStr = currentTownHallLevel.toString();
        maxAllowedCount = itemData.buildingType !== "BDH_1" ? gv.configs.TownHall["TOW_1"][currentTownHallLevelStr][buildingTypeKey]: 5;
        var currentPlacedCount = BuildingsManager.getInstance().getBuildingCountByType(buildingTypeKey);

        var requiredTownHallLevel = itemConfig.townHallLevelRequired || 1;
        var itemCost = 0;
        var costType = null;
        var costIconRes = null;

        if (itemConfig.gold > 0) {
            itemCost = itemConfig.gold;
            costType = 'gold';
            costIconRes = res.gold_png;
        } else if (itemConfig.elixir > 0) {
            itemCost = itemConfig.elixir;
            costType = 'elixir';
            costIconRes = res.elixir_png;
        } else if (itemConfig.coin > 0) {
            itemCost = itemConfig.coin;
            costType = 'coin'; // Gem
            costIconRes = res.g_png;
        }

        itemCostLabel.setString(itemCost.toString());
        if (costIconRes) {
            itemCostTypeSprite.loadTexture(costIconRes, ccui.Widget.LOCAL_TEXTURE);
        }
        // --- Local Helper function to apply color tints ---
        var applyTintRecursive = function(node, color) {
            if (!node) return;
            // Special case: Keep the info button fully colored and enabled.
            if (node.getName() === 'infoButton') {
                if (typeof node.setColor === 'function') node.setColor(cc.color(255, 255, 255));
                if (typeof node.setTouchEnabled === 'function') node.setTouchEnabled(true);
                return; // Stop recursion for this branch
            }
            if (typeof node.setColor === 'function') {
                node.setColor(color);
            }
            var children = node.getChildren();
            if (children) {
                for (var i = 0; i < children.length; i++) {
                    applyTintRecursive(children[i], color);
                }
            }
        };

        // --- NEW DISPLAY LOGIC ---

        // Rule 3: Town Hall level is too low
        if (currentTownHallLevel < requiredTownHallLevel) {
            thRequirementLabel.setVisible(true);
            thRequirementLabel.setString("Yêu cầu nhà chính cấp " + requiredTownHallLevel);
            thRequirementLabel.setTextColor(cc.color(255, 0, 0));

            itemTimeLabel.setVisible(false);
            itemTimeIcon.setVisible(false);
            itemCostLabel.setVisible(false);
            itemCostTypeSprite.setVisible(false);
            itemLimitLabel.setVisible(false);

            newItem.setTouchEnabled(false); // Disable purchase click
            infoButton.setTouchEnabled(true); // Explicitly enable info button
            applyTintRecursive(newItem, cc.color(128, 128, 128)); // Apply grey tint
        }
        // Rule 2: Max item limit has been reached
        else if (maxAllowedCount > 0 && currentPlacedCount >= maxAllowedCount) {
            thRequirementLabel.setVisible(false);
            itemTimeLabel.setVisible(true);
            itemTimeIcon.setVisible(true);
            itemCostLabel.setVisible(true);
            itemCostTypeSprite.setVisible(true);
            itemLimitLabel.setVisible(true);

            itemLimitLabel.setString(currentPlacedCount + "/" + maxAllowedCount);

            newItem.setTouchEnabled(false); // Disable purchase click
            infoButton.setTouchEnabled(true); // Explicitly enable info button
            applyTintRecursive(newItem, cc.color(128, 128, 128)); // Apply grey tint
            itemCostLabel.setTextColor(cc.color(255, 255, 255)); // Keep cost text normal color within the grey tint
        }
        // Rule 4 & 1: Normal state / Check for resources
        else {
            thRequirementLabel.setVisible(false);
            itemTimeLabel.setVisible(true);
            itemTimeIcon.setVisible(true);
            itemCostLabel.setVisible(true);
            itemCostTypeSprite.setVisible(true);
            itemLimitLabel.setVisible(true);

            itemLimitLabel.setString(currentPlacedCount + "/" + maxAllowedCount);

            newItem.setTouchEnabled(true); // Enable purchase click
            infoButton.setTouchEnabled(true);
            applyTintRecursive(newItem, cc.color(255, 255, 255)); // Restore normal colors

            var hasEnoughResource = false;
            switch (costType) {
                case 'gold': hasEnoughResource = playerData.gold >= itemCost; break;
                case 'elixir': hasEnoughResource = playerData.oil >= itemCost; break;
                case 'coin': hasEnoughResource = playerData.gem >= itemCost; break;
                default: hasEnoughResource = true;
            }

            if (hasEnoughResource) {
                itemCostLabel.setTextColor(cc.color(255, 255, 255));
            } else {
                itemCostLabel.setTextColor(cc.color(255, 80, 80));
            }
        }

        // --- Event Listeners ---
        newItem.addClickEventListener((sender) => {
            cc.log("Item clicked: " + sender.itemData.buildingType);
            if (this.mainUIInstance && this.mainUIInstance.handleItemPurchase) {
                this.mainUIInstance.handleItemPurchase(sender.itemData.buildingType);
            }
        });

        // --- Setup Textures ---
        if (newItem.loadTextureNormal && res.slot_png) {
            newItem.loadTextureNormal(res.slot_png, ccui.Widget.LOCAL_TEXTURE);
        }
        if (newItem.loadTexturePressed && res.button_press_png) {
            newItem.loadTexturePressed(res.button_press_png, ccui.Widget.LOCAL_TEXTURE);
        }
        if (newItem.loadTextureDisabled && res.button_disable_png) {
            newItem.loadTextureDisabled(res.button_disable_png, ccui.Widget.LOCAL_TEXTURE);
        }

        return newItem;
    },

    onExit: function () {
        if (this.shopItemTemplate) {
            this.shopItemTemplate.release();
            this.shopItemTemplate = null;
        }
        this._super();
    }

});