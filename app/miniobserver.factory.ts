import {MiniObserver} from "./miniobserver";
import {Logger} from "./log";

export const miniObserverFactory = (name: string, logger: Logger) : MiniObserver => {
    return {
        name() { return `Observer${name}`; },
        next(val) { logger.log(`${this.name()} got <span class="value">"${val}"</span>.`); },
        error(e) { logger.log(`ERROR: ${e}`); } ,
        complete() { logger.log(`<span class="completed">Observer ${name} completed.</span>`); }
    }
}