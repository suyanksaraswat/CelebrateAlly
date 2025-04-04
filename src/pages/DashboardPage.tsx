import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [images, setImages] = useState<
    {
      id: number;
      created_at: string;
      imageUrl: string;
      userEmail: string;
      sharedWith: string;
    }[]
  >([]);

  const getSharedImages = async (userEmail) => {
    try {
      const { data, error } = await supabase
        .from("shared")
        .select("*")
        .or(`userEmail.eq.${userEmail},sharedWith.eq.${userEmail}`);

      if (error) throw error;
      console.log("### data-", data);

      setImages(data);
    } catch (error) {
      console.error("Error fetching shared images:", error.message);
      return [];
    }
  };

  useEffect(() => {
    getSharedImages(user?.email);
  }, [user]);

  const sharedByMe = images?.filter(
    (image) => image?.userEmail === user?.email
  );

  const sharedWithMe = images?.filter(
    (image) => image?.sharedWith === user?.email
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Shared by me</h1>
        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-4">
          {sharedByMe?.length > 0 ? (
            sharedByMe?.map((image, index) => (
              <div key={index} className="flex flex-col gap-4">
                <img
                  src={image?.imageUrl}
                  alt=""
                  className="aspect-square w-full"
                />

                <div>
                  <div>Shared with: {image?.sharedWith}</div>
                </div>

                <Button onClick={() => navigate(`/shared/${image?.id}`)}>
                  Comments
                </Button>
              </div>
            ))
          ) : (
            <div>No image shared by me</div>
          )}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Shared with me</h1>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-4">
          {sharedWithMe?.length > 0 ? (
            sharedWithMe?.map((image, index) => (
              <div key={index} className="flex flex-col gap-4">
                <img
                  src={image?.imageUrl}
                  alt=""
                  className="aspect-square w-full"
                />

                <div>
                  <div>Shared by: {image?.userEmail}</div>
                </div>

                <Button onClick={() => navigate(`/shared/${image?.id}`)}>
                  Comments
                </Button>
              </div>
            ))
          ) : (
            <div>No image shared with me</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
