import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Project } from "../core/models/project";

@Component({
  selector: "app-delete-project-dialog",
  templateUrl: "./delete-project-dialog.component.html",
  styleUrls: ["./delete-project-dialog.component.scss"],
})
export class DeleteProjectDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { project: Project.Project },
    public dialogRef: MatDialogRef<DeleteProjectDialogComponent>
  ) {}

  ngOnInit(): void {}
}
