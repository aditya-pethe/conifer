import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-20 bg-gradient-to-b from-black to-purple-700">
      <div className="flex flex-col text-center text-white mb-[3em] w-[30%]">
        <h1 className="text-6xl mb-10">Conifer</h1>
        <h2 className="text-xl">Semantic search for youtube videos powered by pinecone. Learn more about the project <a href="https://github.com/aditya-pethe/conifer" target="_blank" rel="noreferrer" className="underline">here</a>. </h2>
      </div>
      <div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-purple-700 hover:bg-purple-800 text-sm normal-case'
            }
          }}
        />
      </div>
    </div>
  );
}
