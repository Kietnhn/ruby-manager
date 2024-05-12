import LoginForm from "@/components/forms/login-form";
import { Card } from "@nextui-org/react";
import { Metadata } from "next";
import Logo from "@/components/rubylogo";

export const metadata: Metadata = {
    title: "Login",
};
export default function LoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <Card className="relative mx-auto flex w-full min-w-[400px] max-w-[22rem] flex-col space-y-2.5 p-4 md:mt-2">
                <div className="flex h-20 w-full items-end rounded-lg bg-content1  p-3 md:h-36">
                    <div className="w-32  md:w-36 flex gap-2 items-center">
                        <Logo /> <p className="text-2xl text-inherit">Ruby</p>
                    </div>
                </div>
                <LoginForm />
            </Card>
        </main>
    );
}
