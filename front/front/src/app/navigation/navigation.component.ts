import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements OnInit {

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
  
  constructor() { }

  ngOnInit() {
  }

}
