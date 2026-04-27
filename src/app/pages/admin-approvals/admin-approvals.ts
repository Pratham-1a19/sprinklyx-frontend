import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../layouts/main-layout/sidebar/sidebar';
import { Header } from '../../layouts/main-layout/header/header';

@Component({
  selector: 'app-admin-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, Header],
  templateUrl: './admin-approvals.html',
})
export class AdminApprovalsComponent implements OnInit {
  pendingRequests: any[] = [];
  isLoading = true;
  feedbackMap: { [key: string]: string } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchRequests();
  }

  getMediaUrl(absolutePath: string): string {
    if (!absolutePath) return '';
    const filename = absolutePath.split('/').pop() || absolutePath.split('\\').pop();
    return `http://localhost:3000/uploads/${filename}`;
  }

  apiUrl = '/api';

  fetchRequests() {
    this.isLoading = true;
    this.http.get<any[]>(`${this.apiUrl}/upload/pending-requests`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.pendingRequests = res;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  approve(id: string) {
    this.http.put(`${this.apiUrl}/upload/${id}/approve`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          alert('Post Approved and moved to processing queue!');
          this.fetchRequests();
        },
        error: (err) => {
          console.error('Approval failed', err);
          alert('Failed to approve post: ' + (err.error?.message || err.message));
        }
      });
  }

  reject(id: string) {
    const feedback = this.feedbackMap[id] || 'Rejected by Admin';
    this.http.put(`${this.apiUrl}/upload/${id}/reject`, { feedback }, { withCredentials: true })
      .subscribe({
        next: () => {
          alert('Post Rejected successfully.');
          this.fetchRequests();
        },
        error: (err) => {
          console.error('Rejection failed', err);
          alert('Failed to reject post: ' + (err.error?.message || err.message));
        }
      });
  }
}
