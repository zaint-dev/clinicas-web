import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';
import { Api } from '@shared/api';
import { getHeadersPost } from 'app/shared/utils';
import { ILoginResponseModel } from '../models/login-response.model';
import { ILoginResponseErrorModel } from '../models/login-response-error.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;
  private _loginUrl = Api.getApiUrl() + 'login';

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(
    private _http: HttpClient,
    private _toastrService: ToastrService,
    private _httpClient: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */

  login(email: string, password: string) {
    
    return new Promise((resolve, reject) => {
      const headers = getHeadersPost();
      const body = { email, password };
      this._httpClient.post<ILoginResponseModel>(`${this._loginUrl}?useCookies=false&useSessionCookies=false`, JSON.stringify(body), { headers })
        .subscribe(response => {
          console.log('response', response);
          const user: User = {
            id: 1,
            email,
            password: '',
            firstName: '',
            lastName: '',
            avatar: 'avatar-s-10.jpg',
            role: Role.Admin,
            token: response.accessToken,
            tokenType: response.tokenType,
            expiresIn: response.expiresIn,
            refreshToken: response.refreshToken
          };
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'You have successfully logged in as an ' +
                user.role +
                ' user to Vuexy. Now you can start to explore. Enjoy! 🎉',
                '👋 Welcome, ' + user.firstName + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);

            // notify
            this.currentUserSubject.next(user);
          }
          resolve(user);
        },
          (error: ILoginResponseErrorModel) => {
            reject(error);
          }
        );
    });
  }

  login2(email: string, password: string) {
    const headers = getHeadersPost();
    return this._http
      .post<ILoginResponseModel>(`${this._loginUrl}?useCookies=false&useSessionCookies=false`, { email, password }, { headers })
      .pipe(
        map(response => {
          const user: User = {
            id: 1,
            email,
            password: "",
            firstName: "",
            lastName: "",
            avatar: "avatar-s-10.jpg",
            role: Role.Admin,
            token: response.accessToken,
            tokenType: response.tokenType,
            expiresIn: response.expiresIn,
            refreshToken: response.refreshToken
          };
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'You have successfully logged in as an ' +
                user.role +
                ' user to Vuexy. Now you can start to explore. Enjoy! 🎉',
                '👋 Welcome, ' + user.firstName + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);

            // notify
            this.currentUserSubject.next(user);
          }

          return user;
        })
      );
  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
}
