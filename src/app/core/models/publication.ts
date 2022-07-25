import { Mongo } from "./mongo";

export namespace Publication {
  interface BasePublication extends Mongo.MongoEntity {
    indexed: Indexed;
    "reference-count": number;
    publisher: string;
    license: License[];
    "content-domain": ContentDomain;
    "published-print": PublishedPrint;
    DOI: string;
    type: string;
    created: Created;
    page: string;
    "update-policy": string;
    source: string;
    "is-referenced-by-count": number;
    title: string;
    prefix: string;
    volume: string;
    author: Author[];
    member: string;
    reference: Reference[];
    "container-title": string;
    "original-title": any[];
    language: string;
    link: Link[];
    deposited: Deposited;
    score: number;
    resource: Resource;
    subtitle: any[];
    "short-title": any[];
    issued: Issued;
    "references-count": number;
    "alternative-id": string[];
    URL: string;
    relation: Relation;
    ISSN: string[];
    subject: string[];
    "container-title-short": string;
    published: Published;
    assertion: Assertion[];
    "article-number": string;
    budget?: {
      amount: number;
    };
  }

  interface InternalPublication extends BasePublication {
    internal_DOI: string;
    url: string;
    owner: { _id: string };
    internal: {
      creationDate: Mongo.Date;
      createdBy: { _id: string };
    };
  }

  export type Publication = BasePublication & InternalPublication;

  export enum TYPE {
    "journal-article" = "journal-article",
    "book-chapter" = "book-chapter",
    "proceedings-article" = "proceedings-article",
  }

  export interface Indexed {
    "date-parts": number[][];
    "date-time": string;
    timestamp: number;
  }

  export interface License {
    start: Start;
    "content-version": string;
    "delay-in-days": number;
    URL: string;
  }

  export interface Start {
    "date-parts": number[][];
    "date-time": string;
    timestamp: number;
  }

  export interface ContentDomain {
    domain: string[];
    "crossmark-restriction": boolean;
  }

  export interface PublishedPrint {
    "date-parts": number[][];
  }

  export interface Created {
    "date-parts": number[][];
    "date-time": string;
    timestamp: number;
  }

  export interface Author extends Mongo.MongoEntity {
    given: string;
    family: string;
    sequence: string;
    affiliation: any[];
    ORCID?: string;
    "authenticated-orcid"?: boolean;
  }

  export interface Reference extends Mongo.MongoEntity {
    key: string;
    unstructured?: string;
    "first-page"?: string;
    "article-title"?: string;
    volume?: string;
    author?: string;
    year?: string;
    "journal-title"?: string;
    "series-title"?: string;
    "doi-asserted-by"?: string;
    DOI?: string;
    issue?: string;
  }

  export interface Link {
    URL: string;
    "content-type": string;
    "content-version": string;
    "intended-application": string;
  }

  export interface Deposited {
    "date-parts": number[][];
    "date-time": string;
    timestamp: number;
  }

  export interface Resource {
    primary: Primary;
  }

  export interface Primary {
    URL: string;
  }

  export interface Issued {
    "date-parts": number[][];
  }

  export interface Relation {}

  export interface Published {
    "date-parts": number[][];
  }

  export interface Assertion extends Mongo.MongoEntity {
    value: string;
    name: string;
    label: string;
  }
}
