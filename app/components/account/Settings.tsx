"use client";

import Nickname from "./Nickname";
import UserAvatar from "./UserAvatar";

type Props = {
    user: User | null;
};

const Settings = ({ user }: Props) => {
    if (!user) return null;

    return (
        <div className="settings-section">
            <Nickname user={user} />
            <UserAvatar user={user} />
        </div>
    );
};

export default Settings;
