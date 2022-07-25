import { MatFormFieldAppearance } from "@angular/material/form-field";
import { User } from "../../../../../core/models/user";
import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-project-form",
  templateUrl: "./project-form.component.html",
  styleUrls: ["./project-form.component.scss"],
})
export class ProjectFormComponent {
  @Input() owners!: User.Researcher[];
  @Input() projectFormGroup!: FormGroup;

  appearance: MatFormFieldAppearance = 'outline';

  
}
