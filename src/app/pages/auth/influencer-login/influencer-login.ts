import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-influencer-login',
  imports: [RouterModule],
  templateUrl: './influencer-login.html',
  styleUrl: './influencer-login.scss',
})
export class InfluencerLoginComponent {
  loginAsMemberWithGoogle() {
    localStorage.setItem('loginPortal', 'member');
    window.location.href = 'http://localhost:3000/auth/google';
  }
}
