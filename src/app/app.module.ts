import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BucketsComponent } from './buckets.component';

const routing = RouterModule.forRoot([
    { path: '', redirectTo: '/buckets', pathMatch: 'full' },
    { path: 'buckets', component: BucketsComponent }
]);

@NgModule({
  declarations: [
    AppComponent,
    BucketsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
