import fs from "fs";

// const result = await fetch("https://www.meetup.com/gql2", {
//   credentials: "include",
//   headers: {
//     "User-Agent":
//       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:142.0) Gecko/20100101 Firefox/142.0",
//     Accept: "*/*",
//     "Accept-Language": "en-US",
//     "content-type": "application/json",
//     "apollographql-client-name": "nextjs-web",
//     "x-meetup-view-id": "3edf25cf-c84a-4170-aa83-fde2ea7a25e9",
//     "sentry-trace": "72f634496da82a13e3af99f960c3c7dd-b02a5d93c1cbaa4c-0",
//     baggage:
//       "sentry-environment=production,sentry-release=9d1a75a26b3b44a5d8d91f3aa7b3b92d6d9b152e,sentry-public_key=5d12cd2317664353456ab4c40d079af2,sentry-trace_id=72f634496da82a13e3af99f960c3c7dd,sentry-org_id=6787,sentry-sampled=false,sentry-sample_rand=0.9867476820788954,sentry-sample_rate=0.1",
//     "Sec-GPC": "1",
//     "Sec-Fetch-Dest": "empty",
//     "Sec-Fetch-Mode": "cors",
//     "Sec-Fetch-Site": "same-origin",
//     Priority: "u=4",
//     Pragma: "no-cache",
//     "Cache-Control": "no-cache",
//   },
//   referrer: "https://www.meetup.com/creative-coding-amsterdam/events/past/",
//   body: '{"operationName":"getPastGroupEvents","variables":{"urlname":"creative-coding-amsterdam","beforeDateTime":"2025-08-29T13:36:18.919Z","after":"MzA0MzI0NTgyOjE3MzE4NDQ4MDAwMDA="},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"b85c696450cb93ec189c12c52782b9d79e694d5df408608b3a201120f80cfb27"}}}',
//   method: "POST",
//   mode: "cors",
// });
//
const result = await fetch("https://www.meetup.com/gql2", {
  credentials: "include",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:142.0) Gecko/20100101 Firefox/142.0",
    Accept: "*/*",
    "Accept-Language": "en-US",
    "content-type": "application/json",
    "apollographql-client-name": "nextjs-web",
    "x-meetup-view-id": "2e9d98bf-05c0-4c6c-852e-9e1542e577ff",
    "sentry-trace": "b713209933fb83264c495b91071032f1-8031ba1a72ca77d7-0",
    baggage:
      "sentry-environment=production,sentry-release=9d1a75a26b3b44a5d8d91f3aa7b3b92d6d9b152e,sentry-public_key=5d12cd2317664353456ab4c40d079af2,sentry-trace_id=b713209933fb83264c495b91071032f1,sentry-org_id=6787,sentry-sampled=false,sentry-sample_rand=0.26244485772413984,sentry-sample_rate=0.1",
    "Sec-GPC": "1",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    Priority: "u=4",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
  },
  referrer: "https://www.meetup.com/creative-coding-amsterdam/events/past/",
  body: '{"operationName":"getPastGroupEvents","variables":{"urlname":"creative-coding-amsterdam","beforeDateTime":"2025-08-29T13:46:38.578Z"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"b85c696450cb93ec189c12c52782b9d79e694d5df408608b3a201120f80cfb27"}}}',
  method: "POST",
  mode: "cors",
});

const data = await result.json();

console.log(data);

fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
  if (err) throw err;
  console.log("Data written to file");
});
