
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export default function PostDetail(){
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]= useState(null)

    useEffect(() => {
        const fetchpost = async () => {
            try{
                setLoading(true)
                const res = await fetch(`http://localhost:3000/posts/${id}`)
                if(!res.ok){
                    throw new Error('Post not found')
                }
                const data = await res.json()
                setPost(data)
            } catch(err){
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchpost()
    }, [id])

    if(loading) {
        return(
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        )
    }

    if(error){
        return(
            <div className="min-h-screen">
                {error}
            </div>
        )
    }
    return(
        
        <article
        className="border p-3 shadow-md">
            <div
            className="">
                <h1
                className="font-bold text-2xl my-3">
                    {post.title}</h1>

                <p className="text-sm text-gray-500 my-2">
                    {new Date(post.createdAt).toLocaleDateString()} | {post.author}
                </p>
            </div>

            <div className="prose">
                {post.content}
            </div>
        </article>
    )
}