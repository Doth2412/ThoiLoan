const BUILDER_STATE = {
    IDLE: "IDLE",
    MOVING: "MOVING",
    WORKING: "WORKING",
};

var builderIdCounter = 0;

var Builder = cc.Node.extend({
    id: null,
    gridX: 0,
    gridY: 0,
    sprite: null,
    animations: null,
    currentAnimationName: null,
    currentDirection: null,

    builderState: null,
    targetBuilding: null,
    path: null,
    currentPathIndex: 0,

    moveSpeed: 100,
    workSpeed: 1.0,

    ctor: function(pathfinder, gridSystem) {
        this._super();
        this.id = "builder_" + (builderIdCounter++);
        this.gridX = 0;
        this.gridY = 0;
        this._pathfinder = pathfinder;
        this._gridSystem = gridSystem;

        this.builderState = BUILDER_STATE.IDLE;

        this.sprite = new cc.Sprite();
        this.addChild(this.sprite);

        this._setupAnimations();
        this.playAnimation("idle", "S", true);
        this.currentDirection = "S";

        this.scheduleUpdate();
    },

    update: function(dt) {
        if (this.builderState === BUILDER_STATE.WORKING) {
            // Logic for working state if any
        }
    },

    // =================================================================
    // HÀM MỚI: Ra lệnh cho thợ xây đi thẳng đến công trình tiếp theo
    // =================================================================
    startMovingToNewTask: function(targetBuilding) {
        cc.log("Builder " + this.id + ": Rerouting directly to new task: " + targetBuilding.buildingType);
        this.stopAllActions(); // Dừng hành động "làm việc"

        // Vị trí bắt đầu chính là vị trí hiện tại của thợ xây
        const startPos = this.getPosition();
        this.startMovingToBuilding(startPos, targetBuilding);
    },

    setPath: function(path) {
        this.path = path;
        this.currentPathIndex = 0;
    },

    startMovingToBuilding: function(startPos, targetBuilding) {
        if (!targetBuilding) {
            cc.error("ERROR: Builder.startMovingToBuilding was called with an undefined targetBuilding.");
            this.builderState = BUILDER_STATE.IDLE;
            return;
        }

        this.targetBuilding = targetBuilding;
        this.builderState = BUILDER_STATE.MOVING;

        this.setPosition(startPos);
        this.setVisible(true);

        var startGrid = this._gridSystem.localToGrid(startPos.x, startPos.y);

        var targetBuildingGridX = targetBuilding.posX;
        var targetBuildingGridY = targetBuilding.posY;
        var targetBuildingWidth = targetBuilding.config.size.width;
        var targetBuildingHeight = targetBuilding.config.size.height;

        var endGridPos = null;
        for (var x = targetBuildingGridX - 1; x <= targetBuildingGridX + targetBuildingWidth; x++) {
            for (var y = targetBuildingGridY - 1; y <= targetBuildingGridY + targetBuildingHeight; y++) {
                if (x >= targetBuildingGridX && x < targetBuildingGridX + targetBuildingWidth &&
                    y >= targetBuildingGridY && y < targetBuildingGridY + targetBuildingHeight) {
                    continue;
                }
                if (this._pathfinder.pathfindingGrid.isWalkable(x, y)) {
                    endGridPos = { x: x, y: y };
                    break;
                }
            }
            if (endGridPos) break;
        }

        if (!endGridPos) {
            cc.warn("Builder: Could not find a walkable tile adjacent to target building. Moving directly to center.");
            var targetBuildingWorldPos = targetBuilding.compositeNode.getParent().convertToWorldSpace(targetBuilding.compositeNode.getPosition());
            var targetBuildingSize = targetBuilding.compositeNode.getContentSize();
            var targetCenter = cc.p(targetBuildingWorldPos.x + targetBuildingSize.width / 2, targetBuildingWorldPos.y + targetBuildingSize.height / 2);
            this.runAction(cc.sequence(
                cc.moveTo(cc.pDistance(startPos, targetCenter) / this.moveSpeed, targetCenter),
                this._createFinalPositioningAction()
            ));
            return;
        }

        var pathResult = this._pathfinder.findPath(startGrid.x, startGrid.y, endGridPos.x, endGridPos.y);
        var path = pathResult && pathResult.path ? pathResult.path : null;

        if (path && path.length > 0) {
            var movementActions = this._buildMovementActions(path);
            var finalAction = this._createFinalPositioningAction();
            movementActions.push(finalAction);

            if (movementActions.length > 0) {
                this.runAction(cc.sequence(movementActions));
            } else {
                cc.warn("Builder: Path found but no movement actions generated. Moving directly to target.");
                var targetNodePos = this._gridSystem.gridToLocal(endGridPos.x, endGridPos.y);
                this.runAction(cc.sequence(
                    cc.moveTo(cc.pDistance(startPos, targetNodePos) / this.moveSpeed, targetNodePos),
                    this._createFinalPositioningAction()
                ));
            }
        } else {
            cc.warn("Builder: No path found to target building. Moving directly to target.");
            var targetNodePos = this._gridSystem.gridToLocal(endGridPos.x, endGridPos.y);
            this.runAction(cc.sequence(
                cc.moveTo(cc.pDistance(startPos, targetNodePos) / this.moveSpeed, targetNodePos),
                this._createFinalPositioningAction()
            ));
        }
    },

    _updateBuilderZOrder: function(gridPos) {
        if (!gridPos || typeof gridPos.x === 'undefined' || typeof gridPos.y === 'undefined') {
            cc.warn("Builder: _updateBuilderZOrder called with invalid arguments.");
            return;
        }
        this.gridX = gridPos.x;
        this.gridY = gridPos.y;
        const newZOrder = MAX_Z_ORDER - (40 * gridPos.x + gridPos.y);
        this.setLocalZOrder(newZOrder);
    },

    _buildMovementActions: function(pathNodes) {
        var actionsArray = [];
        var currentPosition = this.getPosition();

        if (pathNodes.length > 0) {
            var firstNodePos = this._gridSystem.gridToLocal(pathNodes[0].x, pathNodes[0].y);
            this.currentDirection = Utils.calculateDirection(currentPosition, firstNodePos);
        }

        for (var i = 0; i < pathNodes.length; i++) {
            var gridNode = pathNodes[i];
            var nextNodePos = this._gridSystem.gridToLocal(gridNode.x, gridNode.y);
            var directionForSegment = Utils.calculateDirection(currentPosition, nextNodePos);

            var updateAndAnimateCallback = (function(dir, newGridPos) {
                return function() {
                    this._updateBuilderZOrder(newGridPos);
                    this.playAnimation("run", dir, true);
                };
            })(directionForSegment, gridNode);
            actionsArray.push(cc.callFunc(updateAndAnimateCallback, this));

            var moveSpeed = this.moveSpeed;
            var duration = moveSpeed > 0 ? cc.pDistance(currentPosition, nextNodePos) / moveSpeed : 0.2; // Calculate duration based on distance
            actionsArray.push(cc.moveTo(duration, nextNodePos));

            currentPosition = nextNodePos;
        }
        return actionsArray;
    },

    _createFinalPositioningAction: function(callback) {
        return cc.callFunc(function() {
            var finalGridPos = this._gridSystem.localToGrid(this.getPositionX(), this.getPositionY());
            this._updateBuilderZOrder(finalGridPos);
            this.startWorkingOnBuilding();
            if (callback) {
                callback.call(this);
            }
        }, this);
    },

    startWorkingOnBuilding: function() {
        cc.log("Builder " + this.id + ": startWorkingOnBuilding called. targetBuilding: " + (this.targetBuilding ? this.targetBuilding.buildingType : "None"));
        if (!this.targetBuilding) {
            this.stopAllActionsAndHide();
            return;
        }
        this.stopAllActions();
        this.builderState = BUILDER_STATE.WORKING;
        this.playAnimation("attack01", this.currentDirection, true);
        cc.log("Builder " + this.id + ": State set to WORKING. Playing attack01 animation.");
    },

    returnToHutAndHide: function(assignedHut) {
        cc.log("Builder " + this.id + ": returnToHutAndHide called.");
        this.stopAllActions();
        this.builderState = BUILDER_STATE.MOVING;

        if (!assignedHut || !assignedHut.compositeNode) {
            cc.warn("Builder " + this.id + ": No valid assigned hut provided to return to. Hiding builder.");
            this.stopAllActionsAndHide();
            return;
        }

        const targetHutPos = assignedHut.compositeNode.getPosition();
        cc.log("Builder " + this.id + ": Target Builder Hut position: (" + targetHutPos.x + ", " + targetHutPos.y + ").");

        var startGrid = this._gridSystem.localToGrid(this.getPosition().x, this.getPosition().y);
        var endGrid = this._gridSystem.localToGrid(targetHutPos.x, targetHutPos.y);
        cc.log("Builder " + this.id + ": Pathfinding from (" + startGrid.x + ", " + startGrid.y + ") to (" + endGrid.x + ", " + endGrid.y + ").");

        var pathResult = this._pathfinder.findPath(startGrid.x, startGrid.y, endGrid.x, endGrid.y);
        var path = pathResult && pathResult.path ? pathResult.path : null;

        if (path && path.length > 0) {
            cc.log("Builder " + this.id + ": Path found to Builder Hut. Path length: " + path.length);
            var movementActions = this._buildMovementActions(path);
            var finalAction = cc.callFunc(function() {
                cc.log("Builder " + this.id + ": Reached hut. Hiding.");
                this.stopAllActionsAndHide();
            }, this);
            movementActions.push(finalAction);

            this.runAction(cc.sequence(movementActions));
        } else {
            cc.warn("Builder " + this.id + ": No path found to Builder Hut. Hiding builder directly.");
            this.stopAllActionsAndHide();
        }
    },

    stopAllActionsAndHide: function() {
        cc.log("Builder " + this.id + ": stopAllActionsAndHide called.");
        this.stopAllActions();
        this.builderState = BUILDER_STATE.IDLE;
        this.targetBuilding = null;
        this.path = null;
        this.currentPathIndex = 0;
        this.setVisible(false);
        this.sprite.stopAllActions();
        cc.log("Builder " + this.id + ": Hidden and state set to IDLE.");
    },

    // ... Các hàm animation không đổi ...
    _createAnimationFrames: function(basePath, padding, dirConfig, animName, directionString) {
        const frames = [];
        for (let i = 0; i < dirConfig.frameCount; i++) {
            const currentFrameFileIndex = dirConfig.startFrame + i;
            let frameIndexStr = currentFrameFileIndex.toString();
            while (frameIndexStr.length < padding) {
                frameIndexStr = '0' + frameIndexStr;
            }
            const framePath = basePath + frameIndexStr + ".png";
            const texture = cc.textureCache.addImage(framePath);

            if (!texture) {
                cc.error("Builder._createAnimationFrames: Failed to load texture for frame:" + framePath + "for builder anim " +  animName +  " dir " + directionString);
                return null;
            }

            const texSize = texture.getContentSize();
            if (!texSize || texSize.width === 0 || texSize.height === 0) {
                cc.error("Texture obtained but has zero or invalid dimensions for: " + framePath + " for builder anim " + animName + " dir " + directionString);
                return null;
            }

            const rect = cc.rect(0, 0, texSize.width, texSize.height);
            const spriteFrame = new cc.SpriteFrame(texture, rect);
            frames.push(spriteFrame);
        }
        return frames;
    },

    _setupAnimationDirection: function(animName, directionString, dirConfig, animMeta) {
        if (!dirConfig || typeof dirConfig.startFrame !== 'number' || typeof dirConfig.frameCount !== 'number') {
            cc.warn("Invalid direction config for " + animName + ", direction " + directionString, dirConfig);
            return;
        }

        const basePath = animMeta.basePath;
        const padding = animMeta.frameIndexPadding;
        const frameDelay = animMeta.frameDelay || 0.1;
        const offset = animMeta.offset || { x: 0, y: 0 };

        const frames = this._createAnimationFrames(basePath, padding, dirConfig, animName, directionString);

        if (frames === null) {
            return;
        }

        if (frames.length > 0) {
            const animation = new cc.Animation(frames, frameDelay);
            animation.retain();
            this.animations[animName][directionString] = {
                animation: animation,
                offset: offset
            };
        } else if (dirConfig.frameCount > 0) {
            cc.error("No frames created for builder - " + animName + ", direction " + directionString + " despite metadata definition. (Frame count expected: " + dirConfig.frameCount + ")");
        }
    },

    _setupAnimationType: function(animName, animMeta) {
        if (!animMeta || typeof animMeta.basePath !== 'string' || typeof animMeta.frameIndexPadding !== 'number' || typeof animMeta.directions !== 'object') {
            cc.warn("Animation metadata missing/invalid for builder anim " + animName, animMeta);
            return;
        }

        this.animations[animName] = {};
        Object.keys(animMeta.directions).forEach(function(directionString) {
            const dirConfig = animMeta.directions[directionString];
            this._setupAnimationDirection(animName, directionString, dirConfig, animMeta);
        }, this);
    },

    _setupAnimations: function() {
        this.animations = {};

        const ALL_BUILDER_ANIM_META = BUILDER_ANIMATION_METADATA;
        if (!ALL_BUILDER_ANIM_META) {
            cc.error("BUILDER_ANIMATION_METADATA is not loaded.");
            return;
        }

        const builderTypeMeta = ALL_BUILDER_ANIM_META["BUILDER"];
        if (!builderTypeMeta) {
            cc.error("Animation metadata not found for builder type: BUILDER");
            return;
        }

        const builderLevelMeta = builderTypeMeta["1"];
        if (!builderLevelMeta) {
            cc.error("Animation metadata not found for builder level: 1");
            return;
        }

        Object.keys(builderLevelMeta).forEach(function(animName) {
            const animMeta = builderLevelMeta[animName];
            this._setupAnimationType(animName, animMeta);
        }, this);
    },

    _validateAnimationObject: function(animationForDirection, animationName, direction) {
        if (!(animationForDirection instanceof cc.Animation)) {
            cc.error("Builder.playAnimation: Stored object for " + animationName + ", dir " + direction + " is NOT a cc.Animation instance. Type: " + (typeof animationForDirection));
            return false;
        }
        if (typeof animationForDirection.getFrames !== 'function' || typeof animationForDirection.getDuration !== 'function') {
            cc.error("Builder.playAnimation: Stored cc.Animation object for " + animationName + ", dir " + direction + " is missing expected methods (getFrames/getDuration).");
            return false;
        }
        return true;
    },

    _createAndValidateAnimateAction: function(animationForDirection, animationName, direction) {
        const framesInAnimation = animationForDirection.getFrames();

        if (!framesInAnimation || framesInAnimation.length === 0) {
            cc.error("Builder.playAnimation: cc.Animation object for " + animationName + ", dir " + direction + " has no frames. Cannot create cc.Animate.");
            return null;
        }

        let animateAction;
        try {
            animateAction = cc.Animate.create(animationForDirection);
        } catch (e) {
            cc.log("Details of animationForDirection that caused error:");
            cc.log("  Instance of cc.Animation: " + (animationForDirection instanceof cc.Animation));
            return null;
        }

        if (!animateAction) {
            cc.error("Builder.playAnimation: cc.Animate.create() returned null/undefined without throwing an exception for " + animationName + ", dir " + direction);
            return null;
        }
        return animateAction;
    },

    _applySpriteOffset: function(offset) {
        if (this.sprite && offset) {
            this.sprite.setPosition(offset.x, offset.y);
        }
    },

    playAnimation: function(animationName, direction, loop) {
        if (!this.sprite) {
            cc.error("Builder.playAnimation: Sprite is null.");
            return;
        }
        this.sprite.stopAllActions();

        this.sprite.setFlippedX(false);
        this.sprite.setFlippedY(false);
        this.sprite.setRotation(0);

        if (!this.animations) {
            cc.error("Builder.playAnimation: this.animations is null.");
            return;
        }
        if (!this.animations[animationName]) {
            cc.error("Builder.playAnimation: Animation type '" + animationName + "' not found in this.animations.");
            return;
        }

        const animationData = this.animations[animationName][direction];

        if (!animationData || !animationData.animation) {
            cc.error("Builder.playAnimation: Animation not found for name: '" + animationName + "' and direction: '" + direction + "'.");
            if (this.animations[animationName]) {
                cc.log("Builder.playAnimation: Available directions for '" + animationName + "': " + Object.keys(this.animations[animationName]));
            }
            return;
        }

        const animationForDirection = animationData.animation;
        const offset = animationData.offset;

        this._applySpriteOffset(offset);

        if (!this._validateAnimationObject(animationForDirection, animationName, direction)) {
            return;
        }

        const animateAction = this._createAndValidateAnimateAction(animationForDirection, animationName, direction);
        if (!animateAction) {
            return;
        }

        // Apply horizontal flip based on direction for mirrored animations
        if (direction === "NE" || direction === "E" || direction === "SE") {
            this.sprite.setFlippedX(true);
        }

        const actionToRun = loop ? cc.RepeatForever.create(animateAction) : animateAction;
        this.sprite.runAction(actionToRun);
        this.currentAnimationName = animationName;
        this.currentDirection = direction;
    },

    onExit: function() {
        this._super();
        cc.log("Builder onExit: Releasing animations.");

        if (!this.animations) {
            return;
        }

        Object.keys(this.animations).forEach(animName => {
            const animDirMap = this.animations[animName];
            if (!animDirMap) {
                return;
            }

            Object.keys(animDirMap).forEach(directionKey => {
                const animationData = animDirMap[directionKey];

                if (
                    animationData && animationData.animation &&
                    typeof animationData.animation.release === 'function' &&
                    cc.sys.isObjectValid &&
                    cc.sys.isObjectValid(animationData.animation)
                ) {
                    animationData.animation.release();
                }
            });
        });

        this.animations = null;
    }
});
