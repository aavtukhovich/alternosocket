import ReferralCode from "./ReferralCode";

type Props = {
    user: User;
    claim: () => Promise<void>;
    getBalance: () => Promise<void>;
    balance: string | null | undefined;
};
const Referrals = ({ user, claim, balance, getBalance }: Props) => {
    return (
        <div className="referral-section">
            {balance ? (
                <div className="balance">
                    <div>
                        <h3>{balance} MATIC</h3>
                        <p>referral balance</p>
                    </div>
                    <button className="btn-grad" onClick={claim}>
                        Claim
                    </button>
                </div>
            ) : (
                <div className="balance">
                    <div>
                        <h3>Unknown</h3>
                        <p>referral balance</p>
                    </div>
                    <button className="btn-grad" onClick={getBalance}>
                        Refresh
                    </button>
                </div>
            )}
            <ReferralCode id={user._id} />
        </div>
    );
};

export default Referrals;
