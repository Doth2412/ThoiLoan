package model.result;

public class PVPBattleResult {
    private boolean success;
    private String errorMessage;
    private boolean isWon;
    private int lootedGold;
    private int lootedElixir;

    private PVPBattleResult(boolean success, String errorMessage, boolean isWon, int lootedGold, int lootedElixir) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.isWon = isWon;
        this.lootedGold = lootedGold;
        this.lootedElixir = lootedElixir;
    }

    public static PVPBattleResult success(boolean isWons, int lootedGold, int lootedElixir) {
        return new PVPBattleResult(true, null, isWons, lootedGold, lootedElixir);
    }

    public static PVPBattleResult serviceFailure(String errorMessage) {
        return new PVPBattleResult(false, errorMessage, false, 0, 0);
    }

    public boolean isSuccess() {
        return success;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public boolean getWon() {
        return isWon;
    }

    public int getLootedGold() {
        return lootedGold;
    }

    public int getLootedElixir() {
        return lootedElixir;
    }
}