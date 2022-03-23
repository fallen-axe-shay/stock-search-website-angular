import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from 'src/services/state-service.service';

@Component({
  selector: 'app-buy-stock-modal',
  templateUrl: './buy-stock-modal.component.html',
  styleUrls: ['./buy-stock-modal.component.css']
})
export class BuyStockModalComponent implements OnInit {

  purchaseForm = new FormGroup({
    purchaseFormControl: new FormControl(0)
  });

  stockBuyTotal: any;
  modalCloseResult: any;

  constructor(public state: StateService,  private modalService: NgbModal) { 
    this.stockBuyTotal = 0;
  }

  @ViewChild('content', { static: false }) content: ElementRef;

  ngOnInit(): void {

    this.purchaseForm.get('purchaseFormControl').valueChanges.subscribe((qty)=> {
      this.stockBuyTotal = Math.round((this.state.getStockData()['c'] * qty) * 100) / 100;
    });

  } 

  /* Modal Operations */
  open() {
    this.purchaseForm.get('purchaseFormControl').setValue(0);
    this.stockBuyTotal = 0;
    this.state.addSearchPageFlags({invalidPurchase: false});
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.modalCloseResult = `Closed with: ${result}`;
    }, (reason) => {
      this.modalCloseResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  allowOnlyNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  buyStock(ticker, stockQty, amount, sharePrice) {
    let balance = this.state.getWalletAmount();
    balance = Math.round((balance - amount) * 100) / 100;
    this.state.setWalletAmount(balance);
    let stocks = this.state.readFromLocalStorage('stocks');
    if(stocks==null) {
      stocks = {}
    }
    if(Object.keys(stocks).indexOf(ticker)==-1) {
      stocks[ticker] = [];
    }
    for(var i = 0; i<stockQty; i++) {
      stocks[ticker].push({
        timestamp: (new Date).getTime(),
        amount: sharePrice
      });
    }
    this.state.addToLocalStorage('stocks', stocks);
    return true;
  }

}
