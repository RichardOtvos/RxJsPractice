import { interval, fromEvent } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

let startButton = document.querySelector('#start-button');
let stopButton = document.querySelector('#stop-button');
​let​ resultsArea = document.querySelector<HTMLElement>(​'.output'​);

let startClick$ = fromEvent(startButton, 'click');
let stopClick$ = fromEvent(stopButton, 'click');

startClick$.subscribe(() => {
    let tenthSecond$ = interval(100).pipe(
        map(ms => ms / 10),
        takeUntil(stopClick$)
    ).subscribe(num => resultsArea.innerText = `${num.toFixed(1)} s`);
});