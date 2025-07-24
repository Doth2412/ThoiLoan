var Obstacle = cc.Class.extend({
    obstacleType: null,
    obstacleIndex: null,
    posX:  null,
    posY:  null,
    compositeNode: null,
    baseSprite:  null,
    obstacleSprite:  null,
    config:  null,
    assetType:  null,
    buildingState: null,
    finishBuildingTime: null,
    buildingIndex: null,
    upgradingIndicator: null,
    upgradingProgressBar: null,
    dataConfig: null,

    ctor: function(obstacleData){
        this.obstacleType = obstacleData.obstacleType;
        this.obstacleIndex = obstacleData.obstacleIndex;
        this.posX = obstacleData.posX;
        this.posY = obstacleData.posY;
        this.compositeNode = obstacleData.compositeNode;
        this.baseSprite = obstacleData.baseSprite;
        this.obstacleSprite = obstacleData.obstacleSprite;
        this.config = obstacleData.config;
        this.selectionIndicator = obstacleData.selectionIndicator;
        this.assetType = obstacleData.assetType;
        this.buildingState = BUILDING_STATES.IDLE;
        this.finishBuildingTime = null;
        this.buildingIndex = this.obstacleIndex;
        this.upgradingIndicator = null;
        this.upgradingProgressBar = null;

    },

    setState: function(newState) {
        this.buildingState = newState;
        cc.log("Obstacle " + this.obstacleIndex + " state changed to: " + newState);
    },

    update: function(dt) {
        // We reuse the CONSTRUCTING state to mean "is being removed"
        if (this.buildingState === BUILDING_STATES.CONSTRUCTING) {
            this.dataConfig = ItemConfigUtils.getBuildingConfig({buildingType: this.obstacleType});
            const now = Math.floor(Date.now() / 1000);
            const remainingTime = this.finishBuildingTime - now;

            // Check for completion
            if (this.finishBuildingTime && remainingTime <= 0) {
                cc.log("Obstacle removal finished for index: " + this.obstacleIndex);
                BuildingsManager.getInstance().onObstacleRemovalComplete(this);
                return;
            }

            // Update the progress bar UI if it exists
            if (remainingTime > 0 && this.upgradingProgressBar) {
                var removalTime = this.dataConfig.buildTime || 1; // Get total time from config
                this.upgradingProgressBar.progressTimer.setPercentage(
                    100 - (remainingTime / removalTime * 100)
                );
                this.upgradingProgressBar.timeLabel.setString(Utils.formatTime(remainingTime));
            }
        }
    }
})