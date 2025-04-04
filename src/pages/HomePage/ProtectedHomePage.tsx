import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { shareableImages } from "@/utils/constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedHomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shareOpen, setShareOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [email, setEmail] = useState("");

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

  const handleShareSubmit = async () => {
    if (!email) {
      toast.error("Please enter an email");
      return;
    }

    try {
      const { data, error } = await supabase.from("shared").insert([
        {
          imageUrl: selectedImage,
          userEmail: user?.email,
          sharedWith: email,
        },
      ]);

      if (error) throw error;

      toast.success("Image shared successfully! Ask user to login to see it");
      setShareOpen(false);
      setEmail("");
    } catch (error) {
      toast.error(error?.message);
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
    <>
      <div className="max-w-7xl mx-auto py-10">
        <div className="space-y-4 mb-8">
          <p className="text-xl font-medium text-gray-900 dark:text-white">
            Welcome back, {user.email}!
          </p>
        </div>

        <div className="mb-10">
          <h1 className="text-xl font-bold">You can share</h1>

          <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-4">
            {shareableImages?.length > 0 ? (
              shareableImages?.map((image, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <img src={image} alt="" className="aspect-square w-full" />

                  <Button
                    disabled={!user}
                    onClick={() => {
                      setSelectedImage(image);
                      setShareOpen(true);
                    }}
                  >
                    Share
                  </Button>
                </div>
              ))
            ) : (
              <div>No images to share</div>
            )}
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-xl font-bold">Shared by me</h1>

          <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-4">
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

                  <div className="flex items-center gap-2">
                    <Button
                      className="w-full"
                      onClick={() => navigate(`/shared/${image?.id}`)}
                    >
                      Comments
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div>No image shared by me</div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold">Shared with me</h1>

          <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-4">
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

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Image</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button disabled={!user} onClick={handleShareSubmit} className="mt-4">
            Send
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProtectedHomePage;
