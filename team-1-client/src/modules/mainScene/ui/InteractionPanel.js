// InteractionPanel.js
// A reusable UI panel to show interaction options for selected game assets.

var InteractionPanel = ccui.Layout.extend({
    targetAsset: null, // The building or obstacle this panel is for
    buttons: [],       // Array to hold the created buttons
    mainSceneRef: null, // Reference to the MainUI/MainScene instance

    ctor: function (mainSceneInstance) {
        this._super();
        this.mainSceneRef = mainSceneInstance;
        var visibleSize = cc.director.getVisibleSize();
        var visibleOrigin = cc.director.getVisibleOrigin();
        const PADDING_BOTTOM = 0;

        this.setAnchorPoint(0.5, 0);
        var designWidth = this.mainSceneRef.uiRootNode.getContentSize().width;
        this.setContentSize(designWidth * 0.8, 120);
        this.setPosition(
            visibleOrigin.x + visibleSize.width / 2,
            visibleOrigin.y + PADDING_BOTTOM
        );
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_NONE);
        this.setBackGroundColor(cc.color(0, 0, 0, 0));
        this.setVisible(false);
        this.setTouchEnabled(true);
        this.setSwallowTouches(false); // Ngăn click xuyên qua panel

        return true;
    },

    showPanel: function (assetData, actions) {
        this.targetAsset = assetData;
        this.removeAllChildren();
        this.buttons = [];

        if (!actions || actions.length === 0) {
            cc.log("InteractionPanel: No actions provided for " + (assetData.name || assetData.type || assetData.id));
            this.setVisible(false);
            return;
        }

        var panelWidth = this.getContentSize().width;
        var panelHeight = this.getContentSize().height;
        var buttonSize = {width: 80, height: 80}; // Fixed button size
        var buttonMargin = 30; // Increased margin between buttons
        var buttonFontSize = 14; // Slightly smaller font for better fit
        var createdButtons = [];

        actions.forEach(function (action) {
            var button = new ccui.Button();
            button.setTouchEnabled(true);
            button.setPressedActionEnabled(true);
            button.setScale9Enabled(true);
            button.setContentSize(buttonSize.width, buttonSize.height);
            var label = new ccui.Text(action.label, res.rowdies_regular_29_07_ttf, buttonFontSize);
            var labelDimensions = cc.size(buttonSize.width, buttonSize.height);
            label.setTextAreaSize(labelDimensions);
            label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            label.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            label.enableOutline(cc.color(0, 0, 0), 1);
            label.setAnchorPoint(0.5, 0.5);
            button.addChild(label);
            label.setPosition(buttonSize.width * 3 / 5, buttonSize.height / 2.5);

            var texturesLoaded = false;
            button.loadTextures(action.iconRes.normal, action.iconRes.pressed, action.iconRes.disabled || "", ccui.Widget.LOCAL_TEXTURE);
            texturesLoaded = true;
            var isButtonEnabled = action.isEnabled !== false; // Default to enabled if not specified
            button.setTouchEnabled(isButtonEnabled);

            if (!isButtonEnabled) {
                // Set visual state for disabled button
                button.setColor(cc.color(128, 128, 128)); // Gray out the button
                button.setOpacity(150); // Make it semi-transparent
                label.setColor(cc.color(100, 100, 100)); // Gray out the label
                cc.log("InteractionPanel: Button '" + action.label + "' set to disabled state");
            } else {
                // Ensure button is in normal state
                button.setColor(cc.color.WHITE);
                button.setOpacity(255);
                label.setColor(cc.color.WHITE);
            }

            if (action.label === "Tháo dỡ") { // "Tháo dỡ" is "Remove"
                var obstacleConfig = ItemConfigUtils.getBuildingConfig({buildingType: this.targetAsset.obstacleType});
                if (obstacleConfig) {
                    var cost = obstacleConfig.gold || obstacleConfig.elixir || 0;
                    var iconRes = obstacleConfig.gold ? res.gold_icon_png : res.elixir_icon_png;
                    var resourceType = obstacleConfig.gold ? 'gold' : 'oil';
                    var costLabel = new ccui.Text(cost.toString(), res.rowdies_regular_29_07_ttf, 18);
                    costLabel.setAnchorPoint(0.5, 0.5);
                    costLabel.enableOutline(cc.color(0,0,0), 1);

                    var playerHasEnough = PlayerDataManager.getInstance().getResourceAmount(resourceType) >= cost;
                    if (!playerHasEnough) {
                        costLabel.setColor(cc.color.RED); // Set text to red if not enough resources
                    }

                    // Create the resource icon
                    var costIcon = new cc.Sprite(iconRes);
                    costIcon.setScale(0.5); // Scale the icon down

                    // Position them at the top of the button
                    var btnSize = button.getContentSize();
                    costLabel.setPosition(btnSize.width / 2 + 10, btnSize.height * 0.85);
                    costIcon.setPosition(btnSize.width / 2 - 20, btnSize.height * 0.85);

                    button.addChild(costIcon);
                    button.addChild(costLabel);
                }
            }

            if (typeof action.callback === 'function') {
                button.addClickEventListener(function () {
                    // Only execute callback if button is enabled
                    if (isButtonEnabled) {
                        // Guard: Ensure asset is defined
                        if (!this.targetAsset) {
                            cc.warn("InteractionPanel: Tried to invoke action callback but targetAsset is undefined!");
                            return;
                        }
                        cc.log("InteractionPanel: Button '" + action.label + "' clicked for asset: " + (this.targetAsset.name || this.targetAsset.buildingType || this.targetAsset.id));
                        action.callback.call(null, this.targetAsset, this.mainSceneRef);
                        this.hidePanel();
                    } else {
                        cc.log("InteractionPanel: Button '" + action.label + "' clicked but is disabled - ignoring");
                    }
                }.bind(this));
            }
            createdButtons.push(button);
        }, this);

        // Center all buttons
        var totalWidth = (buttonSize.width * createdButtons.length) + (buttonMargin * (createdButtons.length - 1));
        var startX = (panelWidth - totalWidth) / 2;

        createdButtons.forEach(function (button, index) {
            var xPos = startX + (index * (buttonSize.width + buttonMargin)) + buttonSize.width / 2;
            button.setPosition(xPos, panelHeight / 2);
            this.addChild(button);
            this.buttons.push(button);
        }, this);

        this.setVisible(true);
        cc.log("InteractionPanel shown for: " + assetData.buildingType + " with " + createdButtons.length + " actions.");
    },

    hidePanel: function () {
        this.setVisible(false);
        this.targetAsset = null;
        cc.log("InteractionPanel hidden.");
    }
});