import { lazy } from "react";
import type { ReactNode } from "react";

// Lazy load pages
const Login = lazy(() => import("../pages/auth/login"));
const Register = lazy(() => import("../pages/auth/register"));
const Dashboard = lazy(() => import("../pages/main/dashboard"));
const News = lazy(() => import("../pages/main/news"));
const Sources = lazy(() => import("../pages/main/sources"));
const Bookmarks = lazy(() => import("../pages/main/bookmarks"));
const Settings = lazy(() => import("../pages/main/settings"));
const ArticleDetail = lazy(() => import("../pages/main/article-detail"));
const Landing = lazy(() => import("../pages/landing"));

interface RouteConfig {
	path: string;
	element: ReactNode;
	requiresAuth?: boolean;
}

const routes: RouteConfig[] = [
	{
		path: "/",
		element: <Landing />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/register",
		element: <Register />,
	},
	{
		path: "/dashboard",
		element: <Dashboard />,
		requiresAuth: true,
	},
	{
		path: "/news",
		element: <News />,
		requiresAuth: true,
	},
	{
		path: "/sources",
		element: <Sources />,
		requiresAuth: true,
	},
	{
		path: "/bookmarks",
		element: <Bookmarks />,
		requiresAuth: true,
	},
	{
		path: "/settings",
		element: <Settings />,
		requiresAuth: true,
	},
	{
		path: "/article/:id",
		element: <ArticleDetail />,
		requiresAuth: true,
	},
];

export default routes;
