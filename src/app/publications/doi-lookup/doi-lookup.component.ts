import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, map, Observable, tap } from "rxjs";
import { Publication } from "src/app/core/models/publication";
import { User } from "src/app/core/models/user";
import { PublicationService } from "src/app/core/services/publication.service";
import { SnackbarService } from "src/app/core/services/snackbar.service";
import { localeDate } from "src/app/core/utils/date";

@Component({
  selector: "app-doi-lookup",
  template: `<ng-container *ngIf="!error; else inError">
      <ng-container *ngIf="$publication | async as publication">
        <!-- <pre>{{ publication | json }}</pre> -->
        <app-publication-detail [publication]="publication"></app-publication-detail>
        <ng-container>
          <div class="fab-bottom-right">
            <button
              (click)="import(publication)"
              class="fab-with-text"
              [matTooltip]="'Create new project'"
              mat-raised-button
              color="primary"
            >
              Import <mat-icon>add</mat-icon>
            </button>
          </div>
        </ng-container>
      </ng-container>
    </ng-container>
    <ng-template #inError>
      <h2>Cannot find publication</h2>
      <p>Please check DOI and try again</p>
      <button
        mat-raised-button
        color="primary"
        routerLink="/account/publications"
      >
        Go back
      </button>
    </ng-template> `,
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
export class DoiLookupComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicationSvc: PublicationService,
    private snackBarSvc: SnackbarService
  ) {}

  $publication!: Observable<Publication.Publication | null>;

  error!: any;

  authors!: User.UserUnion[];

  ngOnInit(): void {
    this.$publication = this.publicationSvc
      .lookupDOI(this.route.snapshot.params["id"])
      .pipe(
        catchError(async (err) => {
          this.error = err;
          console.log(err);
        }),
        map(
          (res: HttpResponse<Publication.Publication> | void) =>
            res?.body ?? null
        ),
        tap((publication) => {
          if (publication) {
            this.authors = this.getUsers(publication.author);
          }
        })
      );
  }

  get localeDate() {
    return localeDate;
  }

  getUsers(authors: Publication.Author[]): User.UserUnion[] {
    return authors.map((author) => ({
      _id: author.ORCID ?? null,
      profile: {
        firstName: author.given,
        lastName: author.family,
      },
      roles: [],
    })) as any as User.UserUnion[];
  }

  navigate(url: string) {
    window.open(url, "_blank");
  }

  import(publication: Publication.Publication) {
    this.publicationSvc.post(publication).subscribe((res) => {
      const location = res.headers.get("Location");
      const $oid = location?.split("/").slice(-1)[0];

      this.router.navigate(["account", "publications", $oid]);
      this.snackBarSvc.open("Publication imported");
    });
  }
}
