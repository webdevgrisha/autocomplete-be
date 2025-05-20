import { createReadStream, ReadStream } from "node:fs";
import { createHash, Hash } from "node:crypto";
import { CITIES_PATH } from "../constants/consts.js";

async function getFileHash(): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash: Hash = createHash("sha256");
    const readableStream: ReadStream = createReadStream(CITIES_PATH);

    readableStream.on("error", reject);

    readableStream.on("data", (chunk) => {
      hash.update(chunk);
    });

    readableStream.on("end", () => {
      const hashValue = hash.digest("hex");

      resolve(hashValue);
    });
  });
}

export { getFileHash };
