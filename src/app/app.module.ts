import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { ContentComponent } from './content/content.component';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ResultsComponent } from './results/results.component';
import { FormsModule } from '@angular/forms';
import { PageNavComponent } from './page-nav/page-nav.component';
import { ChildrenComponent } from './children/children.component';
import { PageComponent } from './page/page.component';
import { TreeComponent } from './tree/tree.component';
import { ResultsNavComponent } from './results-nav/results-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    ContentComponent,
    TreeComponent,
    ChildrenComponent,
    PageComponent,
    PageNavComponent,
    SearchComponent,
    StatisticsComponent,
    ResultsComponent,
    ResultsNavComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
