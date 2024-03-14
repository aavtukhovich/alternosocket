import { API_URL } from "@/app/context/constants";

export async function getPartners() {
    try {
        const response = await fetch(API_URL + "/data/partners", { next: { revalidate: 86400 } });
        if (response.status !== 200) return null;
        const data: PartnersList = await response.json();
        if (data.list.length === 0) return [];
        let result = data.list;
        while (result.length < 13) {
            result = result.concat(data.list);
        }
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
}
