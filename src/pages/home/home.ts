import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
// import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userName: string;
  showLogin: Boolean;
  showWelcome: Boolean;
  logging : Boolean;
  userText: string;
  // private apiKey: string = '02a5a16c7b854b2cb4084bc3a08b986e';

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {
    this.logging = true;
    this.checkLoggedIn();
  }

  checkLoggedIn() {
    let loading = this.loadingCtrl.create({});
    let homepage = this;

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

  googleLogin():void {
    let provider = new firebase.auth.GoogleAuthProvider();
    this.log("Google Login");
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().signInWithRedirect(provider);
  }

  sendMsg(): void {
    this.log(this.userText);
  }

  log(...content): void {
    if (this.logging) {
        console.log(content[0], content[1]? content[1] : ''  , content[2]? content[2] : '');
    }
  }
}
