var TrainTroopQueue = cc.Class.extend({
    queueMaxLength: 6,
    trainTroopQueue: null,
    trainTroopQueueUI: null,
    ctor: function (trainTroopQueueUI){
        this.trainTroopQueue = [];
        this.trainTroopQueueUI = trainTroopQueueUI;
    },

    addTroopToQueue: function (troopType){
        if(this.trainTroopQueue.length >= this.queueMaxLength) return;
        var troopBaseConfig = ItemConfigUtils.getTroopBaseConfig(troopType);

        for (var i = 0; i < this.trainTroopQueue.length; i++) {
            var troopQueueSlot = this.trainTroopQueue[i];
            if (troopQueueSlot.troopType === troopType) {
                // If found, increment the amount and exit the function.
                troopQueueSlot.troopAmount++;
                return;
            }
        }

        var newTroopQueueSlot = {
            troopType: troopType,
            troopAmount: 1,
            trainingTimePerTroop: troopBaseConfig.trainingTime,
        };
        this.trainTroopQueue.push(newTroopQueueSlot);
    },

    getMaxLength: function (){
        return this.queueMaxLength;
    }
})