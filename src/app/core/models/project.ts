import { Budget } from "./budget";
import { Milestone } from "./milestone";
import { Mongo } from "./mongo";
import { Publication } from "./publication";
import { User } from "./user";

export namespace Project {
  export interface Project extends Mongo.MongoEntity {
    type: TYPE;
    code: string;
    owner: Partial<User.Researcher>;
    createdBy: User.Manager;
    status: STATUS;
    title: string;
    description: string;
    creationDate?: Mongo.Date;
    startingDate?: Mongo.Date;
    parentProject?: ProjectRef;
    subProjects?: ProjectRef[];
    dueDate?: Mongo.Date;
    researchers: User.User[];
    funders: User.Funder[];
    organizations: User.Organization[];
    publications: Publication.Publication[];
    budget: Budget;
    milestones: Milestone[];
  }

  interface ProjectRef{ _id: Mongo.ObjectId; code: string }

  export enum STATUS {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    CANCELLED = "CANCELLED",
  }

  export enum TYPE {
    BASE = "BASE",
    SUB = "SUB",
  }
}
