import PopularModels from "@/app/sections/PopularModels";

export default function ModelLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        tokenId: string;
    };
}) {
    return (
        <>
            {children}
            <section className="popular-home">
                <PopularModels />
            </section>
        </>
    );
}
