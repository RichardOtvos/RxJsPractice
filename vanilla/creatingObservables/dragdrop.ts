import { fromEvent } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

let draggable = document.querySelector<HTMLElement>('#draggable');

let mouseDown$ = fromEvent<MouseEvent>(draggable, 'mousedown');
let mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup');
let mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');

mouseDown$.subscribe(() => {
    mouseMove$
        .pipe(
            map(event => {
   
                return {
                    x: event.clientX,
                    y: event.clientY
                }
            }),
            takeUntil(mouseUp$)
        )
        .subscribe(pos => {
            draggable.style.left = `${pos.x}px`;
            draggable.style.top = `${pos.y}px`;
        });
})