import {Client} from "../src/index";
import { Unauthorised } from "../src/errors";

const image_url = "https://cdn.discordapp.com/avatars/491174779278065689/6f2a16eeb9c990980905fa11c56858d5.png?size=1024";
const bad_url = "httpsgoogle.com";


test("Client Init Errors", () => {
    expect(() => {new Client("");}).toThrow(Unauthorised);
});

test("Client Unauthorised Errors", async () => {
    const client = new Client("lol bad token");
    try {
        await client.eight_ball();
    } catch(e) {
        expect(e).toStrictEqual(new Unauthorised("Invalid Token provided"));
    }
});

test("Get WTP data", async () => {
    const token = process.env.DAGPI_TOKEN!;
    const client = new Client(token);
    const wtp = await client.wtp();
    expect(wtp).toHaveProperty("answer");
});


test("Sample Image Processing", async () => {
    const token = process.env.DAGPI_TOKEN!;
    const client = new Client(token);
    const valid_img = await client.image_process("night",{
        url: image_url
    });
    expect(valid_img).toHaveProperty("image");
});

test("Broken Url", async () => {
    const token = process.env.DAGPI_TOKEN!;
    const client = new Client(token);
    try {
        const valid_img = await client.image_process("night",{
            url: bad_url
        });
    } catch(e) {
        expect(e.message).toEqual("URL is badly framed");
    }

});
