package model.result;

public class BattleResult {
    private boolean success;
    private String errorMessage;
    private int stars;
    private int lootedGold;
    private int lootedElixir;

    private BattleResult(boolean success, String errorMessage, int stars, int lootedGold, int lootedElixir) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.stars = stars;
        this.lootedGold = lootedGold;
        this.lootedElixir = lootedElixir;
    }

    public static BattleResult success(int stars, int lootedGold, int lootedElixir) {
        return new BattleResult(true, null, stars, lootedGold, lootedElixir);
    }

    public static BattleResult serviceFailure(String errorMessage) {
        return new BattleResult(false, errorMessage, 0, 0, 0);
    }

    public boolean isSuccess() {
        return success;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public int getStars() {
        return stars;
    }

    public int getLootedGold() {
        return lootedGold;
    }

    public int getLootedElixir() {
        return lootedElixir;
    }
}