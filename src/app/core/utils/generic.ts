import { HttpResponse } from "@angular/common/http";

export function oidFromResponseHeaders(response: HttpResponse<any>) {
  const location = response.headers.get("Location");
  return location?.split("/").slice(-1)[0];
}

export function stringArrayToFilter(a: string[]): string {
  return a.map((s) => `{ "$oid": "${s}"}`).join(",");
}
