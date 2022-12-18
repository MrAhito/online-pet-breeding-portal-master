import React, { Component } from 'react'
import firebase, { auth } from "../config/firebase";
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showp: true,
      user: '',
      pass: '',
      error: '',
      btn_en: false,
    }
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }
  showPas(a) {
    this.setState({
      showp: a,
    })
  }

  async userWall(a, id) {
    console.log("loasda")
    const data = await firebase.doc(`users/${id}`).get();
    if (data.exists) {
      if (data.data().type === 'pet-breeder' || data.data().type === 'pet-owner' || data.data().type === 'veterinarian') {
        firebase.doc(`users/${id}`).set({
          isOnline: new Date(),
        }, { merge: true }).then(() => {
          window.location.href = '/dashboard';
        })
      } else if (data.data().type === 'admin') {
        window.location.href = '/admin';
      } else {
        this.setState({ error: 'Account not found' });
        auth.signOut().catch((error) => {
          return;
        });
      }
    }
  }

  async onSubmit() {
    this.setState({ btn_en: true });
    if (this.state.pass && this.state.user) {
      const ref = await firebase.collection('users').where("email", "==", this.state.user).limit(1).get();
      if (ref.empty) { this.setState({ error: 'Account not found', btn_en: false }); return }
      if (!(ref.docs[0].data().confirmed)) {
        this.setState({ error: 'Account not verified, wait for admin validation', btn_en: false });
        return;
      }
      else if ((ref.docs[0].data().banned)) {
        this.setState({ error: 'Account has been banned, please contact your administrator', btn_en: false });
        return;
      } else {
        auth.signInWithEmailAndPassword(this.state.user, this.state.pass)
          .then((userCredential) => {
            this.setState({ error: '' });
            this.userWall(false, userCredential.user.uid);
          })
          .catch((error) => {
            if (error.code === 'auth/user-not-found') {
              this.setState({ error: 'Account not found', btn_en: false });
              return;
            }
            else if (error.code === 'auth/wrong-password') {
              this.setState({ error: 'Incorrect Password', btn_en: false });
              return;
            }
            else if (error.code === 'auth/too-many-requests') {
              this.setState({ error: 'Too many request, please wait for a moment', btn_en: false });
              return;
            } else {
              this.setState({ error: error.code, btn_en: false });
              return;
            }
          });
      }
    } else {
      this.setState({ error: 'Please fill all required fields', btn_en: false });
      return;
    }
  }
  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.onSubmit();
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.userWall(true, user.uid);
      }
    })
  }

  render() {
    return (
      <div className='log-wrapper'>
        <div className='log-in'>
          <center> <h1 className='til'>LOGIN</h1></center>
          <form onKeyDown={this._handleKeyDown}>

            <div className='errorLoginMessage' style={{ display: this.state.error === '' ? 'none' : 'flex' }}>{this.state.error}</div>

            <div className="field">
              <input type="text" name="fullname" id="fullname" autoComplete="username" className='login' placeholder=" " value={this.state.user} onChange={(e) => { this.setState({ user: e.target.value }) }} />
              <label className='label-log' htmlFor="fullname">Email/Username</label>
            </div>
            <div className="field">
              <input type={this.state.showp ? "password" : "text"} autoComplete="current-password" name="password" id="password" className='login' placeholder=" " value={this.state.pass} onChange={(e) => { this.setState({ pass: e.target.value }) }} />
              <label className='label-log' htmlFor="password">Password</label>
            </div>

            <div className='wraper'>
              <label htmlFor='showPass' className='labp'>
                <input type='checkbox' onChange={(e) => { this.showPas(!this.state.showp) }} id='showPass' className='shp' />
                Show Password</label>
              <a href='/' className='ffp'>Forgot Password?</a>
            </div>
            <center>
              <button disabled={this.state.btn_en ? true : false} type='button' onClick={() => { this.onSubmit() }} className={this.state.btn_en ? 'btn-log btn_disabled' : 'btn-log '} id='btnLog'>Log In</button>
            </center>
            <div className='reg'>
              No account yet?<a className='reg-link' href='/register'> Create one here... {this.state.showp}</a>
            </div>
            <div className='guestLogin'>
              Login as<a className='reg-link' href='/dashboard'> Guest {this.state.showp}</a>
            </div>
          </form>
        </div>

      </div>

    )
  }
}

export default Login
