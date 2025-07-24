var GUITroopInfo = GUIBase.extend({
    noneSpriteText: null,
    ctor: function(path){
        this._super(path);
        this._setupUIElements();
        this._setTargetAsset("ARM_1", 1);
    },

    _setupUIElements: function(){
        this._findAndSetFont(this._rootNode);
        this.noneSpriteText.setFontName(res.rowdies_regular_29_07_ttf);
        this.noneSpriteText.setColor(cc.RED);
        this.noneSpriteText.enableOutline(cc.color(0, 0, 0, 255));
    },

    _findAndSetFont: function(node) {
        var nodeName = node.getName();
        if (nodeName && (nodeName.endsWith("Text") || nodeName.endsWith("Label"))) {
            node.setFontName(res.rowdies_regular_29_07_ttf);
            node.enableOutline(cc.color(0, 0, 0, 255));
        }
        var children = node.getChildren();
        for (var i = 0; i < children.length; i++) {
            this._findAndSetFont(children[i]);
        }
        this.closeButton.addClickEventListener(this.hide.bind(this));
    },

    _setTargetAsset: function(troopType, level){
        var maxLevel = 9;
        if(troopType === "ARM_5") maxLevel = 8;
        else if(troopType === "ARM_7") maxLevel = 9;
        else if(troopType === "ARM_8") maxLevel = 6;
        else if(troopType === "ARM_9") maxLevel = 7;
        else if(troopType === "ARM_10") maxLevel = 7;
        let maxTroopConfig = ItemConfigUtils.getTroopConfig(troopType, maxLevel);
        let troopConfig = ItemConfigUtils.getTroopConfig(troopType, level);
        let troopBaseConfig = ItemConfigUtils.getTroopBaseConfig(troopType);

        this.troopNameText.setString(TROOP_UI_CONFIG[troopType].name + " cấp " + level);

        if(troopType === "ARM_8"){
            this.dmgFill.setPercent(troopConfig.healsPerAttack / maxTroopConfig.healsPerAttack * 100);
            this.dmgLabel.setString("Hồi phục: " + troopConfig.healsPerAttack);
        }
        else{
            this.dmgFill.setPercent(troopConfig.damagePerAttack / maxTroopConfig.damagePerAttack * 100);
            this.dmgLabel.setString("Sát thương: " + troopConfig.damagePerAttack);
        }

        this.hpFill.setPercent(troopConfig.hitpoints / maxTroopConfig.hitpoints * 100);
        this.hpLabel.setString("Máu: " + troopConfig.hitpoints);

        this.costFill.setPercent(troopConfig.trainingElixir / maxTroopConfig.trainingElixir * 100);
        this.costLabel.setString("Giá: " + troopConfig.trainingElixir);

        let fTarget = troopBaseConfig.favoriteTarget;
        let fTargetMapper = {
            "NONE": "Tất cả",
            "DEF": "Công trình phòng thủ",
            "RES": "Tài nguyên",
            "WAL": "Tường"
        }
        let fTargetContent = fTargetMapper[fTarget];
        let amp =  troopBaseConfig.dmgScale
        if (amp !== 0){
            fTargetContent += " (" + amp + "x)";
        }
        this.fTargetLabel.setString(fTargetContent);
        let atkType = troopBaseConfig.attackType;
        let atkTypeMapper = {
            1: "Cận chiến",
            2: "Đánh xa",
            3: "Gây sát thương vùng",
            4: "Hồi máu",
        }
        this.atkTypeLabel.setString(atkTypeMapper[atkType]);
        if (troopBaseConfig.attackArea === 3)
            this.targetLabel.setString("Dưới đất và trên không");
        else
            this.targetLabel.setString("Dưới đất");
        this.mSpeedLabel.setString(troopBaseConfig.moveSpeed);
        this.trainTimeLabel.setString(Utils.formatTime(troopBaseConfig.trainingTime));
        this.hSpaceLabel.setString(troopBaseConfig.housingSpace);
        this.noneSpriteText.setVisible(false);
        if(troopType === "ARM_1") this.leftPanel.setBackGroundImage(res.arm1_png);
        else if(troopType === "ARM_2") this.leftPanel.setBackGroundImage(res.arm2_png);
        else if(troopType === "ARM_3") this.leftPanel.setBackGroundImage(res.arm3_png);
        else if(troopType === "ARM_4") this.leftPanel.setBackGroundImage(res.arm4_png);
        else{
            this.leftPanel.removeBackGroundImage();
            this.noneSpriteText.setVisible(true);
        }

        this.desLabel.setString(TROOP_UI_CONFIG[troopType].des);

    }
});