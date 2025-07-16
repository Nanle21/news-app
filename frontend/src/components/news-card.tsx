import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
	HiOutlineBookmark,
	HiOutlineClock,
	HiOutlineNewspaper,
	HiOutlineShare,
} from "react-icons/hi";
import type { Article } from "../types/news";
import { Button, Card, SafeHtml, TextToSpeech } from "./index";
import { useUserPreferences } from "../hooks/useUserPreferences";

interface NewsCardProps {
	article: Article;
	onToggleBookmark: (articleId: number) => void;
}

export default function NewsCard({ article, onToggleBookmark }: NewsCardProps) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [imageError, setImageError] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);

	// Use user preferences
	const { getFontSize, getShowSummaries } = useUserPreferences();
	const fontSize = getFontSize();
	const showSummaries = getShowSummaries();

	// Apply font size preference
	const getFontSizeClass = () => {
		switch (fontSize) {
			case "small":
				return "text-sm";
			case "large":
				return "text-lg";
			default:
				return "text-base";
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60),
		);

		if (diffInHours < 1) return "Just now";
		if (diffInHours < 24) return `${diffInHours} hours ago`;
		if (diffInHours < 48) return "Yesterday";
		return date.toLocaleDateString();
	};

	const handleShare = () => {
		// TODO: Implement share functionality
		navigator.share?.({
			title: article.title,
			text: `${article.content.substring(0, 200)}...`,
			url: article.url,
		});
	};

	const handleImageError = () => {
		setImageError(true);
	};

	const handleReadMore = () => {
		navigate(`/article/${article.id}`, {
			state: { article },
		});
	};

	return (
		<Card className="overflow-hidden hover:shadow-lg transition-shadow">
			{/* Article Image */}
			<div className="relative h-48 bg-gray-200 dark:bg-gray-700">
				{!imageError && article.image_url ? (
					<img
						src={article.image_url}
						alt={article.title}
						className="w-full h-full object-cover"
						onError={handleImageError}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<div className="text-center">
							<HiOutlineNewspaper className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
							<p className="text-xs text-gray-500 dark:text-gray-400">
								No image available
							</p>
						</div>
					</div>
				)}
				<button
					type="button"
					onClick={() => onToggleBookmark(article.id)}
					className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
						article.is_bookmarked
							? "bg-blue-600 text-white"
							: "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
					}`}
				>
					<HiOutlineBookmark className="h-5 w-5" />
				</button>
			</div>

			{/* Article Content */}
			<div className="p-6">
				{/* Category and Source */}
				<div className="flex items-center justify-between mb-3">
					<span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
						{article.category.name}
					</span>
					<span className="text-sm text-gray-500 dark:text-gray-400">
						{article.source.name}
					</span>
				</div>

				{/* Title - Apply font size preference */}
				<h3
					className={`font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 ${getFontSizeClass()}`}
				>
					{article.title}
				</h3>

				{/* Content - Show full content or truncated based on user preference */}
				{showSummaries && (
					<div className="text-gray-600 dark:text-gray-300 mb-4">
						<SafeHtml
							html={article.content}
							className={`${isExpanded ? "" : "line-clamp-4"}`}
							maxLength={isExpanded ? undefined : 300}
						/>
						{article.content.length > 300 && (
							<button
								type="button"
								onClick={() => setIsExpanded(!isExpanded)}
								className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium mt-2"
							>
								{isExpanded ? "Show Less" : "Read More"}
							</button>
						)}
					</div>
				)}

				{/* Meta Information */}
				<div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
					<span>{article.author}</span>
					<div className="flex items-center">
						<HiOutlineClock className="h-4 w-4 mr-1" />
						{formatDate(article.published_at)}
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-between">
					<Button onClick={handleReadMore} className="flex-1 mr-2">
						{t("news.readMore")}
					</Button>
					<div className="flex items-center space-x-2">
						<TextToSpeech text={article.content} className="mr-2" />
						<button
							type="button"
							onClick={handleShare}
							className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						>
							<HiOutlineShare className="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>
		</Card>
	);
}
