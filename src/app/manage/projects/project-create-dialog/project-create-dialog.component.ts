import { SnackbarService } from "src/app/core/services/snackbar.service";
import { HttpResponse } from "@angular/common/http";
import { Component, Inject, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { Mongo } from "src/app/core/models/mongo";
import { Project } from "src/app/core/models/project";
import { User } from "src/app/core/models/user";
import { ProjectService } from "src/app/core/services/manager/project.service";
import { oidFromResponseHeaders } from "src/app/core/utils/generic";

@Component({
  selector: "app-project-create-dialog",
  template: ` <h2 mat-dialog-title>Create new project</h2>
    <mat-dialog-content class="mat-typography">
      <app-project-form
        [projectFormGroup]="projectFormGroup"
        [owners]="data.owners"
      ></app-project-form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        [disabled]="projectFormGroup.invalid"
        color="primary"
        (click)="save()"
        mat-raised-button
      >
        Create
      </button>
    </mat-dialog-actions>`,
})
export class ProjectCreateDialogComponent {
  @Input() asSubProject = false;

  public statusOptions = Object.values(Project.STATUS);

  projectFormGroup!: FormGroup;

  appearance: MatFormFieldAppearance = "outline";

  researchers$!: Observable<User.Researcher[]>;

  loading = false;

  myDate = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbarSvc: SnackbarService,
    private projectSvc: ProjectService,
    private dialogRef: MatDialogRef<ProjectCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { owners: User.Researcher[] }
  ) {
    this.projectFormGroup = this.fb.group({
      owner: ["", [Validators.required]],
      title: ["", [Validators.required]],
      beginDate: ["", Validators.required],
      endDate: ["", Validators.required],
      parentProject: [""],
      fundersList: [""],
      amount: [""],
      description: ["", [Validators.required]],
    });
  }

  save() {
    this.projectSvc
      .post({
        title: this.projectFormGroup.value.title,
        owner: {
          _id: this.projectFormGroup.value.owner,
        } as User.Researcher,
        description: this.projectFormGroup.value.description,
        startingDate: new Mongo.Date(this.projectFormGroup.value?.beginDate),
        dueDate: new Mongo.Date(this.projectFormGroup.value?.endDate),
        type: Project.TYPE.BASE,
      })
      .pipe(
        tap((response: HttpResponse<Partial<Project.Project>>) => {
          const $oid = oidFromResponseHeaders(response);
          this.dialogRef.close($oid);

          if (!this.asSubProject) {
            this.router.navigate(["manage", "projects", $oid]);
            this.snackbarSvc.open("Project created succesfully");
          }
        })
      )
      .subscribe();
  }
}
