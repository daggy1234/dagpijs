/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Unauthorised, Ratelimited, ApiError, FileToLarge, ImageUnaccesible, ParameterError} from "./errors";


export function error_response(error: any): Promise<never> {
    // eslint-disable-next-line no-var
    var js = error.response.data;
    if (!(error.request.path.includes("data"))) {
        try {
            js = JSON.parse(error.response.data.toString("utf8"));
        } catch (err) {
            js = error.response.data.toString("utf8");
        }
    }
    switch(error.response.status) {
    case 403:
        throw new Unauthorised("Invalid Token provided");
    case 429:
        throw new Ratelimited("You have maxed out requests for this minute");
    case 500:
        throw new ApiError("API had an Internal Server Error");
    case 413:
        throw new FileToLarge();
    case 415:
        throw new ImageUnaccesible(js["message"]);
    case 422:
        try {
            let mstr = "";
            js["detail"].map((val: any) => {
                mstr = (mstr + `${val["loc"][1]} is ${val["type"]}` + "    ");
            });
            throw new ParameterError(mstr);
        } catch (error) {
            throw new ApiError("API was unable to manipulate the image");
        }
    }
    return Promise.reject(error);
}
