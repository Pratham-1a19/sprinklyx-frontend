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
                this.joinTeam();
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
                    // Stay on success screen permanently, no redirect.
                } else {
                    this.successMessage.set(response.message);
                }
            },
            error: (err) => {
                this.loading.set(false);
                console.error('Error accepting invite:', err);
                const msg = err.error?.message || 'Failed to accept invitation.';
                this.error.set(msg);
            }
        });
    }
}
