var Bullet = cc.Node.extend({
    attacker: null,
    target: null,
    damage: 0,
    speed: 0,
    sprite: null,
    battleScene: null,
    bulletType: null,
    splashRadius: 0,

    _parabolicMoveTime: 0,
    _parabolicDuration: 0,
    _startPos: null,
    _controlPoint: null,
    _targetPos: null,
    _previousPos: null,

    ctor: function(attacker, target, damage, bulletType, battleScene, startPos, splashRadius) {
        this._super();

        this.attacker = attacker;
        this.target = target;
        this.damage = damage;
        this.bulletType = bulletType;
        this.battleScene = battleScene;
        this.splashRadius = (splashRadius || 0) * 76; // Convert to pixel units

        const bulletMeta = this.bulletType ? BULLET_METADATA[this.bulletType] : null;
        if (!bulletMeta) {
            cc.error("Bullet ctor: Metadata not found for bulletType: " + this.bulletType + ". Bullet will not be created.");
            this.removeFromParent(true);
            return;
        }

        this.speed = bulletMeta.speed || 800;

        this.sprite = new cc.Sprite();
        this.addChild(this.sprite);
        this._setupVisuals(bulletMeta);
        this._setupHitEffects();

        var localStartPos;
        if (startPos) {
            localStartPos = battleScene.tmxMapNode.convertToNodeSpace(startPos);
        } else {
            localStartPos = attacker.compositeNode ? attacker.compositeNode.getPosition() : cc.p(0, 0);
        }
        this.setPosition(localStartPos);


        // to reuse the bullet for either: a Troop (which is a cc.Node) or an EnemyBuilding (a logical class).
        var targetPos;
        if (target && target.compositeNode) {
            targetPos = target.compositeNode.getPosition();
        } else {
            targetPos = target.getPosition();
        }

        // Apply offset for buildings
        if (target && target.buildingType) {
            var config = BUILDING_UI_CONFIG[target.buildingType];
            if (config && config.offset) {
                targetPos.x += config.offset.x;
                targetPos.y += Math.abs(config.offset.y); // since building have, idk why, either positive or negative offset so i have to do this
            }
        }

        // Add a small random offset to the target position
        var randomOffsetX = (Math.random() - 0.5) * 20;
        var randomOffsetY = (Math.random() - 0.5) * 20 + 25;
        targetPos.x += randomOffsetX;
        targetPos.y += randomOffsetY;
        var angle = cc.pToAngle(cc.pSub(targetPos, localStartPos));
        var rotationDegrees = -1 * cc.radiansToDegrees(angle);
        rotationDegrees += 90;

        this.setRotation(rotationDegrees);
        this.launch(targetPos);
    },

    _setupVisuals: function(meta) {
        if (meta.assetType === 'sprite') {
            this.sprite.initWithFile(meta.path);
        } else if (meta.assetType === 'animation') {
            var frames = [];
            for (var i = 0; i < meta.frameCount; i++) {
                let frameIndex = i.toString();
                while (frameIndex.length < meta.frameIndexPadding) {
                    frameIndex = '0' + frameIndex;
                }
                var frameName = meta.path + frameIndex + ".png";
                var texture = cc.textureCache.addImage(frameName);
                if (texture) {
                    var rect = cc.rect(0, 0, texture.getContentSize().width, texture.getContentSize().height);
                    frames.push(new cc.SpriteFrame(texture, rect));
                } else {
                    cc.log("ERROR: Failed to load bullet frame: " + frameName);
                }
            }

            if (frames.length > 0) {
                var animation = new cc.Animation(frames, meta.frameDelay || 0.05);
                var animate = cc.Animate.create(animation);
                this.sprite.runAction(cc.RepeatForever.create(animate));
            }
        }
    },

    _setupHitEffects: function() {
        this.hitEffectAnimations = {};

        for (var bulletType in BULLET_METADATA) {
            const bulletMeta = BULLET_METADATA[bulletType];
            if (bulletMeta.hitEffect) {
                const hitEffectMeta = bulletMeta.hitEffect;
                const animName = bulletType + "_HIT";

                const frames = [];
                for (let i = 0; i < hitEffectMeta.frameCount; i++) {
                    let frameIndex = i.toString();
                    while (frameIndex.length < hitEffectMeta.frameIndexPadding) {
                        frameIndex = '0' + frameIndex;
                    }
                    const framePath = hitEffectMeta.basePath + frameIndex + ".png";
                    const texture = cc.textureCache.addImage(framePath);
                    if (texture) {
                        const rect = cc.rect(0, 0, texture.getContentSize().width, texture.getContentSize().height);
                        frames.push(new cc.SpriteFrame(texture, rect));
                    } else {
                        cc.warn("Bullet._setupHitEffects: Failed to load hit effect frame: " + framePath);
                    }
                }

                if (frames.length > 0) {
                    const animation = new cc.Animation(frames, hitEffectMeta.frameDelay || 0.05);
                    animation.retain(); // Retain the animation
                    this.hitEffectAnimations[animName] = animation;
                } else {
                    cc.warn("Bullet._setupHitEffects: No frames loaded for hit effect: " + animName);
                }
            }
        }
    },

    _playHitEffect: function(effectName, position) {
        const animation = this.hitEffectAnimations[effectName];
        if (!animation) {
            cc.warn("Bullet._playHitEffect: Animation not found for effect: " + effectName);
            return;
        }

        const effectSprite = new cc.Sprite();
        effectSprite.retain(); // Retain the effect sprite
        effectSprite.setPosition(position);
        this.battleScene.tmxMapNode.addChild(effectSprite); // Add to the map node

        const animateAction = cc.Animate.create(animation);
        const removeAction = cc.callFunc(() => {
            effectSprite.removeFromParent(true);
        });

        effectSprite.runAction(cc.sequence(animateAction, removeAction));
    },

    launch: function(targetPos) {
        if (this.battleScene && this.battleScene._battleEnded) {
            this.removeFromParent(true);
            return;
        }
        // Decide which trajectory to use based on the bullet type
        if (this.bulletType === "MORTAR_SHELL" || this.bulletType === "ARCHER_ARROW") {
            this._launchParabolic(targetPos);
        } else {
            this._launchLinear(targetPos);
        }
    },

    _launchLinear: function(targetPos) {
        var startPos = this.getPosition();
        var distance = cc.pDistance(startPos, targetPos);
        var duration = distance / this.speed;

        var moveAction = cc.MoveTo.create(duration, targetPos);
        var hitAction = cc.CallFunc.create(this._onHit, this);
        var sequence = cc.Sequence.create(moveAction, hitAction);

        this.runAction(sequence);
    },

    _launchParabolic: function(targetPos) {
        var startPos = this.getPosition();
        var distance = cc.pDistance(startPos, targetPos);
        var duration = distance / this.speed;

        // Define the control point for the arc.
        var arcHeight = distance * 0.6;
        var controlPoint = cc.p((startPos.x + targetPos.x) / 2, Math.max(startPos.y, targetPos.y) + arcHeight);

        // Store trajectory properties
        this._parabolicDuration = duration;
        this._startPos = startPos;
        this._controlPoint = controlPoint;
        this._targetPos = targetPos;
        this._previousPos = startPos;

        // Schedule the custom update function to move the bullet
        this.schedule(this.updateParabolic);
    },

    updateParabolic: function(dt) {
        if (this.battleScene && this.battleScene._battleEnded) {
            this.unschedule(this.updateParabolic);
            this.removeFromParent(true);
            return;
        }
        this._parabolicMoveTime += dt;
        var t = this._parabolicMoveTime / this._parabolicDuration;

        if (t >= 1.0) {
            t = 1.0;
            this.unschedule(this.updateParabolic);
            this.setPosition(this._targetPos);
            this._onHit();
            return;
        }

        var newPos = BezierUtils.getQuadraticBezierPoint(t, this._startPos, this._controlPoint, this._targetPos);
        this.setPosition(newPos);

        // Update rotation to follow the tangent of the curve
        if (!cc.pSameAs(newPos, this._previousPos)) {
            var directionVector = cc.pSub(newPos, this._previousPos);
            var angle = cc.pToAngle(directionVector);
            var degrees = -cc.radiansToDegrees(angle);
                degrees += 90;
            this.setRotation(degrees);
        }
        this._previousPos = newPos;
    },

    _onHit: function() {
        if (this.splashRadius > 0) {
            // AOE damage
            const impactPos = this.getPosition();
            const allTroops = this.battleScene.battleTroopManager.getActiveTroops();
            const allBuildings = this.battleScene._enemyBuildings;

            const potentialTargets = [...allTroops, ...allBuildings];
            for (var target of potentialTargets) {
                if (!target || (!target.isAlive && target.buildingState === "DESTROYED")) {
                    continue;
                }

                let targetPos;
                let targetId = "Unknown";

                if (target.compositeNode) {
                    targetPos = target.compositeNode.getPosition();
                    targetId = target.id || target.buildingType;
                } else if (target.getPosition) {
                    targetPos = target.getPosition();
                    targetId = target.id;
                }

                const distance = cc.pDistance(impactPos, targetPos);

                if (distance <= this.splashRadius) {
                    target.takeDamage(this.damage);
                }
            }
        } else if (this.target) {
            // Single target damage
            var canTakeDamage = false;
            // Target is a Troop, which has an 'isAlive' property
            if (typeof this.target.isAlive !== 'undefined') {
                canTakeDamage = this.target.isAlive;
            }
            // Target is an EnemyBuilding, which has a 'buildingState' property
            else if (typeof this.target.buildingState !== 'undefined') {
                canTakeDamage = (this.target.buildingState !== "DESTROYED");
            }

            if (canTakeDamage) {
                this.target.takeDamage(this.damage);
            }
        } else {
            cc.log("Bullet._onHit: Hit detected, but target was null or invalid.");
        }

        const bulletMeta = BULLET_METADATA[this.bulletType];
        if (bulletMeta && bulletMeta.hitEffect) {
            const hitEffectName = this.bulletType + "_HIT";
            this._playHitEffect(hitEffectName, this.getPosition()); // Play at bullet's current position
        }

        this.removeFromParent(true);
    }
});
