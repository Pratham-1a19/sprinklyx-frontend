import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-accept-invite',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './accept-invite.component.html',
    styleUrl: './accept-invite.component.scss'
})
export class AcceptInviteComponent implements OnInit {
    token: string | null = null;
    loading = signal(false);
    error = signal<string | null>(null);
    successMessage = signal<string | null>(null);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
            if (!this.token) {
                this.error.set('Invalid invitation link. Token is missing.');
            }
        });
    }

    joinTeam() {
        if (!this.token) return;

        this.loading.set(true);
        this.error.set(null);

        this.userService.acceptInvitation(this.token).subscribe({
            next: (response: any) => {
                this.loading.set(false);
                if (response.message.includes('Successfully joined')) {
                    this.successMessage.set(response.message);
                    setTimeout(() => {
                        this.router.navigate(['/dashboard']);
                    }, 2000);
                } else if (response.message.includes('Please Log In')) {
                    // Not logged in or needs login
                    localStorage.setItem('pendingInvitationToken', this.token!);
                    alert(response.message);
                    this.router.navigate(['/client-login']);
                } else {
                    // Already member or other info
                    this.successMessage.set(response.message);
                    setTimeout(() => {
                        this.router.navigate(['/dashboard']);
                    }, 3000);
                }
            },
            error: (err) => {
                this.loading.set(false);
                console.error('Error accepting invite:', err);
                // Handle specific error messages if needed
                const msg = err.error?.message || 'Failed to accept invitation.';
                if (msg === 'Invalid or expired invitation') {
                    this.error.set(msg);
                } else {
                    this.error.set(msg);
                }
            }
        });
    }
}
