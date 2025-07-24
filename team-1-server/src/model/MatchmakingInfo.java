package model;

import java.io.Serializable;

public class MatchmakingInfo implements Serializable {
    private int playerId;
    private String username;
    private int prestige;
    private long lastAttackedTime; // Timestamp when this player was last attacked (epoch milliseconds)

    // Default constructor is important for deserialization
    public MatchmakingInfo() {
    }

    public MatchmakingInfo(int playerId, String username, int prestige) {
        this.playerId = playerId;
        this.username = username;
        this.prestige = prestige;
        this.lastAttackedTime = 0; // Initialize to 0 or a suitable default
    }

    public int getPlayerId() {
        return playerId;
    }

    public void setPlayerId(int playerId) {
        this.playerId = playerId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getPrestige() {
        return prestige;
    }

    public void setPrestige(int prestige) {
        this.prestige = prestige;
    }

    public long getLastAttackedTime() {
        return lastAttackedTime;
    }

    public void setLastAttackedTime(long lastAttackedTime) {
        this.lastAttackedTime = lastAttackedTime;
    }

    @Override
    public String toString() {
        return "MatchmakingInfo{" +
                "playerId=" + playerId +
                ", username='" + username + "'" +
                ", prestige=" + prestige +
                ", lastAttackedTime=" + lastAttackedTime +
                '}';
    }
}
