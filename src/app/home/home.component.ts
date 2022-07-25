import { UserService } from 'src/app/core/services/user.services';
import { ProjectService } from "src/app/core/services/manager/project.service";
import { MockService } from "./../core/services/mock.service";
import { AuthService } from "./../core/services/auth.service";
import { Observable, tap } from "rxjs";
import { State, StoreService } from "./../core/store/store.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Project } from "../core/models/project";
import { User } from "../core/models/user";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(
    private storeSvc: StoreService,
    private projectSvc: ProjectService,
    private userSvc: UserService,
    private mockSvc: MockService,
    private router: Router,
    private authSvc: AuthService
  ) {}

  state$!: Observable<State | null>;

  projects$!: Observable<Project.Project[]>;
  users$!: Observable<User.Researcher[]>;

  loading = false;
  mockResponse: any;

  ngOnInit(): void {
    this.state$ = this.storeSvc.getState();
    this.projects$ = this.projectSvc.get(null, 1, 10);
    this.users$ = this.userSvc.getResearchers(10);
  }

  isAuthenticated() {
    return this.authSvc.isAuthenticated();
  }

  logout() {
    this.authSvc.logout();
  }

  login() {
    this.router.navigate(["login"]);
  }

  mock() {
    this.loading = true;
    this.mockSvc
      .get()
      .pipe(
        tap((response) => {
          this.mockResponse = response;
          this.loading = false;
        })
      )
      .subscribe();
  }
}
