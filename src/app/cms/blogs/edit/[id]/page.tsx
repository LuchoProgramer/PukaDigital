"use client";

import React from "react";
import BlogEdit from "@/cms/components/BlogEdit";

// Define la interfaz para las props
interface PageProps {
    params: Promise<{ id: string }>;
}

const EditBlogPage: React.FC<PageProps> = async ({ params }) => {
    const { id } = await params;

    return (
        <div>
            <BlogEdit params={{ id }} />
        </div>
    );
};

export default EditBlogPage;