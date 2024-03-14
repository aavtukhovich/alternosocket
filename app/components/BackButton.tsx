type Props = {
    path: string;
};
import Link from "next/link";

const BackButton = ({ path }: Props) => {
    return (
        <Link href={path} className="back-btn">
            BackButton
        </Link>
    );
};

export default BackButton;
