import {Component} from '@angular/core';
import {HttpService} from '../services/http.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  images: any;

  constructor (httpService: HttpService) {
    httpService.getAllImages().subscribe((result: any) => {
      this.images = result.map(image => `api/storage/${image}`);
    });
  }
}
