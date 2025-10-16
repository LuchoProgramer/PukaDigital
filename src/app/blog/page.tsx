"use client"; // Asegúrate de que este componente sea un componente de cliente

import React from 'react'; // Importa React
import Blogs from '@/components/blogs/Blogs';

const BlogPage = () => {
    return (
        <div className="container mx-auto">
            <Blogs />
        </div>
    );
};

export default BlogPage;

