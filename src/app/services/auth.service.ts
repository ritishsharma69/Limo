import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public token: any;

  constructor(public router: Router) {}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('role');
    this.router.navigateByUrl('/login');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setHeaders() {
    // const getuser = localStorage.getItem('userData');
    // const userdata = getuser ? JSON.parse(getuser) : null;
    const token = localStorage.getItem('token');

    if (token) {
      return {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      };
    } else {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      };
    }
  }
}
