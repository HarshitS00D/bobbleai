import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { Button, Divider, Form, Message, Image } from "semantic-ui-react";
import { GrFacebook } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import Logo from "./logo";
import "../styles/style.scss";
import "semantic-ui-css/semantic.min.css";

class App extends Component {
  state = {
    loggedThroughGoogle: undefined,
    loggedThroughFacebook: undefined,
    isLogged: false,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    imageUrl: "",
    error_firstName: undefined,
    error_lastName: undefined,
    error_email: undefined,
    error_password: undefined,
    isLoading: false,
  };

  onInputChange = (e, { name, value }) => {
    this.setState({ [name]: value.trim(), ["error_" + name]: undefined });
  };

  logoutGoogle = () => {
    this.setState({ isLogged: false, loggedThroughGoogle: false });
  };

  logoutFacebook = () => {
    this.setState({ isLogged: false, loggedThroughFacebook: false });
  };

  responseGoogle = (response) => {
    if (response.profileObj) {
      this.setState({
        email: response.profileObj.email,
        firstName: response.profileObj.givenName,
        lastName: response.profileObj.familyName,
        imageUrl: response.profileObj.imageUrl,
        loggedThroughGoogle: true,
        isLogged: true,
      });
    } else {
      console.log("Error");
    }
  };

  responseFacebook = (response) => {
    if (response.accessToken) {
      this.setState({
        email: response.email,
        firstName: response.name,
        imageUrl: response.picture.data.url,
        loggedThroughFacebook: true,
        isLogged: true,
      });
    }
    console.log(response);
  };

  onSubmit = async () => {
    if (this.validate()) {
      this.setState({ isLoading: true });
      let result = await axios
        .post("https://reqres.in/api/register/", {
          email: this.state.email,
          password: this.state.password,
        })
        .catch(function (error) {
          console.log(error);
        });
      if (result) {
        this.setState({ isLogged: true });
        console.log("success");
      } else {
        console.log("no success");
        this.setState({
          error_password:
            "ERROR, Note: Only defined users succeed registration in https://Reqres.in (Use Email of Already Registerd User on Reqres.in)",
        });
      }
    } else console.log("validation error");
  };

  validate = () => {
    let errorCount = 0;

    if (!this.emailValidator(this.state.email)) {
      this.setState({ error_email: "Please enter a valid Email address" });
      errorCount++;
    }
    if (!this.passwordValidator(this.state.password)) {
      this.setState({
        error_password: "Invalid Password Format ( only '.' , '@' , '_' , a-z, A-Z , 0-9 are allowed. Min Length = 8 )",
      });
      errorCount++;
    }
    if (!this.firstNameValidator(this.state.firstName)) {
      this.setState({
        error_firstName: "Please enter a valid First Name",
      });
      errorCount++;
    }
    if (!this.lastNameValidator(this.state.lastName)) {
      this.setState({ error_lastName: "Please enter a valid Last Name" });
      errorCount++;
    }

    if (errorCount) return false;
    else return true;
  };

  firstNameValidator = (firstName) => {
    const pattern = /[a-zA-Z]/;
    if (firstName === "" || !pattern.test(firstName)) return false;
    return true;
  };

  lastNameValidator = (lastName) => {
    const pattern = /[a-zA-Z]/;
    if (lastName === "" || !pattern.test(lastName)) return false;
    return true;
  };

  emailValidator = (email) => {
    const pattern = /[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9._-]{3,}[.]{1}[a-zA-Z0-9._-]{2,}/;
    if (email === "" || !pattern.test(email)) return false;
    return true;
  };

  passwordValidator = (password) => {
    if (password === "" || !/[a-zA-Z0-9._@]{8,}/.test(password)) return false;
    return true;
  };

  render() {
    if (this.state.isLogged)
      return (
        <div>
          <div className="header">
            <Logo className="logo" />
          </div>
          <div className="container">
            <center>
              <Image src={this.state.imageUrl} circular />
              <br />
              <b>NAME </b>
              {this.state.firstName} {this.state.lastName} <br />
              <b>EMAIL </b>
              {this.state.email}
              <br />
              {this.state.loggedThroughGoogle ? (
                <GoogleLogout
                  className="GoogleLogout"
                  clientId="972229167187-hngo8qkc0vdfviscjvf4e2t10cp3rnno.apps.googleusercontent.com"
                  buttonText="Logout"
                  onLogoutSuccess={this.logoutGoogle}
                ></GoogleLogout>
              ) : (
                <Button primary onClick={this.logoutFacebook}>
                  Logout
                </Button>
              )}
            </center>
          </div>
        </div>
      );
    else
      return (
        <div>
          <div className="header">
            <Logo className="logo" />
          </div>
          <div className="container">
            <center>
              <div className="title">SIGN UP</div>
              <div className="subtitle">Create your account</div>
              <Form error>
                <p>create your account Dolor enim veniam occaecat pariatur cillum aliqua etc.</p>
                <GoogleLogin
                  render={(renderProps) => (
                    <button className="GoogleLoginBtn" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                      <FcGoogle className="icon" size="2em" />
                      <span>Sign up with Google</span>
                    </button>
                  )}
                  clientId="972229167187-hngo8qkc0vdfviscjvf4e2t10cp3rnno.apps.googleusercontent.com"
                  buttonText="Login with google"
                  onSuccess={this.responseGoogle}
                  onFailure={this.responseGoogle}
                  cookiePolicy={"single_host_origin"}
                />

                <FacebookLogin
                  render={(renderProps) => (
                    <button className="FacebookLoginBtn" onClick={renderProps.onClick}>
                      <GrFacebook className="icon" size="2em" />
                      <span>Sign up with Facebook</span>
                    </button>
                  )}
                  appId="739413339955843"
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={this.responseFacebook}
                />
                <Divider horizontal>or</Divider>

                <Form.Input
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.onInputChange}
                  placeholder="First Name"
                />
                <Message error content={this.state.error_firstName} />
                <Form.Input
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.onInputChange}
                  placeholder="Last Name"
                />
                <Message error content={this.state.error_lastName} />
                <Form.Input name="email" value={this.state.email} onChange={this.onInputChange} placeholder="Email" />
                <Message error content={this.state.error_email} />
                <Form.Input
                  name="password"
                  value={this.state.password}
                  onChange={this.onInputChange}
                  placeholder="Password"
                />
                <Message error content={this.state.error_password} />
                <p>
                  By clicking SignUp, you agree to our <a> Terms of Use </a> & our <a>Privacy Policy</a>.
                </p>
                <button className="SubmitBtn" onClick={this.onSubmit}>
                  SIGN UP
                </button>
              </Form>
            </center>
          </div>
        </div>
      );
  }
}

export default App;
