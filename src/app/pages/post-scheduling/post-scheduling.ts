import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../layouts/main-layout/sidebar/sidebar';
import { Header } from '../../layouts/main-layout/header/header';
import { Footer } from '../../layouts/main-layout/footer/footer';
import { SocialMediaService, SocialAccount } from '../../services/social-media';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-post-scheduling',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, Header, Footer],
  templateUrl: './post-scheduling.html',
  styleUrls: ['./post-scheduling.scss'],
})
export class PostSchedulingComponent implements OnInit {
  postContent: string = '';
  uploadedMedia: { file: File, url: string, type: 'image' | 'video', name: string }[] = [];

  platforms: any[] = [];
  posts: any[] = [];
  
  private socialMediaService = inject(SocialMediaService);
  private fileUploadService = inject(FileUploadService);
  private chunkSize = 5 * 1024 * 1024;

  ngOnInit() {
    this.loadPlatforms();
    this.loadPosts();
  }

  loadPlatforms() {
    this.socialMediaService.getConnectedAccounts().subscribe({
      next: (accounts: SocialAccount[]) => {
        this.platforms = accounts.map(acc => {
          let maxChars = 280;
          let icon = 'ki-link';
          let color = 'text-gray-600';
          
          if (acc.platform === 'facebook') { maxChars = 63206; icon = 'ki-facebook'; color = 'text-blue-600'; }
          if (acc.platform === 'linkedin') { maxChars = 3000; icon = 'ki-linkedin'; color = 'text-blue-700'; }
          if (acc.platform === 'twitter') { maxChars = 280; icon = 'ki-twitter'; color = 'text-black'; }
          if (acc.platform === 'youtube') { maxChars = 5000; icon = 'ki-youtube'; color = 'text-red-600'; }

          return {
            id: acc._id, // use db id
            platformName: acc.platform,
            name: `${acc.platform} ${acc.profileName ? '('+acc.profileName+')' : ''}`,
            icon,
            selected: false,
            color,
            maxChars
          };
        });
      },
      error: (err) => console.error('Error fetching accounts', err)
    });
  }

  loadPosts() {
    this.fileUploadService.getPosts().subscribe({
      next: (posts) => this.posts = posts,
      error: (err) => console.error('Failed to load posts', err)
    });
  }

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
          file,
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

  async submitPost(action: 'post' | 'draft') {
    if (action === 'draft') {
      alert("Drafts are currently not supported.");
      return;
    }

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

    let scheduledDateISO = '';
    if (this.scheduleMode === 'schedule') {
        scheduledDateISO = new Date(`${this.scheduleDate}T${this.scheduleTime}`).toISOString();
    }

    try {
      const selectedAccountIds = this.selectedPlatforms.map(p => p.id);
      
      // Basic post completion without media chunks if no media exists
      let completePayload: any = {
          uploadId: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
          fileName: 'text_only_post',
          totalChunks: 0,
          socialAccountIds: selectedAccountIds,
          mimeType: 'text/plain',
          content: this.postContent,
          scheduledDate: scheduledDateISO || undefined
      };

      if (this.uploadedMedia.length > 0) {
          const selectedFile = this.uploadedMedia[0].file;
          const totalChunks = Math.ceil(selectedFile.size / this.chunkSize);
          
          completePayload.fileName = selectedFile.name;
          completePayload.totalChunks = totalChunks;
          completePayload.mimeType = selectedFile.type;

          for (let i = 0; i < totalChunks; i++) {
            const start = i * this.chunkSize;
            const end = Math.min(start + this.chunkSize, selectedFile.size);
            const chunk = selectedFile.slice(start, end);

            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('uploadId', completePayload.uploadId);
            formData.append('chunkIndex', i.toString());
            formData.append('totalChunks', totalChunks.toString());
            formData.append('fileName', selectedFile.name);
            formData.append('mimeType', selectedFile.type);

            await this.fileUploadService.uploadChunk(formData).toPromise();
          }
      }

      await this.fileUploadService.completeUpload(completePayload).toPromise();
      
      if (this.scheduleMode === 'schedule') {
        this.successMessage = `Post scheduled for ${this.scheduleDate} at ${this.scheduleTime}!`;
      } else {
        this.successMessage = 'Post successfully queued or published!';
      }
      
      this.loadPosts(); // refresh table

      // Reset form
      setTimeout(() => {
        this.successMessage = null;
        this.postContent = '';
        this.uploadedMedia = [];
        this.platforms.forEach(p => p.selected = false);
        this.scheduleMode = 'now';
        this.scheduleDate = '';
        this.scheduleTime = '';
      }, 3000);

    } catch (error) {
       alert("Error processing post.");
       console.error(error);
    } finally {
       this.isSubmitting = false;
    }
  }
}
