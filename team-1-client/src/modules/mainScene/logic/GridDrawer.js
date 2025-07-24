// GridDrawer.js - Utility class for drawing the ISOMETRIC grid visualization

const DEFAULT_LINE_WIDTH = 1;
const DEFAULT_LINE_COLOR_R = 255;
const DEFAULT_LINE_COLOR_G = 255;
const DEFAULT_LINE_COLOR_B = 255;
const DEFAULT_LINE_COLOR_A = 150;
const DEFAULT_HIGHLIGHT_COLOR_R = 255;
const DEFAULT_HIGHLIGHT_COLOR_G = 255;
const DEFAULT_HIGHLIGHT_COLOR_B = 0;
const DEFAULT_HIGHLIGHT_COLOR_A = 100;
const DEFAULT_BORDER_WIDTH = 0;
const TRANSPARENT_COLOR_VALUE = 0; // For R, G, B, and A when fully transparent

var GridDrawer = cc.Class.extend({
    gridSystem: null,
    drawNode: null,
    coordinateLabelFontName: "Arial", // Added: Font for coordinate labels
    coordinateLabelFontSize: 12,      // Added: Font size for coordinate labels
    coordinateLabelFontColor: cc.color(255, 255, 255, 200), // Added: Color for coordinate labels (white, slightly transparent)


    ctor: function(gridSystem) {
        this.gridSystem = gridSystem;
        this.drawNode = null;

        // Visual settings
        this.lineWidth = DEFAULT_LINE_WIDTH;
        this.lineColor = cc.color(DEFAULT_LINE_COLOR_R, DEFAULT_LINE_COLOR_G, DEFAULT_LINE_COLOR_B, DEFAULT_LINE_COLOR_A); // White, slightly transparent
        this.highlightColor = cc.color(DEFAULT_HIGHLIGHT_COLOR_R, DEFAULT_HIGHLIGHT_COLOR_G, DEFAULT_HIGHLIGHT_COLOR_B, DEFAULT_HIGHLIGHT_COLOR_A); // Semi-transparent yellow
    },

    createGridNode: function() {
        if (!this.drawNode) {
            this.drawNode = new cc.DrawNode();
        } else {
            this.drawNode.clear();
        }

        var dimensions = this.gridSystem.getGridDimensions();
        var width = dimensions.width;
        var height = dimensions.height;

        // Draw lines along one axis (constant X, varying Y)
        for (var x = 0; x <= width; x++) {
            var p1 = this.gridSystem.gridToLocal(x, 0); // Get isometric point
            var p2 = this.gridSystem.gridToLocal(x, height); // Get isometric point
            this.drawNode.drawSegment(p1, p2, this.lineWidth, this.lineColor);
        }

        // Draw lines along the other axis (constant Y, varying X)
        for (var y = 0; y <= height; y++) {
            var p1 = this.gridSystem.gridToLocal(0, y); // Get isometric point
            var p2 = this.gridSystem.gridToLocal(width, y); // Get isometric point
            this.drawNode.drawSegment(p1, p2, this.lineWidth, this.lineColor);
        }

        this.showCoordinates(); // Added: Call to display coordinates

        return this.drawNode;
    },

    // Added: New function to show coordinates on the grid
    showCoordinates: function() {
        if (!this.drawNode || !this.gridSystem) {
            return;
        }

        var dimensions = this.gridSystem.getGridDimensions();
        var gridWidth = dimensions.width;
        var gridHeight = dimensions.height;

        for (var x = 0; x <= gridWidth; x++) {
            for (var y = 0; y <= gridHeight; y++) {
                var localPos = this.gridSystem.gridToLocal(x, y);
                if (localPos) {
                    var coordText = "(" + x + "," + y + ")";
                    var label = new cc.LabelTTF(coordText, this.coordinateLabelFontName, this.coordinateLabelFontSize);
                    label.setPosition(localPos.x, localPos.y + 10); // Position slightly above the intersection
                    label.setColor(this.coordinateLabelFontColor);
                    this.drawNode.addChild(label); // Add label to the drawNode
                }
            }
        }
    },

    // Highlight a specific grid cell
    highlightCell: function(posX, posY) {
        if (!this.gridSystem.isValidGridPosition(posX, posY)) {
            return;
        }

        // Get the four corners of the isometric cell (diamond)
        var p1 = this.gridSystem.gridToLocal(posX, posY);         // Top corner
        var p2 = this.gridSystem.gridToLocal(posX + 1, posY);     // Right corner
        var p3 = this.gridSystem.gridToLocal(posX + 1, posY + 1); // Bottom corner
        var p4 = this.gridSystem.gridToLocal(posX, posY + 1);     // Left corner

        if (p1 && p2 && p3 && p4) {
            // Draw the diamond shape as a filled polygon
            var vertices = [p1, p2, p3, p4];
            this.drawNode.drawPoly(
                vertices,
                this.highlightColor, // Fill color
                DEFAULT_BORDER_WIDTH,                  // Border width
                cc.color(TRANSPARENT_COLOR_VALUE, TRANSPARENT_COLOR_VALUE, TRANSPARENT_COLOR_VALUE, TRANSPARENT_COLOR_VALUE)   // Border color (transparent)
            );
        }
    },

    // Show/hide the grid
    setVisible: function(visible) {
        if (this.drawNode) {
            this.drawNode.setVisible(visible);
        }
    },

    // Clear all drawings
    clear: function() {
        if (this.drawNode) {
            this.drawNode.clear();
        }
    }
});