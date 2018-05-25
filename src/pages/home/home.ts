import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userName: string;
  showLogin: Boolean;
  showWelcome: Boolean;
  logging : Boolean;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {
    let homepage = this;
    let loading = this.loadingCtrl.create({});
    this.logging = true;

    loading.present();
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        homepage.log('User detail: ', user);
        homepage.userName = user.displayName;
        homepage.showWelcome = true;
      }
      else {
        homepage.log("user not login");
        homepage.showLogin = true;
      }
      loading.dismissAll();
    });
  }

  googleLogin() {
    let provider = new firebase.auth.GoogleAuthProvider();
    this.log("Google Login");
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().signInWithRedirect(provider);
  }

  log(...content) {
    if (this.logging) {
        console.log(content[0], content[1]? content[1] : ''  , content[2]? content[2] : '');
    }
  }
}
