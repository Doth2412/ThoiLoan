var INPUT_MODE = {
    NONE: 'none',
    BUILDING: 'building',
    CAMERA: 'camera',
    PLACING_BUILDING: 'placing_building'
};

var InputManager = cc.Class.extend({
    _currentMode: INPUT_MODE.NONE,
    _previousMode: INPUT_MODE.NONE, // Added to store the last mode

    ctor: function() {
        if (InputManager._instance) {
            throw "InputManager is a singleton, use getInstance()";
        }
    },

    getMode: function() {
        return this._currentMode;
    },

    setMode: function(mode) {
        if (this._currentMode !== mode) {
            this._previousMode = this._currentMode;
            this._currentMode = mode;
        }
    },

    /**
     * Reverts the current mode to the previous one.
     */
    revertMode: function() {
        if (this._currentMode !== this._previousMode && this._previousMode) {
            this._currentMode = this._previousMode;
            this._previousMode = INPUT_MODE.NONE;
        } else if (this._currentMode !== INPUT_MODE.NONE) {
            this.setMode(INPUT_MODE.NONE);
        }
    }
});

InputManager._instance = null;
InputManager.getInstance = function () {
    if (!InputManager._instance) {
        InputManager._instance = new InputManager();
    }
    return InputManager._instance;
};