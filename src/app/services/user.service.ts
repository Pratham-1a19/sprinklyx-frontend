import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:3000/api/user/me';

    constructor(private http: HttpClient) { }

    getUser(): Observable<any> {
        return this.http.get(this.apiUrl, { withCredentials: true });
    }

    getDriveFiles(folderId: string = 'root'): Observable<any> {
        return this.http.get(`http://localhost:3000/api/drive/files?folderId=${folderId}`, { withCredentials: true });
    }

    uploadFile(file: File, folderId: string = 'root'): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('parentId', folderId);

        return this.http.post('http://localhost:3000/api/drive/upload', formData, {
            withCredentials: true,
            reportProgress: true,
            observe: 'events'
        });
    }
}
