package config.data;

/**
 * POJO for defensive building data configuration
 */
public class DefensiveBuildingData {
    private int baseHitPoints;
    private Size size;
    private int range;
    private int damagePerSecond;
    private int damagePerShot;
    private float attackSpeed;
    private String attackType;
    private int townHallLevelRequired;
    private ResourceType resourceRequired;
    private int buildingCost;
    private int buildTime;

    /**
     * Default constructor
     */
    public DefensiveBuildingData() {
        this.baseHitPoints = 0;
        this.size = new Size();
        this.range = 0;
        this.damagePerSecond = 0;
        this.damagePerShot = 0;
        this.attackSpeed = 0;
        this.attackType = "";
        this.townHallLevelRequired = 0;
        this.resourceRequired = ResourceType.NONE;
        this.buildingCost = 0;
        this.buildTime = 0;
    }

    /**
     * Constructor with all fields
     */
    public DefensiveBuildingData(int baseHitPoints, Size size, int range, int damagePerSecond,
            int damagePerShot, int attackSpeed, String attackType,
            int townHallLevelRequired, ResourceType resourceRequired,
            int buildingCost, int buildTime) {
        this.baseHitPoints = baseHitPoints;
        this.size = size;
        this.range = range;
        this.damagePerSecond = damagePerSecond;
        this.damagePerShot = damagePerShot;
        this.attackSpeed = attackSpeed;
        this.attackType = attackType;
        this.townHallLevelRequired = townHallLevelRequired;
        this.resourceRequired = resourceRequired;
        this.buildingCost = buildingCost;
        this.buildTime = buildTime;
    }

    public int getBaseHitPoints() {
        return baseHitPoints;
    }

    public void setBaseHitPoints(int baseHitPoints) {
        this.baseHitPoints = baseHitPoints;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public int getRange() {
        return range;
    }

    public void setRange(int range) {
        this.range = range;
    }

    public int getDamagePerSecond() {
        return damagePerSecond;
    }

    public void setDamagePerSecond(int damagePerSecond) {
        this.damagePerSecond = damagePerSecond;
    }

    public int getDamagePerShot() {
        return damagePerShot;
    }

    public void setDamagePerShot(int damagePerShot) {
        this.damagePerShot = damagePerShot;
    }

    public float getAttackSpeed() {
        return attackSpeed;
    }

    public void setAttackSpeed(int attackSpeed) {
        this.attackSpeed = attackSpeed;
    }

    public String getAttackType() {
        return attackType;
    }

    public void setAttackType(String attackType) {
        this.attackType = attackType;
    }

    public int getTownHallLevelRequired() {
        return townHallLevelRequired;
    }

    public void setTownHallLevelRequired(int townHallLevelRequired) {
        this.townHallLevelRequired = townHallLevelRequired;
    }

    public ResourceType getResourceRequired() {
        return resourceRequired;
    }

    public void setResourceRequired(ResourceType resourceRequired) {
        this.resourceRequired = resourceRequired;
    }

    public int getBuildingCost() {
        return buildingCost;
    }

    public void setBuildingCost(int buildingCost) {
        this.buildingCost = buildingCost;
    }

    public int getBuildTime() {
        return buildTime;
    }

    public void setBuildTime(int buildTime) {
        this.buildTime = buildTime;
    }

    @Override
    public String toString() {
        return "DefensiveBuildingData{" +
                "baseHitPoints=" + baseHitPoints +
                ", size=" + size +
                ", range=" + range +
                ", damagePerSecond=" + damagePerSecond +
                ", damagePerShot=" + damagePerShot +
                ", attackSpeed=" + attackSpeed +
                ", attackType='" + attackType + '\'' +
                ", townHallLevelRequired=" + townHallLevelRequired +
                ", resourceRequired=" + resourceRequired +
                ", buildingCost=" + buildingCost +
                ", buildTime=" + buildTime +
                '}';
    }
}