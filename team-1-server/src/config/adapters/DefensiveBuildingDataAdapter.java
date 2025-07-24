
package config.adapters;

import com.google.gson.*;
import config.data.DefensiveBuildingData;
import config.data.ResourceType;
import config.data.Size;

import java.lang.reflect.Type;

public class DefensiveBuildingDataAdapter implements JsonDeserializer<DefensiveBuildingData> {
    @Override
    public DefensiveBuildingData deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        JsonObject jsonObject = json.getAsJsonObject();
        DefensiveBuildingData data = new DefensiveBuildingData();

        if (jsonObject.has("hitpoints")) {
            data.setBaseHitPoints(jsonObject.get("hitpoints").getAsInt());
        }
        if (jsonObject.has("damagePerSecond")) {
            data.setDamagePerSecond(jsonObject.get("damagePerSecond").getAsInt());
        }
        if (jsonObject.has("damagePerShot")) {
            data.setDamagePerShot(jsonObject.get("damagePerShot").getAsInt());
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