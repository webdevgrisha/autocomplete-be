import { readFileSync } from "node:fs";
// @ts-ignore
import { createAutoComplete } from "../../../auto-complete/index.js";
import { CITIES_PATH } from "../constants/consts.js";

type AutoCompleteFn = (letters: string) => string[];

function initAutoComplete() {
  const rawData = readFileSync(CITIES_PATH, "utf-8");

  const cites: string[] = JSON.parse(rawData);

  const autoComplete: AutoCompleteFn = createAutoComplete(cites);

  return autoComplete;
}

export { initAutoComplete };
export type { AutoCompleteFn }