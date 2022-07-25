import { Mongo } from "./mongo";

export namespace User {
  export interface User {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
      country: string;
      birthdate?: Mongo.Date;
      phone?: string;
      address?: string;
      city?: string;
      zip?: string;
    };
    roles: USER_ROLES[];
    _etag?: Mongo.ObjectId
  }

  export interface Researcher extends User {
    roles: [USER_ROLES.RESEARCHER];
  }

  export interface Funder extends User {
    roles: [USER_ROLES.FUNDER];
  }

  export interface Manager extends User {
    roles: [USER_ROLES.MANAGER];
  }

  export interface Organization extends User {}

  export type UserUnion = Researcher | Funder | Manager;

  export enum USER_ROLES {
    MANAGER = "manager",
    RESEARCHER = "researcher",
    FUNDER = "funder",
  }
}
