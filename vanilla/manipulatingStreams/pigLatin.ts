import { fromEvent, from } from "rxjs";
import { map, mergeMap, tap, reduce } from "rxjs/operators";

let textbox = <HTMLElement>document.querySelector('#text-input');
let results = <HTMLElement>document.querySelector('#results');
let keyUp$ = fromEvent(textbox, 'keyup');

function pigLatinify(word) {
    if (word.length < 2) {
        return word;
    }

    return `${word.slice(1)}-${word[0].toLowerCase()}ay`;
}

keyUp$.pipe(
    map((event:KeyboardEvent) => event.target.value),
    mergeMap(sentence =>
        from(sentence.split(/\s+/))
            .pipe(
                map(pigLatinify),
                reduce((bigStr, newWord) => `${bigStr} ${newWord}`, '')
            )
    ),
).subscribe(translatedWords => results.innerText=translatedWords);