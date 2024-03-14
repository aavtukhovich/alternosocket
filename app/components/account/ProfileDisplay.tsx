import Image from "next/image";
import Avatar from "boring-avatars";
import { formatWallet } from "@/lib/formatting";
import IconButton from "../IconButton";
import ExitIcon from "@/assets/icons/right-from-bracket-solid.svg";

type Props = {
    user: User;
    logout: () => void;
};

const ProfileDisplay = ({ user, logout }: Props) => {
    return (
        <div className="profile-display">
            <div className="overlay"></div>
            {user.avatar ? (
                <Image src={user.avatar} width={200} height={200} alt="Avatar" />
            ) : (
                <Avatar size={200} name={user.wallet} variant="beam" />
            )}
            <div className="nickname-display">
                <h2>{user.nickname ? user.nickname : "Unnamed"}</h2>
                <h6>{formatWallet(user.wallet)}</h6>
            </div>
            <IconButton addClass="btn-contrast btn-sm logout-btn" customClickEvent={logout} text="Log Out" icon={<ExitIcon />} />
        </div>
    );
};

export default ProfileDisplay;
