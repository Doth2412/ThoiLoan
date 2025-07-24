package config.data;

import java.util.ArrayList;
import java.util.List;

/**
 * Configuration holder for resource data
 */
public class ResourceConfig {
    private List<ResourceData> allResourceData;
    private int defaultGold;
    private int defaultOil;

    /**
     * Default constructor
     */
    public ResourceConfig() {
        this.allResourceData = new ArrayList<>();
        this.defaultGold = 0;
        this.defaultOil = 0;
    }

    /**
     * Constructor with all fields
     */
    public ResourceConfig(List<ResourceData> allResourceData, int defaultGold, int defaultOil) {
        this.allResourceData = allResourceData;
        this.defaultGold = defaultGold;
        this.defaultOil = defaultOil;
    }

    public List<ResourceData> getAllResourceData() {
        return allResourceData;
    }

    public void setAllResourceData(List<ResourceData> allResourceData) {
        this.allResourceData = allResourceData;
    }

    public int getDefaultGold() {
        return defaultGold;
    }

    public void setDefaultGold(int defaultGold) {
        this.defaultGold = defaultGold;
    }

    public int getDefaultOil() {
        return defaultOil;
    }

    public void setDefaultOil(int defaultOil) {
        this.defaultOil = defaultOil;
    }

    @Override
    public String toString() {
        return "ResourceConfig{" +
                "allResourceData=" + allResourceData +
                ", defaultGold=" + defaultGold +
                ", defaultOil=" + defaultOil +
                '}';
    }

    // Example inner class for resource data
    public static class ResourceData {
        private String type;
        private int initialAmount;
        private int maxAmount;

        public ResourceData(String type, int initialAmount, int maxAmount) {
            this.type = type;
            this.initialAmount = initialAmount;
            this.maxAmount = maxAmount;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public int getInitialAmount() {
            return initialAmount;
        }

        public void setInitialAmount(int initialAmount) {
            this.initialAmount = initialAmount;
        }

        public int getMaxAmount() {
            return maxAmount;
        }

        public void setMaxAmount(int maxAmount) {
            this.maxAmount = maxAmount;
        }

        @Override
        public String toString() {
            return "ResourceData{" +
                    "type='" + type + '\'' +
                    ", initialAmount=" + initialAmount +
                    ", maxAmount=" + maxAmount +
                    '}';
        }
    }
}