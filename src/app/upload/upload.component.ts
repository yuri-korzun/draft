import {Component} from '@angular/core';
import {DialogComponent} from './dialog/dialog.component';
import {MatDialog} from '@angular/material';
import {UploadService} from './upload.service';
import {HttpService} from '../services/http.service';
import {environment} from '../../environments/environment';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  images: string[];

  private readonly apiUrl = environment.production ? '' : 'api/';
    constructor (private httpService: HttpService, public dialog: MatDialog) {
    httpService.getAllImages().subscribe((result: any) => {
      this.images = result.map(image => this.getImageName(image)).reverse();
    });
  }

  private getImageName (name: string) {
      return encodeURI(`${this.apiUrl}storage/${name}`);
  }

  public openUploadDialog() {
    const dialogRef = this.dialog.open(DialogComponent, { width: '50%', height: '50%' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.httpService.getLastImage().subscribe(result => {
          this.images.unshift(this.getImageName(result));
        })
      }
    })
  }
}
