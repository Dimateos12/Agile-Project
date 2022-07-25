import * as momentJS from 'moment';

const moment = (momentJS as any).default ? (momentJS as any).default : momentJS;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Mongo {
  export const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';

  export class ObjectId {
    $oid: string;

    constructor(oid?: string) {
      if (!oid) {
        this.$oid = getNewMongoObjectId();
      } else {
        this.$oid = oid;
      }
    }
  }

  export interface Date {
    $date: number;
  }

  export interface MongoEntity {
    _id: Mongo.ObjectId;
    _etag?: Mongo.ObjectId;
  }

  export class Date {
    $date: number;

    constructor(epoch?: number) {
      if (epoch) {
        this.$date = epoch;
      } else {
        this.$date = moment().unix() * 1000;
      }
    }

    public toISO(): string {
      return moment(this.$date).format();
    }

    public toLocalTime(): string {
      return moment(this.$date).format(DATE_FORMAT);
    }
  }

  export const getNewMongoObjectId = () => {
    const timestamp = (moment().unix() | 0).toString(16);
    return (
      timestamp +
      'xxxxxxxxxxxxxxxx'
        .replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16))
        .toLowerCase()
    );
  };
}
