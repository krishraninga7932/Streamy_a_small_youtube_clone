import { db } from "../../drizzle/db";
import { videos } from "../../drizzle/schema";

import {
  Link,
  useLoaderData,
} from "react-router";

import {
  useRef,
  useEffect,
} from "react";

import {
  eq,
  and,
  ne,
} from "drizzle-orm";

import {
  Menu,
  Search,
  Bell,
  User,
  Clapperboard,
  CheckCircle2,
} from "lucide-react";

import {
  formatDistanceToNowStrict,
} from "date-fns";

import videojs from "video.js";

import "video.js/dist/video-js.css";



// ================= LOADER =================

export async function loader({
  params,
}: any) {

  const video =
    await db
      .select()
      .from(videos)
      .where(
        eq(
          videos.id,
          Number(params.id)
        )
      );

  const currentVideo =
    video[0];

  const relatedVideo =
    await db
      .select()
      .from(videos)
      .where(
        and(
          eq(
            videos.category,
            currentVideo.category
          ),

          ne(
            videos.id,
            currentVideo.id
          )
        )
      )
      .limit(10);

  return {

    video: currentVideo,

    relatedVideo,

  };

}



// ================= TYPES =================

type VideoQuality = {

  quality: string;

  url: string;

};



// ================= COMPONENT =================

export default function Watch() {

  const videoRef =
    useRef<HTMLVideoElement | null>(
      null
    );

  const playerRef =
    useRef<any>(null);

  const {
    video,
    relatedVideo,
  } = useLoaderData() as any;



  // ================= VIDEO PLAYER =================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        if (!videoRef.current) {
          return;
        }



        // DESTROY OLD PLAYER

        if (playerRef.current) {

          playerRef.current.dispose();

          playerRef.current =
            null;

        }



        const defaultQuality =
          video.videoUrls[
          video.videoUrls.length - 1
          ];



        // ================= CREATE PLAYER =================

        const player: any =
          videojs(
            videoRef.current,
            {

              controls: true,

              autoplay: true,

              responsive: true,

              fluid: true,

              preload: "auto",

              playbackRates: [
                0.25,
                0.5,
                0.75,
                1,
                1.25,
                1.5,
                1.75,
                2,
              ],

              controlBar: {

                currentTimeDisplay: true,

                timeDivider: true,

                durationDisplay: true,

                remainingTimeDisplay: false,

                pictureInPictureToggle: true,

                volumePanel: {
                  inline: false,
                },

              },

              sources: [

                {
                  src:
                    defaultQuality.url,

                  type:
                    "video/mp4",
                },

              ],

            }
          );



        playerRef.current =
          player;



        // ================= SETTINGS BUTTON =================

        const Button: any =
          videojs.getComponent(
            "Button"
          );



        class SettingsButton
          extends Button {

          constructor(
            player: any,
            options: any
          ) {

            super(
              player,
              options
            );

            this.controlText(
              "Settings"
            );

          }



          handleClick() {

            const existingMenu =
              document.querySelector(
                ".vjs-settings-menu"
              );



            // CLOSE IF ALREADY OPEN

            if (
              existingMenu
            ) {

              existingMenu.remove();

              return;

            }



            // ================= MENU =================

            const menu =
              document.createElement(
                "div"
              );

            menu.className =
              "vjs-settings-menu";



            // ================= MENU STYLE =================

            menu.style.position =
              "absolute";

            menu.style.bottom =
              "60px";

            menu.style.right =
              "20px";

            menu.style.background =
              "#16161f";

            menu.style.border =
              "1px solid #2a2a35";

            menu.style.borderRadius =
              "14px";

            menu.style.overflow =
              "hidden";

            menu.style.zIndex =
              "9999";

            menu.style.minWidth =
              "180px";

            menu.style.boxShadow =
              "0 10px 30px rgba(0,0,0,0.5)";



            // ================= HEADER =================

            const header =
              document.createElement(
                "div"
              );

            header.innerHTML =
              "Quality";

            header.style.padding =
              "14px 16px";

            header.style.fontWeight =
              "600";

            header.style.fontSize =
              "14px";

            header.style.borderBottom =
              "1px solid #27272f";

            header.style.color =
              "white";

            menu.appendChild(
              header
            );



            // ================= QUALITY OPTIONS =================

            video.videoUrls
              .slice()
              .reverse()
              .forEach(
                (
                  quality:
                    VideoQuality
                ) => {

                  const item =
                    document.createElement(
                      "div"
                    );



                  // ================= TEXT =================

                  item.innerHTML =
                    quality.quality.replace(
                      ".mp4",
                      ""
                    );



                  // ================= BASE STYLE =================

                  item.style.padding =
                    "14px 16px";

                  item.style.cursor =
                    "pointer";

                  item.style.fontSize =
                    "14px";

                  item.style.transition =
                    "0.2s";

                  item.style.fontWeight =
                    "500";



                  // ================= ACTIVE QUALITY =================

                  const currentSource =
                    player.currentSrc();



                  const isActive =
                    currentSource.includes(
                      quality.url
                    );



                  if (isActive) {

                    item.style.background =
                      "#8B5CF6";

                    item.style.color =
                      "white";

                  }

                  else {

                    item.style.background =
                      "transparent";

                    item.style.color =
                      "#9ca3af";

                  }



                  // ================= HOVER =================

                  item.onmouseenter =
                    () => {

                      if (!isActive) {

                        item.style.background =
                          "#8B5CF620";

                        item.style.color =
                          "white";

                      }

                    };



                  item.onmouseleave =
                    () => {

                      if (!isActive) {

                        item.style.background =
                          "transparent";

                        item.style.color =
                          "#9ca3af";

                      }

                    };



                  // ================= CHANGE QUALITY =================

                  item.onclick =
                    () => {

                      const currentTime =
                        player.currentTime();

                      const isPaused =
                        player.paused();



                      // CHANGE SOURCE

                      player.src({

                        src:
                          quality.url,

                        type:
                          "video/mp4",

                      });



                      // LOAD VIDEO

                      player.load();



                      // RESTORE TIME

                      player.one(
                        "loadedmetadata",
                        () => {

                          player.currentTime(
                            currentTime
                          );

                          if (
                            !isPaused
                          ) {

                            player.play();

                          }

                        }
                      );



                      // CLOSE MENU

                      menu.remove();

                    };



                  menu.appendChild(
                    item
                  );

                }
              );



            player.el().appendChild(
              menu
            );

          }

        }



        // ================= REGISTER BUTTON =================

        videojs.registerComponent(
          "SettingsButton",
          SettingsButton as any
        );



        // ================= ADD SETTINGS BUTTON =================

        const settingsButton =
          player.controlBar.addChild(
            "SettingsButton",
            {},
            player.controlBar.children_.length - 2
          );



        // ================= BUTTON CLASS =================

        settingsButton.addClass(
          "vjs-button"
        );



        // ================= ICON =================

        settingsButton.el().innerHTML =
          `
            <span
              class="vjs-icon-cog"
              style="
                font-size:18px;
                display:flex;
                align-items:center;
                justify-content:center;
                width:100%;
                height:100%;
              "
            ></span>
          `;

      }, 0);



    return () => {

      clearTimeout(timer);

      if (playerRef.current) {

        playerRef.current.dispose();

        playerRef.current =
          null;

      }

    };

  }, [video.id]);



  return (

    <div className="min-h-screen bg-[#0f0f14] text-white">

      {/* ================= HEADER ================= */}

      <header className="fixed top-0 left-0 right-0 z-50 flex h-[65px] items-center justify-between border-b border-[#1f1f2a] bg-[#0f0f14] px-[20px]">

        {/* LEFT */}

        <div className="flex items-center gap-[15px]">

          <button className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-[#1a1a24] hover:text-white">

            <Menu size={20} />

          </button>

          <Link
            to="/"
            className="flex items-center gap-[10px]"
          >

            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">

              <Clapperboard size={18} />

            </div>

            <h1 className="text-[22px] font-bold">

              Stream
              <span className="text-[#8b5cf6]">
                y
              </span>

            </h1>

          </Link>

        </div>



        {/* SEARCH */}

        <div className="mx-[30px] hidden max-w-[650px] flex-1 md:flex">

          <input
            type="text"
            placeholder="Search videos"
            className="h-[42px] flex-1 rounded-l-full border border-[#27272f] bg-[#16161f] px-[18px] text-white outline-none"
          />

          <button className="flex w-[60px] items-center justify-center rounded-r-full bg-[#1d1d28] text-[#9ca3af]">

            <Search size={18} />

          </button>

        </div>



        {/* RIGHT */}

        <div className="flex items-center gap-[10px]">

          <button className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-[#1a1a24] hover:text-white">

            <Bell size={19} />

          </button>

          <button className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-[#1a1a24] hover:text-white">

            <User size={19} />

          </button>

        </div>

      </header>



      {/* ================= MAIN ================= */}

      <div className="mx-auto flex max-w-[1700px] gap-[25px] p-[20px] pt-[85px]">

        {/* ================= LEFT ================= */}

        <div className="flex-1">

          {/* VIDEO */}

          <div
            key={video.id}
            className="aspect-video overflow-hidden rounded-[20px] bg-black"
          >

            <div data-vjs-player>

              <video
                ref={videoRef}
                className="
                  video-js
                  vjs-big-play-centered
                  h-full
                  w-full
                "
              />

            </div>

          </div>



          {/* TITLE */}

          <h1 className="mt-[20px] text-[24px] font-bold leading-[1.4]">

            {video.title}

          </h1>



          {/* CHANNEL */}

          <div className="mt-[18px] flex items-center gap-[15px]">

            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-[20px] font-bold">

              S

            </div>

            <div>

              <div className="flex items-center gap-[6px]">

                <h2 className="font-semibold">
                  Streamy
                </h2>

                <CheckCircle2
                  size={16}
                  className="text-[#9ca3af]"
                />

              </div>

              <p className="text-[13px] text-[#9ca3af]">

                1.2M subscribers

              </p>

            </div>

          </div>



          {/* INFO */}

          <div className="mt-[20px] rounded-[20px] bg-[#1a1a24] p-[18px]">

            <div className="flex flex-wrap items-center gap-[10px] text-[14px] font-semibold">

              <span>
                {video.views} views
              </span>

              <span>•</span>

              <span>

                {formatDistanceToNowStrict(
                  new Date(
                    video.createdAt
                  ),
                  {
                    addSuffix: true,
                  }
                )}

              </span>

            </div>

            <p className="mt-[15px] whitespace-pre-line text-[15px] leading-[1.8] text-[#d1d5db]">

              {video.description}

            </p>

          </div>

        </div>



        {/* ================= RIGHT SIDEBAR ================= */}

        <div className="hidden w-[380px] xl:block">

          <div className="space-y-[15px]">

            {relatedVideo.map(
              (rv: any) => (

                <Link
                  to={`/watch/${rv.id}`}
                  key={rv.id}
                  className="flex gap-[12px]"
                >

                  <div className="h-[95px] w-[170px] overflow-hidden rounded-[14px] bg-[#1a1a24]">

                    <img
                      src={
                        rv.thumbnailUrl
                      }
                      className="h-full w-full object-cover"
                    />

                  </div>

                  <div className="flex-1">

                    <h3 className="line-clamp-2 text-[14px] font-semibold leading-[1.4]">

                      {rv.title}

                    </h3>

                    <p className="mt-[6px] text-[13px] text-[#9ca3af]">

                      Streamy

                    </p>

                    <p className="mt-[2px] text-[12px] text-[#6b7280]">

                      {rv.views} views

                    </p>

                  </div>

                </Link>

              )
            )}

          </div>

        </div>

      </div>

    </div>

  );

}