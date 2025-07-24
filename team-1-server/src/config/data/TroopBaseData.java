package config.data;

/**
 * Data class for troop base configuration
 */
public class TroopBaseData {
    private int attackType;
    private float attackRadius;
    private int attackArea;
    private int housingSpace;
    private int trainingTime;
    private int timeDiscountPercent;
    private long timeDiscountStart;
    private long timeDiscountEnd;
    private int moveSpeed;
    private double attackSpeed;
    private int barracksLevelRequired;
    private double attackRange;
    private int dmgScale;
    private String favoriteTarget;
    private double deathDamageRadius;
    private int cost;

    public TroopBaseData() {
    }

    public int getAttackType() {
        return attackType;
    }

    public void setAttackType(int attackType) {
        this.attackType = attackType;
    }

    public float getAttackRadius() {
        return attackRadius;
    }

    public void setAttackRadius(float attackRadius) {
        this.attackRadius = attackRadius;
    }

    public int getAttackArea() {
        return attackArea;
    }

    public void setAttackArea(int attackArea) {
        this.attackArea = attackArea;
    }

    public int getHousingSpace() {
        return housingSpace;
    }

    public void setHousingSpace(int housingSpace) {
        this.housingSpace = housingSpace;
    }

    public int getTrainingTime() {
        return trainingTime;
    }

    public void setTrainingTime(int trainingTime) {
        this.trainingTime = trainingTime;
    }

    public int getTimeDiscountPercent() {
        return timeDiscountPercent;
    }

    public void setTimeDiscountPercent(int timeDiscountPercent) {
        this.timeDiscountPercent = timeDiscountPercent;
    }

    public long getTimeDiscountStart() {
        return timeDiscountStart;
    }

    public void setTimeDiscountStart(long timeDiscountStart) {
        this.timeDiscountStart = timeDiscountStart;
    }

    public long getTimeDiscountEnd() {
        return timeDiscountEnd;
    }

    public void setTimeDiscountEnd(long timeDiscountEnd) {
        this.timeDiscountEnd = timeDiscountEnd;
    }

    public int getMoveSpeed() {
        return moveSpeed;
    }

    public void setMoveSpeed(int moveSpeed) {
        this.moveSpeed = moveSpeed;
    }

    public double getAttackSpeed() {
        return attackSpeed;
    }

    public void setAttackSpeed(double attackSpeed) {
        this.attackSpeed = attackSpeed;
    }

    public int getBarracksLevelRequired() {
        return barracksLevelRequired;
    }

    public void setBarracksLevelRequired(int barracksLevelRequired) {
        this.barracksLevelRequired = barracksLevelRequired;
    }

    public double getAttackRange() {
        return attackRange;
    }

    public void setAttackRange(double attackRange) {
        this.attackRange = attackRange;
    }

    public int getDmgScale() {
        return dmgScale;
    }

    public void setDmgScale(int dmgScale) {
        this.dmgScale = dmgScale;
    }

    public String getFavoriteTarget() {
        return favoriteTarget;
    }

    public void setFavoriteTarget(String favoriteTarget) {
        this.favoriteTarget = favoriteTarget;
    }

    public double getDeathDamageRadius() {
        return deathDamageRadius;
    }

    public void setDeathDamageRadius(double deathDamageRadius) {
        this.deathDamageRadius = deathDamageRadius;
    }

    public int getCost() {
        return cost;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }
}