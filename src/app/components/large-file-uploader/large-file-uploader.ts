import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocialMediaService, SocialAccount } from '../../services/social-media';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-large-file-uploader',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './large-file-uploader.html',
  styleUrls: ['./large-file-uploader.scss']
})
export class LargeFileUploaderComponent implements OnInit {
  selectedFile: File | null = null;
  accounts: SocialAccount[] = [];
  selectedAccountIds: string[] = [];

  isUploading = false;
  uploadProgress = 0;
  jobId: string | null = null;
  jobStatus: string | null = null;

  // 5MB chunk size
  private chunkSize = 5 * 1024 * 1024;

  private socialMediaService = inject(SocialMediaService);
  private fileUploadService = inject(FileUploadService);

  ngOnInit() {
    this.socialMediaService.getConnectedAccounts().subscribe({
      next: (accounts) => this.accounts = accounts,
      error: (err) => console.error('Error fetching accounts', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  toggleAccountSelection(accountId: string) {
    const index = this.selectedAccountIds.indexOf(accountId);
    if (index > -1) {
      this.selectedAccountIds.splice(index, 1);
    } else {
      this.selectedAccountIds.push(accountId);
    }
  }

  async uploadFile() {
    if (!this.selectedFile || this.selectedAccountIds.length === 0) return;

    this.isUploading = true;
    this.uploadProgress = 0;
    this.jobStatus = 'Uploading to server...';

    // Generate a unique ID for this upload session
    const uploadId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
    const totalChunks = Math.ceil(this.selectedFile.size / this.chunkSize);

    try {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * this.chunkSize;
        const end = Math.min(start + this.chunkSize, this.selectedFile.size);
        const chunk = this.selectedFile.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('uploadId', uploadId);
        formData.append('chunkIndex', i.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('fileName', this.selectedFile.name);
        formData.append('mimeType', this.selectedFile.type);

        // Upload chunk
        await this.fileUploadService.uploadChunk(formData).toPromise();

        // Update progress
        this.uploadProgress = Math.round(((i + 1) / totalChunks) * 100);
      }

      // Complete upload
      this.jobStatus = 'Assembling file and queuing job...';
      const completeResponse = await this.fileUploadService.completeUpload({
        uploadId,
        fileName: this.selectedFile.name,
        totalChunks,
        socialAccountIds: this.selectedAccountIds,
        mimeType: this.selectedFile.type
      }).toPromise();

      this.jobId = completeResponse.job._id;
      this.jobStatus = 'Queued for social media processing';

      // Start polling for job status
      this.pollJobStatus();

    } catch (error) {
      console.error('Upload failed:', error);
      this.jobStatus = 'Upload failed.';
      this.isUploading = false;
    }
  }

  pollJobStatus() {
    if (!this.jobId) return;

    const intervalId = setInterval(() => {
      this.fileUploadService.getJobStatus(this.jobId!).subscribe({
        next: (job) => {
          this.jobStatus = `Status: ${job.status} (Progress: ${job.progress}%)`;
          if (job.status === 'completed' || job.status === 'failed') {
            clearInterval(intervalId);
            this.isUploading = false;
            // Optionally reset or show success message
          }
        },
        error: (err) => {
          console.error('Failed to poll status', err);
          clearInterval(intervalId);
          this.isUploading = false;
        }
      });
    }, 3000); // Poll every 3 seconds
  }
}
