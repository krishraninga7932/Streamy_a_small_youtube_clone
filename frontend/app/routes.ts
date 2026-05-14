import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    route("upload", "routes/upload.tsx"),

    route("watch/:id", "routes/watch.$id.tsx"),

    route("shorts", "routes/shorts.tsx"),
] satisfies RouteConfig; 