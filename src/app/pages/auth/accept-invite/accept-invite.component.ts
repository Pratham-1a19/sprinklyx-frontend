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
    loading = signal<boolean>(false);
    error = signal<string | null>(null);
    successMessage = signal<string | null>(null);
    adminName = signal<string | null>(null);
    isLoggedIn = signal<boolean>(false);
    checkedAuth = signal<boolean>(false);

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
            } else {
                this.checkAuthAndJoin();
            }
        });
    }

    checkAuthAndJoin() {
        this.loading.set(true);
        this.userService.getUser().subscribe({
            next: (user) => {
                this.checkedAuth.set(true);
                if (user) {
                    this.isLoggedIn.set(true);
                    this.joinTeam();
                } else {
                    this.isLoggedIn.set(false);
                    this.loading.set(false);
                }
            },
            error: () => {
                this.checkedAuth.set(true);
                this.isLoggedIn.set(false);
                this.loading.set(false);
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
                if (response.message.includes('Successfully joined') || response.message.includes('already a member')) {
                    this.successMessage.set(response.message);
                    this.adminName.set(response.adminName);
                    setTimeout(() => {
                        this.router.navigate(['/dashboard']);
                    }, 4000); // Slightly longer to read the message
                } else if (response.message.includes('Please Log In')) {
                    // Not logged in or needs login
                    localStorage.setItem('pendingInvitationToken', this.token!);
                    this.isLoggedIn.set(false);
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
