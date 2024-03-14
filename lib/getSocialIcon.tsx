import Facebook from "@/assets/socials/facebook-f.svg";
import Instagram from "@/assets/socials/instagram.svg";
import Pinterest from "@/assets/socials/pinterest-p.svg";
import Discord from "@/assets/socials/discord.svg";
import LinkedIn from "@/assets/socials/linkedin-in.svg";
import Telegram from "@/assets/socials/telegram.svg";
import Twitter from "@/assets/socials/twitter.svg";
import WhatsApp from "@/assets/socials/whatsapp.svg";
import TikTok from "@/assets/socials/tiktok.svg";
import Reddit from "@/assets/socials/reddit-alien.svg";
import Medium from "@/assets/socials/medium.svg";
import Notion from "@/assets/socials/n-solid.svg";

import Default from "@/assets/socials/instagram.svg";

export function getSocialIcon(name: SocialName) {
    switch (name) {
        case "Facebook":
            return <Facebook />;
        case "Instagram":
            return <Instagram />;
        case "Pinterest":
            return <Pinterest />;
        case "Discord":
            return <Discord />;
        case "LinkedIn":
            return <LinkedIn />;
        case "Telegram":
            return <Telegram />;
        case "Twitter":
            return <Twitter />;
        case "WhatsApp":
            return <WhatsApp />;
        case "TikTok":
            return <TikTok />;
        case "Reddit":
            return <Reddit />;
        case "Medium":
            return <Medium />;
        case "Notion":
            return <Notion />;
        default:
            return <Default />;
    }
}
