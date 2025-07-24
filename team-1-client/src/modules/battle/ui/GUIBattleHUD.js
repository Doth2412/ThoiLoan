var GUIBattleHUD = GUIBase.extend({
    mapIndex: null,
    currentGold: null,
    currentElixir: null,
    initialTroopToFightData: null,
    _lootUpdateListener: null,
    _playerResourceListener: null,
    _starsUpdateListener: null,
    _buildingDestroyedListener: null,
    _findBattleResponseListener: null,
    _star1Animated: false,
    _star2Animated: false,
    _star3Animated: false,
    winLabel: null,
    loseLabel: null,


    ctor: function (path, mapIndex, isPVPBattle = false) {
        this._super(path);
        this.mapIndex = mapIndex;
        this.isPVPBattle = isPVPBattle;
        this.troopToFightData = {};
        this.initialTroopToFightData = {};
        this.selectedTroopType = null;
        this.uiSlots = [];
        this._setupSlotUI();
        this._initButtonListeners();


        var listener1 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: BattleEvents.LOOT_UPDATED,
            callback: this._onResourceUpdate.bind(this)
        });
        cc.eventManager.addListener(listener1, this);

        var listener2 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: BattleEvents.STARS_UPDATED,
            callback: this._onStarsUpdated.bind(this)
        });
        cc.eventManager.addListener(listener2, this);

        var listener3 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: PLAYER_DATA_EVENTS.RESOURCE_UPDATED,
            callback: this._onPlayerResourceUpdated.bind(this)
        });
        cc.eventManager.addListener(listener3, this);

        var listener4 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: BattleEvents.BUILDING_DESTROYED,
            callback: this._onBuildingDestroyed.bind(this)
        });
        cc.eventManager.addListener(listener4, this);

        var listener5 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: BattleEvents.FIND_BATTLE_RESPONSE,
            callback: this._onFindBattleResponse.bind(this)
        });
        cc.eventManager.addListener(listener5, this);
    },

    onEnter: function () {
        this._super();
        var battleManager = BattleManager.getInstance();
        this.currentGold = battleManager.totalGold;
        this.currentElixir = battleManager.totalElixir;
        this.dungeonLevelText.setString(this.mapIndex);
        this.goldLabel.setString(this.currentGold);
        this.elixirLabel.setString(this.currentElixir);

        this._star1Animated = false;
        this._star2Animated = false;
        this._star3Animated = false;
        this.star1.loadTexture(res.sao_den_png, ccui.Widget.LOCAL_TEXTURE);
        this.star2.loadTexture(res.sao_den_png, ccui.Widget.LOCAL_TEXTURE);
        this.star3.loadTexture(res.sao_den_png, ccui.Widget.LOCAL_TEXTURE);
        this.progressLabel.setString("0%");

        // [NEW] Set the initial state of the player resource bars
        this._updatePlayerResourceDisplays();
        cc.log("GUIBattleHUD onEnter called. Current Gold: " + this.currentGold + ", Current Elixir: " + this.currentElixir);
        if (this.isPVPBattle) {
            const playerPrestige = PlayerDataManager.getInstance().playerData.prestigePoint;
            // Giả sử opponentData được truyền vào hoặc có thể lấy từ BattleManager
            // Tạm thời dùng giá trị mặc định nếu không có opponentData ở đây
            const opponentPrestige = BattleManager.getInstance().getOpponent() ? BattleManager.getInstance().getOpponent().prestige : 0;

            const winAmount = (playerPrestige > opponentPrestige) ? 5 : 10;
            const loseAmount = (playerPrestige > opponentPrestige) ? -10 : -5;

            // Tạo và thêm winLabel
            this.winLabel = new ccui.Text("Win: +" + winAmount, res.rowdies_regular_29_07_ttf, 20);
            this.winLabel.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this.winLabel.setAnchorPoint(0, 0.5);
            this.winLabel.setColor(cc.color(0, 255, 0)); // Green for win
            this.winLabel.enableOutline(cc.color(0, 0, 0), 1)
            this.Panel_1.addChild(this.winLabel, 5); // Thêm vào Panel_1

            // Tạo và thêm loseLabel
            this.loseLabel = new ccui.Text("Lose: " + loseAmount, res.rowdies_regular_29_07_ttf, 20);
            this.loseLabel.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this.loseLabel.setAnchorPoint(0, 0.5);
            this.loseLabel.setColor(cc.color(255, 0, 0)); // Red for lose
            this.loseLabel.enableOutline(cc.color(0, 0, 0), 1);
            // Vị trí sẽ được cập nhật trong _updateLayout
            this.Panel_1.addChild(this.loseLabel, 5); // Thêm vào Panel_1
        }
    },

    onExit: function() {
        this._super();
        cc.log("GUIBattleHUD onExit: Listeners will be cleaned up automatically by the engine.");
    },

    _updateLayout: function() {
        if (!this._rootNode) return;

        // Không scale node gốc, chúng ta sẽ điều khiển vị trí từng thành phần
        this._rootNode.setScale(1);
        var visibleSize = cc.director.getVisibleSize();
        var visibleOrigin = cc.director.getVisibleOrigin();
        this._rootNode.setAnchorPoint(0, 0);
        this._rootNode.setPosition(visibleOrigin.x, visibleOrigin.y);
        const PADDING = 10; // Khoảng đệm với các cạnh màn hình

        // --- Lấy các cụm UI bằng tên từ file JSON mới ---
        // (this.elementName hoạt động là nhờ hàm _syncNodeVariables trong GUIBase)
        var topLeftPanel = this.Panel_1;
        var timerLabel = this.timerLabel;
        var resourcePanel = this.resourcePanel;
        var endButton = this.endButton;
        var troopPanel = this.troopToFight;
        var resultPanel = this.resultPanel;
        var findNextButton = this.findNextButton;

        // --- Bắt đầu ghim các cụm vào vị trí ---

        // 1. Ghim cụm trên-trái (Panel_1)
        if (topLeftPanel) {
            topLeftPanel.setAnchorPoint(0, 1); // Neo ở góc trái-trên
            topLeftPanel.setPosition(
                visibleOrigin.x + PADDING,
                visibleOrigin.y + visibleSize.height// Đã sửa: dùng PADDING
            );
            // Vấn đề 2: Di chuyển chữ Win/Lose vào trong topLeftPanel và căn chỉnh theo nó
            if (this.isPVPBattle && this.winLabel) { // Kiểm tra nếu là PVP và label đã tồn tại
                // Lấy kích thước hiện tại của topLeftPanel
                const panelContentSize = topLeftPanel.getContentSize();
                const offsetY = 130; // Khoảng cách từ dưới cùng của panel lên label
                const lineHeight = 25; // Chiều cao ước tính của một dòng chữ

                // Đặt winLabel ở dưới cùng của topLeftPanel, với một khoảng cách nhất định
                this.winLabel.setAnchorPoint(0, 0.5);
                this.winLabel.setPosition(PADDING * 2, panelContentSize.height - PADDING - offsetY); // Điều chỉnh vị trí Y
            }
            if (this.isPVPBattle && this.loseLabel) { // Kiểm tra nếu là PVP và label đã tồn tại
                this.loseLabel.setAnchorPoint(0, 0.5);
                this.loseLabel.setPosition(PADDING * 2, panelContentSize.height - PADDING - lineHeight - offsetY); // Điều chỉnh vị trí Y
            }
        }

        if (timerLabel) {
            timerLabel.setAnchorPoint(0.5, 1); // Neo ở giữa-trên
            timerLabel.setPosition(
                visibleOrigin.x + visibleSize.width / 2,
                visibleOrigin.y + visibleSize.height
            );
        }

        if (resourcePanel) {
            resourcePanel.setAnchorPoint(1, 1); // Neo ở phải-trên
            resourcePanel.setPosition(
                visibleOrigin.x + visibleSize.width - PADDING,
                visibleOrigin.y + visibleSize.height
            );
        }

        if (troopPanel) {
            troopPanel.setAnchorPoint(0.5, 0); // Neo ở giữa-dưới
            troopPanel.setContentSize(visibleSize.width, troopPanel.getContentSize().height);
            troopPanel.setPosition(
                visibleOrigin.x + visibleSize.width / 2,
                visibleOrigin.y // Đặt ở sát cạnh dưới
            );
        }
        var troopPanelHeight = troopPanel.getContentSize().height * troopPanel.getScaleY();
        if (endButton && troopPanel) {
            endButton.setAnchorPoint(0, 0);
            endButton.setPosition(
                visibleOrigin.x + PADDING,
                visibleOrigin.y + troopPanelHeight + PADDING // Đặt nút "Kết thúc" cao hơn thanh lính một khoảng PADDING
            );
        }

        // 6. Ghim cụm dưới-phải (Sao và %)
        if (resultPanel) {
            resultPanel.setAnchorPoint(1, 0);
            resultPanel.setPosition(
                visibleOrigin.x + visibleSize.width,
                visibleOrigin.y + troopPanelHeight + PADDING
            );
        }

        // 7. Ghim nút "Tìm tiếp"
        if (findNextButton) {
            findNextButton.setAnchorPoint(1, 0);
            findNextButton.setPosition(
                visibleOrigin.x + visibleSize.width - PADDING,
                visibleOrigin.y + troopPanelHeight + PADDING
            );
        }
    },

    setVisible: function(isVisible) {
        this._super(isVisible); // Gọi hàm gốc
        if (isVisible) {
            this._updateLayout(); // Gọi hàm sửa layout
        }
    },


    _onPlayerResourceUpdated: function () {
        this._updatePlayerResourceDisplays();
    },

    // [NEW] Callback for when a building is destroyed
    _onBuildingDestroyed: function(event) {
        cc.log("GUIBattleHUD: Building destroyed, updating percentage.");
        this._updateDestructionPercentage();
    },

    _onStarsUpdated: function(event) {
        const stars = event.getUserData().stars;

        // Animate the first star if it has been earned and not yet animated
        if (stars >= 1 && !this._star1Animated) {
            this._star1Animated = true;
            this._animateStar(this.star1);
        }

        // Animate the second star
        if (stars >= 2 && !this._star2Animated) {
            this._star2Animated = true;
            // Use a delay so the animations don't overlap completely
            this.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(() => {
                this._animateStar(this.star2);
            })));
        }

        // Animate the third star
        if (stars >= 3 && !this._star3Animated) {
            this._star3Animated = true;
            this.runAction(cc.sequence(cc.delayTime(0.6), cc.callFunc(() => {
                this._animateStar(this.star3);
            })));
        }

        this._updateDestructionPercentage();
    },

    // --- [NEW] The animation logic is now in its own function ---
    _animateStar: function(targetStarNode) {
        const filledStarTexture = res.big_star_png;
        const centerPos = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
        const targetWorldPos = targetStarNode.getParent().convertToWorldSpace(targetStarNode.getPosition());
        var animatedStar = new cc.Sprite(filledStarTexture);
        animatedStar.setPosition(centerPos);
        animatedStar.setScale(0);
        this.addChild(animatedStar, 1000);

        // 1. "Pop" In Animation
        const popInAction = cc.scaleTo(0.2, 1.5).easing(cc.easeBackOut());
        const moveAction = cc.moveTo(0.6, targetWorldPos);
        const shrinkAction = cc.scaleTo(0.6, targetStarNode.getScale());
        const rotateAction = cc.rotateBy(0.6, 360 * 3).easing(cc.easeIn(3.0)); // Accelerating spin
        const mainAnimation = cc.spawn(moveAction, shrinkAction, rotateAction);
        const cleanupAction = cc.callFunc(() => {
            targetStarNode.loadTexture(filledStarTexture, ccui.Widget.LOCAL_TEXTURE);
            animatedStar.removeFromParent();
        });

        animatedStar.runAction(cc.sequence(popInAction, cc.delayTime(0.2), mainAnimation, cleanupAction));
    },

    _updatePlayerResourceDisplays: function () {
        const playerDataManager = PlayerDataManager.getInstance();

        let goldAmount = playerDataManager.getResourceAmount("gold");
        let goldCapacity = playerDataManager.getResourceCapacity("gold");
        this.playerGoldLabel.setString(Math.floor(goldAmount).toLocaleString());
        this.goldCapLabel.setString("Tối đa: " + goldCapacity.toLocaleString());
        this.goldFill.setPercent((goldCapacity > 0) ? (goldAmount / goldCapacity) * 100 : 0);

        let elixirAmount = playerDataManager.getResourceAmount("oil");
        let elixirCapacity = playerDataManager.getResourceCapacity("oil");
        this.playerElixirLabel.setString(Math.floor(elixirAmount).toLocaleString());
        this.elixirCapLabel.setString("Tối đa: " + elixirCapacity.toLocaleString());
        this.elixirFill.setPercent((elixirCapacity > 0) ? (elixirAmount / elixirCapacity) * 100 : 0);

        let gemAmount = playerDataManager.getResourceAmount("gem");
        this.playerGemLabel.setString(Math.floor(gemAmount).toLocaleString());
        this.gemFill.setPercent(100);
    },

    _onResourceUpdate: function (event) {
        if (!cc.sys.isObjectValid(this) || !this.isRunning()) {
            cc.log("GUIBattleHUD._onResourceUpdate: Called on an invalid or non-running node. Skipping UI update to prevent crash.");
            return;
        }
        const data = event.getUserData();
        var battleManager = BattleManager.getInstance();

        this.currentGold = data.totalLootedGold;
        this.currentElixir = data.totalLootedElixir;

        var remainingGold = battleManager.totalGold - this.currentGold;
        var remainingElixir = battleManager.totalElixir - this.currentElixir;

        this.goldLabel.setString(Math.max(0, Math.floor(remainingGold)).toLocaleString());
        this.elixirLabel.setString(Math.max(0, Math.floor(remainingElixir)).toLocaleString());
    },

    _updateDestructionPercentage: function() {
        const battleManager = BattleManager.getInstance();
        const percentage = (battleManager.totalDamageDealt / battleManager.totalHealth) * 100;
        const displayPercent = Math.min(100, Math.floor(percentage));
        this.progressLabel.setString(displayPercent + "%");
    },

    getUsedTroops: function() {
        var usedTroops = {};
        if (!this.initialTroopToFightData) {
            return usedTroops;

        }
        for (var troopType in this.initialTroopToFightData) {
            var initialAmount = this.initialTroopToFightData[troopType].amount;
            var currentAmount = this.troopToFightData[troopType] ? this.troopToFightData[troopType].amount : 0;
            var usedAmount = initialAmount - currentAmount;
            cc.log("Troop Type: " + troopType + ", Initial Amount: " + initialAmount + ", Current Amount: " + currentAmount + ", Used Amount: " + usedAmount);
            if (usedAmount > 0) {
                usedTroops[troopType] = usedAmount;
            }
        }
        return usedTroops;
    },


    _setupSlotUI: function () {
        for (var i = 1; i <= 10; i++) {
            var slot = this["slot" + i];
            if (slot) {
                this.uiSlots.push(slot);
            }
        }
    },

    setTroopData: function (troopData) {
        cc.log("Is a pvp battle?:" + this.isPVPBattle)
        var remappedData = {};
        if (this.isPVPBattle && Array.isArray(troopData)) {
            troopData.forEach(function (troop) {
                remappedData[troop.troopType] = {amount: troop.troopAmount};
            });
        }
        this.troopToFightData = this.isPVPBattle === false ? troopData : remappedData;
        this.initialTroopToFightData = JSON.parse(JSON.stringify(this.troopToFightData));
        this._updateAllBattleSlots();
    },

    _updateAllBattleSlots: function () {
        const availableTroopTypes = Object.keys(this.initialTroopToFightData).sort((a, b) => {
            const numA = parseInt(a.split('_')[1]);
            const numB = parseInt(b.split('_')[1]);
            return numA - numB;
        });
        for (let i = 0; i < this.uiSlots.length; i++) {
            const slot = this.uiSlots[i];
            const troopType = availableTroopTypes[i];
            if (troopType) {
                const amount = this.troopToFightData[troopType].amount;
                this._setupSlot(slot, troopType, amount);
            } else {
                this._setEmptySlot(slot);
            }
        }
    },

    _onSlotButtonClicked: function (slot) {
        const troopType = slot.troopType;
        if (!troopType || !this.troopToFightData[troopType] || this.troopToFightData[troopType].amount <= 0) {
            return;
        }
        this.deselectTroop();
        this.selectedTroopType = troopType;
        slot.getChildByName("selectedTroopOutline").setVisible(true);
    },

    decrementTroopCount: function (troopType) {
        if (!troopType || !this.troopToFightData[troopType]) {
            return;
        }
        this.troopToFightData[troopType].amount--;
        const newAmount = this.troopToFightData[troopType].amount;
        const slot = this.uiSlots.find(s => s.troopType === troopType);
        if (slot) {
            slot.getChildByName("amountLabel").setString("x" + newAmount);
            if (newAmount <= 0) {
                slot.setEnabled(false);
                slot.setTouchEnabled(false);
                slot.setOpacity(100);
                if (this.selectedTroopType === troopType) {
                    this.deselectTroop();
                }
            }
        }
    },

    deselectTroop: function () {
        if (this.selectedTroopType) {
            const previousSlot = this.uiSlots.find(s => s.troopType === this.selectedTroopType);
            if (previousSlot) {
                previousSlot.getChildByName("selectedTroopOutline").setVisible(false);
            }
        }
        this.selectedTroopType = null;
    },

    _initButtonListeners: function () {
        this.uiSlots.forEach(slot => {
            slot.addClickEventListener(() => {
                this._onSlotButtonClicked(slot);
            });
        });

        this.findNextButton.addClickEventListener(this._onFindNextBattleClicked.bind(this));
    },

    _setupSlot: function (slot, troopType, amount) {
        slot.troopType = troopType;
        cc.log("loai: " + troopType + ", so luong: " + amount);
        slot.getChildByName("amountLabel").setString("x" + amount);
        slot.getChildByName("troopIcon").loadTexture(res[troopType.toLowerCase() + "_battle_png"], ccui.Widget.LOCAL_TEXTURE);
        slot.getChildByName("selectedTroopOutline").setVisible(false);
        const isAvailable = amount > 0;
        slot.setEnabled(isAvailable);
        slot.setTouchEnabled(isAvailable);
        slot.setOpacity(isAvailable ? 255 : 100);
    },

    _setEmptySlot: function (slot) {
        slot.troopType = "";
        slot.getChildByName("amountLabel").setVisible(false);
        slot.getChildByName("troopIcon").loadTexture(res.slot_empty_png, ccui.Widget.LOCAL_TEXTURE);
        slot.getChildByName("selectedTroopOutline").setVisible(false);
        slot.setEnabled(false);
        slot.setTouchEnabled(false);
        slot.setOpacity(100);
    },

    _findAndSetFont: function (node) {
        if (!node) return;
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

    _onEndButtonClicked: function () {
        fr.view(UIManager);
    },

    getSelectedTroopType: function () {
        return this.selectedTroopType;
    },

    _onFindNextBattleClicked: function() {
        cc.log("Find Next button clicked! Sending FIND_BATTLE request.");
        var playerData = PlayerDataManager.getInstance().playerData;

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
    },

    _onFindBattleResponse: function(event) {
        var eventData = event.getUserData();
        if (eventData.success) {
            cc.log("GUIBattleHUD: _onFindBattleResponse - Opponent found! Success: " + eventData.success + ", Opponent: " + eventData.opponent.username);

            // Store opponent data in BattleManager
            var battleManager = BattleManager.getInstance();
            cc.log("GUIBattleHUD: Setting opponent data in BattleManager: " + JSON.stringify(eventData.opponent));
            battleManager.setOpponent(eventData.opponent);

            var PVPBattleSceneWrapper = cc.Layer.extend({
                ctor:function () {
                    this._super();
                    cc.log("GUIBattleHUD: PVPBattleSceneWrapper ctor called.");
                    var troopToFightData = PlayerDataManager.getInstance().playerData.army;
                    var actualPVPBattleLayer = new PVPBattleScene(eventData.opponent, troopToFightData);
                    this.addChild(actualPVPBattleLayer);
                }
            });
            cc.log("GUIBattleHUD: Calling fr.view(PVPBattleSceneWrapper).");
            fr.view(PVPBattleSceneWrapper);
        } else {
            cc.log("No opponent found: " + eventData.message);
            // TODO: Display a message to the user that no opponent was found
        }
    },
});