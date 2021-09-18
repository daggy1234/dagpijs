/**
 * Base Dagpijs Error
 * @constructor
 * @param {string} message: error message
 * @param {string} message: name of the error
 * @param {number} status: HTTP status code
 */

import { RatelimitInfo } from "./models";

/**
 * Base Dagpi Error
 */
class DagpijsError extends Error {

    /** HTTP status code */
    public status: number;

    /** name of the error */
    public name: string;

    /**
     * A base dagpi error
     * @param {string} message error message
     * @param {string} name    error name
     * @param {number} status  error status
     */
    public constructor (message: string, name: string, status: number) {
        super(message);
        this.status = status;
        this.name = name;
    }
}

/**
 * The Error raised for Unauthorised
 * 
 * HTTP 403
 */
class Unauthorised extends DagpijsError {
    public constructor (message: string) {
        super(message, "Unauthorised", 403);
    }
}

/**
 * Error raised when you hit the dagpi ratelimit
 * 
 * HTTP 429
 */
class Ratelimited extends DagpijsError {

    public ratelimits: RatelimitInfo;

    public constructor (message: string, rls: RatelimitInfo) {
        super(message, "Ratelimited", 429);
        this.ratelimits = rls;
    }
}

/**
 * The File is larger than the dagpi limit
 * 
 * HTTP 413
 */
class FileToLarge extends DagpijsError {
    public constructor () {
        super("The file provided was larger than 8 Mb", "FileToLarge", 413);
    }
}

/**
 * Internat Server Error
 * 
 * Http 500
 */
class ApiError extends DagpijsError {
    public constructor (message: string) {
        super(message, "ApiError", 500);
    }
}
/**
 *  Parameter error (bad parameters provided)
 * 
 * HTTP 400
 */
class ParameterError extends DagpijsError {
    public constructor (message: string) {
        super(message, "Parameter Error", 400);
    }
}
/**
 *  URL passed is poorly framed
 *
 * HTTP 400
 */
class BadUrl extends DagpijsError {
    public constructor() {
        super("URL is badly framed", "Bad Url", 400);
    }
}

/**
 *  URL passed is poorly framed
 *
 * HTTP 400
 */
class ImageUnaccesible extends DagpijsError {
    public constructor(message: string) {
        super(message, "ImageUnaccesible", 415);
    }
}


export {
    Unauthorised,
    Ratelimited,
    ApiError,
    FileToLarge,
    ParameterError,
    BadUrl,
    ImageUnaccesible
};
