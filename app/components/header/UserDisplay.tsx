import Image from "next/image";
import Avatar from "boring-avatars";
import { formatWallet } from "@/lib/formatting";
type Props = {
    user: User;
    customClickEvent?: any;
};

const UserDisplay = ({ user, customClickEvent }: Props) => {
    return (
        <button className="user-display-btn" onClick={customClickEvent ? customClickEvent : null}>
            {user.avatar ? <Image src={user.avatar} alt="Avatar" width={40} height={40} /> : <Avatar size={40} name={user.wallet} variant="beam" />}
            <span>{user.nickname ?? formatWallet(user.wallet)}</span>
        </button>
    );
};

export default UserDisplay;
