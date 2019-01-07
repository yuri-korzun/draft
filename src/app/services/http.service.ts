import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class HttpService {
  apiUrl: string;

  constructor (private httpClient: HttpClient) {
    this.apiUrl = environment.production ? '' : '/api';

    console.log('production mode', !!environment.production);
  }

  getAllImages () {
    return this.httpClient.get(`${this.apiUrl}/images`);
  }

  getLastImage () {
    return this.httpClient.get<string>(`${this.apiUrl}/last-image`);
  }
}
