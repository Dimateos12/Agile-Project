import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { User } from "../models/user";

export interface State {
  authToken: string | null;
  isAuthenticated: boolean;
  user: User.UserUnion | null;
}

@Injectable({
  providedIn: "root",
})
export class StoreService {
  private state = new BehaviorSubject<State | null>(null);

  constructor(private router: Router) {}

  login(user: any, authToken: string) {
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("user", JSON.stringify(user));

    this.state.next({
      authToken,
      user,
      isAuthenticated: true,
    });

    this.router.navigate([""]);
  }

  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    this.state.next({
      authToken: null,
      isAuthenticated: false,
      user: null,
    });

    this.router.navigate([""]);
  }

  isAuthenticated() {
    return this.state?.value?.authToken !== null;
  }

  public getUser(): Observable<User.UserUnion | null> {
    if (this.state.value) {
      return of(this.state.value.user);
    }
    return of(null);
  }

  private updateState(state: State) {
    return this.state.next(state);
  }

  loadState() {
    const authToken = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    this.state.next({
      authToken,
      user: user ? JSON.parse(user) : null,
      isAuthenticated: authToken != null,
    });
  }

  getState(): Observable<State | null> {
    if (!this.state) {
      this.loadState();
    }

    return this.state.asObservable();
  }
}
