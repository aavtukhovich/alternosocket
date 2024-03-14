import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import SystemContext from "@/app/context/SystemContext";
import Modal from "../Modal";
import Loading from "../Loading";
import Image from "next/image";
import IconButton from "../IconButton";
import DownloadIcon from "@/assets/icons/download-solid.svg";
import ExploreIcon from "@/assets/icons/magnifying-glass-arrow-right-solid.svg";

import { ACCOUNT_NO_MODELS } from "@/data/Texts";

type Props = {
    nfts: NFT[] | undefined | null;
};

const OwnedDisplay = ({ nfts }: Props) => {
    const router = useRouter();
    const { handleDownload, handleDownloadLegacy, getOwnedItems } = useContext(SystemContext);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [selectedNft, setSelectedNft] = useState<null | string>(null);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [showError, setShowError] = useState(false);

    function handleOpen(nftId: string) {
        console.log(nftId);
        setSelectedNft(nftId);
        setShowDownloadModal(true);
    }

    function handleClose() {
        setShowDownloadModal(false);
        setSelectedNft(null);
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputEmail = event.target.value;
        setEmail(inputEmail);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(inputEmail);
        setValidEmail(isValidEmail);
    };

    async function handleSubmitDownloadRequest(event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        setShowError(true);

        if (validEmail && selectedNft) {
            setShowDownloadModal(false);
            await handleDownloadLegacy(selectedNft, email);
        }
    }

    if (nfts === undefined)
        return (
            <div className="profile-message">
                <Loading />
            </div>
        );
    else if (nfts === null)
        return (
            <div className="profile-message">
                <h3>Error during data retrieval</h3>
                <button onClick={getOwnedItems} className="btn-grad btn-square">
                    Retry
                </button>
            </div>
        );
    else if (nfts.length === 0)
        return (
            <div className="profile-message">
                <h5 className="text-center">{ACCOUNT_NO_MODELS}</h5>
                <IconButton
                    icon={<ExploreIcon />}
                    customClickEvent={() => router.push("/collections/all")}
                    addClass="btn-grad"
                    text="Explore Our Selection"
                />
            </div>
        );
    return (
        <>
            <div className="account-display">
                {nfts.map((nft) => (
                    <div className="card-container" key={nft.tokenId}>
                        <div className="image-container">
                            <Image src={nft.thumbnail} alt={nft.title} width={512} height={200} />
                        </div>
                        <h5>{nft.title}</h5>
                        <div className="info-container">
                            <IconButton
                                text={nft.skCreator ? "Request Download" : "Download"}
                                customClickEvent={nft.skCreator ? () => handleOpen(nft._id) : () => handleDownload(nft._id)}
                                icon={<DownloadIcon />}
                                addClass="btn-grad"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <Modal open={showDownloadModal} onClose={handleClose} heading="Download Request" custom>
                <form onSubmit={handleSubmitDownloadRequest}>
                    <label htmlFor="email-input">Please input your email address to which we will send the model</label>
                    <input
                        type="email"
                        name="email-input"
                        placeholder="Enter email"
                        value={email}
                        required
                        className="email-input"
                        onChange={handleEmailChange}
                    />
                    {!validEmail && showError && <small style={{ color: "red" }}>Invalid email address</small>}
                    <p className="text-muted">We'll never share your email with anyone else.</p>
                </form>
                <div className="button-group">
                    <button className="btn-contrast" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="btn-grad" type="submit" onClick={handleSubmitDownloadRequest}>
                        Submit
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default OwnedDisplay;
