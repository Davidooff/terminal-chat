import './styled-form.scss'

type FormElType = "text" | "input";

interface Props {
    formEl: {type: FormElType, placeholder: string}[],
    submitBtn: {
            type: "go" | "btns", 
            btns?: {
                type: "transparent" | "background", 
                placeholder: string, 
                submit: boolean, 
                onSubmit: () => void
            }[]
        },
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}


function StyledForm(props: Props) {
    return (
        <form onSubmit={props.onSubmit} className='styled-form'>
            <div className='form-data'>
                {props.formEl.map((el, i) => el.type == "input"? <input type="text" placeholder={el.placeholder} key={i}/> : <p key={i}>{el.placeholder}</p>)}    
            </div>
            {props.submitBtn.type == "go"? <button className='go-btn'>{"GO >"}</button> : ""}
        </form>
    )
}

export default StyledForm