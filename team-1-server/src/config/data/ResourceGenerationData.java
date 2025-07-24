package config.data;

/**
 * Placeholder POJO for resource generation data
 */
public class ResourceGenerationData {
    private String name;

    public ResourceGenerationData() {
        this.name = "";
    }

    public ResourceGenerationData(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "ResourceGenerationData{" +
                "name='" + name + '\'' +
                '}';
    }
}