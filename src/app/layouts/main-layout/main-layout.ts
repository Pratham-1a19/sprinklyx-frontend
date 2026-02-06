import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { NgFor } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar';
import { UserService } from '../../services/user.service';

interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  iconLink: string;
  webViewLink: string;
  thumbnailLink?: string;
}

interface SuggestedFile {
  name: string;
  owner: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, Footer, NgFor, Header, SidebarComponent],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})

export class MainLayoutComponent implements OnInit {

  viewMode: 'grid' | 'list' = 'grid';

  suggested: SuggestedFile[] = [
    { name: 'Project Proposal.pdf', owner: 'You opened yesterday' },
    { name: 'Design.fig', owner: 'Shared by Alex' },
    { name: 'Invoice.xlsx', owner: 'Opened recently' },
    { name: 'Resume.docx', owner: 'Edited last week' }
  ];

  files: DriveItem[] = [];
  isLoading = true;
  error: string | null = null;

  currentFolderId = 'root';
  folderHistory: string[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadFiles('root');
  }

  loadFiles(folderId: string) {
    this.isLoading = true;
    this.error = null;
    this.userService.getDriveFiles(folderId).subscribe({
      next: (data: any) => {
        this.files = data;
        this.isLoading = false;
        if (this.files.length === 0) {
          this.error = 'No files found in this folder.';
        }
      },
      error: (err: any) => {
        console.error('Failed to fetch Drive files', err);
        this.isLoading = false;
        if (err.status === 401) {
          this.error = 'Please Sign In with Google again. Your session may have expired.';
        } else if (err.status === 404) {
          this.error = 'Folder not found or API endpoint missing.';
        } else {
          this.error = 'Error loading files: ' + (err.error?.message || err.message || 'Unknown error');
        }
      }
    });
  }

  // Navigation: Open folder or file
  openItem(item: DriveItem) {
    if (item.mimeType === 'application/vnd.google-apps.folder') {
      // Enter folder
      this.folderHistory.push(this.currentFolderId);
      this.currentFolderId = item.id;
      this.loadFiles(this.currentFolderId);
    } else {
      // Open file in new tab (View/Edit)
      if (item.webViewLink) {
        window.open(item.webViewLink, '_blank');
      }
    }
  }

  navigateUp() {
    if (this.folderHistory.length > 0) {
      const parentId = this.folderHistory.pop();
      this.currentFolderId = parentId!;
      this.loadFiles(this.currentFolderId);
    }
  }

  downloadFile(item: DriveItem, event: Event) {
    event.stopPropagation(); // Prevent opening the file

    // 1. Direct download if available (binary files)
    if ((item as any).webContentLink) {
      window.open((item as any).webContentLink, '_self');
      return;
    }

    // 2. Export Google Docs/Sheets/Slides
    let exportUrl = '';
    if (item.mimeType === 'application/vnd.google-apps.document') {
      exportUrl = `https://docs.google.com/document/d/${item.id}/export?format=docx`;
    } else if (item.mimeType === 'application/vnd.google-apps.spreadsheet') {
      exportUrl = `https://docs.google.com/spreadsheets/d/${item.id}/export?format=xlsx`;
    } else if (item.mimeType === 'application/vnd.google-apps.presentation') {
      exportUrl = `https://docs.google.com/presentation/d/${item.id}/export/pptx`;
    }

    if (exportUrl) {
      window.open(exportUrl, '_self');
      return;
    }

    // 3. Fallback
    if (confirm('This file cannot be downloaded directly. Open it to view options?')) {
      window.open(item.webViewLink, '_blank');
    }
  }

  // Upload
  triggerUpload() {
    const fileInput = document.getElementById('drive-upload-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.isLoading = true; // Show loading while uploading
      this.userService.uploadFile(file, this.currentFolderId).subscribe({
        next: (event: any) => {
          // Check for HttpResponse (type 4)
          if (event.type === 4) {
            console.log('Upload successful', event.body);
            this.isLoading = false;
            this.loadFiles(this.currentFolderId);
          }
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.isLoading = false;
          alert('Upload failed: ' + (err.error?.message || err.message));
        }
      });
    }
  }


  getFileIcon(file: DriveItem): string {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      return 'assets/media/file-types/folder.svg';
    }

    const ext = file.name.split('.').pop()?.toLowerCase();

    // Map mime types if extension is missing or for google docs
    if (file.mimeType.includes('spreadsheet')) return 'assets/media/file-types/excel.svg';
    if (file.mimeType.includes('document')) return 'assets/media/file-types/doc.svg';
    if (file.mimeType.includes('presentation')) return 'assets/media/file-types/powerpoint.svg';

    const supported: Record<string, string> = {
      pdf: 'pdf.svg',
      doc: 'doc.svg',
      docx: 'doc.svg',
      xls: 'xls.svg',
      xlsx: 'excel.svg',
      ppt: 'ppt.svg',
      pptx: 'powerpoint.svg',
      fig: 'figma.svg',
      txt: 'txt.svg',
      zip: 'zip.svg',
      mp3: 'mp3.svg',
      js: 'js.svg',
      css: 'css.svg',
      html: 'html.svg',
      php: 'php.svg',
      sql: 'sql.svg'
    };

    return `assets/media/file-types/${supported[ext!] || 'text.svg'}`;
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

}