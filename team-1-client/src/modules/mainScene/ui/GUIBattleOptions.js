MAX_LEVEL = 10
var GUIBattleOptions = GUIBase.extend({
    latestStage: 10,
    lastSelectDungeon: null,
    resourceData: [],
    isFirstSearch: true, // Flag for matchmaking cost

    /**
     * Constructor for BattleOptionsUI.
     */
    ctor: function(path) {
        this._super(path, true);
        this._findAndSetFont(this._rootNode);
        this._initEventListeners();
        this.resLoot.setVisible(false);
    },

    onEnter: function() {
        this._super();
        this._refreshUIData();
    },

    _refreshUIData: function() {
        this._preLoadData();
        this._initDungeonNodes();
        this._loadProgress();
        this.resLoot.setVisible(false);
    },

    _findAndSetFont: function(node) {
        var nodeName = node.getName();
        if (nodeName && (nodeName.endsWith("Text") || nodeName.endsWith("Label"))) {
            node.setFontName(res.rowdies_regular_29_07_ttf);
            node.enableOutline(cc.color(0, 0, 0), 1);
        }
        var children = node.getChildren();
        for (var i = 0; i < children.length; i++) {
            this._findAndSetFont(children[i]);
        }
    },

    _preLoadData: function (){
        this.resourceData = [];
        // Load the map data from the PlayerDataManager or JSON files.
        this.prestigeLabel.setString(PlayerDataManager.getInstance().playerData.prestigePoint);
        var playerMaps = PlayerDataManager.getInstance().playerData.playerMaps;
        for (var i = 1; i <= this.latestStage; i++) {
            var mapData = playerMaps.find(map => map.mapIndex === i);
            if (mapData) {
                this.resourceData.push({gold: mapData.remainingGold, elixir: mapData.remainingElixir, stars: mapData.stars});
            } else {
                var jsonStr = jsb.fileUtils.getStringFromFile(res["_" + i + "_map"]);
                var defaultMapData = JSON.parse(jsonStr);
                this.resourceData.push({gold: defaultMapData.resourse.gold, elixir: defaultMapData.resourse.elixir, stars: 0});
            }
        }
    },

    _updateLayout: function() {
        if (!this._rootNode) return;

        var visibleSize = cc.director.getVisibleSize();
        var visibleOrigin = cc.director.getVisibleOrigin();
        var panelSize = this._rootNode.getContentSize();

        if (panelSize.width === 0 || panelSize.height === 0) return;

        // 1. Tính toán tỷ lệ scale cho cả hai chiều
        var scaleX = visibleSize.width / panelSize.width;
        var scaleY = visibleSize.height / panelSize.height;

        // 2. Dùng Math.min để chọn tỷ lệ nhỏ hơn, đảm bảo giao diện luôn nằm gọn trong màn hình
        var scale = Math.min(scaleX, scaleY);

        // 3. Áp dụng scale và căn giữa giao diện
        this._rootNode.setScale(scale);
        this._rootNode.setAnchorPoint(0.5, 0.5);
        this._rootNode.setPosition(
            visibleOrigin.x + visibleSize.width / 2,
            visibleOrigin.y + visibleSize.height / 2
        );
    },

    /**
     * Initializes event listeners for the primary buttons on this UI.
     * @private
     */
    _initEventListeners: function() {

        var closeButton = this.closeBackground.getChildByName("closeButton");
        if (closeButton) {
            closeButton.addClickEventListener(this.onCloseClicked.bind(this));
        }
        if (this.startConquer) {
            this.startConquer.addClickEventListener(this.onStartConquerClicked.bind(this));
        }
        cc.eventManager.addCustomListener(BattleEvents.BATTLE_ENDED_UPDATE_GUI, this._onBattleEndedUpdateGUI.bind(this));
        cc.eventManager.addCustomListener(BattleEvents.FIND_BATTLE_RESPONSE, this._onFindBattleResponse.bind(this));
    },

    _onBattleEndedUpdateGUI: function(event) {
        if (!cc.sys.isObjectValid(this)) {
            cc.log("GUIBattleOptions: _onBattleEndedUpdateGUI called but GUI object is invalid. Skipping update.");
            return;
        }
        var eventData = event.getUserData();
        var mapIndex = eventData.mapIndex;
        var stars = eventData.stars;
        var remainingGold = eventData.remainingGold;
        var remainingElixir = eventData.elixir;

        // Update resourceData
        var index = mapIndex - 1;
        if (this.resourceData[index]) {
            this.resourceData[index].stars = stars;
            this.resourceData[index].gold = remainingGold;
            this.resourceData[index].elixir = remainingElixir;
        }

        this._updateDungeonNodeDisplay(mapIndex);
        this._loadProgress();

        if (this.lastSelectDungeon === mapIndex) {
            this.goldLootLabel.setString(remainingGold);
            this.elixirLootLabel.setString(remainingElixir);
        }
    },

    _updateDungeonNodeDisplay: function(levelNumber) {
        var node = this["lv" + levelNumber];
        if (!node || !node.getParent()) { 
            return;
        }

        // Update stars display
        var stars = this.resourceData[levelNumber - 1].stars;
        for (var j = 1; j <= 3; j++) {
            var starNode = node.getChildByName("star" + j);
            if (starNode && starNode.getParent()) { 
                if (j <= stars) {
                    starNode.loadTexture(res.star_single_map_png, ccui.Widget.LOCAL_TEXTURE);
                } else {
                    starNode.loadTexture(res.nen_sao_png, ccui.Widget.LOCAL_TEXTURE);
                }
            }
        }
    },

    /**
     * Loops through all the loaded dungeon level nodes (lv1, lv2, etc.)
     * and attaches logic to their internal buttons.
     * @private
     */
    _initDungeonNodes: function() {
        // Loop through all 10 level nodes defined in the JSON.
        for (var i = 1; i <= 10; i++) {
            cc.log(i + "th dungeon node initialized.");
            if(i <= this.latestStage) {
                this._setActiveDungeonNode(i);
            }
            else this._setInactiveDungeonNode(i);
            var node = this["lv" + i];
            if(i === 2 || i % 5 === 0) node.loadTextureNormal(res.icon_point_png, ccui.Widget.LOCAL_TEXTURE);
            else node.loadTextureNormal(res.icon_006_png, ccui.Widget.LOCAL_TEXTURE);
            node.addClickEventListener(this._selectDungeonNode.bind(this, i));
            var atkButton = node.getChildByName("atkButton");
            atkButton.addClickEventListener(this._onAttackNodeClicked.bind(this, i));

            // Update stars display
            var stars = this.resourceData[i - 1].stars;
            for (var j = 1; j <= 3; j++) {
                var starNode = node.getChildByName("star" + j);
                if (starNode) {
                    if (j <= stars) {
                        starNode.loadTexture(res.star_single_map_png, ccui.Widget.LOCAL_TEXTURE);
                    } else {
                        starNode.loadTexture(res.nen_sao_png, ccui.Widget.LOCAL_TEXTURE);
                    }
                }
            }
        }
    },

    _loadProgress: function () {
        var totalStars = MAX_LEVEL * 3;
        var playerMaps = PlayerDataManager.getInstance().playerData.playerMaps;
        var currentStars = playerMaps.reduce(function(total, map) {
            return total + map.stars;
        }, 0);
        this.starAccuLabel.setString(currentStars + "/" + totalStars);
    },
        
    _setActiveDungeonNode: function(levelNumber) {
        var children = this["lv" + levelNumber].getChildren();
        children.forEach(function(child) {
            if (child.getName() !== "levelText") {
                child.setVisible(false);
            }
        });
    },

    _setInactiveDungeonNode: function(levelNumber) {
        var node = this["lv" + levelNumber];
        var children = node.getChildren();
        children.forEach(function(child) {
            if (child.getName() !== "levelText") {
                child.setVisible(false);
            }
        });
        UISetup.enableButton(node);
    },

    _selectDungeonNode: function(levelNumber) {
        var children = this["lv" + levelNumber].getChildren();
        children.forEach(function(child) {
            child.setVisible(true);
        });
        cc.log("Level number " + levelNumber + " selected.");
        if(!this.resLoot.isVisible()) this.resLoot.setVisible(true);
        this.goldLootLabel.setString(this.resourceData[levelNumber - 1].gold);
        this.elixirLootLabel.setString(this.resourceData[levelNumber - 1].elixir);
        if(this.lastSelectDungeon && this.lastSelectDungeon !== levelNumber) {
            this._setActiveDungeonNode(this.lastSelectDungeon);
        }
        this.lastSelectDungeon = levelNumber;
    },

    /**
     * Handles clicks on the "Attack" button within a dungeon node.
     * @param {number} levelNumber - The level number of the node that was clicked.
     * @private
     */
    _onAttackNodeClicked: function(levelNumber) {
        var BattleSceneWrapper = cc.Layer.extend({
            ctor:function () {
                this._super();
                var actualBattleLayer = new BattleScene(levelNumber);
                this.addChild(actualBattleLayer);
            }
        });
        fr.view(BattleSceneWrapper);
    },


    /**
     * Handles the click event for the main "Conquer" button.
     */
    onStartConquerClicked: function() {
        cc.log("Start Conquer button clicked! Sending FIND_BATTLE request. isFirstSearch: " + this.isFirstSearch);
        var playerData = PlayerDataManager.getInstance().playerData;
        
        // Check if player has enough gold
        var cost = 50;
        if (playerData.gold < cost) {
            cc.log("Not enough gold for matchmaking. Cost: " + cost + ", Player gold: " + playerData.gold);
            // TODO: Show a popup to the user
            return;
        }

        // Deduct gold on the client-side immediately
        PlayerDataManager.getInstance().subtractResources("gold", cost);
        cc.log("Deducted " + cost + " gold for matchmaking. Remaining gold: " + PlayerDataManager.getInstance().getResourceAmount("gold"));

        gv.testnetwork.connector.sendFindBattleRequest(playerData.username, playerData.prestigePoint);
        this.isFirstSearch = false; // Set to false after the first search
    },

    _onFindBattleResponse: function(event) {
        var eventData = event.getUserData();
        if (eventData.success) {
            cc.log("GUIBattleOptions: _onFindBattleResponse - Opponent found! Success: " + eventData.success + ", Opponent: " + eventData.opponent.username);
            
            this.isFirstSearch = true; // Reset for the next session

            // Store opponent data in BattleManager
            var battleManager = BattleManager.getInstance();
            battleManager.setOpponent(eventData.opponent);

            var PVPBattleSceneWrapper = cc.Layer.extend({
                ctor:function () {
                    this._super();
                    cc.log("GUIBattleOptions: PVPBattleSceneWrapper ctor called.");
                    var troopToFightData = PlayerDataManager.getInstance().playerData.army;
                    var actualPVPBattleLayer = new PVPBattleScene(eventData.opponent, troopToFightData);
                    this.addChild(actualPVPBattleLayer);
                }
            });
            cc.log("GUIBattleOptions: Calling fr.view(PVPBattleSceneWrapper).");
            fr.view(PVPBattleSceneWrapper);
        } else {
            cc.log("No opponent found: " + eventData.message);
            // TODO: Display a message to the user that no opponent was found
        }
    },

    /**
     * Handles the click event for the close button.
     */
    onCloseClicked: function() {
        this.isFirstSearch = true; // Reset matchmaking search session
        this.setVisible(false);
    },

    /**
     * Override the show method to add custom logic if needed.
     */
    show: function() {
        this.setVisible(true);
        lastSelectDungeon = null;

        // You could add an animation here.
        cc.log("BattleOptionsUI shown.");
    },

    /**
     * Override the hide method to add custom logic if needed.
     */
    hide: function() {
        this.setVisible(false);
        cc.log("BattleOptionsUI hidden.");
    }
});
