import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent implements OnInit {
  isAdmin = signal(false);

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUser().subscribe({
      next: (user: any) => {
        if (user && user.isAdmin) {
          this.isAdmin.set(true);
        }
      },
      error: (err: any) => console.error('Failed to fetch user in sidebar', err)
    });
  }
}
