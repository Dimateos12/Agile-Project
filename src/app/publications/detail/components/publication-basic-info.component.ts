import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { tap } from "rxjs";
import { Publication } from "src/app/core/models/publication";
import { PublicationService } from "src/app/core/services/publication.service";
import { SnackbarService } from "src/app/core/services/snackbar.service";
import { localeDate } from "src/app/core/utils/date";

@Component({
  selector: "app-publication-basic-info",
  template: `
    <mat-card *ngIf="publication">
      <mat-card-header>
        <mat-card-title class="mb-4"
          >BASIC PUBLICATION INFORMATIONS</mat-card-title
        >
        <div class="ms-auto">
          <app-edit-btn-group
            *ngIf="editable"
            [edit]="edit"
            (save)="saveDetails()"
            (cancel)="toggleEdit()"
            (toggleEdit)="toggleEdit()"
          ></app-edit-btn-group>
        </div>
      </mat-card-header>
      <mat-card-content *ngIf="formGroup">
        <ng-container [formGroup]="formGroup">
          <div class="row">
            <div class="mb-3">
              <app-editable-chip
                label="SOURCE"
                [isEdit]="edit"
                [readonly]="true"
                [selected]="true"
                [value]="publication.DOI ? 'External' : 'Internal'"
                [formFieldColSpan]="2"
              ></app-editable-chip>
              <app-editable-chip
                label="Budget"
                [isEdit]="edit"
                [controlName]="'budget'"
                [value]="
                  (publication.budget?.amount | currency: 'EUR') || 'n/a'
                "
                [formGroup]="formGroup"
                [formFieldColSpan]="2"
              ></app-editable-chip>
              <app-editable-chip
                label="Owner"
                [controlName]="'owner'"
                [formGroup]="formGroup"
                [value]="publication.owner?._id || 'n/a'"
                [formFieldColSpan]="2"
              ></app-editable-chip>
            </div>
          </div>
          <div class="row">
            <div class="mb-3">
              <app-editable-chip
                label="DOI"
                [isEdit]="edit"
                [readonly]="true"
                [value]="publication.DOI || publication.internal_DOI"
                [formFieldColSpan]="2"
              ></app-editable-chip>

              <span class="pointer">
                <app-editable-chip
                  label="URL"
                  [clickable]="true"
                  [isEdit]="edit"
                  [controlName]="'URL'"
                  [formGroup]="formGroup"
                  [value]="publication.URL || publication.url"
                  [formFieldColSpan]="4"
                ></app-editable-chip>
              </span>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="mb-3">
                <app-editable-chip
                  label="Publication type"
                  [isEdit]="edit"
                  [formFieldType]="'select'"
                  [controlName]="'type'"
                  [formGroup]="formGroup"
                  [value]="publication.type"
                  [selectOptions]="[
                    { label: 'Journal Article', value: 'journal-article' },
                    { label: 'Book Chapter', value: 'book-chapter' }
                  ]"
                >
                </app-editable-chip>

                <app-editable-chip
                  label="Created"
                  [isEdit]="edit"
                  [readonly]="true"
                  [value]="
                    localeDate(
                      publication.created?.timestamp ??
                        publication.internal.creationDate.$date,
                      'MM/DD/YYYY'
                    )
                  "
                ></app-editable-chip>

                <ng-container *ngIf="publication.deposited">
                  <app-editable-chip
                    label="Deposited"
                    [isEdit]="edit"
                    [readonly]="true"
                    [value]="
                      localeDate(publication.deposited?.timestamp, 'MM/DD/YYYY')
                    "
                  ></app-editable-chip>
                </ng-container>

                <app-editable-chip
                  label="Publisher"
                  [isEdit]="edit"
                  [controlName]="'publisher'"
                  [formGroup]="formGroup"
                  [value]="publication.publisher"
                ></app-editable-chip>
              </div>
            </div>
            <div class="col-12 col-md-9">
              <mat-form-field [appearance]="'standard'">
                <mat-label>Title</mat-label>
                <input
                  [value]="publication.title"
                  [readonly]="!edit"
                  matInput
                  formControlName="title"
                  placeholder="Publication title"
                />
              </mat-form-field>
            </div>
          </div>
        </ng-container>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      :host {
        .row {
          margin-bottom: 1rem;
        }

        mat-form-field {
          width: 100%;
        }

        mat-card-title {
          font-size: 13px;
        }

        mat-card-content {
          min-height: 80px;
          .row {
            margin-bottom: unset;
          }
          .logo {
            img {
              max-width: 150px;
              max-height: 150px;
            }

            label {
              color: rgba(0, 0, 0, 0.6);
              font-size: 10px;
            }
          }
        }

        mat-card {
          &.edit {
            border: 1px solid #3f51b56b;
          }
          &.invalid {
            border: 1px solid red;
          }
        }

        mat-card-header button {
          max-height: 30px;
          line-height: 30px;
        }

        ::ng-deep .mat-card-header-text {
          margin: 0;
        }
      }
    `,
  ],
})
export class PublicationBasicInfoComponent {
  edit = false;

  formGroup: FormGroup;

  @Input() publication!: Publication.Publication;
  @Input() editable = false;

  @Output() reloadEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private publicationSvc: PublicationService,
    private snackbarSvc: SnackbarService
  ) {
    this.formGroup = this.fb.group({
      title: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      publisher: new FormControl("", [Validators.required]),
      URL: new FormControl("", [Validators.required]),
      budget: new FormControl("", [Validators.required]),
      owner: new FormControl("", [Validators.required]),
    });
  }

  ngOnChanges() {
    this.formGroup.patchValue({
      ...this.publication,
      owner: this.publication.owner?._id ?? "",
      budget: this.publication.budget?.amount || "n/a",
    });
  }

  toggleEdit() {
    this.edit = !this.edit;
  }

  get localeDate() {
    return localeDate;
  }

  saveDetails() {
    this.publicationSvc
      .patch(
        {
          ...this.formGroup.value,
          owner: { _id: this.formGroup.value.owner },
          budget: { amount: this.formGroup.value.budget },
        },
        this.publication._id.$oid
      )
      .pipe(
        tap(() => {
          this.formGroup.markAsPristine();
          this.toggleEdit();
          this.reloadEvent.emit();
          this.snackbarSvc.open("Publication succesfully updated");
        })
      )
      .subscribe();
  }
}
