import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  standalone: true,
})
export class LogoutComponent  implements OnInit {
  router = inject(Router)

  constructor(public appServices: AppService) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.logout();
  }

  logout(){
    this.appServices.logout();
  }
}
