import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import App from '../../App'
import { GoogleLogin } from 'react-google-login'
import { gapi } from 'gapi-script';
import cookieManager from '../../managers/cookieManager';
import axios from 'axios';
const API_BASE_URL = 'http://localhost:3005'
const CLIENT_ID = "446889739544-v36sjm88rcn6hrho3ul8gf689utha2v1.apps.googleusercontent.com"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #0a0e11;
  height: 100vh;
`

const Header = styled.div`
  color: white;
  width: 100%;
  font-weight: bold;
  background-color: #56bca6;
  padding: 50px 50px 140px;
  font-size: 14px;
`
const CardView = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 30px 50px;
  margin-left: auto;
  margin-right: auto;
  margin-top: -80px;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  gap: 40px;
  flex-wrap: wrap;
`

const Instructions = styled.div`
  padding: 20px;
  display: flex;
  font-size: 16px;
  ol {
    margin: 40px 0;
  }
  li {
    margin: 15px 0;
  }
`

const Heading = styled.span`
  font-size: 24px;
  color: #525252;
`;

const QRCode = styled.img`
  width: 264px;
  height: 264px;
  background-color: white;
`

const LoginComponent = () => {
    const [userInfo, setUserInfo] = useState()

    useEffect(() => {
      const userData = cookieManager.getUserInfo()
      
      console.log(userData, 'úser data')
      if(userData) setUserInfo(userData)
    },[])

    const responseGoogle = async(responseData) => {
        setUserInfo(responseData.profileObj)
        cookieManager.setUserInfo(responseData.profileObj)
        await axios.post(`${API_BASE_URL}/user`, {
          email: responseData.profileObj.email,
          name: responseData.profileObj.name,
          profilePic: responseData.profileObj.email
        })
        
    }
    useEffect(() => {
      function start() {
        gapi.client.init({
          clientId: CLIENT_ID,
          scope: 'email',
        });
      }
  
      gapi.load('client:auth2', start);
    }, []);
    console.log('user info', userInfo)
    return (<>
    {
        userInfo ? <App userInfo={userInfo}/> :
       
        <Container>
            <Header>
                WHATSAPP WEB CLONE  
            </Header>
            <CardView>
            <Heading>To use WhatsApp on your computer:</Heading>
                <Instructions>
                    <ol>
                        <li>You need to Signin using your Google Account</li>
                        <li>You can anytime logout from the Web.</li>
                        <li>Click on Signin button to continue using the Whatsapp Clone.</li>
                    </ol>
                <QRCode src="https://preview.redd.it/3ipyc7vvofh61.png?width=392&format=png&auto=webp&s=5cd31d0bebfc7d899e80d074ac1f1900b3ccccef"/>
                   
                </Instructions>
                <GoogleLogin
                    clientId={CLIENT_ID}
                    buttonText="Login with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    />
            </CardView>
        </Container>
}</>)
}

export default LoginComponent