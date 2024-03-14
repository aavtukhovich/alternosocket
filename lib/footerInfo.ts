import { API_URL } from "@/app/context/constants";

export async function fetchSocials() {
    const response = await fetch(API_URL + "/data/socials", { next: { revalidate: 86400 } });
    const list: SocialLink[] = await response.json();
    const active = list.filter((v) => v.active);
    return active;
}

export async function fetchFooterMenu() {
    const response = await fetch(API_URL + "/data/footer-menu", { next: { revalidate: 86400 } });
    const data: FooterMenuList = await response.json();
    return data.list;
}

export async function fetchCookiesText() {
    try {
        const response = await fetch(API_URL + "/data/cookies");
        if (response.status !== 200) throw new Error(response.statusText);
        if (!response.headers.get("Content-Length") || parseInt(response.headers.get("Content-Length") as string) === 0) return null;
        const data: CookiesText = await response.json();
        return data;
    } catch (err) {
        console.log(err);
        return null;
    }
}
