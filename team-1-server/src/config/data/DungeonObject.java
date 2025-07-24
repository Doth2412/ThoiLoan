package config.data;

/**
 * Data class for objects in dungeon map
 */
public class DungeonObject {
    private int gold;
    private int level;
    private String objType;
    private int objId;
    private int cell;
    private int darkElixir;
    private int elixir;

    public DungeonObject() {
    }

    public int getGold() {
        return gold;
    }

    public void setGold(int gold) {
        this.gold = gold;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getObjType() {
        return objType;
    }

    public void setObjType(String objType) {
        this.objType = objType;
    }

    public int getObjId() {
        return objId;
    }

    public void setObjId(int objId) {
        this.objId = objId;
    }

    public int getCell() {
        return cell;
    }

    public void setCell(int cell) {
        this.cell = cell;
    }

    public int getDarkElixir() {
        return darkElixir;
    }

    public void setDarkElixir(int darkElixir) {
        this.darkElixir = darkElixir;
    }

    public int getElixir() {
        return elixir;
    }

    public void setElixir(int elixir) {
        this.elixir = elixir;
    }
}