import { SnackbarService } from "src/app/core/services/snackbar.service";
import { ProjectService } from "./../../core/services/manager/project.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "./../../core/services/user.services";
import { BreadcrumbService } from "xng-breadcrumb";
import { Component, OnInit } from "@angular/core";
import { catchError, Observable, tap, of } from "rxjs";
import { User } from "src/app/core/models/user";
import { Project } from "src/app/core/models/project";
import { localeDate } from "src/app/core/utils/date";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { Mongo } from "src/app/core/models/mongo";
import { StoreService } from "src/app/core/store/store.service";
import { Publication } from "src/app/core/models/publication";

@Component({
  selector: "app-personal-page",
  templateUrl: "./personal-page.component.html",
  styleUrls: ["./personal-page.component.scss"],
})
export class PersonalPageComponent implements OnInit {
  $user!: Observable<User.UserUnion | null>;
  userAuth!: User.UserUnion | null;
  $funderProjects!: Observable<Project.Project[]>;
  $researcherProjects!: Observable<Project.Project[]>;
  $researcherPublications!: Observable<Publication.Publication[]>;

  signupFormGrp!: FormGroup;

  UserRoles = User.USER_ROLES;
  edit = false;
  loading = false;
  appearance: MatFormFieldAppearance = "standard";

  constructor(
    private breadcrumbSvc: BreadcrumbService,
    private route: ActivatedRoute,
    private userSvc: UserService,
    private projectSvc: ProjectService,
    private snackbarSvc: SnackbarService,
    private router: Router,
    private fb: FormBuilder,
    private storeSvc: StoreService
  ) {
    this.signupFormGrp = new FormGroup({});
  }

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      const userId = routeParams["userId"];

      this.storeSvc
        .getUser()
        .pipe(tap((user) => (this.userAuth = user)))
        .subscribe();

      this.$user = this.userSvc.getUser(userId).pipe(
        tap((user) => {
          this.initUser(user);
          this.breadcrumbSvc.set(
            "@userName",
            `${user.profile.firstName} ${user.profile.lastName}`
          );
        }),
        catchError(async (err) => {
          switch (err.status) {
            case 404:
              this.snackbarSvc.open(
                "User not found or session expired please login again"
              );
              break;
            case 401:
              this.snackbarSvc.open("Wrong credentials please try again");
              break;
            case 429:
              this.snackbarSvc.open("Wrong credentials please try again");
              break;
            case 0:
              this.snackbarSvc.open("You are offline please try again later");
              break;
            default:
              this.snackbarSvc.open("Something went wrong please try again");
          }

          this.router.navigate(["login"]);

          return null;
        })
      );

      this.$funderProjects = this.projectSvc.getFunderProjects(userId);
      this.$researcherProjects = this.projectSvc.getResearcherProjects(userId);
    });
  }

  isFunder(user: User.UserUnion) {
    return (user.roles as User.USER_ROLES[]).includes(User.USER_ROLES.FUNDER);
  }
  isReseracher(user: User.UserUnion) {
    return (user.roles as User.USER_ROLES[]).includes(
      User.USER_ROLES.RESEARCHER
    );
  }
  get localeDate() {
    return localeDate;
  }

  initUser(user: User.User) {
    this.signupFormGrp = this.fb.group({
      firstName: [""],
      lastName: [""],
      country: [""],
      email: [""],
      birthdate: [""],
    });
    this.signupFormGrp.patchValue({
      ...user.profile,
      email: user._id,
      birthdate: user.profile.birthdate
        ? new Date(user.profile.birthdate.$date)
        : null,
    });
  }

  toggleEdit() {
    this.edit = !this.edit;
    this.appearance = this.edit ? "outline" : "standard";
  }

  save($email: string) {
    this.loading = true;
    this.userSvc
      .patch(
        {
          profile: {
            firstName: this.signupFormGrp.value?.firstName,
            lastName: this.signupFormGrp.value?.lastName,
            country: this.signupFormGrp.value?.country,
            birthdate: new Mongo.Date(this.signupFormGrp.value?.birthdate),
          },
        },
        $email
      )
      .pipe(
        tap(() => {
          this.signupFormGrp.markAsPristine();
          this.toggleEdit();
          this.loading = false;
          this.ngOnInit();
          this.snackbarSvc.open("User details  succesfully updated");
        })
      )
      .subscribe();
  }
}
