import NewVerificationEmailForm from "@/components/forms/new-verification-email-form";
import Logo from "@/components/rubylogo";
import { Card } from "@nextui-org/react";

export default async function NewVerificationEmailPage({
    searchParams,
}: {
    searchParams: {
        token: string | undefined;
    };
}) {
    if (!searchParams.token) return <p>Missing token</p>;
    return (
        <main className="flex items-center justify-center md:h-screen">
            <Card className="relative mx-auto flex w-full min-w-[400px] max-w-[22rem] flex-col space-y-2.5 p-4 md:mt-2">
                <div className="flex-center gap-2">
                    <Logo />
                    <p className="text-2xl font-semibold text-inherit">Ruby</p>
                </div>
                <NewVerificationEmailForm token={searchParams.token} />
            </Card>
        </main>
    );
}
