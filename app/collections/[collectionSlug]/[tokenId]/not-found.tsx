import "@/styles/NotFound.css";
import Image from "next/image";
import Link from "next/link";
import notFoundImg from "@/assets/images/notfoung.png";

export default function NotFound() {
    return (
        <section className="error-model-section">
            <div className="error-container">
                <Image src={notFoundImg} alt="Not Found" />
                <div>
                    <h3>Uh-oh, 404</h3>
                    <p>Seems like the model you are looking for is not on sale</p>
                    <button className="btn-grad">
                        <Link href="/models">Explore Other Models</Link>
                    </button>
                </div>
            </div>
        </section>
    );
}
