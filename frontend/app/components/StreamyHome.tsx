import { formatDistanceToNowStrict } from "date-fns";
import { Link, useLoaderData, NavLink } from "react-router";
import { useState } from "react";
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
  CheckCircle2,
  MoreVertical,
  User,
} from "lucide-react";

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

const CATEGORIES = [
  "All",
  "Programming",
  "Gaming",
  "Music",
  "News",
  "Live",
];




export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const data = useLoaderData() as { VIDEOS: any[] } | undefined;
  const VIDEOS = data?.VIDEOS ?? [];

  const filteredVideos =
    submittedSearch
      ? VIDEOS.filter((video: any) =>
        video.title
          .toLowerCase()
          .includes(
            submittedSearch.toLowerCase()
          )
      )
      : VIDEOS;



  return (
    <div className="h-screen overflow-hidden bg-[#0f0f14] text-white">

      {/* HEADER */}

      <header className="fixed top-0 left-0 right-0 z-50 flex h-[65px] items-center justify-between border-b border-[#1f1f2a] bg-[#0f0f14] px-[20px]">

        {/* LEFT */}

        <div className="flex items-center gap-[15px]">

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-[#1a1a24] hover:text-white"
          >
            <Menu size={20} />
          </button>

          <div className="flex cursor-pointer items-center gap-[10px]">

            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
              <Clapperboard size={18} />
            </div>

            <h1 className="text-[22px] font-bold">
              Stream<span className="text-[#8b5cf6]">y</span>
            </h1>

          </div>

        </div>

        {/* SEARCH */}

        <div className="mx-[30px] hidden max-w-[650px] flex-1 md:flex">

          <input
            type="text"
            placeholder="Search videos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-[42px] flex-1 rounded-l-full border border-[#27272f] bg-[#16161f] px-[18px] text-white outline-none"
          />

          <button
            onClick={() =>
              setSubmittedSearch(searchQuery)
            }
            className="flex w-[60px] cursor-pointer items-center justify-center rounded-r-full bg-[#1d1d28] text-[#9ca3af]">
            <Search size={18} />
          </button>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-[10px]">

          <Link to="/upload" className="flex cursor-pointer items-center gap-[8px] rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-[18px] py-[10px] font-medium text-white">
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

      {/* MAIN LAYOUT */}

      <div className="flex h-full pt-[65px]">

        {/* SIDEBAR */}

        {/* SIDEBAR */}

        <aside
          className={`overflow-hidden border-r border-[#1f1f2a] bg-[#0f0f14] transition-all duration-300 ${sidebarOpen
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

            {SIDEBAR_LINKS.map((item, index) => {

              if ("divider" in item) {

                return (
                  <hr
                    key={index}
                    className="my-[15px] border-[#1f1f2a]"
                  />
                );

              }

              const Icon = item.icon!;

              return (

                <NavLink

                  to={item.path || "/"}

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

            })}

          </div>

        </aside>

        {/* CONTENT */}

        <main className="flex-1 overflow-y-auto">

          {/* CATEGORIES */}

          <div className="sticky top-0 z-40 flex gap-[10px] overflow-x-auto border-b border-[#1f1f2a] bg-[#0f0f14] px-[20px] py-[15px]">

            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`cursor-pointer whitespace-nowrap rounded-[12px] px-[18px] py-[10px] text-sm transition ${activeCategory === category
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#1a1a24] text-[#9ca3af] hover:bg-[#242430] hover:text-white"
                  }`}
              >
                {category}
              </button>
            ))}

          </div>

          {/* VIDEO GRID */}

          <div className="grid grid-cols-1 gap-[25px] p-[25px] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

            {filteredVideos.map((video: any) => (

              <Link
                to={`/watch/${video.id}`}
                key={video.id}
                className="cursor-pointer transition duration-300 hover:-translate-y-[5px]"
              >

                {/* THUMBNAIL */}

                <div className="relative h-[220px] overflow-hidden rounded-[18px]">

                  <img
                    src={video.thumbnailUrl || ""}
                    alt={video.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-[1.05]"
                  />

                  <div className="absolute bottom-[10px] right-[10px] rounded-[6px] bg-black/80 px-[8px] py-[4px] text-[12px] font-semibold">
                    {video.duration}
                  </div>

                </div>

                {/* META */}

                <div className="mt-[12px] flex gap-[12px]">

                  <div className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] font-semibold">
                    {/* {video.channel.charAt(0)} */}
                    S
                  </div>

                  <div className="flex-1">

                    <h2 className="mb-[5px] line-clamp-2 text-[15px] font-semibold leading-[1.4]">
                      {video.title}
                    </h2>

                    <div className="mb-[3px] flex items-center gap-[5px] text-[14px] text-[#9ca3af]">

                      <span>Streamy</span>

                      <CheckCircle2 size={13} />

                    </div>
                    <p className="text-[13px] text-[#6b7280]">
                      {video.views} Views • {" "}

                      {formatDistanceToNowStrict(
                        new Date(video.createdAt),
                      )}
                    </p>

                  </div>

                  <button className="cursor-pointer text-[#9ca3af]">
                    <MoreVertical size={18} />
                  </button>

                </div>

              </Link>

            ))}

          </div>

        </main>

      </div>

    </div>
  );
}