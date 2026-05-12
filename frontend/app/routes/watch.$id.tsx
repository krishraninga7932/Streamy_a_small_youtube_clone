import { db } from "../../drizzle/db";
import { videos } from "../../drizzle/schema";

import "plyr/dist/plyr.css";

import {
  Link,
  useLoaderData,
} from "react-router";

import { useState, useRef, useEffect } from "react";

import {
  eq, and, ne
} from "drizzle-orm";

import {
  Menu,
  Search,
  Bell,
  Upload,
  User,
  Clapperboard,
  Home as HomeIcon,
  PlaySquare,
  Video,
  TrendingUp,
  Gamepad2,
  Music2,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  History,
  MoreHorizontal,
  CheckCircle2,

} from "lucide-react";

import {
  formatDistanceToNowStrict,
} from "date-fns";



// loader
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

  const currentVideo = video[0]

  const relatedVideo = await db.select().from(videos).where(
    and(
      eq(
        videos.category,
        currentVideo.category
      ),
      ne(videos.id, currentVideo.id)
    )
  ).limit(10)

  return {
    video: currentVideo,
    relatedVideo
  };

}




const SIDEBAR_LINKS = [
  { icon: HomeIcon, label: "Home", active: true },
  { icon: Clapperboard, label: "Shorts" },
  { icon: PlaySquare, label: "Subscriptions" },

  { divider: true },

  { icon: History, label: "History" },
  { icon: Video, label: "Your videos" },

  { divider: true },

  { icon: TrendingUp, label: "Trending" },
  { icon: Gamepad2, label: "Gaming" },
  { icon: Music2, label: "Music" },
];




export default function Watch() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null)


  const { video, relatedVideo } =
    useLoaderData() as any;

  const [selectedQuality, setSelectedQuality] = useState(
    video.videoUrls?.[
    video.videoUrls.length - 1
    ]
  )

  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    setSelectedQuality(
      video.videoUrls?.[
      video.videoUrls.length - 1
      ]
    );
  }, [video])


  // quality switch function
  type VideoQuality = {

    quality: string;

    url: string;

  };
  const handleQualityChange = (quality: VideoQuality) => {
    if (!videoRef.current) {
      return;
    }
    const currentTime = videoRef.current.currentTime;
    const isPaused = videoRef.current.paused;

    setSelectedQuality(quality)

    setTimeout(() => {
      if (!videoRef.current) {
        return
      }
      videoRef.current.currentTime = currentTime

      if (!isPaused) {
        videoRef.current.play()
      }
    }, 100)

  }



  return (

    <div className="min-h-screen bg-[#0f0f14] text-white">

      {/* HEADER */}

      <header className="fixed top-0 left-0 right-0 z-50 flex h-[65px] items-center justify-between border-b border-[#1f1f2a] bg-[#0f0f14] px-[20px]">

        {/* LEFT */}

        <div className="flex items-center gap-[15px]">

          <button
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
            className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-[#1a1a24] hover:text-white"
          >

            <Menu size={20} />

          </button>

          <Link
            to="/"
            className="flex cursor-pointer items-center gap-[10px]"
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

          <button className="flex w-[60px] cursor-pointer items-center justify-center rounded-r-full bg-[#1d1d28] text-[#9ca3af]">

            <Search size={18} />

          </button>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-[10px]">


          <button className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-[#1a1a24] hover:text-white">

            <Bell size={19} />

          </button>

          <button className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-[#1a1a24] hover:text-white">

            <User size={19} />

          </button>

        </div>

      </header>

      {/* OVERLAY */}

      <div
        onClick={() =>
          setSidebarOpen(false)
        }
        className={`fixed inset-0 z-40 bg-black/50 transition-all duration-300 ${sidebarOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
          }`}
      />

      {/* ABSOLUTE SIDEBAR */}

      <aside
        className={`fixed top-[65px] left-0 z-50 h-[calc(100vh-65px)] w-[240px] overflow-y-auto border-r border-[#1f1f2a] bg-[#0f0f14] p-[15px] transition-all duration-300 ${sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"
          }`}
      >

        {SIDEBAR_LINKS.map((item, index) => {

          if ("divider" in item) {

            return (
              <hr
                key={index}
                className="my-[15px] border-[#1f1f2a]"
              />
            );

          }

          const Icon = item.icon;

          return (

            <div
              key={index}
              className={`mb-[5px] flex cursor-pointer items-center gap-[14px] rounded-[12px] px-[15px] py-[12px] transition ${item.active
                ? "bg-[#1e1b4b] text-white"
                : "text-[#9ca3af] hover:bg-[#1a1a24] hover:text-white"
                }`}
            >

              <Icon size={18} />

              <span>
                {item.label}
              </span>

            </div>

          );

        })}

      </aside>

      {/* MAIN */}

      <div className="mx-auto flex max-w-[1700px] gap-[25px] p-[20px] pt-[85px]">

        {/* LEFT */}

        <div className="flex-1">

          {/* VIDEO PLAYER */}

          <div className="relative">

            {/* VIDEO */}

            <div className="aspect-video overflow-hidden rounded-[20px] bg-black">

              <video
                ref={videoRef}
                controls
                autoPlay
                key={selectedQuality.url}
                className="h-full w-full object-contain"
                src={selectedQuality.url}
              />

            </div>

            {/* SETTINGS */}

            <div className="absolute bottom-[20px] right-[20px] z-40">

              <div className="relative">

                {/* SETTINGS BUTTON */}

                <button
                  onClick={() =>
                    setShowSettings(
                      !showSettings
                    )
                  }
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition hover:bg-black"
                >

                  ⚙

                </button>

                {/* DROPDOWN */}

                {showSettings && (

                  <div className="absolute bottom-[55px] right-0 w-[190px] overflow-hidden rounded-[18px] border border-[#2a2a35] bg-[#16161f] shadow-2xl">

                    {/* HEADER */}

                    <div className="border-b border-[#27272f] px-[16px] py-[12px] text-[14px] font-semibold text-white">

                      Quality

                    </div>

                    {/* OPTIONS */}

                    {video.videoUrls
                      .slice()
                      .reverse()
                      .map(
                        (quality: VideoQuality) => (

                          <button
                            key={
                              quality.quality
                            }

                            onClick={() => {

                              handleQualityChange(
                                quality
                              );

                              setShowSettings(
                                false
                              );

                            }}

                            className={`flex w-full items-center justify-between px-[16px] py-[13px] text-left text-[14px] transition hover:bg-[#242430] ${selectedQuality.quality ===
                              quality.quality

                              ? "bg-[#1e1b4b] text-white"

                              : "text-[#d1d5db]"
                              }`}
                          >

                            <span>

                              {quality.quality.replace(
                                ".mp4",
                                ""
                              )}

                            </span>

                            {selectedQuality.quality ===
                              quality.quality && (

                                <span>
                                  ✓
                                </span>

                              )}

                          </button>

                        )
                      )}

                  </div>

                )}

              </div>

            </div>

          </div>





          {/* TITLE */}

          <h1 className="mt-[20px] text-[24px] font-bold leading-[1.4]">

            {video.title}

          </h1>

          {/* CHANNEL + ACTIONS */}

          <div className="mt-[18px] flex flex-col justify-between gap-[20px] lg:flex-row lg:items-center">

            {/* CHANNEL */}

            <div className="flex items-center gap-[15px]">

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

              <button className="cursor-pointer rounded-full bg-white px-[18px] py-[10px] font-semibold text-black transition hover:bg-[#d1d5db]">

                Subscribe

              </button>

            </div>

            {/* ACTIONS */}

            <div className="flex flex-wrap items-center gap-[12px]">

              <button className="flex cursor-pointer items-center gap-[8px] rounded-full bg-[#1a1a24] px-[18px] py-[10px] transition hover:bg-[#242430]">

                <ThumbsUp size={18} />
                24K

              </button>

              <button className="flex cursor-pointer items-center gap-[8px] rounded-full bg-[#1a1a24] px-[18px] py-[10px] transition hover:bg-[#242430]">

                <ThumbsDown size={18} />

              </button>

              <button className="flex cursor-pointer items-center gap-[8px] rounded-full bg-[#1a1a24] px-[18px] py-[10px] transition hover:bg-[#242430]">

                <Share2 size={18} />
                Share

              </button>

              <button className="flex cursor-pointer items-center gap-[8px] rounded-full bg-[#1a1a24] px-[18px] py-[10px] transition hover:bg-[#242430]">

                <Download size={18} />
                Download

              </button>

              <button className="flex cursor-pointer items-center gap-[8px] rounded-full bg-[#1a1a24] px-[14px] py-[10px] transition hover:bg-[#242430]">

                <MoreHorizontal size={18} />

              </button>

            </div>

          </div>

          {/* VIDEO INFO */}

          <div className="mt-[20px] rounded-[20px] bg-[#1a1a24] p-[18px]">

            <div className="flex flex-wrap items-center gap-[10px] text-[14px] font-semibold">

              <span>
                {video.views} views
              </span>

              <span>
                •
              </span>

              <span>

                {formatDistanceToNowStrict(
                  new Date(video.createdAt),
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

        {/* RIGHT SIDEBAR */}

        <div className="hidden w-[380px] xl:block">

          <div className="space-y-[15px]">

            {relatedVideo.map((rv: any) => (

              <Link
                to={`/watch/${rv.id}`}
                key={rv.id}
                className="flex cursor-pointer gap-[12px]"
              >

                <div className="h-[95px] w-[170px] overflow-hidden rounded-[14px] bg-[#1a1a24]">

                  <img
                    src={rv.thumbnailUrl}
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

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}