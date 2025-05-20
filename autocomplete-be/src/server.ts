import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { parse, type UrlWithParsedQuery } from "node:url";

import { type AutoCompleteFn, initAutoComplete } from "./utils/initAutoComplete.js";
import { getFileHash } from "./utils/getFileHash.js";

const PORT = process.env.PORT || 3500;

let autoComplete: AutoCompleteFn = initAutoComplete();
let lastEtag: null | string = null;
const server = createServer();

server.on("request", async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const url: UrlWithParsedQuery = parse(req.url || "", true);
    const { pathname, query } = url;

    let etag: string = await getFileHash();

    if (lastEtag !== etag) {
      lastEtag = etag;

      autoComplete = initAutoComplete();
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, no-cache, max-age=86400");
    res.setHeader("ETag", etag);

    if (req.method === "GET" && pathname === "/") {
      if (req.headers["if-none-match"] === etag) {
        res.writeHead(304);
        res.end();
        return;
      }

      const words: string | string[] | undefined = query.complete;

      if (typeof words !== "string") {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Query data must be string type" }));
      } else {
        const autoCompleteArr: string[] = autoComplete(words);

        res.writeHead(200);
        res.end(JSON.stringify(autoCompleteArr));
      }
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Not found" }));
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    console.error("Internal server error:", err);

    res.writeHead(500);
    res.end(
      JSON.stringify({
        error: "Internal server error",
        message: message,
      })
    );
  }
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

server.on("close", () => {
  console.log("Server has been stopped");
});