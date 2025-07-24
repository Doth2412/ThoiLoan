/**
 * EnemyBuilding.js: Lightweight logical representation of an enemy building for the BattleScene.
 */

const BATTLE_BUILDING_STATE = {
    IDLING: "IDLING",
    ATTACKING: "ATTACKING",
    DESTROYED: "DESTROYED",
};

var EnemyBuilding = cc.Class.extend({
    id: null,
    buildingType: null,
    level: null,
    gridX: null,
    gridY: null,
    width: null,
    height: null,
    category: null,
    compositeNode: null,
    maxGold: null,
    maxElixir: null,
    turretSprite: null,
    animation: null,

    health: null,
    maxHealth: null,
    buildingState: null,

    // --- New Attack Properties ---
    currentTarget: null,
    attackCooldown: 0,
    damagePerShot: 0,
    minAttackRange: 0,
    maxAttackRange: 0,
    attackSpeed: 0,
    splashRadius: 0,
    damageType: 0,
    bulletType: null,
    _battleScene: null,

    // --- Health Bar UI ---
    healthBarNode: null,

    ctor: function (buildingData, config, battleScene) {
        this.buildingType = buildingData.objType;
        this.level = buildingData.level;

        if (typeof buildingData.gridX !== 'undefined' && typeof buildingData.gridY !== 'undefined') {
            this.gridX = buildingData.gridX;
            this.gridY = buildingData.gridY;
            this.id = "building_" + this.gridX + "_" + this.gridY; // Use grid coords for ID
        } else if (typeof buildingData.cell !== 'undefined') {
            this.gridX = buildingData.cell % BATTLE_GRID_WIDTH;
            this.gridY = Math.floor(buildingData.cell / BATTLE_GRID_WIDTH);
            this.id = "building_" + buildingData.cell; // Use cell for ID
        } else {
            cc.error("EnemyBuilding: Missing grid coordinates or cell data.");
            this.gridX = 0;
            this.gridY = 0;
            this.id = "building_invalid";
        }

        this.width = config.width;
        this.height = config.height;
        this.maxHealth = config.hitpoints;
        this.maxGold = buildingData.gold;
        this.maxElixir = buildingData.elixir;
        this.health = this.maxHealth;
        this.maxResources = config.maxResources || 0
        this.buildingState = BATTLE_BUILDING_STATE.IDLING;
        this.category = this._determineCategory(this.buildingType);
        this._battleScene = battleScene;

        this.damagePerShot = config.damagePerShot || 0;
        const battleConfig = gv.configs.DefenceBattle.defenceBattle[this.buildingType];
        if (battleConfig) {
            this.minAttackRange = battleConfig.min_attack_range || 0;
            this.maxAttackRange = battleConfig.max_attack_range || 0;
            this.attackSpeed = battleConfig.attack_speed || 1.0;
            this.splashRadius = battleConfig.splash_radius || 0;
            this.damageType = battleConfig.damage_type || 1;
        }

        const levelMeta = DEFENSIVE_ANIMATION_METADATA[this.buildingType] ? DEFENSIVE_ANIMATION_METADATA[this.buildingType][this.level] : null;
        if (levelMeta) {
            this.bulletType = levelMeta.bulletType;
        }

        this.animations = {};
        this._setupAnimations();
        this._setupExplosionAnimation(); // New: Setup explosion animation
    },

    _setupAnimations: function() {
        const buildingMeta = DEFENSIVE_ANIMATION_METADATA[this.buildingType];
        if (!buildingMeta) {
            cc.warn("EnemyBuilding: Animation metadata not found for type: " + this.buildingType);
            return;
        }

        const levelMeta = buildingMeta[this.level];
        if (!levelMeta || !levelMeta.defenseAnim) {
            cc.warn("EnemyBuilding: Animation metadata not found for level " + this.level + " of type " + this.buildingType);
            return;
        }

        const animsToSetup = levelMeta.defenseAnim;
        for (var animName in animsToSetup) {
            this._setupAnimationByName(animName, animsToSetup[animName]);
        }
    },

    _setupExplosionAnimation: function() {
        const animName = "explosion_1";
        const animMeta = EXPLOSION_ANIMATION_METADATA[animName];

        if (!animMeta) {
            cc.error("Explosion animation metadata not found for: " + animName);
            return;
        }

        if (!this.animations[animName]) {
            this.animations[animName] = {};
        }

        const dirKey = "default";
        const dirMeta = animMeta.directions[dirKey];
        const frames = this._loadAnimationFrames(animMeta, dirMeta);

        if (frames.length > 0) {
            this._createAndStoreAnimation(animName, dirKey, frames, animMeta);
        } else {
            cc.warn("EnemyBuilding._setupExplosionAnimation: No frames were loaded for explosion animation.");
        }
    },

    _playOneShotEffect: function(animName, position, parentNode) {
        const animData = this.animations[animName]["default"];
        if (!animData || !animData.animation) {
            cc.error("EnemyBuilding._playOneShotEffect: Animation not found for " + animName);
            return;
        }

        const effectSprite = new cc.Sprite();
        // Apply the offset to the sprite's position relative to its parent
        effectSprite.setPosition(position.x + animData.offset.x, position.y + animData.offset.y);
        parentNode.addChild(effectSprite);

        const animation = animData.animation;
        const animateAction = cc.Animate.create(animation);

        const removeSprite = cc.CallFunc.create(() => {
            effectSprite.removeFromParent(true);
        }, effectSprite);

        effectSprite.runAction(cc.Sequence.create(animateAction, removeSprite));
    },

    playAnimation: function(animName, direction, loop, callback = null) {
        if (!this.turretSprite || !cc.sys.isObjectValid(this.turretSprite)) {
            return;
        }

        if (!this.animations[animName]) {
            cc.warn("EnemyBuilding.playAnimation: Animation '" + animName + "' not found for " + this.buildingType + ". Falling back to idle.");
            this.playAnimation("idle", direction, true);
            return;
        }
        
        const animData = this.animations[animName][direction];
        if (!animData || !animData.animation) {
            cc.warn("EnemyBuilding.playAnimation: Animation not found for " + animName + " with direction " + direction + ". Check for setup warnings.");
            return;
        }

        if (direction === "NE" || direction === "E" || direction === "SE") {
            this.turretSprite.setFlippedX(true);
        } else {
            this.turretSprite.setFlippedX(false);
        }

        const animation = animData.animation;

        let animateAction;
        if (loop) {
            animateAction = cc.RepeatForever.create(cc.Animate.create(animation));
        } else {
            const sequenceActions = [cc.Animate.create(animation)];
            if (callback) {
                sequenceActions.push(cc.CallFunc.create(callback, this));
            } else {
                sequenceActions.push(cc.CallFunc.create(() => {
                    this.playAnimation("idle", direction, true);
                }, this));
            }
            animateAction = cc.Sequence.create(sequenceActions);
        }
        
        this.turretSprite.stopAllActions();
        this.turretSprite.runAction(animateAction);
    },

    _setupAnimationByName: function(animName, animMeta) {
        this.animations[animName] = {};
        for (var dirKey in animMeta.directions) {
            const dirMeta = animMeta.directions[dirKey];
            const frames = this._loadAnimationFrames(animMeta, dirMeta);

            if (frames.length > 0) {
                this._createAndStoreAnimation(animName, dirKey, frames, animMeta);
            } else {
                cc.warn("EnemyBuilding._setupAnimations: No frames were loaded for animation " + animName + " in direction " + dirKey);
            }
        }
    },

    _loadAnimationFrames: function(animMeta, dirMeta) {
        const frames = [];
        for (let i = 0; i < dirMeta.frameCount; i++) {
            let frameIndex = (dirMeta.startFrame + i).toString();
            while (frameIndex.length < animMeta.frameIndexPadding) {
                frameIndex = '0' + frameIndex;
            }
            const frameName = animMeta.basePath + frameIndex + ".png";
            const texture = cc.textureCache.addImage(frameName);

            if (!texture) {
                cc.warn("EnemyBuilding._setupAnimations: Failed to load texture from path: " + frameName);
                continue;
            }

            const texSize = texture.getContentSize();
            if (texSize.width > 0 && texSize.height > 0) {
                const rect = cc.rect(0, 0, texSize.width, texSize.height);
                const frame = new cc.SpriteFrame(texture, rect);
                frames.push(frame);
            } else {
                cc.warn("EnemyBuilding._setupAnimations: Texture loaded but has zero dimensions for: " );
            }
        }
        return frames;
    },

    _createAndStoreAnimation: function(animName, dirKey, frames, animMeta) {
        const animation = new cc.Animation(frames, animMeta.frameDelay);
        animation.retain(); // Retain to prevent garbage collection
        this.animations[animName][dirKey] = {
            animation: animation,
            path: animMeta.basePath,
            offset: animMeta.offset || { x: 0, y: 0 } // NEW: Store offset
        };
    },

    playAnimation: function(animName, direction, loop) {
        if (!this.turretSprite || !cc.sys.isObjectValid(this.turretSprite)) {
            return;
        }

        if (!this.animations[animName]) {
            cc.warn("EnemyBuilding.playAnimation: Animation '" + animName + "' not found for " + this.buildingType + ". Falling back to idle.");
            this.playAnimation("idle", direction, true);
            return;
        }
        
        const animData = this.animations[animName][direction];
        if (!animData || !animData.animation) {
            cc.warn("EnemyBuilding.playAnimation: Animation not found for " + animName + " with direction " + direction + ". Check for setup warnings.");
            return;
        }

        if (direction === "NE" || direction === "E" || direction === "SE") {
            this.turretSprite.setFlippedX(true);
        } else {
            this.turretSprite.setFlippedX(false);
        }

        const animation = animData.animation;

        let animateAction;
        if (loop) {
            animateAction = cc.RepeatForever.create(cc.Animate.create(animation));
        } else {
            // When not looping, return to the idle animation facing the same direction.
            const returnToIdle = cc.CallFunc.create(() => {
                this.playAnimation("idle", direction, true);
            }, this);
            animateAction = cc.Sequence.create(cc.Animate.create(animation), returnToIdle);
        }
        
        this.turretSprite.stopAllActions();
        this.turretSprite.runAction(animateAction);
    },

    /**
     * Retrieves the bullet's origin offset for a specific attack direction.
     * @param {string} direction - The direction key (e.g., "S", "SW").
     * @returns {{x: number, y: number}} The offset, or a zero offset if not found.
     */
    _getBulletOriginOffset: function(direction) {
        try {
            const offset = DEFENSIVE_ANIMATION_METADATA[this.buildingType][this.level]
                .defenseAnim['attack01']
                .directions[direction]
                .bulletOriginOffset;

            // Handle flipped directions for NE, E, SE
            if (direction === "NE" || direction === "E" || direction === "SE") {
                return { x: -offset.x, y: offset.y };
            }
            return offset;

        } catch (e) {
            cc.warn("EnemyBuilding._getBulletOriginOffset: Could not find offset for " +
                this.buildingType + " Lvl " + this.level + " Dir: " + direction + ". Using default.");
            return { x: 0, y: 0 };
        }
    },

    /**
     * Releases retained animation objects to prevent memory leaks.
     */
    cleanup: function() {
        cc.log("EnemyBuilding.cleanup: Releasing animations for " + this.buildingType + " Lvl " + this.level);
        if (!this.animations) return;

        for (var animName in this.animations) {
            for (var dirKey in this.animations[animName]) {
                const animData = this.animations[animName][dirKey];
                if (animData && animData.animation && typeof animData.animation.release === 'function') {
                    animData.animation.release();
                }
            }
        }
        this.animations = null;
    },

    /**
     * Creates the health bar using cc.ProgressTimer. This will be called on the first hit.
     */
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

        const compositeNodeSize = this.compositeNode.getContentSize();
        this.healthBarNode.setAnchorPoint(0.5, 0.5);
        this.healthBarNode.setPosition(compositeNodeSize.width / 2, compositeNodeSize.height + 33);

        this.compositeNode.addChild(this.healthBarNode, 10);
        this.healthBarNode.setVisible(false);
    },

    takeDamage: function(damage) {
        this._dispatchResourceEvent(damage);
        this.health -= damage;
        if (!this.healthBarNode) {
            this._createHealthBar();
        }

        if (this.healthBarNode && this.healthBarNode.progressTimer) {
            if (!this.healthBarNode.isVisible()) {
                this.healthBarNode.setVisible(true);
            }
            const healthPercentage = (this.health / this.maxHealth) * 100;
            this.healthBarNode.progressTimer.setPercentage(Math.max(0, healthPercentage));
        }

        if (this.buildingType.startsWith("STO_1")) {
            this._playSplashEffect("GOLD_SPLASH");
        } else if (this.buildingType.startsWith("STO_2")) {
            this._playSplashEffect("ELIXIR_SPLASH");
        } else if (this.buildingType.startsWith("TOW_")) {
            this._playSplashEffect("GOLD_SPLASH");
            this._playSplashEffect("ELIXIR_SPLASH");
        }

        if (this.health <= 0) {
            this._handleDestruction();
        }
    },

    _handleDestruction: function() {
        this.health = 0;
        this.buildingState = BATTLE_BUILDING_STATE.DESTROYED;

        if (this.healthBarNode && cc.sys.isObjectValid(this.healthBarNode)) {
            this.healthBarNode.setVisible(false);
        }
        const compositeNodeWorldPos = this.compositeNode.getParent().convertToWorldSpace(this.compositeNode.getPosition());
        const compositeNodeSize = this.compositeNode.getContentSize();
        const explosionWorldX = compositeNodeWorldPos.x + compositeNodeSize.width / 2;
        const explosionWorldY = compositeNodeWorldPos.y + compositeNodeSize.height / 2;

        this._playOneShotEffect(
            "explosion_1",
            cc.p(explosionWorldX, explosionWorldY),
            this._battleScene
        );

        // Remove all existing children from compositeNode to ensure only the destroyed sprite remains
        this.compositeNode.removeAllChildren(true);

        let destroyedSpriteData = null;
        if (this.buildingType.startsWith("RES_")) {
            destroyedSpriteData = DESTROYED_BUILDING_SPRITE_MAP["RES_"][0];
        } else if (this.buildingType.startsWith("TOW_")) {
            destroyedSpriteData = DESTROYED_BUILDING_SPRITE_MAP["TOW_"][0];
        } else if (this.buildingType.startsWith("WAL_")) {
            destroyedSpriteData = DESTROYED_BUILDING_SPRITE_MAP["WAL_"][0];
        } else {
            const defaultSprites = DESTROYED_BUILDING_SPRITE_MAP["DEFAULT"];
            const randomIndex = Math.floor(Math.random() * defaultSprites.length);
            destroyedSpriteData = defaultSprites[randomIndex];
        }

        if (destroyedSpriteData) {
            const destroyedSprite = new cc.Sprite(destroyedSpriteData.path);
            destroyedSprite.setPosition(destroyedSpriteData.offset.x, destroyedSpriteData.offset.y);
            this.compositeNode.addChild(destroyedSprite);
        } else {
            cc.warn("EnemyBuilding._handleDestruction: No destroyed sprite data found for buildingType: " + this.buildingType);
        }

        cc.eventManager.dispatchCustomEvent(BattleEvents.BUILDING_DESTROYED, {
            buildingId: this.id,
            building: this,
            buildingType: this.buildingType,

        });
        cc.log("Building destroyed: " + this.buildingType);
    },

    _determineCategory: function (buildingType) {
        if (buildingType.startsWith("DEF_")) {
            return TARGET_CATEGORY.DEFENSE;
        }
        if (buildingType.startsWith("STO_") || buildingType.startsWith("RES_")) {
            return TARGET_CATEGORY.RESOURCE;
        }
        return TARGET_CATEGORY.ANY;
    },

    /**
     * Main update loop for the building, called from BattleScene.
     * @param {number} dt - Delta time.
     * @param {Array<Troop>} activeTroops - A list of all active troops on the map.
     * @param {GridSystem} gridSystem - The grid system for coordinate conversion.
     */
    update: function(dt, activeTroops, gridSystem) {
        if (this._battleScene && this._battleScene._battleEnded) {
            return;
        }
        if (this.buildingState === BATTLE_BUILDING_STATE.DESTROYED) {
            return;
        }

        if (this.currentTarget) {
            if (!this.currentTarget.isAlive || !this.isInRange(this.currentTarget, gridSystem)) {
                this.currentTarget = null;
                this.buildingState = BATTLE_BUILDING_STATE.IDLING;
                if (this.turretSprite) {
                    this.playAnimation("idle", "S", true);
                }
            }
        }

        // State machine
        if (this.buildingState === BATTLE_BUILDING_STATE.IDLING) {
            this.findTarget(activeTroops, gridSystem);
        } else if (this.buildingState === BATTLE_BUILDING_STATE.ATTACKING) {
            this.attackCooldown -= dt;
            if (this.attackCooldown <= 0) {
                this.performAttack();
                this.attackCooldown = this.attackSpeed;
            }
        }
    },

    /**
     * Finds the nearest valid troop within attack range.
     * @param {Array<Troop>} activeTroops - List of all active troops.
     */
    findTarget: function(activeTroops, gridSystem) {
        let bestTarget = null;
        let closestDistanceSq = Infinity;

        const minRangeSq = this.minAttackRange * this.minAttackRange;
        const maxRangeSq = this.maxAttackRange * this.maxAttackRange;

        for (var troop of activeTroops) {
            if (!troop || !troop.isAlive) {
                continue;
            }

            const troopScreenPos = troop.getPosition();
            const troopGridPos = gridSystem.localToGrid(troopScreenPos.x, troopScreenPos.y);
            const distanceSq = cc.pDistanceSQ(cc.p(this.gridX, this.gridY), troopGridPos);

            const isInValidRange = (distanceSq >= minRangeSq && distanceSq <= maxRangeSq);
            if (!isInValidRange) {
                continue; 
            }

            if (distanceSq < closestDistanceSq) {
                closestDistanceSq = distanceSq;
                bestTarget = troop;
            }
        }

        if (bestTarget) {
            this.currentTarget = bestTarget;
            this.buildingState = BATTLE_BUILDING_STATE.ATTACKING;
        }
    },

    performAttack: function () {
        cc.log("EnemyBuilding: Performing attack on target:", this.currentTarget ? this.currentTarget.id : "None");
        if (!this.currentTarget || !this.currentTarget.isAlive) {
            return;
        }

        var direction = "S";
        var turretWorldPos = this.turretSprite.getParent().convertToWorldSpace(this.turretSprite.getPosition());
        if (this.turretSprite && this.compositeNode) {
            var targetPos = this.currentTarget.getPosition();
            var buildingPos = this.compositeNode.getPosition();
            direction = Utils.calculateDirection(buildingPos, targetPos);
            this.playAnimation("attack01", direction, false);

            if (this.buildingType.startsWith("DEF_1")) {
                var turretSize = this.turretSprite.getContentSize();
                var fireEffectX = turretWorldPos.x + turretSize.width / 2;
                var fireEffectY = turretWorldPos.y + turretSize.height / 2;

                const cannonFireAnimData = this.animations["cannon_fire"][direction];
                if (cannonFireAnimData && cannonFireAnimData.animation) {
                    const fireEffectSprite = new cc.Sprite();
                    fireEffectSprite.retain();

                    let fireOffsetX = 0;
                    let fireOffsetY = 0;
                    const def1Meta = DEFENSIVE_ANIMATION_METADATA[this.buildingType][this.level];
                    if (def1Meta) {
                        const dirSpecificOffset = def1Meta.defenseAnim.cannon_fire.directions[direction].offset;
                        if (dirSpecificOffset) {
                            fireOffsetX = dirSpecificOffset.x;
                            fireOffsetY = dirSpecificOffset.y;
                        }
                    }

                    fireEffectSprite.setPosition(fireEffectX + fireOffsetX, fireEffectY + fireOffsetY);
                    this._battleScene.addChild(fireEffectSprite);

                    const animateAction = cc.Animate.create(cannonFireAnimData.animation);
                    const removeAction = cc.callFunc(() => {
                        fireEffectSprite.removeFromParent(true);
                    });

                    fireEffectSprite.runAction(cc.sequence(animateAction, removeAction));
                } else {
                    cc.warn("EnemyBuilding.performAttack: Cannon fire animation not found for DEF_1 and direction: " + direction);
                }
            }
        }

        cc.log("EnemyBuilding: Firing bullet at target:", this.currentTarget.id, "damage = " + this.damagePerShot);

        // Calculate bullet start position
        var offset = this._getBulletOriginOffset(direction);
        var startPos = cc.pAdd(turretWorldPos, cc.p(offset.x, offset.y));

        cc.eventManager.dispatchCustomEvent(BattleEvents.FIRE_BULLET, {
            attacker: this,
            target: this.currentTarget,
            damage: this.damagePerShot,
            bulletType: this.bulletType,
            startPos: startPos
        });
    },

    /**
     * Checks if a troop is within the building's attack range.
     * @param {Troop} troop - The troop to check.
     * @param {GridSystem} gridSystem - The grid system for coordinate conversion.
     * @returns {boolean}
     */
    isInRange: function(troop, gridSystem) {
        var troopScreenPos = troop.getPosition();
        var troopGridPos = gridSystem.localToGrid(troopScreenPos.x, troopScreenPos.y);
        const distance = cc.pDistance(cc.p(this.gridX, this.gridY), troopGridPos);
        return distance >= this.minAttackRange && distance <= this.maxAttackRange;
    },

    _dispatchResourceEvent: function(damage) {
        var actualDamage = Math.min(this.health, damage);
        if (actualDamage > 0) {
            cc.eventManager.dispatchCustomEvent(BattleEvents.ATTACK_DEALT, {
                damageDealt: actualDamage,
                buildingType: this.buildingType
            });
        }
    },

    _playSplashEffect: function(effectType) {
        const effectData = SPLASH_EFFECT_METADATA[effectType];
        if (!effectData) {
            cc.warn("EnemyBuilding._playSplashEffect: Effect data not found for type: " + effectType);
            return;
        }

        // Get the world position of the building's center
        const buildingWorldPos = this.compositeNode.getParent().convertToWorldSpace(this.compositeNode.getPosition());
        const buildingSize = this.compositeNode.getContentSize();
        const baseStartWorldX = buildingWorldPos.x + buildingSize.width / 2 + effectData.startOffset.x;
        const baseStartWorldY = buildingWorldPos.y + buildingSize.height / 2 + effectData.startOffset.y;

        const parentNode = this._battleScene;

        for (let i = 0; i < effectData.numberOfParticles; i++) {
            const randomOffsetX = (Math.random() - 0.5) * effectData.randomStartOffsetRange;
            const randomOffsetY = (Math.random() - 0.5) * effectData.randomStartOffsetRange;
            const particleStartPos = cc.p(baseStartWorldX + randomOffsetX, baseStartWorldY + randomOffsetY);

            const particle = new cc.Sprite(effectData.path);
            particle.retain();
            particle.setPosition(particleStartPos);
            parentNode.addChild(particle);

            const baseAngle = 90;
            const randomAngleOffset = (Math.random() - 0.5) * effectData.spreadAngle; // -spread/2 to +spread/2
            const finalAngleRad = cc.degreesToRadians(baseAngle + randomAngleOffset);

            const moveX = Math.cos(finalAngleRad) * effectData.particleSpeed * effectData.duration;
            const moveY = Math.sin(finalAngleRad) * effectData.particleSpeed * effectData.duration;

            const moveAction = cc.moveBy(effectData.duration, cc.p(moveX, moveY));
            const fadeOutAction = cc.fadeOut(effectData.fadeOutDuration);
            const spawnAction = cc.spawn(moveAction, fadeOutAction); // Move and fade simultaneously
            const removeAction = cc.callFunc(() => {
                particle.removeFromParent(true);
            });

            particle.runAction(cc.sequence(spawnAction, removeAction));
        }
    }
});
