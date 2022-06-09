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

    // selectThis(e: any){
    //   var selected = document.getElementById('selection');
    //   var ele: HTMLElement = e.target;
    //   var val: InnerHTML = ele.getAttribute('value')
    //   selected?.setAttribute("value",val)
    //   console.log(val)
    //   selected!.textContent = ele.textContent;

    //   document.getElementById('myDropdown')?.classList.toggle('show');
    // }
    // trial(){
    //   alert("hellp");
    // }

    selectThis(e: any){
      var selected = document.getElementById('selection');
      var ele: HTMLElement = e.target;
      var val = ele.getAttribute('type')
<<<<<<< HEAD
      alert(val);
=======
>>>>>>> 3f0ec5e90a91dbdcbc1eeb47bcae594528f2fbef
      selected?.setAttribute("value",val!)
      console.log(val)
      selected!.textContent = ele.textContent;

      document.getElementById('myDropdown')?.classList.toggle('show');
    }
}