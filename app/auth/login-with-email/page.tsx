import LoginForm from "@/components/forms/forgot-password-form";
import { Card } from "@nextui-org/react";
import { Metadata } from "next";
import Logo from "@/components/rubylogo";

export const metadata: Metadata = {
    title: "Login email",
};
export default function LoginEmailPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <Card className="relative mx-auto flex w-full min-w-[400px] max-w-[22rem] flex-col space-y-2.5 p-4 md:mt-2">
                <div className="flex  w-full items-end rounded-lg bg-black dark:bg-white ">
                    <div className="w-32 text-white dark:text-black md:w-36 flex gap-2 items-center">
                        <Logo /> <p className="text-2xl text-inherit">Ruby</p>
                    </div>
                </div>
                <LoginForm />
            </Card>
        </main>
    );
}
