"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Heart, MessageCircle, Share2, Zap, Trophy, Users, Clock, Send, Plus, X, ChevronDown, ChevronUp } from "lucide-react";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  content: string;
  timestamp: string;
}

interface FeedPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
    level: "Beginner" | "Intermediate" | "Advanced" | "Pro";
  };
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  commentsData?: Comment[];
  type: "match" | "achievement" | "tournament" | "court";
  groupLink?: string;
  metadata?: {
    court?: string;
    score?: string;
    opponent?: string;
    rating?: number;
  };
  liked?: boolean;
}

const samplePosts: FeedPost[] = [
  {
    id: "group-1",
    author: {
      name: "Manila Pro Players",
      avatar: "M",
      handle: "@manila_pro_players",
      level: "Advanced",
    },
    timestamp: "Just now",
    content: "🌟 JOIN OUR GROUP 🌟\n\nManila Pro Players Group\n\nWe are a dedicated group of competitive pickleball players based in Manila! Whether you're a beginner looking to improve or an advanced player seeking challenging matches, we welcome everyone!\n\n🏆 What we offer:\n• Regular weekly matches and tournaments\n• Professional coaching sessions\n• Social events and networking\n• Group discounts at courts\n• Skill development programs\n\nClick the button below to join and start playing today!",
    image: "https://images.unsplash.com/photo-1552674605-5defe6aa44bb?w=800&h=500&fit=crop",
    type: "tournament",
    groupLink: "/groups/manila-pro-players",
    likes: 234,
    comments: 42,
    commentsData: [
      {
        id: "cg1",
        author: { name: "Maria Santos", avatar: "M", handle: "@mariasantos" },
        content: "Just joined! Looking forward to playing with you all!",
        timestamp: "5 mins ago",
      },
      {
        id: "cg2",
        author: { name: "Carlo Mendez", avatar: "C", handle: "@carlomendez" },
        content: "Great group! Very welcoming and organized.",
        timestamp: "10 mins ago",
      },
    ],
    metadata: {
      rating: 4.9,
    },
    liked: false,
  },
  {
    id: "0",
    author: {
      name: "PicklePlay Community",
      avatar: "P",
      handle: "@pickleplay",
      level: "Pro",
    },
    timestamp: "1 hour ago",
    content: "🎾 Join Our PicklePlay Community Group! 🎾\n\nConnect with pickleball enthusiasts, share tips, find playing partners, and grow together! Our community is all about building friendships through the sport we love.\n\n✨ Benefits of joining:\n• Find teammates and opponents\n• Share match highlights and victories\n• Get coaching tips and advice\n• Participate in community tournaments\n• Make new friends who love pickleball\n\nDon't miss out! Join now and be part of something special! 🚀",
    image: "https://images.unsplash.com/photo-1552674605-5defe6aa44bb?w=800&h=500&fit=crop",
    type: "tournament",
    likes: 523,
    comments: 89,
    commentsData: [
      {
        id: "c0",
        author: { name: "Alex Rivera", avatar: "A", handle: "@alexrivera" },
        content: "This community is amazing! Joined yesterday and already made 3 new friends! 🔥",
        timestamp: "30 mins ago",
      },
      {
        id: "c00",
        author: { name: "Lisa Wong", avatar: "L", handle: "@lisawong" },
        content: "Best decision ever! The support and energy here is incredible!",
        timestamp: "45 mins ago",
      },
    ],
    metadata: {
      rating: 5.0,
    },
    liked: false,
  },
  {
    id: "1",
    author: {
      name: "Alex Rivera",
      avatar: "A",
      handle: "@alexrivera",
      level: "Pro",
    },
    timestamp: "2 hours ago",
    content: "Just won the Manila Regional Tournament! Amazing competition and great players. Grateful for my amazing team! 🎾🔥",
    image: "https://images.unsplash.com/photo-1554224311-beee415c15b7?w=800&h=500&fit=crop",
    type: "achievement",
    likes: 342,
    comments: 28,
    commentsData: [
      {
        id: "c1",
        author: { name: "Maria Santos", avatar: "M", handle: "@mariasantos" },
        content: "Congrats Alex! That's amazing! 🎉",
        timestamp: "2 hours ago",
      },
      {
        id: "c2",
        author: { name: "Carlo Mendez", avatar: "C", handle: "@carlomendez" },
        content: "Great match! You deserved it!",
        timestamp: "1 hour ago",
      },
    ],
    metadata: {
      court: "Manila Bay Courts",
      rating: 4.8,
    },
    liked: false,
  },
  {
    id: "2",
    author: {
      name: "Maria Santos",
      avatar: "M",
      handle: "@mariasantos",
      level: "Advanced",
    },
    timestamp: "4 hours ago",
    content: "New personal record! 3 consecutive match wins today. Who's ready for a challenge? 💪",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=500&fit=crop",
    type: "match",
    likes: 156,
    comments: 12,
    commentsData: [
      {
        id: "c3",
        author: { name: "Lisa Wong", avatar: "L", handle: "@lisawong" },
        content: "Impressive! Let's play next weekend!",
        timestamp: "3 hours ago",
      },
    ],
    metadata: {
      score: "11-6, 11-8",
      opponent: "Jessica Cruz",
    },
    liked: false,
  },
  {
    id: "3",
    author: {
      name: "Carlo Mendez",
      avatar: "C",
      handle: "@carlomendez",
      level: "Intermediate",
    },
    timestamp: "6 hours ago",
    content: "Just booked the Makati Pickleball Hub for this weekend! Anyone want to join for some friendly games?",
    image: "https://images.unsplash.com/photo-1542483139897-ba06803ff33f?w=800&h=500&fit=crop",
    type: "court",
    likes: 89,
    comments: 15,
    commentsData: [
      {
        id: "c4",
        author: { name: "James Park", avatar: "J", handle: "@jamespark" },
        content: "I'm in! What time? 🎾",
        timestamp: "5 hours ago",
      },
      {
        id: "c5",
        author: { name: "Alex Rivera", avatar: "A", handle: "@alexrivera" },
        content: "Count me in too!",
        timestamp: "4 hours ago",
      },
    ],
    metadata: {
      court: "Makati Pickleball Hub",
    },
    liked: false,
  },
  {
    id: "4",
    author: {
      name: "Lisa Wong",
      avatar: "L",
      handle: "@lisawong",
      level: "Advanced",
    },
    timestamp: "1 day ago",
    content: "Achieved Level 5 status! Thanks to all my teammates and the amazing PicklePlay community. Let's keep growing! 🚀",
    image: "https://images.unsplash.com/photo-1578926314433-dbb4e2930901?w=800&h=500&fit=crop",
    type: "achievement",
    likes: 234,
    comments: 45,
    commentsData: [
      {
        id: "c6",
        author: { name: "Alex Rivera", avatar: "A", handle: "@alexrivera" },
        content: "You rock Lisa! Well deserved!",
        timestamp: "1 day ago",
      },
    ],
    metadata: {
      rating: 4.9,
    },
    liked: false,
  },
  {
    id: "5",
    author: {
      name: "James Park",
      avatar: "J",
      handle: "@jamespark",
      level: "Beginner",
    },
    timestamp: "1 day ago",
    content: "Started my pickleball journey today at BGC Active Courts! Already in love with this sport 🎾😊",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=500&fit=crop",
    type: "match",
    likes: 78,
    comments: 8,
    commentsData: [
      {
        id: "c7",
        author: { name: "Maria Santos", avatar: "M", handle: "@mariasantos" },
        content: "Welcome to the community James! Excited to see you grow!",
        timestamp: "1 day ago",
      },
    ],
    liked: false,
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Pro":
      return "bg-[#FFD700] text-[#654321]";
    case "Advanced":
      return "bg-[#a3e635] text-[#0f2e22]";
    case "Intermediate":
      return "bg-[#60a5fa] text-white";
    case "Beginner":
      return "bg-[#94a3b8] text-white";
    default:
      return "bg-slate-200 text-slate-700";
  }
};

const getPostIcon = (type: string) => {
  switch (type) {
    case "achievement":
      return <Trophy className="w-4 h-4" />;
    case "match":
      return <Zap className="w-4 h-4" />;
    case "tournament":
      return <Users className="w-4 h-4" />;
    case "court":
      return <Clock className="w-4 h-4" />;
    default:
      return <MessageCircle className="w-4 h-4" />;
  }
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<FeedPost[]>(samplePosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [newPostType, setNewPostType] = useState<"match" | "achievement" | "tournament" | "court">("match");
  const [dragActive, setDragActive] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && post.type === activeFilter;
  });

  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setNewPostImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      handleImageFile(files[0]);
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleImageFile(files[0]);
    }
  };

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      const newPost: FeedPost = {
        id: (posts.length + 1).toString(),
        author: {
          name: "Your Name",
          avatar: "Y",
          handle: "@yourname",
          level: "Advanced",
        },
        timestamp: "just now",
        content: newPostContent,
        image: newPostImage || undefined,
        likes: 0,
        comments: 0,
        commentsData: [],
        type: newPostType,
        liked: false,
      };
      setPosts([newPost, ...posts]);
      setNewPostContent("");
      setNewPostImage("");
      setNewPostType("match");
      setShowCreateModal(false);
    }
  };

  const openComments = (postId: string) => {
    setSelectedPostId(postId);
    setShowCommentsModal(true);
    setNewComment("");
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedPostId) {
      setPosts(
        posts.map((post) =>
          post.id === selectedPostId
            ? {
                ...post,
                comments: post.comments + 1,
                commentsData: [
                  ...(post.commentsData || []),
                  {
                    id: `c${Date.now()}`,
                    author: {
                      name: "Your Name",
                      avatar: "Y",
                      handle: "@yourname",
                    },
                    content: newComment,
                    timestamp: "just now",
                  },
                ],
              }
            : post
        )
      );
      setNewComment("");
    }
  };

  const toggleExpandComments = (postId: string) => {
    const newSet = new Set(expandedComments);
    if (newSet.has(postId)) {
      newSet.delete(postId);
    } else {
      newSet.add(postId);
    }
    setExpandedComments(newSet);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 overflow-x-hidden animate-in fade-in duration-1000 relative bg-white">
      {/* Decorative Background Ball Images */}
      <div className="absolute top-10 left-10 w-20 h-20 opacity-8 pointer-events-none z-0">
        <Image src="/images/Ball.png" alt="Ball" width={80} height={80} className="object-contain" />
      </div>
      <div className="absolute top-1/3 right-12 w-28 h-28 opacity-10 pointer-events-none z-0 transform rotate-45">
        <Image src="/images/Ball.png" alt="Ball" width={112} height={112} className="object-contain" />
      </div>
      <div className="absolute bottom-1/2 left-1/3 w-24 h-24 opacity-9 pointer-events-none z-0">
        <Image src="/images/Ball.png" alt="Ball" width={96} height={96} className="object-contain" />
      </div>
      <div className="absolute bottom-20 right-20 w-20 h-20 opacity-7 pointer-events-none z-0 transform -rotate-12">
        <Image src="/images/Ball.png" alt="Ball" width={80} height={80} className="object-contain" />
      </div>
      <div className="absolute top-2/3 right-1/4 w-32 h-32 opacity-11 pointer-events-none z-0">
        <Image src="/images/Ball.png" alt="Ball" width={128} height={128} className="object-contain" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white w-full overflow-x-hidden relative z-10">
        <main className="flex-1 px-3 sm:px-4 lg:px-6 py-3 overflow-x-hidden mt-16 lg:mt-20 pb-24 lg:pb-6 max-w-full lg:max-w-7xl mx-auto w-full box-border">
          {/* Page Header */}
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-3xl lg:text-4xl font-black text-[#a3e635] tracking-tight mb-2">Social Feed</h1>
            <p className="text-slate-600 text-sm lg:text-base">Connect with fellow pickleball players and stay updated with the community</p>
          </div>

          {/* Create Post Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="mb-8 w-full bg-gradient-to-r from-[#a3e635] to-[#84cc16] hover:from-[#84cc16] hover:to-[#a3e635] text-[#0f2e22] font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 animate-in fade-in duration-500"
          >
            <Plus className="w-5 h-5" />
            Create a Post
          </button>

          {/* Create Post Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 rounded-2xl">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-slate-900">Create a Post</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6 text-slate-600" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Post Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Post Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { value: "match", label: "Match", icon: <Zap className="w-4 h-4" /> },
                        { value: "achievement", label: "Achievement", icon: <Trophy className="w-4 h-4" /> },
                        { value: "court", label: "Court", icon: <Clock className="w-4 h-4" /> },
                        { value: "tournament", label: "Tournament", icon: <Users className="w-4 h-4" /> },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setNewPostType(type.value as typeof newPostType)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg font-semibold transition-all ${
                            newPostType === type.value
                              ? "bg-[#a3e635] text-[#0f2e22] shadow-md"
                              : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                          }`}
                        >
                          {type.icon}
                          <span className="text-xs">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">What's on your mind?</label>
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Share your thoughts, achievements, or ask the community..."
                      className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#a3e635] focus:ring-2 focus:ring-[#a3e635]/20 transition-all resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-2">{newPostContent.length}/500 characters</p>
                  </div>

                  {/* Image Upload with Drag & Drop */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Add Image (Optional)</label>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                        dragActive
                          ? "border-[#a3e635] bg-[#a3e635]/10"
                          : "border-gray-300 hover:border-[#a3e635]/50 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="image-input"
                      />
                      <div className="pointer-events-none">
                        <div className="text-4xl mb-2">🖼️</div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">
                          {dragActive ? "Drop your image here" : "Drag and drop your image"}
                        </p>
                        <p className="text-xs text-slate-500">or click to browse</p>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {newPostImage && (
                      <div className="mt-4 relative rounded-lg overflow-hidden border border-gray-200 shadow-md w-full bg-gray-50">
                        <img 
                          src={newPostImage} 
                          alt="Preview" 
                          className="w-full h-auto object-cover block"
                          style={{ maxHeight: "300px", display: "block", width: "100%" }}
                        />
                        <button
                          onClick={() => setNewPostImage("")}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all z-10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Modal Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim()}
                      className="flex-1 px-6 py-3 bg-[#a3e635] hover:bg-[#84cc16] disabled:bg-gray-300 text-[#0f2e22] font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3e635]" />
              <input
                type="text"
                placeholder="Search players, posts, or courts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#a3e635] focus:ring-2 focus:ring-[#a3e635]/20 transition-all bg-white"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {[
                { label: "All", value: "all" },
                { label: "Matches", value: "match" },
                { label: "Achievements", value: "achievement" },
                { label: "Tournaments", value: "tournament" },
                { label: "Courts", value: "court" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-sm ${
                    activeFilter === filter.value
                      ? "bg-[#a3e635] text-[#0f2e22] shadow-lg"
                      : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feed Posts */}
          {filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border-2 border-gray-100 hover:border-[#a3e635]/30 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group animate-in fade-in slide-in-from-bottom-2"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Post Header */}
                  <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3 flex-1">
                        {/* Avatar - Clickable */}
                        <Link href={`/community/${post.author.handle.replace("@", "").replace(/\s+/g, "-").toLowerCase()}`}>
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#a3e635] to-[#84cc16] flex items-center justify-center font-bold text-white text-lg shadow-md flex-shrink-0 cursor-pointer hover:scale-110 transition-transform">
                            {post.author.avatar}
                          </div>
                        </Link>

                        {/* Author Info - Name is Clickable */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link href={`/community/${post.author.handle.replace("@", "").replace(/\s+/g, "-").toLowerCase()}`}>
                              <h3 className="font-bold text-slate-900 text-sm sm:text-base hover:text-[#a3e635] transition-colors cursor-pointer">
                                {post.author.name}
                              </h3>
                            </Link>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getLevelColor(post.author.level)}`}>
                              {post.author.level}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold text-[#a3e635] bg-[#a3e635]/10 px-2 py-1 rounded-lg`}>
                              {getPostIcon(post.type)}
                              {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs sm:text-sm mt-1">
                            {post.author.handle} • {post.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 sm:px-6 py-3">
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                      {post.content}
                    </p>

                    {/* Post Image */}
                    {post.image && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 shadow-md w-full bg-gray-50">
                        <img
                          src={post.image}
                          alt="Post image"
                          loading="lazy"
                          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300 block"
                          style={{ maxHeight: "400px", display: "block", width: "100%" }}
                        />
                      </div>
                    )}

                    {/* Post Metadata */}
                    {post.metadata && (
                      <div className="mt-4 p-3 sm:p-4 bg-[#a3e635]/5 rounded-lg border border-[#a3e635]/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          {post.metadata.court && (
                            <p className="text-slate-600">
                              <span className="font-semibold text-[#a3e635]">📍 Court:</span>{" "}
                              {post.metadata.court}
                            </p>
                          )}
                          {post.metadata.score && (
                            <p className="text-slate-600">
                              <span className="font-semibold text-[#a3e635]">🎾 Score:</span>{" "}
                              {post.metadata.score}
                            </p>
                          )}
                          {post.metadata.opponent && (
                            <p className="text-slate-600">
                              <span className="font-semibold text-[#a3e635]">👥 vs:</span>{" "}
                              {post.metadata.opponent}
                            </p>
                          )}
                          {post.metadata.rating && (
                            <p className="text-slate-600">
                              <span className="font-semibold text-[#a3e635]">⭐ Rating:</span>{" "}
                              {post.metadata.rating}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Comments Preview */}
                    {post.commentsData && post.commentsData.length > 0 && expandedComments.has(post.id) && (
                      <div className="mt-4 space-y-3 p-3 bg-slate-50 rounded-lg">
                        {post.commentsData.map((comment) => (
                          <div key={comment.id} className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a3e635] to-[#84cc16] flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                              {comment.author.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                                  {comment.author.name}
                                </p>
                                <p className="text-slate-500 text-xs">{comment.timestamp}</p>
                              </div>
                              <p className="text-slate-700 text-xs sm:text-sm">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <span className="text-slate-500 font-medium">{post.likes} likes</span>
                        <button
                          onClick={() => toggleExpandComments(post.id)}
                          className="text-slate-500 font-medium hover:text-[#a3e635] transition-colors flex items-center gap-1"
                        >
                          {post.comments} comments
                          {expandedComments.has(post.id) ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                          post.liked
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-slate-600 hover:bg-[#a3e635]/10 hover:text-[#a3e635]"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${post.liked ? "fill-current" : ""}`}
                        />
                        <span className="hidden sm:inline">Like</span>
                      </button>
                      <button
                        onClick={() => openComments(post.id)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold bg-gray-100 text-slate-600 hover:bg-[#a3e635]/10 hover:text-[#a3e635] transition-all text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Comment</span>
                      </button>
                      <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold bg-gray-100 text-slate-600 hover:bg-[#a3e635]/10 hover:text-[#a3e635] transition-all text-sm">
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                      {post.groupLink && (
                        <Link
                          href={post.groupLink}
                          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold bg-[#a3e635] text-[#0f2e22] hover:bg-[#84cc16] transition-all text-sm ml-auto"
                        >
                          <Users className="w-4 h-4" />
                          <span className="hidden sm:inline">Join Group</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-[#a3e635]/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">No posts found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
        </main>
      </div>

      {/* Comments Modal */}
      {showCommentsModal && selectedPostId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-slate-900">Comments</h2>
              <button
                onClick={() => {
                  setShowCommentsModal(false);
                  setSelectedPostId(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {posts
                .find((p) => p.id === selectedPostId)
                ?.commentsData?.map((comment) => (
                  <div key={comment.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a3e635] to-[#84cc16] flex items-center justify-center font-bold text-white flex-shrink-0">
                      {comment.author.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{comment.author.name}</p>
                        <p className="text-slate-500 text-sm">{comment.author.handle}</p>
                        <p className="text-slate-500 text-xs">• {comment.timestamp}</p>
                      </div>
                      <p className="text-slate-700 mt-2">{comment.content}</p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Add Comment Section */}
            <div className="p-6 border-t border-gray-200 bg-slate-50 sticky bottom-0">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a3e635] to-[#84cc16] flex items-center justify-center font-bold text-white flex-shrink-0">
                  Y
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#a3e635] focus:ring-2 focus:ring-[#a3e635]/20 transition-all"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-[#a3e635] hover:bg-[#84cc16] disabled:bg-gray-300 text-[#0f2e22] font-bold rounded-lg transition-all flex items-center gap-2 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
