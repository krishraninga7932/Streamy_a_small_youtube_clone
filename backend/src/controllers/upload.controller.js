import fs from "fs"
import path from "path";
import cloudinary from "../config/cloudinary.js";


import { getVideoInfo } from "../utils/getVideoInfo.js";

import { getAllowedQualities } from "../utils/qualities.js";

import { transcodeVideo } from "../utils/transcodeVideo.js";

import { formatDuration } from "../utils/formatDuration.js"

import { deleteFile } from "../utils/deleteFile.js";


export const uploadVideo = async (
  req,
  res
) => {

  try {

    const video =
      req.files.video?.[0];

    const thumbnail =
      req.files.thumbnail?.[0];

    if (!video) {

      return res.status(400).json({
        success: false,
        message: "No video uploaded",
      });

    }

    // STEP 1
    // DETECT SOURCE VIDEO INFO
    const info = await getVideoInfo(video.path)
    console.log(info);


    // STEP 2
    // FILTER ALLOWED QUALITIES
    const qualities = getAllowedQualities(info.height)
    console.log(qualities)


    // STEP 3
    // TRANSCODE VIDEOS
    const generateVideos = await transcodeVideo(video.path, qualities)
    console.log(generateVideos)
    deleteFile(video.path)



    // format time in to minutes and seconds
    const formattedDuration =
      formatDuration(info.duration);


    // STEP 4
    // UPLOAD TO CLOUDINARY

    const videoResult =

      await Promise.all(
        generateVideos.map(
          async (videoPath) => {
            const result =
              await cloudinary.uploader.upload(
                videoPath,

                {
                  resource_type: "video",
                  folder: "streamy-videos",
                }
              );
            return {
              quality: path.basename(videoPath),
              url: result.secure_url,
            };
          }
        )
      )



    generateVideos.forEach(
      (videoPath) => {
        deleteFile(videoPath)
      }
    )

    // DELETE EMPTY PROCESSED FOLDER

    const processedFolder =
      path.dirname(
        generateVideos[0]
      );

    if (
      fs.existsSync(
        processedFolder
      )
    ) {

      fs.rmSync(
        processedFolder,
        {
          recursive: true,
          force: true,
        }
      );

      console.log(
        `Deleted folder: ${processedFolder}`
      );

    }


    // THUMBNAIL UPLOAD

    let thumbnailUrl = "";

    if (thumbnail) {

      const thumbnailResult =
        await cloudinary.uploader.upload(
          thumbnail.path,

          {
            folder:
              "streamy-thumbnails",
          }
        );

      thumbnailUrl =
        thumbnailResult.secure_url;

      // DELETE THUMBNAIL

      deleteFile(
        thumbnail.path
      );

    }

    return res.status(200).json({

      success: true,

      message:
        "Video uploaded successfully",

      videoUrls: videoResult,

      thumbnailUrl,

      sourceResolution: `${info.height}p`,

      duration: formattedDuration,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Video processing failed",

    });

  }

}; 