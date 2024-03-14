import { Metadata } from "next";
import { ACCOUNT_HEADING, ACCOUNT_DESCRIPTION } from "@/data/Texts";

export const metadata: Metadata = {
    title: "Account",
    description: ACCOUNT_HEADING + ". " + ACCOUNT_DESCRIPTION + ". Explore more at Alterno!",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return children;
}
