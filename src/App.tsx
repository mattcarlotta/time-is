import type { JSX } from "solid-js";
import { Index, batch, createSignal, onCleanup } from "solid-js";

function getTime(date: Date, showAMPM: boolean, showSeconds: boolean): number[] {
    const hour = date.getHours() > 12 && showAMPM ? date.getHours() - 12 : date.getHours();

    const time = [
        Math.floor(hour / 10),
        hour % 10,
        Math.floor(date.getMinutes() / 10),
        date.getMinutes() % 10,
        Math.floor(date.getSeconds() / 10),
        date.getSeconds() % 10
    ];

    return showSeconds ? time : time.slice(0, -2);
}

export default function Clock(): JSX.Element {
    const [showAMPM, setShowAMPM] = createSignal(true);
    const [date, setDate] = createSignal<Date>(new Date());
    const [showSeconds, setShowSeconds] = createSignal<boolean>(true);
    const [formattedDate, setFormattedDate] = createSignal<number[]>(getTime(date(), showAMPM(), showSeconds()));

    const updateTime = (): void => {
        const d = new Date();
        setFormattedDate(getTime(d, showAMPM(), showSeconds()));
        setDate(d);
    };

    const toggleAMPM = (): void => {
        batch(() => {
            setShowAMPM((prev) => !prev);
            updateTime();
        });
    };

    const toggleSeconds = (): void => {
        batch(() => {
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
                {date().toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })}
            </p>
            <h1 class="text-[15vi] font-bold">
                <time>
                    <Index each={formattedDate()}>
                        {(item, index) => (
                            <>
                                <span>{item()}</span>
                                {(index + 1) % 2 === 0 && index + 1 !== formattedDate().length ? (
                                    <span>&#58;</span>
                                ) : null}
                            </>
                        )}
                    </Index>
                    {showAMPM() && <>&nbsp;{date().getHours() >= 12 ? "pm" : "am"}</>}
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
