import "@/styles/Partners.css";

import { getPartners } from "@/lib/getPartners";
import PatnersSlider from "../components/PatnersSlider";
import { PARTNERS_HEADING, PARTNERS_DESCRIPTION } from "@/data/Texts";

const Partners = async () => {
    const partners = await getPartners();
    return partners && partners.length > 0 ? (
        <section className="partners-section">
            <div className="partners-container">
                <div className="partners-content">
                    <h3>{PARTNERS_HEADING}</h3>
                    <p>{PARTNERS_DESCRIPTION}</p>
                </div>
            </div>
            <PatnersSlider partners={partners} />
        </section>
    ) : null;
};

export default Partners;
