import StyledForm from "../../modules/styledForm/StyledForm"
import './sign-in.scss'

function SignIn() {
    function submitFun(): void {    }
  return (
    <StyledForm formEl={[{type: "text", placeholder: "Username"}, {type: "input", placeholder: "Password"}]} submitBtn={{type: "go"}} onSubmit={submitFun} />
  )
}

export default SignIn