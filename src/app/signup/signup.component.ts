import { Mongo } from "./../core/models/mongo";
import { SnackbarService } from "./../core/services/snackbar.service";
import { AuthService } from "./../core/services/auth.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { catchError } from "rxjs";
import { Router } from "@angular/router";
import * as moment from "moment";
import { User } from "../core/models/user";

export interface Signup extends Partial<User.User> {
  password: string;
}

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  hide = true;

  signupFormGrp!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private snackbarSvc: SnackbarService,
    private router: Router
  ) {
    this.signupFormGrp = this.fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      repeatPassword: ["", Validators.required],
      phone: ["", Validators.required],
      birthdate: ["", [Validators.required]],
      country: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.signupFormGrp.valueChanges.subscribe((value) => {
      if (value.password !== value.repeatPassword) {
        this.signupFormGrp.setErrors(
          {
            mismatch: true,
          },
          { emitEvent: true }
        );

        this.signupFormGrp.controls["repeatPassword"].setErrors({
          mismatch: true,
        });
      }
    });
  }

  signup() {
    this.loading = true;
    this.authSvc
      .signup({
        _id: this.signupFormGrp.value.email,
        password: this.signupFormGrp.value.password,
        profile: {
          firstName: this.signupFormGrp.value.firstName,
          lastName: this.signupFormGrp.value.lastName,
          birthdate: new Mongo.Date(
            moment(this.signupFormGrp.value.birthdate).milliseconds()
          ),
          phone: this.signupFormGrp.value.phone,
          country: this.signupFormGrp.value.country,
        },
      })
      .pipe(
        catchError(async (err) => {
          switch (err.status) {
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
          this.loading = false;
        })
      )
      .subscribe(() => {
        this.snackbarSvc.open("Successfully signed up");
        this.router.navigate(["/login"]);
      });
  }
}
