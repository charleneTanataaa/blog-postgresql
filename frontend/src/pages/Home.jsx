import { useEffect, useState } from "react";
import { getPosts } from "../api/posts.api";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPosts()
                setPosts(data)
            }
            catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, []);


    return(
        <div className="pond-home">
        <NavBar />
        <div className="post-content">
            <header className="pond-header">
                <h1 className="pond-title">Raft</h1>
                <p className="pond-subtitle">floating thoughts</p>
                <div className="header-divider" />
            </header>

            {loading ? (
                <div className="pond-loading">
                    <div className="loading-dot" />
                    <div className="loading-dot" />
                    <div className="loading-dot" />
                </div>
            ): (
                <div className="posts-list">
                    {posts.length === 0 && (
                        <p className="pond-empty">No posts yet</p>
                    )}
                    {posts.map((post) => (
                         <Link
                        key={post.id}
                        to={`/posts/${post.id}`}
                        className="post-card">
                            <h2 className="post-title">{post.title}</h2>
                            <p className="post-excerpt"> {post.content?.slice(0, 150)}...</p>
                        </Link>
                    ))}
                </div>
            )}
           
            </div>
        </div>
    );
}