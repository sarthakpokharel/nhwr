import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trial1',
  templateUrl: './trial1.component.html',
  styleUrls: ['./trial1.component.scss']
})
export class Trial1Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  selectedCar!: number;

  cars = [
      { id: 1, name: 'Volvo' },
      { id: 2, name: 'Saab' },
      { id: 3, name: 'Opel' },
      { id: 4, name: 'Audi' },
  ];

}
