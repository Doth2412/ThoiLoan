const QUEUE_MAX_LENGTH = 6;

var Barrack = Building.extend({
    trainingQueue: [],
    trainingProgress: 0,
    startQueueTime: null,
    armyCampFull: false,

    ctor: function (buildingData) {
        this._super(buildingData);
        if (!this.buildingType && buildingData && buildingData.buildingType) {
            this.buildingType = buildingData.buildingType;
        }
        this.trainingQueue = buildingData.trainingQueue || [];
        this.startQueueTime = buildingData.stateStartTime || null;
        this.tooltipSprite = null; // NEW: Tooltip background sprite
        this.tooltipLabel = null;  // NEW: Tooltip text label
        this._workingAnimationSprite = null; // NEW: Sprite for working animation
        this._workingAnimation = null; // NEW: Animation object for working state
        cc.eventManager.addCustomListener("INITIAL_DATA_LOADED", this.validateAndCorrectStateAfterLoad.bind(this));
        cc.eventManager.addCustomListener(PLAYER_DATA_EVENTS.ARMY_STATUS_UPDATED, this.evaluateArmyCampFull.bind(this));
    },

    calculateOfflineCompletionLog: function() {
        if (this.buildingState !== BUILDING_STATES.OPERATING || !this.startQueueTime || this.trainingQueue.length === 0) {
            return [];
        }

        const serverTimeOnLogin = PlayerDataManager.getInstance().playerData.sentServerTime;
        const elapsedTimeMs = serverTimeOnLogin - this.startQueueTime;

        if (elapsedTimeMs <= 0) {
            return [];
        }

        let elapsedSeconds = elapsedTimeMs / 1000;
        let completionLog = [];
        let currentTime = this.startQueueTime;

        let tempQueue = JSON.parse(JSON.stringify(this.trainingQueue));

        while (tempQueue.length > 0 && elapsedSeconds > 0) {
            const troopSlot = tempQueue[0];
            const timePerTroop = ItemConfigUtils.getTroopBaseConfig(troopSlot.troopType).trainingTime;

            if (timePerTroop <= 0) {
                cc.warn("Barrack: Troop " + troopSlot.troopType + " has training time of 0. Skipping.");
                tempQueue.shift();
                continue;
            }

            const troopsCompleted = Math.min(Math.floor(elapsedSeconds / timePerTroop), troopSlot.troopAmount);

            if (troopsCompleted === 0) {
                break;
            }

            for (let i = 0; i < troopsCompleted; i++) {
                currentTime += timePerTroop * 1000;
                completionLog.push({
                    troopType: troopSlot.troopType,
                    completionTime: currentTime,
                    sourceBarrack: this
                });
            }

            elapsedSeconds -= troopsCompleted * timePerTroop;
            troopSlot.troopAmount -= troopsCompleted;

            if (troopSlot.troopAmount <= 0) {
                tempQueue.shift();
            }
        }

        return completionLog;
    },

    finalizeOfflineState: function(numCollected) {
        if (!this.startQueueTime && numCollected === 0) return;

        var initialAmount = (this.trainingQueue[0] && this.trainingQueue[0].troopAmount) || 0;
        cc.log("Finalizing Barrack Index " + this.buildingIndex + ". Initial amount: " + initialAmount + ". Troops collected: " + numCollected);

        let troopsToRemove = numCollected;
        while (troopsToRemove > 0 && this.trainingQueue.length > 0) {
            let currentSlot = this.trainingQueue[0];

            if (troopsToRemove >= currentSlot.troopAmount) {
                troopsToRemove -= currentSlot.troopAmount;
                this.trainingQueue.shift();
            } else {
                currentSlot.troopAmount -= troopsToRemove;
                troopsToRemove = 0;
            }
        }

        if (this.trainingQueue.length === 0) {
            this.setState(BUILDING_STATES.IDLE);
            this.startQueueTime = null;
            this.trainingProgress = 0;
        } else {
            this.setState(BUILDING_STATES.OPERATING);
            this.trainingProgress = 0;
            this.startQueueTime = Math.floor(Date.now());
        }

        var finalAmount = (this.trainingQueue[0] && this.trainingQueue[0].troopAmount) || 0;
        cc.log("Finalizing Barrack Index " + this.buildingIndex + ". Final amount: " + finalAmount);

        gv.testnetwork.connector.sendUpdateBarrackQueueRequest(
            this.buildingType,
            this.buildingIndex,
            this.startQueueTime,
            this.trainingQueue
        );
        this._updateWorkingAnimationVisibility(); // NEW: Update visibility after finalizing offline state
    },

    _dispatchQueueChangeEvent: function() {
        cc.eventManager.dispatchCustomEvent("BARRACK_QUEUE_CHANGED", {
            barrackId: this.buildingId
        });
    },

    update: function(dt) {
        this._super(dt);

        this._updateWorkingAnimationVisibility(); // NEW: Update visibility on each frame

        if (this.buildingState !== BUILDING_STATES.OPERATING || this.trainingQueue.length === 0) {
            return;
        }

        this.evaluateArmyCampFull();
        if (this.armyCampFull) {
            var activeTroop = this.trainingQueue[0];
            if (activeTroop) {
                var timePerTroop = ItemConfigUtils.getTroopBaseConfig(activeTroop.troopType).trainingTime;
                this.trainingProgress = timePerTroop;
            }
            return;
        }

        var activeTroop = this.trainingQueue[0];
        if (!activeTroop) return;

        var timePerTroop = ItemConfigUtils.getTroopBaseConfig(activeTroop.troopType).trainingTime;
        this.trainingProgress += dt;

        if (this.trainingProgress >= timePerTroop) {
            TroopManager.getInstance().onCompleteTrainingTroop(activeTroop.troopType, 1, this);
            activeTroop.troopAmount--;
            this.trainingProgress = 0;

            if (activeTroop.troopAmount <= 0) {
                this.trainingQueue.shift();
            }

            if (this.trainingQueue.length === 0) {
                this.setState(BUILDING_STATES.IDLE);
                this.startQueueTime = null;
            } else {
                this.startQueueTime = Math.floor(Date.now());
                gv.testnetwork.connector.sendUpdateBarrackQueueRequest(this.buildingType, this.buildingIndex, this.startQueueTime, this.trainingQueue);
            }
            this._dispatchQueueChangeEvent();
        }
    },

    addTroopToQueue: function(troopType) {
        if (this.trainingQueue.length >= QUEUE_MAX_LENGTH) {
            return false;
        }
        const wasEmpty = this.trainingQueue.length === 0;
        var troopHousingSpace = ItemConfigUtils.getTroopBaseConfig(troopType).housingSpace;
        var queueLength = ItemConfigUtils.getBuildingConfig(this, this.level).queueLength;
        if( this.getCurrentHousingSpace() + troopHousingSpace > queueLength) {
            return false;
        }
        for (var i = 0; i < this.trainingQueue.length; i++) {
            if (this.trainingQueue[i].troopType === troopType) {
                this.trainingQueue[i].troopAmount++;
                this._dispatchQueueChangeEvent();
                gv.testnetwork.connector.sendUpdateBarrackQueueRequest(this.buildingType, this.buildingIndex, this.startQueueTime, this.trainingQueue);
                return true;
            }
        }

        this.trainingQueue.push({ troopType: troopType, troopAmount: 1 });

        if (wasEmpty) {
            this.startQueueTime = Math.floor(Date.now());
        }

        if (this.buildingState === BUILDING_STATES.IDLE) {
            this.setState(BUILDING_STATES.OPERATING);
        }

        this._dispatchQueueChangeEvent();
        gv.testnetwork.connector.sendUpdateBarrackQueueRequest(this.buildingType, this.buildingIndex, this.startQueueTime, this.trainingQueue);
        this._updateWorkingAnimationVisibility(); // NEW: Update visibility after adding troop
        return true;
    },

    removeTroopFromQueue: function(troopType) {
        for (var i = 0; i < this.trainingQueue.length; i++) {
            if (this.trainingQueue[i].troopType === troopType) {
                this.trainingQueue[i].troopAmount--;
                if (i === 0) {
                    this.trainingProgress = 0;
                }
                if (this.trainingQueue[i].troopAmount <= 0) {
                    this.trainingQueue.splice(i, 1);
                }
                if (this.trainingQueue.length === 0) {
                    this.setState(BUILDING_STATES.IDLE);
                    this.startQueueTime = null;
                }
                gv.testnetwork.connector.sendUpdateBarrackQueueRequest(this.buildingType, this.buildingIndex, this.startQueueTime, this.trainingQueue);
                this._dispatchQueueChangeEvent();
                this._updateWorkingAnimationVisibility(); // NEW: Update visibility after removing troop
                return;
            }
        }
    },

    finishAllTrainingInstantly: function() {
        for (var i = 0; i < this.trainingQueue.length; i++) {
            var troopSlot = this.trainingQueue[i];
            TroopManager.getInstance().onCompleteTrainingTroop(troopSlot.troopType, troopSlot.troopAmount, this);
        }
        this.trainingQueue = [];
        this.trainingProgress = 0;
        this.startQueueTime = null;
        this.setState(BUILDING_STATES.IDLE);
        gv.testnetwork.connector.sendUpdateBarrackQueueRequest(this.buildingType, this.buildingIndex, this.startQueueTime, this.trainingQueue);
        this._dispatchQueueChangeEvent();
    },



    getCurrentHousingSpace: function () {
        var currentHousingSpace = 0;
        var queue = this.trainingQueue;
        for (var i = 0; i < queue.length; i++) {
            var housingSpace = ItemConfigUtils.getTroopBaseConfig(queue[i].troopType).housingSpace;
            currentHousingSpace += queue[i].troopAmount * housingSpace;
        }
        return currentHousingSpace;
    },

    evaluateArmyCampFull: function() {
        var currentHousingSpace = TroopManager.getInstance().getCurrentArmySize();
        var totalHousingSpace = BuildingsManager.getInstance().getTotalHousingSpace();
        const wasArmyCampFull = this.armyCampFull;
        this.armyCampFull = currentHousingSpace >= totalHousingSpace;

        if (this.armyCampFull !== wasArmyCampFull) {
            this._updateTooltip();
        }
    },

    _initTooltip: function() {
        if (this.tooltipSprite) return; // Already initialized

        this.tooltipSprite = new cc.Sprite(BARRACK_STATUS_TOOLTIP_ASSET);
        this.tooltipSprite.setAnchorPoint(0.5, 0.5);
        this.tooltipSprite.setVisible(false);
        this.compositeNode.addChild(this.tooltipSprite, 100);

        this.tooltipLabel = new cc.LabelTTF("", res.fonts_rowdies_regular_29_07_ttf, 20);
        this.tooltipLabel.setColor(cc.color(255, 255, 255));
        this.tooltipSprite.addChild(this.tooltipLabel);
        this.tooltipLabel.setAnchorPoint(0.5, 0.5);
        this.tooltipLabel.setPosition(this.tooltipSprite.getContentSize().width / 2, this.tooltipSprite.getContentSize().height / 2);
        if (this.buildingSprite) {
            cc.log("Barrack: Positioning tooltip based on buildingSprite.");
            var compositeNodeSize = this.compositeNode.getContentSize();
            this.tooltipSprite.setPosition(compositeNodeSize.width / 2, compositeNodeSize.height + 180 );
        } else {
            cc.log("Barrack: Positioning tooltip based on compositeNode.");
            var compositeNodeSize = this.compositeNode.getContentSize();
            this.tooltipSprite.setPosition(compositeNodeSize.width / 2, compositeNodeSize.height + 20);
        }
    },

    _updateTooltip: function() {
        if (!this.tooltipSprite) {
            this._initTooltip(); // Initialize if not already
        }

        let tooltipText = "";
        let showTooltip = false;

        if (this.buildingState === BUILDING_STATES.IDLE) {
            tooltipText = "Rảnh";
            showTooltip = true;
        } else if (this.buildingState === BUILDING_STATES.OPERATING) {
            if (this.armyCampFull) {
                tooltipText = "Đầy";
                showTooltip = true;
            } else {
                tooltipText = "!!!";
                showTooltip = true;
            }
        }

        this.tooltipLabel.setString(tooltipText);
        this.tooltipSprite.setVisible(showTooltip);
    },

    _setupWorkingAnimation: function() {
        const animMeta = BUILDING_ANIMATION_METADATA["BARRACK_WORKING"];
        if (!animMeta) {
            cc.warn("Barrack: BARRACK_WORKING animation metadata not found.");
            return;
        }

        const frames = [];
        for (let i = 0; i < animMeta.frameCount; i++) {
            let frameIndex = i.toString();
            while (frameIndex.length < animMeta.frameIndexPadding) {
                frameIndex = '0' + frameIndex;
            }
            const framePath = animMeta.basePath + frameIndex + ".png";
            const texture = cc.textureCache.addImage(framePath);
            if (texture) {
                const rect = cc.rect(0, 0, texture.getContentSize().width, texture.getContentSize().height);
                frames.push(new cc.SpriteFrame(texture, rect));
            } else {
                cc.warn("Barrack._setupWorkingAnimation: Failed to load frame: " + framePath);
            }
        }

        if (frames.length > 0) {
            this._workingAnimation = new cc.Animation(frames, animMeta.frameDelay);
            this._workingAnimation.retain(); // Retain the animation
            this._workingAnimationSprite = new cc.Sprite();
            this._workingAnimationSprite.setAnchorPoint(0.5, 0.5);
            // Position relative to compositeNode, using offset from metadata
            const offsetX = animMeta.offset ? animMeta.offset.x : 0;
            const offsetY = animMeta.offset ? animMeta.offset.y : 0;
            this._workingAnimationSprite.setPosition(this.compositeNode.getContentSize().width / 2 + offsetX, this.compositeNode.getContentSize().height / 2 + offsetY);
            this._workingAnimationSprite.setVisible(false); // Initially hidden
            this.compositeNode.addChild(this._workingAnimationSprite, 1); // Add as child to compositeNode
        } else {
            cc.warn("Barrack._setupWorkingAnimation: No frames loaded for BARRACK_WORKING animation.");
        }
    },

    _updateWorkingAnimationVisibility: function() {
        if (!this._workingAnimationSprite || !this._workingAnimation) {
            return;
        }

        const shouldShow = this.trainingQueue.length > 0 && this.buildingState === BUILDING_STATES.OPERATING && !this.armyCampFull;

        if (shouldShow && !this._workingAnimationSprite.isVisible()) {
            this._workingAnimationSprite.setVisible(true);
            this._workingAnimationSprite.runAction(cc.RepeatForever.create(cc.Animate.create(this._workingAnimation)));
        } else if (!shouldShow && this._workingAnimationSprite.isVisible()) {
            this._workingAnimationSprite.stopAllActions();
            this._workingAnimationSprite.setVisible(false);
        }
    },

    validateAndCorrectStateAfterLoad: function() {
        this._super();
        if (!(this.buildingState === BUILDING_STATES.CONSTRUCTING || this.buildingState === BUILDING_STATES.UPGRADING)) {
            if (this.trainingQueue && this.trainingQueue.length > 0) {
                this.setState(BUILDING_STATES.OPERATING);
            } else {
                this.setState(BUILDING_STATES.IDLE);
            }
        }
    },

    setState: function(newState) {
        this._super(newState);
        this._updateTooltip(); // Update tooltip when state changes
        this._updateWorkingAnimationVisibility(); // NEW: Update visibility when state changes
    },

    getVisualCenterPosition: function () {
        if (this.compositeNode && this.compositeNode.getParent()) {
            var boundingBox = this.compositeNode.getBoundingBoxToWorld();
            return cc.p(cc.rectGetMidX(boundingBox), cc.rectGetMidY(boundingBox));
        }
        return cc.p(0, 0);
    },

    setupVisualComponents: function() {
        if (!this.compositeNode) {
            cc.warn("Barrack: " + this.buildingType + " - Cannot setup visual components, compositeNode not available");
            return
        }
        this._initTooltip();
        this._setupWorkingAnimation();
        this._updateWorkingAnimationVisibility();
        const originalOnExit = this.compositeNode.onExit;

        this.compositeNode.onExit = () => {
            this.cleanup();
            if (originalOnExit) {
                originalOnExit.call(this.compositeNode);
            }
        };
    },

    cleanup: function() {
        cc.log("Executing cleanup for Barrack: " + this.buildingIndex);

        if (this._workingAnimation) {
            this._workingAnimation.release();
            this._workingAnimation = null;
        }
        this._workingAnimationSprite = null;
        this.tooltipSprite = null;
        this.tooltipLabel = null; // This is the most critical line to prevent the crash.
    },
});
