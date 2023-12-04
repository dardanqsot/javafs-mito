import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from 'src/app/service/login.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class ProfileComponent implements OnInit {

  usuario: string;
  rol: string;

  constructor(
    private loginService: LoginService
    ) { }

  ngOnInit() {
    const helper = new JwtHelperService();
    if (this.loginService.isLogged()) {
      let token = sessionStorage.getItem(environment.TOKEN_NAME);
      const decodedToken = helper.decodeToken(token);
      this.usuario = decodedToken.user_name;
      const roles: string[] = decodedToken.authorities;
      this.rol = roles.join(', ');
    } else {
      this.loginService.logout();
    }
  }

}