import type { JSX } from "solid-js";
import { Index, batch, createSignal, onCleanup } from "solid-js";
import { formatAsDayWithOrdinal, formatAsLongMonth, formatAsLongWeekDay, getTime } from "./utils";

export default function Clock(): JSX.Element {
    const [showAMPM, setShowAMPM] = createSignal<boolean>(true);
    const [date, setDate] = createSignal<Date>(new Date());
    const [showSeconds, setShowSeconds] = createSignal<boolean>(true);
    const [formattedDate, setFormattedDate] = createSignal<(number | string)[]>(
        getTime(date(), showAMPM(), showSeconds())
    );

    const updateTime = (): void => {
        const d = new Date();
        setFormattedDate(getTime(d, showAMPM(), showSeconds()));
        setDate(d);
    };

    const toggleAMPM = (): void => {
        batch((): void => {
            setShowAMPM((prev) => !prev);
            updateTime();
        });
    };

    const toggleSeconds = (): void => {
        batch((): void => {
            setShowSeconds((prev) => !prev);
            updateTime();
        });
    };

    const timer: number = setInterval(() => {
        batch((): void => {
            updateTime();
        });
    }, 1000);

    onCleanup((): void => {
        clearInterval(timer);
    });

    return (
        <main class="flex flex-col items-center justify-center space-y-2 p-6">
            <p class="text-[6vi]">
                {formatAsLongWeekDay(date().getDay())}&nbsp;
                {formatAsLongMonth(date().getMonth())}&nbsp;
                {formatAsDayWithOrdinal(date().getDate())}&comma;&nbsp;
                {date().getFullYear()}
            </p>
            <h1 class="text-[15vi] font-bold">
                <time>
                    <Index each={formattedDate()}>{(item) => <span>{item()}</span>}</Index>
                    {showAMPM() && <span>&nbsp;{date().getHours() >= 12 ? "pm" : "am"}</span>}
                </time>
            </h1>
            <div class="flex space-x-4">
                <button
                    type="button"
                    class="cursor-pointer rounded bg-blue-600 p-3 text-white hover:bg-blue-700"
                    onClick={toggleAMPM}
                >
                    Switch to {showAMPM() ? "24h" : "12h"}
                </button>
                <button
                    type="button"
                    class="w-33 cursor-pointer rounded bg-fuchsia-600 p-3 text-white hover:bg-fuchsia-700"
                    onClick={toggleSeconds}
                >
                    {showSeconds() ? "Hide" : "Show"} Seconds
                </button>
            </div>
        </main>
    );
}
