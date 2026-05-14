import { db } from "../../drizzle/db";
import { videos } from "../../drizzle/schema";
import { desc, eq } from "drizzle-orm";
import StreamyHome from "../components/StreamyHome";

export function meta() {
  return [
    { title: "Streamy | Modern Media Platform" },
    { name: "description", content: "Professional video streaming platform" },
  ];
}

export async function loader() {
  try {
    const VIDEOS = await db.select().from(videos).where(eq(videos.isShort, false)).orderBy(desc(videos.createdAt));
    console.log("Loaded videos:", VIDEOS);
    return { VIDEOS };
  } catch (error) {
    console.error("Loader error:", error);
    return { VIDEOS: [] };
  }
}

export default function Home() {
  return <StreamyHome />;
}