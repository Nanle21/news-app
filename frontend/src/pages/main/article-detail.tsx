import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
	HiOutlineArrowLeft,
	HiOutlineBookmark,
	HiOutlineClock,
	HiOutlineShare,
	HiOutlineExternalLink,
} from "react-icons/hi";
import { Button, Card, LoadingSpinner, TextToSpeech } from "../../components";
import { useBookmarkArticle } from "../../hooks/useArticles";
import { useAppDispatch } from "../../store/hooks";
import { showNotification } from "../../store/slices/uiSlice";
import sanitizeHtml from "../../utils/sanitizeHtml";
import type { Article } from "../../types/news";

export default function ArticleDetail() {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useAppDispatch();

	const [article, setArticle] = useState<Article | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [imageError, setImageError] = useState(false);

	const bookmarkMutation = useBookmarkArticle();

	// Get article from location state (if navigated from within the app)
	useEffect(() => {
		if (location.state?.article) {
			setArticle(location.state.article);
			setIsLoading(false);
		} else if (id) {
			// TODO: Fetch article by ID from API
			// For now, we'll show a placeholder
			setIsLoading(false);
			setArticle(null);
		}
	}, [id, location.state]);

	const handleToggleBookmark = async () => {
		if (!article) return;

		try {
			await bookmarkMutation.mutateAsync({
				articleId: article.id,
				bookmarked: !article.is_bookmarked,
			});

			// Update local state
			setArticle((prev) =>
				prev ? { ...prev, is_bookmarked: !prev.is_bookmarked } : null,
			);

			dispatch(
				showNotification({
					message: article.is_bookmarked
						? "Bookmark removed"
						: "Article bookmarked",
					type: "success",
				}),
			);
		} catch (_error) {
			dispatch(
				showNotification({
					message: "Failed to update bookmark",
					type: "error",
				}),
			);
		}
	};

	const handleShare = () => {
		if (!article) return;

		if (navigator.share) {
			navigator.share({
				title: article.title,
				text: article.content.substring(0, 200),
				url: window.location.href,
			});
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.href);
			dispatch(
				showNotification({
					message: "Link copied to clipboard",
					type: "success",
				}),
			);
		}
	};

	const handleExternalLink = () => {
		if (!article) return;
		window.open(article.url, "_blank");
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<LoadingSpinner size="xl" />
			</div>
		);
	}

	if (!article) {
		return (
			<div className="max-w-4xl mx-auto p-4 lg:p-6">
				<div className="text-center py-12">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
						Article Not Found
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						The article you're looking for doesn't exist or has been removed.
					</p>
					<Button onClick={() => navigate(-1)}>
						<HiOutlineArrowLeft className="mr-2 h-5 w-5" />
						Go Back
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-4 lg:p-6">
			{/* Header with back button */}
			<div className="mb-6">
				<Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
					<HiOutlineArrowLeft className="mr-2 h-5 w-5" />
					{t("common.back")}
				</Button>
			</div>

			<Card className="overflow-hidden">
				{/* Article Image */}
				<div className="relative h-64 lg:h-96 bg-gray-200 dark:bg-gray-700">
					{!imageError && article.image_url ? (
						<img
							src={article.image_url}
							alt={article.title}
							className="w-full h-full object-cover"
							onError={() => setImageError(true)}
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<div className="text-center">
								<HiOutlineShare className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
								<p className="text-gray-500 dark:text-gray-400">
									No image available
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Article Content */}
				<div className="p-6 lg:p-8">
					{/* Category and Source */}
					<div className="flex items-center justify-between mb-4">
						<span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
							{article.category.name}
						</span>
						<span className="text-sm text-gray-500 dark:text-gray-400">
							{article.source.name}
						</span>
					</div>

					{/* Title */}
					<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
						{article.title}
					</h1>

					{/* Meta Information */}
					<div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
						<span className="font-medium">{article.author}</span>
						<div className="flex items-center">
							<HiOutlineClock className="h-4 w-4 mr-2" />
							{formatDate(article.published_at)}
						</div>
					</div>

					{/* Article Content */}
					{/* eslint-disable-next-line react/no-danger */}
					<div
						className="prose prose-lg max-w-none dark:prose-invert mb-8"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
						dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
					/>

					{/* Actions */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
						<div className="flex items-center space-x-3">
							<Button
								onClick={handleToggleBookmark}
								variant={article.is_bookmarked ? "primary" : "secondary"}
								className="flex items-center"
							>
								<HiOutlineBookmark className="mr-2 h-5 w-5" />
								{article.is_bookmarked ? "Bookmarked" : "Bookmark"}
							</Button>

							<TextToSpeech 
								text={article.content} 
								title={article.title}
							/>

							<Button
								onClick={handleShare}
								variant="secondary"
								className="flex items-center"
							>
								<HiOutlineShare className="mr-2 h-5 w-5" />
								Share
							</Button>
						</div>

						<Button
							onClick={handleExternalLink}
							variant="secondary"
							className="flex items-center"
						>
							<HiOutlineExternalLink className="mr-2 h-5 w-5" />
							View Original
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}
