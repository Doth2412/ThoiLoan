// Pathfinder.js - A* Pathfinding for PathfindingGrid

// Simple Min-Heap (Priority Queue) for A* open list.
// Stores nodes and prioritizes them based on fCost.
function MinHeap() {
    this.heap = [];
}

MinHeap.prototype = {
    push: function (node) {
        this.heap.push(node);
        this._bubbleUp(this.heap.length - 1);
    },

    pop: function () {
        var top = this.heap[0];
        var end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this._sinkDown(0);
        }
        return top;
    },

    isEmpty: function () {
        return this.heap.length === 0;
    },

    _bubbleUp: function (n) {
        var element = this.heap[n];
        while (n > 0) {
            var parentN = Math.floor((n + 1) / 2) - 1;
            var parent = this.heap[parentN];
            // Compare fCost, with hCost as a tie-breaker
            if (element.fCost >= parent.fCost) break;

            this.heap[parentN] = element;
            this.heap[n] = parent;
            n = parentN;
        }
    },

    _sinkDown: function (n) {
        var length = this.heap.length;
        var element = this.heap[n];
        var elemScore = element.fCost;

        while (true) {
            var child2N = (n + 1) * 2;
            var child1N = child2N - 1;
            var swap = null;
            var child1, child1Score;

            if (child1N < length) {
                child1 = this.heap[child1N];
                child1Score = child1.fCost;
                if (child1Score < elemScore) {
                    swap = child1N;
                }
            }

            if (child2N < length) {
                var child2 = this.heap[child2N];
                var child2Score = child2.fCost;
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            if (swap === null) break;

            this.heap[n] = this.heap[swap];
            this.heap[swap] = element;
            n = swap;
        }
    }
};

/**
 * Pathfinder class for A* pathfinding on a PathfindingGrid.
 * Usage: var pathfinder = new Pathfinder(gridInstance);
 *
 * Implements the A* algorithm to find the shortest path between two points on the grid.
 * Supports dynamic obstacles (walls) by assigning a high cost to wall traversal.
 */
function Pathfinder(pathfindingGrid) {
    this.pathfindingGrid = pathfindingGrid;
    this.pathCache = {};
}

Pathfinder.prototype.constructor = function (pathfindingGrid) {
    this.pathfindingGrid = pathfindingGrid;
    this.pathCache = {};
};

/**
 * Clears the entire path cache. Should be called whenever the grid's traversability changes.
 */
Pathfinder.prototype.invalidateCache = function () {
    this.pathCache = {};
};

/**
 * Node class for A* algorithm.
 * Each node represents a cell in the grid and stores:
 *   x, y: Grid coordinates
 *   gCost: Cost from start node to this node
 *   hCost: Heuristic cost from this node to the target
 *   fCost: Total cost (gCost + hCost)
 *   parent: Reference to the parent node (for path reconstruction)
 *   isWallSegment: True if this node represents a wall segment (for wall breaking)
 */
function Node(x, y, gCost, hCost, parent, isWallSegment, buildingId) {
    this.x = x;
    this.y = y;
    this.gCost = gCost;
    this.hCost = hCost;
    this.fCost = gCost + hCost;
    this.parent = parent;
    this.isWallSegment = !!isWallSegment;
    this.buildingId = buildingId || null;
}

Pathfinder.Node = Node;

// Cost constants for movement
// MOVE_COST_CARDINAL: Cost for moving horizontally or vertically
// MOVE_COST_DIAGONAL: Cost for moving diagonally
// WALL_BREAK_COST: High cost for breaking through a wall
Pathfinder.MOVE_COST_CARDINAL = 10;
Pathfinder.MOVE_COST_DIAGONAL = 14;
Pathfinder.WALL_BREAK_COST = 100;

/**
 * Octile distance heuristic for A* when diagonal movement is allowed.
 * Calculates the cost by using as many diagonal steps as possible.
 */
Pathfinder.heuristic = function (x1, y1, x2, y2) {
    var dx = Math.abs(x1 - x2);
    var dy = Math.abs(y1 - y2);
    // Cost of diagonal steps + cost of remaining cardinal steps
    return Pathfinder.MOVE_COST_DIAGONAL * Math.min(dx, dy) + Pathfinder.MOVE_COST_CARDINAL * (Math.abs(dx - dy));
};

/**
 * Returns the movement cost between two adjacent cells, including wall cost if applicable.
 */
Pathfinder.getMoveCost = function (grid, fromX, fromY, toX, toY) {
    var deltaX = Math.abs(fromX - toX);
    var deltaY = Math.abs(fromY - toY);
    var cell = grid.getCell(toX, toY);
    if (!cell) return Infinity;
    if (cell.state === grid.constructor.CELL_STATE.WALL) {
        return Pathfinder.WALL_BREAK_COST;
    }
    if (deltaX + deltaY === 2) {
        return Pathfinder.MOVE_COST_DIAGONAL;
    }
    return Pathfinder.MOVE_COST_CARDINAL;
};

/**
 * Finds the shortest path from (startX, startY) to (targetX, targetY) using A*.
 *
 * Algorithm steps:
 * 1. Initialize open and closed lists.
 * 2. Add the start node to the open list.
 * 3. While the open list is not empty:
 *    a. Select the node with the lowest fCost from the open list.
 *    b. If this node is the target, reconstruct and return the path.
 *    c. For each neighbor:
 *       - Skip if already in closed set or is an impassable cell (unless it's the target).
 *       - Calculate movement cost (including wall cost if applicable).
 *       - If a better path is found, update or add the neighbor node.
 * 4. If the open list is empty and target not reached, return null.
 */
Pathfinder.prototype.findPath = function (startX, startY, targetX, targetY, targetRange) {
    targetRange = targetRange || 0;
    var cacheKey = startX + ',' + startY + ',' + targetX + ',' + targetY + ',' + targetRange;
    if (this.pathCache.hasOwnProperty(cacheKey)) {
        return this.pathCache[cacheKey];
    }

    var grid = this.pathfindingGrid;
    var Node = Pathfinder.Node;
    var CELL_STATE = grid.constructor.CELL_STATE;
    var WALL_BREAK_COST = Pathfinder.WALL_BREAK_COST;
    var MOVE_COST_CARDINAL = Pathfinder.MOVE_COST_CARDINAL;
    var MOVE_COST_DIAGONAL = Pathfinder.MOVE_COST_DIAGONAL;
    var heuristic = Pathfinder.heuristic;
    var getMoveCost = Pathfinder.getMoveCost;

    function nodeKey(x, y) {
        return x + ',' + y;
    }

    var openList = new MinHeap();
    var openMap = {};
    var closedSet = {};

    var startNode = new Node(startX, startY, 0, heuristic(startX, startY, targetX, targetY), null, false);
    openList.push(startNode);
    openMap[nodeKey(startX, startY)] = startNode;

    while (!openList.isEmpty()) {
        var currentNode = openList.pop();
        delete openMap[nodeKey(currentNode.x, currentNode.y)];
        closedSet[nodeKey(currentNode.x, currentNode.y)] = true;

        if (currentNode.x === targetX && currentNode.y === targetY) {
            var result = {
                path: this._reconstructPath(currentNode), cost: currentNode.gCost
            };
            this.pathCache[cacheKey] = result;
            return result;
        }

        if (targetRange >= 1.0) {
            var dx = Math.abs(currentNode.x - targetX);
            var dy = Math.abs(currentNode.y - targetY);
            var gridDistance = Math.max(dx, dy);

            if (gridDistance <= targetRange) {
                var result = {
                    path: this._reconstructPath(currentNode), cost: currentNode.gCost
                };
                this.pathCache[cacheKey] = result;
                return result;
            }
        }

        var neighbors = grid.getNeighbors(currentNode.x, currentNode.y, true);
        for (var neighborIndex = 0; neighborIndex < neighbors.length; neighborIndex++) {
            var neighborX = neighbors[neighborIndex].x;
            var neighborY = neighbors[neighborIndex].y;
            var neighborKey = nodeKey(neighborX, neighborY);
            if (closedSet[neighborKey]) continue;
            var neighborCell = grid.getCell(neighborX, neighborY);
            if (!neighborCell) continue;
            if (neighborCell.state === CELL_STATE.BUILDING && !(neighborX === targetX && neighborY === targetY)) continue;

            var deltaX = Math.abs(currentNode.x - neighborX);
            var deltaY = Math.abs(currentNode.y - neighborY);
            var baseMoveCost = (deltaX + deltaY === 2) ? MOVE_COST_DIAGONAL : MOVE_COST_CARDINAL;
            var isWallSegment = false;
            var wallBuildingId = null;
            var newGCost = currentNode.gCost;
            if (neighborCell.state === CELL_STATE.WALL) {
                newGCost += WALL_BREAK_COST;
                isWallSegment = true;
                wallBuildingId = neighborCell.buildingId;
            } else {
                newGCost += baseMoveCost;
            }

            var existingNode = openMap[neighborKey];
            if (existingNode && newGCost >= existingNode.gCost) {
                continue;
            }

            var neighborHCost = heuristic(neighborX, neighborY, targetX, targetY);
            var newNode = new Node(neighborX, neighborY, newGCost, neighborHCost, currentNode, isWallSegment, wallBuildingId); // PASS wallBuildingId
            openList.push(newNode);
            openMap[neighborKey] = newNode;
        }
    }
    // No path found
    this.pathCache[cacheKey] = null;
    return null;
};

/**
 * Reconstructs the path from the target node by following parent references back to the start node.
 * Returns an array of { x, y, isWallSegment } objects representing the path.
 */
Pathfinder.prototype._reconstructPath = function (targetNode) {
    var path = [];
    var node = targetNode;
    while (node.parent) {
        path.unshift({x: node.x, y: node.y, isWallSegment: !!node.isWallSegment, buildingId: node.buildingId});
        node = node.parent;
    }
    return path;
};

