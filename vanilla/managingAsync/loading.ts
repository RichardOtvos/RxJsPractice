import { ajax } from 'rxjs/ajax';
import { merge } from 'rxjs';
import { scan } from 'rxjs/operators';

let progressBar = <HTMLElement>document.querySelector('.progress-bar');
let arrayOfRequests = [];
let endpoint = 'http://localhost:3000/api/managingAsync/loadingbar/';
for (let i = 0; i < 128; i++) {
  arrayOfRequests.push(ajax(endpoint + i));
}

merge(...arrayOfRequests)
  .pipe(
    scan(prev => prev + (100 / arrayOfRequests.length), 0)
  ).subscribe((percentDone: number) => {
    progressBar.style.width = `${percentDone}%`;
    progressBar.innerText = `${Math.round(percentDone)}%`;
  })