import "@/styles/Divider.css";

type Props = {
    text: string;
};

const Divider = ({ text }: Props) => {
    return (
        <div className="divider-container">
            <span className="divider-text">{text.toLowerCase()}</span>
        </div>
    );
};

export default Divider;
