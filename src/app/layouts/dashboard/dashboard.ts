import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class Dashboard {
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

  teamMembers = [
    { name: 'Alex Morgan', role: 'Designer', avatar: 'https://i.pravatar.cc/150?u=alex' },
    { name: 'Sarah Jenkins', role: 'Developer', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { name: 'Michael Chen', role: 'Manager', avatar: 'https://i.pravatar.cc/150?u=michael' },
    { name: 'Emily Davis', role: 'Product', avatar: 'https://i.pravatar.cc/150?u=emily' }
  ];
}
