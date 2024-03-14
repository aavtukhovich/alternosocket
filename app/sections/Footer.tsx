import "@/styles/Footer.css";
import Link from "next/link";
import Image from "next/image";
import { FooterBanner } from "../components/footer/FooterBanner";
import CookiesBanner from "../components/footer/CookieBanner";
import { fetchFooterMenu, fetchSocials, fetchCookiesText } from "@/lib/footerInfo";
import { getSocialIcon } from "@/lib/getSocialIcon";

import Logo from "@/assets/logo.png";

const Footer = async () => {
    const footerMenu = await fetchFooterMenu();
    const socials = await fetchSocials();
    const cookiesText = await fetchCookiesText();
    return (
        <footer>
            <FooterBanner />
            <div className="footer-content-container">
                <div className="footer-menu">
                    <Link href="/" className="footer-logo">
                        <Image src={Logo} alt="Alterno" />
                    </Link>
                    <ul>
                        {footerMenu.map((item, index) => (
                            <li key={index}>
                                {item.link.startsWith("/") ? (
                                    <Link href={item.link}>{item.name}</Link>
                                ) : (
                                    <a href={item.link} target="_blank" rel="noreferrer noopener">
                                        {item.name}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="footer-socials">
                    {socials.length > 0 && (
                        <>
                            <h5>Follow Us</h5>
                            <ul>
                                {socials.map((item, index) => (
                                    <li key={index}>
                                        <a href={item.link} target="_blank" rel="noreferrer noopener">
                                            {getSocialIcon(item.name)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
            <p className="copyright">Copyright © {new Date().getFullYear()} Alterno | NFT Marketplace</p>
            <CookiesBanner
                heading={cookiesText ? cookiesText.heading : "Cookies notice"}
                text={cookiesText ? cookiesText.text : "We use cookies to bring you the best possible exprerience"}
            />
        </footer>
    );
};

export default Footer;
