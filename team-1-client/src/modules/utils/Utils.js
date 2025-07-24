var Utils = {
    formatTime: function (seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        let finalString = ""
        if (h !== 0) finalString = finalString + h + "h";
        if (m !== 0) finalString = finalString + m + "m";
        if (s !== 0) finalString = finalString + s + "s";
        return finalString;
    },

    getGemCostForTimeFinish: function (remainingSeconds) {
        return Math.ceil(remainingSeconds / 120);
    },

    getGemCostForGoldFinish: function (missingGoldAmount) {
        return Math.ceil(missingGoldAmount / 300);
    },

    getGemCostForOilFinish: function (missingOilAmount) {
        return Math.ceil(missingOilAmount / 250);
    },

    getGoldForGemCost: function (gemCost) {
        return gemCost * 300;
    },

    getOilForGemCost: function (gemCost) {
        return gemCost * 250;
    },

    /**
     * Calculates the 8-way direction from a current point to a next point.
     * @param {cc.Point} currentPoint - The starting point.
     * @param {cc.Point} nextPoint - The destination point.
     * @returns {string} Direction string ("N", "NE", "E", "SE", "S", "SW", "W", "NW"). Returns "S" if points are identical.
     */
    calculateDirection: function (currentPoint, nextPoint) {
        if (cc.pSameAs(currentPoint, nextPoint)) {
            return "S"; // Default direction if no movement
        }
        let deltaX = nextPoint.x - currentPoint.x;
        let deltaY = nextPoint.y - currentPoint.y;
        let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        if (angle >= -22.5 && angle < 22.5) return "E";
        if (angle >= 22.5 && angle < 67.5) return "NE";
        if (angle >= 67.5 && angle < 112.5) return "N";
        if (angle >= 112.5 && angle < 157.5) return "NW";
        if (angle >= 157.5 || angle < -157.5) return "W";
        if (angle >= -157.5 && angle < -112.5) return "SW";
        if (angle >= -112.5 && angle < -67.5) return "S";
        if (angle >= -67.5 && angle < -22.5) return "SE";
        return "S";
    }
}