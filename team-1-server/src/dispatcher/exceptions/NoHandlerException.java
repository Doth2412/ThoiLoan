package dispatcher.exceptions;

/**
 * Thrown when no handler is found for a command
 */
public class NoHandlerException extends RuntimeException {
    public NoHandlerException(String commandId) {
        super("No handler registered for command: " + commandId);
    }
}