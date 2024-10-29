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
    onSubmit: () => void
}


function StyledForm(props: Props) {
    return (
        <form onSubmit={props.onSubmit} className='styled-form'>
            {props.formEl.map(el => el.type == "input"? <input type="text" placeholder={el.placeholder} /> : <p>{el.placeholder}</p>)}
        </form>
    )
}

export default StyledForm