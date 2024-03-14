import "@/styles/NotFound.css";
import Image from "next/image";
import Link from "next/link";
import notFoundImg from "@/assets/images/notfoung.png";

export default function NotFound() {
    return (
        <section className="error-section">
            <div className="error-container">
                <Image src={notFoundImg} alt="Not Found" />
                <div>
                    <h3>Uh-oh, 404</h3>
                    <p>Seems like the page you are looking for does not exist</p>
                    <button className="btn-grad">
                        <Link href="/">Return Home</Link>
                    </button>
                </div>
            </div>
        </section>
    );
}
