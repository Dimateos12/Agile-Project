import { HasManagerRoleGuard } from "./core/guards/has-manager-role.guard";
import { ProjectsComponent } from "./projects/projects.component";
import { PersonalPageComponent } from "./personalPage/personal-page/personal-page.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { LayoutComponent } from "./layout/layout.component";
import { HomeComponent } from "./home/home.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { LoginComponent } from "./login/login.component";
import { PasswordresetComponent } from "./passwordreset/passwordreset.component";
import { SignupComponent } from "./signup/signup.component";
import { AuthLayoutComponent } from "./layout/auth-layout.component";
import { ProjectDetailsComponent } from "./projects/project-details/project-details.component";
import { BreadcrumbService } from "xng-breadcrumb";
import { FunderComponent } from "./funder/funder.component";
import { MyProjectsComponent } from "./userArea/my-projects/my-projects.component";
import { UsersComponent } from "./users/users.component";
import { MyPublicationsComponent } from "./userArea/my-publications/my-publications.component";
import { DoiLookupComponent } from "./publications/doi-lookup/doi-lookup.component";
import { PublicationDetailContainerComponent } from "./publications/detail-container/publication-detail-container.component";
import { PublicationsManageComponent } from "./manage/publication/publications-manage.component";
import { PublicationsComponent } from "./projects/publications.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
      },
      {
        path: "funder",
        component: FunderComponent,
      },
      {
        path: "users",
        component: UsersComponent,
        children: [
          {
            path: ":userId",
            component: PersonalPageComponent,
            data: { breadcrumb: { alias: "userId" } },
          },
        ],
      },
      {
        path: "projects",
        data: { breadcrumb: "Projects" },
        children: [
          {
            path: "",
            component: ProjectsComponent,
          },
          {
            path: ":id",
            component: ProjectDetailsComponent,
            data: { breadcrumb: { alias: "projectDetails" } },
          },
        ],
      },
      {
        path: "publications",
        data: { breadcrumb: "Publications" },
        children: [
          {
            path: "",
            component: PublicationsManageComponent,
          },
          {
            path: ":id",
            component: PublicationDetailContainerComponent,
            data: { breadcrumb: { alias: "publicationDetails" } },
          },
        ],
      },
    ],
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "signup",
        component: SignupComponent,
      },
      {
        path: "login",
        component: LoginComponent,
      },
      {
        path: "passwordreset",
        component: PasswordresetComponent,
      },
    ],
  },
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "manage",
        canActivate: [AuthGuard, HasManagerRoleGuard],
        data: { breadcrumb: { alias: "management" } },
        children: [
          {
            path: "projects",
            children: [
              {
                path: "",
                data: { breadcrumb: { alias: "projects" } },
                component: ProjectsComponent,
              },
              {
                path: ":id",
                component: ProjectDetailsComponent,
                data: { breadcrumb: { alias: "projectDetails" } },
              },
            ],
          },
          {
            path: "publications",
            children: [
              {
                path: "",
                data: { breadcrumb: { alias: "publications" } },
                component: PublicationsComponent,
              },
              {
                path: ":id",
                component: PublicationDetailContainerComponent,
                data: { breadcrumb: { alias: "publicationDetails" } },
              },
            ],
          },
          {
            path: "**",
            redirectTo: "projects",
          },
        ],
      },
      {
        path: "account",
        canActivate: [AuthGuard],
        data: { breadcrumb: { alias: "personal-area" } },
        children: [
          {
            path: "projects",
            children: [
              {
                path: "",
                data: { breadcrumb: { alias: "my-projects" } },
                component: MyProjectsComponent,
              },
              {
                path: ":id",
                component: ProjectDetailsComponent,
                data: { breadcrumb: { alias: "projectDetails" } },
              },
            ],
          },
          {
            path: "publications",
            children: [
              {
                path: "",
                data: { breadcrumb: { alias: "my-publications" } },
                component: MyPublicationsComponent,
              },
              {
                path: "doiLookup/:id",
                data: { breadcrumb: { alias: "doi-lookup" } },
                component: DoiLookupComponent,
              },
              {
                path: ":id",
                component: PublicationDetailContainerComponent,
                data: { breadcrumb: { alias: "publicationDetails" } },
              },
            ],
          },
          {
            path: "**",
            redirectTo: "projects",
          },
        ],
      },
      {
        path: "profile",
        data: { breadcrumb: { alias: "personalPage" } },
        children: [
          {
            path: ":userId",
            component: PersonalPageComponent,
            data: { breadcrumb: { alias: "userName" } },
          },
          {
            path: "**",
            redirectTo: "/",
          },
        ],
      },
    ],
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {
  constructor(private breadcrumbSvc: BreadcrumbService) {
    this.breadcrumbSvc.set("@management", "Management");
    this.breadcrumbSvc.set("@myProjects", "My Projects");
    this.breadcrumbSvc.set("@personalPage", "Profile");
    this.breadcrumbSvc.set("@projects", "Projects");
    this.breadcrumbSvc.set("@publications", "Publications");
    this.breadcrumbSvc.set("@my-projects", "My Projects");
    this.breadcrumbSvc.set("@my-publications", "My Publications");
    this.breadcrumbSvc.set("@personal-area", "Personal Area");
    this.breadcrumbSvc.set("@doi-lookup", "Import publication from DOI");
  }
}
