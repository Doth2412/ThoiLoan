// Building state enum for all building types
const BUILDING_STATES = {
    PLACING: "PLACING",
    CONSTRUCTING: "CONSTRUCTING",
    UPGRADING: "UPGRADING",
    OPERATING: "OPERATING",
    IDLE: "IDLE"
};

// Building.js: Base class for all building types (including ResourceGenerator, Barrack, etc.)
var Building = cc.Class.extend({
    // Core building properties (shared by all building types)
    buildingType: null,
    level: null,
    buildingIndex: null,
    posX: null,
    posY: null,
    assetType: null,
    isInBuyingPhase: null,
    config: null,
    compositeNode: null,
    baseSprite: null,
    buildingSprite: null, // This will be the static/idle sprite
    animationSprite: null, // This will be for animations like 'attack01'
    selectionIndicator: null,
    placementIndicator: null,
    upgradingIndicator: null,
    startBuildingTime: null,
    finishBuildingTime: null,
    upgradingProgressBar: null,
    buildingState: BUILDING_STATES.IDLE,
    animations: null,
    currentAnimationName: null,

    ctor: function (buildingData) {
        // Initialize all common properties from buildingData
        this.buildingType = buildingData.buildingType;
        this.level = buildingData.level;
        this.buildingIndex = buildingData.buildingIndex;
        this.posX = buildingData.posX;
        this.posY = buildingData.posY;
        this.compositeNode = buildingData.compositeNode;
        this.baseSprite = buildingData.baseSprite;
        this.buildingSprite = buildingData.buildingSprite; // Assigned from manager
        this.selectionIndicator = buildingData.selectionIndicator;
        this.placementIndicator = null;
        this.upgradingIndicator = buildingData.upgradingIndicator;
        this.config = buildingData.config;
        this.assetType = buildingData.assetType;
        this.isInBuyingPhase = buildingData.isInBuyingPhase;
        this.upgradingProgressBar = buildingData.upgradingProgressBar;
        this.stateStartTime = buildingData.stateStartTime;
        this.buildingState = buildingData.buildingState || BUILDING_STATES.IDLE;
        // Initialize the animation sprite
        this.animationSprite = buildingData.animationSprite;

        this._setupAnimations();
    },

    // Construction/upgrade timer update (subclasses should call this._super(dt) if overriding)
    update: function (dt) {
        // Animation state handling
        if (this.buildingState === BUILDING_STATES.OPERATING) {
            this.playAnimation("operating", true);
        } else {
            this.stopAnimationAndShowIdle();
        }

        // Only process timer if building is constructing or upgrading
        if (this.buildingState !== BUILDING_STATES.CONSTRUCTING &&
            this.buildingState !== BUILDING_STATES.UPGRADING) {
            return;
        }
        const now = Math.floor(Date.now() / 1000);
        const remainingTime = this.finishBuildingTime - now;

        if (this.buildingState === BUILDING_STATES.CONSTRUCTING) {
            if (this.finishBuildingTime && now >= this.finishBuildingTime) {
                gv.testnetwork.connector.sendBuildComplete(this.buildingType, this.buildingIndex);
                if (this.buildingType === "AMC_1") cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.ARMY_STATUS_UPDATED, {})

                this.setState(BUILDING_STATES.OPERATING); // Or IDLE, as appropriate

                if (BuildingsManager.getInstance()) {
                    BuildingsManager.getInstance().toggleUpgradingIndicator(this, false);
                }

                if (typeof BuilderManager !== 'undefined' && BuilderManager.getInstance()) {
                    BuilderManager.getInstance().onBuildingOperationComplete(this);
                } else {
                    cc.error("BuilderManager not available to free builder for " + this.buildingType + " index " + this.buildingIndex + " upon construction completion.");
                }
                PlayerDataManager.getInstance().notifyResourceUpdate("gold");
                PlayerDataManager.getInstance().notifyResourceUpdate("oil");
                return;
            }
            // Update progress bar/time label for construction
            if (remainingTime > 0 && this.upgradingProgressBar) {
                var buildConfig = ItemConfigUtils.getBuildingConfig(this, 1); // Level 1 for new buildings
                if (buildConfig && typeof buildConfig.buildTime === 'number' && buildConfig.buildTime > 0) {
                    this.upgradingProgressBar.progressTimer.setPercentage(
                        100 - (remainingTime / buildConfig.buildTime * 100)
                    );
                    this.upgradingProgressBar.timeLabel.setString(this.formatTime(remainingTime));
                } else {
                    this.upgradingProgressBar.progressTimer.setPercentage(0);
                    this.upgradingProgressBar.timeLabel.setString(this.formatTime(remainingTime));
                    if (!buildConfig || typeof buildConfig.buildTime !== 'number') {
                        cc.warn("Building.js: Missing or invalid buildTime for L1 " + this.buildingType);
                    }
                }
            }
        } else if (this.buildingState === BUILDING_STATES.UPGRADING) {

            if (this.finishBuildingTime && now >= this.finishBuildingTime) {
                UpgradeBuildingController.finishUpgradeBuilding(this);
                if (this.buildingType === "AMC_1") cc.eventManager.dispatchCustomEvent(PLAYER_DATA_EVENTS.ARMY_STATUS_UPDATED, {})
                cc.log("Building " + this.buildingType + " index " + this.buildingIndex + " upgrade finished by timer.");
                // finishUpgradeBuilding should handle state change, indicator, and builder freeing.
                PlayerDataManager.getInstance().notifyResourceUpdate("gold");
                PlayerDataManager.getInstance().notifyResourceUpdate("oil");
                return;
            }
            if (remainingTime > 0 && this.upgradingProgressBar) {
                var nextLevelConfig = ItemConfigUtils.getBuildingConfig(this, this.level + 1);
                if (nextLevelConfig && typeof nextLevelConfig.buildTime === 'number' && nextLevelConfig.buildTime > 0) {
                    this.upgradingProgressBar.progressTimer.setPercentage(
                        100 - (remainingTime / nextLevelConfig.buildTime * 100)
                    );
                    this.upgradingProgressBar.timeLabel.setString(this.formatTime(remainingTime));
                } else {
                    this.upgradingProgressBar.progressTimer.setPercentage(0);
                    this.upgradingProgressBar.timeLabel.setString(this.formatTime(remainingTime));
                    if (!nextLevelConfig || typeof nextLevelConfig.buildTime !== 'number') {
                        cc.warn("Building.js: Missing or invalid buildTime for L" + (this.level + 1) + " " + this.buildingType);
                    }
                }
            }

        }
    },

    // Helper: format seconds as HH:MM:SS
    formatTime: function (seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        var pad = function (num) {
            var numStr = num.toString();
            if (numStr.length < 2) {
                return '0' + numStr;
            } else {
                return numStr;
            }
        };
        return pad(h) + ':' + pad(m) + ':' + pad(s);
    },

    /**
     * Set building state and handle state-specific logic
     * @param {string} newState - New state to set
     */
    setState: function (newState) {
        var previousState = this.buildingState;
        if (previousState === newState) return; // Do nothing if state is the same

        this.buildingState = newState;
        cc.log("Building " + this.buildingType + " index " + this.buildingIndex + " state changed from: " + previousState + " to: " + newState);

        if (newState === BUILDING_STATES.CONSTRUCTING || newState === BUILDING_STATES.UPGRADING) {
            if (typeof BuilderManager !== 'undefined' && BuilderManager.getInstance()) {
                BuilderManager.getInstance().requestBuilderForBuilding(this);
            } else {
                cc.warn("BuilderManager not available to request builder for " + this.buildingType + " index " + this.buildingIndex);
            }
        }

        // This is the guaranteed point where a new building's construction begins.
        if (newState === BUILDING_STATES.CONSTRUCTING && previousState === BUILDING_STATES.PLACING) {
            cc.log("New building construction started. Initializing timers for " + this.buildingType);
            this.stateStartTime = Date.now();
            this.startBuildingTime = Math.floor(this.stateStartTime / 1000);

            var config = ItemConfigUtils.getBuildingConfig(this, 1); // New buildings are always level 1
            if (config && typeof config.buildTime === 'number') {
                this.finishBuildingTime = this.startBuildingTime + config.buildTime;

                // Also ensure the visual progress bar is shown immediately.
                if (BuildingsManager.getInstance()) {
                    BuildingsManager.getInstance().toggleUpgradingIndicator(this, true);
                }
            } else {
                cc.error("Building.setState: Missing or invalid buildTime for new building " + this.buildingType);
                this.finishBuildingTime = this.startBuildingTime; // Prevent crash
            }
        }
    },

    _initializeState: function (buildingData) {
        const state = this.buildingState;

        if (state === BUILDING_STATES.CONSTRUCTING || state === BUILDING_STATES.UPGRADING) {
            // Use the stored stateStartTime as the starting point in seconds
            var startBuildingTime = Math.floor(buildingData.stateStartTime / 1000);
            var buildConfig;

            if (state === BUILDING_STATES.CONSTRUCTING) {
                // For new buildings, the config is for level 1
                buildConfig = ItemConfigUtils.getBuildingConfig(this, 1);
            } else {
                // For upgrading buildings, the config is for the next level
                buildConfig = ItemConfigUtils.getBuildingConfig(this, this.level + 1);
            }

            if (!buildConfig || typeof buildConfig.buildTime !== 'number' || buildConfig.buildTime <= 0) {
                cc.error("Building.ctor: Missing or invalid buildTime for " + this.buildingType +
                    " (State: " + state + ", Level: " + this.level + "). Config: ", buildConfig);
                this.setState(BUILDING_STATES.IDLE); // Fallback state
                this.upgradingIndicator.setVisible(false);
                this.upgradingProgressBar.setVisible(false);
                return; // Stop further processing for this building
            }

            var finishBuildingTime = startBuildingTime + buildConfig.buildTime;
            const now = Math.floor(Date.now() / 1000);

            if (finishBuildingTime <= now) {
                // Construction/Upgrade finished while offline
                cc.log("Building.ctor: " + this.buildingType + " index " + this.buildingIndex + " finished " + state + " while offline.");
                if (state === BUILDING_STATES.UPGRADING) {
                    this.level += 1; // Increment level if an upgrade finished
                }
                this.setState(BUILDING_STATES.OPERATING); // Or IDLE, adjust as per game logic
                this.upgradingIndicator.setVisible(false);
                this.upgradingProgressBar.setVisible(false);
            } else {
                // Still constructing/upgrading
                this.startBuildingTime = startBuildingTime;
                this.finishBuildingTime = finishBuildingTime;
                cc.log("Building.ctor: Restoring " + state + " for " + this.buildingType + " index " + this.buildingIndex +
                    ". Start: " + startBuildingTime + ", Finish: " + finishBuildingTime);
                this.upgradingIndicator.setVisible(true);
                this.upgradingProgressBar.setVisible(true);
            }

        } else {
            // For buildings not CONSTRUCTING or UPGRADING, ensure indicators are off
            this.upgradingIndicator.setVisible(false);
            this.upgradingProgressBar.setVisible(false);
        }
    },

    validateAndCorrectStateAfterLoad: function () {
        const currentState = this.buildingState;

        const validStates = [
            BUILDING_STATES.PLACING,
            BUILDING_STATES.CONSTRUCTING,
            BUILDING_STATES.UPGRADING,
            BUILDING_STATES.OPERATING,
            BUILDING_STATES.IDLE
        ];
        if (validStates.indexOf(currentState) !== -1) {
            return;
        }

        cc.warn("Building " + this.buildingIndex + " has invalid state '" + currentState + "'. Resetting to OPERATING.");
        this.setState(BUILDING_STATES.OPERATING);
    },

    _createAnimationFrames: function(basePath, padding, frameCount, animName) {
        const frames = [];
        for (let i = 0; i < frameCount; i++) {
            let frameIndexStr = i.toString();
            while (frameIndexStr.length < padding) {
                frameIndexStr = '0' + frameIndexStr;
            }
            const framePath = basePath + frameIndexStr + ".png";
            const texture = cc.textureCache.addImage(framePath);

            if (!texture) {
                cc.error("_createAnimationFrames: Failed to load texture for frame:" + framePath + "for building " + this.buildingType + " " +this.level + " anim " +  animName);
                return null;
            }

            const texSize = texture.getContentSize();
            if (!texSize || texSize.width === 0 || texSize.height === 0) {
                cc.error("Texture obtained but has zero or invalid dimensions for: " + framePath + " for building " + this.buildingType + " L" + this.level + " anim " + animName);
                return null;
            }

            const rect = cc.rect(0, 0, texSize.width, texSize.height);
            const spriteFrame = new cc.SpriteFrame(texture, rect);
            frames.push(spriteFrame);
        }
        return frames;
    },

    _setupAnimations: function() {
        this.animations = {};

        const ALL_BUILDING_ANIM_META = BUILDING_ANIMATION_METADATA;
        if (!ALL_BUILDING_ANIM_META) {
            cc.error("BUILDING_ANIMATION_METADATA is not loaded.");
            return;
        }

        const buildingTypeMeta = ALL_BUILDING_ANIM_META[this.buildingType];
        if (!buildingTypeMeta) {
            return;
        }

        Object.keys(buildingTypeMeta).forEach(function(animName) {
            const animMeta = buildingTypeMeta[animName];
            if (!animMeta || typeof animMeta.basePathPrefix !== 'string' || typeof animMeta.basePathSuffix !== 'string' || typeof animMeta.frameIndexPadding !== 'number' || typeof animMeta.frameCount !== 'number') {
                cc.warn("Animation metadata missing/invalid for building " + this.buildingType + " level " + this.level + " anim " + animName, animMeta);
                return;
            }

            const basePath = animMeta.basePathPrefix + this.level + animMeta.basePathSuffix;
            const frames = this._createAnimationFrames(basePath, animMeta.frameIndexPadding, animMeta.frameCount, animName);

            if (frames === null) {
                return;
            }

            if (frames.length > 0) {
                const animation = new cc.Animation(frames, animMeta.frameDelay || 0.1);
                animation.retain();
                this.animations[animName] = {
                    animation: animation,
                    offset: animMeta.offset || { x: 0, y: 0 }
                };
            } else if (animMeta.frameCount > 0) {
                cc.error("No frames created for " + this.buildingType + " L" + this.level + " - " + animName + " despite metadata definition. (Frame count expected: " + animMeta.frameCount + ")");
            }
        }, this);
    },

    playAnimation: function(animationName, loop) {
        if (!this.animationSprite) {
            return;
        }
        if (this.currentAnimationName === animationName) {
            return;
        }

        this.animationSprite.stopAllActions();

        if (!this.animations || !this.animations[animationName]) {
            this.stopAnimationAndShowIdle();
            return;
        }

        const animationData = this.animations[animationName];
        if (!animationData || !animationData.animation) {
            this.stopAnimationAndShowIdle();
            return;
        }
        const animation = animationData.animation;
        const offset = animationData.offset;

        if (offset) {
            this.animationSprite.setPosition(offset.x, offset.y);
        }

        const animateAction = cc.Animate.create(animation);
        if (!animateAction) {
            this.stopAnimationAndShowIdle();
            return;
        }

        const actionToRun = loop ? cc.RepeatForever.create(animateAction) : animateAction;
        this.animationSprite.runAction(actionToRun);
        this.currentAnimationName = animationName;
    },

    stopAnimationAndShowIdle: function() {
        if (this.animationSprite) {
            this.animationSprite.stopAllActions()
        }
        this.currentAnimationName = null;
    },

    setupVisualComponents: function() {
        if (this.compositeNode && this.animationSprite && !this.animationSprite.getParent()) {
            this.compositeNode.addChild(this.animationSprite);
        }
    },

    onExit: function() {
        this._super();
        if (!this.animations) {
            return;
        }

        Object.keys(this.animations).forEach(animName => {
            const animData = this.animations[animName];
            if (!animData) {
                return;
            }

            const animation = animData.animation;

            if (
                animation &&
                typeof animation.release === 'function' &&
                cc.sys.isObjectValid &&
                cc.sys.isObjectValid(animation)
            ) {
                animation.release();
            }
        });

        this.animations = null;
    }
});