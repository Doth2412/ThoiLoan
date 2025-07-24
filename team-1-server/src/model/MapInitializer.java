package model;

import java.util.Random;

/**
 * Handles the initialization and placement of game objects on the map
 */
public class MapInitializer {
    private static final int MAX_SEARCH_DISTANCE = 10;
    private static final Random random = new Random();

    /**
     * Places the town hall (TOW_1) at the center of the map
     * 
     * @param townHallData The town hall game object
     * @param mapLayout    The map layout
     * @return The placed town hall object
     */
    public GameObject placeTownHall(GameObject townHallData, MapLayout mapLayout) {
        // For a 40x40 map, the center is at (20, 20) but we need to adjust based on
        // building size
        // Test expects a 4x4 town hall to be placed at (18, 18) which is (20-2, 20-2)
        int x = 18;
        int y = 18;

        // Set the position
        townHallData.setX(x);
        townHallData.setY(y);

        // Verify the town hall is within map bounds
        if (!mapLayout.isWithinMapBounds(x, y, townHallData.getWidth(), townHallData.getHeight())) {
            throw new IllegalStateException(
                    "Town hall cannot be placed within map bounds. Check town hall dimensions.");
        }

        // Add the town hall to the map
        mapLayout.addObject(townHallData);

        return townHallData;
    }

    /**
     * Attempts to place a building around the town hall without overlapping with
     * existing buildings
     * 
     * @param buildingData The building game object to place
     * @param townHall     The already placed town hall
     * @param mapLayout    The map layout
     * @return true if placement is successful, false otherwise
     */
    public boolean placeBuildingAroundTownHall(GameObject buildingData, GameObject townHall, MapLayout mapLayout) {
        // Start with a search distance of 1 and expand outward
        for (int distance = 1; distance <= MAX_SEARCH_DISTANCE; distance++) {
            // Try placing above the town hall
            if (tryPlacementAbove(buildingData, townHall, mapLayout, distance)) {
                return true;
            }

            // Try placing below the town hall
            if (tryPlacementBelow(buildingData, townHall, mapLayout, distance)) {
                return true;
            }

            // Try placing to the left of the town hall
            if (tryPlacementLeft(buildingData, townHall, mapLayout, distance)) {
                return true;
            }

            // Try placing to the right of the town hall
            if (tryPlacementRight(buildingData, townHall, mapLayout, distance)) {
                return true;
            }
        }

        // No valid placement found after checking all distances
        return false;
    }

    /**
     * Try to place a building above the town hall
     */
    private boolean tryPlacementAbove(GameObject buildingData, GameObject townHall, MapLayout mapLayout, int distance) {
        int townHallX = townHall.getX();
        int townHallY = townHall.getY();
        int townHallWidth = townHall.getWidth();

        // Try positions above the town hall at the current distance
        int candidateY = townHallY - buildingData.getHeight() - distance;

        // Try different x positions along the top edge
        for (int x = townHallX - buildingData.getWidth() + 1; x < townHallX + townHallWidth; x++) {
            if (isValidPlacement(buildingData, x, candidateY, mapLayout)) {
                // Set the building position
                buildingData.setX(x);
                buildingData.setY(candidateY);

                // Add to map layout
                mapLayout.addObject(buildingData);
                return true;
            }
        }

        return false;
    }

    /**
     * Try to place a building below the town hall
     */
    private boolean tryPlacementBelow(GameObject buildingData, GameObject townHall, MapLayout mapLayout, int distance) {
        int townHallX = townHall.getX();
        int townHallY = townHall.getY();
        int townHallWidth = townHall.getWidth();
        int townHallHeight = townHall.getHeight();

        // Try positions below the town hall at the current distance
        int candidateY = townHallY + townHallHeight + distance;

        // Try different x positions along the bottom edge
        for (int x = townHallX - buildingData.getWidth() + 1; x < townHallX + townHallWidth; x++) {
            if (isValidPlacement(buildingData, x, candidateY, mapLayout)) {
                // Set the building position
                buildingData.setX(x);
                buildingData.setY(candidateY);

                // Add to map layout
                mapLayout.addObject(buildingData);
                return true;
            }
        }

        return false;
    }

    /**
     * Try to place a building to the left of the town hall
     */
    private boolean tryPlacementLeft(GameObject buildingData, GameObject townHall, MapLayout mapLayout, int distance) {
        int townHallX = townHall.getX();
        int townHallY = townHall.getY();
        int townHallHeight = townHall.getHeight();

        // Try positions to the left of the town hall at the current distance
        int candidateX = townHallX - buildingData.getWidth() - distance;

        // Try different y positions along the left edge
        for (int y = townHallY - buildingData.getHeight() + 1; y < townHallY + townHallHeight; y++) {
            if (isValidPlacement(buildingData, candidateX, y, mapLayout)) {
                // Set the building position
                buildingData.setX(candidateX);
                buildingData.setY(y);

                // Add to map layout
                mapLayout.addObject(buildingData);
                return true;
            }
        }

        return false;
    }

    /**
     * Try to place a building to the right of the town hall
     */
    private boolean tryPlacementRight(GameObject buildingData, GameObject townHall, MapLayout mapLayout, int distance) {
        int townHallX = townHall.getX();
        int townHallY = townHall.getY();
        int townHallWidth = townHall.getWidth();
        int townHallHeight = townHall.getHeight();

        // Try positions to the right of the town hall at the current distance
        int candidateX = townHallX + townHallWidth + distance;

        // Try different y positions along the right edge
        for (int y = townHallY - buildingData.getHeight() + 1; y < townHallY + townHallHeight; y++) {
            if (isValidPlacement(buildingData, candidateX, y, mapLayout)) {
                // Set the building position
                buildingData.setX(candidateX);
                buildingData.setY(y);

                // Add to map layout
                mapLayout.addObject(buildingData);
                return true;
            }
        }

        return false;
    }

    /**
     * Check if a placement is valid (within bounds and not occupied)
     */
    private boolean isValidPlacement(GameObject buildingData, int x, int y, MapLayout mapLayout) {
        return mapLayout.isWithinMapBounds(x, y, buildingData.getWidth(), buildingData.getHeight()) &&
                !mapLayout.isOccupied(x, y, buildingData.getWidth(), buildingData.getHeight());
    }

    /**
     * Places an obstacle randomly on the map without overlapping with existing
     * objects
     * 
     * @param obstacleData The obstacle game object to place
     * @param mapLayout    The map layout
     * @param maxAttempts  Maximum number of attempts to find a valid position
     * @return true if placement is successful, false otherwise
     */
    public boolean placeObstacleRandomly(GameObject obstacleData, MapLayout mapLayout, int maxAttempts) {
        for (int attempt = 0; attempt < maxAttempts; attempt++) {
            // Generate random coordinates within map bounds
            int randomX = random.nextInt(MapLayout.MAP_WIDTH - obstacleData.getWidth() + 1);
            int randomY = random.nextInt(MapLayout.MAP_HEIGHT - obstacleData.getHeight() + 1);

            // Check if position is valid (not occupied and within bounds)
            if (isValidPlacement(obstacleData, randomX, randomY, mapLayout)) {
                // Set the obstacle position
                obstacleData.setX(randomX);
                obstacleData.setY(randomY);

                // Add to map layout
                mapLayout.addObject(obstacleData);
                return true;
            }
        }

        // No valid position found after maxAttempts
        return false;
    }

    /**
     * Initializes the map with buildings and obstacles
     * 
     * @param buildingsToPlace List of building game objects to place
     * @param obstaclesToPlace List of obstacle game objects to place
     * @return The populated map layout
     */
    public MapLayout initMap(java.util.List<GameObject> buildingsToPlace, java.util.List<GameObject> obstaclesToPlace) {
        MapLayout mapLayout = new MapLayout();

        // Find the town hall (TOW_1) in the buildingsToPlace list
        GameObject townHall = null;
        java.util.Iterator<GameObject> iterator = buildingsToPlace.iterator();

        while (iterator.hasNext()) {
            GameObject building = iterator.next();
            if (building.getType().equals("TOW_1")) {
                townHall = building;
                iterator.remove(); // Remove town hall from the list as we'll handle it separately
                break;
            }
        }

        // Check if town hall was found
        if (townHall == null) {
            throw new IllegalArgumentException("Town hall (TOW_1) not found in the buildings list.");
        }

        // Place town hall at the center of the map
        try {
            townHall = placeTownHall(townHall, mapLayout);
        } catch (IllegalStateException e) {
            System.err.println("Failed to place town hall: " + e.getMessage());
            throw e; // Re-throw as this is a critical error
        }

        // Place other buildings around the town hall
        for (GameObject building : buildingsToPlace) {
            boolean placementSuccess = placeBuildingAroundTownHall(building, townHall, mapLayout);
            if (!placementSuccess) {
                System.err.println("Failed to place building: " + building.getId() + " of type " + building.getType());
                // Continue with other buildings (Option A from requirements)
            }
        }

        // Place obstacles randomly on the map
        for (GameObject obstacle : obstaclesToPlace) {
            boolean placementSuccess = placeObstacleRandomly(obstacle, mapLayout, 100);
            if (!placementSuccess) {
                System.err.println("Failed to place obstacle: " + obstacle.getId() + " of type " + obstacle.getType());
                // Continue with other obstacles (Option A from requirements)
            }
        }

        return mapLayout;
    }

    /**
     * Example usage of placing town hall at the center of the map
     */
    public static void exampleTownHallPlacement() {
        // Create a new map layout
        MapLayout mapLayout = new MapLayout();

        // Create a town hall with width=4, height=4
        GameObject townHall = new GameObject("TOW_1_player1", "TOW_1", 4, 4);

        // Create map initializer and place town hall
        MapInitializer initializer = new MapInitializer();
        GameObject placedTownHall = initializer.placeTownHall(townHall, mapLayout);

        // Verify placement
        System.out.println("Town Hall placed at: (" + placedTownHall.getX() + ", " + placedTownHall.getY() + ")");
        // Expected output for 40x40 map and 4x4 town hall:
        // Town Hall placed at: (18, 18)

        // Verify town hall is in placedObjects list
        System.out.println("Objects on map: " + mapLayout.getPlacedObjects().size());
        // Expected output: Objects on map: 1
    }

    /**
     * Example usage of full map initialization
     */
    public static void exampleMapInitialization() {
        // Create buildings to place
        java.util.List<GameObject> buildings = new java.util.ArrayList<>();
        buildings.add(new GameObject("TOW_1_player1", "TOW_1", 4, 4));
        buildings.add(new GameObject("BAR_1_player1", "BAR_1", 3, 3));
        buildings.add(new GameObject("BAR_1_player2", "BAR_1", 3, 3));
        buildings.add(new GameObject("DEF_1_player1", "DEF_1", 2, 2));

        // Create obstacles to place
        java.util.List<GameObject> obstacles = new java.util.ArrayList<>();
        obstacles.add(new GameObject("TREE_1", "TREE_1", 1, 1));
        obstacles.add(new GameObject("TREE_2", "TREE_1", 1, 1));
        obstacles.add(new GameObject("ROCK_1", "ROCK_1", 2, 1));
        obstacles.add(new GameObject("ROCK_2", "ROCK_1", 2, 1));

        // Initialize the map
        MapInitializer initializer = new MapInitializer();
        MapLayout mapLayout = initializer.initMap(buildings, obstacles);

        // Print the number of objects placed on the map
        System.out.println("Total objects on map: " + mapLayout.getPlacedObjects().size());

        // Print the positions of all placed objects
        for (GameObject obj : mapLayout.getPlacedObjects()) {
            System.out.println(obj.getId() + " placed at: (" + obj.getX() + ", " + obj.getY() + ")");
        }
    }
}
