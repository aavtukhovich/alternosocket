"use client";
import "@/styles/Footer.css";
import img from "@/assets/images/footer-image.png";
import Image from "next/image";
import MailchimpSubscribe, { EmailFormFields } from "react-mailchimp-subscribe";
import { FOOTER_BANNER_HEADING, FOOTER_BANNER_DESCRIPTION } from "@/data/Texts";
import IconButton from "../IconButton";
import SendIcon from "@/assets/icons/paper-plane-solid.svg";

type FormPros = {
    status: "sending" | "error" | "success" | null;
    message: string | Error | null;
    onValidated: any;
};

const CustomForm = ({ status, message, onValidated }: FormPros) => {
    let email: HTMLInputElement;
    const submit = () =>
        email &&
        email.value.indexOf("@") > -1 &&
        onValidated({
            EMAIL: email.value,
        });

    return (
        <>
            <div className="form-subcribe">
                <div id="subscribe-form" className="form-submit">
                    <input ref={(node: HTMLInputElement) => (email = node)} type="email" placeholder="Your email" className="form-email" />
                    <IconButton addClass="btn-grad form-btn" icon={<SendIcon />} customClickEvent={submit} text="Subscribe" />
                </div>
            </div>
            {status === "sending" && (
                <div className="resp-message send">
                    <h6>Processing...</h6>
                </div>
            )}
            {status === "error" && (
                <div className="resp-message error">
                    <h6>Error</h6>
                    {typeof message === "string" && <p dangerouslySetInnerHTML={{ __html: message }} />}
                </div>
            )}
            {status === "success" && (
                <div className="resp-message success">
                    <h6>Success</h6>
                    {typeof message === "string" && <p dangerouslySetInnerHTML={{ __html: message }} />}
                </div>
            )}
        </>
    );
};

export const FooterBanner = () => {
    const url = process.env.NEXT_PUBLIC_MAILCHIMP_URL as string;

    return (
        <section className="banner-container">
            <div className="banner">
                <div className="banner-content">
                    <h3>{FOOTER_BANNER_HEADING}</h3>
                    <p className="sub-heading">{FOOTER_BANNER_DESCRIPTION}</p>

                    <MailchimpSubscribe
                        url={url}
                        render={({ subscribe, status, message }) => (
                            <CustomForm status={status} message={message} onValidated={(formData: EmailFormFields) => subscribe(formData)} />
                        )}
                    />
                </div>
                <div className="banner-img">
                    <Image src={img} alt="3D Models" />
                </div>
            </div>
        </section>
    );
};
