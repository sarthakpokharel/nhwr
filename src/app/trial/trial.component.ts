import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-trial',
  templateUrl: './trial.component.html',
  styleUrls: ['./trial.component.scss']
})
export class TrialComponent implements OnInit{
    dropdownList: any = [];
    selectedItems: any = [];
    dropdownSettings: any = {};
    ngOnInit(){
    }

    openDropdown(){
        document.getElementById("myDropdown")!.classList.toggle("show");
    }

    filterFunction() {
      var input:any, filter, ul, li, a, i;
      input = document.getElementById("myInput");
      var filter = input?.value.toUpperCase();
      var div = document.getElementById("myDropdown");
      var a: any= div?.getElementsByTagName("a");
      for (i = 0; i < a!.length; i++) {
        var txtValue = a![i].textContent || a![i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          a![i].style.display = "";
        } else {
          a![i].style.display = "none";
        }
      }
    }

    showSearch(){
      var search = document.getElementById('op1');
      search?.classList.toggle('show')
    }
}