import {MiniObservable} from "./miniobservable";
import {MiniObserver} from "./miniobserver";
import {Logger} from "./log";

export const miniObservableIntervalFactory = (logger: Logger): MiniObservable => {
    return new MiniObservable("INTERVAL", logger, (observer: MiniObserver, name: string) => {
        logger.log(`Called ${name}.functionThatThrowsValues(${observer.name()})`);
        let i = 0;
        //async
        let interval = setInterval(() => {
            i++;
            logger.log(`Called ${name}: ${observer.name()}.next()`);
            observer.next(i);
            if (i >= 3) {
                clearInterval(interval);
                observer.complete();
            }
        }, 450);
    });
}