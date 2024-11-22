import { HttpHeaders } from "@angular/common/http";

export function getHeadersPost(): HttpHeaders {
  return new HttpHeaders({
    "Content-Type": "application/json",
    Accept: "application/json",
  });
}

export function getHeaders(): HttpHeaders {
  return new HttpHeaders({
    Accept: "application/json",
  });
}