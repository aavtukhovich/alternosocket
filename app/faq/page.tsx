import "@/styles/FAQ.css";
import { FAQ_HEADING, FAQ_DESCRIPTION } from "@/data/Texts";
import { getFAQInfo } from "@/lib/getFAQInfo";
import { Metadata } from "next";

import Accordion from "../components/Accordion";

export const metadata: Metadata = {
    title: "FAQ",
    description: FAQ_HEADING + ". " + FAQ_DESCRIPTION + " Explore more at Alterno!",
};

const FAQPage = async () => {
    const faqList = await getFAQInfo();
    return (
        <section className="section-faq">
            <div className="faq-container">
                <h3>{FAQ_HEADING}</h3>
                <p className="desc">{FAQ_DESCRIPTION}</p>
                <div className="faq-content">
                    {faqList ? (
                        faqList.length > 0 ? (
                            faqList.map((item, index) => <Accordion heading={item.question} content={item.answer} key={index} />)
                        ) : (
                            <h5>Nothing here yet. Check back soon!</h5>
                        )
                    ) : (
                        <h5>Error loading data. We are already working on it!</h5>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FAQPage;
