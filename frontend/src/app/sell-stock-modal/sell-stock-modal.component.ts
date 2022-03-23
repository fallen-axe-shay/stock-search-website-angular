import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from 'src/services/state-service.service';

@Component({
  selector: 'app-sell-stock-modal',
  templateUrl: './sell-stock-modal.component.html',
  styleUrls: ['./sell-stock-modal.component.css']
})
export class SellStockModalComponent implements OnInit {

  sellForm = new FormGroup({
    sellFormControl: new FormControl(0)
  });

  stockSellTotal: any;
  modalCloseResult: any;
  currentStockQty: any;

  constructor(public state: StateService,  private modalService: NgbModal) { 
    this.stockSellTotal = 0;
    this.currentStockQty = 0;
  }

  @ViewChild('content', { static: false }) content: ElementRef;

  ngOnInit(): void {

    this.sellForm.get('sellFormControl').valueChanges.subscribe((qty)=> {
      this.stockSellTotal = Math.round((this.state.getStockData()['c'] * qty) * 100) / 100;
    });
    
  }

    /* Modal Operations */
    open() {
      this.sellForm.get('sellFormControl').setValue(0);
      this.stockSellTotal = 0;
      let ticker = this.state.getStockData().ticker;
      this.currentStockQty = this.state.readFromLocalStorage('stocks')[ticker].length;
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
  
    sellStock(ticker, stockQty, amount, sharePrice) {
      let balance = this.state.getWalletAmount();
      balance = Math.round((balance + amount) * 100) / 100;
      this.state.setWalletAmount(balance);
      let stocks = this.state.readFromLocalStorage('stocks');
      if(stocks==null) {
        stocks = {}
      }
      if(Object.keys(stocks).indexOf(ticker)==-1) {
        stocks[ticker] = [];
      }
      let soldStocks = [];
      for(var i = 0; i<stockQty; i++) {
        soldStocks.push(stocks[ticker].pop());
      }
      this.state.addToLocalStorage('stocks', stocks);
      return true;
    }

}
