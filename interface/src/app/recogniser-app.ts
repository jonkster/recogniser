import {Component} from '@angular/core';
import {Routes, ROUTER_DIRECTIVES} from '@angular/router';

import {Home} from './components/home/home';
import {About} from './components/about/about';
import {RepoBrowser} from './components/repo-browser/repo-browser';

@Component({
  selector: 'recogniser-app',
  providers: [],
  pipes: [],
  directives: [ROUTER_DIRECTIVES],
  styleUrls: [ 'app/recogniser-app.css' ],
  templateUrl: 'app/recogniser-app.html',
})
@Routes([
  { path: '/',       component: Home,       },
  { path: '/about',  component: About,      },
  { path: '/github', component: RepoBrowser },
])
export class RecogniserApp {

  constructor() {}

}
