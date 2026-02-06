// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Footer } from './footer/footer';
// import { Header } from './header/header';

// interface DriveItem {
//   name: string;
//   type: 'file' | 'folder';
// }

// interface SuggestedFile {
//   name: string;
//   owner: string;
// }

// @Component({
//   selector: 'app-main-layout',
//   standalone: true,
//   imports: [Footer, Header], // CommonModule, 
//   templateUrl: './main-layout.html',
//   styleUrls: ['./main-layout.scss'],
// })

// export class MainLayoutComponent {

//   // suggested: SuggestedFile[] = [
//   //   { name: 'Project Proposal.pdf', owner: 'You opened yesterday' },
//   //   { name: 'Design.fig', owner: 'Shared by Alex' },
//   //   { name: 'Invoice.xlsx', owner: 'Opened recently' },
//   //   { name: 'Resume.docx', owner: 'Edited last week' }
//   // ];

//   // files: DriveItem[] = [
//   //   { name: 'Marketing', type: 'folder' },
//   //   { name: 'Angular Course', type: 'folder' },
//   //   { name: 'Budget.xlsx', type: 'file' },
//   //   { name: 'Logo.png', type: 'file' },
//   //   { name: 'Contracts', type: 'folder' },
//   //   { name: 'Notes.txt', type: 'file' },
//   //   { name: 'UI Kit', type: 'folder' },
//   //   { name: 'Presentation.pptx', type: 'file' }
//   // ];

//   // getFileIcon(fileName: string, type: 'file' | 'folder'): string {

//   // if (type === 'folder') {
//   //   return 'assets/media/file-types/vector.svg'; // or folder.svg if you have one
//   // }

//   // const ext = fileName.split('.').pop()?.toLowerCase();

//   // const supported: Record<string, string> = {
//   //   pdf: 'pdf.svg',
//   //   doc: 'doc.svg',
//   //   docx: 'doc.svg',
//   //   xls: 'xls.svg',
//   //   xlsx: 'excel.svg',
//   //   ppt: 'ppt.svg',
//   //   pptx: 'powerpoint.svg',
//   //   fig: 'figma.svg',
//   //   txt: 'txt.svg',
//   //   zip: 'zip.svg',
//   //   mp3: 'mp3.svg',
//   //   js: 'js.svg',
//   //   css: 'css.svg',
//   //   html: 'html.svg',
//   //   php: 'php.svg',
//   //   sql: 'sql.svg'
//   // };

//   // return `assets/media/file-types/${supported[ext!] || 'text.svg'}`;
// // }

// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Footer } from './footer/footer';
import { Header } from './header/header';
import { SidebarComponent } from './sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Footer,
    SidebarComponent,
    RouterModule
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayoutComponent { }
