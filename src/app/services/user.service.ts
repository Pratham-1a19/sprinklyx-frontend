import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = '/api/user/me';

    constructor(private http: HttpClient) { }

    getUser(): Observable<any> {
        return this.http.get(this.apiUrl, { withCredentials: true });
    }

    getDriveFiles(folderId: string = 'root'): Observable<any> {
        return this.http.get(`/api/drive/files?folderId=${folderId}`, { withCredentials: true });
    }

    uploadFile(file: File, folderId: string = 'root'): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('parentId', folderId);

        return this.http.post('/api/drive/upload', formData, {
            withCredentials: true,
            reportProgress: true,
            observe: 'events'
        });
    }

    inviteUser(email: string): Observable<any> {
        return this.http.post('/api/team/invite', { email }, { withCredentials: true });
    }

    getTeamMembers(): Observable<any[]> {
        return this.http.get<any[]>('/api/team/members', { withCredentials: true });
    }

    acceptInvitation(token: string): Observable<any> {
        return this.http.post('/api/team/accept', { token }, { withCredentials: true });
    }

    // --- Role-Based Drive Share APIs ---

    getSharedFiles(): Observable<any> {
        return this.http.get('/api/shared-files', { withCredentials: true });
    }

    shareFiles(files: any[], sharedWith: string[] = []): Observable<any> {
        return this.http.post('/api/drive/share', { files, sharedWith }, { withCredentials: true });
    }

    revokeShare(fileId: string): Observable<any> {
        return this.http.delete(`/api/drive/share/${fileId}`, { withCredentials: true });
    }

    // --- Token Upload Requests APIs ---

    submitUploadRequest(requestData: any): Observable<any> {
        return this.http.post('/api/upload-requests', requestData, { withCredentials: true });
    }

    getMyUploadRequests(): Observable<any[]> {
        return this.http.get<any[]>('/api/upload-requests/me', { withCredentials: true });
    }

    getPendingUploadRequests(): Observable<any[]> {
        return this.http.get<any[]>('/api/upload-requests/pending', { withCredentials: true });
    }

    approveUploadRequest(requestId: string): Observable<any> {
        return this.http.post(`/api/upload-requests/${requestId}/approve`, {}, { withCredentials: true });
    }

    rejectUploadRequest(requestId: string): Observable<any> {
        return this.http.post(`/api/upload-requests/${requestId}/reject`, {}, { withCredentials: true });
    }

    uploadWithToken(file: File, uploadToken: string): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('uploadToken', uploadToken);

        return this.http.post('/api/drive/upload-with-token', formData, {
            withCredentials: true,
            reportProgress: true,
            observe: 'events'
        });
    }

    logout() {
        window.location.href = '/auth/logout';
    }
}
