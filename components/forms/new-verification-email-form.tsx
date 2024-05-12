"use client";
import { newVerification } from "@/lib/actions/tokens";
import { Button, CircularProgress, Link } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
export default function NewVerificationEmailForm({ token }: { token: string }) {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const handleNewVerification = async () => {
        setLoading(true);
        const data = await newVerification(token);
        setSuccess(data?.success);
        setError(data?.error);
        setLoading(false);
    };
    // useEffect(() => {
    //     if (error || success) return;
    //     if (!token) {
    //         setError("Missing verification token");
    //         return;
    //     }
    //     newVerification(token)
    //         .then((data) => {
    //             setSuccess(data?.success);
    //             setError(data?.error);
    //         })
    //         .catch(() => {
    //             setError("Something went wrong");
    //         });
    // }, []);
    return (
        <div className="flex-center flex-col gap-4">
            <p>Confirm your verification</p>
            <Button onClick={handleNewVerification} size="sm" color="primary">
                Click here to verify email
            </Button>
            {loading && <CircularProgress aria-label="loading" />}
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-success-500">{success}</p>}
            <Link href="/auth/login-credentials">Back to login</Link>
        </div>
    );
}
