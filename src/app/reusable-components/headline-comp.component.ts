import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-headline-comp',
  standalone:true,
  template: `
    <p class="headline text-center p-2 ion-text-uppercase mb-0 text-white">
      {{ title }}
    </p>
  `,
  styles: [`
    .headline {
      background-color: var(--bg-primary-100);
    }
  `]
})
export class HeadlineCompComponent  implements OnInit {
  
@Input() title: string = "";

  constructor() { }

  ngOnInit() {}

}
