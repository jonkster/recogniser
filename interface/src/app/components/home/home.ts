import {Component, ViewChild} from '@angular/core';

import {MyWritingDirective} from 'app/components/home/writing.directive';

@Component({
  selector: 'home',
  templateUrl: 'app/components/home/home.html',
  styleUrls: ['app/components/home/home.css'],
  providers: [],
  directives: [ MyWritingDirective ],
  pipes: []
})
export class Home {

    @ViewChild(MyWritingDirective) handwritingDirective: MyWritingDirective;

    guess:string;
    lastSrc = './resources/no-image.png';

    constructor() {}

    ngOnInit() { 
    }

    ngAfterViewInit() {
        this.handwritingDirective.onDigested.subscribe((data) => {
            this.guess = data
                this.lastSrc = this.handwritingDirective.imData;
        });
    }
}
