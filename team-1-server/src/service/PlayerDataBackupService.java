package service;

import bitzero.server.entities.User;
import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.util.ExtensionUtility;
import util.LoggerUtil;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Backup service that periodically saves all connected players' data
 * as a safety mechanism in case disconnect events are missed.
 */
public class PlayerDataBackupService {
    private static volatile PlayerDataBackupService instance;
    private static final Object LOCK = new Object();

    private ScheduledExecutorService scheduler;
    private boolean isRunning = false;

    // Backup interval in minutes (default: 5 minutes)
    private static final int BACKUP_INTERVAL_MINUTES = 5;

    private PlayerDataBackupService() {
        // Private constructor for singleton
    }

    public static PlayerDataBackupService getInstance() {
        if (instance == null) {
            synchronized (LOCK) {
                if (instance == null) {
                    instance = new PlayerDataBackupService();
                }
            }
        }
        return instance;
    }

    /**
     * Start the periodic backup service
     */
    public void startBackupService() {
        if (isRunning) {
            LoggerUtil.log(ExtensionLogLevel.WARN, "PlayerDataBackupService: Backup service is already running");
            return;
        }

        scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(this::performBackup, BACKUP_INTERVAL_MINUTES,
                BACKUP_INTERVAL_MINUTES, TimeUnit.MINUTES);

        isRunning = true;
        LoggerUtil.log(ExtensionLogLevel.INFO,
                "PlayerDataBackupService: Started with backup interval of {} minutes", BACKUP_INTERVAL_MINUTES);
    }

    /**
     * Stop the periodic backup service
     */
    public void stopBackupService() {
        if (!isRunning) {
            return;
        }

        if (scheduler != null) {
            scheduler.shutdown();
            try {
                if (!scheduler.awaitTermination(30, TimeUnit.SECONDS)) {
                    scheduler.shutdownNow();
                }
            } catch (InterruptedException e) {
                scheduler.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }

        isRunning = false;
        LoggerUtil.log(ExtensionLogLevel.INFO, "PlayerDataBackupService: Stopped backup service");
    }

    /**
     * Perform backup for all connected players
     */
    private void performBackup() {
        try {
            List<User> allUsers = ExtensionUtility.globalUserManager.getAllUsers();
            if (allUsers == null || allUsers.isEmpty()) {
                LoggerUtil.log(ExtensionLogLevel.DEBUG,
                        "PlayerDataBackupService: No connected users to backup");
                return;
            }

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "PlayerDataBackupService: Starting backup for {} connected players", allUsers.size());

            int successCount = 0;
            int failCount = 0;

            for (User user : allUsers) {
                if (user != null) {
                    try {
                        boolean success = PlayerDataService.getInstance()
                                .savePlayerDataOnLogout(user, "periodic-backup");
                        if (success) {
                            successCount++;
                        } else {
                            failCount++;
                        }
                    } catch (Exception e) {
                        failCount++;
                        LoggerUtil.log(ExtensionLogLevel.ERROR,
                                "PlayerDataBackupService: Error backing up data for user {}: {}",
                                user.getName(), e.getMessage(), e);
                    }
                } else {
                    failCount++;
                }
            }

            LoggerUtil.log(ExtensionLogLevel.INFO,
                    "PlayerDataBackupService: Backup completed - {} successful, {} failed",
                    successCount, failCount);

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR,
                    "PlayerDataBackupService: Error during backup process: {}", e.getMessage(), e);
        }
    }

    /**
     * Perform immediate backup for all connected players
     */
    public void performImmediateBackup() {
        LoggerUtil.log(ExtensionLogLevel.INFO, "PlayerDataBackupService: Performing immediate backup");
        performBackup();
    }
}
