"use client";

import React from "react";
import BlogCreate from "@/cms/components/BlogCreate";

const BlogCreatePage: React.FC = () => {
    return (
        <div className="py-12 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">

            </h1>
            <BlogCreate />
        </div>
    );
};

export default BlogCreatePage;
