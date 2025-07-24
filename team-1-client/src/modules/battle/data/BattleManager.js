var BattleManager = cc.Class.extend({
    totalGold: null,
    totalElixir: null,
    totalGoldBuildingHealth: null,
    totalElixirBuildingHealth: null,
    lootedGold: null,
    lootedElixir: null,
    starsWon: null,
    totalHealth: null,
    totalBuildingCount: null,
    destroyedBuildingCount: null,
    totalDamageDealt: null,
    isTownHallDestroyed: null,
    opponent: null,

    _resourceGainedListener: null,
    _buildingDestroyedListener: null,

    ctor: function () {
        this._registerEventListeners();
        this.reset();
    },

    setOpponent: function (opponentData) {
        this.opponent = opponentData;
        cc.log("BattleManager: Opponent data set - " + JSON.stringify(this.opponent));
    },

    getOpponent: function () {
        return this.opponent;
    },

    initializeLootParameters: function (params) {
        this.totalGold = Math.floor(params.totalGold) || 0;
        this.totalElixir = Math.floor(params.totalElixir) || 0;
        this.totalGoldBuildingHealth = params.totalGoldHealth || 1;
        this.totalElixirBuildingHealth = params.totalElixirHealth || 1;
    },

    _registerEventListeners: function () {
        var onResourceGained = this._onAttackDealt.bind(this);
        var onBuildingDestroyed = this._onBuildingDestroyed.bind(this);

        this._resourceGainedListener = cc.eventManager.addCustomListener(BattleEvents.ATTACK_DEALT, onResourceGained);
        this._buildingDestroyedListener = cc.eventManager.addCustomListener(BattleEvents.BUILDING_DESTROYED, onBuildingDestroyed);
    },

    _onAttackDealt: function (event) {
        const eventData = event.getUserData();
        const damage = eventData.damageDealt;
        const buildingType = eventData.buildingType;

        this.totalDamageDealt += damage;
        this._handleLootDistribution(damage, buildingType);
    },

    _onBuildingDestroyed: function (event) {
        this.destroyedBuildingCount++;
        const buildingType = event.getUserData().building.buildingType;
        if (buildingType.startsWith("TOW_")) {
            this.isTownHallDestroyed = true;
        }
        this._checkConditionsAndNotify();
    },

    _handleLootDistribution: function (damage, buildingType) {
        let goldGained = 0;
        let elixirGained = 0;

        if (buildingType.startsWith("TOW_") || buildingType.startsWith("STO_1")) {
            goldGained = this.totalGold * (damage / this.totalGoldBuildingHealth);
        }
        if (buildingType.startsWith("TOW_") || buildingType.startsWith("STO_2")) {
            elixirGained = this.totalElixir * (damage / this.totalElixirBuildingHealth);
        }

        var oldLootedGold = this.lootedGold;
        this.lootedGold += goldGained;
        var goldToAdd = Math.floor(this.lootedGold) - Math.floor(oldLootedGold);

        var oldLootedElixir = this.lootedElixir;
        this.lootedElixir += elixirGained;
        var elixirToAdd = Math.floor(this.lootedElixir) - Math.floor(oldLootedElixir);


        const playerDataManager = PlayerDataManager.getInstance();
        if (goldToAdd > 0) {
            playerDataManager.addResources("gold", goldToAdd);
        }
        if (elixirToAdd > 0) {
            playerDataManager.addResources("oil", elixirToAdd);
        }

        cc.eventManager.dispatchCustomEvent(BattleEvents.LOOT_UPDATED, {
            totalLootedGold: Math.floor(this.lootedGold),
            totalLootedElixir: Math.floor(this.lootedElixir)
        });
    },

    _checkConditionsAndNotify: function () {
        const starsBefore = this.starsWon;
        let calculatedStars = 0;

        if (this.totalDamageDealt / this.totalHealth >= 0.5) {
            calculatedStars++;
        }
        if (this.isTownHallDestroyed) {
            calculatedStars++;
        }
        cc.log(this.destroyedBuildingCount + " destroyed buildings out of " + this.totalBuildingCount);
        if (this.destroyedBuildingCount > 0 && this.destroyedBuildingCount === this.totalBuildingCount) {
            calculatedStars++;
        }

        if (calculatedStars > this.starsWon) {
            this.starsWon = calculatedStars;
            cc.log("STARS UPDATED: " + this.starsWon);
            cc.eventManager.dispatchCustomEvent(BattleEvents.STARS_UPDATED, {stars: this.starsWon});
        }
    },

    reset: function () {
        cc.log("Resetting BattleManager state and listeners.");
        this.totalGold = 0;
        this.totalElixir = 0;
        this.totalGoldBuildingHealth = 1; // Set to 1 to avoid division by zero
        this.totalElixirBuildingHealth = 1; // Set to 1 to avoid division by zero
        this.lootedGold = 0;
        this.lootedElixir = 0;
        this.starsWon = 0;
        this.totalHealth = 1; // Set to 1 to avoid division by zero
        this.totalBuildingCount = 0;
        this.destroyedBuildingCount = 0;
        this.totalDamageDealt = 0;
        this.isTownHallDestroyed = false;
        this.opponent = null;
    },
})

BattleManager._instance = null;
BattleManager.getInstance = function () {
    if (!BattleManager._instance) {
        BattleManager._instance = new BattleManager();
    }
    return BattleManager._instance;
};