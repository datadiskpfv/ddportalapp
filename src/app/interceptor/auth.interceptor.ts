import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../service/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    // just return on the below URL's
    if (httpRequest.url.includes(`${this.authenticationService.host}/user/login`)) {
      return httpHandler.handle(httpRequest);
    }

    if (httpRequest.url.includes(`${this.authenticationService.host}/user/register`)) {
      return httpHandler.handle(httpRequest);
    }

    // if (httpRequest.url.includes(`${this.authenticationService.host}/user/reset-password`)) {
    //   return httpHandler.handle(httpRequest);
    // }

    // all other URL's we will add the authorization header and the JWT token
    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();

    const request = httpRequest.clone({ setHeaders: {Authorization: `Bearer ${token}`}});
    return httpHandler.handle(request);
  }
}
