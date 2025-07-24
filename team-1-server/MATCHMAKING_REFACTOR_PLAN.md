# Matchmaking Refactor Plan

This document outlines the plan to refactor the matchmaking system for improved performance and scalability, based on our discussion. The core idea is to replace the current inefficient database-heavy process with a persistent, in-memory, tiered cache.

## Guiding Principles

1.  **Performance:** Eliminate database calls from the critical path of finding a match.
2.  **Persistence:** Ensure the matchmaking pool's state is not lost during server restarts.
3.  **Efficiency:** Use a tiered structure to significantly speed up opponent lookups.
4.  **Constraints:** Adhere to the existing system architecture, which uses a `DataModel` for persistence instead of direct database queries.

---

## Checkpoints

### ☑️ **Checkpoint 1: Refactor `MatchmakingPool.java`**

The `MatchmakingPool` will be converted into a singleton `DataModel` that manages a tiered, in-memory cache of players.

-   [ ] **Convert to Singleton:** Ensure only one instance of the pool exists.
-   [ ] **Implement Tiered Structure:** Change the internal data structure from a single map to a `Map<Integer, List<MatchmakingInfo>>` where the key is the prestige tier.
-   [ ] **Implement `DataModel` Persistence:**
    -   The `getInstance()` method will be responsible for loading the entire pool from the database on the first call.
    -   A `save()` method will be created to persist the entire pool state back to the database.
-   [ ] **Update Core Logic:**
    -   `addPlayer()`: Adds a player to the correct prestige tier.
    -   `removePlayer()`: Removes a player from their tier.
    -   `updatePlayerPrestige()`: Moves a player between tiers if their prestige change crosses a tier boundary.
    -   `findOpponent()`: Efficiently finds a random opponent within the same prestige tier.

### ☐ **Checkpoint 2: Modify `PvpBattleService.java`**

This service will be updated to use the new, efficient `MatchmakingPool` singleton.

-   [ ] **Remove Database Calls:** Eliminate `MatchmakingPool.load()` and `PlayerInfo.getModelFromDatabase()` from the `findOpponent` method.
-   [ ] **Integrate Singleton:** Modify `findOpponent` to call `MatchmakingPool.getInstance().findOpponent()`.
-   [ ] **Update Prestige Handling:** After a battle result is processed, call `MatchmakingPool.getInstance().updatePlayerPrestige()` to keep the in-memory pool synchronized with the player's new prestige.

### ☐ **Checkpoint 3: Update `FresherExtension.java` for Lifecycle Management**

The main extension class will be responsible for loading and saving the `MatchmakingPool` at the correct times.

-   [ ] **Load on Startup:** In the `init()` method, add a call to `MatchmakingPool.getInstance()` to ensure the pool is loaded from the database when the server starts.
-   [ ] **Save on Shutdown:** In the `destroy()` method, add a call to `MatchmakingPool.getInstance().save()` to persist the pool's state when the server shuts down gracefully.
