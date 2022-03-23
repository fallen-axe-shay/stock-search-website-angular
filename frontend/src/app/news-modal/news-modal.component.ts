import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news-modal',
  templateUrl: './news-modal.component.html',
  styleUrls: ['./news-modal.component.css']
})
export class NewsModalComponent implements OnInit {

  modalCloseResult: any;
  data: any;
  months: any;

  constructor(private modalService: NgbModal) {
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
   }

  @ViewChild('content', { static: false }) content: ElementRef;

  ngOnInit(): void {
  }

  open(news) {
    this.data = news;
    let today = new Date(this.data.datetime * 1000);
    this.data['formattedDatetime'] = `${this.months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
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

}
