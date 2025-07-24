<!-- filepath: c:\GDF\team-1-server\src\dispatcher\readme.md -->

## Dispatcher Flow Overview

The following outlines the basic flow of how client requests are handled by the server's dispatcher system:

1.  **Packet Reception:**

    - The client application sends a data packet to the server.
    - The underlying BitZero server framework is responsible for the initial network communication and receiving this packet.

2.  **Initial Routing (Extension Level):**

    - The received packet, typically encapsulated as a `DataCmd` object, is often first processed by a `BZExtension` (BitZero Extension), for example, `FresherExtension`.
    - This extension might perform preliminary checks or delegate handling based on the command type. For instance, `doLogin` requests within `FresherExtension` are passed on to the `CentralDispatcher`.

3.  **Central Dispatching (`CentralDispatcher`):**

    - The `CentralDispatcher` acts as a singleton and is the core component for routing both client requests and internal server events.
    - **Client Requests:**
      - The `handleClientRequest(DataCmd dataCmd, User user)` method is invoked.
      - It extracts a command identifier (`cmdId`) from the `DataCmd` object.
      - `CentralDispatcher` maintains an internal mapping (e.g., a `ConcurrentHashMap`) of these `cmdId`s to specific `RequestHandler` implementations. It uses this map to look up the appropriate handler for the incoming `cmdId`.
    - **Server Events:**
      - The `handleServerEvent(IBZEvent event)` method is used for server-generated events.
      - It maintains a similar map of event types to `EventHandler` implementations and dispatches events accordingly.

4.  **Sub-Handler Processing (`RequestHandler`):**

    - Once the `CentralDispatcher` identifies the correct `RequestHandler` (e.g., `AuthHandler`, `ShopHandler`, `MapHandler` based on the `cmdId`), it calls the handler's `handleRequest(DataCmd dataCmd, User user)` method.
    - This dedicated sub-handler is then responsible for the specific logic associated with that client command. This typically involves:
      - **Unpacking Data:** The handler needs to extract the relevant data from the `DataCmd`. While a generic `bitZero's unpackData()` was mentioned, it's common for specific request objects (e.g., `RequestLogin`) to encapsulate this by parsing the `DataCmd` within their constructors or dedicated unpacking methods.
      - **Processing Logic:** The handler executes the core business logic related to the client's request (e.g., authenticating a user, fetching shop data, updating map state).

5.  **Sending Response:**
    - After processing the request, the handler is responsible for sending a response back to the client.
    - This is usually accomplished by using utility methods provided by the BitZero framework, often found in classes like `ExtensionUtility` (e.g., `ExtensionUtility.instance().send(...)` or more specialized methods like `sendLoginResponse`).
    - The response data is packaged, frequently into another `DataCmd` object or a custom-defined response object, before being transmitted over the client's session.

### Key Components Involved:

- **`CentralDispatcher.java`**: The central routing mechanism for requests and events.
- **`RequestHandler.java` (interface)**: Defines the contract for classes that handle specific client command IDs.
  - _Implementations_: `AuthHandler.java`, `ShopHandler.java`, `MapHandler.java`, etc., each containing logic for a group of related commands.
- **`EventHandler.java` (interface)**: Defines the contract for classes that handle specific server-side events.
- **`DataCmd` (BitZero class)**: Represents the data packet received from the client and is also commonly used for packaging data to be sent back to the client.
- **`User` / `ISession` (BitZero classes)**: Represent the connected client's session and associated user information on the server.
- **`FresherExtension.java`**: An example of a `BZExtension` that can perform initial handling or delegation of requests.

This flow ensures a structured way to manage different types of client requests and server events, directing them to the appropriate modules for processing.
