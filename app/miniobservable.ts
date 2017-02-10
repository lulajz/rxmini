import {MiniObserver} from "./miniobserver";
import {Logger} from "./log";

export class MiniObservable {

    public _name;
    public functionThatThrowsValues;
    private logger: Logger;

    constructor(name: string, logger: Logger, functionThatThrowsValues) {
        this._name = name;
        this.logger = logger;
        this.logger.log(`Created ${this.name()}`);
        this.functionThatThrowsValues = functionThatThrowsValues
    }

    name(): string {
        return `Observable${this._name}`;
    }

    subscribe(observer: MiniObserver) {
        this.logger.log(`Called ${this.name()}.subscribe(${observer.name()})`);
        this.functionThatThrowsValues(observer, this.name());
    }

    map(name, projectionFunction) {
        const logger = this.logger;
        return new MiniObservable(name, logger, (observer: MiniObserver, name: string) => {
            logger.log(`Called ${name}.functionThatThrowsValues(${observer.name()})`);
            return this.subscribe({
                name() { return `Observer(${name}&${observer.name()})` },
                next(val) {
                    logger.log(`Called ${name}: ${observer.name()}.next()`);
                    observer.next( function (val) { return projectionFunction(val); }(val) )
                },
                error(e) { observer.error(e) } ,
                complete() { observer.complete() }
            });
        });
    }

    static fromEvent(el: Element, event, logger) {
        return new MiniObservable("EVENT", logger, (observer: MiniObserver, name: string) => {
            logger.log(`Called ${name}.addEventListener(${observer.name()})`);
            el.addEventListener(event, e => {
                logger.log(`Emitted element event <span class="event">${event}</span> for ${observer.name()}.`);
                observer.next(e);
            })
        })
    }
}
