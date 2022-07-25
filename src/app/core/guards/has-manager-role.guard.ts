import { StoreService } from "./../store/store.service";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { tap, Observable, map } from "rxjs";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class HasManagerRoleGuard implements CanActivate {
  constructor(private storeSvc: StoreService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.storeSvc.getUser().pipe(
      map((user) => {
        if (user) {
          const hasManagerRole = user.roles.some((role) =>
            [User.USER_ROLES.MANAGER].includes(role)
          );
          if (hasManagerRole) {
            return true;
          } else {
            this.router.navigate([""], { queryParams: { unauthorized: true } });
            return false;
          }
        }
        return false;
      })
    );
  }
}
