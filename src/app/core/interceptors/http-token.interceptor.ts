import { AuthService } from "./../services/auth.service";
import { StoreService } from "./../store/store.service";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import { catchError, map, Observable, switchMap, take, throwError } from "rxjs";

import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(
    private storeSvc: StoreService,
    private authSvc: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req?.url) {
      if (req.url.indexOf(environment.API_BASE_URL) === -1) {
        return next.handle(req);
      }
    }

    let { headers } = req;
    let { url } = req;

    // if request has authorization header send it to the request to the next handler
    if (req.headers.has("Authorization")) {
      return next.handle(
        req.clone({
          withCredentials: true,
          url: encodeURI(url),
          headers: req.headers.append("No-Auth-Challenge", "true"),
        })
      );
    }

    return this.storeSvc.getState().pipe(
      take(1),
      map((state: any) => {
        headers = headers.set("No-Auth-Challenge", "true");

        if (state?.authToken && state?.user) {
          const authorizationHeader = `Basic ${btoa(
            `${state.user._id}:${state.authToken}`
          )}`;
          headers = headers.set("Authorization", authorizationHeader);
        }

        return req.clone({
          withCredentials: true,
          url: encodeURI(url),
          headers,
        });
      }),
      switchMap((newRequest: HttpRequest<any>) =>
        next.handle(newRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            /* if (!req.context.get(SKIP_GLOBAL_ERROR_HANDLER)) {
                this.errorHandler(error, req);
                throw error;
              } */
            console.error("[Global Error Handler] ", error);
            return throwError(() => error);
          })
        )
      )
    );
  }
}
