package config.adapters;

import com.google.gson.*;
import config.data.ResourceGeneratorData;
import config.data.ResourceType;
import config.data.Size;

import java.lang.reflect.Type;

public class ResourceGeneratorDataAdapter implements JsonDeserializer<ResourceGeneratorData> {
    @Override
    public ResourceGeneratorData deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        JsonObject jsonObject = json.getAsJsonObject();
        ResourceGeneratorData data = new ResourceGeneratorData();

        if (jsonObject.has("type")) {
            String typeStr = jsonObject.get("type").getAsString().toUpperCase();
            // Map the string type to ResourceType enum
            switch (typeStr) {
                case "GOLD":
                    data.setResourceGenerate(ResourceType.GOLD);
                    break;
                case "OIL":
                case "ELIXIR": // Handle both cases since they mean the same thing
                    data.setResourceGenerate(ResourceType.OIL);
                    break;
                case "GEMS":
                    data.setResourceGenerate(ResourceType.GEMS);
                    break;
                default:
                    data.setResourceGenerate(ResourceType.NONE);
            }
        }

        // Set core data
        if (jsonObject.has("hitpoints")) {
            data.setBaseHitPoints(jsonObject.get("hitpoints").getAsInt());
        }
        if (jsonObject.has("productivity")) {
            data.setProductivity(jsonObject.get("productivity").getAsInt());
        }
        if (jsonObject.has("capacity")) {
            data.setBaseCapacity(jsonObject.get("capacity").getAsInt());
        }
        if (jsonObject.has("buildTime")) {
            data.setBuildTime(jsonObject.get("buildTime").getAsInt());
        }
        if (jsonObject.has("elixir")) {
            if(jsonObject.get("elixir").getAsInt() == 0){
                data.setResourceRequired(config.data.ResourceType.GOLD);
                data.setBuildingCost(jsonObject.get("gold").getAsInt());
            } else {
                data.setResourceRequired(config.data.ResourceType.OIL);
                data.setBuildingCost(jsonObject.get("elixir").getAsInt());
            }
        }
        if (jsonObject.has("townHallLevelRequired")) {
            data.setTownHallLevelRequired(jsonObject.get("townHallLevelRequired").getAsInt());
        }

        // Set size from width and height
        if (jsonObject.has("width") && jsonObject.has("height")) {
            Size size = new Size();
            size.setWidth(jsonObject.get("width").getAsInt());
            size.setHeight(jsonObject.get("height").getAsInt());
            data.setSize(size);
        }

        return data;
    }
}
