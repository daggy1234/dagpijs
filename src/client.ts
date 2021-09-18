import axios, { AxiosInstance, AxiosResponse } from "axios";
import { wtp, joke, logo, pickupline, roast, yomama, image_props, ImageFeature, format, fact, headline, Eightball, captcha, typeracer, RatelimitInfo } from "./models";
import { Unauthorised, BadUrl, Ratelimited } from "./errors";
import {error_response} from "./handlers";
import image from "./image";

/**
 * The Base CLient used for asyncdagpi
 * @constructor
 * @param {string} token - Your dagpi token
 */
export default class Client {

    /** @type {string} dagpi token */
    public token: string

    /** @type {AxiosInstance} The AxiosIntance dagpi uses */
    private http: AxiosInstance

    /** @type {string} The version of the API used */
    public version: string

    /** @type {RatelimitInfo} Get information about ratelimits */
    public ratelimits: RatelimitInfo

    /** Construct a new dagpi client */
    public constructor(token: string) {
        if (!token) {
            throw new Unauthorised("Please provide an api token");
        }
        this.token = token;
        this.http = axios.create({
            baseURL: "https://api.dagpi.xyz/"
        });
        this.ratelimits =  {
            ratelimit: 0,
            remaining: 0,
            reset: new Date()
        };
        this.http.defaults.headers["Authorization"] = token;
        this.http.defaults.headers["User-Agent"] = "dagpi.js";
        this.http.interceptors.response.use((response: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response;
        }, (error) => error_response(error));
        this.version = "1.1.3";
    }

    /** Get a random joke */
    public async joke(): Promise<joke> {
        return this.request<joke>("joke");
    }

    /** Get json with WTP data */
    public async wtp(): Promise<wtp> {
        return this.request<wtp>("wtp");
    }

    /** Get a roast object */
    public async roast(): Promise<roast> {
        return this.request<roast>("roast");
    }

    /** Get a yomama joke object */
    public async yomama(): Promise<yomama> {
        return this.request<yomama>("yomama");
    }


    /** get a pickupline object */
    public async pickup_line(): Promise<pickupline> {
        return this.request<pickupline>("pickuline");
    }

    /** get a logo object */
    public async logo(): Promise<logo> {
        return this.request<logo>("logo");
    }

    /** Get a waifu object */
    public async waifu(): Promise<any> {
        return this.request<any>("waifu");
    }
    
    /** Get a random fact */
    public async fact(): Promise<fact> {
        return this.request<fact>("fact");
    }

    /** Get a random fact */
    public async eight_ball(): Promise<Eightball> {
        return this.request<Eightball>("8ball");
    }

    /** Get a random headline */
    public async headline(): Promise<headline> {
        return this.request<headline>("headline");
    }

    /** Get a random captcha */
    public async captcha(): Promise<captcha> {
        return this.request<captcha>("captcha");
    }

    /** Get a random typeracer game data payload with sentence, and image */
    public async typeracer(): Promise<typeracer> {
        return this.request<typeracer>("typeracer");
    }

    /**
      *  Process a dagpi image
      * @param {ImageFeature} feature - The feature chose for manipulation 
      * @param {image_props} params - a Javascript object with properties passed for manipulation
      *     These include 
      *     - url (required for every image)
      *     - url2 (second image url for 5g1g and whyareyougay)
      *     - username (required for tweet and discord)
      *     - text (toughtimage, discord, tweet, modernmeme)
      * @returns {Promise<image>} image - contains a dagpijs image class
      */
    public async image_process(feature: ImageFeature, parmas: image_props): Promise<image> {
        return this.image_request(feature, parmas);
    }

    /**
      *  Process a special dagpi feature!
      * @param {image_props} params - a Javascript object with properties passed for manipulation
      *     These include 
      *     - url (required for every image)
      * @returns {Promise<image>} image - contains a dagpijs image class
      */
    public async special_image(parmas: image_props): Promise<image> {
        return this.image_request("special", parmas);
    }


    /**
     * Validate a Url against regex
     * @param  {string}  url url supplied
     * @return {boolean}     wether valid or not
     */
    private validate(url: string): boolean {
        const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g;
        return re.test(url);
    }

    
    /**
     * Private function to make Http request
     * @param  {string}         path   route to be taken
     * @param  {image_props}    params additional prarams
     * @return {Promise<image>}        [description]
     */
    private async image_request(path: string,  params: image_props): Promise<image> {
        this.ratelimits.remaining--;
        if (this.validate(params.url) === false) {
            throw new BadUrl();
        }
        const resp: AxiosResponse = await this.http.get(`image/${path}/`,{
            params: params,
            responseType: "arraybuffer"
        });
        this.ratelimits = {
            ratelimit: parseInt(resp.headers["x-ratelimit-limit"]),
            remaining : parseInt(resp.headers["x-ratelimit-remaining"]),
            reset: new Date(parseInt(resp.headers["x-ratelimit-reset"]) * 1000),
        };

        const filetype: string = resp.headers["content-type"].toLowerCase();
        const time: number = resp.data["X-Process-Time"];
        if (["image/png", "image/gif"].includes(filetype)) {
            const type: format  = <format>filetype.replace("image/","");
            const buff: Buffer =  Buffer.from(resp.data, "binary");
            return new image(buff, type, time);
        } else {
            throw new Error("What");
        }

    }

    /**
     * Request
     */
    private async request<T>(url: string): Promise<T> {
        this.ratelimits.remaining--;
        const resp = await this.http.get(`data/${url}`);
        this.ratelimits = {
            ratelimit: parseInt(resp.headers["x-ratelimit-limit"]),
            remaining : parseInt(resp.headers["x-ratelimit-remaining"]),
            reset: new Date(parseInt(resp.headers["x-ratelimit-reset"]) * 1000),
        };
        const data = resp.data;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
    }
}
