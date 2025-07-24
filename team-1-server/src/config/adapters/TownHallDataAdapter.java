package config.adapters;

import com.google.gson.*;
import config.data.ResourceGeneratorData;
import config.data.ResourceType;
import config.data.Size;
import config.data.TownHallData;

import java.lang.reflect.Type;

public class TownHallDataAdapter implements JsonDeserializer<TownHallData> {
    @Override
    public TownHallData deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        JsonObject jsonObject = json.getAsJsonObject();
        TownHallData data = new TownHallData();

        // Set size from width and height
        if (jsonObject.has("width") && jsonObject.has("height")) {
            Size size = new Size();
            size.setWidth(jsonObject.get("width").getAsInt());
            size.setHeight(jsonObject.get("height").getAsInt());
            data.setSize(size);
        }

        if (jsonObject.has("hitpoints")) {
            data.setBaseHitPoints(jsonObject.get("hitpoints").getAsInt());
        }
        if (jsonObject.has("capacityGold")) {
            data.setBaseGoldCapacity(jsonObject.get("capacityGold").getAsInt());
        }
        if (jsonObject.has("capacityElixir")) {
            data.setBaseOilCapacity(jsonObject.get("capacityElixir").getAsInt());
        }

        if (jsonObject.has("resourceRequired")) {
            String resourceStr = jsonObject.get("resourceRequired").getAsString().toUpperCase();
            try {
                data.setResourceRequired(ResourceType.valueOf(resourceStr));
            } catch (IllegalArgumentException e) {
                data.setResourceRequired(ResourceType.NONE);
            }
        }
        if (jsonObject.has("buildTime")) {
            data.setBuildTime(jsonObject.get("buildTime").getAsInt());
        }

        if (jsonObject.has("gold")) {
            data.setBuildingCost(jsonObject.get("gold").getAsInt());
        }
        return data;
    }
}

