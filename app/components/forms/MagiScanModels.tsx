import type { MouseEvent } from "react";
import Loading from "../Loading";
import Image from "next/image";
import Pagination from "./Pagination";

type Props = {
    models: undefined | null | MagiscanModel[];
    currentPage: number;
    totalPages: number;
    handleConnect(event: MouseEvent<HTMLButtonElement>): Promise<void>;
    handlePageChange(event: MouseEvent<HTMLButtonElement>, page: number): Promise<void>;
    handleModelSelect(event: MouseEvent<HTMLButtonElement>, url: string): Promise<void>;
};

const MagiScanModels = ({ models, currentPage, totalPages, handleConnect, handlePageChange, handleModelSelect }: Props) => {
    if (models === undefined) return <Loading />;
    if (models === null)
        return (
            <div className="connection-container">
                <h5>Error connecting to Magiscan</h5>
                <button className="btn-grad btn-square" onClick={handleConnect}>
                    Retry
                </button>
            </div>
        );
    if (models.length === 0)
        return (
            <div className="magiscan-model-container">
                <h5>No Models found in MagiScan App</h5>
                <p>Please scan your first object</p>
            </div>
        );
    return (
        <div className="magiscan-model-container">
            <div className="magiscan-model-display">
                {models.map((model) => {
                    return (
                        <div key={model.id} className="magiscan-model">
                            <Image src={model.thumb_uri} alt={model.name} width={100} height={100} />
                            <h5>{model.name}</h5>
                            <button onClick={(e) => handleModelSelect(e, model.model_urls.gltf)} className="btn-contrast btn-square btn-sm">
                                Select
                            </button>
                        </div>
                    );
                })}
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />}
        </div>
    );
};

export default MagiScanModels;
