export const VIDEO_QUALITIES = [
    { label: "144p", height: 144 },
    { label: "240p", height: 240 },
    { label: "360p", height: 360 },
    { label: "480p", height: 480 },
    { label: "720p", height: 720 },
    { label: "1080p", height: 1080 },
];


export const getAllowedQualities = (sourceHeight) => {

    return VIDEO_QUALITIES.filter(
        q => q.height <= sourceHeight
    )

}