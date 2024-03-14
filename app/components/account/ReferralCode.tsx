import { DOMAIN } from "@/app/context/constants";
import { MouseEvent } from "react";

type Props = {
    id: string;
};
const ReferralCode = ({ id }: Props) => {
    const value = `${DOMAIN}?ref=${id}`;
    function handleCopy(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        console.log("cope");
        navigator.clipboard.writeText(value);
        if (event.target instanceof Element) {
            event.target.textContent = "Copied!";
            setTimeout(() => {
                (event.target as Element).textContent = "Copy";
            }, 1000);
        }
    }

    return (
        <div className="referral">
            <h5>Instructions</h5>
            <ol>
                <li>Send your referral code to a friend</li>
                <li>They connect wallet for the first time</li>
                <li>You will get percentage from each of their purchase on Alterno</li>
            </ol>
            <input type="text" value={value} readOnly />
            <button className="btn-grad btn-sm" onClick={handleCopy}>
                Copy Link
            </button>
        </div>
    );
};

export default ReferralCode;
