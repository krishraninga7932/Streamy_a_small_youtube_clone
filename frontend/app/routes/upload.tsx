import axios from "axios";
import { db } from "../../drizzle/db";
import { videos } from "../../drizzle/schema"
import {
    Link,
    Form,
    useNavigation,
    redirect,
} from "react-router";
import { useState, type ChangeEvent } from "react";
import {
    Upload,
    Image,
    Video,
    Globe,
    Lock,
    X,
} from "lucide-react";




export async function action({ request }: { request: Request }) {
    try {
        const formData = await request.formData()

        // TEXT DATA

        const title =
            formData.get("title") as string;

        const description =
            formData.get("description") as string;

        const category =
            formData.get("category") as string;

        const customCategory =
            formData.get("customCategory") as string;

        const visibility =
            formData.get("visibility") as string;

        // FILES
        const videoFile =
            formData.get("video") as File;

        const thumbnailFile =
            formData.get("thumbnail") as File;



        const uploadFormData = new FormData();

        uploadFormData.append(
            "video",
            videoFile
        );

        uploadFormData.append(
            "thumbnail",
            thumbnailFile
        );




        const res = await axios.post("http://localhost:9000/api/upload-video", uploadFormData)

        // get urls
        const {
            videoUrls,
            thumbnailUrl,
            duration,
        } = res.data;


        // INSERT INTO DB

        await db.insert(videos).values({

            title,

            description,

            category:
                (
                    category === "Other"
                        ? customCategory
                        : category
                ).trim().toLowerCase(),

            videoUrls,

            thumbnailUrl,

            duration: String(duration),

            isPublished:
                visibility === "Public",

        });

        console.log(res.data);

        return redirect("/");



    } catch (error) {
        console.log(error);
        return null
    }
}







export default function UploadPage() {

    const navigation = useNavigation();

    const isSubmitting =
        navigation.state === "submitting";

    const [category, setCategory] = useState<string>("");

    const [videoFile, setVideoFile] = useState<File | null>(null);

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

    const [visibility, setVisibility] = useState<"Public" | "Private">(
        "Public"
    );

    const handleVideoChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setVideoFile(file);
        }
    };

    const handleThumbnailChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setThumbnailFile(file);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f14] px-4 py-10 text-white">

            {
                isSubmitting && (

                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">

                        <div className="w-[380px] rounded-[28px] border border-[#2a2a35] bg-[#111118] p-8 shadow-2xl">

                            {/* SPINNER */}

                            <div className="mb-6 flex justify-center">

                                <div className="flex h-[75px] w-[75px] animate-spin items-center justify-center rounded-full border-4 border-[#6366f1] border-t-transparent">

                                </div>

                            </div>

                            {/* TITLE */}

                            <h2 className="text-center text-2xl font-bold">

                                Uploading Video

                            </h2>

                            {/* SUBTEXT */}

                            <p className="mt-3 text-center text-[#9ca3af]">

                                Please wait while your video is uploading and processing...

                            </p>

                            {/* LOADING DOTS */}

                            <div className="mt-6 flex justify-center gap-2">

                                <div className="h-3 w-3 animate-bounce rounded-full bg-[#6366f1]"></div>

                                <div className="h-3 w-3 animate-bounce rounded-full bg-[#8b5cf6] [animation-delay:0.2s]"></div>

                                <div className="h-3 w-3 animate-bounce rounded-full bg-[#6366f1] [animation-delay:0.4s]"></div>

                            </div>

                        </div>

                    </div>

                )
            }


            <div className="mx-auto max-w-5xl rounded-[28px] border border-[#25252d] bg-[#111118] p-8 shadow-2xl">

                {/* TOP HEADER */}

                <header className="mb-8 flex items-center justify-between border-b border-[#25252d] pb-6">

                    {/* LEFT */}

                    <div className="flex cursor-pointer items-center gap-3">

                        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">

                            <Video size={20} />

                        </div>

                        <div>

                            <h1 className="text-[24px] font-bold">
                                Stream<span className="text-[#8b5cf6]">y</span>
                            </h1>

                            <p className="text-[13px] text-[#9ca3af]">
                                Creator Studio
                            </p>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="flex items-center gap-4">

                        <Link
                            to="/"
                            className="cursor-pointer rounded-[14px] border border-[#27272f] bg-[#16161f] px-5 py-3 text-sm text-[#d1d5db] transition hover:border-[#6366f1]"
                        >

                            Dashboard

                        </Link>

                        <div className="flex h-[45px] w-[45px] cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-lg font-semibold">

                            K

                        </div>

                    </div>

                </header>

                {/* PAGE HEADER */}

                <div className="mb-10">

                    <h1 className="text-4xl font-bold">
                        Upload Video
                    </h1>

                    <p className="mt-3 text-[#9ca3af]">
                        Upload and publish your content on Streamy
                    </p>

                </div>

                {/* FORM */}

                <Form method="post" encType="multipart/form-data" className="grid gap-8 lg:grid-cols-2">

                    {/* LEFT SIDE */}

                    <div className="space-y-7">

                        {/* TITLE */}

                        <div>

                            <label className="mb-3 block text-sm font-medium text-[#d1d5db]">
                                Video Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                placeholder="Enter video title"
                                className="h-[55px] w-full rounded-[16px] border border-[#27272f] bg-[#16161f] px-5 text-white outline-none transition focus:border-[#6366f1]"
                            />

                        </div>

                        {/* DESCRIPTION */}

                        <div>

                            <label className="mb-3 block text-sm font-medium text-[#d1d5db]">
                                Description
                            </label>

                            <textarea
                                rows={7}
                                name="description"
                                placeholder="Write video description"
                                className="w-full resize-none rounded-[16px] border border-[#27272f] bg-[#16161f] px-5 py-4 text-white outline-none transition focus:border-[#6366f1]"
                            />

                        </div>

                        {/* CATEGORY */}

                        <div>

                            <label className="mb-3 block text-sm font-medium text-[#d1d5db]">
                                Category
                            </label>

                            <select
                                value={category}
                                name="category"
                                onChange={(e) => setCategory(e.target.value)}
                                className="h-[55px] w-full cursor-pointer rounded-[16px] border border-[#27272f] bg-[#16161f] px-5 text-white outline-none transition focus:border-[#6366f1]"
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="Programming">
                                    Programming
                                </option>

                                <option value="Gaming">
                                    Gaming
                                </option>

                                <option value="Music">
                                    Music
                                </option>

                                <option value="Technology">
                                    Technology
                                </option>

                                <option value="Education">
                                    Education
                                </option>

                                <option value="News">
                                    News
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>

                        {/* CUSTOM CATEGORY */}

                        {category === "Other" && (

                            <div>

                                <label className="mb-3 block text-sm font-medium text-[#d1d5db]">
                                    Custom Category
                                </label>

                                <input
                                    type="text"
                                    name="customCategory"
                                    placeholder="Enter custom category"
                                    className="h-[55px] w-full rounded-[16px] border border-[#27272f] bg-[#16161f] px-5 text-white outline-none transition focus:border-[#6366f1]"
                                />

                            </div>

                        )}

                        {/* VISIBILITY */}

                        <div>

                            <label className="mb-3 block text-sm font-medium text-[#d1d5db]">
                                Visibility
                            </label>

                            <div className="flex gap-4">

                                {/* PUBLIC */}

                                <button
                                    type="button"
                                    onClick={() => setVisibility("Public")}
                                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[16px] border px-5 py-4 transition ${visibility === "Public"
                                        ? "border-[#6366f1] bg-[#1e1b4b] text-white"
                                        : "border-[#27272f] bg-[#16161f] text-white hover:border-[#6366f1]"
                                        }`}
                                >

                                    <Globe size={18} />

                                    Public

                                </button>

                                {/* PRIVATE */}

                                <button
                                    type="button"
                                    onClick={() => setVisibility("Private")}
                                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[16px] border px-5 py-4 transition ${visibility === "Private"
                                        ? "border-[#6366f1] bg-[#1e1b4b] text-white"
                                        : "border-[#27272f] bg-[#16161f] text-white hover:border-[#6366f1]"
                                        }`}
                                >

                                    <Lock size={18} />

                                    Private

                                </button>
                                <input
                                    type="hidden"
                                    name="visibility"
                                    value={visibility}
                                />

                            </div>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="space-y-7">

                        {/* VIDEO */}

                        <div>

                            <label className="mb-3 block text-sm font-medium text-[#d1d5db]">
                                Upload Video
                            </label>

                            <label className="flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#27272f] bg-[#16161f] p-6 transition hover:border-[#6366f1]">

                                {!videoFile ? (

                                    <>

                                        <Video size={45} className="mb-4 text-[#6366f1]" />

                                        <h3 className="text-lg font-semibold">
                                            Choose Video File
                                        </h3>

                                        <p className="mt-2 text-sm text-[#9ca3af]">
                                            MP4, MOV, WEBM supported
                                        </p>

                                    </>

                                ) : (

                                    <div className="relative w-full">

                                        <video
                                            controls
                                            className="h-[250px] w-full rounded-[18px] object-cover"
                                        >

                                            <source
                                                src={URL.createObjectURL(videoFile)}
                                            />

                                        </video>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setVideoFile(null);
                                            }}
                                            className="absolute right-3 top-3 flex h-[35px] w-[35px] items-center justify-center rounded-full bg-black/70 text-white"
                                        >

                                            <X size={18} />

                                        </button>

                                    </div>

                                )}

                                <input
                                    type="file"
                                    name="video"
                                    accept="video/*"
                                    hidden
                                    onChange={handleVideoChange}
                                />

                            </label>

                        </div>

                        {/* THUMBNAIL */}

                        <div>

                            <label className="mb-3 block text-sm font-medium text-[#d1d5db]">
                                Thumbnail
                            </label>

                            <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#27272f] bg-[#16161f] p-6 transition hover:border-[#6366f1]">

                                {!thumbnailFile ? (

                                    <>

                                        <Image size={40} className="mb-4 text-[#6366f1]" />

                                        <h3 className="text-lg font-semibold">
                                            Upload Thumbnail
                                        </h3>

                                        <p className="mt-2 text-sm text-[#9ca3af]">
                                            JPG, PNG, WEBP supported
                                        </p>

                                    </>

                                ) : (

                                    <div className="relative w-full">

                                        <img
                                            src={URL.createObjectURL(thumbnailFile)}
                                            alt="thumbnail"
                                            className="h-[220px] w-full rounded-[18px] object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setThumbnailFile(null);
                                            }}
                                            className="absolute right-3 top-3 flex h-[35px] w-[35px] items-center justify-center rounded-full bg-black/70 text-white"
                                        >

                                            <X size={18} />

                                        </button>

                                    </div>

                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    name="thumbnail"
                                    onChange={handleThumbnailChange}
                                />

                            </label>

                        </div>

                        {/* BUTTON */}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex h-[58px] w-full cursor-pointer items-center justify-center gap-3 rounded-[18px] bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-lg font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {isSubmitting ? (

                                "Uploading..."

                            ) : (

                                <>
                                    <Upload size={20} />
                                    Upload Video
                                </>

                            )}

                        </button>

                    </div>

                </Form>

            </div>

        </div >
    );
}