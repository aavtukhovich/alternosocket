"use client";
import Avatar from "boring-avatars";
import Image from "next/image";

type Props = {
    creator?: ApiUser;
    link?: string;
    name?: string;
};

const Avatars = ({ creator, link, name }: Props) => {
    const avatar = link ? link : creator?.avatar ? creator.avatar : null;
    let result;
    avatar
        ? (result = <Image src={avatar} alt={avatar} width={40} height={40} />)
        : (result = <Avatar size={40} name={creator?.wallet || name} variant="beam" />);

    return result;
};

export default Avatars;
