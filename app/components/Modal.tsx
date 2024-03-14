"use client";
import "@/styles/Modal.css";
import { useEffect, useRef } from "react";
import Loading from "./Loading";
import CloseIcon from "@/assets/icons/xmark-solid.svg";
import SuccessIcon from "@/assets/icons/circle-check-solid.svg";
import ErrorIcon from "@/assets/icons/triangle-exclamation-solid.svg";

type Params = {
    open: boolean;
    status?: ModalStatus;
    children?: React.ReactNode;
    heading?: string;
    message?: string;
    custom: boolean;
    onClose: () => void;
};

const Modal = ({ open, status, children, onClose, message, custom = false, heading }: Params) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleOutSideClick = (event: any) => {
            if (!ref.current?.contains(event.target) && open) {
                onClose();
            }
        };
        if (status !== "processing") {
            window.addEventListener("mousedown", handleOutSideClick);
        }

        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, [ref, open]);
    if (!open) return null;

    return (
        <>
            <div className="modal-overlay" />
            <div className="modal-container" ref={ref}>
                <div className="modal-heading">
                    <h6>{heading ? heading : "System Message"}</h6>
                    {status !== "processing" && (
                        <button onClick={onClose}>
                            <CloseIcon />
                        </button>
                    )}
                </div>
                <div className="modal-body">
                    {custom ? (
                        children
                    ) : status === "processing" ? (
                        <>
                            <Loading noText />
                            <div>
                                <h4>Processing...</h4>
                                <small>{message ? message : "Do not close or refresh the page"}</small>
                            </div>
                        </>
                    ) : status === "success" ? (
                        <>
                            <SuccessIcon className="icn-response icn-success" />
                            <div>
                                <h4>Success</h4>
                                <small>{message ? message : "You can close this message now"}</small>
                            </div>
                            <button className="btn-contrast btn-secondary" onClick={onClose}>
                                Close
                            </button>
                        </>
                    ) : status === "error" ? (
                        <>
                            <ErrorIcon className="icn-response icn-danger" />
                            <div>
                                <h4>Error</h4>
                                <small>{message ? message : "There was an error processing your request"}</small>
                            </div>
                            <button className="btn-contrast btn-secondary" onClick={onClose}>
                                Close
                            </button>
                        </>
                    ) : (
                        <h4>Modal Error</h4>
                    )}
                </div>
            </div>
        </>
    );
};

export default Modal;
