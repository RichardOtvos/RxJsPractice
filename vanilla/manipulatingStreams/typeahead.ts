import { fromEvent, from } from "rxjs";
import { tap, map, filter, mergeMap, reduce, pluck } from "rxjs/operators";

let typeaheadInput = <HTMLElement>document.querySelector('#typeahead-input');
let typeaheadContainer = <HTMLElement>document.querySelector('#typeahead-container');
let usStates = ['alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming'];

let keyUp$ = fromEvent(typeaheadInput, 'keyup');

keyUp$.pipe(
    pluck('target', 'value'),
    map((searchTerm: string) => searchTerm.toLowerCase()),
    tap(() => typeaheadContainer.innerHTML = ''),
    filter(searchTerm => searchTerm.length > 2),
    mergeMap(searchTerm => {
        return from(usStates).pipe(
            filter(state => state.includes(searchTerm)),
            map(state => state.split(searchTerm).join(`<b>${searchTerm}</b>`)),
            reduce((prev: any, state) => prev.concat(state), [])
        )
    })
).subscribe((stateList) =>
    typeaheadContainer.innerHTML += `<br>${stateList.join('<br>')}`
)