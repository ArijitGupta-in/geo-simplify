import { performance } from "node:perf_hooks";
import { simplifyDouglasPeucker } from "../dist/index.js";

const sizes = [500, 1000, 2000];
const runs = 5;

function createTrack(size, shape) {
    return Array.from({ length: size }, (_, index) => {
        const progress = index / (size - 1);
        const longitude = -0.01 + progress * 0.02;
        let latitude = 0;

        if (shape === "wave") {
            latitude = Math.sin(progress * Math.PI * 8) * 0.001;
        } else if (shape === "alternating") {
            latitude = index % 2 === 0 ? 0.001 : -0.001;
        } else if (shape === "skewed") {
            latitude = 0.01 * Math.exp((index - size + 1) * 0.01);
        }

        return { latitude, longitude };
    });
}

for (const shape of ["straight", "wave", "alternating", "skewed"]) {
    for (const size of sizes) {
        const track = createTrack(size, shape);
        const toleranceMeters =
            shape === "alternating" || shape === "skewed" ? 0 : 5;
        simplifyDouglasPeucker(track, toleranceMeters);

        const samples = [];
        let retainedCount = 0;
        for (let run = 0; run < runs; run += 1) {
            const start = performance.now();
            retainedCount = simplifyDouglasPeucker(track, toleranceMeters).coordinates.length;
            samples.push(performance.now() - start);
        }

        samples.sort((a, b) => a - b);
        const median = samples[Math.floor(runs / 2)];
        if (median === undefined) {
            throw new Error("Benchmark did not produce timing samples");
        }
        console.log(
            `${shape.padEnd(11)} n=${String(size).padStart(4)} ` +
                `median=${median.toFixed(2)} ms ` +
                `retained=${retainedCount}`,
        );
    }
}
