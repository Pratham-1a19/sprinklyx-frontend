import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
    constructor(private http: HttpClient) { }

    uploadChunk(formData: FormData): Observable<any> {
        return this.http.post('/api/upload/chunk', formData, { withCredentials: true });
    }

    completeUpload(payload: { uploadId: string, fileName: string, totalChunks: number, socialAccountIds: string[], mimeType: string }): Observable<any> {
        return this.http.post('/api/upload/complete', payload, { withCredentials: true });
    }

    getJobStatus(jobId: string): Observable<any> {
        return this.http.get(`/api/upload/status/${jobId}`, { withCredentials: true });
    }
}
