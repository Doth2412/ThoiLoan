// filepath: src\config\adapters\BarrackDataAdapter.java
package config.adapters;

import com.google.gson.*;
import config.data.BarrackData;
import config.data.Size;

import java.lang.reflect.Type;

public class BarrackDataAdapter implements JsonDeserializer<BarrackData> {
    @Override
    public BarrackData deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        JsonObject jsonObject = json.getAsJsonObject();
        BarrackData data = new BarrackData();

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
        if (jsonObject.has("hitpoints")) {
            data.setBaseHitPoints(jsonObject.get("hitpoints").getAsInt());
        }
        if (jsonObject.has("queueLength")) {
            data.setQueueLength(jsonObject.get("queueLength").getAsInt());
        }
        if (jsonObject.has("townHallLevelRequired")) {
            data.setTownHallLevelRequired(jsonObject.get("townHallLevelRequired").getAsInt());
        }
        if (jsonObject.has("unlockedUnit")) {
            data.setUnlockedUnit(jsonObject.get("unlockedUnit").getAsString());
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