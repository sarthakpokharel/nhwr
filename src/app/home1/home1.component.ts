import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home1',
  templateUrl: './home1.component.html',
  styleUrls: ['./home1.component.scss']
})
export class Home1Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  changeContent(e:any){
    const element: HTMLElement = e.target;
    const elementt = element.parentElement;
    const containerNumber: any = elementt?.classList[1];
    const active = document.getElementsByClassName('active');
    const getAllContainers = document.getElementsByClassName('page-body');

    for (var i=0; i<active.length; i++){
      active[i].classList.remove('active')
    }

    for (var i=0; i<getAllContainers.length; i++){
      getAllContainers[i].classList.add('hide')
    }

    const showContainer = document.getElementsByClassName(containerNumber)[1];
    showContainer.classList.remove('hide')
    
   


    element.classList.add('active')

  }

}
