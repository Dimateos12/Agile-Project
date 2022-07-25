import { Component, EventEmitter, Inject, Input } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { Observable } from "rxjs";
import { User } from "src/app/core/models/user";

@Component({
  selector: "app-publication-create-dialog",
  template: ` <h2 mat-dialog-title>Create new publication</h2>
    <mat-dialog-content class="mat-typography">
      <mat-tab-group mat-align-tabs="start" [(selectedIndex)]="tabIdx">
        <mat-tab label="Manual">
          <div class="py-3">
            <app-publication-form
              [saveEvent]="saveEvent"
              [formGroup]="publicationFormCtrl"
            ></app-publication-form>
          </div>
        </mat-tab>
        <mat-tab label="Import from DOI">
          <div class="py-3">
            <app-publication-from-doi
              [importEvent]="importEvent"
            ></app-publication-from-doi>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>

    <mat-dialog-actions [dataLoading]="loading">
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        *ngIf="tabIdx == 0"
        [disabled]="!publicationFormCtrl.valid"
        color="primary"
        (click)="loading = true; saveEvent.emit()"
        mat-raised-button
      >
        Create
      </button>
      <button
        *ngIf="tabIdx == 1"
        color="primary"
        (click)="loading = true; importEvent.emit()"
        mat-raised-button
      >
        Import
      </button>
    </mat-dialog-actions>`,
})
export class PublicationCreateDialogComponent {
  @Input() asSubProject = false;

  projectFormGroup!: FormGroup;

  appearance: MatFormFieldAppearance = "outline";

  researchers$!: Observable<User.Researcher[]>;

  tabIdx = 0;

  loading = false;

  saveEvent = new EventEmitter<any>();
  importEvent = new EventEmitter<any>();

  publicationFormCtrl!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { owners: User.Researcher[] },
    private fb: FormBuilder
  ) {
    this.publicationFormCtrl = this.fb.group({
      title: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      publisher: new FormControl("", [Validators.required]),
      url: new FormControl("", [Validators.required]),
      author: new FormArray([]),
    });
  }
}
