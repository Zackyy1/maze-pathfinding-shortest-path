import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { HttpModule } from '@angular/http'
import { AppComponent } from './app.component';
import { MazeService } from './shared/maze.service';
import { MazeComponent } from './maze/maze.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MazeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [MazeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
