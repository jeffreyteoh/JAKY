// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
// import {_throw} from 'rxjs/observable/throw';
// import {catchError} from "rxjs/operators";
//
//
// @Injectable()
// export class ConfigService {
//   webHookUrl: string = "https://us-central1-jacky-bfdd4.cloudfunctions.net/helloWorld";
//
//   private handleError(error: HttpErrorResponse) {
//     if (error.error instanceof ErrorEvent) {
//       // A client-side or network error occurred. Handle it accordingly.
//       console.error('An error occurred:', error.error.message);
//     } else {
//       // The backend returned an unsuccessful response code.
//       // The response body may contain clues as to what went wrong,
//       console.error(
//         `Backend returned code ${error.status}, ` +
//         `body was: ${error.error}`);
//     }
//     // return an observable with a user-facing error message
//     return _throw(
//       'Something bad happened; please try again later.');
//   };
//
//   constructor(private http: HttpClient) {
//   }
//
//   public getIntent(body) {
//     console.log(body);
//     return this.http.post(this.webHookUrl,body)
//       .pipe(catchError(this.handleError))
//       .subscribe(data => console.log(data));
//   }
//
// }
//
//
