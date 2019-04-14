/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*
 * UUID: A js library to generate and parse UUIDs, TimeUUIDs and generate
 * TimeUUID based on dates for range selections.
 * @see http://www.ietf.org/rfc/rfc4122.txt
 **/
var /*
 * UUID: A js library to generate and parse UUIDs, TimeUUIDs and generate
 * TimeUUID based on dates for range selections.
 * @see http://www.ietf.org/rfc/rfc4122.txt
 **/
UUID = /** @class */ (function () {
    function UUID() {
        this.limitUI04 = this.maxFromBits(4);
        this.limitUI06 = this.maxFromBits(6);
        this.limitUI08 = this.maxFromBits(8);
        this.limitUI12 = this.maxFromBits(12);
        this.limitUI14 = this.maxFromBits(14);
        this.limitUI16 = this.maxFromBits(16);
        this.limitUI32 = this.maxFromBits(32);
        this.limitUI40 = this.maxFromBits(40);
        this.limitUI48 = this.maxFromBits(48);
        this.create();
    }
    /**
     * @return {?}
     */
    UUID.prototype.toString = /**
     * @return {?}
     */
    function () { return this.hex; };
    /**
     * @return {?}
     */
    UUID.prototype.toURN = /**
     * @return {?}
     */
    function () { return 'urn:uuid:' + this.hex; };
    /**
     * @return {?}
     */
    UUID.prototype.toSignalK = /**
     * @return {?}
     */
    function () { return "urn:mrn:signalk:uuid:" + this.hex; };
    /**
     * @return {?}
     */
    UUID.prototype.toBytes = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var parts = this.hex.split('-');
        /** @type {?} */
        var ints = [];
        /** @type {?} */
        var intPos = 0;
        for (var i = 0; i < parts.length; i++) {
            for (var j = 0; j < parts[i].length; j += 2) {
                ints[intPos++] = parseInt(parts[i].substr(j, 2), 16);
            }
        }
        return ints;
    };
    ;
    /**
     * @private
     * @param {?} bits
     * @return {?}
     */
    UUID.prototype.maxFromBits = /**
     * @private
     * @param {?} bits
     * @return {?}
     */
    function (bits) { return Math.pow(2, bits); };
    ;
    /**
     * @private
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    UUID.prototype.getRandomInt = /**
     * @private
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };
    /**
     * @private
     * @return {?}
     */
    UUID.prototype.randomUI04 = /**
     * @private
     * @return {?}
     */
    function () { return this.getRandomInt(0, this.limitUI04 - 1); };
    /**
     * @private
     * @return {?}
     */
    UUID.prototype.randomUI06 = /**
     * @private
     * @return {?}
     */
    function () { return this.getRandomInt(0, this.limitUI06 - 1); };
    /**
     * @private
     * @return {?}
     */
    UUID.prototype.randomUI08 = /**
     * @private
     * @return {?}
     */
    function () { return this.getRandomInt(0, this.limitUI08 - 1); };
    /**
     * @private
     * @return {?}
     */
    UUID.prototype.randomUI12 = /**
     * @private
     * @return {?}
     */
    function () { return this.getRandomInt(0, this.limitUI12 - 1); };
    /**
     * @private
     * @return {?}
     */
    UUID.prototype.randomUI14 = /**
     * @private
     * @return {?}
     */
    function () { return this.getRandomInt(0, this.limitUI14 - 1); };
    /**
     * @private
     * @return {?}
     */
    UUID.prototype.randomUI16 = /**
     * @private
     * @return {?}
     */
    function () { return this.getRandomInt(0, this.limitUI16 - 1); };
    /**
     * @private
     * @return {?}
     */
    UUID.prototype.randomUI32 = /**
     * @private
     * @return {?}
     */
    function () { return this.getRandomInt(0, this.limitUI32 - 1); };
    /**
     * @private
     * @return {?}
     */
    UUID.prototype.randomUI40 = /**
     * @private
     * @return {?}
     */
    function () { return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 40 - 30)) * (1 << 30); };
    /**
     * @private
     * @return {?}
     */
    UUID.prototype.randomUI48 = /**
     * @private
     * @return {?}
     */
    function () { return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 48 - 30)) * (1 << 30); };
    /**
     * @private
     * @return {?}
     */
    UUID.prototype.create = /**
     * @private
     * @return {?}
     */
    function () {
        this.fromParts(this.randomUI32(), this.randomUI16(), 0x4000 | this.randomUI12(), 0x80 | this.randomUI06(), this.randomUI08(), this.randomUI48());
    };
    ;
    /**
     * @private
     * @param {?} string
     * @param {?} length
     * @param {?=} z
     * @return {?}
     */
    UUID.prototype.paddedString = /**
     * @private
     * @param {?} string
     * @param {?} length
     * @param {?=} z
     * @return {?}
     */
    function (string, length, z) {
        if (z === void 0) { z = null; }
        string = String(string);
        z = (!z) ? '0' : z;
        /** @type {?} */
        var i = length - string.length;
        for (; i > 0; i >>>= 1, z += z) {
            if (i & 1) {
                string = z + string;
            }
        }
        return string;
    };
    ;
    /**
     * @private
     * @template THIS
     * @this {THIS}
     * @param {?} timeLow
     * @param {?} timeMid
     * @param {?} timeHiAndVersion
     * @param {?} clockSeqHiAndReserved
     * @param {?} clockSeqLow
     * @param {?} node
     * @return {THIS}
     */
    UUID.prototype.fromParts = /**
     * @private
     * @template THIS
     * @this {THIS}
     * @param {?} timeLow
     * @param {?} timeMid
     * @param {?} timeHiAndVersion
     * @param {?} clockSeqHiAndReserved
     * @param {?} clockSeqLow
     * @param {?} node
     * @return {THIS}
     */
    function (timeLow, timeMid, timeHiAndVersion, clockSeqHiAndReserved, clockSeqLow, node) {
        (/** @type {?} */ (this)).version = (timeHiAndVersion >> 12) & 0xF;
        (/** @type {?} */ (this)).hex = (/** @type {?} */ (this)).paddedString(timeLow.toString(16), 8)
            + '-'
            + (/** @type {?} */ (this)).paddedString(timeMid.toString(16), 4)
            + '-'
            + (/** @type {?} */ (this)).paddedString(timeHiAndVersion.toString(16), 4)
            + '-'
            + (/** @type {?} */ (this)).paddedString(clockSeqHiAndReserved.toString(16), 2)
            + (/** @type {?} */ (this)).paddedString(clockSeqLow.toString(16), 2)
            + '-'
            + (/** @type {?} */ (this)).paddedString(node.toString(16), 12);
        return (/** @type {?} */ (this));
    };
    ;
    return UUID;
}());
/*
 * UUID: A js library to generate and parse UUIDs, TimeUUIDs and generate
 * TimeUUID based on dates for range selections.
 * @see http://www.ietf.org/rfc/rfc4122.txt
 **/
export { UUID };
if (false) {
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI04;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI06;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI08;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI12;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI14;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI16;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI32;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI40;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.limitUI48;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.version;
    /**
     * @type {?}
     * @private
     */
    UUID.prototype.hex;
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
    /* Skipping unhandled member: ;*/
}
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXVpZC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvdXVpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFLQTs7Ozs7O0lBZUk7UUFDSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEIsQ0FBQzs7OztJQUVELHVCQUFROzs7SUFBUixjQUFhLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQSxDQUFDLENBQUM7Ozs7SUFDOUIsb0JBQUs7OztJQUFMLGNBQVUsT0FBTyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQSxDQUFDLENBQUM7Ozs7SUFDekMsd0JBQVM7OztJQUFULGNBQXNCLE9BQU8sMEJBQXdCLElBQUksQ0FBQyxHQUFLLENBQUEsQ0FBQyxDQUFDOzs7O0lBQ2pFLHNCQUFPOzs7SUFBUDs7WUFDUSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDOztZQUMzQixJQUFJLEdBQUcsRUFBRTs7WUFDVCxNQUFNLEdBQUcsQ0FBQztRQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNwRDtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUFBLENBQUM7Ozs7OztJQUVNLDBCQUFXOzs7OztJQUFuQixVQUFvQixJQUFJLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFBQSxDQUFDOzs7Ozs7O0lBRS9DLDJCQUFZOzs7Ozs7SUFBcEIsVUFBcUIsR0FBRyxFQUFFLEdBQUcsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQSxDQUFDLENBQUM7Ozs7O0lBRW5GLHlCQUFVOzs7O0lBQWxCLGNBQXVCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUM7Ozs7O0lBQzlELHlCQUFVOzs7O0lBQWxCLGNBQXVCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLENBQUM7Ozs7O0lBQzlELHlCQUFVOzs7O0lBQWxCLGNBQXVCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUM7Ozs7O0lBQzlELHlCQUFVOzs7O0lBQWxCLGNBQXVCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUM7Ozs7O0lBQzlELHlCQUFVOzs7O0lBQWxCLGNBQXVCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUM7Ozs7O0lBQzlELHlCQUFVOzs7O0lBQWxCLGNBQXVCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUM7Ozs7O0lBQzlELHlCQUFVOzs7O0lBQWxCLGNBQXVCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUM7Ozs7O0lBQzlELHlCQUFVOzs7O0lBQWxCLGNBQXVCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFB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OztJQUNsQix5QkFBa0I7Ozs7O0lBQ2xCLHlCQUFrQjs7Ozs7SUFDbEIseUJBQWtCOzs7OztJQUNsQix5QkFBa0I7Ozs7O0lBQ2xCLHlCQUFrQjs7Ozs7SUFDbEIseUJBQWtCOzs7OztJQUNsQix5QkFBa0I7Ozs7O0lBQ2xCLHlCQUFrQjs7Ozs7SUFFbEIsdUJBQXVCOzs7OztJQUN2QixtQkFBbUI7Ozs7Ozs7QUE4SnRCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBVVUlEOiBBIGpzIGxpYnJhcnkgdG8gZ2VuZXJhdGUgYW5kIHBhcnNlIFVVSURzLCBUaW1lVVVJRHMgYW5kIGdlbmVyYXRlXHJcbiAqIFRpbWVVVUlEIGJhc2VkIG9uIGRhdGVzIGZvciByYW5nZSBzZWxlY3Rpb25zLlxyXG4gKiBAc2VlIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQxMjIudHh0XHJcbiAqKi9cclxuZXhwb3J0IGNsYXNzIFVVSUQge1xyXG5cclxuICAgIHByaXZhdGUgbGltaXRVSTA0O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMDY7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkwODtcclxuICAgIHByaXZhdGUgbGltaXRVSTEyO1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMTQ7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkxNjtcclxuICAgIHByaXZhdGUgbGltaXRVSTMyO1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJNDA7XHJcbiAgICBwcml2YXRlIGxpbWl0VUk0ODtcclxuXHJcbiAgICBwcml2YXRlIHZlcnNpb246bnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBoZXg6c3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubGltaXRVSTA0ID0gdGhpcy5tYXhGcm9tQml0cyg0KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkwNiA9IHRoaXMubWF4RnJvbUJpdHMoNik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMDggPSB0aGlzLm1heEZyb21CaXRzKDgpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTEyID0gdGhpcy5tYXhGcm9tQml0cygxMik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMTQgPSB0aGlzLm1heEZyb21CaXRzKDE0KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkxNiA9IHRoaXMubWF4RnJvbUJpdHMoMTYpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTMyID0gdGhpcy5tYXhGcm9tQml0cygzMik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJNDAgPSB0aGlzLm1heEZyb21CaXRzKDQwKTtcclxuICAgICAgICB0aGlzLmxpbWl0VUk0OCA9IHRoaXMubWF4RnJvbUJpdHMoNDgpOyBcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpIHsgcmV0dXJuIHRoaXMuaGV4IH1cclxuICAgIHRvVVJOKCkgeyByZXR1cm4gJ3Vybjp1dWlkOicgKyB0aGlzLmhleCB9XHJcbiAgICB0b1NpZ25hbEsoKTpzdHJpbmcgIHsgcmV0dXJuIGB1cm46bXJuOnNpZ25hbGs6dXVpZDoke3RoaXMuaGV4fWAgfVxyXG4gICAgdG9CeXRlcygpIHtcclxuICAgICAgICBsZXQgcGFydHMgPSB0aGlzLmhleC5zcGxpdCgnLScpO1xyXG4gICAgICAgIGxldCBpbnRzID0gW107XHJcbiAgICAgICAgbGV0IGludFBvcyA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnRzW2ldLmxlbmd0aDsgais9Mikge1xyXG4gICAgICAgICAgICBpbnRzW2ludFBvcysrXSA9IHBhcnNlSW50KHBhcnRzW2ldLnN1YnN0cihqLCAyKSwgMTYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnRzO1xyXG4gICAgfTsgICAgXHJcblxyXG4gICAgcHJpdmF0ZSBtYXhGcm9tQml0cyhiaXRzKSB7IHJldHVybiBNYXRoLnBvdygyLCBiaXRzKSB9O1xyXG5cclxuICAgIHByaXZhdGUgZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7IHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluIH1cclxuXHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMDQoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkwNC0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMDYoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkwNi0xKTt9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMDgoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkwOC0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMTIoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkxMi0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMTQoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkxNC0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMTYoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkxNi0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJMzIoKSB7IHJldHVybiB0aGlzLmdldFJhbmRvbUludCgwLCB0aGlzLmxpbWl0VUkzMi0xKSB9XHJcbiAgICBwcml2YXRlIHJhbmRvbVVJNDAoKSB7IHJldHVybiAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCAzMCkpICsgKDAgfCBNYXRoLnJhbmRvbSgpICogKDEgPDwgNDAgLSAzMCkpICogKDEgPDwgMzApIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUk0OCgpIHsgcmV0dXJuICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDMwKSkgKyAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCA0OCAtIDMwKSkgKiAoMSA8PCAzMCkgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlKCkge1xyXG4gICAgICAgIHRoaXMuZnJvbVBhcnRzKFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJMzIoKSxcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTE2KCksXHJcbiAgICAgICAgICAgIDB4NDAwMCB8IHRoaXMucmFuZG9tVUkxMigpLFxyXG4gICAgICAgICAgICAweDgwICAgfCB0aGlzLnJhbmRvbVVJMDYoKSxcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTA4KCksXHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tVUk0OCgpXHJcbiAgICAgICAgKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBwYWRkZWRTdHJpbmcoc3RyaW5nLCBsZW5ndGgsIHo9bnVsbCkge1xyXG4gICAgICAgIHN0cmluZyA9IFN0cmluZyhzdHJpbmcpO1xyXG4gICAgICAgIHogPSAoIXopID8gJzAnIDogejtcclxuICAgICAgICBsZXQgaSA9IGxlbmd0aCAtIHN0cmluZy5sZW5ndGg7XHJcbiAgICAgICAgZm9yICg7IGkgPiAwOyBpID4+Pj0gMSwgeiArPSB6KSB7XHJcbiAgICAgICAgICAgIGlmIChpICYgMSkge1xyXG4gICAgICAgICAgICBzdHJpbmcgPSB6ICsgc3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHJpbmc7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgZnJvbVBhcnRzKHRpbWVMb3csIHRpbWVNaWQsIHRpbWVIaUFuZFZlcnNpb24sIGNsb2NrU2VxSGlBbmRSZXNlcnZlZCwgY2xvY2tTZXFMb3csIG5vZGUpIHtcclxuICAgICAgICB0aGlzLnZlcnNpb24gPSAodGltZUhpQW5kVmVyc2lvbiA+PiAxMikgJiAweEY7XHJcbiAgICAgICAgdGhpcy5oZXggPSB0aGlzLnBhZGRlZFN0cmluZyh0aW1lTG93LnRvU3RyaW5nKDE2KSwgOClcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyh0aW1lTWlkLnRvU3RyaW5nKDE2KSwgNClcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyh0aW1lSGlBbmRWZXJzaW9uLnRvU3RyaW5nKDE2KSwgNClcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyhjbG9ja1NlcUhpQW5kUmVzZXJ2ZWQudG9TdHJpbmcoMTYpLCAyKVxyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKGNsb2NrU2VxTG93LnRvU3RyaW5nKDE2KSwgMilcclxuICAgICAgICAgICAgKyAnLSdcclxuICAgICAgICAgICAgKyB0aGlzLnBhZGRlZFN0cmluZyhub2RlLnRvU3RyaW5nKDE2KSwgMTIpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTsgICAgXHJcbiAgICBcclxuICAgIC8qXHJcbiAgICBwcml2YXRlIGdldFRpbWVGaWVsZFZhbHVlcyh0aW1lKSB7XHJcbiAgICAgICAgbGV0IHRzID0gdGltZSAtIERhdGUuVVRDKDE1ODIsIDksIDE1KTtcclxuICAgICAgICBsZXQgaG0gPSAoKHRzIC8gMHgxMDAwMDAwMDApICogMTAwMDApICYgMHhGRkZGRkZGO1xyXG4gICAgICAgIHJldHVybiB7IGxvdzogKCh0cyAmIDB4RkZGRkZGRikgKiAxMDAwMCkgJSAweDEwMDAwMDAwMCxcclxuICAgICAgICAgICAgICAgIG1pZDogaG0gJiAweEZGRkYsIGhpOiBobSA+Pj4gMTYsIHRpbWVzdGFtcDogdHMgfTtcclxuICAgIH07XHJcblxyXG4gICAgZnJvbVRpbWUodGltZSwgbGFzdDpib29sZWFuKSB7XHJcbiAgICAgICAgbGFzdCA9ICghbGFzdCkgPyBmYWxzZSA6IGxhc3Q7XHJcbiAgICAgICAgbGV0IHRmID0gdGhpcy5nZXRUaW1lRmllbGRWYWx1ZXModGltZSk7XHJcbiAgICAgICAgbGV0IHRsID0gdGYubG93O1xyXG4gICAgICAgIGxldCB0aGF2ID0gKHRmLmhpICYgMHhGRkYpIHwgMHgxMDAwOyAgLy8gc2V0IHZlcnNpb24gJzAwMDEnXHJcbiAgICAgICAgaWYgKGxhc3QgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVVVJRCgpLmZyb21QYXJ0cyh0bCwgdGYubWlkLCB0aGF2LCAwLCAwLCAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFVVSUQoKS5mcm9tUGFydHModGwsIHRmLm1pZCwgdGhhdiwgMHg4MCB8IHRoaXMubGltaXRVSTA2LCB0aGlzLmxpbWl0VUkwOCAtIDEsIHRoaXMubGltaXRVSTQ4IC0gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmaXJzdEZyb21UaW1lKHRpbWUpIHsgcmV0dXJuIHRoaXMuZnJvbVRpbWUodGltZSwgZmFsc2UpIH1cclxuICAgIGxhc3RGcm9tVGltZSh0aW1lKSB7IHJldHVybiB0aGlzLmZyb21UaW1lKHRpbWUsIHRydWUpIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBlcXVhbHModXVpZCkge1xyXG4gICAgICAgIGlmICghKHV1aWQgaW5zdGFuY2VvZiBVVUlEKSkgeyByZXR1cm4gZmFsc2UgfVxyXG4gICAgICAgIGlmICh0aGlzLmhleCAhPT0gdXVpZC5oZXgpIHsgcmV0dXJuIGZhbHNlIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgZnJvbVVSTihzdHJJZCkge1xyXG4gICAgICAgIGxldCByO1xyXG4gICAgICAgIGxldCBwID0gL14oPzp1cm46dXVpZDp8XFx7KT8oWzAtOWEtZl17OH0pLShbMC05YS1mXXs0fSktKFswLTlhLWZdezR9KS0oWzAtOWEtZl17Mn0pKFswLTlhLWZdezJ9KS0oWzAtOWEtZl17MTJ9KSg/OlxcfSk/JC9pO1xyXG4gICAgICAgIGlmICgociA9IHAuZXhlYyhzdHJJZCkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZyb21QYXJ0cyhcclxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHJbMV0sIDE2KSwgcGFyc2VJbnQoclsyXSwgMTYpLFxyXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoclszXSwgMTYpLCBwYXJzZUludChyWzRdLCAxNiksXHJcbiAgICAgICAgICAgICAgICBwYXJzZUludChyWzVdLCAxNiksIHBhcnNlSW50KHJbNl0sIDE2KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBmcm9tQnl0ZXMoaW50cykge1xyXG4gICAgICAgIGlmIChpbnRzLmxlbmd0aCA8IDUpIHsgcmV0dXJuIG51bGwgfVxyXG4gICAgICAgIGxldCBzdHIgPSAnJztcclxuICAgICAgICBsZXQgcG9zID0gMDtcclxuICAgICAgICBsZXQgcGFydHMgPSBbNCwgMiwgMiwgMiwgNl07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnRzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IG9jdGV0ID0gaW50c1twb3MrK10udG9TdHJpbmcoMTYpO1xyXG4gICAgICAgICAgICBpZiAob2N0ZXQubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgIG9jdGV0ID0gJzAnICsgb2N0ZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RyICs9IG9jdGV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwYXJ0c1tpXSAhPT0gNikge1xyXG4gICAgICAgICAgICBzdHIgKz0gJy0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmZyb21VUk4oc3RyKTtcclxuICAgIH07XHJcblxyXG4gICAgZnJvbUJpbmFyeShiaW5hcnkpIHtcclxuICAgICAgICBsZXQgaW50cyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGludHNbaV0gPSBiaW5hcnkuY2hhckNvZGVBdChpKTtcclxuICAgICAgICAgICAgaWYgKGludHNbaV0gPiAyNTUgfHwgaW50c1tpXSA8IDApIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIGJ5dGUgaW4gYmluYXJ5IGRhdGEuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbUJ5dGVzKGludHMpO1xyXG4gICAgfTtcclxuICAgICovXHJcblxyXG59OyJdfQ==