"use client"

import {z} from "zod";

const passwordSchema = z
    .string()
    .min(8, {message: "Das Passwort muss mindestens 8 Zeichen beinhalten."})
    .max(255, {message: "Das Passwort darf maximal 255 Zeichen beinhalten."})
    .refine((password) => /[A-Z]/.test(password), {
        message: "Das Passwort muss ein Grossbuchstabe beinhalten.",
    })
    .refine((password) => /[a-z]/.test(password), {
        message: "Das Passwort muss ein Kleinbuchstabe beinhalten.",
    })
    .refine((password) => /[0-9]/.test(password), {message: "Das Passwort muss eine Zahl beinhalten."})
    .refine((password) => /[!@#$%^&*]/.test(password), {
        message: "Das Passwort muss ein Sonderzeichen beinhalten.",
    });

const FormSchema = z.object({
    companyName: z.string(),
    firstname: z.string().min(1, {message: "Der Vorname muss angegeben werden."}),
    lastname: z.string().min(1, {message: "Der Nachname muss angegeben werden."}),
    street: z.string().min(1, {message: "Die Strasse muss angegeben werden."}),
    streetNumber: z.string().min(1, {message: "Die Hausnummer muss angegeben werden."}),
    city: z.string().min(1, {message: "Der Ort muss angegeben werden."}),
    postalCode: z.string().min(1, {message: "Die Postleitzahl muss angegeben werden"}),
    email: z.string().email({
        message: "Die E-Mail Adresse ist ungültig.",
    }),
    password: passwordSchema,
    confirmPassword: z.string()
}).superRefine(({confirmPassword, password}, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "Die Passwörter stimmen nicht überein.",
            path: ['confirmPassword'],
        });
    }
});

export default function VerifyPage() {


    return (
        <main className="container max-w-screen-lg text-center">
            <h1 className="mb-10 text-6xl">Verifizierung</h1>
            <p>Wir haben dir eine E-Mail zur Verifizierung geschickt. Klicke auf den Link der erhaltenen E-Mail, um dich zu verifizieren.</p>
        </main>
    )
}