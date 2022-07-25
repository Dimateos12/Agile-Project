import { Mongo } from "./mongo";

export interface Milestone {
  description: string;
  expireDate: Mongo.Date;
  completedDate: Mongo.Date;
  status: "COMPLETED" | "IN_PROGRESS";
}
