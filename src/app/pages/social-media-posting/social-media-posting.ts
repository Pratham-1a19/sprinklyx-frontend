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
  postContent: string = '';
  uploadedMedia: { url: string, type: 'image' | 'video', name: string }[] = [];

  platforms = [
    { id: 'facebook', name: 'Facebook', icon: 'ki-facebook', selected: false, color: 'text-blue-600', maxChars: 63206 },
    { id: 'instagram', name: 'Instagram', icon: 'ki-instagram', selected: false, color: 'text-pink-600', maxChars: 2200 },
    { id: 'twitter', name: 'X (Twitter)', icon: 'ki-twitter', selected: false, color: 'text-black', maxChars: 280 },
    { id: 'linkedin', name: 'LinkedIn', icon: 'ki-linkedin', selected: false, color: 'text-blue-700', maxChars: 3000 },
    { id: 'youtube', name: 'YouTube', icon: 'ki-youtube', selected: false, color: 'text-red-600', maxChars: 5000 }
  ];

  scheduleMode: 'now' | 'schedule' = 'now';
  scheduleDate: string = '';
  scheduleTime: string = '';

  isSubmitting: boolean = false;
  successMessage: string | null = null;

  get selectedPlatforms() {
    return this.platforms.filter(p => p.selected);
  }

  get characterCount() {
    return this.postContent.length;
  }

  get minMaxChars() {
    if (this.selectedPlatforms.length === 0) return 280; // default assumption
    return Math.min(...this.selectedPlatforms.map(p => p.maxChars));
  }

  togglePlatform(platformId: string) {
    const platform = this.platforms.find(p => p.id === platformId);
    if (platform) {
      platform.selected = !platform.selected;
    }
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.handleFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (isImage || isVideo) {
        const url = URL.createObjectURL(file);
        this.uploadedMedia.push({
          url,
          type: isImage ? 'image' : 'video',
          name: file.name
        });
      }
    }
  }

  removeMedia(index: number) {
    this.uploadedMedia.splice(index, 1);
  }

  submitPost(action: 'post' | 'draft') {
    if (!this.postContent.trim() && this.uploadedMedia.length === 0) {
      alert("Please prepare some content or upload media before posting.");
      return;
    }
    if (this.selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }
    if (this.scheduleMode === 'schedule' && (!this.scheduleDate || !this.scheduleTime)) {
      alert("Please select a valid date and time for scheduling.");
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;

    // Simulate API request
    setTimeout(() => {
      this.isSubmitting = false;

      if (action === 'draft') {
        this.successMessage = 'Post successfully saved as draft!';
      } else if (this.scheduleMode === 'schedule') {
        this.successMessage = `Post scheduled for ${this.scheduleDate} at ${this.scheduleTime}!`;
      } else {
        this.successMessage = 'Post successfully published!';
      }

      // Reset form after 3 seconds
      setTimeout(() => {
        this.successMessage = null;
        this.postContent = '';
        this.uploadedMedia = [];
        this.platforms.forEach(p => p.selected = false);
        this.scheduleMode = 'now';
        this.scheduleDate = '';
        this.scheduleTime = '';
      }, 3000);

    }, 1500);
  }
}
