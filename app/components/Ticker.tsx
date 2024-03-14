import { useCountUp } from "use-count-up";

type Props = {
    isCounting: boolean;
    start: number;
    end: number;
    duration: number;
    addText?: string;
};

const Ticker = ({ isCounting, start, end, duration, addText }: Props) => {
    const { value } = useCountUp({
        isCounting,
        start,
        end,
        duration,
        easing: "easeOutCubic",
        decimalPlaces: 0,
        thousandsSeparator: " ",
    });
    return <span className="ticker">{addText ? value?.toString() + addText : value}</span>;
};

export default Ticker;
