import { IHttpClient } from '../http/IHttpClient';
import { Result } from '../models/Result';
import { BaseService } from './BaseService';
import { UriBuilder } from '../utils/UriBuilder';
import * as fs from 'fs';
import * as path from 'path';

export class FileService extends BaseService {
  constructor(httpClient: IHttpClient, baseUrl: string, headers: Record<string, string>) {
    super(httpClient, baseUrl, headers);
  }

  getUploadToken(
    containerName?: string,
    filename?: string,
    folder?: string,
  ): Promise<Result<unknown>> {
    const query: Record<string, unknown> = {
      folder: folder ?? 'useruploads',
    };
    if (containerName) query['containerName'] = containerName;
    if (filename) query['filename'] = filename;
    return this.get('/api/storage/uploadtoken', query);
  }

  async uploadFile(filePath: string, model?: string): Promise<Result<unknown>> {
    if (!fs.existsSync(filePath)) {
      return Result.error(`File not found: ${filePath}`);
    }

    const query: Record<string, unknown> = {};
    if (model) query['model'] = model;

    const uri = UriBuilder.build(this.baseUrl, '/api/provider-files/upload', query);

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const filename = path.basename(filePath);
      const boundary = `----FormBoundary${Date.now()}`;
      const body = this.buildMultipartBody(fileBuffer, filename, boundary);

      const uploadHeaders: Record<string, string> = { ...this.headers };
      delete uploadHeaders['Content-Type'];
      uploadHeaders['Content-Type'] = `multipart/form-data; boundary=${boundary}`;

      const response = await fetch(uri, {
        method: 'POST',
        headers: uploadHeaders,
        body,
      });

      const text = await response.text();

      if (response.ok) {
        const json = text.trim() ? JSON.parse(text) : {};
        return Result.success(json, { status: response.status });
      }

      return Result.error(`HTTP ${response.status}: ${text}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return Result.error(`File upload failed: ${message}`);
    }
  }

  downloadFile(model?: string, fileId?: string): Promise<Result<unknown>> {
    const query: Record<string, unknown> = {};
    if (model) query['model'] = model;
    if (fileId) query['fileId'] = fileId;
    return this.get('/api/provider-files/download', query);
  }

  private buildMultipartBody(
    fileBuffer: Buffer,
    filename: string,
    boundary: string,
  ): Buffer {
    const nl = '\r\n';
    const parts: Buffer[] = [
      Buffer.from(`--${boundary}${nl}`),
      Buffer.from(
        `Content-Disposition: form-data; name="file"; filename="${filename}"${nl}`,
      ),
      Buffer.from(`Content-Type: application/octet-stream${nl}${nl}`),
      fileBuffer,
      Buffer.from(nl),
      Buffer.from(`--${boundary}--${nl}`),
    ];

    return Buffer.concat(parts);
  }
}