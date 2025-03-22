export var IncuriaErrorType;
(function (IncuriaErrorType) {
    IncuriaErrorType[IncuriaErrorType["INVALID_FILE"] = 0] = "INVALID_FILE";
    IncuriaErrorType[IncuriaErrorType["FORMAT_NOT_SUPPORTED"] = 1] = "FORMAT_NOT_SUPPORTED";
    IncuriaErrorType[IncuriaErrorType["DEVELOPERS_FAULT"] = 2] = "DEVELOPERS_FAULT";
})(IncuriaErrorType || (IncuriaErrorType = {}));
export class IncuriaError extends Error {
    constructor(type, message) {
        super(message);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.type = type;
    }
}
