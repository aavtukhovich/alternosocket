import "@/styles/Tooltip.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import InfoIcon from "@/assets/icons/circle-info-solid.svg";

type Props = {
    height?: number;
    children: React.ReactNode;
};

function InfoTooltip({ height, children }: Props) {
    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            {children}
        </Tooltip>
    );

    return (
        <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 250 }} overlay={renderTooltip}>
            <button type="button" className="tooltip-btn" style={{ height: height ?? "17px" }}>
                <InfoIcon />
            </button>
        </OverlayTrigger>
    );
}

export default InfoTooltip;
