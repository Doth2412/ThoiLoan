var ArmyCamp = Building.extend({
    troopList: null,
    ctor: function(buildingData){
        this._super(buildingData);
        this.troopList = [];
        this._workingAnimationSprite = null; // NEW: Sprite for working animation
        this._workingAnimation = null; // NEW: Animation object for working state
    },

    addTroopToArmyCamp: function(troopObject) {
        this.troopList.push(troopObject);
        cc.log("Added Troop instance (" + troopObject.troopType + ", level " + troopObject.level + ") to Army Camp: " + this.buildingType);
        this._updateWorkingAnimationVisibility(); // NEW: Update visibility after adding troop
    },

    removeTroopFromArmyCamp: function(troopTypeToRemove) {
        // Remove the first Troop instance whose troopType matches troopTypeToRemove
        for (let i = 0; i < this.troopList.length; i++) {
            if (this.troopList[i] && this.troopList[i].troopType === troopTypeToRemove) {
                let removedTroop = this.troopList.splice(i, 1)[0];
                cc.log("Removed Troop instance (" + removedTroop.troopType + ", level " + removedTroop.level + ") from Army Camp: " + this.buildingType);
                this._updateWorkingAnimationVisibility(); // NEW: Update visibility after removing troop
                return;
            }
        }
        cc.log("No Troop instance of type " + troopTypeToRemove + " found in Army Camp: " + this.buildingType);
    },

    isAvailable: function(troopObject) {
        // Check if the Army Camp has space for more troops
        const armyCampConfig = ItemConfigUtils.getBuildingConfig(this);
        let requiredSpace = troopObject && typeof troopObject.housingSpace === 'number' ? troopObject.housingSpace : 0;
        return requiredSpace + this.getCurrentHousingSpace() <= armyCampConfig.capacity;
    },

    hasTroop: function(troopTypeIdentifier) {
        // Return true if any Troop in troopList matches the type
        for (let i = 0; i < this.troopList.length; i++) {
            if (this.troopList[i] && this.troopList[i].troopType === troopTypeIdentifier) {
                return true;
            }
        }
        return false;
    },

    getCurrentHousingSpace: function() {
        let currentSpace = 0;
        for (let i = 0; i < this.troopList.length; i++) {
            currentSpace += this.troopList[i].housingSpace;
        }
        return currentSpace;
    },

    getHousingSpace: function (){
        return ItemConfigUtils.getBuildingConfig(this, this.level).capacity;
    },

    getVisualCenterPosition: function () {
        if (this.compositeNode && this.compositeNode.getParent()) {
            var boundingBox = this.compositeNode.getBoundingBoxToWorld();
            return cc.p(cc.rectGetMidX(boundingBox), cc.rectGetMidY(boundingBox));
        }
        cc.warn("ArmyCamp:getVisualCenterPosition - compositeNode is not valid or not attached to scene.");
        return cc.p(0, 0);
    },

    setupVisualComponents: function() {
        if (!this.compositeNode) {
            cc.warn("ArmyCamp: " + this.buildingType + " - Cannot setup visual components, compositeNode not available");
            return;
        }
        this._setupWorkingAnimation();
        this._updateWorkingAnimationVisibility();
    },

    _setupWorkingAnimation: function() {
        const animMeta = BUILDING_ANIMATION_METADATA["ARMY_CAMP_WORKING"];
        if (!animMeta) {
            cc.warn("ArmyCamp: ARMY_CAMP_WORKING animation metadata not found.");
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
                cc.warn("ArmyCamp._setupWorkingAnimation: Failed to load frame: " + framePath);
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
            cc.warn("ArmyCamp._setupWorkingAnimation: No frames loaded for ARMY_CAMP_WORKING animation.");
        }
    },

    _updateWorkingAnimationVisibility: function() {
        if (!this._workingAnimationSprite || !this._workingAnimation) {
            return;
        }

        const shouldShow = this.troopList.length > 0; // Show if troopList is not empty

        if (shouldShow && !this._workingAnimationSprite.isVisible()) {
            this._workingAnimationSprite.setVisible(true);
            this._workingAnimationSprite.runAction(cc.RepeatForever.create(cc.Animate.create(this._workingAnimation)));
        } else if (!shouldShow && this._workingAnimationSprite.isVisible()) {
            this._workingAnimationSprite.stopAllActions();
            this._workingAnimationSprite.setVisible(false);
        }
    },

    cleanup: function() {
        if (this._workingAnimation) {
            this._workingAnimation.release();
            this._workingAnimation = null;
        }
        if (this._workingAnimationSprite) {
            this._workingAnimationSprite.removeFromParent(true);
            this._workingAnimationSprite = null;
        }
    }
})