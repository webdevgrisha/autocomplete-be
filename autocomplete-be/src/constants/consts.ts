import { join } from "node:path";

const CITIES_PATH: string = join(process.cwd(), "data", "cities.json");

export { CITIES_PATH };
