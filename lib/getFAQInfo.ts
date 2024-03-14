import { API_URL } from "@/app/context/constants";

export async function getFAQInfo() {
    try {
        const response = await fetch(API_URL + "/data/faq-info", { next: { revalidate: 86400 } });
        if (response.status !== 200) return null;
        const data: FAQList = await response.json();
        return data.list;
    } catch (err) {
        console.log(err);
        return null;
    }
}
