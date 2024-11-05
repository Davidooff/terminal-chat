import {useParams } from "react-router-dom"
import StyledForm from "../../modules/styledForm/StyledForm"
import './auth.scss'
import AuthHeader from "../../sections/authHeader/AuthHeader"

function Auth() {
  const { authType } = useParams();
  console.log(authType);
  
    function submitFun(event: React.FormEvent<HTMLFormElement>): void {  
      event.preventDefault();
      console.log(1);
      
      }
  return (
    <>
      {
        authType === 'signin' || authType === "signup"? 
        <>
          <AuthHeader link_to={authType} />
          <div className="auth-content-wrapper">
            <div className="auth-type">
              <UserSvg />
              <h1>{authType === "signin"? "Sign In": "Sign Up"}</h1>
            </div>
            {
              authType === "signin"?
                <StyledForm formEl={[{type: "input", placeholder: "Username"}, {type: "input", placeholder: "Password"}]} submitBtn={{type: "go"}} onSubmit={submitFun} />
                : <StyledForm formEl={[{type: "input", placeholder: "Username"}, {type: "input", placeholder: "Password"}, {type: "input", placeholder: "Confirm password"}]} submitBtn={{type: "go"}} onSubmit={submitFun} />
            }
          </div>
        </> : <h1>Wrong url</h1>
      }
    </>
  )
}

function UserSvg() {
  return (
    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.5 23.625V21.375C22.5 20.1815 22.0259 19.0369 21.182 18.193C20.3381 17.3491 19.1935 16.875 18 16.875H9C7.80653 16.875 6.66193 17.3491 5.81802 18.193C4.97411 19.0369 4.5 20.1815 4.5 21.375V23.625M18 7.875C18 10.3603 15.9853 12.375 13.5 12.375C11.0147 12.375 9 10.3603 9 7.875C9 5.38972 11.0147 3.375 13.5 3.375C15.9853 3.375 18 5.38972 18 7.875Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
export default Auth