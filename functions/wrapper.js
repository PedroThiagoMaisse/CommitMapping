import { isOn } from "../controllers/phaser.js";
import { errorHandler } from "./errorHandler.js";

async function wrapper(func, el) {
    try {
        if (!isOn) { return false }
        const r = await func(el)
        return r
    } catch (err) {
        errorHandler(err + ' while executing ' + func.name)
    }
}

export {wrapper}