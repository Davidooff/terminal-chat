import { Link } from "react-router-dom"
import AnimatedLogo from "../../modules/animatedLogo/AnimatedLogo"
import './auth-header.scss'

interface Props {
    link_to: "signup" | "signin"
}

function AuthHeader(props: Props) {
  return (
    <header className="auth-header">
        <AnimatedLogo />
        <Link to={"/" + props.link_to}>{props.link_to == "signup"? "Don't have an account?": "Already have an account?"}</Link>
    </header>
  )
}
export default AuthHeader