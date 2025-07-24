/**
 * ResourceGenerator.js
 * ResourceGenerator class that extends the existing building system with resource generation capabilities
 * Implements resource generation states and logic for GOLD and OIL generation
 */

/**
 * Resource Type Constants
 */
const RESOURCE_TYPES = {
    GOLD: "GOLD",
    OIL: "OIL"
};

/**
 * ResourceGenerator Class
 * Extends the existing building management system with resource generation capabilities
 */
var ResourceGenerator = Building.extend({
    playerDataManager: null,
    resourceType: null,
    productivity: 0,
    capacity: 0,     
    accumulatedResources: 0,
    lastGenerationTime: 0,
    
    generationConfig: null,
    
    harvestIconBg: null,        // Background for harvest icon
    harvestIcon: null,          // Resource-specific harvest icon
    harvestIconVisible: false,  // Track visibility state
    
    /**
     * Constructor
     * @param {Object} buildingData - Building data from PlayerDataManager
     */
    ctor: function (buildingData) {
        this._super(buildingData);
        this.playerDataManager = PlayerDataManager.getInstance();
        if (!this.buildingType && buildingData && buildingData.buildingType) {
            this.buildingType = buildingData.buildingType;
        }
        this.generationConfig = ItemConfigUtils.getBuildingConfig(this, this.level);
        this.resourceType = ItemConfigUtils.getResourceType(this.generationConfig);
        this.productivity = this.generationConfig.productivity;
        this.capacity = this.generationConfig.capacity;
        this.accumulatedResources = buildingData.accumulatedResources || 0;
        cc.log("accumulated res" +  this.accumulatedResources);
        this.lastGenerationTime = buildingData.stateStartTime;
        this.harvestIconBg = null;
        this.harvestIcon = null;
        this.harvestIconVisible = false;
        cc.log("ResourceGenerator created: " + this.buildingType + 
               " (Type: " + this.resourceType + ", Rate: " + this.productivity +
               " /hr, Capacity: " + this.capacity + ")");
    },

    _initializeHarvestIcon: function() {
        try {
            this.harvestIconBg = new cc.Sprite(res.collect_bg_png);
            if (!this.harvestIconBg || !this.harvestIconBg.getTexture()) {
                cc.warn("ResourceGenerator " + this.buildingType + " - Failed to load harvest icon background");
                this.harvestIconBg = null;
                return;
            }
            
            var iconRes = this._getHarvestIconResource();
            if (iconRes) {
                this.harvestIcon = new cc.Sprite(iconRes);
                if (!this.harvestIcon || !this.harvestIcon.getTexture()) {
                    cc.warn("ResourceGenerator " + this.buildingType + " - Failed to load harvest icon for " + this.resourceType);
                    this.harvestIcon = null;
                }
            } else {
                cc.warn("ResourceGenerator " + this.buildingType + " - No harvest icon resource for " + this.resourceType);
                this.harvestIcon = null;
            }
            this.harvestIconBg.setScale(1.0); // Make it slightly smaller
            this.harvestIconBg.setVisible(false);
            this.harvestIconBg.setName("harvest_icon_bg");
    
            // NOTE: Don't add to compositeNode here - it's null during construction
            // Will be added later in setupVisualComponents() method
            
            // Configure resource-specific harvest icon if available
            if (this.harvestIcon) {
                this.harvestIcon.setAnchorPoint(0.5, 0.5);
                this.harvestIcon.setScale(1.0);
                this.harvestIcon.setPosition(this.harvestIconBg.getContentSize().width / 2, this.harvestIconBg.getContentSize().height / 2); // Centered on background
                this.harvestIcon.setVisible(false);
                this.harvestIcon.setName("harvest_icon");
                
                this.harvestIconBg.addChild(this.harvestIcon, 1);
            }
              // Initialize visibility state
            this.harvestIconVisible = false;
            
            this._addHarvestIconTouchHandling();
            
        } catch (error) {
            cc.error("ResourceGenerator " + this.buildingType + " - Error initializing harvest icon: " + error.message);
            this.harvestIconBg = null;
            this.harvestIcon = null;            
            this.harvestIconVisible = false;
        }
    },

    /**
     * Setup visual components after compositeNode is assigned
     * Must be called by BuildingsManager after setting compositeNode
     */
    setupVisualComponents: function() {
        if (!this.compositeNode) {
            cc.warn("ResourceGenerator: " + this.buildingType + " - Cannot setup visual components, compositeNode not available");
            return;
        }
        
        // Add harvest icon background to composite node
        if (this.harvestIconBg) {
            this.compositeNode.addChild(this.harvestIconBg, 100); // High Z-order to be on top
        }
        else {
            cc.warn("ResourceGenerator: " + this.buildingType + " - Harvest icon background not initialized, cannot add to scene");
        }
        // Update positioning now that we have building sprites available
        if (this.harvestIconBg && this.buildingSprite) {
            var buildingHeight = this.buildingSprite.getContentSize().height;
            this.harvestIconBg.setPosition(0, buildingHeight / 1.5);
        }
        
        // Trigger initial harvest indicator update
        this._updateHarvestIndicator();
    },
    
    /**
     * Get the resource-specific harvest icon resource
     * @returns {string|null} Resource path for harvest icon
     */
    _getHarvestIconResource: function() {
        switch (this.resourceType) {
            case RESOURCE_TYPES.GOLD:
                return res.collect_res_res_1_png; // RES_1 for gold mines
            case RESOURCE_TYPES.OIL:
                return res.collect_res_res_2_png; // RES_2 for oil collectors
            default:
                return res.collect_res_res_3_png;
        }
    },

    _addHarvestIconTouchHandling: function() {
        if (!this.harvestIconBg) {
            cc.warn("ResourceGenerator " + this.buildingType + " - Cannot add touch handling, harvest icon background not available");
            return;
        }
        
        try {
            // Create a touch listener for the harvest icon
            var touchListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                  onTouchBegan: function(touch, event) {
                    var target = event.getCurrentTarget();
                    if (!target || !target.isVisible()) {
                        return false;
                    }
                    
                    // Get touch location in target's coordinate space
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var targetSize = target.getContentSize();
                    var rect = cc.rect(0, 0, targetSize.width, targetSize.height);
                    
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        target.runAction(cc.scaleTo(0.1, 0.7));
                        return true;
                    }
                    
                    return false;
                }.bind(this),
                  onTouchEnded: function(touch, event) {
                    var target = event.getCurrentTarget();
                    if (!target) {
                        return;
                    }
                    target.runAction(cc.scaleTo(0.1, 0.8));
                    
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var targetSize = target.getContentSize();
                    var rect = cc.rect(0, 0, targetSize.width, targetSize.height);
                    
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        this._onHarvestIconTapped();
                    } else {
                    }
                }.bind(this),
                
                onTouchCancelled: function(touch, event) {
                    var target = event.getCurrentTarget();
                    if (target) {
                        target.runAction(cc.scaleTo(0.1, 0.8));
                    }
                }.bind(this)
            });
            
            cc.eventManager.addListener(touchListener, this.harvestIconBg);
        } catch (error) {
            cc.error("ResourceGenerator " + this.buildingType + " - Error adding harvest icon touch handling: " + error.message);
        }
    },
    
    _onHarvestIconTapped: function () {
        cc.log("📊 PRE-HARVEST STATUS: " + this.resourceType + " generator with " + 
               this.accumulatedResources + "/" + this.capacity + " resources accumulated");
        
        if (gv && this.playerDataManager) {
            var playerAmount = this.playerDataManager.getResourceAmount( this.resourceType.toLowerCase());
            var playerCapacity = this.playerDataManager.getResourceCapacity( this.resourceType.toLowerCase());
        }
        
        if (!this.canHarvest()) {
            cc.warn("❌ HARVEST BUTTON CLICKED BUT CANNOT HARVEST! Generator: " + this.buildingType + 
                   " (Harvestable amount: " + this.getHarvestableAmount() + 
                   ", State: " + this.buildingState + ")");
            return;
        }
        
        var harvestableAmount = this.getHarvestableAmount();
        // Trigger harvest operation
        var harvestResult = this.harvest();
        if (harvestResult.success) {
            if (gv && this.playerDataManager) {
                var newPlayerAmount = this.playerDataManager.getResourceAmount( this.resourceType.toLowerCase());
            }
        } else {
            cc.warn("❌ HARVEST BUTTON FAILED! Generator: " + this.buildingType + 
                   " - Reason: " + (harvestResult.message || "Unknown error"));
        }
        
        if (typeof cc.eventManager !== 'undefined') {
            cc.eventManager.dispatchCustomEvent("RESOURCE_GENERATOR_HARVEST_ICON_TAPPED", {
                generator: this,
                harvestResult: harvestResult,
                resourceType: this.resourceType,
                amount: harvestResult.amount || 0,
                clickTimestamp: Date.now()
            });
        }
        
        if (harvestResult.success && this.harvestIconBg) {
            let splashEffectType = null;
            if (this.buildingType.startsWith("RES_1")) {
                splashEffectType = "GOLD_SPLASH";
            } else if (this.buildingType.startsWith("RES_2")) {
                splashEffectType = "ELIXIR_SPLASH";
            }

            if (splashEffectType) {

                const harvestIconWorldPos = this.harvestIconBg.getParent().convertToWorldSpace(this.harvestIconBg.getPosition());
                const harvestIconSize = this.harvestIconBg.getContentSize();
                const splashOriginX = harvestIconWorldPos.x + harvestIconSize.width / 2;
                const splashOriginY = harvestIconWorldPos.y + harvestIconSize.height / 2;

                cc.log("DEBUG: _onHarvestIconTapped: Splash origin (World): " + splashOriginX + ", " + splashOriginY);
                cc.log("DEBUG: _onHarvestIconTapped: Parent node for splash: " + (this.compositeNode.getParent() ? this.compositeNode.getParent().getName() : "null")); // Log parent node name if available

                this._playSplashEffect(splashEffectType, cc.p(splashOriginX, splashOriginY), this.compositeNode.getParent()); // Use compositeNode's parent as parentNode
            }
        }
    },

    _playSplashEffect: function(effectType, position, parentNode) {

        const effectData = GENERATOR_SPLASH_EFFECT_METADATA[effectType];
        if (!effectData) {
            cc.warn("ResourceGenerator._playSplashEffect: Effect data not found for type: " + effectType);
            return;
        }

        for (let i = 0; i < effectData.numberOfParticles; i++) {
            const randomOffsetX = (Math.random() - 0.5) * effectData.randomStartOffsetRange;
            const randomOffsetY = (Math.random() - 0.5) * effectData.randomStartOffsetRange;
            const particleStartPos = cc.p(position.x + randomOffsetX, position.y + randomOffsetY);

            const particle = new cc.Sprite(effectData.path);
            particle.retain();
            const localParticleStartPos = parentNode.convertToNodeSpace(particleStartPos);
            particle.setPosition(localParticleStartPos);
            parentNode.addChild(particle);

            const baseAngle = 90;
            const randomAngleOffset = (Math.random() - 0.5) * effectData.spreadAngle;
            const finalAngleRad = cc.degreesToRadians(baseAngle + randomAngleOffset);

            const moveX = Math.cos(finalAngleRad) * effectData.particleSpeed * effectData.duration;
            const moveY = Math.sin(finalAngleRad) * effectData.particleSpeed * effectData.duration;

            const moveAction = cc.moveBy(effectData.duration, cc.p(moveX, moveY));
            const fadeOutAction = cc.fadeOut(effectData.fadeOutDuration);
            const spawnAction = cc.spawn(moveAction, fadeOutAction);
            const removeAction = cc.callFunc(() => {
                particle.removeFromParent(true);
            });

            particle.runAction(cc.sequence(spawnAction, removeAction));
        }
    },

    /**
     * Check if player's resource capacity is full
     * @returns {boolean} True if player's resource capacity is full
     */
    _isPlayerResourceCapacityFull: function() {
        if (!gv || !this.playerDataManager) {
            return false;
        }
        
        try {
            // Get player's current resources and capacity
            const playerResources = this.playerDataManager.getResourceAmount( this.resourceType.toLowerCase());
            const playerCapacity = this.playerDataManager.getResourceCapacity( this.resourceType.toLowerCase());
            
            if (playerCapacity <= 0) {
                return false;
            }
            
            const isFull = playerResources >= playerCapacity;

            // Log when capacity is getting close (95% full)
            if (!isFull && playerResources >= (playerCapacity * 0.95)) {
                cc.log("ResourceGenerator " + this.name + " - Player " + this.resourceType + " capacity nearly full: " +
                       playerResources + "/" + playerCapacity + " (" + Math.round((playerResources/playerCapacity)*100) + "%)");
            }
            
            return isFull;
        } catch (error) {
            cc.log("ResourceGenerator " + this.buildingType + " - Error checking player capacity: " + error.message);
            return false;
        }
    },
    
    /**
     * Update resource generation based on elapsed time
     * Called periodically by the game loop or building manager
     */
    updateGeneration: function (isInitialLoginCalculation = false) {
        if (!isInitialLoginCalculation && this.buildingState !== BUILDING_STATES.OPERATING) {
            return;
        }
        if (isInitialLoginCalculation && (this.buildingState === BUILDING_STATES.CONSTRUCTING || this.buildingState === BUILDING_STATES.UPGRADING)) {
            return;
        }

        // If the generator is already full, ensure its state is updated and exit.
        if (this.accumulatedResources >= this.capacity) {
            this._updateState(); // This should transition the state to IDLE if it's not already.
            return;
        }

        const currentTime = Date.now();
        const elapsedMilliseconds = currentTime - this.lastGenerationTime;

        if (elapsedMilliseconds <= 0) {
            return;
        }

        const elapsedHours = elapsedMilliseconds / (1000 * 60 * 60);

        const potentialGenerated = elapsedHours * this.productivity;
        const generatedAmount = Math.floor(potentialGenerated);

        if (generatedAmount > 0) {
            const maxAddable = this.capacity - this.accumulatedResources;
            const actualGenerated = Math.min(generatedAmount, maxAddable);

            if (actualGenerated > 0) {
                this.accumulatedResources += actualGenerated;

                const timeForGeneratedResources = (actualGenerated / this.productivity) * 3600 * 1000; // in milliseconds
                this.lastGenerationTime += timeForGeneratedResources;

                this._updateState();

                this._updateHarvestIndicator();

                if (typeof cc.eventManager !== 'undefined') {
                    cc.eventManager.dispatchCustomEvent("RESOURCE_GENERATOR_GENERATED", {
                        generator: this,
                        generatedAmount: actualGenerated,
                        totalAccumulated: this.accumulatedResources,
                        capacity: this.capacity
                    });
                }
            }
        }
    },

    /**
     * Update generator state based on current conditions
     * Enhanced state logic with proper transitions and validations
     */
    _updateState: function() {
        const previousState = this.buildingState;
        let newState = this.buildingState;

        // Building is operational, determine generator state
        const isGeneratorFull = this.accumulatedResources >= this.capacity;
        const isPlayerCapacityFull = this._isPlayerResourceCapacityFull();

        // State transition logic
        switch (this.buildingState) {
            case BUILDING_STATES.CONSTRUCTING:
            case BUILDING_STATES.UPGRADING:
                // Construction/upgrade completed, determine initial operational state
                if (isGeneratorFull || isPlayerCapacityFull) {
                    newState = BUILDING_STATES.IDLE;
                } else {
                    newState = BUILDING_STATES.OPERATING;
                }
                break;

            case BUILDING_STATES.OPERATING:
                // Operating -> Idle when full or player capacity reached
                if (isGeneratorFull || isPlayerCapacityFull) {
                    newState = BUILDING_STATES.IDLE;
                }
                // Stay OPERATING if still generating
                break;

            case BUILDING_STATES.IDLE:
                // Idle -> Operating when capacity available and player can receive
                if (!isGeneratorFull && !isPlayerCapacityFull) {
                    newState = BUILDING_STATES.OPERATING;
                }
                // Stay IDLE if conditions haven't changed
                break;

            default:
                // Unknown state, reset to appropriate state
                if (isGeneratorFull || isPlayerCapacityFull) {
                    newState = BUILDING_STATES.IDLE;
                } else {
                    newState = BUILDING_STATES.OPERATING;
                }
                break;
        }

        // Apply state change if needed
        if (newState !== previousState) {
            this.setState(newState);
        }
    },

    /**
     * Set generator state and handle state-specific logic
     * @param {string} newState - New state to set
     */
    setState: function(newState) {
        // Use base logic, then extend if needed
        this._super(newState);
        this._updateVisualState(newState, this.buildingState);
    },

    /**
     * Update visual representation based on state
     * @param {string} newState - New state
     * @param {string} previousState - Previous state
     */
    _updateVisualState: function(newState, previousState) {
        return;
    },

    /**
     * Handle state change events
     * @param {string} newState - New state
     * @param {string} previousState - Previous state
     */
    _onStateChanged: function(newState, previousState) {
        // Dispatch custom events for UI updates
        if (typeof cc.eventManager !== 'undefined') {
            cc.eventManager.dispatchCustomEvent("RESOURCE_GENERATOR_STATE_CHANGED", {
                generator: this,
                newState: newState,
                previousState: previousState
            });
        }
        // Update harvest indicator visibility
        this._updateHarvestIndicator();
    },
    
    /**
     * Update harvest indicator visibility based on accumulated resources and states
     */
    _updateHarvestIndicator: function () {
        if (!this.harvestIconBg || !this.harvestIcon) {
            this.harvestIconVisible = false;
            return;
        }

        // Determine if the icon should be visible at all.
        const harvestableAmount = this.getHarvestableAmount();
        const thresholdAmount = this.capacity * 0.01;
        const shouldShowIndicator = harvestableAmount > thresholdAmount;

        // Determine if the generator or player storage is at capacity.
        const isGeneratorFull = this.accumulatedResources >= this.capacity;
        const isPlayerStorageFull = this._isPlayerResourceCapacityFull();
        const isFull = isGeneratorFull || isPlayerStorageFull;

        // Set the correct texture for the background based on the 'full' state.
        const backgroundTexture = isFull ? res.collect_res_full_bg_png : res.collect_bg_png;
        this.harvestIconBg.setTexture(backgroundTexture);

        // Update visibility only if it has changed to avoid unnecessary operations.
        if (this.harvestIconVisible !== shouldShowIndicator) {
            this.harvestIconVisible = shouldShowIndicator;
            this.harvestIconBg.setVisible(shouldShowIndicator);
            this.harvestIcon.setVisible(shouldShowIndicator);
        }

        // Dispatch event for UI system updates
        if (typeof cc.eventManager !== 'undefined') {
            cc.eventManager.dispatchCustomEvent("RESOURCE_GENERATOR_HARVEST_INDICATOR", {
                generator: this,
                showIndicator: shouldShowIndicator,
                isFull: isFull, // Pass the 'full' state in the event
                harvestableAmount: this.getHarvestableAmount(),
                accumulatedResources: this.accumulatedResources,
                threshold: thresholdAmount
            });
        }
    },

    /**
     * Get the amount of resources that can be harvested
     * @returns {number} Harvestable resource amount
     */
    getHarvestableAmount: function() {
        // Only allow harvesting when generator is idle or operating and has resources
        if ((this.buildingState === BUILDING_STATES.IDLE || this.buildingState === BUILDING_STATES.OPERATING) && this.accumulatedResources > 0) {
            return this.accumulatedResources;
        }
        return 0;
    },
    
    /**
     * Harvest accumulated resources
     * Enhanced implementation for Step 5: Complete harvesting via pop-up icon interaction
     * @returns {Object} Harvest result with amount and success status
     */
    harvest: function() {
        const harvestableAmount = this.getHarvestableAmount();
        
        if (harvestableAmount <= 0) {
            return {
                success: false,
                amount: 0,
                resourceType: this.resourceType,
                message: "No resources available to harvest"
            };
        }
        // Check if player data is available
        if (!gv || !this.playerDataManager) {
            return {
                success: false,
                amount: 0,
                resourceType: this.resourceType,
                message: "Player data not available"
            };
        }
        
        try {
            // Retrieve accumulated resources (this.accumulatedGold/accumulatedOil)
            const currentPlayerResources = this.playerDataManager.getResourceAmount(this.resourceType.toLowerCase());
            const playerCapacity = this.playerDataManager.getResourceCapacity(this.resourceType.toLowerCase());
            const availableCapacity = playerCapacity - currentPlayerResources;
            

            // Ensure not to exceed player.maxGold or player.maxOil
            const actualHarvestAmount = Math.min(harvestableAmount, availableCapacity);
            
            if (actualHarvestAmount <= 0) {
                return {
                    success: false,
                    amount: 0,
                    resourceType: this.resourceType,
                    message: "Player resource capacity full - cannot harvest"
                };
            }
            
            // Store previous state for potential rollback
            const previousAccumulated = this.accumulatedResources;
            
            // Step 5.1: Reset accumulated resources in the ResourceGenerator
            this.accumulatedResources = Math.max(0, this.accumulatedResources - actualHarvestAmount);
            this.lastGenerationTime = Date.now();
            
            const addSuccess = PlayerDataManager.getInstance().addResources(
                this.resourceType.toLowerCase(), 
                actualHarvestAmount
            );
            
            if (addSuccess) {
                // Step 5.1: Immediately hide the pop-up icon
                // Force update harvest indicator - this will hide the icon since resources were harvested
                this._updateHarvestIndicator();
                
                // Step 5.1: Re-evaluate generator state - attempt to return to OPERATING
                // The generator should attempt to return to OPERATING if not capped by player's global limits
                // and building state is IDLE
                this.forceUpdateState("After successful harvest - attempting to resume operation");
                
                // Dispatch harvest completion event
                if (typeof cc.eventManager !== 'undefined') {
                    cc.eventManager.dispatchCustomEvent("RESOURCE_GENERATOR_HARVESTED", {
                        generator: this,
                        harvestedAmount: actualHarvestAmount,
                        resourceType: this.resourceType,
                        mainScene: fr.getCurrentScreen(),
                        remainingAccumulated: this.accumulatedResources,
                        playerResourceAmount: this.playerDataManager.getResourceAmount(this.resourceType.toLowerCase())
                    });
                }
                    gv.testnetwork.connector.sendHarvestResourceRequest(
                        this.buildingIndex,
                        actualHarvestAmount,
                        this.resourceType);
                return {
                    success: true,
                    amount: actualHarvestAmount,
                    resourceType: this.resourceType,
                    harvestedFromTotal: harvestableAmount,
                    remainingInGenerator: this.accumulatedResources,
                    message: "Successfully harvested " + actualHarvestAmount + " " + this.resourceType + 
                             (actualHarvestAmount < harvestableAmount ? 
                              " (limited by player capacity)" : "")
                };
            } else {
                this.accumulatedResources = previousAccumulated;
                if (this) {
                    this.accumulatedResources = previousAccumulated;
                }
                
                return {
                    success: false,
                    amount: 0,
                    resourceType: this.resourceType,
                    message: "Failed to add resources to player inventory"
                };
            }
        } catch (error) {
            cc.log("ResourceGenerator " + this.buildingType + " - Error during Step 5 harvest: " + error.message);
            return {
                success: false,
                amount: 0,
                resourceType: this.resourceType,
                message: "Harvest failed due to error: " + error.message
            };
        }
    },

    /**
     * Get generator information for UI display
     * @returns {Object} Generator information
     */
    getGeneratorInfo: function() {
        return {
            id: this.buildingIndex,
            name: this.buildingType,
            buildingType: this.buildingType,
            resourceType: this.resourceType,
            state: this.buildingState,
            generationRate: this.productivity,
            capacity: this.capacity,
            accumulatedResources: this.accumulatedResources,
            harvestableAmount: this.getHarvestableAmount(),
            canHarvest: this.getHarvestableAmount() > 0,
            gridPosition: { x: this.posX, y: this.posY }
        };
    },

    /**
     * Check if generator can be harvested
     * @returns {boolean} True if generator can be harvested
     */
    canHarvest: function() {
        return this.getHarvestableAmount() > 0;
    },

    /**
     * Get time until next full capacity (in milliseconds)
     * @returns {number} Time until full capacity in milliseconds
     */
    getTimeUntilFull: function() {
        if (this.buildingState !== BUILDING_STATES.OPERATING) {
            return -1; // Not generating
        }
        
        const remainingCapacity = this.capacity - this.accumulatedResources;
        const hoursToFull = remainingCapacity / this.productivity;
        return hoursToFull * 60 * 60 * 1000; // Convert to milliseconds
    },

    /**
     * Force update generator state (useful after external changes)
     * @param {string} reason - Reason for the state update (for logging)
     */
    forceUpdateState: function(reason) {
        this._updateState();
        this._updateHarvestIndicator();
    },

    /**
     * Check if generator is ready to operate
     * @returns {boolean} True if generator can operate
     */
    canOperate: function() {
        // Can only operate if not under construction/upgrading and has capacity
        return this.buildingState !== BUILDING_STATES.CONSTRUCTING && 
               this.buildingState !== BUILDING_STATES.UPGRADING &&
               this.accumulatedResources < this.capacity &&
               !this._isPlayerResourceCapacityFull();
    },

    /**
     * Get generator status information
     * @returns {Object} Status information
     */
    getStatusInfo: function() {
        const playerResourceAmount = gv && this.playerDataManager ?
            this.playerDataManager.getResourceAmount(this.resourceType.toLowerCase()) : 0;
        const playerResourceCapacity = gv && this.playerDataManager ?
            this.playerDataManager.getResourceCapacity( this.resourceType.toLowerCase()) : 0;
        
        return {
            // Generator status
            state: this.buildingState,
            canOperate: this.canOperate(),
            canHarvest: this.canHarvest(),
            
            // Resource status
            resourceType: this.resourceType,
            generationRate: this.productivity,
            accumulatedResources: this.accumulatedResources,
            capacity: this.capacity,
            harvestableAmount: this.getHarvestableAmount(),
            
            // Progress
            fillPercentage: Math.round((this.accumulatedResources / this.capacity) * 100),
            timeUntilFull: this.getTimeUntilFull(),
            
            // Player resource status
            playerResourceAmount: playerResourceAmount,
            playerResourceCapacity: playerResourceCapacity,
            playerResourceFull: this._isPlayerResourceCapacityFull(),
            
            // Timing
            lastGenerationTime: this.lastGenerationTime,
            timeSinceLastGeneration: Date.now() - this.lastGenerationTime
        };
    },

    cleanup: function() {
        // Remove any event listeners or timers
        // Clean up visual components if needed
        cc.log("ResourceGenerator " + this.buildingType + " cleaned up");
    },

    /**
     * Validate and correct the generator state after loading from server/save.
     * Ensures correct OPERATING/IDLE state based on accumulated resources and player capacity.
     */
    validateAndCorrectStateAfterLoad: function() {
        // Construction/upgrade state takes priority (handled by base)
        // If generator is full or player capacity is full, should be IDLE
        if (!(this.buildingState === BUILDING_STATES.CONSTRUCTING || this.buildingState === BUILDING_STATES.UPGRADING)) {
            var isGeneratorFull = this.accumulatedResources >= this.capacity;
            var isPlayerCapacityFull = this._isPlayerResourceCapacityFull && this._isPlayerResourceCapacityFull();
            if (isGeneratorFull || isPlayerCapacityFull) {
                if (this.buildingState !== BUILDING_STATES.IDLE) {
                    this.setState(BUILDING_STATES.IDLE);
                }
            } else {
                if (this.buildingState !== BUILDING_STATES.OPERATING) {
                    this.setState(BUILDING_STATES.OPERATING);
                }
            }
        }
    }
});

