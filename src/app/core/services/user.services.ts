import { User } from "./../models/user";
import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { SKIP_GLOBAL_ERROR_HANDLER } from "../interceptors/http-context-tokens";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getResearchers(pageSize?: number) {
    return this.httpClient.get<User.Researcher[]>(
      environment.API_BASE_URL +
        "/mgmt/users?filter={'roles':['researcher']}&pageSize=" +
        pageSize,
      { observe: "body" }
    );
  }

  getFunders() {
    return this.httpClient.get<User.Funder[]>(
      environment.API_BASE_URL + "/mgmt/users?filter={'roles':['funder']}",
      { observe: "body" }
    );
  }

  getUser(userId: string, skipIntercept = false) {
    return this.httpClient.get<User.UserUnion>(
      environment.API_BASE_URL + "/mgmt/users/" + userId,
      {
        observe: "body",
        context: skipIntercept
          ? new HttpContext().set(SKIP_GLOBAL_ERROR_HANDLER, true)
          : new HttpContext(),
      }
    );
  }

  getFilteredUser(filter?: string) {
    return this.httpClient.get<User.User[]>(
      environment.API_BASE_URL +
        "/mgmt/users" +
        (filter ? "?filter=" + filter : ""),
      { observe: "body" }
    );
  }

  getFunder(userId: string) {
    return this.httpClient.get<User.Funder>(
      environment.API_BASE_URL + "/mgmt/users/" + userId,
      { observe: "body" }
    );
  }

  public isFunder(user: User.User): boolean {
    return user.roles.includes(User.USER_ROLES.FUNDER);
  }

  getAllUser() {
    return this.httpClient.get<User.User[]>(
      environment.API_BASE_URL + "/mgmt/users/",
      { observe: "body" }
    );
  }
  public isManager(user: User.User): boolean {
    return user.roles.includes(User.USER_ROLES.MANAGER);
  }

  public isResearcher(user: User.User): boolean {
    return user.roles.includes(User.USER_ROLES.RESEARCHER);
  }

  patch(body: Partial<User.User>, $email: string) {
    return this.httpClient.patch<any>(
      environment.API_BASE_URL + "/mgmt/users/" + $email,
      body,
      { observe: "body" }
    );
  }
}
