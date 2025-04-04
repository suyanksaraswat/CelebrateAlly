import { shareableImages } from "@/utils/constants";

const PublicHomePage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 auth-container">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Login to share images with your friends
          </h1>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {shareableImages?.map((image, index) => (
            <div key={index} className="flex flex-col gap-4">
              <img src={image} alt="" className="aspect-square w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicHomePage;
