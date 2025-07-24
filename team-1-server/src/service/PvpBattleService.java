package service;

import bitzero.server.entities.User;
import bitzero.server.extensions.ExtensionLogLevel;
import cmd.receive.battle.RequestPVPBattleResult;
import model.*;
import model.result.PVPBattleResult;
import util.LoggerUtil;
import util.server.ServerConstant;

import cmd.receive.battle.RequestFindBattle;

public class PvpBattleService {

    private static PvpBattleService instance;

    private PvpBattleService() {
    }

    public static synchronized PvpBattleService getInstance() {
        if (instance == null) {
            instance = new PvpBattleService();
        }
        return instance;
    }

    public Player findOpponent(User user, RequestFindBattle request) {
        PlayerInfo attackerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
        if (attackerInfo == null || attackerInfo.getPlayer() == null) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "PvpBattleService: Attacker PlayerInfo not found for user: " + user.getName());
            return null;
        }

        Player attacker = attackerInfo.getPlayer();
        int cost = 50; // Matchmaking cost

        if (attacker.getResources().getGold() < cost) {
            LoggerUtil.log(ExtensionLogLevel.WARN, "PvpBattleService: Not enough gold for matchmaking for user: " + user.getName() + ". Required: " + cost + ", Has: " + attacker.getResources().getGold());
            return null;
        }

        // Deduct cost and save immediately
        attacker.getResources().setGold(attacker.getResources().getGold() - cost);
        try {
            attackerInfo.saveModel(user.getName());
        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "PvpBattleService: Failed to save player data after deducting fee for user: " + user.getName(), e);
            // Optional: Decide if the process should halt if saving fails. For now, we continue.
        }

        int attackerId = Math.abs(user.getName().hashCode());
        int attackerPrestige = attacker.getPrestigePoint();

        LoggerUtil.log(ExtensionLogLevel.INFO, "PvpBattleService: Finding opponent for attacker ID: " + attackerId + " with prestige: " + attackerPrestige);

        MatchmakingPool pool = MatchmakingPool.getInstance();
        MatchmakingInfo opponentInfo = pool.findOpponent(attackerId, attackerPrestige, null);

        if (opponentInfo != null) {
            LoggerUtil.log(ExtensionLogLevel.INFO, "PvpBattleService: Found opponent: " + opponentInfo.getPlayerId() + " (" + opponentInfo.getUsername() + ") with prestige: " + opponentInfo.getPrestige());
            // IMPORTANT: We now need to load the full PlayerInfo for the opponent
            // This is the one database call we still need to make in this process.
            PlayerInfo defenderInfo = PlayerInfo.getModelFromDatabase(opponentInfo.getUsername());
            if (defenderInfo != null) {
                return defenderInfo.getPlayer();
            }
            LoggerUtil.log(ExtensionLogLevel.ERROR, "PvpBattleService: Found opponent " + opponentInfo.getUsername() + " in pool, but could not load their PlayerInfo from database.");
        }

        LoggerUtil.log(ExtensionLogLevel.WARN, "PvpBattleService: No suitable opponent found for attacker ID: " + attackerId);
        return null; // No opponent found
    }

    public PVPBattleResult processBattleResult(User user, RequestPVPBattleResult request) {
        LoggerUtil.log(ExtensionLogLevel.INFO, "Processing battle result for user: " + user.getName() + ", won: " + request.getWon());

        try {
            PlayerInfo attackerInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (attackerInfo == null || attackerInfo.getPlayer() == null) {
                return PVPBattleResult.serviceFailure("Attacker Info not found");
            }

            PlayerInfo defenderInfo = PlayerInfo.getModelFromDatabase(request.getDefenderName());
            if (defenderInfo == null || defenderInfo.getPlayer() == null) {
                return PVPBattleResult.serviceFailure("Defender Info not found");
            }

            Player attacker = attackerInfo.getPlayer();
            Player defender = defenderInfo.getPlayer();

            int oldAttackerPrestige = attacker.getPrestigePoint();
            int oldDefenderPrestige = defender.getPrestigePoint();

            // Prestige calculation
            int eloChange = calculateEloChange(oldAttackerPrestige, oldDefenderPrestige, request.getWon());
            int newAttackerPrestige = oldAttackerPrestige + eloChange;
            int newDefenderPrestige = oldDefenderPrestige - eloChange; // Assuming symmetrical change

            attacker.setPrestigePoint(newAttackerPrestige);
            defender.setPrestigePoint(newDefenderPrestige);

            // Update resources, army, etc. (existing logic)
            attacker.getResources().setGold(attacker.getResources().getGold() + request.getLootedGold());
            attacker.getResources().setOil(attacker.getResources().getOil() + request.getLootedElixir());
            defender.getResources().setGold(Math.max(0, defender.getResources().getGold() - request.getLootedGold()));
            defender.getResources().setOil(Math.max(0, defender.getResources().getOil() - request.getLootedElixir()));

            attackerInfo.saveModel(user.getName());
            defenderInfo.saveModel(request.getDefenderName());
            LoggerUtil.log(ExtensionLogLevel.INFO, "Saved attacker and defender models to database.");

            // Update the in-memory matchmaking pool
            MatchmakingPool pool = MatchmakingPool.getInstance();
            pool.updatePlayerPrestige(Math.abs(user.getName().hashCode()), user.getName(), oldAttackerPrestige, newAttackerPrestige, 0L); // Attacker's lastAttackedTime is not relevant here
            pool.updatePlayerPrestige(Math.abs(request.getDefenderName().hashCode()), request.getDefenderName(), oldDefenderPrestige, newDefenderPrestige, System.currentTimeMillis()); // Defender's lastAttackedTime is updated
            LoggerUtil.log(ExtensionLogLevel.INFO, "Updated in-memory matchmaking pool for both players.");

            return PVPBattleResult.success(request.getWon(), request.getLootedGold(), request.getLootedElixir());

        } catch (Exception e) {
            LoggerUtil.log(ExtensionLogLevel.ERROR, "Error processing battle result for user: " + user.getName() + ": " + e.getMessage(), e);
            return PVPBattleResult.serviceFailure(e.getMessage());
        }
    }

    private int calculateEloChange(int attackerElo, int defenderElo, boolean isWon) {
        // Simplified ELO logic
        if (isWon) {
            return (attackerElo > defenderElo) ? 5 : 10;
        } else {
            return (attackerElo > defenderElo) ? -10 : -5;
        }
    }
}