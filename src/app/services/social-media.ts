import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SocialAccount {
  _id: string;
  platform: string;
  accountId: string;
  profileName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {
  constructor(private http: HttpClient) { }

  getConnectedAccounts(): Observable<SocialAccount[]> {
    return this.http.get<SocialAccount[]>('/api/connect/status', { withCredentials: true });
  }

  connectAccount(platform: string): void {
    // Redirect browser to trigger the backend OAuth flow
    window.location.href = `/api/connect/${platform}`;
  }
}
