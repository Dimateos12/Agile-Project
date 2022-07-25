import { User } from "./../../core/models/user";
import { StoreService } from "./../../core/store/store.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, tap } from "rxjs";
import { Publication } from "src/app/core/models/publication";
import { PublicationService } from "src/app/core/services/publication.service";
import { BreadcrumbService } from "xng-breadcrumb";

@Component({
  selector: "app-publication-detail-container",
  template: `
    <ng-container
      *ngIf="($authUser | async) !== undefined as authUser"
    ></ng-container>
    <ng-container *ngIf="$publication | async as publication">
      <app-publication-detail
        (reloadEvent)="ngOnInit()"
        [publication]="publication"
        [user]="_authUser"
      ></app-publication-detail>
    </ng-container>
  `,
})
export class PublicationDetailContainerComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private publicationSvc: PublicationService,
    private breadCrumbSvc: BreadcrumbService,
    private storeSvc: StoreService
  ) {}

  $publication!: Observable<Publication.Publication>;
  $authUser!: Observable<User.UserUnion | null>;

  _authUser!: User.UserUnion | null;

  ngOnInit(): void {
    this.$authUser = this.storeSvc
      .getUser()
      .pipe(tap((user) => (this._authUser = user)));

    this.route.params.subscribe((routeParams) => {
      const publicationId = routeParams["id"];

      this.$publication = this.publicationSvc.getById(publicationId).pipe(
        tap((publication) => {
          this.breadCrumbSvc.set(
            "@publicationDetails",
            publication.DOI ?? publication.internal_DOI
          );
        })
      );
    });
  }
}
