var MainShopUI = cc.Layer.extend({
    shopRootNode: null,
    shopBackGround: null,
    topBarNode: null,
    itemCategoriesPanel: null,

    closeButton: null,
    backButton: null,
    shopTitleLabel: null,

    treasureShopButton: null,
    resourceGeneratorShopButton: null,
    decorationShopButton: null,
    armyShopButton: null,
    defenseShopButton: null,
    shieldShopButton: null,
    mainUIInstance: null,

    ctor: function(loadedShopNode, mainUIInstance) {
        this._super();
        this.shopRootNode = loadedShopNode;
        this.mainUIInstance = mainUIInstance;
        var frameSize = cc.director.getOpenGLView().getFrameSize();

        // Create the background overlay
        var backgroundOverlay = new ccui.Layout();
        backgroundOverlay.setContentSize(frameSize);
        backgroundOverlay.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        backgroundOverlay.setBackGroundColor(cc.color(0, 0, 0));
        backgroundOverlay.setBackGroundColorOpacity(150); // Semi-transparent black
        backgroundOverlay.setTouchEnabled(true); // This swallows touches
        backgroundOverlay.setAnchorPoint(0.5, 0.5);
        backgroundOverlay.setPosition(frameSize.width / 2, frameSize.height / 2);
        this.addChild(backgroundOverlay, 0);
        this.addChild(this.shopRootNode, 1);
        this.initShopUIElements();
    },

    initShopUIElements: function() {
        var findElement = (name, parent = this.shopRootNode) => {
            var widget = ccui.helper.seekWidgetByName(parent, name);
            if (widget) return widget;
            return parent.getChildByName(name); // Original fallback
        };

        // --- Get Main Containers ---
        this.topBarNode = findElement("res_info_1");
        this.itemCategoriesPanel = findElement("Panel_1");
        //this.topBarNode.setTexture(res.res_info_png);

        // Find and set up UI elements
        this.closeButton = findElement("closeButton");
        this.backButton = findElement("backButton");
        this.shopTitleLabel = findElement("shopTitle");
        UISetup.setupLabel(this.shopTitleLabel);
        this.shopTitleLabel.setString = "Cửa hàng"; // Default title, can be changed later

        this.closeButton.loadTextures(
            res.close_png,
            res.button_press_png,
            res.button_disable_png,
            ccui.Widget.LOCAL_TEXTURE
        );
        this.closeButton.addClickEventListener(() => {
            this.setVisible(false);
        });

        this.backButton.loadTextures(
            res.back_png,
            res.button_press_png || res.back_png,
            res.button_disable_png,
            ccui.Widget.LOCAL_TEXTURE
        );
        this.backButton.addClickEventListener(() => {
            if (this.mainUIInstance && this.mainUIInstance.toggleShopUI) {
                this.mainUIInstance.toggleShopUI();
            }
        });

        this.itemCategoriesPanel.setBackGroundImage(res.bg_png, ccui.Widget.LOCAL_TEXTURE);
        this.itemCategoriesPanel.setBackGroundImageScale9Enabled(true);
        this.itemCategoriesPanel.setBackGroundImageCapInsets(cc.rect(90, 30, 129, 129));

        this.treasureShopButton = findElement("treasureShopItem", this.itemCategoriesPanel); //
        this.resourceGeneratorShopButton = findElement("resourceGeneratorShopItem", this.itemCategoriesPanel); //
        this.decorationShopButton = findElement("decorationShopItem", this.itemCategoriesPanel); //
        this.armyShopButton = findElement("armyShopItem", this.itemCategoriesPanel); //
        this.defenseShopButton = findElement("defenseShopItem", this.itemCategoriesPanel); //
        this.shieldShopButton = findElement("shieldShopItem", this.itemCategoriesPanel); //


        var _setupCategoryItemTextures = (button, iconRes, labelText) => {
            if (!button) {
                cc.warn("MainShopUI: Button instance is null for category: " + labelText);
                return;
            }

            // Load default button textures
            if (button.loadTextures) {
                button.loadTextures(
                    res.slot_catalogy___copy_png,
                    res.slot_catalogy___press_png,
                    res.button_disable_png,
                    ccui.Widget.LOCAL_TEXTURE
                );
            }

            // Set background effect
            const effectSprite = findElement("effect", button);
            if (effectSprite.setTexture && res.catalogy_bg_png) {
                effectSprite.setTexture(res.catalogy_bg_png);
            }

            // Set icon image
            const itemImageSprite = findElement("shopItemImage", button);
            if (itemImageSprite.setTexture) {
                if (iconRes) {
                    itemImageSprite.setTexture(iconRes);
                } else {
                    cc.warn("MainShopUI: Invalid or undefined iconRes for '${button.getName() || categoryId}/shopItemImage");
                }
            }

            // Set item name and background
            const itemNameBgSprite = findElement("shopItemName", button);
            if (!itemNameBgSprite) {
                cc.warn("MainShopUI: Could not find 'shopItemName' sprite in button: " + (button.getName() || categoryName));
                return;
            }

            if (itemNameBgSprite.setTexture && res.title_background_png) {
                itemNameBgSprite.setTexture(res.title_background_png);
            }

            const itemNameTextNode = findElement("shopItemNameText", itemNameBgSprite);
            UISetup.setupLabel(itemNameTextNode);
            if (!itemNameTextNode.setString) {
                cc.warn("MainShopUI: Could not find or set text for 'shopItemNameText' in button: " + (button.getName() || categoryName));
                return;
            }

            // Configure the item label text
            itemNameTextNode.setString(labelText);

            if (itemNameTextNode instanceof ccui.Text) {
                const bgSize = itemNameBgSprite.getContentSize();
                const textAreaWidth = bgSize.width * 0.95;
                const textAreaHeight = bgSize.height * 0.90;

                itemNameTextNode.setTextAreaSize(cc.size(textAreaWidth, textAreaHeight));
                itemNameTextNode.ignoreContentAdaptWithSize(false);
                itemNameTextNode.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

                if (typeof cc.VERTICAL_TEXT_ALIGNMENT_CENTER !== 'undefined') {
                    itemNameTextNode.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                } else if (typeof cc.VERTICAL_ALIGNMENT_CENTER !== 'undefined') {
                    itemNameTextNode.setTextVerticalAlignment(cc.VERTICAL_ALIGNMENT_CENTER);
                }
            }

            // Click event to open category view
            button.addClickEventListener(() => {
                if (!this.mainUIInstance.openShopCategoryView) return;

                let items = [];
                switch (labelText) {
                    case "Tài nguyên":
                        items = [
                            { buildingType: "RES_1", image: res.res_1_png},
                            { buildingType: "RES_2", image: res.res_2_png },
                            { buildingType: "STO_1", image: res.sto_1_png },
                            { buildingType: "STO_2", image: res.sto_2_png },
                            { buildingType: "BDH_1", image: res.bdh_1_png }
                        ];
                        break;
                    // case "Ngân khố":
                    //     items = [
                    //         { name: "Small Gold Pack", time: "0s", limit: "∞", cost: "100", costTypeIcon: res.g_png, image: res.gold_png },
                    //         { name: "Medium Gold Pack", time: "0s", limit: "∞", cost: "500", costTypeIcon: res.g_png, image: res.gold_png }
                    //     ];
                    //     break;
                    case "Quân đội":
                        items = [
                            { buildingType: "BAR_1", image: res.bar_1_png },
                            { buildingType: "BAR_2", image: res.bar_2_png },
                            { buildingType: "AMC_1", image: res.amc_1_png }
                        ];
                        break;
                    case "Phòng thủ":
                        items = [
                            { buildingType: "DEF_1", image: res.def_1_png},
                            { buildingType: "DEF_2", image: res.def_2_png },

                        ];
                        break;
                    //     break;
                    // case "Trang trí":
                    //     items = [
                    //         { name: "Flag", time: "0s", limit: "5/5", cost: "100", costTypeIcon: res.gold_png, image: res.flag_png }
                    //     ];
                    //     break;
                    // case "Bảo vệ":
                    //     items = [
                    //         { name: "Shield (1 day)", time: "0s", limit: "1/1", cost: "100", costTypeIcon: res.g_png, image: res.shield_png }
                    //     ];
                    //     break;
                }

                this.mainUIInstance.openShopCategoryView(labelText, items);
            });
        };

        // Calls to _setupCategoryItemTextures with appropriate res variables for icons
        _setupCategoryItemTextures(this.treasureShopButton, res.type_buy_res_png, "Ngân khố"); //
        _setupCategoryItemTextures(this.resourceGeneratorShopButton, res.type_res_png, "Tài nguyên"); //
        _setupCategoryItemTextures(this.armyShopButton, res.type_army_png, "Quân đội"); //
        _setupCategoryItemTextures(this.decorationShopButton, res.type_dc_png, "Trang trí"); //
        _setupCategoryItemTextures(this.defenseShopButton, res.type_defense_png, "Phòng thủ"); //
        _setupCategoryItemTextures(this.shieldShopButton, res.type_sheild_png, "Bảo vệ"); //

        cc.log("MainShopUI: UI elements initialized. References obtained and listeners set up.");
    },
    // --- Placeholder for future methods ---
    // No changes needed here based on the request.

    _updateLayout: function() {
        if (!this.shopRootNode) return;

        var visibleSize = cc.director.getVisibleSize();
        var visibleOrigin = cc.director.getVisibleOrigin();
        var panelSize = this.shopRootNode.getContentSize();

        if (panelSize.width === 0 || panelSize.height === 0) return;

        var scaleX = visibleSize.width / panelSize.width;
        var scaleY = visibleSize.height / panelSize.height;
        var scale = Math.min(scaleX, scaleY);

        this.shopRootNode.setScale(scale);
        this.shopRootNode.setAnchorPoint(0.5, 0.5);
        this.shopRootNode.setPosition(
            visibleOrigin.x + visibleSize.width / 2,
            visibleOrigin.y + visibleSize.height / 2
        );
    },

    // --- BƯỚC 2: GỌI HÀM SỬA LAYOUT KHI PANEL ĐƯỢC HIỂN THỊ ---
    setVisible: function(isVisible) {
        // Gọi hàm gốc của Cocos
        this._super(isVisible);

        // Nếu panel đang được BẬT, thì cập nhật lại layout
        if (isVisible) {
            this._updateLayout();
        }
    },

    show: function(){
        this.getParent().setVisible(true);
    },

    hide: function(){
        this.getParent().setVisible(false);
    },
});