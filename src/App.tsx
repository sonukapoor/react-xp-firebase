/*
* This file demonstrates a basic ReactXP app.
*/

import RX = require('reactxp');
import * as firebase from 'firebase';
import * as Rx from 'rxjs';

const API_KEY = '';
const AUTH_DOMAIN = '';
const DATABASE_URL = '';
const PROJECT_ID = '';
const STORAGE_BUCKET = '';
const MESSAGING_SENDER_ID = '';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const timeClickedRef = firebase.database().ref('time-clicked');

const styles = {
  container: RX.Styles.createViewStyle({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }),
  helloWorld: RX.Styles.createTextStyle({
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 28
  }),
  welcome: RX.Styles.createTextStyle({
    fontSize: 20,
    marginBottom: 12
  }),
  instructions: RX.Styles.createTextStyle({
    fontSize: 16,
    color: '#aaa',
    marginBottom: 40
  }),
  docLink: RX.Styles.createLinkStyle({
    fontSize: 16,
    color: 'blue'
  }),
  roundButton: RX.Styles.createViewStyle({
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#7d88a9'
  }),
  buttonText: RX.Styles.createTextStyle({
    fontSize: 16,
    marginVertical: 6,
    marginHorizontal: 12,
    color: 'white'
  })
};

class App extends RX.Component<null, null> {
  private _translationValue: RX.Animated.Value;
  private _animatedStyle: RX.Types.AnimatedTextStyleRuleSet;
  state: any;

  constructor() {
    super();

    this._translationValue = new RX.Animated.Value(-100);
    this._animatedStyle = RX.Styles.createAnimatedTextStyle({
      transform: [
        {
          translateY: this._translationValue
        }
      ]
    });
    this.state = {
      'timeClicked': '',
      'currentPlatform': RX.Platform.getType(),
      'updatingPlatform': ''
    }
  }

  componentDidMount() {
    let animation = RX.Animated.timing(this._translationValue, {
      toValue: 0,
      easing: RX.Animated.Easing.OutBack(),
      duration: 500
    }
    );

    Rx.Observable.fromEvent(timeClickedRef, 'value')
      .subscribe((snapshot: firebase.database.DataSnapshot) => {
        this.setState(snapshot.val());
      });

    animation.start();
  }

  render(): JSX.Element | null {
    return (
      <RX.View style={styles.container}>
        <RX.Animated.Text style={[styles.helloWorld, this._animatedStyle]}>
          Hello World 123 ({ this.state.currentPlatform })
        </RX.Animated.Text>
        <RX.Text style={styles.welcome}>
          Here's a timestamp set by { this.state.updatingPlatform }
        </RX.Text>
        <RX.Text style={styles.welcome}>
          {this.state.timeClicked}
        </RX.Text>

        <RX.Button style={styles.roundButton} onPress={this._setTimeClicked}>
          <RX.Text style={styles.buttonText}>
            Click me please!
          </RX.Text>
        </RX.Button>
      </RX.View>
    );
  }

  _setTimeClicked = () => {
    timeClickedRef.set({
      timeClicked: Date.now().toString(),
      updatingPlatform: RX.Platform.getType()
    });
  }
}

export = App;
