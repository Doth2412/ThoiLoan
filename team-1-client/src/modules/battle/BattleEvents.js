/**
 * BattleEvents.js: Defines constants for custom event names used in the battle system.
 * This helps prevent typos and centralizes event management.
 */
const BattleEvents = {
    // Fired when a defensive building or a troop attacks, requesting a bullet to be created.
    FIRE_BULLET: "EVENT_FIRE_BULLET",

    // Fired when a building is destroyed.
    BUILDING_DESTROYED: "EVENT_BUILDING_DESTROYED",

    // Fired when a troop's attack deals damage, used for calculating looted resources.
    ATTACK_DEALT: "EVENT_RESOURCE_GAINED",

    // Fired when the total number of stars won changes.
    STARS_UPDATED: "EVENT_STARS_UPDATED",

    // Fired when the total looted resources are updated.
    LOOT_UPDATED: "EVENT_LOOT_UPDATED",

    // Fired when a battle ends and GUIBattleOptions needs to be updated.
    BATTLE_ENDED_UPDATE_GUI: "EVENT_BATTLE_ENDED_UPDATE_GUI",

    // Fired when a battle is found and the GUI needs to be updated.
    FIND_BATTLE_RESPONSE: "EVENT_FIND_BATTLE_RESPONSE"
};

