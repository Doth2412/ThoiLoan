/**
 * Storage.js
 * Class for buildings that primarily function to store resources (e.g., Gold Storage, Oil Storage).
 * Extends the base Building class.
 */
var Storage = Building.extend({
    resourceType: null, // "gold" or "oil"
    capacity: 0,

    /**
     * Constructor for Storage building.
     * @param {Object} buildingData - Data to initialize the building, including type, level, position, etc.
     *                                This data is passed from BuildingsManager.
     */
    ctor: function(buildingData) {
        this._super(buildingData); 

        var config = ItemConfigUtils.getBuildingConfig(this, this.level);

        if (config) {
            this.resourceType = config.resourceType || null;
            this.capacity = config.capacity || 0;

            if (!this.resourceType) {
                cc.warn("Storage.js: Storage building " + this.buildingType + " (Level: " + this.level + ") is missing 'resourceType' in its configuration.");
            }
            if (typeof this.capacity !== 'number' || this.capacity < 0) {
                cc.warn("Storage.js: Storage building " + this.buildingType + " (Level: " + this.level + ") has invalid or missing 'capacity' in its configuration. Found: " + config.capacity);
                this.capacity = 0;
            }
        } else {
            cc.error("Storage.js: Storage building " + this.buildingType + " (Level: " + this.level + ") could not load its configuration.");

            this.resourceType = null;
            this.capacity = 0;
        }

        cc.log("Storage.js: Storage building initialized: " + this.buildingType +
               " (Level: " + this.level +
               ") - Stores: " + (this.resourceType || "NONE") +
               ", Capacity: " + this.capacity);
    },


    getCapacity: function() {
        return this.capacity;
    },

    getResourceType: function() {
        return this.resourceType;
    }

});
