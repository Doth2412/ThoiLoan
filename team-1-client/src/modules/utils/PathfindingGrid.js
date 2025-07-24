var CELL_STATE = {
    EMPTY: 0,
    BUILDING: 1,
    WALL: 2,
    NO_DEPLOY_ZONE: 3,
    BUILDING_PERIMETER: 4
};

const DEPLOYMENT_BUFFER_CELLS = 1;

/**
 * PathfindingGrid manages the logical state of the game grid for placement and pathfinding.
 */
var PathfindingGrid = cc.Class.extend({
    ctor: function () {
        this.gridWidth = 40;
        this.gridHeight = 40;
        this._initializeGrid();
    },

    reset: function () {
        cc.log("PathfindingGrid: Resetting grid state.");
        this._initializeGrid();
    },

    _initializeGrid: function () {
        this.grid = [];
        for (var x = 0; x < this.gridWidth; x++) {
            this.grid[x] = [];
            for (var y = 0; y < this.gridHeight; y++) {
                this.grid[x][y] = {
                    state: CELL_STATE.EMPTY,
                    buildingId: null
                };
            }
        }
    },

    isValidCoordinate: function (x, y) {
        return x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight;
    },

    getCell: function (x, y) {
        if (!this.isValidCoordinate(x, y)) {
            return null;
        }
        return this.grid[x][y];
    },

    setCellState: function (x, y, state, buildingId) {
        if (!this.isValidCoordinate(x, y)) {
            cc.error('PathfindingGrid: Invalid coordinates (' + x + ',' + y + ') for setCellState');
            return;
        }
        this.grid[x][y].state = state;
        if ((state === CELL_STATE.BUILDING || state === CELL_STATE.BUILDING_PERIMETER || state === CELL_STATE.WALL) && buildingId) {
            this.grid[x][y].buildingId = buildingId;
        } else {
            this.grid[x][y].buildingId = null;
        }
    },

    // this is where the building get a remap of the building in the buildingManager
    // buildings will be split into two part: core and perimeter
    // core is impassable, perimeter is walkable
    placeBuilding: function (buildingId, gridX, gridY, buildingWidth, buildingHeight) {
        for (var x_check = gridX; x_check < gridX + buildingWidth; x_check++) {
            for (var y_check = gridY; y_check < gridY + buildingHeight; y_check++) {
                if (!this.isValidCoordinate(x_check, y_check)) {
                    cc.error('PathfindingGrid: Building placement out of bounds at (' + x_check + ',' + y_check + ') for buildingId: ' + buildingId);
                    return false;
                }
                var cell_check = this.getCell(x_check, y_check);
                if (cell_check.state !== CELL_STATE.EMPTY && cell_check.state !== CELL_STATE.NO_DEPLOY_ZONE) {
                    cc.error('PathfindingGrid: Building placement conflict at (' + x_check + ',' + y_check + '). Cell not EMPTY for buildingId: ' + buildingId + ". Current state: " + cell_check.state);
                    return false;
                }
            }
        }

        var isObstacle = buildingId && buildingId.indexOf("obstacle_") === 0;

        for (var x = gridX; x < gridX + buildingWidth; x++) {
            for (var y = gridY; y < gridY + buildingHeight; y++) {
                // Determine if this cell (x,y) is on the border of the building's WxH footprint
                var isCellOnBorder = (
                    x === gridX || x === (gridX + buildingWidth - 1) ||
                    y === gridY || y === (gridY + buildingHeight - 1)
                );
                // Buildings of width/height 1 or 2 are considered all perimeter
                if (buildingWidth <= 2 || buildingHeight <= 2) {
                    this.setCellState(x, y, CELL_STATE.BUILDING_PERIMETER, buildingId);
                } else {
                    if (isCellOnBorder) {
                        this.setCellState(x, y, CELL_STATE.BUILDING_PERIMETER, buildingId);
                    } else {
                        this.setCellState(x, y, CELL_STATE.BUILDING, buildingId); // Inner core
                    }
                }
            }
        }
        return true;
    },

    removeBuilding: function (buildingId) {
        if (!buildingId) {
            cc.warn('PathfindingGrid: removeBuilding called with null or empty buildingId.');
            return false;
        }
        var buildingRemoved = false;
        for (var x = 0; x < this.gridWidth; x++) {
            for (var y = 0; y < this.gridHeight; y++) {
                if (this.grid[x][y].buildingId === buildingId) {
                    this.setCellState(x, y, CELL_STATE.EMPTY, null);
                    buildingRemoved = true;
                }
            }
        }
        if (!buildingRemoved) {
            cc.log('PathfindingGrid: No building found with id: ' + buildingId + ' to remove.');
        }
        return buildingRemoved;
    },

    placeWall: function (x, y, buildingId) {
        if (!this.isValidCoordinate(x, y)) {
            cc.error('PathfindingGrid: Wall placement out of bounds at (' + x + ',' + y + ')');
            return false;
        }
        this.setCellState(x, y, CELL_STATE.WALL, buildingId);
        return true;
    },

    removeWall: function (x, y) {
        if (!this.isValidCoordinate(x, y)) {
            cc.error('PathfindingGrid: Wall removal out of bounds at (' + x + ',' + y + ')');
            return false;
        }
        var cell = this.getCell(x, y);
        if (cell.state !== CELL_STATE.WALL) {
            cc.error('PathfindingGrid: Cannot remove wall at (' + x + ',' + y + '). Cell is not a WALL.');
            return false;
        }
        this.setCellState(x, y, CELL_STATE.EMPTY, null);
        return true;
    },

    _applyDeployBufferAroundRect: function (startX, startY, width, height) {
        var bufferStartX = startX - DEPLOYMENT_BUFFER_CELLS;
        var bufferStartY = startY - DEPLOYMENT_BUFFER_CELLS;
        var bufferEndX = startX + width + DEPLOYMENT_BUFFER_CELLS;
        var bufferEndY = startY + height + DEPLOYMENT_BUFFER_CELLS;

        for (var x = bufferStartX; x < bufferEndX; x++) {
            for (var y = bufferStartY; y < bufferEndY; y++) {
                if (this.isValidCoordinate(x, y)) {
                    var cell = this.getCell(x, y);
                    if (cell.state === CELL_STATE.EMPTY) {
                        this.setCellState(x, y, CELL_STATE.NO_DEPLOY_ZONE, null);
                    }
                }
            }
        }
    },

    calculateNoDeployZones: function (allBuildings) {
        cc.log("PathfindingGrid: Calculating no-deploy zones for buildings, walls, and map border...");

        // 1. Mark areas around all buildings and obstacles
        for (var i = 0; i < allBuildings.length; i++) {
            var building = allBuildings[i];
            this._applyDeployBufferAroundRect(building.gridX, building.gridY, building.width, building.height);
        }

        // 2. Mark areas around all individual wall segments
        for (var x_wall = 0; x_wall < this.gridWidth; x_wall++) {
            for (var y_wall = 0; y_wall < this.gridHeight; y_wall++) {
                if (this.grid[x_wall][y_wall].state === CELL_STATE.WALL) {
                    // Treat each wall segment as a 1x1 building for buffer calculation
                    this._applyDeployBufferAroundRect(x_wall, y_wall, 1, 1);
                }
            }
        }

        // 3. Mark the outer border of the entire map as a no-deploy zone
        var mapBorderThickness = 1;
        for (var x_border = 0; x_border < this.gridWidth; x_border++) {
            for (var y_border = 0; y_border < this.gridHeight; y_border++) {
                if (x_border < mapBorderThickness || x_border >= this.gridWidth - mapBorderThickness ||
                    y_border < mapBorderThickness || y_border >= this.gridHeight - mapBorderThickness) {
                    if (this.isValidCoordinate(x_border, y_border)) {
                        var borderCell = this.getCell(x_border, y_border);
                        if (borderCell.state === CELL_STATE.EMPTY) {
                            this.setCellState(x_border, y_border, CELL_STATE.NO_DEPLOY_ZONE, null);
                        }
                    }
                }
            }
        }
        cc.log("PathfindingGrid: No-deploy zones calculation complete.");
    },

    isTraversable: function (x, y) {
        if (!this.isValidCoordinate(x, y)) return false;
        var cell = this.getCell(x, y);
        // EMPTY and BUILDING_PERIMETER cells are traversable. WALLs are handled by pathfinder cost.
        return cell.state === CELL_STATE.EMPTY || cell.state === CELL_STATE.BUILDING_PERIMETER || cell.state === CELL_STATE.WALL;
    },

    isDeployable: function (x, y) {
        if (!this.isValidCoordinate(x, y)) return false;
        var cell = this.getCell(x, y);

        return cell.state === CELL_STATE.EMPTY;
    },

    getNeighbors: function (x, y, allowDiagonals) {
        if (typeof allowDiagonals === 'undefined') allowDiagonals = true;
        var neighbors = [];
        var dx, dy;
        if (allowDiagonals) {
            dx = [-1, 0, 1, -1, 1, -1, 0, 1];
            dy = [-1, -1, -1, 0, 0, 1, 1, 1];
            for (var i = 0; i < 8; i++) {
                var nx = x + dx[i];
                var ny = y + dy[i];
                if (this.isValidCoordinate(nx, ny)) {
                    neighbors.push({x: nx, y: ny});
                }
            }
        } else {
            dx = [0, -1, 1, 0];
            dy = [-1, 0, 0, 1];
            for (var i = 0; i < 4; i++) {
                var nx2 = x + dx[i];
                var ny2 = y + dy[i];
                if (this.isValidCoordinate(nx2, ny2)) {
                    neighbors.push({x: nx2, y: ny2});
                }
            }
        }
        return neighbors;
    },

    getWalkableInteractionPoints: function (buildingId) {
        var points = [];
        if (!buildingId) {
            cc.warn("PathfindingGrid.getWalkableInteractionPoints: called with null or empty buildingId.");
            return points;
        }

        for (var i = 0; i < this.gridWidth; i++) {
            for (var j = 0; j < this.gridHeight; j++) {
                var cell = this.grid[i][j];
                // Interaction points are now the building's own perimeter cells
                if (cell.buildingId === buildingId && cell.state === CELL_STATE.BUILDING_PERIMETER) {
                    points.push({x: i, y: j});
                }
            }
        }
        if (points.length === 0) {
            cc.log("PathfindingGrid.getWalkableInteractionPoints: No perimeter points found for " + buildingId + ". This might be an obstacle or a very small building with no distinct perimeter cells under current logic, or it's fully core.");
        }
        return points;
    },

    isWalkable: function (x, y) {
        if (!this.isValidCoordinate(x, y)) return false;
        var cellState = this.getCell(x, y).state;
        // Troops can walk on EMPTY or BUILDING_PERIMETER cells.
        // Walls are handled by pathfinder cost, so they are "walkable" from this function's perspective.
        return cellState === CELL_STATE.EMPTY || cellState === CELL_STATE.BUILDING_PERIMETER || cellState === CELL_STATE.WALL;
    },

    _strRepeat: function (str, count) {
        if (count < 0) {
            count = 0;
        }
        var result = "";
        for (var i = 0; i < count; i++) {
            result += str;
        }
        return result;
    },

    logGridState: function () {
        cc.log("PathfindingGrid State (" + this.gridWidth + "x" + this.gridHeight + "):");

        var maxLabelLength = 1;
        for (var iy_calc = 0; iy_calc < this.gridHeight; iy_calc++) {
            for (var ix_calc = 0; ix_calc < this.gridWidth; ix_calc++) {
                var cellCheck = this.getCell(ix_calc, iy_calc);
                var currentSymbolLength = 1;
                if (cellCheck && cellCheck.buildingId) {
                    var id_check = cellCheck.buildingId;
                    var symbol_prefix = "";
                    var numPart = "";

                    if (id_check.indexOf("building_") === 0) {
                        numPart = id_check.substring("building_".length);
                        if (cellCheck.state === CELL_STATE.BUILDING) {
                            symbol_prefix = "B";
                        } else if (cellCheck.state === CELL_STATE.BUILDING_PERIMETER) {
                            symbol_prefix = "p";
                        }
                    } else if (id_check.indexOf("obstacle_") === 0) {
                        // Obstacles are always CELL_STATE.BUILDING (core-like)
                        numPart = id_check.substring("obstacle_".length);
                        symbol_prefix = "O";
                    }

                    if (symbol_prefix) {
                        currentSymbolLength = (symbol_prefix + numPart).length;
                    }
                }
                if (currentSymbolLength > maxLabelLength) {
                    maxLabelLength = currentSymbolLength;
                }
            }
        }
        var cellDisplayWidth = maxLabelLength;
        var yAxisLabelSpace = "    ";
        var headerX1_tens = yAxisLabelSpace;
        var headerX0_units = yAxisLabelSpace;

        for (var x_h = 0; x_h < this.gridWidth; x_h++) {
            var tensChar = (x_h >= 10 ? Math.floor(x_h / 10).toString() : " ");
            var unitsChar = (x_h % 10).toString();

            headerX1_tens += tensChar;
            headerX1_tens += this._strRepeat(" ", cellDisplayWidth - tensChar.length);
            headerX1_tens += " ";

            headerX0_units += unitsChar;
            headerX0_units += this._strRepeat(" ", cellDisplayWidth - unitsChar.length);
            headerX0_units += " ";
        }
        cc.log(headerX1_tens);
        cc.log(headerX0_units);

        for (var y_disp = 0; y_disp < this.gridHeight; y_disp++) {
            var yLabelStr = y_disp.toString();
            if (y_disp < 10) {
                yLabelStr = " " + yLabelStr;
            }
            yLabelStr += ": ";
            var rowStr = yLabelStr;

            for (var x_disp = 0; x_disp < this.gridWidth; x_disp++) {
                var cell_disp = this.getCell(x_disp, y_disp);
                var displaySymbol = "";

                if (cell_disp) {
                    switch (cell_disp.state) {
                        case CELL_STATE.EMPTY:
                            displaySymbol = ".";
                            break;
                        case CELL_STATE.BUILDING: // Core or Obstacle
                            var id_b = cell_disp.buildingId;
                            displaySymbol = "B";
                            if (id_b) {
                                if (id_b.indexOf("building_") === 0) {
                                    displaySymbol = "B" + id_b.substring("building_".length);
                                } else if (id_b.indexOf("obstacle_") === 0) {
                                    displaySymbol = "O" + id_b.substring("obstacle_".length);
                                }
                            }
                            break;
                        case CELL_STATE.BUILDING_PERIMETER:
                            var id_p = cell_disp.buildingId;
                            displaySymbol = "p"; // Default for perimeter
                            if (id_p && id_p.indexOf("building_") === 0) {
                                displaySymbol = "p" + id_p.substring("building_".length); // Lowercase 'p'
                            }
                            break;
                        case CELL_STATE.WALL:
                            displaySymbol = "W";
                            break;
                        case CELL_STATE.NO_DEPLOY_ZONE:
                            displaySymbol = "N";
                            break;
                        default:
                            displaySymbol = "?";
                            break;
                    }
                } else {
                    displaySymbol = "X";
                }
                rowStr += displaySymbol;
                rowStr += this._strRepeat(" ", cellDisplayWidth - displaySymbol.length);
                rowStr += " ";
            }
            cc.log(rowStr);
        }
        cc.log("Legend: . (Empty), B# (Building Core), O# (Obstacle), p# (Building Perimeter), W (Wall), N (No Deploy Zone)");
    },
});

// Static cell state constants
PathfindingGrid.CELL_STATE = CELL_STATE;
