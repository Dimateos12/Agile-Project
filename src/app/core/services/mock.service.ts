import { environment } from "./../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MockService {
  constructor(private httpClient: HttpClient) {}

  get() {
    return this.httpClient.get(environment.API_BASE_URL + "/mock/get");
  }
}
