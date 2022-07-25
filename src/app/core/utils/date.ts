import * as moment from "moment";
import { Mongo } from "../models/mongo";

moment.locale("en");

export function localeDate($date: number | undefined, format="LLL") {
  return $date ? moment($date).format(format) : "n/a";
}

export function dateToMongo(date: Date): Mongo.Date {
  return new Mongo.Date(date.getTime());
}
