import type { JSX } from "solid-js";
import { Index, batch, createSignal, onCleanup } from "solid-js";

function getTime(date: Date, showAMPM: boolean): number[] {
    const hour = date.getHours() > 12 && showAMPM ? date.getHours() - 12 : date.getHours();

    return [
        Math.floor(hour / 10),
        hour % 10,
        Math.floor(date.getMinutes() / 10),
        date.getMinutes() % 10,
        Math.floor(date.getSeconds() / 10),
        date.getSeconds() % 10
    ];
}

export default function Clock(): JSX.Element {
    const [showAMPM, setShowAMPM] = createSignal(true);
    const [date, setDate] = createSignal<Date>(new Date());
    const [formattedDate, setFormattedDate] = createSignal<number[]>(getTime(date(), showAMPM()));

    const toggleAMPM = (): void => {
        batch(() => {
            setShowAMPM((prev) => !prev);
            const d = new Date();
            setFormattedDate(getTime(d, showAMPM()));
            setDate(d);
        });
    };

    const timer: number = setInterval(() => {
        batch((): void => {
            const d = new Date();
            setFormattedDate(getTime(d, showAMPM()));
            setDate(d);
        });
    }, 1000);

    onCleanup((): void => {
        clearInterval(timer);
    });

    return (
        <main class="flex flex-col items-center justify-center space-y-4 p-6">
            <h1 class="text-[15vi] font-bold">
                <time>
                    <Index each={formattedDate()}>
                        {(item, index) => (
                            <>
                                <span>{item()}</span>
                                {(index === 1 || index === 3) && <span>&#58;</span>}
                            </>
                        )}
                    </Index>
                    {showAMPM() && <>&nbsp;{date().getHours() >= 12 ? "pm" : "am"}</>}
                </time>
            </h1>
            <p class="text-[5vi]">
                {date().toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })}
            </p>
            <button
                type="button"
                class="cursor-pointer rounded bg-blue-600 p-3 text-white hover:bg-blue-700"
                onClick={toggleAMPM}
            >
                Switch to {showAMPM() ? "24h" : "12h"}
            </button>
        </main>
    );
}
