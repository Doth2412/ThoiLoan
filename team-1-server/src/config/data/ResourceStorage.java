package config.data;

/**
 * Placeholder POJO for resource storage
 */
public class ResourceStorage {
    private String id;

    public ResourceStorage() {
        this.id = "";
    }

    public ResourceStorage(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "ResourceStorage{" +
                "id='" + id + '\'' +
                '}';
    }
}