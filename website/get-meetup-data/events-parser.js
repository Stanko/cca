import fs from "fs";
import { events } from "./events.js";

const data = events.map((event) => {
  const date = new Date(event.node.dateTime).toISOString().split("T")[0];

  const item = {
    title: event.node.title,
    id: event.node.id,
    url: event.node.eventUrl,
    date,
    description: event.node.description,
    photo: event.node.featuredEventPhoto?.source,
    photoPath: `meetup-${date}.jpg`,
  };
  return item;
});

// for (const item in data) {
//   const path = `../static/img/meetups/${item.photoPath}`
//   if (item.photo && !fs.existsSync(path)) {
//     // fetch photo from it's url
//     const photo = await fetch(item.photo).then((res) => res.blob());
//     const buffer = Buffer.from(await photo.arrayBuffer());
//     await fs.promises.writeFile(path, buffer);
//     console.log(`Photo saved: ${photoPath}`);
//   }
// }

const toml = data.map((item) => {
  return [
    `[[extra.events]]`,
    `title = "${item.title}"`,
    `meetup_url = "${item.url}"`,
    `date = "${item.date}"`,
    `image = "${item.photoPath}"`,
    `description = """\n${item.description}\n"""`,
  ].join("\n");
});

fs.writeFileSync("events.toml", toml.join("\n\n"));
