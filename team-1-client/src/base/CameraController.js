// CameraController.js - A fully responsive camera control module for the game

const INITIAL_CAMERA_X = 0;
const INITIAL_CAMERA_Y = 0;
const INITIAL_CAMERA_ZOOM = 0.8;
const MIN_CAMERA_ZOOM = 0.5; // This remains as a user-defined absolute minimum
const MAX_CAMERA_ZOOM = 3.0;

const DEFAULT_BOUNDS_LEFT = -1500;
const DEFAULT_BOUNDS_RIGHT = 1500;
const DEFAULT_BOUNDS_TOP = 1200;
const DEFAULT_BOUNDS_BOTTOM = -1200;
const DRAG_THRESHOLD_SQUARED = 100;

var CameraController = cc.Class.extend({
    camera: {
        x: INITIAL_CAMERA_X,
        y: INITIAL_CAMERA_Y,
        zoom: INITIAL_CAMERA_ZOOM,
        minZoom: MIN_CAMERA_ZOOM,
        maxZoom: MAX_CAMERA_ZOOM,
        dynamicMinZoom: 1.0,
        bounds: {
            left: DEFAULT_BOUNDS_LEFT,
            right: DEFAULT_BOUNDS_RIGHT,
            top: DEFAULT_BOUNDS_TOP,
            bottom: DEFAULT_BOUNDS_BOTTOM
        }
    },

    visibleSize: null,
    visibleOrigin: null,
    target: null,
    mainUIInstance: null,

    // === FIX: Cờ để xác định chế độ hoạt động ===
    interactionEnabled: false,

    touchStartPos: null,
    touchedAssetAtStart: null,
    isDraggingBuilding: false,

    lastMultiTouchCenter: null,
    initialTouchDistance: 0,

    panStartCameraPos: null,
    panStartTouchPos: null,

    /**
     * Hàm khởi tạo
     * @param {cc.Node} target - Node sẽ được điều khiển bởi camera (thường là gameLayer)
     * @param {Object} [mainUIInstance] - (Tùy chọn) Tham chiếu đến scene UI chính. Nếu có, các tương tác sẽ được bật.
     */
    ctor: function(target, mainUIInstance) {
        this.camera = {
            x: INITIAL_CAMERA_X,
            y: INITIAL_CAMERA_Y,
            zoom: INITIAL_CAMERA_ZOOM,
            minZoom: MIN_CAMERA_ZOOM,
            maxZoom: MAX_CAMERA_ZOOM,
            dynamicMinZoom: 1.0,
            bounds: {
                left: DEFAULT_BOUNDS_LEFT,
                right: DEFAULT_BOUNDS_RIGHT,
                top: DEFAULT_BOUNDS_TOP,
                bottom: DEFAULT_BOUNDS_BOTTOM
            }
        };

        this.target = target;
        this.mainUIInstance = mainUIInstance; // Sẽ là undefined trong BattleScene

        // === FIX: Bật/tắt chế độ tương tác dựa trên việc có mainUIInstance hay không ===
        this.interactionEnabled = !!mainUIInstance;

        this._updateScreenInfo();
        this.initControls();
        this.applyTransform();

        this.panStartCameraPos = null;
        this.panStartTouchPos = null;
    },

    _updateScreenInfo: function() {
        this.visibleSize = cc.director.getVisibleSize();
        this.visibleOrigin = cc.director.getVisibleOrigin();
    },

    _onResize: function() {
        this._updateScreenInfo();
        this._calculateDynamicMinZoom();
        this.setPosition(this.camera.x, this.camera.y);
    },

    _calculateDynamicMinZoom: function() {
        if (!this.visibleSize || !this.camera.bounds) return;
        const mapWidth = this.camera.bounds.right - this.camera.bounds.left;
        const mapHeight = this.camera.bounds.top - this.camera.bounds.bottom;
        if (mapWidth <= 0 || mapHeight <= 0) return;
        const zoomToFitWidth = this.visibleSize.width / mapWidth;
        const zoomToFitHeight = this.visibleSize.height / mapHeight;
        this.camera.dynamicMinZoom = Math.max(zoomToFitWidth, zoomToFitHeight);
    },

    initControls: function() {
        if (!this.target || !(this.target instanceof cc.Node)) return;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: this.onTouchesBegan.bind(this),
            onTouchesMoved: this.onTouchesMoved.bind(this),
            onTouchesEnded: this.onTouchesEnded.bind(this),
            onTouchesCancelled: this.onTouchesCancelled.bind(this)
        }, this.target);

        // --- ADDED FOR SCROLL ZOOM ---
        // Add the mouse listener to handle scroll wheel zoom events.
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseScroll: this.onMouseScroll.bind(this)
        }, this.target);
        // --- END ADDITION ---

        cc.view.setResizeCallback(this._onResize.bind(this));
    },

    // --- ADDED FOR SCROLL ZOOM ---
    /**
     * Handles mouse scroll events to zoom the camera in and out.
     * @param {cc.Event.EventMouse} event The mouse scroll event.
     */
    onMouseScroll: function(event) {
        // A positive scrollY value means scrolling up (zoom in).
        const scrollDirection = Math.sign(event.getScrollY());
        if (scrollDirection === 0) return;

        // Define how sensitive zooming is.
        const zoomFactor = 0.1;

        // Calculate the zoom change proportional to the current zoom level.
        const deltaZoom = this.camera.zoom * zoomFactor * scrollDirection;
        const newZoom = this.camera.zoom + deltaZoom;

        // Use the cursor's location as the point to zoom towards.
        const zoomPoint = event.getLocation();

        // Call the existing method to apply the zoom.
        this.zoomAtPoint(newZoom, zoomPoint);
    },
    // --- END ADDITION ---

    onTouchesBegan: function(touches, event) {
        if (touches.length === 1) {
            var touch = touches[0];
            this.touchStartPos = touch.getLocation();
            this.isDraggingBuilding = false;

            // === FIX: Chỉ tìm vật thể nếu tương tác được bật ===
            if (this.interactionEnabled) {
                this.touchedAssetAtStart = this._findAssetAtPoint(this.touchStartPos);
                if (this.touchedAssetAtStart && this.touchedAssetAtStart.compositeNode) {
                    var touchLocationInParent = this.mainUIInstance.mapElement.convertToNodeSpace(touch.getLocation());
                    var buildingPositionInParent = this.touchedAssetAtStart.compositeNode.getPosition();
                    this.mainUIInstance.dragStartOffset = cc.pSub(buildingPositionInParent, touchLocationInParent);
                }
            } else {
                this.touchedAssetAtStart = null;
            }

            // Luôn chuẩn bị cho việc kéo camera
            this.panStartCameraPos = cc.p(this.camera.x, this.camera.y);
            this.panStartTouchPos = this.touchStartPos;

        } else if (touches.length >= 2) {
            this.lastMultiTouchCenter = null;
            this.initialTouchDistance = 0;
        }
    },

    onTouchesMoved: function(touches, event) {
        if (touches.length >= 2) {
            // Logic zoom (luôn hoạt động)
            var touch1 = touches[0].getLocation();
            var touch2 = touches[1].getLocation();
            var centerPoint = cc.p((touch1.x + touch2.x) / 2, (touch1.y + touch2.y) / 2);

            if (this.lastMultiTouchCenter) {
                var deltaX = centerPoint.x - this.lastMultiTouchCenter.x;
                var deltaY = centerPoint.y - this.lastMultiTouchCenter.y;
                if (this.camera.zoom !== 0) {
                    this.move((-deltaX / this.camera.zoom), (-deltaY / this.camera.zoom));
                }
            }
            this.lastMultiTouchCenter = centerPoint;

            if (this.initialTouchDistance === 0) {
                this.initialTouchDistance = cc.pDistance(touch1, touch2);
            }
            const currentDistance = cc.pDistance(touch1, touch2);
            if (this.initialTouchDistance > 0) {
                var zoomRatio = currentDistance / this.initialTouchDistance;
                this.zoomAtPoint(this.camera.zoom * zoomRatio, centerPoint);
                this.initialTouchDistance = currentDistance;
            }

        } else if (touches.length === 1) {
            var touch = touches[0];

            // === FIX: Kiểm tra xem có nên kéo nhà không (chỉ khi tương tác được bật) ===
            var shouldDragBuilding = this.interactionEnabled &&
                this.touchedAssetAtStart &&
                this.touchedAssetAtStart === this.mainUIInstance.activeBuilding &&
                this.touchedAssetAtStart.assetType !== 'obstacle';

            if (shouldDragBuilding) {
                // Hành động: Kéo công trình
                if (!this.isDraggingBuilding) {
                    var distanceSq = cc.pDistanceSQ(this.touchStartPos, touch.getLocation());
                    if (distanceSq > DRAG_THRESHOLD_SQUARED) {
                        this.isDraggingBuilding = true;
                        BuildingsController.getInstance().handleAssetTouchBegan(this.mainUIInstance, this.touchedAssetAtStart, true);
                    }
                }

                if (this.isDraggingBuilding) {
                    BuildingsController.getInstance().handleBuildingTouchMoved(this.mainUIInstance, touch);
                }
            } else {
                // Hành động: Kéo camera (luôn hoạt động)
                if (!this.panStartCameraPos || !this.panStartTouchPos) return;

                var currentTouchPos = touch.getLocation();
                var touchDelta = cc.pSub(currentTouchPos, this.panStartTouchPos);

                var worldDeltaX = touchDelta.x / this.camera.zoom;
                var worldDeltaY = touchDelta.y / this.camera.zoom;

                var newCamX = this.panStartCameraPos.x - worldDeltaX;
                var newCamY = this.panStartCameraPos.y - worldDeltaY;

                this.setPosition(newCamX, newCamY);
            }
        }
    },

    onTouchesEnded: function(touches, event) {
        var endPos = touches[0].getLocation();
        var distanceSq = cc.pDistanceSQ(this.touchStartPos, endPos);

        // === FIX: Chỉ xử lý logic tap/drag cho vật thể nếu tương tác được bật ===
        if (this.interactionEnabled) {
            var isPlacingMode = typeof InputManager !== 'undefined' && InputManager.getInstance().getMode() === INPUT_MODE.PLACING_BUILDING;

            if (distanceSq <= DRAG_THRESHOLD_SQUARED) { // Tap
                if (this.touchedAssetAtStart) {
                    BuildingsController.getInstance().handleAssetTouchBegan(this.mainUIInstance, this.touchedAssetAtStart, false);
                } else {
                    if (!isPlacingMode && this.mainUIInstance.activeBuilding) {
                        BuildingsController.getInstance().finalizeActiveBuildingMove(this.mainUIInstance);
                        BuildingsController.getInstance().deActivateAsset(this.mainUIInstance, this.mainUIInstance.activeBuilding);
                        this.mainUIInstance.activeBuilding = null;
                    }
                }
            } else { // Drag
                if (this.isDraggingBuilding) {
                    BuildingsController.getInstance().handleBuildingTouchEnded(this.mainUIInstance, touches[0], false);
                }
            }
        }

        // Reset tất cả các biến trạng thái (luôn thực hiện)
        this.touchStartPos = null;
        this.touchedAssetAtStart = null;
        this.isDraggingBuilding = false;
        if (this.mainUIInstance) { // Chỉ reset nếu có mainUIInstance
            this.mainUIInstance.dragStartOffset = null;
        }
        this.lastMultiTouchCenter = null;
        this.initialTouchDistance = 0;
        this.panStartCameraPos = null;
        this.panStartTouchPos = null;
    },

    onTouchesCancelled: function(touches, event) {
        if (this.interactionEnabled && this.isDraggingBuilding) {
            BuildingsController.getInstance().handleBuildingTouchEnded(this.mainUIInstance, touches[0], true);
        }

        this.touchStartPos = null;
        this.touchedAssetAtStart = null;
        this.isDraggingBuilding = false;
        if (this.mainUIInstance) {
            this.mainUIInstance.dragStartOffset = null;
        }
        this.lastMultiTouchCenter = null;
        this.initialTouchDistance = 0;
        this.panStartCameraPos = null;
        this.panStartTouchPos = null;
    },

    _findAssetAtPoint: function(screenPoint) {
        // === FIX: Thêm điều kiện bảo vệ ===
        if (!this.interactionEnabled) {
            return null;
        }
        var mapTouchLocation = this.mainUIInstance.mapElement.convertToNodeSpace(screenPoint);
        var touchGridPos = this.mainUIInstance.gridSystem.localToGrid(mapTouchLocation.x, mapTouchLocation.y);

        var buildings = BuildingsManager.getInstance().getAllBuildings();
        for (var i = buildings.length - 1; i >= 0; i--) {
            var b = buildings[i];
            var bx = b.posX;
            var by = b.posY;
            var bw = b.config.size.width;
            var bh = b.config.size.height;
            if (touchGridPos.x >= bx && touchGridPos.x < (bx + bw) && touchGridPos.y >= by && touchGridPos.y < (by + bh)) {
                return b;
            }
        }

        var obstacles = BuildingsManager.getInstance().getAllObstacles();
        for (var j = obstacles.length - 1; j >= 0; j--) {
            var o = obstacles[j];
            var ox = o.posX;
            var oy = o.posY;
            var ow = o.config.size.width;
            var oh = o.config.size.height;
            if (touchGridPos.x >= ox && touchGridPos.x < (ox + ow) && touchGridPos.y >= oy && touchGridPos.y < (oy + oh)) {
                return o;
            }
        }
        return null;
    },

    updateBounds: function(bounds) {
        if (bounds) {
            this.camera.bounds = bounds;
            this._calculateDynamicMinZoom();
            var centerX = (this.camera.bounds.left + this.camera.bounds.right) / 2;
            var centerY = (this.camera.bounds.bottom + this.camera.bounds.top) / 2;
            this.setPosition(centerX, centerY);
        }
    },

    move: function(deltaX_world, deltaY_world) {
        var newCamX = this.camera.x + deltaX_world;
        var newCamY = this.camera.y + deltaY_world;
        this.setPosition(newCamX, newCamY);
    },

    zoomAtPoint: function(newZoom, screenPoint) {
        var oldZoom = this.camera.zoom;
        const overallMinZoom = Math.max(this.camera.minZoom, this.camera.dynamicMinZoom);
        newZoom = Math.max(overallMinZoom, Math.min(this.camera.maxZoom, newZoom));

        if (newZoom !== oldZoom) {
            var worldPointBefore = this.screenToWorld(screenPoint);
            this.camera.zoom = newZoom;
            var worldPointAfter = this.screenToWorld(screenPoint);
            var deltaCamX = worldPointBefore.x - worldPointAfter.x;
            var deltaCamY = worldPointBefore.y - worldPointAfter.y;

            this.setPosition(this.camera.x + deltaCamX, this.camera.y + deltaCamY);
        }
    },

    applyTransform: function() {
        if (this.target) {
            var screenCenterX = this.visibleOrigin.x + this.visibleSize.width / 2;
            var screenCenterY = this.visibleOrigin.y + this.visibleSize.height / 2;
            var finalX = screenCenterX - (this.camera.x * this.camera.zoom);
            var finalY = screenCenterY - (this.camera.y * this.camera.zoom);
            this.target.setPosition(finalX, finalY);
            this.target.setScale(this.camera.zoom);
        }
    },

    setPosition: function(worldX, worldY) {
        this.camera.x = worldX;
        this.camera.y = worldY;

        if(this.visibleSize && this.camera.bounds) {
            var currentScreenWidthInWorld = this.visibleSize.width / this.camera.zoom;
            var currentScreenHeightInWorld = this.visibleSize.height / this.camera.zoom;
            this.camera.x = Math.max(this.camera.bounds.left + currentScreenWidthInWorld / 2, Math.min(this.camera.bounds.right - currentScreenWidthInWorld / 2, this.camera.x));
            this.camera.y = Math.max(this.camera.bounds.bottom + currentScreenHeightInWorld / 2, Math.min(this.camera.bounds.top - currentScreenHeightInWorld / 2, this.camera.y));
        }

        this.applyTransform();
    },

    screenToWorld: function(screenPoint) {
        var screenCenterX = this.visibleOrigin.x + this.visibleSize.width / 2;
        var screenCenterY = this.visibleOrigin.y + this.visibleSize.height / 2;
        var worldX = (screenPoint.x - screenCenterX) / this.camera.zoom + this.camera.x;
        var worldY = (screenPoint.y - screenCenterY) / this.camera.zoom + this.camera.y;
        return { x: worldX, y: worldY };
    },
});