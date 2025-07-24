
package config.adapters;

import com.google.gson.*;
import config.data.BuilderHutData;
import config.data.ResourceType;
import config.data.Size;

import java.lang.reflect.Type;

public class BuilderHutDataAdapter implements JsonDeserializer<BuilderHutData> {
    @Override
    public BuilderHutData deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        JsonObject jsonObject = json.getAsJsonObject();
        BuilderHutData data = new BuilderHutData();

        if (jsonObject.has("hitpoints")) {
            data.setBaseHitPoints(jsonObject.get("hitpoints").getAsInt());
        }

        if (jsonObject.has("coin")) {
            data.setResourceRequired(ResourceType.GEMS);
            data.setBuildingCost(jsonObject.get("coin").getAsInt());
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