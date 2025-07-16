import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
	HiOutlineBookmark,
	HiOutlineClock,
	HiOutlineCollection,
	HiOutlineLogout,
	HiOutlineNewspaper,
} from "react-icons/hi";
import { Button, Card, Header, TopBar, SafeHtml } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import {
	useArticles,
	useFeed,
	useBookmarks,
	useUserPreferences,
	useDashboardStats,
} from "../../hooks/useArticles";
import { useDataSources } from "../../hooks/useDataSources";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { showNotification } from "../../store/slices/uiSlice";
import { useState, useEffect } from "react";
import type { Article } from "../../types/news";

export default function Dashboard() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { logout, resendVerificationEmail } = useAuth();
	const user = useAppSelector((state) => state.auth.user);

	// Dashboard stats query
	const { data: dashboardStats, isLoading: dashboardStatsLoading } = useDashboardStats();
	const { data: bookmarksData, isLoading: bookmarksLoading } = useBookmarks({
		per_page: 1,
	});
	const { data: dataSourcesResponse, isLoading: dataSourcesLoading } =
		useDataSources();
	const { data: preferencesData } = useUserPreferences();

	// Recent news query - use personalized feed with user preferences
	const { data: recentArticlesData, isLoading: recentArticlesLoading } =
		useFeed({
			per_page: 5,
		});

	// For resend verification
	const [resendLoading, setResendLoading] = useState(false);
	const [resendCooldown, setResendCooldown] = useState(0);
	const [verificationSent, setVerificationSent] = useState(false);

	// Countdown timer effect
	useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setTimeout(() => {
				setResendCooldown(resendCooldown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [resendCooldown]);

	const handleLogout = async () => {
		try {
			await logout();
			// Navigation will be handled automatically by the auth system
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const handleResendVerification = async () => {
		if (resendCooldown > 0) return;

		setResendLoading(true);
		try {
			await resendVerificationEmail();
			setVerificationSent(true);
			setResendCooldown(60); // 60 second cooldown
			dispatch(
				showNotification({
					message: t("auth.verificationSent"),
					type: "success",
				}),
			);
		} catch (_error) {
			dispatch(
				showNotification({
					message: t("auth.verificationFailed"),
					type: "error",
				}),
			);
		} finally {
			setResendLoading(false);
		}
	};

	const getResendButtonText = () => {
		if (resendCooldown > 0) {
			return t("auth.resendIn", { seconds: resendCooldown });
		}
		if (verificationSent && resendCooldown === 0) {
			return t("auth.resendVerification");
		}
		return t("auth.resendVerification");
	};

	const isResendDisabled = resendLoading || resendCooldown > 0;

	const handleReadMore = (article: Article) => {
		navigate(`/article/${article.id}`, {
			state: { article },
		});
	};

	return (
		<>
			{/* Top navigation */}
			<TopBar>
				<Button variant="ghost" onClick={handleLogout}>
					<HiOutlineLogout className="mr-2 h-5 w-5" />
					{t("common.logout")}
				</Button>
			</TopBar>

			{/* Page content */}
			<div className="max-w-7xl mx-auto">
				{/* Personalized greeting */}
				<div className="mb-6">
					<h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
						{t("dashboard.greeting", { name: user?.name || "" })}
					</h2>
				</div>

				{/* Email verification warning */}
				{user && !user.email_verified_at && (
					<div className="mb-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
						<div className="flex items-center">
							<HiOutlineClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0" />
							<span className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">
								{t("auth.emailNotVerified")}
							</span>
						</div>
						<Button
							variant="secondary"
							onClick={handleResendVerification}
							loading={resendLoading}
							disabled={isResendDisabled}
							className="w-full sm:w-auto"
						>
							{getResendButtonText()}
						</Button>
					</div>
				)}

				<Header
					title={t("dashboard.title")}
					description={t("dashboard.description")}
				/>

				{/* Stats cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
					<Card>
						<div className="flex items-center">
							<div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
								<HiOutlineNewspaper className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
							<div className="ml-4 min-w-0">
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									{t("dashboard.totalArticles")}
								</p>
								<p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
									{dashboardStatsLoading
										? "..."
										: (dashboardStats?.stats?.total_articles ?? 0)}
								</p>
							</div>
						</div>
					</Card>

					<Card>
						<div className="flex items-center">
							<div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
								<HiOutlineBookmark className="h-6 w-6 text-green-600 dark:text-green-400" />
							</div>
							<div className="ml-4 min-w-0">
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									{t("dashboard.bookmarks")}
								</p>
								<p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
									{dashboardStatsLoading ? "..." : (dashboardStats?.stats?.total_bookmarks ?? 0)}
								</p>
							</div>
						</div>
					</Card>

					<Card>
						<div className="flex items-center">
							<div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
								<HiOutlineCollection className="h-6 w-6 text-purple-600 dark:text-purple-400" />
							</div>
							<div className="ml-4 min-w-0">
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									{t("dashboard.sources")}
								</p>
								<p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
									{dashboardStatsLoading
										? "..."
										: (dashboardStats?.stats?.total_sources ?? 0)}
								</p>
							</div>
						</div>
					</Card>

					<Card>
						<div className="flex items-center">
							<div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex-shrink-0">
								<HiOutlineClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
							</div>
							<div className="ml-4 min-w-0">
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									{t("dashboard.todaysNews")}
								</p>
								<p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
									{dashboardStatsLoading
										? "..."
										: (dashboardStats?.stats?.todays_articles ?? 0)}
								</p>
							</div>
						</div>
					</Card>
				</div>

				{/* Recent news */}
				<Card className="p-0">
					<div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-medium text-gray-900 dark:text-white">
								{t("dashboard.recentNews")}
							</h2>
							{preferencesData?.preferences && (
								<span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
									{t("dashboard.personalizedFeed")}
								</span>
							)}
						</div>
					</div>
					<div className="p-4 lg:p-6">
						{recentArticlesLoading ? (
							<div className="text-center text-gray-500 dark:text-gray-400">
								{t("common.loading")}
							</div>
						) : recentArticlesData?.data?.length ? (
							<div className="space-y-4">
								{recentArticlesData.data.slice(0, 3).map((article) => (
									<div
										key={article.id}
										className="flex items-start space-x-3 lg:space-x-4"
									>
										<div className="flex-shrink-0">
											{article.image_url ? (
												<img
													src={article.image_url}
													alt={article.title}
													className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-lg"
												/>
											) : (
												<div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
											)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
												{article.title}
											</p>
											<SafeHtml
												html={article.content}
												className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mt-1"
												maxLength={200}
											/>
											<div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-gray-500 dark:text-gray-400">
												<span>{article.category.name}</span>
												<span className="hidden sm:inline">•</span>
												<span>
													{new Date(article.published_at).toLocaleString()}
												</span>
												<Button
													className="text-blue-600 hover:text-blue-500 dark:text-blue-400 bg-transparent border-0 p-0 h-auto text-xs self-start sm:self-auto"
													onClick={() => handleReadMore(article)}
												>
													{t("dashboard.readMore")}
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center text-gray-500 dark:text-gray-400">
								{t("news.noResults")}
							</div>
						)}
					</div>
				</Card>
			</div>
		</>
	);
}
