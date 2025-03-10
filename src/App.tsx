import type { JSX } from "solid-js";
import { Index, batch, createSignal, onCleanup, onMount } from "solid-js";

const WINDOW_RATIO = 7;

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

function Clock(): JSX.Element {
    const [showAMPM, setShowAMPM] = createSignal(true);
    const [time, setTime] = createSignal<Date>(new Date());
    const [formattedDate, setFormattedDate] = createSignal<number[]>(getTime(time(), showAMPM()));
    const controller = new AbortController();
    const [windowWidth, setWindowWidth] = createSignal(window.innerWidth);

    const toggleAMPM = (): void => {
        batch(() => {
            setShowAMPM((prev) => !prev);
            const d = new Date();
            setFormattedDate(getTime(d, showAMPM()));
            setTime(d);
        });
    };

    const timer: number = setInterval(() => {
        batch((): void => {
            const d = new Date();
            setFormattedDate(getTime(d, showAMPM()));
            setTime(d);
        });
    }, 1000);

    onMount(() => {
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth), { signal: controller.signal });
    });

    onCleanup(() => {
        controller.abort();
        clearInterval(timer);
    });

    return (
        <>
            <main class="flex flex-col items-center justify-center space-y-4 p-6">
                <button
                    type="button"
                    class="cursor-pointer rounded bg-blue-600 p-3 text-white hover:bg-blue-700"
                    onClick={toggleAMPM}
                >
                    Switch to {!showAMPM() ? "12h" : "24h"}
                </button>
                <h1 style={`font-size: ${Math.round(windowWidth() / WINDOW_RATIO)}px; font-weight: bold;`}>
                    <time>
                        <Index each={formattedDate()}>
                            {(item, index) => (
                                <>
                                    <span>{item()}</span>
                                    {(index === 1 || index === 3) && <span>&#58;</span>}
                                </>
                            )}
                        </Index>
                        {showAMPM() && <>&nbsp;{time().getHours() >= 12 ? "pm" : "am"}</>}
                    </time>
                </h1>
                <p style={`font-size: ${Math.round(windowWidth() / (WINDOW_RATIO * 3))}px`}>
                    {time().toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}
                </p>
            </main>
        </>
    );
}

export default Clock;
