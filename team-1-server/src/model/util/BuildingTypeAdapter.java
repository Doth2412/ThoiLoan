package model.util;

import com.google.gson.*;
import model.building.Building;
import java.lang.reflect.Type;

/**
 * A robust, all-in-one TypeAdapter for the polymorphic Building class.
 * This adapter handles both serialization (saving) and deserialization (loading)
 * for Building and all of its subclasses (Barrack, TownHall, etc.),
 * ensuring all data is preserved correctly.
 */
public class BuildingTypeAdapter implements JsonSerializer<Building>, JsonDeserializer<Building> {

    private static final String TYPE_FIELD = "className"; // Use a unique field name to avoid conflicts

    @Override
    public JsonElement serialize(Building src, Type typeOfSrc, JsonSerializationContext context) {
        // First, serialize the actual object (e.g., Barrack, TownHall) to get all its fields.
        // Using context.serialize with the object's specific class is the key to not losing data.
        JsonElement jsonElement = context.serialize(src, src.getClass());
        JsonObject jsonObject = jsonElement.getAsJsonObject();

        // Now, add a property to the JSON that stores the object's full class name.
        // The deserializer will use this property to know which class to create.
        jsonObject.addProperty(TYPE_FIELD, src.getClass().getName());

        return jsonObject;
    }

    @Override
    public Building deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        JsonObject jsonObject = json.getAsJsonObject();

        // Check if our custom type field exists.
        JsonPrimitive typePrimitive = (JsonPrimitive) jsonObject.get(TYPE_FIELD);
        if (typePrimitive == null) {
            // Fallback for old data that might use a 'type' field from a getter.
            typePrimitive = (JsonPrimitive) jsonObject.get("type");
            if (typePrimitive == null) {
                throw new JsonParseException("Could not find type field for Building object: " + json);
            }
        }

        String className = typePrimitive.getAsString();

        try {
            // Use the class name from the JSON to tell the context which specific
            // class (e.g., model.building.Barrack) to deserialize this object into.
            return context.deserialize(jsonObject, Class.forName(className));
        } catch (ClassNotFoundException e) {
            throw new JsonParseException("Unknown element type: " + className, e);
        }
    }
}
