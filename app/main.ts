import {Logger} from "./log";
import {miniObserverFactory} from "./miniobserver.factory";
import {miniObservableIntervalFactory} from "./miniobserver.interval.factory";
import {MiniObservable} from "./miniobservable";

const logA = new Logger("logA");
miniObservableIntervalFactory(logA)
    .subscribe(miniObserverFactory("A", logA));

const logB = new Logger("logB");
miniObservableIntervalFactory(logB)
    .map("MAP1", val => `M1[${val}]`)
    .map("MAP2", val => `M2[${val}]`)
    .map("MAP3", val => `M3[${val}]`)
    .subscribe(miniObserverFactory("B", logB));

const logC = new Logger("logC");
const clickObservable = MiniObservable.fromEvent(document.getElementById('rxmini'), 'click', logC);
clickObservable
    .subscribe(miniObserverFactory("C", logC));
clickObservable
    .subscribe(miniObserverFactory("D", logC));
