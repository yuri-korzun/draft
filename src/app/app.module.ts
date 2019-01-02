import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {UploadModule} from './upload/upload.module';
import {RouterModule} from '@angular/router';
import {UploadComponent} from './upload/upload.component';
import {AdminComponent} from './admin/admin.component';
import {HttpService} from './services/http.service';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent
  ],
  imports: [
    UploadModule,
    BrowserModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          component: UploadComponent
        },
        {
          path: 'admin',
          component: AdminComponent
        }
      ],
      {
        useHash: true
      }
    )
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
