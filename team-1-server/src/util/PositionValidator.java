package util;

import model.MapLayout;
import model.GameObject;
import model.building.Building;
import model.util.Position;
import bitzero.server.extensions.ExtensionLogLevel;

import java.util.List;

/**
 * Centralized utility for position validation logic
 * Eliminates redundancy between InitMap placement and MapService position
 * checking
 */
public class PositionValidator {

    /**
     * Interface for objects that have position and dimensions
     */
    public interface Positionable {
        int getX();

        int getY();

        int getWidth();

        int getHeight();

        Object getId(); // Can be String (GameObject) or Integer (Building index) or any identifier
    }

    /**
     * Adapter for GameObject to implement Positionable
     */
    public static class GameObjectAdapter implements Positionable {
        private final GameObject gameObject;

        public GameObjectAdapter(GameObject gameObject) {
            this.gameObject = gameObject;
        }

        @Override
        public int getX() {
            return gameObject.getX();
        }

        @Override
        public int getY() {
            return gameObject.getY();
        }

        @Override
        public int getWidth() {
            return gameObject.getWidth();
        }

        @Override
        public int getHeight() {
            return gameObject.getHeight();
        }

        @Override
        public Object getId() {
            return gameObject.getId();
        }
    }

    /**
     * Adapter for Building to implement Positionable
     */
    public static class BuildingAdapter implements Positionable {
        private final Building building;
        private final int width;
        private final int height;

        public BuildingAdapter(Building building, int width, int height) {
            this.building = building;
            this.width = width;
            this.height = height;
        }

        @Override
        public int getX() {
            Position pos = building.getPosition();
            return pos != null ? pos.getX() : 0;
        }

        @Override
        public int getY() {
            Position pos = building.getPosition();
            return pos != null ? pos.getY() : 0;
        }

        @Override
        public int getWidth() {
            return width;
        }

        @Override
        public int getHeight() {
            return height;
        }

        @Override
        public Object getId() {
            return building.getBuildingIndex();
        }
    }

    /**
     * Checks if a rectangular area is entirely within the map bounds
     * 
     * @param x      The X coordinate of the area
     * @param y      The Y coordinate of the area
     * @param width  The width of the area
     * @param height The height of the area
     * @return true if the area is within bounds, false otherwise
     */
    public static boolean isWithinMapBounds(int x, int y, int width, int height) {
        return x >= 0 && y >= 0 &&
                (x + width) <= MapLayout.MAP_WIDTH &&
                (y + height) <= MapLayout.MAP_HEIGHT;
    }

    /**
     * Checks if a position has collision with any objects in the list
     * 
     * @param x             The X coordinate to check
     * @param y             The Y coordinate to check
     * @param width         The width of the area being checked
     * @param height        The height of the area being checked
     * @param objects       The list of positioned objects to check against
     * @param excludeObject Object to exclude from collision check (can be null)
     * @return true if collision detected, false otherwise
     */
    public static boolean hasCollisionWithObjects(int x, int y, int width, int height,
            List<? extends Positionable> objects,
            Positionable excludeObject) {
        if (objects == null) {
            return false;
        }

        for (Positionable obj : objects) {
            // Skip the excluded object
            if (excludeObject != null && obj.getId().equals(excludeObject.getId())) {
                continue;
            }

            // Skip objects with invalid positions
            if (obj.getX() < 0 || obj.getY() < 0) {
                continue;
            }

            // Check for rectangle overlap using standard collision detection
            boolean hasCollision = !(x >= obj.getX() + obj.getWidth() || // This area is to the right
                    x + width <= obj.getX() || // This area is to the left
                    y >= obj.getY() + obj.getHeight() || // This area is below
                    y + height <= obj.getY()); // This area is above

            if (hasCollision) {
                LoggerUtil.log(ExtensionLogLevel.DEBUG,
                        "PositionValidator: Collision detected at ({}, {}) with object {} at ({}, {})",
                        x, y, obj.getId(), obj.getX(), obj.getY());
                return true;
            }
        }

        return false;
    }

    /**
     * Convenience method for checking both bounds and collisions
     * 
     * @param x             The X coordinate to check
     * @param y             The Y coordinate to check
     * @param width         The width of the area being checked
     * @param height        The height of the area being checked
     * @param objects       The list of positioned objects to check against
     * @param excludeObject Object to exclude from collision check (can be null)
     * @return true if position is valid (within bounds and no collisions), false
     *         otherwise
     */
    public static boolean isValidPosition(int x, int y, int width, int height,
            List<? extends Positionable> objects,
            Positionable excludeObject) {
        return isWithinMapBounds(x, y, width, height) &&
                !hasCollisionWithObjects(x, y, width, height, objects, excludeObject);
    }

    /**
     * Logs position validation details for debugging
     * 
     * @param x       The X coordinate
     * @param y       The Y coordinate
     * @param width   The width
     * @param height  The height
     * @param context Context string for logging
     */
    public static void logValidationDetails(int x, int y, int width, int height, String context) {
        boolean withinBounds = isWithinMapBounds(x, y, width, height);
        LoggerUtil.log(ExtensionLogLevel.DEBUG,
                "PositionValidator [{}]: Position ({}, {}) with size ({}, {}) - Within bounds: {}, Map size: ({}, {})",
                context, x, y, width, height, withinBounds, MapLayout.MAP_WIDTH, MapLayout.MAP_HEIGHT);
    }
}
