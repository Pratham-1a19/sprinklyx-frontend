import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../../layouts/main-layout/sidebar/sidebar';
import { Header } from '../../layouts/main-layout/header/header';
import { Footer } from '../../layouts/main-layout/footer/footer';
import { ConnectAccountsComponent } from '../connect-accounts/connect-accounts';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-social-media-posting',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, Header, Footer, ConnectAccountsComponent],
  templateUrl: './social-media-posting.html',
  styleUrls: ['./social-media-posting.scss'],
})
export class SocialMediaPosting implements OnInit {
  
  hasSubscription = false;
  isLoading = true;

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit() {
    this.userService.getUser().subscribe({
      next: (user: any) => {
        this.isLoading = false;
        if (user && user.hasSubscription) {
          this.hasSubscription = true;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });

    // Check for stripe success in URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      this.hasSubscription = true; // Optimistic update
      
      this.http.post('http://localhost:3000/api/stripe/verify-session', { session_id: sessionId }, { withCredentials: true })
        .subscribe({
          next: () => console.log('Subscription verified successfully.'),
          error: (err) => console.error('Failed to verify subscription session', err)
        });

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  startSubscriptionCheckout() {
    // Requires standard Angular HTTP Client
    this.http.post<{id: string, url: string}>('http://localhost:3000/api/stripe/create-checkout-session', {}, { withCredentials: true })
      .subscribe({
        next: (session) => {
          window.location.href = session.url; // Redirect directly to Stripe checkout page
        },
        error: (err) => console.error('Failed to create checkout session', err)
      });
  }
}
