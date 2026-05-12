import fs from "fs";
import path from "path";

import ffmpeg from "./ffmpeg.js";

export const transcodeVideo = async (
    inputPath,
    qualities
) => {

    const outputDir =
        `processed/${Date.now()}`;

    fs.mkdirSync(outputDir, {
        recursive: true,
    });

    const generatedVideos = [];

    for (const quality of qualities) {

        const outputPath =
            path.join(
                outputDir,
                `${quality.label}.mp4`
            );

        await new Promise((resolve, reject) => {

            ffmpeg(inputPath)

                .videoCodec("libx264")

                .size(`?x${quality.height}`)

                .outputOptions([
                    "-preset fast",
                    "-crf 28"
                ])

                .output(outputPath)

                .on("end", () => {

                    console.log(
                        `${quality.label} generated`
                    );

                    resolve();

                })

                .on("error", reject)

                .run();

        });

        generatedVideos.push(outputPath);

    }

    return generatedVideos;

};