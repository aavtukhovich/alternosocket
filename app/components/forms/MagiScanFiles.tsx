import { useContext, useEffect, useState } from "react";
import type { MouseEvent } from "react";

import SystemContext from "@/app/context/SystemContext";
import { getMagiscanModelsList, getMagiscanQRCode, getMagiscanUserStatus } from "@/lib/magiscan";
import Loading from "../Loading";
import MagiScanModels from "./MagiScanModels";

type Props = {
    handleModelSelect(event: MouseEvent<HTMLButtonElement>, url: string): Promise<void>;
};

const MagiScanFiles = ({ handleModelSelect }: Props) => {
    const { showErrorMessage, startProcessing, showSuccessMessage } = useContext(SystemContext);
    const [connected, setConnected] = useState<undefined | null | boolean>(undefined);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [qrCode, setQrCode] = useState<any>(undefined);
    const [deepLink, setDeepLink] = useState<undefined | string>(undefined);
    const [models, setModels] = useState<undefined | null | MagiscanModel[]>(undefined);
    useEffect(() => {
        handleInitialSetup();
        checkMobile();
        return () => {
            setConnected(undefined);
        };
    }, []);

    async function handleInitialSetup() {
        try {
            const status = await getMagiscanUserStatus();
            if (status) {
                const result = await getMagiscanModelsList();
                setModels(result.models);
                setTotalPages(result.totalPages);
            }
            setConnected(status);
        } catch (err: any) {
            showErrorMessage(err.message);
        }
    }

    function checkMobile() {
        //@ts-ignore
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent)) {
            setIsMobile(true);
        }

        //@ts-ignore
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            setIsMobile(true);
        }
    }

    async function handleConnect(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try {
            setIsConnecting(true);
            const qrResult = await getMagiscanQRCode();
            console.log(qrResult);
            setQrCode(qrResult.qr);
            setDeepLink(qrResult.uri);
        } catch (err: any) {
            console.log(err);
            setQrCode(null);
            showErrorMessage(err.message);
        }
    }

    async function handleConfirm(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try {
            const result = await getMagiscanUserStatus();
            console.log(result);
            if (result) {
                const result = await getMagiscanModelsList();
                setModels(result.models);
                setTotalPages(result.totalPages);
                setIsConnecting(false);
            }
            setConnected(result);
        } catch (err: any) {
            console.log(err);
            setConnected(false);
            showErrorMessage(err.message);
        }
    }

    async function handlePageChange(event: MouseEvent<HTMLButtonElement>, page: number) {
        event.preventDefault();
        try {
            const modelsInfo = await getMagiscanModelsList(page);
            setCurrentPage(page);
            setModels(modelsInfo.models);
            setTotalPages(modelsInfo.totalPages);
        } catch (err: any) {
            console.log(err);
            setModels(null);
            showErrorMessage(err.message);
        }
    }

    return (
        <div>
            {connected ? (
                <MagiScanModels
                    models={models}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handleConnect={handleConnect}
                    handlePageChange={handlePageChange}
                    handleModelSelect={handleModelSelect}
                />
            ) : isConnecting ? (
                qrCode === undefined ? (
                    <Loading />
                ) : qrCode === null ? (
                    <div className="connection-container">
                        <h5>Error connecting to Magiscan</h5>
                        <button className="btn-grad btn-square" onClick={handleConnect}>
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="connection-container">
                        {isMobile ? (
                            <>
                                <p>Step 1. Open MagiScan app and approve the connection.</p>
                                <a className="btn-contrast btn-square" href={deepLink} target="_blank" rel="noreferrer">
                                    Open MagiScan App
                                </a>
                            </>
                        ) : (
                            <>
                                <p>Step 1. Scan the QR code and approve the connection in MagiScan app</p>
                                <div className="qr" dangerouslySetInnerHTML={{ __html: qrCode }} />
                            </>
                        )}
                        <p>Step 2. Confirm the connection</p>
                        <button className="btn-grad btn-square" onClick={handleConfirm}>
                            Confirm connection
                        </button>
                    </div>
                )
            ) : (
                <button className="btn-grad btn-square" onClick={handleConnect}>
                    Connect to MagiScan
                </button>
            )}
        </div>
    );
};

export default MagiScanFiles;
