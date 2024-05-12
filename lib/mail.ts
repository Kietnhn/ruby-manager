import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification-email?token=${token}`;
    await resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`,
    });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;
    await resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: email,
        subject: "Rest your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset password</p>`,
    });
};
