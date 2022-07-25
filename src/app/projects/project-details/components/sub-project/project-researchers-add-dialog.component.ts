import { User } from "./../../../../core/models/user";
import { MatSelectChange } from "@angular/material/select";
import { Component, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Project } from "src/app/core/models/project";
import { ProjectService } from "src/app/core/services/manager/project.service";

@Component({
  selector: "app-project-researchers-add-dialog",
  template: `<h2 mat-dialog-title>Add a researcher</h2>
    <div mat-dialog-content class="mat-typography">
      <mat-form-field
        *ngIf="data.researchers.length > 0; else noOption"
        appearance="outline"
      >
        <mat-label>Select researcher</mat-label>
        <mat-select (selectionChange)="selected($event)">
          <mat-option
            *ngFor="let researcher of data.researchers"
            [value]="researcher"
            >{{ researcher._id }}</mat-option
          >
        </mat-select>
      </mat-form-field>

      <ng-template #noOption>
        <p>No researcher selectable</p>
      </ng-template>
    </div>
    <div mat-dialog-actions [dataLoading]="loading">
      <button mat-button mat-dialog-close cdkFocusInitial>Cancel</button>
      <button
        color="primary"
        [disabled]="!selectedOption"
        mat-button
        mat-raised-button
        (click)="addSubProject()"
      >
        Add
      </button>
    </div>`,
  styles: [],
})
export class ProjectResearchersAddDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      parentProject: Project.Project;
      researchers: User.Researcher[];
    },
    public dialogRef: MatDialogRef<ProjectResearchersAddDialogComponent>,
    private projectSvc: ProjectService
  ) {}

  selectedOption!: User.Researcher;

  loading = false;

  selected($event: MatSelectChange) {
    this.selectedOption = $event.value;
  }

  addSubProject() {
    this.loading = true;
    this.projectSvc
      .addResearcher(this.selectedOption._id, this.data.parentProject._id.$oid)
      .subscribe(() => {
        this.loading = false;
        this.dialogRef.close(true);
      });
  }
}
