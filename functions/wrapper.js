import { die, isOn } from "../controllers/phaser.js";

async function wrapper(func, el) {
    if (!isOn) { return false }
    const r = await func(el)
    return r
}

export {wrapper}