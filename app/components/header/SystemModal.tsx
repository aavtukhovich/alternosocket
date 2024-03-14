"use client";
import { useContext } from "react";
import SystemContext from "@/app/context/SystemContext";
import Modal from "../Modal";

const SystemModal = () => {
    const { showModal, status, modalHeading, modalMessage, closeModal } = useContext(SystemContext);
    return <Modal open={showModal} onClose={closeModal} heading={modalHeading} message={modalMessage} status={status} custom={false} />;
};

export default SystemModal;
