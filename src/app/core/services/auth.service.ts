import { Signup } from "./../../signup/signup.component";
// src/app/auth/auth.service.ts
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpContext,
} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { firstValueFrom, map } from "rxjs";
import { Router } from "@angular/router";
import { StoreService } from "../store/store.service";
import { User } from "../models/user";
import { SKIP_GLOBAL_ERROR_HANDLER } from "../interceptors/http-context-tokens";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private storeSvc: StoreService
  ) {}
  // ...
  public async isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem("Auth-Token");
    // Check whether the token is expired and return
    // true or false
    const isAuth = await this.checkSession(token!!);
    console.log("#######AUTH###### ", isAuth);
    return true;
  }

  public login(email: string, password: string) {
    const URL = `${environment.API_BASE_URL}/mgmt/users/${email}`;
    return this.http
      .get<User.UserUnion>(URL, {
        withCredentials: true,
        observe: "response",
        context: new HttpContext().set(SKIP_GLOBAL_ERROR_HANDLER, true),
        headers: {
          Authorization: `Basic ${btoa(`${email}:${password}`)}`,
        },
      })
      .pipe(
        map((res) => {
          const authToken = res.headers.get("Auth-Token");
          if (res.status == 200 && authToken) {
            this.storeSvc.login(res.body as User.UserUnion, authToken);

            let redirectTo: string[] = [""];
            if (
              (res.body?.roles as User.USER_ROLES[]).includes(
                User.USER_ROLES.MANAGER
              )
            ) {
              redirectTo = ["manage"];
            }

            this.router.navigate(redirectTo);
          }
        })
      );
  }

  public requestPasswordResetOtp(email: string) {
    const URL = `${environment.API_BASE_URL}/pwdReset/${email}`;
    return this.http
      .get<any>(URL, {
        withCredentials: true,
        observe: "response",
      })
      .pipe(
        map((res) => {
          if (res.status == 200) {
            const otp = res.body.otp;
            console.error(`@@@@@ debugging OTP: ${otp} @@@@`);
          }
        })
      );
  }

  public updateCredentials(email: string, password: string, otp: string) {
    const URL = `${environment.API_BASE_URL}/mgmt/users/${email}`;
    return this.http.patch<any>(
      URL,
      {
        password,
        otp,
      },
      {
        withCredentials: true,
        observe: "response",
      }
    );
  }

  public checkPwdResetOtp(email: string, otp: string) {
    const URL = `${environment.API_BASE_URL}/checkOtp/${email}`;
    return this.http.post<any>(
      URL,
      {
        otp,
      },
      {
        withCredentials: true,
        observe: "response",
      }
    );
  }

  public signup(user: Signup) {
    const URL = `${environment.API_BASE_URL}/mgmt/users`;
    return this.http.post<any>(
      URL,
      {
        ...user,
      },
      {
        withCredentials: true,
        observe: "response",
      }
    );
  }

  public logout(redirectUrl: string = "") {
    this.storeSvc.logout();
    this.router.navigateByUrl(redirectUrl);
  }

  async checkSession(email: string, token: string = "") {
    const URL = `${environment.API_BASE_URL}/mgmt/users/${email}`;
    return firstValueFrom(this.http.get(URL));
  }
}
