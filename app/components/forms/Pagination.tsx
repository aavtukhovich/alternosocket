import type { MouseEvent } from "react";

type Props = {
    currentPage: number;
    totalPages: number;
    handlePageChange(event: MouseEvent<HTMLButtonElement>, page: number): Promise<void>;
};

const Pagination = ({ currentPage, totalPages, handlePageChange }: Props) => {
    const buttonClass = "btn-square btn-sm btn-contrast";
    const pageClass = "btn-square btn-sm";

    const renderPageNumbers = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    className={currentPage === i ? pageClass + " btn-secondary" : pageClass + " btn-contrast"}
                    key={i}
                    onClick={(e) => handlePageChange(e, i)}
                    style={currentPage === i ? { textDecoration: "underline" } : {}}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="pagination">
            <button
                className={currentPage > 1 ? buttonClass : buttonClass + " btn-disabled"}
                onClick={currentPage > 1 ? (e) => handlePageChange(e, currentPage - 1) : (e) => e.preventDefault()}
            >
                Prev
            </button>

            {renderPageNumbers()}
            <button
                className={currentPage < totalPages ? buttonClass : buttonClass + " btn-disabled"}
                onClick={currentPage < totalPages ? (e) => handlePageChange(e, currentPage + 1) : (e) => e.preventDefault()}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
