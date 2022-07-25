import { HttpContextToken } from "@angular/common/http";

// When a request wants to skip the global error handler, 
// it can be done by adding the HttpContextToken to the request context setting its value to true.
export const SKIP_GLOBAL_ERROR_HANDLER = new HttpContextToken<boolean>(() => false);

// Request with status 404 are always redirected unless this token is set to false
export const REDIRECT_REQUEST = new HttpContextToken<boolean>(() => true);

