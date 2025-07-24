package config.adapters;

import com.google.gson.*;
import config.data.ObstacleData;
import config.data.Size;

import java.lang.reflect.Type;

public class ObstacleDataAdapter implements JsonDeserializer<ObstacleData> {
    @Override
    public ObstacleData deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        JsonObject jsonObject = json.getAsJsonObject();
        ObstacleData data = new ObstacleData();

        // Set core data
        if (jsonObject.has("buildTime")) {
            data.setBuildTime(jsonObject.get("buildTime").getAsInt());
        }
        if (jsonObject.has("elixir")) {
            if(jsonObject.get("elixir").getAsInt() == 0){
                data.setResourceRequired(config.data.ResourceType.GOLD);
                data.setRemoveCost(jsonObject.get("gold").getAsInt());
            } else {
                data.setResourceRequired(config.data.ResourceType.OIL);
                data.setRemoveCost(jsonObject.get("elixir").getAsInt());
            }
        }
        // Set size from width and height
        if (jsonObject.has("width") && jsonObject.has("height")) {
            Size size = new Size();
            size.setWidth(jsonObject.get("width").getAsInt());
            size.setHeight(jsonObject.get("height").getAsInt());
            data.setSize(size);
        }
        if (jsonObject.has("type")) {
            data.setType(jsonObject.get("type").getAsString());
        }
        if (jsonObject.has("posX")) {
            data.setPosX(jsonObject.get("posX").getAsInt());
        }
        if (jsonObject.has("posY")) {
            data.setPosY(jsonObject.get("posY").getAsInt());
        }

        return data;
    }
}