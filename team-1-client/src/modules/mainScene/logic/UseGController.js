var UseGController = {
    requestAction: function(actionConfig) {
        BuilderManager.getInstance().requestAction(actionConfig);
    },

    _getRequirements: function(actionConfig) {
        var actionType = actionConfig.actionType;
        var target = actionConfig.target;
        var payload = actionConfig.payload;
        var config = null;
        var cost = 0;
        var resourceType = null;
        var needsBuilder = false;
        switch (actionType) {
            case 'UPGRADE':
                config = ItemConfigUtils.getBuildingConfig(target, target.level + 1);
                needsBuilder = true;
                break;
            case 'BUILD':
                config = ItemConfigUtils.getBuildingConfig(target, 1);
                needsBuilder = target.buildingType !== "BDH_1";
                break;
            case 'TRAIN_TROOP':
                config = ItemConfigUtils.getTroopConfig(payload.troopType);
                cost = config.trainingElixir;
                resourceType = 'oil';
                break;
            case 'REMOVE_OBSTACLE':
                // =================================================================
                // SỬA LỖI Ở ĐÂY: Dùng lại hàm getBuildingConfig cho vật cản
                // =================================================================
                config = ItemConfigUtils.getBuildingConfig({ buildingType: target.obstacleType });
                needsBuilder = true;
                break;
        }
        if (config && !resourceType) {
            if (config.gold > 0) {
                cost = config.gold;
                resourceType = 'gold';
            } else if (config.elixir > 0) {
                cost = config.elixir;
                resourceType = 'oil';
            }
        }
        return { cost: cost, resourceType: resourceType, needsBuilder: needsBuilder, config: config };
    },

    _checkMissingResources: function(requirements) {
        if (!requirements.resourceType || requirements.cost <= 0) {
            return { type: null, amount: 0 };
        }
        var currentAmount = PlayerDataManager.getInstance().getResourceAmount(requirements.resourceType);
        var missingAmount = Math.max(0, requirements.cost - currentAmount);
        return { type: requirements.resourceType, amount: missingAmount };
    },

    _showBuyResourcePopup: function(missingResource, originalActionConfig) {
        var popupConfig = {
            type: missingResource.type.toUpperCase(),
            amount: missingResource.amount,
            resource: missingResource.type,
            mainUIInstance: originalActionConfig.mainUIInstance,
            successCallback: function() {
                this.requestAction(originalActionConfig);
            }.bind(this),
            cancelCallback: originalActionConfig.onCancel
        };
        UIController.showUseGemPopupWithOptions(originalActionConfig.mainUIInstance, popupConfig);
    },

    _showFreeBuilderPopup: function(originalActionConfig) {
        var buildingToRush = BuilderManager.getInstance().getBuildingToFinishForFreeBuilder();
        if (!buildingToRush) {
            if (originalActionConfig.onCancel) originalActionConfig.onCancel();
            return;
        }
        var remainingTime = Math.max(0, buildingToRush.finishBuildingTime - Math.floor(Date.now() / 1000));
        var popupConfig = {
            type: "FREE_BUILDER",
            amount: remainingTime,
            targetToRush: buildingToRush,
            mainUIInstance: originalActionConfig.mainUIInstance,
            successCallback: function() {
                BuilderManager.getInstance().handleDirectTransfer(buildingToRush, originalActionConfig);
            },
            cancelCallback: originalActionConfig.onCancel
        };
        UIController.showUseGemPopupWithOptions(originalActionConfig.mainUIInstance, popupConfig);
    },

    _executeCoreAction: function(actionConfig) {
        var actionType = actionConfig.actionType;
        var target = actionConfig.target;
        var payload = actionConfig.payload;
        var mainUIInstance = actionConfig.mainUIInstance;
        var requirements = this._getRequirements(actionConfig);

        if (requirements.resourceType && requirements.cost > 0) {
            PlayerDataManager.getInstance().subtractResources(requirements.resourceType, requirements.cost);
        }

        switch (actionType) {
            case 'TRAIN_TROOP':
                target.addTroopToQueue(payload.troopType);
                break;
        }
    }
};
