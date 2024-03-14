export async function triggerRevalidation(tag: string) {
    try {
        const response = await fetch(`/api/revalidate?tag=${encodeURIComponent(tag)}`);

        if (response.status === 200) {
            const result = await response.json();
            console.log(result);
        } else {
            console.error("Failed to trigger revalidation");
        }
    } catch (error) {
        console.error("Error triggering revalidation:", error);
    }
}
