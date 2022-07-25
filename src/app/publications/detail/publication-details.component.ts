import { PublicationLinkTableComponent } from "./components/publication-link-table.component";
import { environment } from "src/environments/environment";
import { MatSelectChange } from "@angular/material/select";
import { UserService } from "src/app/core/services/user.services";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Publication } from "src/app/core/models/publication";
import { User } from "src/app/core/models/user";
import { PublicationService } from "src/app/core/services/publication.service";
import { localeDate } from "src/app/core/utils/date";
import { Observable, tap } from "rxjs";
import { SnackbarService } from "src/app/core/services/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { Mongo } from "src/app/core/models/mongo";

@Component({
  selector: "app-publication-detail",
  templateUrl: "./publication-details.component.html",
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
export class PublicationDetailsComponent implements OnChanges {
  @Input()
  publication!: Publication.Publication;

  @Input()
  user: User.UserUnion | null = null;

  @Output() reloadEvent = new EventEmitter();

  @ViewChild("addAuthorsDialogTpl")
  addAuthorsDialogTpl!: TemplateRef<any>;
  @ViewChild("addLinkDialogTpl")
  addLinkDialogTpl!: TemplateRef<any>;
  @ViewChild("addAssertionDialogTpl")
  addAssertionDialogTpl!: TemplateRef<any>;
  @ViewChild("addReferenceDialogTpl")
  addReferenceDialogTpl!: TemplateRef<any>;

  @ViewChild("updateReferencesCountsDialogTpl")
  updateReferencesCountsDialogTpl!: TemplateRef<any>;

  authors!: User.UserUnion[];

  addLinkFg: FormGroup;
  addAssertionFg: FormGroup;
  addReferenceFg: FormGroup;

  updateReferencesCountsFg: FormGroup;

  addAuthorFg: FormGroup;
  addAuthorTabIdx = 0;
  _selectedAuthor!: User.Researcher;
  $researchers!: Observable<User.Researcher[]>;

  edit = false;

  constructor(
    private dialog: MatDialog,
    private publicationSvc: PublicationService,
    private snackbarSvc: SnackbarService,
    private userSvc: UserService
  ) {
    this.addAuthorFg = new FormGroup({
      given: new FormControl("", Validators.required),
      family: new FormControl("", Validators.required),
      ORCID: new FormControl(""),
      _id: new FormControl(""),
    });

    this.addAssertionFg = new FormGroup({
      label: new FormControl(""),
      value: new FormControl(""),
      name: new FormControl(""),
    });

    this.addLinkFg = new FormGroup({
      URL: new FormControl(""),
      "content-type": new FormControl(""),
      "content-version": new FormControl(""),
      "intended-application": new FormControl(""),
    });

    this.addReferenceFg = new FormGroup({
      key: new FormControl(""),
      unstructured: new FormControl(""),
      "first-page": new FormControl(""),
      "article-title": new FormControl(""),
      volume: new FormControl(""),
      author: new FormControl(""),
      year: new FormControl(""),
      "journal-title": new FormControl(""),
      "series-title": new FormControl(""),
      "doi-asserted-by": new FormControl(""),
      DOI: new FormControl(""),
      issue: new FormControl(""),
    });

    this.updateReferencesCountsFg = new FormGroup({
      "references-count": new FormControl(""),
      "reference-count": new FormControl(""),
      "is-referenced-by-count": new FormControl(""),
    });
  }

  ngOnChanges() {
    if (this.publication?.author) {
      this.authors = this.getUsers(this.publication.author);
    }
    this.$researchers = this.userSvc.getResearchers();

    this.updateReferencesCountsFg.patchValue({
      "references-count": this.publication["references-count"],
      "reference-count": this.publication["reference-count"],
      "is-referenced-by-count": this.publication["is-referenced-by-count"],
    });
  }

  get localeDate() {
    return localeDate;
  }

  getUsers(authors: any[]): User.UserUnion[] {
    return authors.map((author) => ({
      _id: author._id ?? null,
      ORCID: author.ORCID ?? null,
      profile: {
        firstName: author.given || author.profile?.firstName,
        lastName: author.family || author.profile?.lastName,
      },
      roles: [],
    })) as any as User.UserUnion[];
  }

  navigate(url: string) {
    window.open(url, "_blank");
  }

  openAddAuthorsDialog() {
    const dialogRef = this.dialog.open(this.addAuthorsDialogTpl);

    dialogRef
      .afterClosed()
      .pipe(
        tap((save: boolean) => {
          if (!save) return;

          this.publicationSvc
            .patch(
              {
                author: [
                  ...this.publication.author,
                  this.addAuthorTabIdx == 0
                    ? { ...this.addAuthorFg.value, _id: new Mongo.ObjectId() }
                    : { ...this.addAuthorFg.value },
                ],
              },
              this.publication._id.$oid
            )
            .pipe(
              tap(() => {
                this.reloadEvent.emit();
                this.snackbarSvc.open("Publication succesfully updated");
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  openAddLinkDialog() {
    const dialogRef = this.dialog.open(this.addLinkDialogTpl);

    dialogRef
      .afterClosed()
      .pipe(
        tap((save: boolean) => {
          if (!save) return;

          this.publicationSvc
            .patch(
              {
                link: [
                  ...(this.publication.link || []),
                  { ...this.addLinkFg.value, _id: new Mongo.ObjectId() },
                ],
              },
              this.publication._id.$oid
            )
            .pipe(
              tap(() => {
                this.reloadEvent.emit();
                this.snackbarSvc.open("Publication succesfully updated");
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  openAddReferenceDialog() {
    const dialogRef = this.dialog.open(this.addReferenceDialogTpl);

    dialogRef
      .afterClosed()
      .pipe(
        tap((save: boolean) => {
          if (!save) return;

          this.publicationSvc
            .patch(
              {
                reference: [
                  ...(this.publication.reference || []),
                  { ...this.addReferenceFg.value, _id: new Mongo.ObjectId() },
                ],
              },
              this.publication._id.$oid
            )
            .pipe(
              tap(() => {
                this.reloadEvent.emit();
                this.snackbarSvc.open("Publication succesfully updated");
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  openAddAssertionDialog() {
    const dialogRef = this.dialog.open(this.addAssertionDialogTpl);

    dialogRef
      .afterClosed()
      .pipe(
        tap((save: boolean) => {
          if (!save) return;

          this.publicationSvc
            .patch(
              {
                assertion: [
                  ...(this.publication.assertion || []),
                  { ...this.addAssertionFg.value, _id: new Mongo.ObjectId() },
                ],
              },
              this.publication._id.$oid
            )
            .pipe(
              tap(() => {
                this.reloadEvent.emit();
                this.snackbarSvc.open("Publication succesfully updated");
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  removeAuthor(_id: { $oid: string } & string) {
    if (_id) {
      this.publicationSvc
        .patch(
          {
            author: this.publication.author.filter((a) => {
              if (_id.$oid) {
                return _id.$oid !== a._id.$oid;
              } else return _id !== a._id;
            }),
          },
          this.publication._id.$oid
        )
        .pipe(
          tap(() => {
            this.reloadEvent.emit();
            this.snackbarSvc.open("Publication succesfully updated");
          })
        )
        .subscribe();
    }
  }

  removeEntity(key: string, _id: Mongo.ObjectId) {
    if (_id) {
      this.publicationSvc
        .patch(
          {
            [key]: (this.publication as any)[key].filter(
              (a: any) => _id.$oid !== a._id.$oid
            ),
          },
          this.publication._id.$oid
        )
        .pipe(
          tap(() => {
            this.reloadEvent.emit();
            this.snackbarSvc.open("Publication succesfully updated");
          })
        )
        .subscribe();
    }
  }

  updateReferencesCounts() {
    const dialogRef = this.dialog.open(this.updateReferencesCountsDialogTpl);

    dialogRef
      .afterClosed()
      .pipe(
        tap((save: boolean) => {
          if (!save) return;

          this.publicationSvc
            .patch(
              {
                "references-count":
                  this.updateReferencesCountsFg.value["references-count"],
                "reference-count":
                  this.updateReferencesCountsFg.value["reference-count"],
                "is-referenced-by-count":
                  this.updateReferencesCountsFg.value["is-referenced-by-count"],
              },
              this.publication._id.$oid
            )
            .pipe(
              tap(() => {
                this.reloadEvent.emit();
                this.snackbarSvc.open("Publication succesfully updated");
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  selectedAuthor(author: MatSelectChange) {
    const _value = author.value as User.Researcher;

    this.addAuthorFg.patchValue({
      given: _value.profile.firstName,
      family: _value.profile.lastName,
      _id: _value._id,
    });
  }

  private get isOwned() {
    return this.user?._id === this.publication.owner._id;
  }

  private get isManager() {
    return (
      this.user &&
      (this.user as User.Manager).roles.includes(User.USER_ROLES.MANAGER)
    );
  }

  private get isInternal() {
    return !this.publication.DOI;
  }

  get editable(): boolean {
    return (this.isInternal && (this.isOwned || this.isManager)) || false;
  }
}
