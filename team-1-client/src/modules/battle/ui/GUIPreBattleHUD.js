var GUIPreBattleHUD = GUIBase.extend({
    troopToFightData: {},
    troopFromArmyData: {},
    battleScene: null,

    // --- Properties for housing space ---
    maxHousingSpace: 0,
    currentHousingSpaceUsed: 0,

    ctor: function (path, mapIndex, battleScene) {
        this._super(path);
        this.mapIndex = mapIndex;
        this.battleScene = battleScene;

        // Disable touch on container panels to allow clicks to pass through.
        // This might not be necessary if the scroll views inside them handle touches correctly.
        // Keep commented out unless you encounter issues with touches not passing through.
        // if (this.topPanel) this.topPanel.setTouchEnabled(false);
        // if (this.botPanel) this.botPanel.setTouchEnabled(false);

        this._loadDataFromConfig(mapIndex);
        this._initListener();
        this._initHUD();

        // Call _updateLayout during initialization to set initial positions
        this._updateLayout();
    },

    onEnter: function() {
        this._super();
        // Call _updateLayout again when entering the scene to ensure correct positioning
        // if the screen size has changed (e.g., orientation change).
        this._updateLayout();
        // Ensure fonts are applied to all relevant UI elements.
        this._findAndSetFont(this._rootNode);
    },

    onExit: function() {
        this._super();
        // Clean up listeners if necessary, but Cocos2d-x usually handles this for nodes removed from parent.
    },

    /**
     * Updates the layout of UI elements for responsiveness.
     */
    _updateLayout: function() {
        if (!this._rootNode) return;

        // Do not scale the root node; we will control the position of each component individually.
        this._rootNode.setScale(1);
        var visibleSize = cc.director.getVisibleSize();
        var visibleOrigin = cc.director.getVisibleOrigin();

        // ĐIỂM NEO (0, 0): Gốc của node nằm ở góc dưới bên trái của chính nó.
        this._rootNode.setAnchorPoint(0, 0);

        // VỊ TRÍ (origin.x, origin.y): Đặt gốc của node trùng với gốc của màn hình hiển thị.
        this._rootNode.setPosition(visibleOrigin.x, visibleOrigin.y);
        const PADDING_VERTICAL_TOP = 8; // Vertical padding from the top edge
        const PADDING_VERTICAL_BOTTOM = 20; // Vertical padding from the bottom edge

        // Get UI groups by name (assuming _syncNodeVariables in GUIBase maps them)
        var sceneText = this.sceneText;
        var topPanel = this.topPanel;
        var botPanel = this.botPanel;
        var homeButton = this.homeButton;
        var suggestTroopButton = this.suggestTroopButton;
        var fightButton = this.fightButton;
        var topDevelopingText = this.topDevelopingText;
        var botDevelopingText = this.botDevelopingText;
        var troopToFight = this.troopToFight;     // Scroll view for troops to fight (left-top)
        var spellToFight = this.spellToFight;     // Scroll view for spells to fight (right-top)
        var troopFromArmy = this.troopFromArmy;   // Scroll view for troops from army (left-bottom)
        var spellFromArmy = this.spellFromArmy;   // Scroll view for spells from army (right-bottom)
        var troopCapLabel = this.troopCapLabel;   // Label "Lính: 0/20"
        var spellCapLabel = this.spellCapLabel;   // Label "Bình phép: 0/0"


        // 1. Pin sceneText (large title) to the top-center
        if (sceneText) {
            sceneText.setAnchorPoint(0.5, 1); // Anchor at center-top
            sceneText.setPosition(
                visibleOrigin.x + visibleSize.width / 2,
                visibleOrigin.y + visibleSize.height - PADDING_VERTICAL_TOP
            );
        }

        // 2. Pin topPanel to the upper-middle of the main area
        if (topPanel) {
            topPanel.setAnchorPoint(0.5, 0.5); // Anchor at the center of the panel
            // The topPanel's design height is 40% of the scene's design height (640 * 0.4 = 256)
            const actualTopPanelHeight = visibleSize.height * 0.3; // Maintain height ratio
            // Set content size to fill full width, no horizontal padding for the panel itself
            topPanel.setContentSize(visibleSize.width, actualTopPanelHeight);

            // Position Y: Based on its PrePosition.Y (0.8) relative to the scene's height
            topPanel.setPosition(
                visibleOrigin.x + visibleSize.width / 2,
                visibleOrigin.y + visibleSize.height * 0.83 // Relative center Y position
            );

            // [FIXED] Pin troopToFight (scroll view trên-trái) inside topPanel
            if (troopToFight) {
                // troopToFight's design PrePosition: {X: 0.3, Y: 0.4} relative to topPanel
                // troopToFight's design PreSize: {X: 0.599, Y: 0.5} relative to topPanel (width 575/960, height 128/256)
                // Use design height for scroll view to prevent content clipping
                const troopToFightDesignHeight = 128;
                const troopToFightWidth = topPanel.getContentSize().width * 0.599; // Use the ratio from JSON

                troopToFight.setContentSize(troopToFightWidth, troopToFightDesignHeight);
                troopToFight.setAnchorPoint(0.5, 0.5); // Anchor at center of the scroll view

                // Position X: Based on its designed PrePositionX (0.3) relative to topPanel's width
                // Position Y: Center vertically within the available space in topPanel
                troopToFight.setPosition(
                    topPanel.getContentSize().width * 0.3,
                    topPanel.getContentSize().height / 2 // Center vertically within topPanel
                );
            }

            // [FIXED] Pin spellToFight (scroll view trên-phải) inside topPanel
            if (spellToFight) {
                // spellToFight's design PrePosition: {X: 0.8, Y: 0.4} relative to topPanel
                // spellToFight's design PreSize: {X: 0.3, Y: 0.5} relative to topPanel (width 288/960, height 128/256)
                // Use design height for scroll view to prevent content clipping
                const spellToFightDesignHeight = 128;
                const spellToFightWidth = topPanel.getContentSize().width * 0.3; // Use the ratio from JSON

                spellToFight.setContentSize(spellToFightWidth, spellToFightDesignHeight);
                spellToFight.setAnchorPoint(0.5, 0.5); // Anchor at center of the scroll view

                // Position X: Based on its designed PrePositionX (0.8) relative to topPanel's width
                // Position Y: Center vertically within the available space in topPanel
                spellToFight.setPosition(
                    topPanel.getContentSize().width * 0.85,
                    topPanel.getContentSize().height / 2 // Center vertically within topPanel
                );
            }

            if (troopCapLabel) {
                troopCapLabel.setAnchorPoint(0, 0.5); // Anchor at left-center
                // Original PrePosition: {X: 0.12, Y: 0.2} relative to topPanel
                // topPanel.getContentSize().height * 0.2 is its original Y.
                // We need to move it up slightly.
                troopCapLabel.setPosition(
                    0, // Keep original X ratio
                    topPanel.getContentSize().height * 0.25 // Move up from 0.2 to 0.3
                );
            }

            // [FIXED] Adjust position for spellCapLabel (Bình phép: 0/0)
            if (spellCapLabel) {
                spellCapLabel.setAnchorPoint(0, 0.5); // Anchor at left-center
                // Original PrePosition: {X: 0.6573, Y: 0.2033} relative to topPanel
                // We need to move it up slightly and to the right.
                spellCapLabel.setPosition(
                    topPanel.getContentSize().width * 0.7, // Move to the right from 0.6573 to 0.7
                    topPanel.getContentSize().height * 0.25 // Move up from 0.2033 to 0.3
                );
            }
        }

        // 3. Pin botPanel to the bottom-middle
        if (botPanel) {
            botPanel.setAnchorPoint(0.5, 0); // Anchor at center-bottom
            // The botPanel's design height is 20% of the scene's design height (640 * 0.2 = 128)
            const actualBotPanelHeight = visibleSize.height * 0.2; // Maintain height ratio
            // Set content size to fill full width, no horizontal padding for the panel itself
            botPanel.setContentSize(visibleSize.width, actualBotPanelHeight);

            botPanel.setPosition(
                visibleOrigin.x + visibleSize.width / 2,
                visibleOrigin.y + PADDING_VERTICAL_BOTTOM // Place with padding from the bottom edge
            );

            // [FIXED] Pin troopFromArmy (scroll view dưới-trái) inside botPanel
            if (troopFromArmy) {
                // troopFromArmy's design PrePosition: {X: 0.3, Y: 0.5} relative to botPanel
                // troopFromArmy's design PreSize: {X: 0.599, Y: 0.8} relative to botPanel (width 575/960, height 102.4/128)
                // Use design height for scroll view to prevent content clipping
                const troopFromArmyDesignHeight = 102.4;
                const troopFromArmyWidth = botPanel.getContentSize().width * 0.6; // Use the ratio from JSON

                troopFromArmy.setContentSize(troopFromArmyWidth, troopFromArmyDesignHeight);
                troopFromArmy.setAnchorPoint(0.5, 0.5); // Anchor at center of the scroll view

                // Position X: Based on its designed PrePositionX (0.3) relative to botPanel's width
                // Position Y: Center vertically within botPanel
                troopFromArmy.setPosition(
                    botPanel.getContentSize().width * 0.3,
                    botPanel.getContentSize().height * 0.3// Center vertically
                );
            }

            // [FIXED] Pin spellFromArmy (scroll view dưới-phải) inside botPanel
            if (spellFromArmy) {
                // spellFromArmy's design PrePosition: {X: 0.8, Y: 0.5} relative to botPanel
                // spellFromArmy's design PreSize: {X: 0.3, Y: 0.8} relative to botPanel (width 288/960, height 102.4/128)
                // Use design height for scroll view to prevent content clipping
                const spellFromArmyDesignHeight = 102.4;
                const spellFromArmyWidth = botPanel.getContentSize().width * 0.3; // Use the ratio from JSON

                spellFromArmy.setContentSize(spellFromArmyWidth, spellFromArmyDesignHeight);
                spellFromArmy.setAnchorPoint(0.5, 0.5); // Anchor at center of the scroll view

                // Position X: Based on its designed PrePositionX (0.8) relative to botPanel's width
                // Position Y: Center vertically within botPanel
                spellFromArmy.setPosition(
                    botPanel.getContentSize().width * 0.85,
                    botPanel.getContentSize().height * 0.3 // Center vertically
                );
            }
        }

        // 4. Pin control buttons based on their relative positions in the design
        // These buttons are in the space between topPanel and botPanel.
        // Their Y positions are calculated relative to the bottom of the screen, similar to PrePosition.Y in JSON.
        // Home Button: PrePositionX: 0.3, PrePositionY: 0.25
        if (homeButton) {
            homeButton.setAnchorPoint(0.5, 0.5); // Anchor at the center of the button
            homeButton.setPosition(
                visibleOrigin.x + visibleSize.width * 0.3, // X based on 0.3 ratio
                visibleOrigin.y + visibleSize.height * 0.25 // Y based on 0.25 ratio
            );
        }

        // Suggest Troop Button: PrePositionX: 0.5, PrePositionY: 0.265
        if (suggestTroopButton) {
            suggestTroopButton.setAnchorPoint(0.5, 0.5);
            suggestTroopButton.setPosition(
                visibleOrigin.x + visibleSize.width * 0.5, // X based on 0.5 ratio (center)
                visibleOrigin.y + visibleSize.height * 0.265 // Y based on 0.265 ratio (slightly higher than Home/Fight)
            );
        }

        // Fight Button: PrePositionX: 0.7, PrePositionY: 0.25
        if (fightButton) {
            fightButton.setAnchorPoint(0.5, 0.5);
            fightButton.setPosition(
                visibleOrigin.x + visibleSize.width * 0.7, // X based on 0.7 ratio
                visibleOrigin.y + visibleSize.height * 0.25 // Y based on 0.25 ratio
            );
        }

        if (topDevelopingText) {
            topDevelopingText.setAnchorPoint(0.5, 0.5);
            topDevelopingText.setPosition(
                visibleOrigin.x + visibleSize.width * 0.85, // Use PrePositionX from JSON relative to Scene
                visibleOrigin.y + visibleSize.height * 0.83 // Use PrePositionY from JSON relative to Scene
            );
        }

        if (botDevelopingText) {
            botDevelopingText.setAnchorPoint(0.5, 0.5);
            botDevelopingText.setPosition(
                visibleOrigin.x + visibleSize.width * 0.85, // Use PrePositionX from JSON relative to Scene
                visibleOrigin.y + visibleSize.height * 0.1 // Use PrePositionY from JSON relative to Scene
            );
        }
    },

    /**
     * Loads troop data based on the battle type (PvE or PvP).
     * @param {number|string} mapIndex - The map index for PvE or an identifier string for PvP.
     */
    _loadDataFromConfig: function(mapIndex){
        this.troopFromArmyData = {};
        this.troopToFightData = {};

        // Check if it's a PvE battle (mapIndex is a number)
        if (typeof mapIndex === 'number') {
            var troopSuggestionConfig = JSON.parse(jsb.fileUtils.getStringFromFile(res.troop_suggestions_json));
            var troopSuggestion = troopSuggestionConfig["MAP_" + mapIndex];

            // Defensive check in case the mapIndex is invalid
            if (!troopSuggestion) {
                cc.error("GUIPreBattleHUD: No troop suggestion found for MAP_" + mapIndex);
                this.maxHousingSpace = 200; // Default fallback
                return;
            }

            this.maxHousingSpace = troopSuggestion.totalHousingSpace;
            for (var key in troopSuggestion) {
                if (Object.prototype.hasOwnProperty.call(troopSuggestion, key) && key.startsWith("ARM_")) {
                    this.troopFromArmyData[key] = { amount: troopSuggestion[key] };
                }
            }
        }
        // Handle PvP battle (mapIndex is a string, e.g., "VS PlayerName")
        else {
            cc.log("GUIPreBattleHUD: Setting up for PvP battle.");
            var buildingManager = BuildingsManager.getInstance();
            this.maxHousingSpace = buildingManager.getTotalHousingSpace();
            // Load all troops from the player's army camps
            const armyCampData = PlayerDataManager.getInstance().getArmy();
            cc.log("GUIPreBattleHUD: Processing army data: " + JSON.stringify(armyCampData));
            armyCampData.forEach(troop => {
                if (troop.troopAmount > 0) {
                    this.troopFromArmyData[troop.troopType] = { amount: troop.troopAmount };
                }
            });
        }
    },

    _initHUD: function() {
        this.currentHousingSpaceUsed = 0;
        this._updateHousingSpaceLabel();
        this._updateTroopFromArmyUI();
        this._updateTroopToFightUI();
        // Initialize spell scroll views as well
        this.spellToFight.getChildren().forEach(slot => { this._setEmptySlot(slot); });
        this.spellFromArmy.getChildren().forEach(slot => { this._setEmptySlot(slot); });

        // Ensure these text nodes are children of the correct panels if not already
        // This is typically handled by Cocos Studio JSON loading, but can be a fallback.
        // if (!this.topPanel.getChildByName(this.topDevelopingText.getName())) {
        //     this.topPanel.addChild(this.topDevelopingText);
        // }
        // if (!this.botPanel.getChildByName(this.botDevelopingText.getName())) {
        //     this.botPanel.addChild(this.botDevelopingText);
        // }

        this.topDevelopingText.enableOutline(cc.color(255, 0, 0), 1);
        this.topDevelopingText.ignoreContentAdaptWithSize(true);
        this.botDevelopingText.enableOutline(cc.color(255, 0, 0), 1);
        this.botDevelopingText.ignoreContentAdaptWithSize(true);
        this.troopCapLabel.setString("Lính: " + this.currentHousingSpaceUsed + "/" + this.maxHousingSpace);

        // Apply font to all labels in the HUD.
        // This is also called in onEnter, but here ensures it's done after initial HUD setup.
        this._findAndSetFont(this._rootNode);
    },

    _initListener: function() {
        this.troopFromArmy.getChildren().forEach(slot => {
            slot.addClickEventListener(() => {
                this._addTroopToFight(slot.troopType);
            });
        });
        this.troopToFight.getChildren().forEach(slot => {
            const deductButton = slot.getChildByName("deductButton");
            if (deductButton) {
                deductButton.addClickEventListener(() => {
                    if(slot.troopType) this._deduceTroopFromFight(slot.troopType);
                });
            }
        });
        this.homeButton.addClickEventListener(this._onHomeButtonClicked.bind(this));
        this.fightButton.addClickEventListener(this._onFightButtonClicked.bind(this));

        // The suggest button should be hidden in PvP
        if(this.suggestTroopButton) {
            if (typeof this.mapIndex === 'string') {
                this.suggestTroopButton.setVisible(false);
            } else {
                this.suggestTroopButton.addClickEventListener(this._onSuggestTroopButtonClicked.bind(this));
            }
        }
    },

    _addTroopToFight: function(troopType) {
        if (!troopType) return;

        const troopBaseConfig = ItemConfigUtils.getTroopBaseConfig(troopType, 1);
        if (!troopBaseConfig || !troopBaseConfig.housingSpace) {
            cc.error("Missing housingSpace in config for: " + troopType);
            return;
        }

        if (this.currentHousingSpaceUsed + troopBaseConfig.housingSpace > this.maxHousingSpace) {
            cc.log("Not enough housing space!");
            this.troopCapLabel.runAction(cc.sequence(cc.tintTo(0.1, 255, 0, 0), cc.delayTime(0.2), cc.tintTo(0.1, 255, 255, 255)));
            return;
        }

        this.currentHousingSpaceUsed += troopBaseConfig.housingSpace;
        if (this.troopToFightData[troopType]) {
            this.troopToFightData[troopType].amount++;
        } else {
            this.troopToFightData[troopType] = { amount: 1 };
        }

        this._updateTroopToFightUI();
        this._updateHousingSpaceLabel();
    },

    _deduceTroopFromFight: function(troopType) {
        if (!troopType || !this.troopToFightData[troopType]) return;

        const troopBaseConfig = ItemConfigUtils.getTroopBaseConfig(troopType, 1);
        if (!troopBaseConfig || !troopBaseConfig.housingSpace) return;

        this.currentHousingSpaceUsed -= troopBaseConfig.housingSpace;
        this.troopToFightData[troopType].amount--;

        if (this.troopToFightData[troopType].amount <= 0) {
            delete this.troopToFightData[troopType];
        }

        this._updateTroopToFightUI();
        this._updateHousingSpaceLabel();
    },

    _onSuggestTroopButtonClicked: function() {
        this.troopToFightData = {};
        this.currentHousingSpaceUsed = 0;
        this._updateHousingSpaceLabel();
        this._updateTroopToFightUI();

        var troopSuggestionConfig = JSON.parse(jsb.fileUtils.getStringFromFile(res.troop_suggestions_json));
        var troopSuggestion = troopSuggestionConfig["MAP_" + this.mapIndex];
        if (!troopSuggestion) return;

        for (var troopType in troopSuggestion) {
            if (Object.prototype.hasOwnProperty.call(troopSuggestion, troopType) && troopType.startsWith("ARM_")) {
                const amountToAdd = troopSuggestion[troopType];
                for (let i = 0; i < amountToAdd; i++) {
                    this._addTroopToFight(troopType);
                }
            }
        }
    },

    _updateHousingSpaceLabel: function() {
        if(this.troopCapLabel) {
            this.troopCapLabel.setString("Lính: " + this.currentHousingSpaceUsed + "/" + this.maxHousingSpace);
        }
    },

    _updateTroopFromArmyUI: function() {
        const availableTroopTypes = Object.keys(this.troopFromArmyData).sort((a, b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));
        const slots = this.troopFromArmy.getChildren();
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            const troopType = availableTroopTypes[i];
            if (troopType) {
                // For the bottom panel, we just show the icon, not the amount.
                this._setupSlot(slot, troopType, 0, false);
            } else {
                this._setEmptySlot(slot);
            }
        }
    },

    _updateTroopToFightUI: function() {
        const sortedTroopTypes = Object.keys(this.troopToFightData).sort((a, b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));
        const slots = this.troopToFight.getChildren();
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            const troopType = sortedTroopTypes[i];
            if (troopType) {
                this._setupSlot(slot, troopType, this.troopToFightData[troopType].amount, true);
            } else {
                this._setEmptySlot(slot);
            }
        }
    },

    _setupSlot: function(slot, troopType, amount, showAmount) {
        slot.troopType = troopType;
        slot.getChildren().forEach(child => child.setVisible(true));
        UISetup.enableButton(slot, true);
        slot.loadTextureNormal(res.slot_troop_battle_png);
        slot.getChildByName("troopIcon").loadTexture(res[troopType.toLowerCase() + "_battle_png"]);
        const amountLabel = slot.getChildByName("amountLabel");
        amountLabel.setVisible(showAmount);
        if (showAmount) {
            amountLabel.setString("x" + amount);
        }
    },

    _setEmptySlot: function(slot) {
        slot.troopType = "";
        slot.getChildren().forEach(child => child.setVisible(false));
        slot.loadTextureDisabled(res.slot_empty_png || res.slot_troop_battle_png);
        UISetup.enableButton(slot, false);
    },

    _onHomeButtonClicked: function(){
        fr.view(UIManager);
    },

    _onFightButtonClicked: function(){
        var parentScene = this.getParent();
        parentScene.loadTroopToFight(this.troopToFightData);
    },

    /**
     * Recursively finds and sets the font for Text/Label nodes.
     * Skips nodes that already have a font defined in the JSON (e.g., amountLabel, button texts).
     * @param {cc.Node} node - The current node to process.
     */
    _findAndSetFont: function (node) {
        if (!node) return;
        var nodeName = node.getName();

        // Check if the node is a Text node (ccui.Text) or has a name ending with "Label" or "Text".
        // Also, skip specific labels that already have their font defined in preBattleUI.json.
        if ((node.ctor === ccui.Text || (nodeName && (nodeName.endsWith("Label") || nodeName.endsWith("Text")))) &&
            nodeName !== "amountLabel" && nodeName !== "homeText" && nodeName !== "fightText" && nodeName !== "suggestTroopLabel") {
            node.setFontName(res.rowdies_regular_29_07_ttf);
            node.enableOutline(cc.color(0, 0, 0), 1);
        }
        var children = node.getChildren();
        for (var i = 0; i < children.length; i++) {
            this._findAndSetFont(children[i]);
        }
    }
});
