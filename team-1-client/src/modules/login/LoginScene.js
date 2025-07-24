// Debug configuration
var DEBUG_CONFIG = {
    enabled: true,         // Master switch for all debugging
    backgroundCycle: true, // Debug for background cycling
    loginProcess: false,    // Debug for login process
};

// Debug logging function
function debugLog(category, message) {
    if (DEBUG_CONFIG.enabled && DEBUG_CONFIG[category]) {
        console.log("[DEBUG:" + category + "] " + message);
    }
}

var LoginScene = cc.Layer.extend({

    loginUI: null,
    backgrounds: [],
    currentBgIndex: 0,
    backgroundImage: null,
    loginButton: null,
    usernameField: null,
    textBackGround: null,
    version: null,
    loadingText: null,
    versionLabel: null, // Label to show game version
    isWaitingForLoginResponse: false,
    maxLoginRetries: 3, // Try a maximum of 3 times
    retryDelay: 1000,   // Wait 5 seconds between retries (5000 ms)
    currentRetryCount: 0,

    ctor: function () {
        this._super();

        this.init();

        this._mapInitListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "MAP_INITIALIZED_AND_PROCESSED",
            callback: function(event){
                var initMapPacket = event.getUserData();
                PlayerDataManager.getInstance().updateWithInitMapData(initMapPacket);
            }
        });

        this._loginSuccessListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "LOGIN_SUCCESS",
            callback: this.onLoginSuccess.bind(this) // Use bind to keep 'this' context
        });
        cc.eventManager.addListener(this._loginSuccessListener, this);

        cc.log("MAP_INITIALIZED_AND_PROCESSED event register in LoginScene.");
        cc.eventManager.addListener(this._mapInitListener, this);
    },

    init: function () {
        // 1. Lấy kích thước và gốc tọa độ của màn hình hiển thị
        var visibleSize = cc.director.getVisibleSize();
        var visibleOrigin = cc.director.getVisibleOrigin();

        // --- START: RESPONSIVE BACKGROUND FIX ---

        // 2. TẠO HÌNH NỀN RIÊNG BIỆT
        // Thay vì lấy từ file json, chúng ta tạo mới nó ở đây
        this.backgroundImage = new ccui.ImageView(res.loading_jpg, ccui.Widget.LOCAL_TEXTURE);
        this.backgroundImage.setAnchorPoint(0.5, 0.5);
        this.backgroundImage.setPosition(visibleOrigin.x + visibleSize.width / 2, visibleOrigin.y + visibleSize.height / 2);

        // 3. SCALE HÌNH NỀN ĐỂ LẤP ĐẦY MÀN HÌNH (COVER)
        var bgSize = this.backgroundImage.getContentSize();
        var scaleX = visibleSize.width / bgSize.width;
        var scaleY = visibleSize.height / bgSize.height;
        // Dùng Math.max để đảm bảo nền luôn lấp đầy, chấp nhận bị cắt xén
        this.backgroundImage.setScale(Math.max(scaleX, scaleY));

        // Thêm hình nền vào scene với z-order thấp nhất (để nằm dưới cùng)
        this.addChild(this.backgroundImage, 0);

        // --- END: RESPONSIVE BACKGROUND FIX ---


        // 4. Load UI từ file JSON (như cũ)
        var json_login = ccs.load(res.login_scene_json);
        this.loginUI = json_login.node;

        // 5. Scale các thành phần UI để vừa vặn với màn hình (FIT)
        var originalSize = this.loginUI.getContentSize();
        var uiScaleX = visibleSize.width / originalSize.width;
        var uiScaleY = visibleSize.height / originalSize.height;
        // Dùng Math.min để đảm bảo các nút bấm không bị ra khỏi màn hình
        var scale = Math.min(uiScaleX, uiScaleY);
        this.loginUI.setScale(scale);

        // 6. Đặt vị trí UI ở trung tâm (như cũ)
        this.loginUI.x = visibleOrigin.x + visibleSize.width / 2;
        this.loginUI.y = visibleOrigin.y + visibleSize.height / 2;
        this.loginUI.anchorX = 0.5;
        this.loginUI.anchorY = 0.5;

        // Thêm UI vào scene với z-order cao hơn hình nền
        this.addChild(this.loginUI, 1);

        // Tạo label version (như cũ)
        this.versionLabel = new ccui.Text("Version: 1.0.13", res.rowdies_regular_29_07_ttf, 20);
        this.versionLabel.setAnchorPoint(1, 0);
        this.versionLabel.setPosition(visibleOrigin.x + visibleSize.width - 10, visibleOrigin.y + 10);
        this.versionLabel.setColor(cc.color(255, 255, 255));
        this.addChild(this.versionLabel, 10);

        // --- Các thiết lập còn lại ---
        this.setupUIElements();
        this.scheduleBackgroundChange();
    },

    setupUIElements: function() {
        // Get reference to login button
        this.loginButton = this.loginUI.getChildByName("loginButton");

        // Use file paths for loadTextures instead of texture objects
        this.loginButton.loadTextures(
            res.okbutton_png,
            res.button_press_png,
            res.button_disable_png,
            ccui.Widget.LOCAL_TEXTURE
        );
        this.loginButton.setTitleFontName(res.rowdies_regular_29_07_ttf);
        this.loginButton.setTitleText("Đăng nhập");
        this.loginButton.setTitleColor(cc.color(cc.WHITE));

        this.textBackGround = this.loginUI.getChildByName("textFieldBackGround");
        this.textBackGround.loadTexture(res.g_background_png, ccui.Widget.LOCAL_TEXTURE);        // The textfield name in the JSON is actually "textField", not "TextField_5"
        this.usernameField = this.textBackGround.getChildByName("textField");

        // Setup button event handler
        this.loginButton.addTouchEventListener(this.onLoginButtonClicked, this);
        this.loadingText = this.loginUI.getChildByName("loadingText");
        UISetup.setupLabel(this.loadingText);
        this.loadingText.setString("Nhập tên người chơi");
        this.loadingText.setContentSize(cc.size(500, this.loadingText.getContentSize().height));

        // Initialize the backgrounds array with the available background textures
        this.backgrounds = [
            res.loading_jpg,
            res._2_jpg,
            res._3_jpg
        ];
    },

    onLoginButtonClicked: function(sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED && !this.isWaitingForLoginResponse) {
            var username = this.usernameField ? this.usernameField.getString() : "";

            if (username.trim() === "") {
                var errorLabel = new cc.LabelTTF("Username can not be empty", res.rowdies_regular_29_07_ttf, 20);
                errorLabel.setColor(cc.color(255, 0, 0)); // Red

                var loadingTextPosition = this.loadingText.getPosition();
                errorLabel.setPosition(loadingTextPosition.x, loadingTextPosition.y - 50);

                this.loginUI.addChild(errorLabel, 15);

                var sequence = cc.sequence(cc.delayTime(3), cc.removeSelf(true));
                errorLabel.runAction(sequence);
                return;
            }

            // Disable the button to prevent multiple clicks
            this.loginButton.setEnabled(false);
            this.loadingText.setString("Connecting...");

            if (gv.testnetwork && gv.testnetwork.connector) {
                gv.testnetwork.connector.setUserName(username);
            }

            this.startLoginAttempt();
        }
    },

    startLoginAttempt: function() {
        this.isWaitingForLoginResponse = true;

        var attemptNumber = this.currentRetryCount + 1;
        this.loadingText.setString("Connecting... (Attempt " + attemptNumber + ")");

        gv.gameClient.connect();

        // Set a timeout. If we don't get a response in 10 seconds, onLoginTimeout will be called.
        this.scheduleOnce(this.onLoginTimeout, 2);
    },

    onLoginTimeout: function() {
        // If we received a response while waiting, do nothing.
        if (!this.isWaitingForLoginResponse) {
            return;
        }

        this.currentRetryCount++;

        if (this.currentRetryCount >= this.maxLoginRetries) {
            // We've reached the max number of retries, so we fail.
            this.onLoginFailed("Connection timed out. Please try again.");
        } else {
            // Try again after a delay
            var remainingAttempts = this.maxLoginRetries - this.currentRetryCount;
            this.loadingText.setString("Timeout. Retrying... (" + remainingAttempts + " left)");

            // Disconnect before reconnecting to be safe
            gv.gameClient.getNetwork().disconnect();

            this.scheduleOnce(this.startLoginAttempt, this.retryDelay / 1000);
        }
    },


    onLoginSuccess: function() {
        if (!this.isWaitingForLoginResponse) return; // Avoid multiple calls

        this.isWaitingForLoginResponse = false;
        this.unschedule(this.onLoginTimeout); // IMPORTANT: Cancel the timeout!

        this.loadingText.setString("Login successful! Going to game...");
    },

    onLoginFailed: function(errorMessage) {
        this.isWaitingForLoginResponse = false;
        this.unschedule(this.onLoginTimeout);

        this.loadingText.setString(errorMessage);

        // Re-enable the button so the user can try again manually
        this.loginButton.setEnabled(true);
        this.currentRetryCount = 0;

        // Disconnect from the server
        gv.gameClient.getNetwork().disconnect();
    },

    scheduleBackgroundChange: function() {
        debugLog("backgroundCycle", "Scheduling background change every 10 seconds");
        this.schedule(this.changeBackground, 10);
    },

    changeBackground: function() {
        debugLog("backgroundCycle", "Changing background");

        if (!this.backgrounds || this.backgrounds.length === 0) {
            debugLog("backgroundCycle", "No backgrounds array or empty array");
            return;
        }

        // Cycle to next background
        this.currentBgIndex = (this.currentBgIndex + 1) % this.backgrounds.length;
        var nextBg = this.backgrounds[this.currentBgIndex];

        if (!nextBg) {
            debugLog("backgroundCycle", "Invalid background at index " + this.currentBgIndex);
            return;
        }

        debugLog("backgroundCycle", "Selected next background: " + nextBg);

        if (this.backgroundImage) {
            try {
                // Apply fade out/fade in transition effect
                this.applyBackgroundTransition(nextBg);
            } catch (e) {
                debugLog("backgroundCycle", "Error changing background: " + e);
                cc.log("Background change error details:", e);
            }
        } else {
            debugLog("backgroundCycle", "No background image found to change");
        }
    },

    applyBackgroundTransition: function(nextBgTexture) {
        // Create a smooth transition effect between backgrounds
        var fadeOutDuration = 1.0;
        var fadeInDuration = 1.0;
        var delayBetween = 0.1;

        var originalOpacity = this.backgroundImage.getOpacity();

        // Step 1: Fade out
        var fadeOut = cc.fadeTo(fadeOutDuration, 0);
        // Step 2: Change texture (when invisible)
        var changeTexture = cc.callFunc(function() {
            try {
                if (!nextBgTexture) {
                    debugLog("backgroundCycle", "Invalid texture path");
                    return;
                }

                // Make sure the background image exists and is valid
                if (!this.backgroundImage || !this.backgroundImage.loadTexture) {
                    debugLog("backgroundCycle", "Invalid background image object");
                    return;
                }

                // Load the texture with error handling
                this.backgroundImage.loadTexture(nextBgTexture, ccui.Widget.LOCAL_TEXTURE);
                debugLog("backgroundCycle", "Background successfully changed to: " + nextBgTexture);
            } catch (e) {
                debugLog("backgroundCycle", "Error changing texture: " + e);
                cc.log("Texture change error details:", e);
            }
        }, this);

        // Step 3: Fade in with the new texture
        var fadeIn = cc.fadeTo(fadeInDuration, originalOpacity);

        // Add a slight scale effect during transition
        var scaleDown = cc.scaleTo(fadeOutDuration, 1.0);
        var scaleNormal = cc.scaleTo(fadeInDuration, 1.2);

        // Run the sequence of actions
        this.backgroundImage.runAction(
            cc.sequence(
                cc.spawn(fadeOut, scaleDown),
                changeTexture,
                cc.delayTime(delayBetween),
                cc.spawn(fadeIn, scaleNormal)
            )
        );
    },

    onExit: function() {
        this._super();
        cc.eventManager.removeListener(this._loginSuccessListener);
        cc.eventManager.removeListener(this._mapInitListener);
    },

    updateVersion: function(version) {
        if (this.versionLabel) {
            this.versionLabel.setString("Version: " + version);
        }
    }
});
