import "@/styles/Toggle.css";

type Props = {
    id: string;
    labelText: string;
    defaultChecked?: boolean;
    disabled?: boolean;
};

const Toggle = ({ id, labelText, defaultChecked, disabled }: Props) => {
    return (
        <div className="toggle-container">
            <input type="checkbox" className="ios8-switch" name={id} id={id} defaultChecked={defaultChecked} disabled={disabled}></input>
            <label htmlFor={id}>{labelText}</label>
        </div>
    );
};

export default Toggle;
