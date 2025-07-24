var GUIBase = cc.Node.extend({
    ctor:function (path, withBackground) {
        this._rootNode = null;
        this._path = path;
        this._super();

        // Load the UI content from the JSON file first
        var nodeData;
        if(!this._path.startsWith("res/"))
            nodeData = ccs.load(this._path,'res/');
        else
            nodeData = ccs.load(this._path);
        this._rootNode = nodeData.node;

        // The background logic can remain, it's already responsive.
        if (withBackground) {
            var director = cc.director;
            var glView = director.getOpenGLView();
            var frameSize = glView.getFrameSize(); // Kích thước viewport thực tế

            var backgroundOverlay = new ccui.Layout();
            backgroundOverlay.setContentSize(frameSize); // Set bằng kích thước viewport
            backgroundOverlay.setAnchorPoint(0.5, 0.5);
            backgroundOverlay.setPosition(frameSize.width / 2, frameSize.height / 2);
            backgroundOverlay.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            backgroundOverlay.setBackGroundColor(cc.color(0, 0, 0));
            backgroundOverlay.setBackGroundColorOpacity(150);
            backgroundOverlay.setTouchEnabled(true);

            this.addChild(backgroundOverlay, 0); // Add background behind
        }

        // Add the main UI content on top
        this.addChild(this._rootNode, 1);

        this._syncNodeVariables(this._rootNode);
    },

    _syncNodeVariables:function (rootNode) {
        if (!rootNode) {
            return;
        }

        var targetObject = this;
        var children = [].slice.call(rootNode.getChildren());

        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.getName()) {
                targetObject[child.getName()] = child;
            }
            this._syncNodeVariables(child);
        }
    },

    // --- LOGIC RESPONSIVE ---

    /**
     * Scales and centers the main UI content (_rootNode) to fit the screen.
     */
    _updateLayout: function() {
        if (!this._rootNode) return;

        var visibleSize = cc.director.getVisibleSize();
        var visibleOrigin = cc.director.getVisibleOrigin();
        var panelSize = this._rootNode.getContentSize();

        if (panelSize.width === 0 || panelSize.height === 0) return;

        var scaleX = visibleSize.width / panelSize.width;
        var scaleY = visibleSize.height / panelSize.height;
        var scale = Math.min(scaleX, scaleY);

        this._rootNode.setScale(scale);
        this._rootNode.setAnchorPoint(0.5, 0.5);
        this._rootNode.setPosition(
            visibleOrigin.x + visibleSize.width / 2,
            visibleOrigin.y + visibleSize.height / 2
        );
    },

    /**
     * Overrides the default setVisible to trigger the layout update.
     * @param {boolean} isVisible
     */
    setVisible: function(isVisible) {
        // Call the original setVisible function
        this._super(isVisible);

        // If the panel is being shown, update its layout
        if (isVisible) {
            this._updateLayout();
        }
    },

    show: function(){
        this.setVisible(true);
    },

    hide: function(){
        this.setVisible(false);
    }
});