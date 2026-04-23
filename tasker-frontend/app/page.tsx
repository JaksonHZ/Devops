import Image from "next/image";
import { LoginForm } from "../components/Form/LoginForm";


export default function Home() {

  return (
    <main className="flex min-h-screen items-center justify-center">
      
      <div className="w-[604px] h-[495px] rounded-xl border-2 border-[#FF7550] flex items-center justify-center flex-col py-20 px-14">
          <h1 className="text-5xl font-semibold text-[#FF7550]">TASKER</h1>
        <LoginForm />
      </div>
    </main>
  );
}
