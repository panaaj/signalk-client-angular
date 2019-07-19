/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*
 * UUID: A js library to generate and parse UUIDs, TimeUUIDs and generate
 * TimeUUID based on dates for range selections.
 * @see http://www.ietf.org/rfc/rfc4122.txt
 **/
export class UUID {
    constructor() {
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
    toString() { return this.hex; }
    /**
     * @return {?}
     */
    toURN() { return 'urn:uuid:' + this.hex; }
    /**
     * @return {?}
     */
    toSignalK() { return `urn:mrn:signalk:uuid:${this.hex}`; }
    /**
     * @return {?}
     */
    toBytes() {
        /** @type {?} */
        let parts = this.hex.split('-');
        /** @type {?} */
        let ints = [];
        /** @type {?} */
        let intPos = 0;
        for (let i = 0; i < parts.length; i++) {
            for (let j = 0; j < parts[i].length; j += 2) {
                ints[intPos++] = parseInt(parts[i].substr(j, 2), 16);
            }
        }
        return ints;
    }
    ;
    /**
     * @private
     * @param {?} bits
     * @return {?}
     */
    maxFromBits(bits) { return Math.pow(2, bits); }
    ;
    /**
     * @private
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    /**
     * @private
     * @return {?}
     */
    randomUI04() { return this.getRandomInt(0, this.limitUI04 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI06() { return this.getRandomInt(0, this.limitUI06 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI08() { return this.getRandomInt(0, this.limitUI08 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI12() { return this.getRandomInt(0, this.limitUI12 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI14() { return this.getRandomInt(0, this.limitUI14 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI16() { return this.getRandomInt(0, this.limitUI16 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI32() { return this.getRandomInt(0, this.limitUI32 - 1); }
    /**
     * @private
     * @return {?}
     */
    randomUI40() { return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 40 - 30)) * (1 << 30); }
    /**
     * @private
     * @return {?}
     */
    randomUI48() { return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 48 - 30)) * (1 << 30); }
    /**
     * @private
     * @return {?}
     */
    create() {
        this.fromParts(this.randomUI32(), this.randomUI16(), 0x4000 | this.randomUI12(), 0x80 | this.randomUI06(), this.randomUI08(), this.randomUI48());
    }
    ;
    /**
     * @private
     * @param {?} string
     * @param {?} length
     * @param {?=} z
     * @return {?}
     */
    paddedString(string, length, z = null) {
        string = String(string);
        z = (!z) ? '0' : z;
        /** @type {?} */
        let i = length - string.length;
        for (; i > 0; i >>>= 1, z += z) {
            if (i & 1) {
                string = z + string;
            }
        }
        return string;
    }
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
    fromParts(timeLow, timeMid, timeHiAndVersion, clockSeqHiAndReserved, clockSeqLow, node) {
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
    }
    ;
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXVpZC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3NpZ25hbGstY2xpZW50LWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvdXVpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFLQSxNQUFNLE9BQU8sSUFBSTtJQWViO1FBQ0ksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2xCLENBQUM7Ozs7SUFFRCxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFBLENBQUMsQ0FBQzs7OztJQUM5QixLQUFLLEtBQUssT0FBTyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQSxDQUFDLENBQUM7Ozs7SUFDekMsU0FBUyxLQUFhLE9BQU8sd0JBQXdCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQSxDQUFDLENBQUM7Ozs7SUFDakUsT0FBTzs7WUFDQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDOztZQUMzQixJQUFJLEdBQUcsRUFBRTs7WUFDVCxNQUFNLEdBQUcsQ0FBQztRQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNwRDtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUFBLENBQUM7Ozs7OztJQUVNLFdBQVcsQ0FBQyxJQUFJLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFBQSxDQUFDOzs7Ozs7O0lBRS9DLFlBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBLENBQUMsQ0FBQzs7Ozs7SUFFbkYsVUFBVSxLQUFLLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUM7Ozs7O0lBQzlELFVBQVUsS0FBSyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDOzs7OztJQUM5RCxVQUFVLEtBQUssT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFDLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQzs7Ozs7SUFDOUQsVUFBVSxLQUFLLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUM7Ozs7O0lBQzlELFVBQVUsS0FBSyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDOzs7OztJQUM5RCxVQUFVLEtBQUssT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFDLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQzs7Ozs7SUFDOUQsVUFBVSxLQUFLLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUM7Ozs7O0lBQzlELFVBQVUsS0FBSyxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQSxDQUFDLENBQUM7Ozs7O0lBQzFHLFVBQVUsS0FBSyxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUks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cmFyeSB0byBnZW5lcmF0ZSBhbmQgcGFyc2UgVVVJRHMsIFRpbWVVVUlEcyBhbmQgZ2VuZXJhdGVcclxuICogVGltZVVVSUQgYmFzZWQgb24gZGF0ZXMgZm9yIHJhbmdlIHNlbGVjdGlvbnMuXHJcbiAqIEBzZWUgaHR0cDovL3d3dy5pZXRmLm9yZy9yZmMvcmZjNDEyMi50eHRcclxuICoqL1xyXG5leHBvcnQgY2xhc3MgVVVJRCB7XHJcblxyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMDQ7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkwNjtcclxuICAgIHByaXZhdGUgbGltaXRVSTA4O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMTI7XHJcbiAgICBwcml2YXRlIGxpbWl0VUkxNDtcclxuICAgIHByaXZhdGUgbGltaXRVSTE2O1xyXG4gICAgcHJpdmF0ZSBsaW1pdFVJMzI7XHJcbiAgICBwcml2YXRlIGxpbWl0VUk0MDtcclxuICAgIHByaXZhdGUgbGltaXRVSTQ4O1xyXG5cclxuICAgIHByaXZhdGUgdmVyc2lvbjpudW1iZXI7XHJcbiAgICBwcml2YXRlIGhleDpzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMDQgPSB0aGlzLm1heEZyb21CaXRzKDQpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTA2ID0gdGhpcy5tYXhGcm9tQml0cyg2KTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkwOCA9IHRoaXMubWF4RnJvbUJpdHMoOCk7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMTIgPSB0aGlzLm1heEZyb21CaXRzKDEyKTtcclxuICAgICAgICB0aGlzLmxpbWl0VUkxNCA9IHRoaXMubWF4RnJvbUJpdHMoMTQpO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTE2ID0gdGhpcy5tYXhGcm9tQml0cygxNik7XHJcbiAgICAgICAgdGhpcy5saW1pdFVJMzIgPSB0aGlzLm1heEZyb21CaXRzKDMyKTtcclxuICAgICAgICB0aGlzLmxpbWl0VUk0MCA9IHRoaXMubWF4RnJvbUJpdHMoNDApO1xyXG4gICAgICAgIHRoaXMubGltaXRVSTQ4ID0gdGhpcy5tYXhGcm9tQml0cyg0OCk7IFxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCkgeyByZXR1cm4gdGhpcy5oZXggfVxyXG4gICAgdG9VUk4oKSB7IHJldHVybiAndXJuOnV1aWQ6JyArIHRoaXMuaGV4IH1cclxuICAgIHRvU2lnbmFsSygpOnN0cmluZyAgeyByZXR1cm4gYHVybjptcm46c2lnbmFsazp1dWlkOiR7dGhpcy5oZXh9YCB9XHJcbiAgICB0b0J5dGVzKCkge1xyXG4gICAgICAgIGxldCBwYXJ0cyA9IHRoaXMuaGV4LnNwbGl0KCctJyk7XHJcbiAgICAgICAgbGV0IGludHMgPSBbXTtcclxuICAgICAgICBsZXQgaW50UG9zID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcGFydHNbaV0ubGVuZ3RoOyBqKz0yKSB7XHJcbiAgICAgICAgICAgIGludHNbaW50UG9zKytdID0gcGFyc2VJbnQocGFydHNbaV0uc3Vic3RyKGosIDIpLCAxNik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGludHM7XHJcbiAgICB9OyAgICBcclxuXHJcbiAgICBwcml2YXRlIG1heEZyb21CaXRzKGJpdHMpIHsgcmV0dXJuIE1hdGgucG93KDIsIGJpdHMpIH07XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRSYW5kb21JbnQobWluLCBtYXgpIHsgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW4gfVxyXG5cclxuICAgIHByaXZhdGUgcmFuZG9tVUkwNCgpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTA0LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkwNigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTA2LTEpO31cclxuICAgIHByaXZhdGUgcmFuZG9tVUkwOCgpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTA4LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkxMigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTEyLTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkxNCgpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTE0LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkxNigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTE2LTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUkzMigpIHsgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tSW50KDAsIHRoaXMubGltaXRVSTMyLTEpIH1cclxuICAgIHByaXZhdGUgcmFuZG9tVUk0MCgpIHsgcmV0dXJuICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDMwKSkgKyAoMCB8IE1hdGgucmFuZG9tKCkgKiAoMSA8PCA0MCAtIDMwKSkgKiAoMSA8PCAzMCkgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21VSTQ4KCkgeyByZXR1cm4gKDAgfCBNYXRoLnJhbmRvbSgpICogKDEgPDwgMzApKSArICgwIHwgTWF0aC5yYW5kb20oKSAqICgxIDw8IDQ4IC0gMzApKSAqICgxIDw8IDMwKSB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5mcm9tUGFydHMoXHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tVUkzMigpLFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJMTYoKSxcclxuICAgICAgICAgICAgMHg0MDAwIHwgdGhpcy5yYW5kb21VSTEyKCksXHJcbiAgICAgICAgICAgIDB4ODAgICB8IHRoaXMucmFuZG9tVUkwNigpLFxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbVVJMDgoKSxcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21VSTQ4KClcclxuICAgICAgICApO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIHBhZGRlZFN0cmluZyhzdHJpbmcsIGxlbmd0aCwgej1udWxsKSB7XHJcbiAgICAgICAgc3RyaW5nID0gU3RyaW5nKHN0cmluZyk7XHJcbiAgICAgICAgeiA9ICgheikgPyAnMCcgOiB6O1xyXG4gICAgICAgIGxldCBpID0gbGVuZ3RoIC0gc3RyaW5nLmxlbmd0aDtcclxuICAgICAgICBmb3IgKDsgaSA+IDA7IGkgPj4+PSAxLCB6ICs9IHopIHtcclxuICAgICAgICAgICAgaWYgKGkgJiAxKSB7XHJcbiAgICAgICAgICAgIHN0cmluZyA9IHogKyBzdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0cmluZztcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBmcm9tUGFydHModGltZUxvdywgdGltZU1pZCwgdGltZUhpQW5kVmVyc2lvbiwgY2xvY2tTZXFIaUFuZFJlc2VydmVkLCBjbG9ja1NlcUxvdywgbm9kZSkge1xyXG4gICAgICAgIHRoaXMudmVyc2lvbiA9ICh0aW1lSGlBbmRWZXJzaW9uID4+IDEyKSAmIDB4RjtcclxuICAgICAgICB0aGlzLmhleCA9IHRoaXMucGFkZGVkU3RyaW5nKHRpbWVMb3cudG9TdHJpbmcoMTYpLCA4KVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKHRpbWVNaWQudG9TdHJpbmcoMTYpLCA0KVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKHRpbWVIaUFuZFZlcnNpb24udG9TdHJpbmcoMTYpLCA0KVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKGNsb2NrU2VxSGlBbmRSZXNlcnZlZC50b1N0cmluZygxNiksIDIpXHJcbiAgICAgICAgICAgICsgdGhpcy5wYWRkZWRTdHJpbmcoY2xvY2tTZXFMb3cudG9TdHJpbmcoMTYpLCAyKVxyXG4gICAgICAgICAgICArICctJ1xyXG4gICAgICAgICAgICArIHRoaXMucGFkZGVkU3RyaW5nKG5vZGUudG9TdHJpbmcoMTYpLCAxMik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9OyAgICBcclxuXHJcbn07Il19