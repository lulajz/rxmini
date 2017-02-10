export class Logger {

    private el: Element;

    constructor(elId: string) {
        this.el = document.getElementById(elId);
    }

    log(text: string) {
        let p = document.createElement("p");
        p.innerHTML = `&bull; ${text}`;
        this.el.appendChild(p)
    }
}