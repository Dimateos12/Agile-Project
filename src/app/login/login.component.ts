import { SnackbarService } from "./../core/services/snackbar.service";
import { AuthService } from "./../core/services/auth.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { catchError, map } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(
    private authSvc: AuthService,
    private fb: FormBuilder,
    private snackbarSvc: SnackbarService
  ) {}

  hide = true;

  loginFormGrp = this.fb.group({
    email: ["", Validators.required],
    password: ["", Validators.required],
  });

  hasError = false;

  isLogging = false;

  ngOnInit(): void {}

  hidePassword(event: MouseEvent) {
    if ((event as PointerEvent).pointerId > -1) {
      this.hide = !this.hide;
    }
  }

  login() {
    this.isLogging = true;
    this.authSvc
      .login(this.loginFormGrp.value.email, this.loginFormGrp.value.password)
      .pipe(
        catchError(async (err) => {
          switch (err.status) {
            case 404:
            case 401:
              return this.snackbarSvc.open(
                "Wrong credentials please try again"
              );
            case 429:
              return this.snackbarSvc.open(
                "Wrong credentials please try again"
              );
            case 0:
              return this.snackbarSvc.open(
                "You are offline please try again later"
              );
            default:
              return this.snackbarSvc.open(
                "Something went wrong please try again"
              );
          }
        }),
        map(() => {
          this.isLogging = false;
        })
      )
      .subscribe();
  }
}
