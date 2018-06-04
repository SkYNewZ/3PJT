import { Component, OnInit } from '@angular/core';
import { OfferService } from './offer.service';
import { Offer } from './offer';
import { AuthService } from '../auth/auth.service';
import { UserApp } from '../models/main-user';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  public offers: Offer[] = [];
  private userOffer: Offer;

  constructor(private offerService: OfferService, private authService: AuthService) { }

  ngOnInit() {
    this.offerService.availablesOffers.subscribe((offers: Offer[]) => {
      offers.forEach(offer => {
        this.offers.push(Offer.FROM_JSON(offer));
        this.offers.sort((a, b) => a.name === 'BASIC' ? -1 : 1);
      });
      this.authService.isLoggedIn.subscribe((user: UserApp) => {
        this.userOffer = Offer.FROM_JSON(user.offre);
      });
    });
  }

  ifUserHaveTheSameOffer(currentOffer: Offer): boolean {
    return this.userOffer.price === currentOffer.price;
  }

}
