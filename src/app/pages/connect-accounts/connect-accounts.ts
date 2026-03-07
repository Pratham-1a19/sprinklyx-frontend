import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialMediaService, SocialAccount } from '../../services/social-media';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-connect-accounts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connect-accounts.html',
  styleUrls: ['./connect-accounts.scss']
})
export class ConnectAccountsComponent implements OnInit {
  accounts: SocialAccount[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private socialMediaService = inject(SocialMediaService);
  private route = inject(ActivatedRoute);

  platforms = [
    { id: 'facebook', name: 'Facebook', icon: 'facebook' },
    { id: 'twitter', name: 'Twitter (X)', icon: 'twitter' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
    { id: 'youtube', name: 'YouTube', icon: 'youtube' }
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        this.errorMessage = `Failed to connect ${params['error']}.`;
      }
      if (params['connected']) {
        this.successMessage = `Successfully connected ${params['connected']}!`;
      }
    });
    this.fetchAccounts();
  }

  fetchAccounts() {
    this.socialMediaService.getConnectedAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (err) => console.error('Error fetching accounts', err)
    });
  }

  isConnected(platformId: string): boolean {
    return this.accounts.some(acc => acc.platform === platformId);
  }

  getProfileName(platformId: string): string {
    const acc = this.accounts.find(a => a.platform === platformId);
    return acc?.profileName ? `(${acc.profileName})` : '';
  }

  connect(platformId: string) {
    this.socialMediaService.connectAccount(platformId);
  }
}
