import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class HttpService {
  constructor (private httpClient: HttpClient) {
  }

  getAllImages () {
    return this.httpClient.get('/api/images');
  }
}
