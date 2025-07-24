/**
 * Troop.js: Represents a single troop unit on the battlefield.
 * This version is designed to be controlled by an external TargetSelector and Pathfinder.
 * It manages its own state, animations, movement execution, and attack execution.
 */

// Enum for managing the troop's current behavior.
const TROOP_STATE = {
    IDLE: "IDLE",       // Doing nothing, waiting for orders.
    MOVING: "MOVING",     // Moving along a path.
    ATTACKING: "ATTACKING", // Attacking a target.
    ATTACKING_WALL: "ATTACKING_WALL", // NEW: Attacking a wall.
    DEAD: "DEAD",       // Dead.
};

var troopIdCounter = 0;

var Troop = cc.Node.extend({
    // --- Core Properties from original file ---
    id: null,
    troopType: null,
    level: null,
    gridX: 0,
    gridY: 0,
    sprite: null,
    animations: null,
    currentAnimationName: null,
    currentHP: 0,
    isAlive: true,
    currentDirection: null,
    healthBarNode: null,

    // --- State and AI Properties (New) ---
    troopState: null,
    type: null,              // Generic type for TargetSelector, e.g., "WARRIOR"
    targetBuilding: null,    // The building it is currently attacking.
    finalTarget: null,       // The building it is moving towards.
    _originalFinalTarget: null, // New: Stores the ultimate target when diverted to a wall.
    attackCooldown: 0,
    path: null,
    currentPathIndex: 0,
    bulletType: null,

    // --- Stats from Config (from original file) ---
    damagePerSecond: 0,
    damagePerAttack: 0,
    damagePerSecondOnResources: 0,
    damageVsWalls: 0,
    healsPerSecond: 0,
    healsPerAttack: 0,
    hitpoints: 0,
    trainingDarkElixir: 0,
    trainingElixir: 0,
    researchDarkElixir: 0,
    researchElixir: 0,
    researchTime: 0,
    laboratoryLevelRequired: 0,
    damageUponDeath: 0,
    timeSkill: 0,
    percentSkill: 0,
    numTarget: 0,
    skillLevel: 0,
    attackType: 0,
    attackRadius: 0,
    attackArea: 0,
    housingSpace: 0,
    trainingTime: 0,
    timeDiscountPercent: 0,
    timeDiscountStart: 0,
    timeDiscountEnd: 0,
    moveSpeed: 0,
    attackSpeed: 0,
    barracksLevelRequired: 0,
    attackRange: 0,
    dmgScale: 0,
    favoriteTarget: "NONE",
    deathDamageRadius: 0,
    cost: 0,

    ctor: function(troopType, level, enemyBuildings, battleTroopManager, pathfinder, targetSelector, battleScene) {
        this._super();
        this.id = "troop_" + (troopIdCounter++);
        this.troopType = troopType;
        this.level = level;
        this.gridX = 0;
        this.gridY = 0;
        this.enemyBuildings = enemyBuildings; 
        this.battleTroopManager = battleTroopManager; 
        this._pathfinder = pathfinder;
        this._targetSelector = targetSelector;
        this._battleScene = battleScene; 

        // Load all stats from config files.
        this._loadConfig();

        // Set the generic type for the TargetSelector.
        this.type = TargetSelector.getTroopTypeFromArm(this.troopType);

        // Initialize state and properties.
        this.isAlive = true;
        this.troopState = TROOP_STATE.IDLE;
        this.currentHP = this.hitpoints;
        this.attackCooldown = 0;

        // Sprite setup
        this.sprite = new cc.Sprite();
        this.addChild(this.sprite);

        // Animation setup
        this._setupAnimations();
        this.playAnimation("idle", "S", true);
        this.currentDirection = "S";

        // Start the main update loop.
        this.scheduleUpdate();
    },

    _loadConfig: function() {
        const troopLevelConfig = ItemConfigUtils.getTroopConfig(this.troopType, this.level);
        for (var key in troopLevelConfig) {
            if (Object.prototype.hasOwnProperty.call(troopLevelConfig, key)) {
                this[key] = troopLevelConfig[key];
            }
        }

        const troopBaseConfig = ItemConfigUtils.getTroopBaseConfig(this.troopType);
        for (var key in troopBaseConfig) {
            if (Object.prototype.hasOwnProperty.call(troopBaseConfig, key)) {
                this[key] = troopBaseConfig[key];
            }
        }

         // Load bulletType from animation metadata as an override.
         try {
            const troopLevelMeta = TROOP_ANIMATION_METADATA[this.troopType][this.level.toString()];
            if (troopLevelMeta && troopLevelMeta.bulletType) {
                this.bulletType = troopLevelMeta.bulletType;
            }
        } catch (e) {
        }
    },


    update: function(dt) {
        if (this._battleScene && this._battleScene._battleEnded) {
            this.stopAllMovementAndAttacks();
            this.unscheduleUpdate();
            return;
        }
        if ((this.troopState !== TROOP_STATE.ATTACKING && this.troopState !== TROOP_STATE.ATTACKING_WALL) || !this.isAlive) {
            return;
        }

        this.attackCooldown -= dt;
        if (this.attackCooldown <= 0) {
            this._performAttack();
            this.attackCooldown = this.attackSpeed; // Reset cooldown.
        }
    },

    _performAttack: function() {
        if (!this.targetBuilding || this.targetBuilding.buildingState === BATTLE_BUILDING_STATE.DESTROYED) {
            this.stopAllMovementAndAttacks();
            return;
        }

        var targetBuildingSprite = this.targetBuilding.compositeNode;
        var targetBuildingSize = targetBuildingSprite.getContentSize();
        var targetBuildingWorldPos = targetBuildingSprite.getParent().convertToWorldSpace(targetBuildingSprite.getPosition());

        var targetCenterX = targetBuildingWorldPos.x + targetBuildingSize.width / 2;
        var targetCenterY = targetBuildingWorldPos.y + targetBuildingSize.height / 2;
        var targetPos = cc.p(targetCenterX, targetCenterY);

        // Use the troop's current direction for attack animation, as it should already be facing the target.
        var direction = this.currentDirection;
        this.playAnimation("attack01", direction, false);

        // Guard clause: If this troop doesn't use bullets, fall back to direct damage.
        if (!this.bulletType) {
            // cc.warn("Troop._performAttack: " + this.troopType + " has no bulletType defined. Applying direct damage.");
            this.targetBuilding.takeDamage(this.damagePerAttack);
            return;
        }

        var troopWorldPos = this.getParent().convertToWorldSpace(this.getPosition());
        var offset = this._getBulletOriginOffset(direction);
        var startPos = cc.pAdd(troopWorldPos, cc.p(offset.x, offset.y));

        cc.eventManager.dispatchCustomEvent(BattleEvents.FIRE_BULLET, {
            attacker: this,
            target: this.targetBuilding,
            damage: this.damagePerAttack,
            bulletType: this.bulletType,
            startPos: startPos
        });
    },

    _getBulletOriginOffset: function(direction) {
        try {
            // Safely access nested properties.
            var animMeta = TROOP_ANIMATION_METADATA[this.troopType][this.level.toString()]['attack01'];
            var dirMeta = animMeta.directions[direction];
            var offset = dirMeta.bulletOriginOffset;

            if (!offset) {
                throw new Error("bulletOriginOffset not found");
            }

            // Handle sprite flipping for mirrored animations.
            if (this.sprite.isFlippedX()) {
                return { x: -offset.x, y: offset.y };
            }
            return offset;

        } catch (e) {
            cc.warn("Troop._getBulletOriginOffset: Could not find offset for " +
                this.troopType + " Lvl " + this.level + " Dir: " + direction + ". Using default {x:0, y:0}. Error: " + e.message);
            return { x: 0, y: 0 };
        }
    },

    _createHealthBar: function() {
        this.healthBarNode = new cc.Node();
        var backgroundSprite = new cc.Sprite(res.bg_train_bar_png);
        this.healthBarNode.addChild(backgroundSprite, 0);

        var fillingSprite = new cc.Sprite(res.train_bar_png);
        var progressTimer = new cc.ProgressTimer(fillingSprite);
        progressTimer.setType(cc.ProgressTimer.TYPE_BAR);
        progressTimer.setMidpoint(cc.p(0, 0.5));
        progressTimer.setBarChangeRate(cc.p(1, 0));
        progressTimer.setPercentage(100);
        this.healthBarNode.addChild(progressTimer, 1);

        this.healthBarNode.progressTimer = progressTimer;

        const spriteSize = this.sprite.getContentSize();
        this.healthBarNode.setAnchorPoint(0.5, 0.5);
        this.healthBarNode.setPosition(0, spriteSize.height -150);

        this.addChild(this.healthBarNode, 10);
        this.healthBarNode.setVisible(false); // Initially hidden
    },

    stopAllMovementAndAttacks: function() {
        this.stopAllActions();
        this.troopState = TROOP_STATE.IDLE;
        this.targetBuilding = null;
        this.finalTarget = null;
        this.path = null;
        this.currentPathIndex = 0;
        if (this.isAlive) {
            this.playAnimation("idle", this.currentDirection, true);
        }
    },

    recalculatePathToFinalTarget: function() {
        var targetForRecalculation = this.finalTarget;
        if (this.troopState === TROOP_STATE.ATTACKING_WALL && this._originalFinalTarget) {
            targetForRecalculation = this._originalFinalTarget;
        }

        if (!this.isAlive || !targetForRecalculation) {
            cc.log("DEBUG: Troop " + this.id + ": Cannot recalculate path. isAlive: " + this.isAlive + ", targetForRecalculation: " + (targetForRecalculation ? targetForRecalculation.id : "None"));
            return;
        }

        cc.log("DEBUG: Troop " + this.id + ": Recalculating path to final target: " + targetForRecalculation.id + ". Current state: " + this.troopState);

        var currentGridPos = this.battleTroopManager._gridSystem.localToGrid(this.getPosition().x, this.getPosition().y);
        var troopForTargeting = {
            type: this.type,
            currentX: currentGridPos.x,
            currentY: currentGridPos.y,
            attackRange: this.attackRange
        };

        // Use the target selector to find a new path to the final target
        var targetResult = this._targetSelector.findPathToSpecificTarget(
            troopForTargeting,
            targetForRecalculation,
            this.enemyBuildings,
            this._pathfinder
        );

        if (targetResult && targetResult.path && targetResult.path.length > 0) {
            cc.log("DEBUG: Troop " + this.id + ": New path found. Path length: " + targetResult.path.length);
            // Check if the new path avoids breaking walls
            var newPathBreaksWalls = false;
            for (var i = 0; i < targetResult.path.length; i++) {
                if (targetResult.path[i].isWallSegment) {
                    newPathBreaksWalls = true;
                    break;
                }
            }

            cc.log("DEBUG: Troop " + this.id + ": New path breaks walls: " + newPathBreaksWalls + ". Current state: " + this.troopState);

            // If the troop is currently attacking a wall and the new path doesn't break walls,
            // or if the new path is significantly shorter (this part might need more complex logic
            // depending on how path cost is calculated and compared to wall-breaking time),
            // then switch to the new path.
            if (this.troopState === TROOP_STATE.ATTACKING_WALL && !newPathBreaksWalls) {
                cc.log("DEBUG: Troop " + this.id + ": Found a new path to " + targetForRecalculation.id + " that avoids walls. Switching paths.");
                this.stopAllMovementAndAttacks(); // Stop current actions
                this.setPath(targetResult.path);
                this.startMovingAlongPath(this.battleTroopManager._gridSystem, targetForRecalculation);
            } else if (this.troopState === TROOP_STATE.ATTACKING_WALL && newPathBreaksWalls) {
                cc.log("DEBUG: Troop " + this.id + ": New path to " + targetForRecalculation.id + " still breaks walls. Continuing current action.");
            } else {
                // This case should ideally not happen if the troop is not attacking a wall
                // but is still asked to recalculate path to final target.
                cc.log("DEBUG: Troop " + this.id + ": Found a new path to " + targetForRecalculation.id + ". Switching paths.");
                this.stopAllMovementAndAttacks(); // Stop current actions
                this.setPath(targetResult.path);
                this.startMovingAlongPath(this.battleTroopManager._gridSystem, targetForRecalculation);
            }
        } else {
            cc.log("DEBUG: Troop " + this.id + ": No better path found to " + targetForRecalculation.id + ". Continuing current action.");
        }
    },

    attack: function(targetBuilding) {
        if (!targetBuilding || targetBuilding.buildingState === BATTLE_BUILDING_STATE.DESTROYED || !this.isAlive) {
            this.stopAllMovementAndAttacks();
            return;
        }

        this.stopAllActions();
        this.troopState = TROOP_STATE.ATTACKING;
        this.targetBuilding = targetBuilding;

        const direction = Utils.calculateDirection(this.getPosition(), this.targetBuilding.compositeNode.getPosition());

        // this.playAnimation("attack01", direction, true);
        this.attackCooldown = 0;
    },

    stopAttacking: function() {
        this.troopState = TROOP_STATE.IDLE;
        this.targetBuilding = null;
        if (this.isAlive) {
            this.playAnimation("idle", this.currentDirection, true);
        }
    },

    takeDamage: function(amount) {
        if (!this.isAlive) return;

        this.currentHP -= amount;
        if (!this.healthBarNode) {
            this._createHealthBar();
        }

        if (this.healthBarNode && this.healthBarNode.progressTimer) {
            if (!this.healthBarNode.isVisible()) {
                this.healthBarNode.setVisible(true);
            }
            const healthPercentage = (this.currentHP / this.hitpoints) * 100;
            this.healthBarNode.progressTimer.setPercentage(Math.max(0, healthPercentage));
        }

        if (this.currentHP <= 0) {
            this.currentHP = 0;
            this.isAlive = false;

            // Hide health bar on death
            if (this.healthBarNode) {
                this.healthBarNode.setVisible(false);
            }

            // Update state and stop all logic
            this.troopState = TROOP_STATE.DEAD;
            this.stopAllActions();
            this.unscheduleUpdate();
            this.playAnimation("dead", this.currentDirection, false);
        }
    },

    setPath: function(path) {
        this.path = path;
        this.currentPathIndex = 0;
    },

    startMovingAlongPath: function(gridSystem, targetBuilding) {
        if (!targetBuilding) {
            cc.error("ERROR: Troop.startMovingAlongPath was called with an undefined targetBuilding. Check the call site in BattleScene.js.");
            this.troopState = TROOP_STATE.IDLE;
            return;
        }

        if (!this.path || !this.isAlive) {
            return;
        }

        if (this.path.length === 0) {
            this.attack(targetBuilding);
            return;
        }

        this.troopState = TROOP_STATE.MOVING;
        this.finalTarget = targetBuilding;
        this._moveToNextPathNode(gridSystem);
    },

    _moveToNextPathNode: function(gridSystem) {
        if (this.currentPathIndex >= this.path.length) {
            this.attack(this.finalTarget);
            return;
        }
        var nextNode = this.path[this.currentPathIndex];
        // cc.log("Troop " + this.id + ": Moving to next node (" + nextNode.x + "," + nextNode.y + "). isWallSegment: " + nextNode.isWallSegment + ", buildingId: " + nextNode.buildingId);

        // NEW: Check if the next node is a wall segment
        if (nextNode.isWallSegment) {
            // cc.log("Troop " + this.id + ": Detected wall segment in path.");
            // Find the actual wall object in the enemyBuildings list
            var wallToAttack = this.enemyBuildings.find(function(building) {
                return building.id === nextNode.buildingId;
            });

            if (wallToAttack) {
                // IMPORTANT: Save originalFinalTarget BEFORE stopping all movement and attacks
                this._originalFinalTarget = this.finalTarget; 
                
                this.stopAllMovementAndAttacks(); // Stop current movement and clear current finalTarget
                
                this.attack(wallToAttack); 
                this.troopState = TROOP_STATE.ATTACKING_WALL; 
                return; // Stop processing movement for this frame
            } else {
                cc.warn("Troop " + this.id + ": Path node marked as wall but no corresponding wall object found with ID: " + nextNode.buildingId);
                // Fallback: treat as regular movement if wall object not found
            }
        }

        var nextPos = gridSystem.gridToLocal(nextNode.x, nextNode.y);
        var currentPos = this.getPosition();

        var direction = Utils.calculateDirection(currentPos, nextPos);
        this.playAnimation("run", direction, true);
        this.currentDirection = direction;

        var moveDuration = this.moveSpeed > 0 ? 10.0 / this.moveSpeed : 0.2;

        var moveAction = cc.MoveTo.create(moveDuration, nextPos);
        var callback = cc.CallFunc.create(function() {
            this.currentPathIndex++;
            this._moveToNextPathNode(gridSystem);
        }, this);
        this.runAction(cc.Sequence.create(moveAction, callback));
    },

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
                cc.error("_createAnimationFrames: Failed to load texture for frame:" + framePath + "for troop " + this.troopType + " " +this.level + " anim " +  animName +  " dir " + directionString);
                return null;
            }

            const texSize = texture.getContentSize();
            if (!texSize || texSize.width === 0 || texSize.height === 0) {
                cc.error("Texture obtained but has zero or invalid dimensions for: " + framePath + " for troop " + this.troopType + " L" + this.level + " anim " + animName + " dir " + directionString);
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
            cc.error("No frames created for " + this.troopType + " L" + this.level + " - " + animName + ", direction " + directionString + " despite metadata definition. (Frame count expected: " + dirConfig.frameCount + ")");
        }
    },

    _setupAnimationType: function(animName, animMeta) {
        if (!animMeta || typeof animMeta.basePath !== 'string' || typeof animMeta.frameIndexPadding !== 'number' || typeof animMeta.directions !== 'object') {
            cc.warn("Animation metadata missing/invalid for troop " + this.troopType + " level " + this.level + " anim " + animName, animMeta);
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

        const ALL_TROOP_ANIM_META = TROOP_ANIMATION_METADATA;
        if (!ALL_TROOP_ANIM_META) {
            cc.error("TROOP_ANIMATION_METADATA is not loaded.");
            return;
        }

        const troopTypeMeta = ALL_TROOP_ANIM_META[this.troopType];
        if (!troopTypeMeta) {
            cc.error("Animation metadata not found for troop type: " + this.troopType);
            return;
        }

        const troopLevelMeta = troopTypeMeta[this.level.toString()];
        if (!troopLevelMeta) {
            cc.error("Animation metadata not found for troop: " + this.troopType + " level: " + this.level);
            return;
        }

        Object.keys(troopLevelMeta).forEach(function(animName) {
            const animMeta = troopLevelMeta[animName];
            this._setupAnimationType(animName, animMeta);
        }, this);
    },

    _validateAnimationObject: function(animationForDirection, animationName, direction) {
        if (!(animationForDirection instanceof cc.Animation)) {
            cc.error("Troop.playAnimation: Stored object for " + animationName + ", dir " + direction + " is NOT a cc.Animation instance. Type: " + (typeof animationForDirection));
            return false;
        }
        if (typeof animationForDirection.getFrames !== 'function' || typeof animationForDirection.getDuration !== 'function') {
            cc.error("Troop.playAnimation: Stored cc.Animation object for " + animationName + ", dir " + direction + " is missing expected methods (getFrames/getDuration).");
            return false;
        }
        return true;
    },

    _createAndValidateAnimateAction: function(animationForDirection, animationName, direction) {
        const framesInAnimation = animationForDirection.getFrames();

        if (!framesInAnimation || framesInAnimation.length === 0) {
            cc.error("Troop.playAnimation: cc.Animation object for " + animationName + ", dir " + direction + " has no frames. Cannot create cc.Animate.");
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
            cc.error("Troop.playAnimation: cc.Animate.create() returned null/undefined without throwing an exception for " + animationName + ", dir " + direction);
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
            cc.error("Troop.playAnimation: Sprite is null for " + this.troopType + " L" + this.level);
            return;
        }
        this.sprite.stopAllActions();

        this.sprite.setFlippedX(false);
        this.sprite.setFlippedY(false);
        this.sprite.setRotation(0);

        if (!this.animations) {
            cc.error("Troop.playAnimation: this.animations is null for " + this.troopType + " L" + this.level);
            return;
        }
        if (!this.animations[animationName]) {
            cc.error("Troop.playAnimation: Animation type '" + animationName + "' not found in this.animations for " + this.troopType + " L" + this.level + ". Available: " + Object.keys(this.animations));
            return;
        }

        const animationData = this.animations[animationName][direction];

        if (!animationData || !animationData.animation) {
            cc.error("Troop.playAnimation: Animation not found for name: '" + animationName + "' and direction: '" + direction + "' for troop " + this.troopType + " L" + this.level);
            if (this.animations[animationName]) {
                cc.log("Troop.playAnimation: Available directions for '" + animationName + "': " + Object.keys(this.animations[animationName]));
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
        this._super();
        cc.log("Troop onExit: Releasing animations for " + this.troopType + " L" + this.level);

        if (!this.animations) {
            return;
        }

        Object.keys(this.animations).forEach(animName => {
            const animDirMap = this.animations[animName];
            if (!animDirMap) {
                return;
            }

            Object.keys(animDirMap).forEach(directionKey => {
                const animation = animDirMap[directionKey];

                if (
                    animation &&
                    typeof animation.release === 'function' &&
                    cc.sys.isObjectValid &&
                    cc.sys.isObjectValid(animation)
                ) {
                    animation.release();
                }
            });
        });

        this.animations = null;
    }
});
