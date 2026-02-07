import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Footer } from '../main-layout/footer/footer';
import { Header } from '../main-layout/header/header';
import { SidebarComponent } from '../main-layout/sidebar/sidebar';
import { UserService } from '../../services/user.service';

interface TeamMember {
  name: string;
  avatar: string;
}

@Component({
  selector: 'app-invitation-page',
  imports: [CommonModule, FormsModule, Footer, Header, SidebarComponent],
  templateUrl: './invitation-page.html',
  styleUrl: './invitation-page.scss',
})

export class InvitationPage implements OnInit {
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.fetchTeamMembers();
  }

  fetchTeamMembers() {
    this.userService.getTeamMembers().subscribe({
      next: (members) => {
        this.teamMembers.set(members);
      },
      error: (err) => {
        console.error('Failed to load team members', err);
      }
    });
  }


  email = signal('');

  teamMembers = signal<TeamMember[]>([]);

  sendInvitation() {
    const emailValue = this.email().trim();
    if (!emailValue) return;

    this.userService.inviteUser(emailValue).subscribe({
      next: () => {
        console.log(`Invitation sent to ${emailValue}`);
        alert('Invitation sent successfully!');
        this.email.set('');
      },
      error: (err) => {
        console.error('Error sending invitation:', err);
        alert('Failed to send invitation. Please try again.');
      }
    });
  }
}

