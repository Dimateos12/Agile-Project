import { AuthService } from "./../core/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { tap } from "rxjs";

@Component({
  selector: "app-passwordreset",
  templateUrl: "./passwordreset.component.html",
  styleUrls: ["./passwordreset.component.scss"],
})
export class PasswordresetComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private authSvc: AuthService
  ) {}

  @ViewChild("stepper") stepper: any;
  @ViewChild("resetCompleted") resetCompletedTpl: any;

  emailCtrl = new FormControl("", [Validators.required]);
  otpCtrl = new FormControl("", [Validators.required, Validators.minLength(6)]);

  newCredentialsGroup = this.fb.group({
    password: ["", Validators.required],
    passwordRepeat: ["", Validators.required],
  });

  loading = false;

  ngOnInit(): void {
    this.newCredentialsGroup.valueChanges.subscribe((value) => {
      if (value.password !== value.passwordRepeat) {
        this.newCredentialsGroup.setErrors(
          {
            mismatch: true,
          },
          { emitEvent: true }
        );

        this.newCredentialsGroup.controls["passwordRepeat"].setErrors({
          mismatch: true,
        });
      }
    });
  }

  sendResetEmail() {
    this.loading = true;

    this.authSvc
      .requestPasswordResetOtp(this.emailCtrl.value)
      .pipe(
        tap(() => {
          this.loading = false;
          this.nextStep();
        })
      )
      .subscribe();
  }

  confirmOtp() {
    this.loading = true;

    this.authSvc
      .checkPwdResetOtp(this.emailCtrl.value, this.otpCtrl.value)
      .pipe(
        tap(() => {
          this.nextStep();
        })
      )
      .subscribe();
  }

  updatePassword() {
    this.loading = true;
    this.authSvc
      .updateCredentials(
        this.emailCtrl.value,
        this.newCredentialsGroup.value.password,
        this.otpCtrl.value
      )
      .subscribe(() => {
        this.snackbar.open("Password updated", "x");
        this.router.navigate(["/login"]);
      });
  }

  private nextStep() {
    this.stepper.selectedIndex++;
    this.loading = false;
  }
}
