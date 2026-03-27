import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { NgFor } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule, Footer, NgFor, Header, SidebarComponent],
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
  sharedFiles: any[] = []; // For members
  
  isLoading = true;
  error: string | null = null;

  currentFolderId = 'root';
  folderHistory: string[] = [];
  
  // Selection
  selectedFiles: Set<string> = new Set();
  isSharing = false;
  
  // User context
  currentUser: any;
  isAdmin: boolean = false;
  isDriveIntegrated: boolean = false;

  // Upload Request UI Variables
  showRequestModal = false;
  showPendingModal = false;
  showTokenUploadModal = false;
  
  pendingRequests: any[] = [];
  myRequests: any[] = [];
  
  requestForm = {
    fileName: '',
    fileType: 'image/jpeg',
    platform: 'google-drive',
    reason: ''
  };

  tokenUploadData = {
    file: null as File | null,
    token: ''
  };

  constructor(private userService: UserService) { }

  ngOnInit() {
    const pendingToken = localStorage.getItem('pendingInvitationToken');
    if (pendingToken) {
      localStorage.removeItem('pendingInvitationToken');
      window.location.href = `/accept-invite?token=${pendingToken}`;
      return;
    }

    this.userService.getUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isAdmin = user.isAdmin || false;
        this.isDriveIntegrated = user.isDriveIntegrated || false;
        
        if (this.isAdmin) {
          if (this.isDriveIntegrated) {
            this.loadFiles('root');
          } else {
            this.isLoading = false;
          }
        } else {
          this.loadSharedFiles();
        }
      },
      error: () => this.error = "Failed to authenticate."
    });
  }

  loadSharedFiles() {
    this.isLoading = true;
    this.error = null;
    this.currentFolderId = 'root'; // Reset context
    this.userService.getSharedFiles().subscribe({
      next: (data) => {
        this.sharedFiles = data;
        this.isLoading = false;
        if (this.sharedFiles.length === 0) {
          this.error = 'No files have been shared with you yet.';
        }
      },
      error: (err) => {
        this.error = 'Failed to load shared files.';
        this.isLoading = false;
      }
    });
  }

  loadSharedFolderContents(folderId: string) {
    this.isLoading = true;
    this.error = null;
    this.userService.getSharedFolderContents(folderId).subscribe({
      next: (data) => {
        this.sharedFiles = data;
        this.isLoading = false;
        if (this.sharedFiles.length === 0) {
          this.error = 'This folder is empty.';
        }
      },
      error: (err) => {
        console.error('Failed to load shared folder contents.', err);
        this.error = 'Failed to load folder contents.';
        this.isLoading = false;
      }
    });
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
        if (err.error?.notIntegrated) {
            this.isDriveIntegrated = false;
        } else if (err.status === 401) {
          this.error = 'Please Sign In with Google again. Your session may have expired.';
        } else if (err.status === 404) {
          this.error = 'Folder not found or API endpoint missing.';
        } else {
          this.error = 'Error loading files: ' + (err.error?.message || err.message || 'Unknown error');
        }
      }
    });
  }

  // Admin: Integrate different Google Drive account
  integrateDrive() {
    window.location.href = '/api/drive/connect';
  }

  // Navigation: Open folder or file
  openItem(item: any) {
    if (this.selectedFiles.size > 0 && this.isAdmin) {
      this.toggleSelection(item, new Event('click'));
      return;
    }

    if (item.mimeType === 'application/vnd.google-apps.folder') {
      // Enter folder
      this.folderHistory.push(this.currentFolderId);
      this.currentFolderId = item.fileId || item.id;
      this.selectedFiles.clear();
      
      if (this.isAdmin) {
        this.loadFiles(this.currentFolderId);
      } else {
        this.loadSharedFolderContents(this.currentFolderId);
      }
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
      this.selectedFiles.clear();
      
      if (this.isAdmin) {
        this.loadFiles(this.currentFolderId);
      } else {
        if (this.currentFolderId === 'root') {
          this.loadSharedFiles();
        } else {
          this.loadSharedFolderContents(this.currentFolderId);
        }
      }
    }
  }

  toggleSelection(item: DriveItem, event: Event) {
    event.stopPropagation();
    if (this.selectedFiles.has(item.id)) {
      this.selectedFiles.delete(item.id);
    } else {
      this.selectedFiles.add(item.id);
    }
  }

  shareSelected() {
    if (this.selectedFiles.size === 0) return;
    
    // Map selected IDs to full objects
    const itemsToShare = this.files.filter(f => this.selectedFiles.has(f.id)).map(f => ({
      fileId: f.id,
      name: f.name,
      mimeType: f.mimeType,
      platform: 'google-drive',
      webViewLink: f.webViewLink,
      iconLink: f.iconLink
    }));

    this.isSharing = true;
    this.userService.shareFiles(itemsToShare, []).subscribe({
      next: () => {
        alert('Files shared with team successfully!');
        this.selectedFiles.clear();
        this.isSharing = false;
      },
      error: () => {
        alert('Failed to share files.');
        this.isSharing = false;
      }
    });
  }

  // --- MEMBER UPLOAD REQUESTS ---
  openRequestModal() {
    this.showRequestModal = true;
  }
  
  closeRequestModal() {
    this.showRequestModal = false;
  }

  submitRequest() {
    if(!this.requestForm.fileName) return alert("File name required");
    this.userService.submitUploadRequest(this.requestForm).subscribe({
      next: () => {
        alert("Request submitted successfully!");
        this.closeRequestModal();
        this.loadMyRequests();
      },
      error: () => alert("Failed to submit request")
    });
  }

  loadMyRequests() {
    this.userService.getMyUploadRequests().subscribe({
      next: (reqs) => this.myRequests = reqs
    });
  }

  openTokenUploadModal() {
    this.showTokenUploadModal = true;
  }

  closeTokenUploadModal() {
    this.showTokenUploadModal = false;
  }

  onTokenFileSelected(event: any) {
    this.tokenUploadData.file = event.target.files[0];
  }

  submitTokenUpload() {
    if (!this.tokenUploadData.file || !this.tokenUploadData.token) return;
    this.isLoading = true;
    this.closeTokenUploadModal();
    this.userService.uploadWithToken(this.tokenUploadData.file, this.tokenUploadData.token).subscribe({
      next: (event: any) => {
        if (event.type === 4) {
          alert('Upload successful via token!');
          this.isLoading = false;
          this.loadSharedFiles();
        }
      },
      error: (err) => {
        console.error('Token upload error', err);
        alert('Upload failed: ' + err.error?.message);
        this.isLoading = false;
      }
    });
  }

  // --- ADMIN PENDING REQUESTS ---
  openPendingModal() {
    this.showPendingModal = true;
    this.loadPendingRequests();
  }

  closePendingModal() {
    this.showPendingModal = false;
  }

  loadPendingRequests() {
    this.userService.getPendingUploadRequests().subscribe({
      next: (reqs) => this.pendingRequests = reqs
    });
  }

  approveRequest(id: string) {
    this.userService.approveUploadRequest(id).subscribe({
      next: (res) => {
        alert(`Request approved! Token: ${res.token}`);
        this.loadPendingRequests();
      },
      error: () => alert("Failed to approve")
    });
  }

  rejectRequest(id: string) {
    this.userService.rejectUploadRequest(id).subscribe({
      next: () => this.loadPendingRequests(),
      error: () => alert("Failed to reject")
    });
  }

  downloadFile(item: DriveItem | any, event: Event, proxyDownload: boolean = false) {
    event.stopPropagation(); // Prevent opening the file

    if (proxyDownload) {
      // This is a shared file downloaded by a member via Backend Proxy
      window.open(`/api/shared-files/download/${item._id}`, '_blank');
      return;
    }

    // 1. Direct download if available (binary files)
    if (item.webContentLink) {
      window.open(item.webContentLink, '_self');
      return;
    }

    // 2. Export Google Docs/Sheets/Slides
    let exportUrl = '';
    if (item.mimeType === 'application/vnd.google-apps.document') {
      exportUrl = `https://docs.google.com/document/d/${item.id || item.fileId}/export?format=docx`;
    } else if (item.mimeType === 'application/vnd.google-apps.spreadsheet') {
      exportUrl = `https://docs.google.com/spreadsheets/d/${item.id || item.fileId}/export?format=xlsx`;
    } else if (item.mimeType === 'application/vnd.google-apps.presentation') {
      exportUrl = `https://docs.google.com/presentation/d/${item.id || item.fileId}/export/pptx`;
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