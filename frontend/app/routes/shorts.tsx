import { db } from "../../drizzle/db";
import { videos } from "../../drizzle/schema";

import {
    eq,
    desc,
} from "drizzle-orm";

import {
    useLoaderData,
    NavLink,
    Link,
} from "react-router";

import {
    useState,
} from "react";

import {
    Menu,
    Search,
    Video,
    Bell,
    Home as HomeIcon,
    Clapperboard,
    PlaySquare,
    History,
    TrendingUp,
    Music2,
    Gamepad2,
    Upload,
    User,
    ThumbsUp,
    MessageCircle,
    Share2,
    MoreHorizontal,
} from "lucide-react";



export async function loader() {

    const shorts =
        await db
            .select()
            .from(videos)

            .where(

                eq(
                    videos.isShort,
                    true
                )

            )

            .orderBy(

                desc(
                    videos.createdAt
                )

            );

    return {
        shorts,
    };

}



const SIDEBAR_LINKS = [

    {
        icon: HomeIcon,
        label: "Home",
        path: "/",
    },

    {
        icon: Clapperboard,
        label: "Shorts",
        path: "/shorts",
    },

    {
        icon: PlaySquare,
        label: "Subscriptions",
        path: "/subscriptions",
    },

    { divider: true },

    {
        icon: History,
        label: "History",
        path: "/history",
    },

    {
        icon: Video,
        label: "Your videos",
        path: "/your-videos",
    },

    { divider: true },

    {
        icon: TrendingUp,
        label: "Trending",
        path: "/trending",
    },

    {
        icon: Gamepad2,
        label: "Gaming",
        path: "/gaming",
    },

    {
        icon: Music2,
        label: "Music",
        path: "/music",
    },

];



export default function Shorts() {

    const {
        shorts,
    } = useLoaderData() as any;

    const [sidebarOpen,
        setSidebarOpen] =
        useState(true);



    return (

        <div className="h-screen overflow-hidden bg-[#0f0f14] text-white">

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

                    <Link
                        to="/upload"
                        className="flex cursor-pointer items-center gap-[8px] rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-[18px] py-[10px] font-medium text-white"
                    >

                        <Upload size={16} />

                        Upload

                    </Link>

                    <button className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-[#1a1a24] hover:text-white">

                        <Bell size={19} />

                    </button>

                    <button className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-[#1a1a24] hover:text-white">

                        <User size={19} />

                    </button>

                </div>

            </header>



            {/* MAIN */}

            <div className="flex h-full pt-[65px]">

                {/* SIDEBAR */}

                <aside
                    className={`fixed
                    left-0
                    top-[65px]
                    z-40
                    h-[calc(100vh-65px)]

                    overflow-hidden

                    border-r
                    border-[#1f1f2a]

                    bg-[#0f0f14]/95
                    backdrop-blur-md

                    transition-all
                    duration-300 
                    ${sidebarOpen

                            ? "w-[240px] p-[15px_10px]"

                            : "w-0 p-0"
                        }`}
                >

                    <div
                        className={`${sidebarOpen

                                ? "opacity-100"

                                : "opacity-0"

                            } transition-opacity duration-300`}
                    >

                        {SIDEBAR_LINKS.map(
                            (item, index) => {

                                if ("divider" in item) {

                                    return (

                                        <hr
                                            key={index}
                                            className="my-[15px] border-[#1f1f2a]"
                                        />

                                    );

                                }

                                const Icon =
                                    item.icon!;

                                return (

                                    <NavLink

                                        to={item.path}

                                        key={index}

                                        className={({ isActive }) => `

                      mb-[5px]
                      flex
                      cursor-pointer
                      items-center
                      gap-[14px]
                      rounded-[12px]
                      px-[15px]
                      py-[12px]
                      transition

                      ${isActive

                                                ? "bg-[#1e1b4b] text-white"

                                                : "text-[#9ca3af] hover:bg-[#1a1a24] hover:text-white"
                                            }

                    `}
                                    >

                                        <Icon size={18} />

                                        <span>
                                            {item.label}
                                        </span>

                                    </NavLink>

                                );

                            }
                        )}

                    </div>

                </aside>



                {/* SHORTS FEED */}

                <div className="flex-1 snap-y snap-mandatory overflow-y-scroll hide-scrollbar bg-black">

                    {shorts.map(
                        (short: any) => (

                            <div
                                key={short.id}
                                className="flex h-screen snap-start items-center justify-center px-6"
                            >

                                {/* SHORTS FRAME */}

                                <div className="relative h-[92vh] w-[370px] overflow-hidden rounded-[28px] bg-[#111] shadow-[0_0_40px_rgba(0,0,0,0.7)]">

                                    {/* VIDEO */}

                                    <video

                                        src={
                                            short.videoUrls?.[
                                                short.videoUrls.length - 1
                                            ]?.url
                                        }

                                        autoPlay
                                        loop
                                        controls

                                        className="h-full w-full object-cover"

                                    />

                                    {/* OVERLAY */}

                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />

                                    {/* VIDEO INFO */}

                                    <div className="absolute bottom-5 left-4 right-[75px] z-20">

                                        {/* CHANNEL */}

                                        <div className="mb-4 flex items-center gap-3">

                                            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] font-bold">

                                                S

                                            </div>

                                            <div className="flex items-center gap-3">

                                                <h3 className="font-semibold">

                                                    @streamy

                                                </h3>

                                                <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">

                                                    Subscribe

                                                </button>

                                            </div>

                                        </div>

                                        {/* TITLE */}

                                        <p className="line-clamp-3 text-sm leading-[1.6] text-[#f1f1f1]">

                                            {short.title}

                                        </p>

                                    </div>

                                    {/* RIGHT ACTIONS */}

                                    <div className="absolute bottom-6 right-3 z-20 flex flex-col items-center gap-5">

                                        {/* LIKE */}

                                        <button className="flex flex-col items-center gap-1">

                                            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-black/40 backdrop-blur-md">

                                                <ThumbsUp size={24} />

                                            </div>

                                            <span className="text-xs text-white">

                                                24K

                                            </span>

                                        </button>

                                        {/* COMMENTS */}

                                        <button className="flex flex-col items-center gap-1">

                                            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-black/40 backdrop-blur-md">

                                                <MessageCircle size={24} />

                                            </div>

                                            <span className="text-xs text-white">

                                                1.2K

                                            </span>

                                        </button>

                                        {/* SHARE */}

                                        <button className="flex flex-col items-center gap-1">

                                            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-black/40 backdrop-blur-md">

                                                <Share2 size={24} />

                                            </div>

                                            <span className="text-xs text-white">

                                                Share

                                            </span>

                                        </button>

                                        {/* MORE */}

                                        <button className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-black/40 backdrop-blur-md">

                                            <MoreHorizontal size={24} />

                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>

            </div>

        </div>

    );

}