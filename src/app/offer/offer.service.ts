import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from './offer';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private http: HttpClient) { }

  get availablesOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(environment.apiEndoint + environment.listAvailablesOffersEndpoint);
  }

  subscribeToOffer(offer: Offer): Observable<Offer> {
    const body: { name: string } = {
      name: offer.name
    };
    return this.http.put<Offer>(environment.apiEndoint + environment.updateUserOfferEndpoint, body);
  }
}
