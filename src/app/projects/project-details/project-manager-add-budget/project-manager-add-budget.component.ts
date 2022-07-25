import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Project } from "src/app/core/models/project";
import { ProjectService } from "src/app/core/services/manager/project.service";

@Component({
  selector: "app-project-manager-add-budget",
  templateUrl: "./project-manager-add-budget.component.html",
  styleUrls: ["./project-manager-add-budget.component.scss"],
})
export class ProjectManagerAddBudgetComponent implements OnInit {

  //updateBudgetFg!: FormGroup;
updateBudgetFg = new FormGroup({
    generalAmount: new FormControl(),
    description: new FormControl()
});
  
  constructor(
    private projectsvc: ProjectService,
    public dialogRef: MatDialogRef<ProjectManagerAddBudgetComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      project: Project.Project;
    }
  ) {}


  updateBudget() {
    this.projectsvc.patch(
      { budget: { 
        generalAmount: this.updateBudgetFg.value?.generalAmount, 
        description: this.updateBudgetFg.value?.description } },
      this.data.project._id.$oid
    ).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  ngOnInit(): void {}
}
