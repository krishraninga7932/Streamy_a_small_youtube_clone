import ffmpeg from "./ffmpeg.js";

export const getVideoInfo = (videoPath) => {
    return new Promise((resolve, reject) => {

        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) return reject(err);

            const stream = metadata.streams.find(
                s => s.codec_type === 'video'
            );

            resolve({
                width: stream.width,
                height: stream.height,
                duration: metadata.format.duration
            })

        })


    })
}
