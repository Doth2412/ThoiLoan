// GridSystem.js - ISOMETRIC Grid + Additional Rotation

const DEFAULT_GRID_WIDTH = 40;
const DEFAULT_GRID_HEIGHT = 40;
const DEFAULT_TILE_WIDTH = 76;
const DEFAULT_TILE_HEIGHT = 57;
const DEFAULT_GRID_ORIGIN_X = 0;
const DEFAULT_GRID_ORIGIN_Y = 0;
const DEGREES_TO_RADIANS_FACTOR = Math.PI / 180;
const ISOMETRIC_TILE_HALF_DIVISOR = 2;
const GRID_LOWER_BOUND = 0;

var GridSystem = cc.Class.extend({
    // Grid dimensions (number of cells)
    gridWidth: DEFAULT_GRID_WIDTH,
    gridHeight: DEFAULT_GRID_HEIGHT,

    // ISOMETRIC Tile dimensions (Screen dimensions of one diamond tile)
    tileWidth: DEFAULT_TILE_WIDTH,
    tileHeight: DEFAULT_TILE_HEIGHT,

    // The desired MAP coordinate for the grid's (0,0) point
    gridOriginX: DEFAULT_GRID_ORIGIN_X,
    gridOriginY: DEFAULT_GRID_ORIGIN_Y,


    ctor: function(tileWidth, tileHeight, originX, originY) {
        // Set ISOMETRIC tile size
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        // Set grid origin
        this.gridOriginX = originX;
        this.gridOriginY = originY;
    },

    // Get grid dimensions
    getGridDimensions: function() {
        return {
            width: this.gridWidth,
            height: this.gridHeight,
            tileWidth: this.tileWidth,
            tileHeight: this.tileHeight
        };
    },
    
    gridToLocal: function(posX, posY) {
        var localX = (posX - posY) * (this.tileWidth / ISOMETRIC_TILE_HALF_DIVISOR);
        var localY = (posX + posY) * (this.tileHeight / ISOMETRIC_TILE_HALF_DIVISOR);
        return cc.p(localX + this.gridOriginX, localY + this.gridOriginY);
    },

    localToGrid: function(localX, localY) {
        var adjustedX = localX - this.gridOriginX;
        var adjustedY = localY - this.gridOriginY;

        var halfTileWidth = this.tileWidth / ISOMETRIC_TILE_HALF_DIVISOR;
        var halfTileHeight = this.tileHeight / ISOMETRIC_TILE_HALF_DIVISOR;

        if (halfTileWidth === 0 || halfTileHeight === 0) {
            cc.error("GridSystem: Tile dimensions are zero, cannot convert localToGrid.");
            return cc.p(0,0);
        }
        var gridX_float = 0.5 * ( (adjustedX / halfTileWidth) + (adjustedY / halfTileHeight) );
        var gridY_float = 0.5 * ( (adjustedY / halfTileHeight) - (adjustedX / halfTileWidth) );

        return cc.p(Math.floor(gridX_float), Math.floor(gridY_float));
    },

    isValidGridPosition: function(posX, posY) {
        return posX >= GRID_LOWER_BOUND && posX < this.gridWidth &&
               posY >= GRID_LOWER_BOUND && posY < this.gridHeight;
    },

});