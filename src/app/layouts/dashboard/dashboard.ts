import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Header } from '../main-layout/header/header';
import { Footer } from '../main-layout/footer/footer';
import { SidebarComponent } from '../main-layout/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Header, Footer, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  onboardingSuccess = signal<string | null>(null);

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    const pendingToken = localStorage.getItem('pendingInvitationToken');
    if (pendingToken) {
      localStorage.removeItem('pendingInvitationToken');
      window.location.href = `/accept-invite?token=${pendingToken}`;
      return;
    }
    this.fetchTeamMembers();
  }

  fetchTeamMembers() {
    this.userService.getTeamMembers().subscribe({
      next: (members) => {
        this.teamMembers.set(members);
        // Update stats count
        const teamStat = this.stats.find(s => s.title === 'Team Members');
        if (teamStat) teamStat.value = members.length.toString();
      },
      error: (err) => {
        console.error('Failed to load team members', err);
      }
    });
  }
  stats = [
    { title: 'Total Projects', value: '12', icon: 'folder', color: 'bg-blue-100 text-blue-600' },
    { title: 'Active Tasks', value: '45', icon: 'check-circle', color: 'bg-green-100 text-green-600' },
    { title: 'Team Members', value: '8', icon: 'users', color: 'bg-purple-100 text-purple-600' },
    { title: 'Storage Used', value: '64%', icon: 'hard-drive', color: 'bg-orange-100 text-orange-600' }
  ];

  recentActivities = [
    { time: '2 hours ago', description: 'Uploaded "Project Proposal.pdf" to Marketing folder', user: 'Alex Morgan' },
    { time: '4 hours ago', description: 'Commented on "Design Spec.fig"', user: 'Sarah Jenkins' },
    { time: 'Yesterday', description: 'Created new project "Q4 Roadmap"', user: 'Michael Chen' },
    { time: '2 days ago', description: 'Invited 2 new members to the team', user: 'You' }
  ];

  teamMembers = signal<any[]>([]);
}
