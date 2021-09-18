import { format } from "./models";
/**
 *  The dagpi image object
 * @constructor
 * @param {Buffer} raw - The buffer containing image data
 * @param {format} type - The format of the image `png` or `gif`
 * @param {number} process_time - the time taken to process the image
 */
export default class image {

    /** The buffer containing image data */
    public image: Buffer;

    /** The format of the image `png` or `gif` */
    public format: format;

    /**  the time taken to process the image*/
    public process_time: number;

    public constructor(raw: Buffer, type: format, time: number) {
        this.image = raw;
        this.format = type;
        this.process_time = time;
    }

    /**
     * get the size of the buffer
     * @return {number} output size
     */
    public size(): number {
        return this.image.length;
    }

}
