import { MatSelectChange } from "@angular/material/select";
import { Component, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Project } from "src/app/core/models/project";
import { ProjectService } from "src/app/core/services/manager/project.service";
import { ProjectCreateDialogComponent } from "src/app/manage/projects/project-create-dialog/project-create-dialog.component";
import { User } from "src/app/core/models/user";

@Component({
  selector: "app-sub-projects-add-dialog",
  template: `<h2 mat-dialog-title>Add a subproject</h2>
    <div mat-dialog-content class="mat-typography">
      <mat-form-field
        *ngIf="data.baseProjects.length > 0; else noProjectsAvailable"
        appearance="outline"
      >
        <mat-label>Select an existing project</mat-label>
        <mat-select (selectionChange)="projectSelected($event)">
          <mat-option
            *ngFor="let project of data.baseProjects"
            [value]="project"
            >{{ project.code }}</mat-option
          >
        </mat-select>
      </mat-form-field>

      <div class="d-flex flex-column align-items-center justify-content-center">
        <span>or</span>
        <button (click)="createNewSubProject()" mat-button>
          Create a new project
        </button>
      </div>

      <ng-template #noProjectsAvailable>
        <p>No projects are selectable</p>

        <button
          color="primary"
          class="mx-auto"
          mat-raised-button
          mat-dialog-close
          [routerLink]="['manage', 'projects']"
        >
          Add a new project
        </button>
      </ng-template>

      <app-project-overview-table
        *ngIf="selectedProject"
        [projects]="[selectedProject]"
        [isOverview]="true"
      ></app-project-overview-table>
    </div>
    <div mat-dialog-actions [dataLoading]="loading">
      <button mat-button mat-dialog-close cdkFocusInitial>Cancel</button>
      <button
        color="primary"
        [disabled]="!selectedProject"
        mat-button
        mat-raised-button
        (click)="addSubProject()"
      >
        Add
      </button>
    </div>`,
  styles: [
    `
      :host ::ng-deep .mat-form-field-wrapper {
        padding-bottom: 0;
      }
    `,
  ],
})
export class SubProjectAddDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      parentProject: Project.Project;
      baseProjects: Project.Project[];
      owners: User.Researcher[];
    },
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SubProjectAddDialogComponent>,
    private projectSvc: ProjectService
  ) {}

  selectedProject!: Project.Project;

  loading = false;

  projectSelected($event: MatSelectChange) {
    this.selectedProject = $event.value as Project.Project;
  }

  addSubProject() {
    this.loading = true;
    this.projectSvc
      .addSubProject(this.selectedProject, this.data.parentProject)
      .subscribe(() => {
        this.loading = false;
        this.dialogRef.close(true);
      });
  }

  createNewSubProject() {
    this.loading = true;
    const ref = this.dialog.open(ProjectCreateDialogComponent, {
      data: { owners: this.data.owners },
    });

    ref.componentInstance.asSubProject = true;

    ref.afterClosed().subscribe((projectId) => {
      if (!projectId) {
        this.loading = false;
        return;
      }
      this.projectSvc
        .addSubProject({ _id: { $oid: projectId } }, this.data.parentProject)
        .subscribe(() => {
          this.loading = false;
          this.dialogRef.close(true);
        });
    });
  }
}
