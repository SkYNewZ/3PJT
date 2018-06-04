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
}
