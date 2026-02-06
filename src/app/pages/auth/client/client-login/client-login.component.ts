import { Component } from '@angular/core';

@Component({
  selector: 'app-client-login',
  imports: [],
  templateUrl: './client-login.component.html',
  styleUrl: './client-login.component.scss'
})
export class ClientLoginComponent {
  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/auth/google';
  }
}
