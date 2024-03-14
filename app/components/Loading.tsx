import "@/styles/Loading.css";
type Props = {
    noText?: boolean;
};
const Loading = ({ noText }: Props) => {
    return (
        <div className="loading-container">
            <div className="lds-grid">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            {!noText && <h4>Loading...</h4>}
        </div>
    );
};

export default Loading;
