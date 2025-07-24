package config.data;

/**
 * POJO for troop data configuration
 */
public class TroopData {
    private int attackType;
    private float attackRadius;
    private int attackArea;
    private int housingSpace;
    private int trainingTime;
    private int timeDiscountPercent;
    private int timeDiscountStart;
    private int timeDiscountEnd;
    private int moveSpeed;
    private float attackSpeed;
    private int barracksLevelRequired;
    private float attackRange;
    private int dmgScale;
    private String favoriteTarget;
    private float deathDamageRadius;
    private int cost;

    /**
     * Default constructor
     */
    public TroopData() {
        this.attackType = 0;
        this.attackRadius = 0.0f;
        this.attackArea = 0;
        this.housingSpace = 0;
        this.trainingTime = 0;
        this.timeDiscountPercent = 0;
        this.timeDiscountStart = 0;
        this.timeDiscountEnd = 0;
        this.moveSpeed = 0;
        this.attackSpeed = 0;
        this.barracksLevelRequired = 0;
        this.attackRange = 0.0f;
        this.dmgScale = 0;
        this.favoriteTarget = "";
        this.deathDamageRadius = 0.0f;
        this.cost = 0;
    }

    /**
     * Constructor with all fields
     */
    public TroopData(int attackType, float attackRadius, int attackArea, int housingSpace, int trainingTime,
            int timeDiscountPercent, int timeDiscountStart, int timeDiscountEnd, int moveSpeed, int attackSpeed,
            int barracksLevelRequired, float attackRange, int dmgScale, String favoriteTarget,
            float deathDamageRadius, int cost) {
        this.attackType = attackType;
        this.attackRadius = attackRadius;
        this.attackArea = attackArea;
        this.housingSpace = housingSpace;
        this.trainingTime = trainingTime;
        this.timeDiscountPercent = timeDiscountPercent;
        this.timeDiscountStart = timeDiscountStart;
        this.timeDiscountEnd = timeDiscountEnd;
        this.moveSpeed = moveSpeed;
        this.attackSpeed = attackSpeed;
        this.barracksLevelRequired = barracksLevelRequired;
        this.attackRange = attackRange;
        this.dmgScale = dmgScale;
        this.favoriteTarget = favoriteTarget;
        this.deathDamageRadius = deathDamageRadius;
        this.cost = cost;
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

    public int getTimeDiscountStart() {
        return timeDiscountStart;
    }

    public void setTimeDiscountStart(int timeDiscountStart) {
        this.timeDiscountStart = timeDiscountStart;
    }

    public int getTimeDiscountEnd() {
        return timeDiscountEnd;
    }

    public void setTimeDiscountEnd(int timeDiscountEnd) {
        this.timeDiscountEnd = timeDiscountEnd;
    }

    public int getMoveSpeed() {
        return moveSpeed;
    }

    public void setMoveSpeed(int moveSpeed) {
        this.moveSpeed = moveSpeed;
    }

    public float getAttackSpeed() {
        return attackSpeed;
    }

    public void setAttackSpeed(int attackSpeed) {
        this.attackSpeed = attackSpeed;
    }

    public int getBarracksLevelRequired() {
        return barracksLevelRequired;
    }

    public void setBarracksLevelRequired(int barracksLevelRequired) {
        this.barracksLevelRequired = barracksLevelRequired;
    }

    public float getAttackRange() {
        return attackRange;
    }

    public void setAttackRange(float attackRange) {
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

    public float getDeathDamageRadius() {
        return deathDamageRadius;
    }

    public void setDeathDamageRadius(float deathDamageRadius) {
        this.deathDamageRadius = deathDamageRadius;
    }

    public int getCost() {
        return cost;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }

    @Override
    public String toString() {
        return "TroopData{" +
                "attackType=" + attackType +
                ", attackRadius=" + attackRadius +
                ", attackArea=" + attackArea +
                ", housingSpace=" + housingSpace +
                ", trainingTime=" + trainingTime +
                ", moveSpeed=" + moveSpeed +
                ", attackSpeed=" + attackSpeed +
                ", barracksLevelRequired=" + barracksLevelRequired +
                ", attackRange=" + attackRange +
                ", favoriteTarget='" + favoriteTarget + '\'' +
                ", cost=" + cost +
                '}';
    }
}