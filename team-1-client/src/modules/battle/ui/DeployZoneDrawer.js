const BOUNDARY_LINE_COLOR = cc.color(255, 255, 255, 220); // White, slightly transparent
const BOUNDARY_LINE_WIDTH = 2;
const FLASH_DURATION = 3.0;

var DeployZoneDrawer = cc.Class.extend({
    gridSystem: null,
    pathfindingGrid: null,
    boundaryNode: null,

    ctor: function(gridSystem, pathfindingGrid) {
        this.gridSystem = gridSystem;
        this.pathfindingGrid = pathfindingGrid;
        this.boundaryNode = new cc.DrawNode();
        this.createBoundaryLines(); 
    },

    _isInvalidDeployCell: function(x, y) {
        if (!this.pathfindingGrid.isValidCoordinate(x, y)) {
            return true; 
        }
        var cell = this.pathfindingGrid.getCell(x, y);
        if (!cell) return true;

        // A cell is invalid if it's a no-deploy zone or a wall.
        // By marking WALL as invalid, the boundary won't be drawn between it and an adjacent NO_DEPLOY_ZONE cell.
        if (cell.state === PathfindingGrid.CELL_STATE.NO_DEPLOY_ZONE ||
            cell.state === PathfindingGrid.CELL_STATE.WALL) {
            return true;
        }

        // A cell is also invalid if it's part of a building (but not an obstacle).
        if ((cell.state === PathfindingGrid.CELL_STATE.BUILDING || cell.state === PathfindingGrid.CELL_STATE.BUILDING_PERIMETER) &&
            cell.buildingId && cell.buildingId.startsWith("building_")) {
            return true;
        }

        // Everything else (empty cells, obstacles) is considered a valid area, so no boundary line is drawn.
        return false;
    },

    /**
     * Calculates and draws all the boundary lines between deployable and non-deployable zones.
     * This creates a merged outline effect by only drawing edges that border a valid cell.
     */
    createBoundaryLines: function() {
        this.boundaryNode.clear();

        if (!this.pathfindingGrid) {
            cc.error("DeployZoneDrawer: pathfindingGrid is required.");
            return;
        }

        var gridWidth = this.gridSystem.getGridDimensions().width;
        var gridHeight = this.gridSystem.getGridDimensions().height;

        for (var x = 0; x < gridWidth; x++) {
            for (var y = 0; y < gridHeight; y++) {
                if (this._isInvalidDeployCell(x, y)) {
                    // Check neighbor ABOVE. If it's a valid deploy cell, draw the top edge of the current cell.
                    if (!this._isInvalidDeployCell(x, y - 1)) {
                        var p1 = this.gridSystem.gridToLocal(x, y);
                        var p2 = this.gridSystem.gridToLocal(x + 1, y);
                        this.boundaryNode.drawSegment(p1, p2, BOUNDARY_LINE_WIDTH, BOUNDARY_LINE_COLOR);
                    }
                    // Check neighbor BELOW.
                    if (!this._isInvalidDeployCell(x, y + 1)) {
                        var p1 = this.gridSystem.gridToLocal(x, y + 1);
                        var p2 = this.gridSystem.gridToLocal(x + 1, y + 1);
                        this.boundaryNode.drawSegment(p1, p2, BOUNDARY_LINE_WIDTH, BOUNDARY_LINE_COLOR);
                    }
                    // Check neighbor LEFT.
                    if (!this._isInvalidDeployCell(x - 1, y)) {
                        var p1 = this.gridSystem.gridToLocal(x, y);
                        var p2 = this.gridSystem.gridToLocal(x, y + 1);
                        this.boundaryNode.drawSegment(p1, p2, BOUNDARY_LINE_WIDTH, BOUNDARY_LINE_COLOR);
                    }
                    // Check neighbor RIGHT.
                    if (!this._isInvalidDeployCell(x + 1, y)) {
                        var p1 = this.gridSystem.gridToLocal(x + 1, y);
                        var p2 = this.gridSystem.gridToLocal(x + 1, y + 1);
                        this.boundaryNode.drawSegment(p1, p2, BOUNDARY_LINE_WIDTH, BOUNDARY_LINE_COLOR);
                    }
                }
            }
        }
    },

    /**
     * Makes the boundary lines visible for a short duration, then hides them.
     */
    flashBoundary: function() {
        if (this.boundaryNode) {
            this.boundaryNode.stopAllActions();
            this.boundaryNode.setVisible(true);
            
            var hideAction = cc.sequence(
                cc.delayTime(FLASH_DURATION),
                cc.hide()
            );
            this.boundaryNode.runAction(hideAction);
        }
    },

    getBoundaryNode: function() {
        return this.boundaryNode;
    },

    setVisible: function(visible) {
        if (this.boundaryNode) {
            this.boundaryNode.setVisible(visible);
        }
    }
});