import {Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {_throw} from "rxjs/observable/throw";
import {catchError} from "rxjs/operators";
import { Content } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild(Content) content: any;

  userName: string;
  showLogin: Boolean;
  showWelcome: Boolean;
  logging : Boolean;
  userText: string;
  list: any = [];
  url: string = "https://us-central1-jacky-bfdd4.cloudfunctions.net/helloWorld";
  // url: string = "http://httpbin.org/post";
  sessionid: string;
  uid: any;
  selectionExist: boolean;
  saveData: any;
  CC : any = [];

  httpOptions : any ={
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private http: HttpClient) {
    this.logging = true;
    this.checkLoggedIn();
    this.sessionid = this.guid();
  }

  scrollToTop() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    });
  }

  checkLoggedIn() {
    let loading = this.loadingCtrl.create({});
    let homepage = this;

    loading.present();
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        homepage.log('User detail: ', user);
        homepage.userName = user.displayName;
        homepage.uid = user.uid;
        homepage.showWelcome = true;
        homepage.addMessage("Hi, " + user.displayName + "!","bubble");
        homepage.addselection();
        console.log("list", homepage.list);
        console.log("uid", homepage.uid);
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
    console.log("Google Login");
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().signInWithRedirect(provider);
  }

  sendMsg(type): void {
    console.log("data", this.saveData);
    if (this.saveData) {
      switch (this.saveData) {
        case "CC":
          this.CC.push(this.userText);
          this.addMessage(this.userText, "bubble-user");
          if (this.CC.length > 1) {
            firebase.database().ref("users/" + this.uid + "/CC").set({
              no : this.CC[0],
              cvv: this.CC[1]
            });
            this.saveData = null;
          }
          else {
            this.addCC();
          }
          return;
      }
    }
    if (type) {
      this.userText = type.name;
    }
    this.removeSelection();
    this.addMessage(this.userText, "bubble-user");
    this.getIntent(this.userText);
  }

  addMessage(msg, cls , load?) {
    this.list.push(
      {
        class: cls,
        content: msg,
        showLoad: load
      }
    );
    console.log(this.list);
    this.scrollToTop();
  }

  log(...content): void {
    if (this.logging) {
        console.log(content[0], content[1]? content[1] : ''  , content[2]? content[2] : '');
    }
  }

  getIntent(text) {
    this.userText = "";
    if (text === "Anisah" || text === "Yuroshyni") {
      text = "counselorChoosed";
    }
    this.addMessage("","bubble",true);
    return this.http.post(this.url, {sessionid: this.sessionid, text: text},this.httpOptions)
      .pipe(catchError(this.handleError))
      .subscribe(data => {
        console.log(data);
        console.log("intent: " + data.intent.displayName);
        this.list.pop();
        this.addMessage(data.fulfillmentMessages[0].text.text[0], "bubble");
        switch (data.intent.displayName) {
          case 'searchCourse':
            this.searchCourse();
            break;
          case "learnInterest":
            break;
          case "getCounselor":
            this.getCounselor();
            break;
          default:
        }
      });
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  getCounselor() {
    let db = firebase.database();
    let user = db.ref('users/' + this.uid + "/CC");
    let hp = this;
    // @ts-ignore
    console.log("uid: " + this.uid);
    this.addMessage("","bubble",true);
    user.once('value', function (snap) {
      let profile = snap.val();
      console.log("profile:" + profile);
      if (profile === null) {
        console.log("No payment method");
        hp.list.pop();
        hp.addMessage("Your account has no payment method yet. You need to setup payment profile first only allow to use this features.", "cls");
        hp.addMessage("Please enter your credit card number.", "cls");
        hp.saveData = "CC";
      }
      else {
        db.ref('counselor').once('value').then((snap) => {
          let ctn = [];
          let couns = snap.val();
          hp.list.pop();
          hp.addMessage("Please select a psychiatrist below.", "cls");
          Object.keys(snap.val()).forEach((counselorId)=>{
            console.log(couns);
            ctn.push({
              name: couns[counselorId].name,
              func: "counselorChoosed"
            });
          });
          console.log(ctn);
          hp.selectionExist = true;
          hp.addMessage(ctn,"selection");
        });

      }
      console.log(snap.val());
    });
  }

  addCC() {
    this.addMessage("Please enter your CVV.", "cls");
  }

  removeSelection() {
    this.list.forEach((li, index)=> {
      console.log(li);
      if (li.class === "selection") {
        this.list.splice(index,1);
      }
    });
  }

  addselection() {
    let ctn = [
      {
        name: "Search for Courses",
        func: "searchCourse"
      },
      {
        name: "Learn own interest",
        func: "learnInterest"
      }
      , {
        name: "Book a counselor",
        func: "bookCounselor"
      }
    ];
    this.selectionExist = true;
    this.addMessage(ctn,"selection");
  }

  searchCourse() {
    let ctn = [
      {
        name: "Based on traits",
        func: "traitsTest"
      },
      {
        name: "Based on interest",
        func: "interestSearch"
      }
    ];
    this.selectionExist = true;
    this.addMessage(ctn,"selection");
    console.log("bye");
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error}`);
    }
    // return an observable with a user-facing error message
    return _throw(
      'Something bad happened; please try again later.');
  };

}
