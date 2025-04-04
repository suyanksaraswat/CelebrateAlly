
import SignUpForm from "@/components/SignUpForm";

const RegisterPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 auth-container">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
};

export default RegisterPage;
