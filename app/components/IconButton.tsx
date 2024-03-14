type Props = {
    addClass?: string;
    icon?: any;
    text?: string;
    customClickEvent?: any;
    disabled?: boolean;
};

const IconButton = ({ addClass, icon, text, customClickEvent, disabled }: Props) => {
    let classname = "icon-btn";
    if (addClass) classname += " " + addClass;
    if (disabled) classname += " " + "btn-disabled";
    return (
        <button className={classname} onClick={customClickEvent ? customClickEvent : null} disabled={disabled}>
            {icon ? icon : null}
            {text ? <span>{text}</span> : null}
        </button>
    );
};

export default IconButton;
