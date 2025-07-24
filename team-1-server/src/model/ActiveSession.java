package model;

import bitzero.engine.sessions.ISession;

/**
 * Represents an active user session for multi-device login tracking.
 * Stores session information including user ID, session reference, login time,
 * and device info.
 */
public class ActiveSession {
    private int userId;
    private ISession session;
    private long loginTime;
    private String deviceInfo;
    private long lastActivity;

    /**
     * Constructor for ActiveSession
     * 
     * @param userId     The user ID
     * @param session    The ISession object
     * @param loginTime  The login timestamp
     * @param deviceInfo Optional device information
     */
    public ActiveSession(int userId, ISession session, long loginTime, String deviceInfo) {
        this.userId = userId;
        this.session = session;
        this.loginTime = loginTime;
        this.deviceInfo = deviceInfo;
        this.lastActivity = loginTime;
    }

    /**
     * Constructor for ActiveSession without device info
     * 
     * @param userId    The user ID
     * @param session   The ISession object
     * @param loginTime The login timestamp
     */
    public ActiveSession(int userId, ISession session, long loginTime) {
        this(userId, session, loginTime, null);
    }

    // Getters
    public int getUserId() {
        return userId;
    }

    public ISession getSession() {
        return session;
    }

    public long getLoginTime() {
        return loginTime;
    }

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public long getLastActivity() {
        return lastActivity;
    }

    // Setters
    public void setSession(ISession session) {
        this.session = session;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public void updateLastActivity() {
        this.lastActivity = System.currentTimeMillis();
    }

    public void setLastActivity(long lastActivity) {
        this.lastActivity = lastActivity;
    }

    /**
     * Check if the session is still valid based on connection status
     * 
     * @return true if session is connected, false otherwise
     */
    public boolean isSessionValid() {
        return session != null && session.isConnected();
    }

    @Override
    public String toString() {
        return String.format("ActiveSession{userId=%d, loginTime=%d, deviceInfo='%s', lastActivity=%d}",
                userId, loginTime, deviceInfo, lastActivity);
    }
}
