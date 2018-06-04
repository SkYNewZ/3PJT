import { Component, OnInit } from '@angular/core';
import { OfferService } from './offer.service';
import { Offer } from './offer';
import { AuthService } from '../auth/auth.service';
import { UserApp } from '../models/main-user';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  public offers: Offer[] = [];
  private user: UserApp;

  constructor(
    private offerService: OfferService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.offerService.availablesOffers.subscribe((offers: Offer[]) => {
      offers.forEach(offer => {
        this.offers.push(Offer.FROM_JSON(offer));
        this.offers.sort((a, b) => a.name === 'BASIC' ? -1 : 1);
      });
      this.authService.isLoggedIn.subscribe((user: UserApp) => {
        this.user = UserApp.FROM_JSON(user);
      });
    });
  }

  ifUserHaveTheSameOffer(currentOffer: Offer): boolean {
    return this.user.offre.price === currentOffer.price;
  }

  /**
   * Subscribe to an offer
   * @param offer
   */
  subscribeToOffer(offer: Offer): void {
    this.offerService.subscribeToOffer(offer).subscribe((newOffer: Offer) => {
      this.user.offre = newOffer; // register the new offer in the current user
      this.authService.updateUser(this.user).subscribe((newUser: UserApp) => { // update the current user
        this.toastr.success(`You successfully subscribed to the ${newOffer.name} offer`);
      }, (err: HttpErrorResponse) => {
        this.toastr.error('Unexpected error, please try again later');
        console.log(err);
      });
    }, (err: HttpErrorResponse) => {
      this.toastr.error('Unexpected error, please try again later');
      console.log(err);
    });
  }

}
