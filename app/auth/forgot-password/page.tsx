import ForgotPasswordForm from "@/components/forms/forgot-password-form";
import { Card } from "@nextui-org/react";
import { Metadata } from "next";
import Logo from "@/components/rubylogo";

export const metadata: Metadata = {
    title: "Forget password",
};
export default function ForgotPasswordPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <Card className="relative mx-auto flex w-full min-w-[400px] max-w-[22rem] flex-col space-y-2.5 p-4 md:mt-2">
                <div className="flex-center gap-2">
                    <Logo />{" "}
                    <p className="text-2xl font-semibold text-inherit">Ruby</p>
                </div>
                <ForgotPasswordForm />
            </Card>
        </main>
    );
}
