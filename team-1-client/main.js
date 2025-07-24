var gv = gv || {};
const DESIGN_RESOLUTION_WIDTH = 960;
const DESIGN_RESOLUTION_HEIGHT = 640;

cc.game.onStart = function () {
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) {
        document.body.removeChild(document.getElementById("cocosLoading"));
    }
    cc.view.enableRetina(true);
    cc.view.adjustViewPort(true);
    //cc.view.setDesignResolutionSize(DESIGN_RESOLUTION_WIDTH, DESIGN_RESOLUTION_HEIGHT, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.setDesignResolutionSize(DESIGN_RESOLUTION_WIDTH, DESIGN_RESOLUTION_HEIGHT, cc.ResolutionPolicy.FIXED_HEIGHT);

    // The game will be resized when the browser window size changes.
    cc.view.resizeWithBrowserSize(true);

    // Add search paths for native builds if necessary
    if (cc.sys.isNative && fr && fr.NativeService) {
        jsb.fileUtils.addSearchPath(fr.NativeService.getFolderUpdateAssets(), true);
        jsb.fileUtils.addSearchPath(fr.NativeService.getFolderUpdateAssets() + "/res", true);
    }

    cc.loader.resPath = "res";
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.setDisplayStats(true);
        gv.gameClient = new GameClient();
        gv.poolObjects = new PoolObject();
        gv.testnetwork = {};
        gv.testnetwork.connector = new testnetwork.Connector(gv.gameClient);
        setTimeout(() => {
            fr.view(LoginScene);
        }, 100);

    }, this);
};

cc.game.run();
