import "./animated-logo.scss"
import { useState, useEffect } from "react"

const TimeToStart = 10000;
const TimeToPrint = 100;
const TimeToClear = 5000;
const TextToAnimate = 'TermiGram';
function AnimatedLogo() {
  const [animatedText, setAnimatedText] = useState('');
  useEffect(() => {
    if (TextToAnimate.length != animatedText.length){
        // Start animation(add simbole with diferent timeout "TimeToStart") or continue printing with "TimeToPrint"
        setTimeout(() =>
          setAnimatedText(animatedText + TextToAnimate[animatedText.length]), 
          animatedText.length == 0? TimeToStart : TimeToPrint
        )
      } else {
        setTimeout(() => setAnimatedText(""), TimeToClear)
      }

  }, [animatedText])
  return (
    <div className={animatedText.length? "logo animated": "logo"}><span>$ {" "}</span>&gt;{animatedText}_</div>
  )
}

export default AnimatedLogo