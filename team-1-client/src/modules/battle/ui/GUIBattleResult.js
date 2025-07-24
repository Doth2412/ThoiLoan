/**
 * GUIResultUI Class
 *
 * This class represents the battle result screen that appears at the end of a battle.
 * It extends GUIBase and loads its layout from 'res/resultUI.json'.
 * It displays the outcome (win/loss), stars earned, and resources looted.
 */
var GUIResultUI = GUIBase.extend({
    _templateSlot: null,

    /**
     * Constructor for GUIResultUI.
     */
    ctor: function () {
        this._super(res.result_ui_json);
        var bgShadow = this.backGroundShadow;
        if (bgShadow) {
            bgShadow.retain();
            bgShadow.removeFromParent(false);
            this.addChild(bgShadow, -1);
            bgShadow.release();

            var visibleSize = cc.director.getVisibleSize();
            var visibleOrigin = cc.director.getVisibleOrigin();
            var bgShadowWidthScale = visibleSize.width / bgShadow.getContentSize().width;
            // ĐIỂM NEO (0, 0): Gốc của node nằm ở góc dưới bên trái của chính nó.
            bgShadow.setAnchorPoint(0, 0);
            bgShadow.setScaleX(bgShadowWidthScale)
            // VỊ TRÍ (origin.x, origin.y): Đặt gốc của node trùng với gốc của màn hình hiển thị.
            bgShadow.setPosition(visibleOrigin.x, visibleOrigin.y);
        }

        // --- CÁC HÀM KHỞI TẠO CŨ CỦA BẠN ĐƯỢC GIỮ NGUYÊN ---
        this._initButtonListeners();

        // Set prestige elements to invisible by default
        if (this.prestigeAmountLabel) this.prestigeAmountLabel.setVisible(false);
        if (this.prestigeIcon) this.prestigeIcon.setVisible(false);
        if (this.line3) this.line3.setVisible(false);

        if (this.troopUsed) {
            var template = this.troopUsed.getChildByName("slot1");
            if (template) {
                this._templateSlot = template.clone();
                this._templateSlot.retain();
            }
            this.troopUsed.removeAllItems();
        }
    },

    /**
     * onExit is called when the node leaves the scene.
     */
    onExit: function() {
        this._super();
        if (this._templateSlot) {
            this._templateSlot.release();
            this._templateSlot = null;
        }
    },

    onEnter: function() {
        this._super();
        if (this.effect) {
            var rotateAction = cc.rotateBy(10, 360); // Rotate 360 degrees over 10 seconds
            this.effect.runAction(cc.repeatForever(rotateAction));
        }
    },

    _initButtonListeners: function() {
        if (this.homeButton) {
            this.homeButton.addClickEventListener(this._onHomeButtonClicked.bind(this));
        }
    },

    _onHomeButtonClicked: function() {
        cc.log("Return to home button clicked.");
        fr.view(UIManager);
    },

    updateStats: function(stars, lootedGold, lootedElixir, usedTroops, prestigeChange) {
        cc.log("Updating Result UI. Stars: " + stars + ", Gold: " + lootedGold + ", Elixir: " + lootedElixir);

        // Set prestige elements to invisible by default
        if (this.prestigeAmountLabel) this.prestigeAmountLabel.setVisible(false);
        if (this.prestigeIcon) this.prestigeIcon.setVisible(false);
        if (this.line3) this.line3.setVisible(false);

        if(stars > 0){
            this.resultLabel.setColor(cc.color(255, 165, 0));
            this.resultLabel.setString("THẮNG");
        }
        else{
            this.resultLabel.setColor(cc.color(127, 127, 127));
            this.resultLabel.setString("THUA");
        }

        if (this.goldAmountLabel) {
            this.goldAmountLabel.setString(Math.floor(lootedGold).toLocaleString());
        }
        if (this.elixirAmountLabel) {
            this.elixirAmountLabel.setString(Math.floor(lootedElixir).toLocaleString());
        }

        // Show Prestige Point display only if prestigeChange is provided
        if (typeof prestigeChange !== 'undefined' && prestigeChange !== null) {
            if (this.prestigeAmountLabel) {
                this.prestigeAmountLabel.setString((prestigeChange > 0 ? "+" : "") + prestigeChange.toLocaleString());
                this.prestigeAmountLabel.setColor(cc.color(255, 215, 0)); // Gold color
                this.prestigeAmountLabel.enableOutline(cc.color(0, 0, 0), 1); // Black outline
                this.prestigeAmountLabel.setVisible(true);
            }
            if (this.prestigeIcon) this.prestigeIcon.setVisible(true);
            if (this.line3) this.line3.setVisible(true);
        }

        this.star1.loadTexture(stars >= 1 ? res.small_star_png : res.sao_den_2_png, ccui.Widget.LOCAL_TEXTURE);
        this.star2.loadTexture(stars >= 2 ? res.big_star_png : res.sao_den_png, ccui.Widget.LOCAL_TEXTURE);
        this.star3.loadTexture(stars >= 3 ? res.small_star_png : res.sao_den_2_png, ccui.Widget.LOCAL_TEXTURE);

        this._updateUsedTroopsDisplay(usedTroops || {});
    },

    _updateUsedTroopsDisplay: function(usedTroops) {
        if (!this._templateSlot) return;

        this.troopUsed.removeAllItems();

        var troopTypes = Object.keys(usedTroops);

        var sectionVisible = troopTypes.length > 0;
        this.usedTroopText.setVisible(sectionVisible);
        this.troopUsed.setVisible(sectionVisible);

        if (!sectionVisible) return;

        troopTypes.sort();

        for (var i = 0; i < troopTypes.length; i++) {
            var troopType = troopTypes[i];
            var amount = usedTroops[troopType];

            var newSlot = this._templateSlot.clone();
            newSlot.setSize(cc.size(55, 62));

            var troopIcon = newSlot.getChildByName("troopIcon");
            var amountLabel = newSlot.getChildByName("amountLabel");
            amountLabel.setFontName(res.rowdies_regular_29_07_ttf);
            amountLabel.enableOutline(cc.color(0, 0, 0), 1);

            if (troopIcon) {
                var iconResource = res[troopType.toLowerCase() + "_battle_png"];
                if (iconResource) {
                    troopIcon.loadTexture(iconResource, ccui.Widget.LOCAL_TEXTURE);
                }
            }

            if (amountLabel) {
                amountLabel.setString("x" + amount);
            }

            this.troopUsed.pushBackCustomItem(newSlot);
            var troopCount = troopTypes.length;
            if (troopCount > 0) {
                var itemMargin = this.troopUsed.getItemsMargin();
                var slotWidth = 55;
                var totalContentWidth = (troopCount * slotWidth) + ((troopCount - 1) * itemMargin);
                this.troopUsed.setContentSize(cc.size(totalContentWidth, this.troopUsed.height));
            }
        }
    }
});
