import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../layouts/main-layout/sidebar/sidebar';
import { Header } from '../../layouts/main-layout/header/header';
import { Footer } from '../../layouts/main-layout/footer/footer';
import { LargeFileUploaderComponent } from '../../components/large-file-uploader/large-file-uploader';

@Component({
  selector: 'app-social-media-posting',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, Header, Footer, LargeFileUploaderComponent],
  templateUrl: './social-media-posting.html',
  styleUrls: ['./social-media-posting.scss'],
})
export class SocialMediaPosting {
}
