import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams } from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';

import{ SearchResultsPage } from '../search-results/search-results';
import { Trip } from '../../models/trip.model';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  trip={} as Trip;
  private itemsCollection:AngularFirestoreCollection<Trip>;
  trips:Observable<Trip[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFirestore) {
    this.trip.origin = "Universidad";

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
  SearchResults(value){
    this.trip.destination=value;
    console.log(this.trip.destination)
    this.itemsCollection = this.db.collection('trips', ref => ref.where('origin', '==', this.trip.origin)
                                                      .where('destination', '==', this.trip.destination))
                                                      
    
    this.trips = this.itemsCollection.snapshotChanges().map( actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Trip;
        const id = a.payload.doc.id;
        return {id, ...data} 
      })
    })
  
    this.navCtrl.push(SearchResultsPage, {
      data: this.trips
    });
  }
}
