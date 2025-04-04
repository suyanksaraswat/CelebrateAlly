import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";
import { toast } from "react-toastify";

const SharedPage = () => {
  const { sharedId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sharedData, setSharedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  async function fetchSharedData() {
    try {
      const userEmail = user.email;

      const { data, error } = await supabase
        .from("shared")
        .select("*")
        .eq("id", sharedId)
        .single();

      if (error || !data) {
        setError("Shared item not found.");
        return;
      }

      if (data.userEmail !== userEmail && data.sharedWith !== userEmail) {
        setError("You are not authorized to view this shared content.");
        return;
      }

      setSharedData(data);
    } catch (error) {
      console.error("Error fetching shared data:", error.message);
      setError("Something went wrong.");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("sharedId", sharedId);

      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error(error?.message);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchSharedData();
    fetchComments();
  }, [sharedId, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-7xl mx-auto pt-4">
      <h2 className="text-3xl font-bold">Discussion</h2>

      <div className="flex gap-10">
        <div className="flex-[1]">
          <img
            src={sharedData.imageUrl}
            alt="Shared Content"
            className="mt-4 w-full max-w-md rounded-lg"
          />
          <p className="mt-2 text-gray-600">
            Shared by: {sharedData.userEmail}
          </p>
        </div>

        <div className="flex-[2]">
          <h4 className="text-xl font-semibold mb-4">Comments</h4>

          <CommentList comments={comments} isLoading={loadingComments} />

          {user && (
            <CommentInput
              sharedId={sharedId || ""}
              userId={user.id}
              onCommentAdded={fetchComments}
              supabase={supabase}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedPage;
