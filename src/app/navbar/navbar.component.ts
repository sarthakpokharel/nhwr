import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  changeContent(e: any) {
    const element: HTMLElement = e.target;
    const active = document.getElementsByClassName('active');

    for (var i = 0; i < active.length; i++) {
      active[i].classList.remove('active')
    }
    element.classList.add('active');

  }

}
