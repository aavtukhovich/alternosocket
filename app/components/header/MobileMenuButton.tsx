"use client";

const MobileMenuButton = () => {
    function handleClick() {
        const button = document.getElementById("btn-toggle");
        const menu = document.getElementById("main-menu");
        button?.classList.toggle("active");
        menu?.classList.toggle("active");
    }

    return (
        <div className="mobile-button" id="btn-toggle" onClick={handleClick}>
            <span></span>
        </div>
    );
};

export default MobileMenuButton;
