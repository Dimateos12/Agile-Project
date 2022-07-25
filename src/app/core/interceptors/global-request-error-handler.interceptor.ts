import { AuthService } from "./../services/auth.service";
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
import { Observable, catchError, throwError } from "rxjs";
import { SKIP_GLOBAL_ERROR_HANDLER } from "./http-context-tokens";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
  providedIn: "root",
})
export class GlobalRequestErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!req.context.get(SKIP_GLOBAL_ERROR_HANDLER)) {
          this.errorHandler(error, req);
          throw error;
        }
        console.error("[Global Error Handler] ", error);
        return throwError(() => error);
      })
    );
  }

  private errorHandler(error: HttpErrorResponse, req: HttpRequest<any>) {
    this.dialog.closeAll();

    switch (error.status) {
      case 401:
        // this action has an effect associated with it that clears user tenant
        // and redirects to the signin page
        if (this.router.url !== "/signin") {
          this.snackbar.open("Session expired. Please login again.", "x", {
            duration: 5000,
          });
        }
        this.authSvc.logout("login");

        break;
      case 403: // FORBIDDEN
        // this.store.dispatch(handleHttpError({status: 403}));
        this.snackbar.open("You're not allowed to perform this request.", "x", {
          duration: 5000,
        });
        this.authSvc.logout("login");
        break;
      case 404: // NOT FOUND - DO NOT REMOVE!!!
        console.log("NOT FOUND MUST be handled by subscription");
        this.router.navigate(["not-found"]);
        break;
      case 409:
        this.snackbar.open(
          "Resource you're trying to create already exists.",
          "x",
          {
            duration: 50000,
          }
        );
        break;
      case 417:
        // TODO: check if url is mgmt/users/
        return;
      case 429:
        this.snackbar.open(
          "We're monitoring abnormal activities on your accound. Please try again later.",
          "x",
          { duration: 3000 }
        );
        this.authSvc.logout("login");
        break;
      case 0: // NO NETWORK
        this.snackbar.open("You are offline.", "x", { duration: 5000 });
        this.authSvc.logout("login");
        break;
      default:
        // throw new Error('test');
        if (error) {
          this.router.navigate(["error"]);
        }
        break;
    }
  }
}
