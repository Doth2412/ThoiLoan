/**
 * @file ObstacleController.js
 * @description Controller xử lý logic cho việc tháo dỡ vật cản.
 */
var ObstacleController = {
    /**
     * Bắt đầu quá trình tháo dỡ vật cản.
     * Hàm này chỉ được gọi bởi UseGController sau khi đã đảm bảo có đủ tài nguyên và thợ xây.
     * @param {Obstacle} obstacle - Vật cản cần tháo dỡ.
     * @param {Object} mainUIInstance - Tham chiếu đến scene chính.
     */
    startConcreteRemove: function(obstacle, mainUIInstance) {
        var builderRequestResult = BuilderManager.getInstance().requestBuildUpgrade(obstacle);

        if (builderRequestResult.success && builderRequestResult.builderAssigned) {
            // =================================================================
            // SỬA LỖI Ở ĐÂY: Dùng lại hàm getBuildingConfig cho vật cản
            // =================================================================
            var config = ItemConfigUtils.getBuildingConfig({ buildingType: obstacle.obstacleType });
            if (!config) {
                cc.error("ObstacleController: Could not find config for obstacle type: " + obstacle.obstacleType);
                return;
            }

            obstacle.setState(BUILDING_STATES.CONSTRUCTING);
            obstacle.finishBuildingTime = Math.floor(Date.now() / 1000) + config.buildTime;

            BuildingsManager.getInstance().toggleUpgradingIndicator(obstacle, true);

            gv.testnetwork.connector.sendRemoveObstacleRequest(obstacle.obstacleType, obstacle.obstacleIndex);

            cc.log("startConcreteRemove: Obstacle removal started for " + obstacle.obstacleType);

            if (mainUIInstance && mainUIInstance.interactionPanel) {
                mainUIInstance.interactionPanel.hidePanel();
            }
            if (mainUIInstance && mainUIInstance.activeBuilding) {
                BuildingsController.getInstance().deActivateAsset(mainUIInstance, mainUIInstance.activeBuilding);
                mainUIInstance.activeBuilding = null;
            }

        } else {
            cc.error("startConcreteRemove: Failed to get a builder for obstacle. This should not happen.");
        }
    }
};
