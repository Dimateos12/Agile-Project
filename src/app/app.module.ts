import { PublicationsComponent } from "./projects/publications.component";
import { PublicationsManageComponent } from "./manage/publication/publications-manage.component";
import { PublicationOverviewTableComponent } from "./projects/project-details/components/sub-project/publication-overview-table.component";
import { UserOverviewTableComponent } from "./shared/user/user-overview-table.component";
import { ProjectResearchersAddDialogComponent } from "./projects/project-details/components/sub-project/project-researchers-add-dialog.component";
import { SubProjectAddDialogComponent } from "./projects/project-details/components/sub-project/sub-project-add-dialog.component";
import { ProjectCreateDialogComponent } from "./manage/projects/project-create-dialog/project-create-dialog.component";
import { ProjectOverviewTableComponent } from "./projects/project-details/components/sub-project/project-overview-table.component";
import { ProjectStatusChipComponent } from "./shared/project/project-status-chip.component";
import { LogoComponent } from "./layout/logo/logo.component";
import { AuthLayoutComponent } from "./layout/auth-layout.component";
import { TrimPipe } from "./core/pipes/trim-pipe";
import { AuthGuard } from "./core/guards/auth.guard";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { LayoutComponent } from "./layout/layout.component";
import { TopbarComponent } from "./layout/topbar/topbar.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "./login/login.component";
import { PasswordresetComponent } from "./passwordreset/passwordreset.component";
import { SignupComponent } from "./signup/signup.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpTokenInterceptor } from "./core/interceptors/http-token.interceptor";
import { GlobalRequestErrorHandlerInterceptor } from "./core/interceptors/global-request-error-handler.interceptor";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatGridListModule } from "@angular/material/grid-list";
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { DividerComponent } from "./shared/divider/divider.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSelectCountryModule } from "@angular-material-extensions/select-country";
import { NgOtpInputModule } from "ng-otp-input";
import { SpinnerButtonDirective } from "./core/directives/data-loading.directive";
import { ProjectsTableComponent } from "./manage/projects/projects-table/projects-table.component";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ProjectDetailsComponent } from "./projects/project-details/project-details.component";
import { BreadcrumbComponent } from "./shared/breadcrumb/breadcrumb.component";
import { BreadcrumbModule, BreadcrumbService } from "xng-breadcrumb";
import { ProjectFormComponent } from "./manage/projects/project-create-dialog/components/project-form/project-form.component";
import { MatSelectModule } from "@angular/material/select";
import { DeleteProjectDialogComponent } from "./delete-project-dialog/delete-project-dialog.component";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatChipsModule } from "@angular/material/chips";
import { InlineSVGModule } from "ng-inline-svg";
import { FunderComponent } from "./funder/funder.component";
import { PersonalPageComponent } from "./personalPage/personal-page/personal-page.component";
import { ProjectsComponent } from "./projects/projects.component";
import { IdenticonComponent } from "./shared/identicon/identicon.component";
import { MyProjectsComponent } from "./userArea/my-projects/my-projects.component";
import { UserInfoComponent } from "./users/user-info/user-info.component";
import { UsersTableComponent } from "./users/users-table/users-table.component";
import { UsersComponent } from "./users/users.component";
import { MatMenuModule } from "@angular/material/menu";
import { MyPublicationsComponent } from "./userArea/my-publications/my-publications.component";
import { PublicationsTableComponent } from "./publications/publications-table/publications-table.component";
import { PublicationCreateDialogComponent } from "./publications/dialogs/create-publication/publication-add-dialog.component";
import { PublicationFormComponent } from "./publications/dialogs/create-publication/publication-form/publication-form.component";
import { MatTabsModule } from "@angular/material/tabs";
import { PublicationFromDoiComponent } from "./publications/dialogs/create-publication/publication-from-doi/publication-from-doi.component";
import { DoiLookupComponent } from "./publications/doi-lookup/doi-lookup.component";
import { PublicationUserOverviewTableComponent } from "./publications/detail/components/publication-user-overview-table.component";
import { PublicationDetailsComponent } from "./publications/detail/publication-details.component";
import { PublicationLinkTableComponent } from "./publications/detail/components/publication-link-table.component";
import { PublicationReferenceTableComponent } from "./publications/detail/components/publication-reference-table.component";
import { PublicationAssertionTableComponent } from "./publications/detail/components/publication-assertion-table.component";
import { PublicationDetailContainerComponent } from "./publications/detail-container/publication-detail-container.component";
import { EditableChipComponent } from "./shared/editable-chip/editable-chip.component";
import { EditBtnGroupComponent } from "./shared/edit-btn-group/edit-btn-group.component";
import { PublicationBasicInfoComponent } from "src/app/publications/detail/components/publication-basic-info.component";
import { AuthorsFormFieldComponent } from "./publications/dialogs/create-publication/publication-form/components/authors-form-field/authors-form-field.component";
import { ProjectManagerAddBudgetComponent } from './projects/project-details/project-manager-add-budget/project-manager-add-budget.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LogoComponent,
    FooterComponent,
    LayoutComponent,
    AuthLayoutComponent,
    TopbarComponent,
    NotFoundComponent,
    LoginComponent,
    PasswordresetComponent,
    ProjectCreateDialogComponent,
    ProjectResearchersAddDialogComponent,
    SubProjectAddDialogComponent,
    ProjectStatusChipComponent,
    ProjectOverviewTableComponent,
    MyProjectsComponent,
    SignupComponent,
    DividerComponent,
    ProjectsComponent,
    SpinnerButtonDirective,
    TrimPipe,
    ProjectsTableComponent,
    ProjectDetailsComponent,
    BreadcrumbComponent,
    ProjectFormComponent,
    DeleteProjectDialogComponent,
    PersonalPageComponent,
    IdenticonComponent,
    FunderComponent,
    ProjectsComponent,
    UserOverviewTableComponent,
    UsersComponent,
    UsersTableComponent,
    UserInfoComponent,
    UserOverviewTableComponent,
    MyPublicationsComponent,
    PublicationsTableComponent,
    PublicationCreateDialogComponent,
    PublicationFormComponent,
    PublicationFromDoiComponent,
    DoiLookupComponent,
    PublicationsComponent,
    PublicationDetailsComponent,
    PublicationUserOverviewTableComponent,
    PublicationAssertionTableComponent,
    PublicationLinkTableComponent,
    PublicationReferenceTableComponent,
    PublicationDetailContainerComponent,
    PublicationBasicInfoComponent,
    PublicationOverviewTableComponent,
    PublicationsManageComponent,
    EditableChipComponent,
    EditBtnGroupComponent,
    AuthorsFormFieldComponent,
    ProjectManagerAddBudgetComponent,
  ],
  imports: [
    BrowserModule,
    BreadcrumbModule,
    AppRoutingModule,
    NgbModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatDividerModule,
    MatSidenavModule,
    MatCardModule,
    MatSnackBarModule,
    HttpClientModule,
    MatStepperModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatTabsModule,
    MatMenuModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    InlineSVGModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDatepickerModule,
    MatGridListModule,
    MatNativeDateModule,
    NgOtpInputModule,
    MatPaginatorModule,
    MatChipsModule,
    MatSelectCountryModule.forRoot("en"),
    MatTableModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalRequestErrorHandlerInterceptor,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: "en" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: "MM/DD/YYYY",
        },
        display: {
          dateInput: "MM/DD/YYYY",
          monthYearLabel: "MMM YYYY",
          dateA11yLabel: "LL",
          monthYearA11yLabel: "MMMM YYYY",
        },
      },
    },
    AuthGuard,
    BreadcrumbService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
