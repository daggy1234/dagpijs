# Dagpijs

![Dagpi](https://img.shields.io/github/workflow/status/daggy1234/dagpijs/testing%20and%20linting?label=actions&logo=github) [![Docs](https://img.shields.io/github/workflow/status/daggy1234/dagpijs/Build%20and%20Deploy?label=docs)](https://daggy1234.github.io/dagpijs/) ![License](https://img.shields.io/github/license/daggy1234/dagpijs) [![Npm](https://img.shields.io/npm/v/dagpijs?color=red&logo=npm)](https://npmjs.com/package/dagpijs) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/565809c35b494c5a944393c5352a7761)](https://www.codacy.com/gh/Daggy1234/dagpijs/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Daggy1234/dagpijs&amp;utm_campaign=Badge_Grade) 

A fast and strongly typed promise based wrapper for https://dagpi.xyz

**Read the documentation: https://daggy1234.github.io/dagpijs/**

## Installation

```bash
#npm
npm i dagpijs

#yarn
yarn add dagpijs
```

## Examples

The example below explain a few common use cases

### Basic Data

```js
import { Client } from "dagpijs";

const cl = new Client("dagpi token");

cl.roast().then((res) => console.log(res.roast));
```

### Basic Image to file

```js
import {Client} from "dagpijs";
import {writeFile} from "fs";

const cl = new CLient("dagpi token");

cl.image_process("invert",{ url: "https://dagbot-is.the-be.st/logo.png"}).then((img) => {
    writeFile(`invert.${img.format}`, img.image, (err) => console.log(err.message))
});
```

### Strong Data Typing (Typescript)

```ts
import {Client, models} from "dagpijs"

let cl = new CLient("dagpi token")

async (): string => {
    roast: models.roast = await cl.joke()
    return roast.roast
}
```

### DiscordJs Image

```js
const Discord = require('discord.js');
const { MessageAttachment } = require('discord.js')
const {Client} = require("dagpijs");

const client = new Discord.Client();
const cl = new Client("dagpi token")

client.on('ready', () => {
  console.log('I am ready!');
});


client.on('message', async (message) => {
    if (message.content == "!gay") {
        const url = message.author.displayAvatarURL().replace(".webp",".png");
        console.log(url);
        const img = await cl.image_process("gay", {url : url});
        const attachment = new MessageAttachment(img.image);
        message.channel.send(attachment);
    }
});

client.login("discord token")
```

## Contributing

Feel free to fork the repo and make PR's.!
