package model.util;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import model.building.*;
import java.lang.reflect.Type;

/**
 * Custom Gson deserializer for Building polymorphism
 * Handles deserializing different building types based on the "type" field
 */
public class BuildingDeserializer implements JsonDeserializer<Building> {

    @Override
    public Building deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {

        JsonObject jsonObject = json.getAsJsonObject();
        String type = jsonObject.get("type").getAsString();

        switch (type) {
            case "ResourceGenerator":
                return context.deserialize(json, ResourceGenerator.class);
            case "ResourceStorage":
                return context.deserialize(json, ResourceStorage.class);
            case "TownHall":
                return context.deserialize(json, TownHall.class);
            case "DefensiveBuilding":
                return context.deserialize(json, DefensiveBuilding.class);
            case "ArmyCamp":
                return context.deserialize(json, ArmyCamp.class);
            case "Barrack":
                return context.deserialize(json, Barrack.class);
            case "BuilderHut":
                return context.deserialize(json, BuilderHut.class);
            default:
                throw new JsonParseException("Unknown building type: " + type);
        }
    }
}
