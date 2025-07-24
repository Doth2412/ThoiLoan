package dispatcher;

import java.util.Map;
import java.util.HashMap;

public class Event {
    private final String eventType;
    private final Map<String, Object> data;

    public Event(String eventType, Map<String, Object> data) {
        this.eventType = eventType;
        this.data = data != null ? data : new HashMap<>();
    }

    public String getEventType() {
        return eventType;
    }

    public Map<String, Object> getData() {
        return data;
    }
}