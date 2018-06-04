import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import * as firebase from "firebase";
// import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  UserName : string = window.sessionStorage.getItem('UserName');
  rootPage: any = HomePage;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Login', component: HomePage },
      { title: 'Logout', component: HomePage }
      ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (!this.UserName) this.checkUserLogin(this);
      else this.removeLoginOrLogout();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title === 'Logout') {
      firebase.auth().signOut().then(function() {
        window.localStorage.setItem('UserName', null);
        window.localStorage.setItem('UserEmail', null);
      });
    }
    else {
      this.nav.setRoot(page.component);
    }
  }

  checkUserLogin(page) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        window.localStorage.setItem('UserName', user.displayName);
        window.localStorage.setItem('UserEmail', user.email);
        page.UserName = user.displayName;
        page.removeLoginOrLogout();
      }
    });
  }

  removeLoginOrLogout() {
    let loggedIn = this.UserName? 'Login' : 'Logout';
    console.log(this.pages);
    let pages = this.pages;
    pages.forEach(function ( pg, index) {
      console.log(pg);
      if (pg.title === loggedIn) {
        return pages.splice(index,1);
      }
    });
  }
}
