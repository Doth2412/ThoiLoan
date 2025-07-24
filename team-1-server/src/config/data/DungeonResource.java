package config.data;

/**
 * Data class for resources in dungeon map
 */
public class DungeonResource {
    private int gold;
    private int elixir;

    public DungeonResource() {
    }

    public int getGold() {
        return gold;
    }

    public void setGold(int gold) {
        this.gold = gold;
    }

    public int getElixir() {
        return elixir;
    }

    public void setElixir(int elixir) {
        this.elixir = elixir;
    }
}