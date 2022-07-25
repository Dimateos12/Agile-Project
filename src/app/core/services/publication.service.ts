import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, of } from "rxjs";
import { environment } from "src/environments/environment";
import { SKIP_GLOBAL_ERROR_HANDLER } from "../interceptors/http-context-tokens";
import { Publication } from "../models/publication";
import { stringArrayToFilter } from "../utils/generic";

@Injectable({
  providedIn: "root",
})
export class PublicationService {
  constructor(private httpClient: HttpClient) {}

  DOI_LOOKUP_URL = "https://dx.doi.org/";

  lookupDOI(DOI: string) {
    return this.httpClient.get<Publication.Publication>(
      this.DOI_LOOKUP_URL + DOI,
      {
        headers: {
          Accept:
            "application/citeproc+json;q=1.0, application/unixref+xml;q=0.5",
        },
        context: new HttpContext().set(SKIP_GLOBAL_ERROR_HANDLER, true),
        observe: "response",
      }
    );
  }

  get(filter?: any, page = 1, pageSize = 15, sort = { _id: -1 }) {
    return this.httpClient.get<Publication.Publication[]>(
      environment.API_BASE_URL +
        "/mgmt/publications" +
        (filter ? "?filter=" + JSON.stringify(filter) : "") +
        `${filter ? "&" : "?"}sort=` +
        JSON.stringify(sort) +
        `&page=${page}&pagesize=${pageSize}`,
      { observe: "body" }
    );
  }

  size(filter?: any) {
    return this.httpClient
      .get<any>(
        environment.API_BASE_URL +
          "/mgmt/publications/_size" +
          (filter ? "?filter=" + JSON.stringify(filter) : ""),
        { observe: "body" }
      )
      .pipe(map((res) => res._size));
  }

  getById($oid: string) {
    return this.httpClient.get<Publication.Publication>(
      environment.API_BASE_URL + "/mgmt/publications/" + $oid
    );
  }

  getByIds(ids: string[]) {
    if (ids?.length === 0) return of([]);
    return this.httpClient.get<Publication.Publication[]>(
      environment.API_BASE_URL +
        `/mgmt/publications` +
        `?filter={'_id':{'$in': [${stringArrayToFilter(ids)}]}}`
    );
  }

  patch(body: Partial<Publication.Publication>, $oid: string) {
    return this.httpClient.patch<any>(
      environment.API_BASE_URL + "/mgmt/publications/" + $oid,
      body,
      { observe: "body" }
    );
  }

  post(body: Partial<Publication.Publication>) {
    return this.httpClient.post<any>(
      environment.API_BASE_URL + "/mgmt/publications/",
      body,
      { observe: "response" }
    );
  }

  delete($oid: string) {
    return this.httpClient.delete<any>(
      environment.API_BASE_URL + "/mgmt/publications/" + $oid
    );
  }
}
