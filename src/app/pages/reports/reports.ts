import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../layouts/main-layout/sidebar/sidebar';
import { Header } from '../../layouts/main-layout/header/header';
import { Footer } from '../../layouts/main-layout/footer/footer';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, SidebarComponent, Header, Footer],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class ReportsComponent {
  metrics = [
    { platform: 'LinkedIn', icon: 'ki-linkedin', color: 'text-blue-700', bg: 'bg-blue-50', label: 'Total Impressions', value: '15.4K', trend: '+12.5%', trendUp: true },
    { platform: 'YouTube', icon: 'ki-youtube', color: 'text-red-600', bg: 'bg-red-50', label: 'Total Views', value: '8.2K', trend: '+5.2%', trendUp: true },
    { platform: 'Facebook', icon: 'ki-facebook', color: 'text-blue-600', bg: 'bg-blue-50', label: 'Total Reach', value: '45.1K', trend: '-2.1%', trendUp: false },
  ];

  recentPosts = [
    { id: 1, platform: 'LinkedIn', icon: 'ki-linkedin', color: 'text-blue-700', content: 'Excited to announce our new upcoming product launch next week! 🚀 #launch #tech', date: 'Oct 24, 2023', likes: '342', comments: '45', shares: '12' },
    { id: 2, platform: 'YouTube', icon: 'ki-youtube', color: 'text-red-600', content: 'Top 10 features of the new Sprinklyx Engine (Full Tutorial)', date: 'Oct 22, 2023', likes: '1.2K', comments: '156', shares: '89' },
    { id: 3, platform: 'Facebook', icon: 'ki-facebook', color: 'text-blue-600', content: 'Join us live tomorrow at 10AM EST! 🎥 We will be answering your questions.', date: 'Oct 20, 2023', likes: '890', comments: '124', shares: '45' },
    { id: 4, platform: 'LinkedIn', icon: 'ki-linkedin', color: 'text-blue-700', content: 'We are hiring! Looking for talented engineers to join our growing team.', date: 'Oct 18, 2023', likes: '521', comments: '89', shares: '34' },
    { id: 5, platform: 'YouTube', icon: 'ki-youtube', color: 'text-red-600', content: 'Behind the scenes at the Sprinklyx office.', date: 'Oct 15, 2023', likes: '4.5K', comments: '312', shares: '156' }
  ];
}
