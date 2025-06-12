import React from 'react'
import SarcasmBlog from '../components/sarcasm/blog-managment/blog-detail/SarcasmBlog'
import BlogDetail from '../components/sarcasm/blog-managment/blog-detail/index'
import SarcasmCategory from '../components/sarcasm/category-management/index'
import SarcasmDashboard from '../components/sarcasm/content-from/index'
import { Route, Routes } from 'react-router-dom'

function SarcasmRoutes() {
    return (
        <Routes>
            <Route
                path="/post-content"
                element={<SarcasmDashboard />}
            />
            <Route
                path="/sarcasm-category"
                element={<SarcasmCategory />}
            />
            <Route
                path="/sarcasm-blog"
                element={<SarcasmBlog />}
            />
            <Route
                path="/sarcasm-blog/:id"
                element={<BlogDetail />}
            />
        </Routes>
    )
}

export default SarcasmRoutes