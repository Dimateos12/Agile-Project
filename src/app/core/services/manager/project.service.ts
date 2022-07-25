import { Publication } from "./../../models/publication";
import { HttpClient, JsonpClientBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, of } from "rxjs";
import { environment } from "src/environments/environment";
import { Project } from "../../models/project";
import { User } from "../../models/user";
import { UserService } from "../user.services";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  constructor(private httpClient: HttpClient) {}

  get(filter?: any, page = 1, pageSize = 15, sort = { code: 1 }) {
    return this.httpClient.get<Project.Project[]>(
      environment.API_BASE_URL +
        "/mgmt/projects" +
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
          "/mgmt/projects/_size" +
          (filter ? "?filter=" + JSON.stringify(filter) : ""),
        { observe: "body" }
      )
      .pipe(map((res) => res._size));
  }

  getById($oid: string) {
    return this.httpClient.get<Project.Project>(
      environment.API_BASE_URL + "/mgmt/projects/" + $oid
    );
  }

  patch(body: Partial<Project.Project>, $oid: string) {
    return this.httpClient.patch<any>(
      environment.API_BASE_URL + "/mgmt/projects/" + $oid,
      body,
      { observe: "body" }
    );
  }

  post(body: Partial<Project.Project>) {
    return this.httpClient.post<any>(
      environment.API_BASE_URL + "/mgmt/projects/",
      body,
      { observe: "response" }
    );
  }

  delete($oid: string) {
    return this.httpClient.delete<any>(
      environment.API_BASE_URL + "/mgmt/projects/" + $oid
    );
  }

  getSubProjects(parentProjectId: string) {
    return this.httpClient.get<Project.Project[]>(
      environment.API_BASE_URL +
        "/mgmt/projects/" +
        `?filter={"parentProject._id": {"$oid": "${parentProjectId}"}}`
    );
  }

  getBaseProjects(excludedProjectId: string) {
    return this.httpClient.get<Project.Project[]>(
      environment.API_BASE_URL +
        "/mgmt/projects/" +
        `?filter={"parentProject": null, "type": "BASE"}` +
        `&filter={"_id": {"$ne":{"$oid": "${excludedProjectId}"}}}`
    );
  }

  addSubProject(
    subProject: Partial<Project.Project>,
    parentProject: Partial<Project.Project>
  ) {
    if (subProject._id?.$oid === parentProject._id?.$oid) {
      throw new Error("Subproject cannot be the same as parent project");
    }
    return this.httpClient.put<any>(
      environment.API_BASE_URL +
        `/subProjectsSvc/${parentProject._id?.$oid}/${subProject._id?.$oid}`,
      { observe: "response" }
    );
  }

  addPublication(projectId: string, publication: Publication.Publication) {
    return this.httpClient.patch<void>(
      environment.API_BASE_URL + `/mgmt/projects/${projectId}`,
      {
        $push: { publications: publication },
      },
      { observe: "response" }
    );
  }

  removePublication(projectId: string, publicationId: string) {
    return this.httpClient.patch<void>(
      environment.API_BASE_URL + `/mgmt/projects/${projectId}`,
      {
        $pull: { publications: { _id: { $oid: publicationId } } },
      },
      { observe: "response" }
    );
  }

  removeSubProject(
    subProject: Partial<Project.Project>,
    parentProject: Partial<Project.Project>
  ) {
    if (subProject._id?.$oid === parentProject._id?.$oid) {
      throw new Error("Subproject cannot be the same as parent project");
    }
    return this.httpClient.delete<any>(
      environment.API_BASE_URL +
        `/subProjectsSvc/${parentProject._id?.$oid}/${subProject._id?.$oid}`,
      { observe: "response" }
    );
  }

  getFunderProjects(funderId: string) {
    return this.httpClient.get<Project.Project[]>(
      environment.API_BASE_URL +
        "/mgmt/projects/" +
        `?filter={"funders._id":  "${funderId}"}`
    );
  }

  getResearcherProjects(researcherId: string) {
    return this.httpClient.get<Project.Project[]>(
      environment.API_BASE_URL +
        "/mgmt/projects/" +
        `?filter={"researchers._id":  "${researcherId}"}`
    );
  }

  addResearcher(researcherId: string, projectId: string) {
    return this.httpClient.patch<any>(
      environment.API_BASE_URL + `/mgmt/projects/${projectId}`,
      {
        $push: { researchers: { _id: researcherId } },
      },
      { observe: "response" }
    );
  }

  addFunder(projectId: string, funder: User.Funder) {
    return this.httpClient.patch<any>(
      environment.API_BASE_URL + `/mgmt/projects/${projectId}`,
      {
        $push: { funders: funder },
      },
      { observe: "response" }
    );
  }

  removeResearcher(researcherId: string, projectId: string) {
    return this.httpClient.patch<any>(
      environment.API_BASE_URL + `/mgmt/projects/${projectId}`,
      {
        $pull: { researchers: { _id: researcherId } },
      },
      { observe: "response" }
    );
  }

  removeFunder(funderId: string, projectId: string) {
    return this.httpClient.patch<any>(
      environment.API_BASE_URL + `/mgmt/projects/${projectId}`,
      {
        $pull: { funders: { _id: funderId } },
      },
      { observe: "response" }
    );
  }

  // Researchers involved in a project
  getProjectResearchers(project: Project.Project) {
    const ids = project.researchers.map((r) => r._id);

    if (!ids.length) return of([] as User.Researcher[]);

    return this.httpClient.get<User.Researcher[]>(
      environment.API_BASE_URL +
        `/mgmt/users/?filter={"_id": {"$in": ${JSON.stringify(ids)}}}`
    );
  }
}
