import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-login',
  imports: [RouterModule],
  templateUrl: './client-login.component.html',
  styleUrl: './client-login.component.scss'
})
export class ClientLoginComponent {
  loginAsAdminWithGoogle() {
    localStorage.setItem('loginPortal', 'admin');
    window.location.href = 'http://localhost:3000/auth/google/admin';
  }
}
