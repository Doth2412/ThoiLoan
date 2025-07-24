package model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import util.database.DataModel;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

public class MatchmakingPool extends DataModel {
    private static final Logger logger = LoggerFactory.getLogger(MatchmakingPool.class);
    private static final String POOL_KEY = "GlobalMatchmakingPool";
    private static final int PRESTIGE_TIER_RANGE = 200; // As per our plan

    private static MatchmakingPool instance;

    // The core tiered data structure. This will be serialized by the DataModel persistence.
    private final Map<Integer, List<MatchmakingInfo>> prestigeTiers;

    private MatchmakingPool() {
        // The map must be initialized here for when a new pool is created.
        this.prestigeTiers = new ConcurrentHashMap<>();
    }

    public static synchronized MatchmakingPool getInstance() {
        if (instance == null) {
            instance = loadFromDatabase();
        }
        return instance;
    }

    private static MatchmakingPool loadFromDatabase() {
        try {
            // The getModel method is part of the DataModel framework
            Object obj = getModel(POOL_KEY, MatchmakingPool.class);
            if (obj instanceof MatchmakingPool) {
                logger.info("MatchmakingPool: Successfully loaded from database.");
                return (MatchmakingPool) obj;
            }
        } catch (Exception e) {
            logger.error("MatchmakingPool: Error loading from database: " + e.getMessage() + ". A new pool will be created.", e);
        }
        // If loading fails or no pool exists, create a new one.
        logger.warn("MatchmakingPool: No existing pool found or error in loading. Creating a new, empty pool.");
        return new MatchmakingPool();
    }

    public void save() {
        try {
            // The saveModel method is part of the DataModel framework
            saveModel(POOL_KEY);
            logger.info("MatchmakingPool: Successfully saved to database.");
        } catch (Exception e) {
            logger.error("MatchmakingPool: Error saving to database: " + e.getMessage(), e);
        }
    }

    public void addPlayer(int playerId, String username, int prestige) {
        int tier = calculateTier(prestige);
        // computeIfAbsent ensures the list is created if the tier is new.
        prestigeTiers.computeIfAbsent(tier, k -> new CopyOnWriteArrayList<>()).add(new MatchmakingInfo(playerId, username, prestige));
        logger.info("MatchmakingPool: Added player " + playerId + " (" + username + ") with prestige " + prestige + " to tier " + tier);
    }

    public void removePlayer(int playerId, int prestige) {
        int tier = calculateTier(prestige);
        List<MatchmakingInfo> playersInTier = prestigeTiers.get(tier);
        if (playersInTier != null) {
            boolean removed = playersInTier.removeIf(p -> p.getPlayerId() == playerId);
            if (removed) {
                logger.info("MatchmakingPool: Removed player " + playerId + " from tier " + tier);
            } else {
                logger.warn("MatchmakingPool: Player " + playerId + " not found in tier " + tier + " for removal.");
            }
        }
    }

    public void updatePlayerPrestige(int playerId, String username, int oldPrestige, int newPrestige, long lastAttackedTime) {
        int oldTier = calculateTier(oldPrestige);
        int newTier = calculateTier(newPrestige);

        if (oldTier != newTier) {
            removePlayer(playerId, oldPrestige);
            addPlayer(playerId, username, newPrestige);
            logger.info("MatchmakingPool: Moved player " + playerId + " from tier " + oldTier + " to tier " + newTier);
        } else {
            // If the player is in the same tier, just update their prestige value and lastAttackedTime in the existing info object.
            List<MatchmakingInfo> playersInTier = prestigeTiers.get(newTier);
            if (playersInTier != null) {
                for (MatchmakingInfo info : playersInTier) {
                    if (info.getPlayerId() == playerId) {
                        info.setPrestige(newPrestige);
                        info.setLastAttackedTime(lastAttackedTime);
                        break;
                    }
                }
            }
            logger.info("MatchmakingPool: Updated player " + playerId + " prestige from " + oldPrestige + " to " + newPrestige + " within tier " + newTier);
        }
    }

    public MatchmakingInfo findOpponent(int attackerId, int attackerPrestige, List<Integer> seenOpponentIds) {
        int initialTier = calculateTier(attackerPrestige);
        int maxTierOffset = 5; // The maximum distance to search from the initial tier

        for (int offset = 0; offset <= maxTierOffset; offset++) {
            // Search in tier+offset and tier-offset
            int[] tiersToSearch = (offset == 0) ? new int[]{initialTier} : new int[]{initialTier + offset, initialTier - offset};

            for (int tier : tiersToSearch) {
                if (tier < 0) continue; // Skip negative tiers

                List<MatchmakingInfo> potentialOpponents = prestigeTiers.get(tier);
                if (potentialOpponents != null && !potentialOpponents.isEmpty()) {
                    List<MatchmakingInfo> opponents = potentialOpponents.stream()
                            .filter(p -> p.getPlayerId() != attackerId 
                                    && (seenOpponentIds == null || !seenOpponentIds.contains(p.getPlayerId()))
                                    && (System.currentTimeMillis() - p.getLastAttackedTime() > 43200000L))
                            .collect(Collectors.toList());

                    if (!opponents.isEmpty()) {
                        logger.info("Found opponent for player " + attackerId + " in tier " + tier + " (offset " + offset + ")");
                        return opponents.get((int) (Math.random() * opponents.size()));
                    }
                }
            }
        }

        logger.warn("MatchmakingPool: No suitable opponent found for player " + attackerId + " after expanding search.");
        return null; // No opponent found
    }

    private int calculateTier(int prestige) {
        return prestige / PRESTIGE_TIER_RANGE;
    }
}