var UISetup = {
    enableButton: function (rootNode, isEnabled) {
        rootNode.setTouchEnabled(isEnabled);

        var targetColor = isEnabled ? cc.color(255, 255, 255) : cc.color(128, 128, 128);
        var applyColorRecursive = function (node) {
            if (!node) return;
            if (node.getName() === 'infoButton') {
                if (typeof node.setColor === 'function') {
                    node.setColor(cc.color(255, 255, 255));
                }
                if (typeof node.setEnabled === 'function') {
                    node.setEnabled(true);
                }
                return;
            }
            if (typeof node.setColor === 'function') {
                node.setColor(targetColor);
            }
            if (typeof node.setEnabled === 'function') {
                node.setEnabled(isEnabled);
            }
            var children = node.getChildren();
            if (children && children.length > 0) {
                for (var i = 0; i < children.length; i++) {
                    applyColorRecursive(children[i]);
                }
            }
        };
        applyColorRecursive(rootNode);
    },

    setupLabel: function (label) {
        label.setFontName(res.rowdies_regular_29_07_ttf);
        label.enableOutline(cc.color(0, 0, 0), 1);
        var currentSize = label.getContentSize();
        label.setContentSize(cc.size(200, currentSize.height + 10));
        label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    },

    findAndSetupLabel: function (node) {
        if (!node) return;
        var nodeName = node.getName();
        if (nodeName && (nodeName.endsWith("Text") || nodeName.endsWith("Label"))) {
            this.setupLabel(node);
        }
        var children = node.getChildren();
        for (var i = 0; i < children.length; i++) {
            this.findAndSetupLabel(children[i]);
        }
    },
}