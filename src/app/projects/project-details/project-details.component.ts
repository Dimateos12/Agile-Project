import { PublicationService } from "src/app/core/services/publication.service";
import { AuthService } from "./../../core/services/auth.service";
import { ProjectResearchersAddDialogComponent } from "./components/sub-project/project-researchers-add-dialog.component";
import { StoreService } from "./../../core/store/store.service";
import { toSvg } from "jdenticon";
import { SubProjectAddDialogComponent } from "./components/sub-project/sub-project-add-dialog.component";
import { SnackbarService } from "./../../core/services/snackbar.service";
import { User } from "./../../core/models/user";
import { FormGroup, Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { ActivatedRoute } from "@angular/router";
import { Observable, tap } from "rxjs";
import { Project } from "src/app/core/models/project";
import { ProjectService } from "src/app/core/services/manager/project.service";
import { localeDate, dateToMongo } from "src/app/core/utils/date";
import { BreadcrumbService } from "xng-breadcrumb";
import { Mongo } from "src/app/core/models/mongo";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { UserService } from "src/app/core/services/user.services";
import { Publication } from "src/app/core/models/publication";
import { Signup } from "src/app/signup/signup.component";
import { ProjectManagerAddBudgetComponent } from "./project-manager-add-budget/project-manager-add-budget.component";

@Component({
  selector: "app-project-details",
  templateUrl: "./project-details.component.html",
  styleUrls: ["./project-details.component.scss"],
})
export class ProjectDetailsComponent implements OnInit {
  user!: User.UserUnion | null;
  $project!: Observable<Project.Project>;

  $researchers!: Observable<User.Researcher[]>;
  $funders!: Observable<User.Funder[]>;

  $baseProjects!: Observable<Project.Project[]>;

  $subProjects!: Observable<Project.Project[]>;
  $parentProject!: Observable<Project.Project>;

  $publications!: Observable<Publication.Publication[]>;
  $projectPublications!: Observable<Publication.Publication[]>;

  $projectResearchers!: Observable<User.Researcher[]>;

  edit = false;
  loading = false;

  appearance: MatFormFieldAppearance = "standard";

  projectDetailsFg!: FormGroup;

  projectStatus = Project.STATUS;

  projectType = Project.TYPE;

  @ViewChild("addFunderDialogTpl")
  addFunderDialogTpl!: TemplateRef<any>;

  selectedFunder!: User.Funder;
  addFunderFg!: FormGroup;
  addFunderTabIdx = 0;
  addFunderError!: string;

  @ViewChild("addPublicationDialogTpl")
  addPublicationDialogTpl!: TemplateRef<any>;
  addPublicationFg!: FormGroup;
  selectedPublication!: Publication.Publication;

  constructor(
    public userSvc: UserService,
    private projectSvc: ProjectService,
    private publicationSvc: PublicationService,
    private storeSvc: StoreService,
    private authSvc: AuthService,
    private breadcrumbSvc: BreadcrumbService,
    private snackbarSvc: SnackbarService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      const projectId = routeParams["id"];

      this.storeSvc
        .getUser()
        .pipe(tap((user) => (this.user = user)))
        .subscribe();

      this.$project = this.projectSvc.getById(projectId).pipe(
        tap((project: Project.Project) => {
          this.initForm(project);
          this.breadcrumbSvc.set("@projectDetails", project.code);
          this.$projectPublications =
            project.publications &&
            this.publicationSvc.getByIds(
              project.publications.map((p) => p._id.$oid)
            );

          if (project.parentProject?._id)
            this.$parentProject = this.projectSvc.getById(
              project.parentProject._id.$oid
            );

          if (project.researchers?.length)
            this.$projectResearchers =
              this.projectSvc.getProjectResearchers(project);
        })
      );

      this.$subProjects = this.projectSvc.getSubProjects(projectId);
      this.$baseProjects = this.projectSvc.getBaseProjects(projectId);

      this.$researchers = this.userSvc.getResearchers();
      this.$funders = this.userSvc.getFunders();
      this.$publications = this.publicationSvc.get();
    });
  }

  save($oid: string) {
    this.loading = true;
    this.projectSvc
      .patch(
        {
          title: this.projectDetailsFg.value?.title,
          description: this.projectDetailsFg.value?.description,
          owner: { _id: this.projectDetailsFg.value?.owner } as User.Researcher,
          status: this.projectDetailsFg.value?.status,
          startingDate: new Mongo.Date(
            this.projectDetailsFg.value.startingDate
          ),
          dueDate: new Mongo.Date(this.projectDetailsFg.value?.endingDate),
        },
        $oid
      )
      .pipe(
        tap(() => {
          this.projectDetailsFg.markAsPristine();
          this.toggleEdit();
          this.loading = false;
          this.ngOnInit();
          this.snackbarSvc.open("Project succesfully updated");
        })
      )
      .subscribe();
  }

  toggleEdit() {
    this.edit = !this.edit;
    this.appearance = this.edit ? "outline" : "standard";
  }

  initForm(project: Project.Project) {
    this.projectDetailsFg = this.fb.group({
      code: [project.code],
      owner: [project.owner?._id, Validators.required],
      status: [project.status, Validators.required],
      title: [project.title, Validators.required],
      description: [project.description, Validators.required],
      startingDate: [
        project.startingDate ? new Date(project.startingDate.$date) : null,
        Validators.required,
      ],
      endingDate: [project.dueDate ? new Date(project.dueDate?.$date) : null],
    });

    this.addFunderFg = this.fb.group({
      email: ["", [Validators.required]],
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
    });

    this.addPublicationFg = this.fb.group({
      publication: [null, [Validators.required]],
    });
  }

  get localeDate() {
    return localeDate;
  }

  /** Sub projects */

  openSubProjectAddDialog(
    parentProject: Project.Project,
    baseProjects: Project.Project[],
    owners: User.Researcher[]
  ) {
    this.dialog
      .open(SubProjectAddDialogComponent, {
        data: { parentProject, baseProjects, owners },
      })
      .afterClosed()
      .subscribe((subProjectAdded) => {
        if (subProjectAdded) {
          this.ngOnInit();
          this.snackbarSvc.open("Sub project added");
        }
      });
  }

  openBudgetUpdateDialog(    
    project: Project.Project,
  ) {
      this.dialog
      .open(ProjectManagerAddBudgetComponent, {
        data: { project: project },
      })
      .afterClosed()
      .subscribe(() => {
          this.ngOnInit();
          this.snackbarSvc.open("Budget Updated");
        }
      );
  }

  removeSubProject(
    subProject: Project.Project,
    parentProject: Project.Project
  ) {
    this.projectSvc
      .removeSubProject(subProject, parentProject)
      .subscribe(() => {
        this.snackbarSvc.open("Sub project removed");
        this.ngOnInit();
      });
  }

  toSvg(seed: string, size: number) {
    return this.sanitizer.bypassSecurityTrustHtml(toSvg(seed, size));
  }

  isOwner(user: User.UserUnion, project: Project.Project) {
    return user?._id === project.owner?._id;
  }

  openResearchersAddDialog(
    parentProject: Project.Project,
    researchers: User.Researcher[]
  ) {
    this.dialog
      .open(ProjectResearchersAddDialogComponent, {
        data: { parentProject, researchers },
      })
      .afterClosed()
      .subscribe((subProjectAdded) => {
        if (subProjectAdded) {
          this.ngOnInit();
          this.snackbarSvc.open("Researcher added");
        }
      });
  }

  openFundersAddDialog(project: Project.Project) {
    this.dialog
      .open(this.addFunderDialogTpl)
      .afterClosed()
      .subscribe((added) => {
        if (added) {
          if (this.addFunderTabIdx === 0) {
            this.addFunderToProject(project, this.selectedFunder);
          } else {
            this.inviteFunder(project);
          }
        } else console.log("aborted");
      });
  }

  addFunderToProject(project: Project.Project, funder: User.Funder) {
    this.projectSvc.addFunder(project._id.$oid, funder).subscribe(() => {
      this.snackbarSvc.open("Funder added");
      this.ngOnInit();
    });
  }

  openPublicationAddDialog(project: Project.Project) {
    this.dialog
      .open(this.addPublicationDialogTpl)
      .afterClosed()
      .subscribe((added) => {
        if (added) {
          const publication: Publication.Publication =
            this.addPublicationFg.value.publication;

          this.addPublicationToProject(project, publication);
        } else console.log("aborted");
      });
  }

  addPublicationToProject(
    project: Project.Project,
    publication: Publication.Publication
  ) {
    this.projectSvc
      .addPublication(project._id.$oid, publication)
      .subscribe(() => {
        this.snackbarSvc.open("Publication added");
        this.ngOnInit();
      });
  }

  removePublication(publicationId: string, project: Project.Project) {
    this.projectSvc
      .removePublication(project._id.$oid, publicationId)
      .subscribe(() => {
        this.snackbarSvc.open("Publication removed");
        this.ngOnInit();
      });
  }

  removeResearcher(researcher: User.Researcher, project: Project.Project) {
    this.projectSvc
      .removeResearcher(researcher._id, project._id.$oid)
      .subscribe(() => {
        this.snackbarSvc.open("Researcher removed");
        this.ngOnInit();
      });
  }

  removeFunder(researcher: User.Researcher, project: Project.Project) {
    this.projectSvc
      .removeFunder(researcher._id, project._id.$oid)
      .subscribe(() => {
        this.snackbarSvc.open("Funder removed from project");
        this.ngOnInit();
      });
  }

  updateProject(body: Partial<Project.Project>, project: Project.Project) {
    this.projectSvc.patch(body, project._id.$oid).subscribe(() => {
      this.snackbarSvc.open("Project updated");
      this.ngOnInit();
    });
  }

  inviteFunder(project: Project.Project) {
    const funder = {
      _id: this.addFunderFg.value.email,
      profile: {
        firstName: this.addFunderFg.value.firstName,
        lastName: this.addFunderFg.value.lastName,
        country: "",
      },
      roles: ["funder"],
    };

    this.authSvc
      .signup(funder as Signup)
      .pipe(
        tap((res) => {
          if (res.status === 201) {
            this.addFunderToProject(project, funder as User.Funder);
          } else if (res.status === 409) {
            this.addFunderError = "Funder already exists";
          }
        })
      )
      .subscribe((user) => {});
  }
}
