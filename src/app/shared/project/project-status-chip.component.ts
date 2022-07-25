import { Component, Input, OnInit } from "@angular/core";
import { Project } from "src/app/core/models/project";

@Component({
  selector: "app-project-status-chip",
  template: ` <mat-chip-list>
    <mat-chip selected [color]="getChipColor(project)">{{
      project.status
    }}</mat-chip>
  </mat-chip-list>`,
})
export class ProjectStatusChipComponent implements OnInit {
  @Input() project!: Project.Project;

  constructor() {}

  ngOnInit(): void {}

  getChipColor(project: Project.Project): string {
    if (project.status === Project.STATUS.OPEN) return "primary";
    if (project.status === Project.STATUS.CLOSED) return "accent";
    if (project.status === Project.STATUS.CANCELLED) return "warn";
    return "primary";
  }
}
