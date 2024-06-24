
class SystemError extends Error {
    code: string;

    /**
     * Creates a custom error that has a message and code for toast alerts
     * @param message the string describing the error
     * @param code the short form error message (e.g., `ENDORSEMENT_FAILED`)
     */
    constructor(message: string, code: string) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, SystemError.prototype);
    }
}

export default SystemError;
