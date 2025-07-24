
package config.adapters;

import com.google.gson.*;
import config.data.ArmyCampData;
import config.data.Size;

import java.lang.reflect.Type;

public class ArmyCampDataAdapter implements JsonDeserializer<ArmyCampData> {
    @Override
    public ArmyCampData deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        JsonObject jsonObject = json.getAsJsonObject();
        ArmyCampData data = new ArmyCampData();

        if (jsonObject.has("hitpoints")) {
            data.setBaseHitPoints(jsonObject.get("hitpoints").getAsInt());
        }
        if (jsonObject.has("capacity")) {
            data.setHousingCapacity(jsonObject.get("capacity").getAsInt());
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