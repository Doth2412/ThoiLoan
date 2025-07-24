
var BezierUtils = {
    /**
     * Calculates a point on a 2D quadratic Bézier curve.
     * @param {number} t - The interpolation parameter, from 0 to 1.
     * @param {cc.Point} p0 - The start point.
     * @param {cc.Point} p1 - The control point (defines the peak of the arc).
     * @param {cc.Point} p2 - The end point.
     * @returns {cc.Point} The calculated point on the curve.
     */
    getQuadraticBezierPoint: function(t, p0, p1, p2) {
        var u = 1 - t;
        var tt = t * t;
        var uu = u * u;

        var p = cc.p(0, 0);
        p.x = uu * p0.x + 2 * u * t * p1.x + tt * p2.x;
        p.y = uu * p0.y + 2 * u * t * p1.y + tt * p2.y;

        return p;
    }
};
