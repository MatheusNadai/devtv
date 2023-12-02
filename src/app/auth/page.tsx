"use client";

import { Input } from "../../components/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { getSession, signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { BaseSyntheticEvent, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "../../lib/axios";

/* eslint-disable @next/next/no-img-element */
const formSchema = z
  .object({
    name: z.string().optional(),
    register: z.boolean(),
    fieldEmail: z.string().email("E-mail inválido"),
    fieldPassword: z.string().min(6, "Deve ter no mínimo 6 caracteres"),
  })
  .superRefine((values, ctx) => {
    if (values.register) {
      ctx.addIssue({
        message: "Nome de usuário obrigatório",
        code: z.ZodIssueCode.custom,
        path: ["name"],
      });
    }
  });

type LoginFormData = z.infer<typeof formSchema>;

const Auth = () => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { register: false },
  });

  const isRegister = watch("register");
  const email = watch("fieldEmail");
  const password = watch("fieldPassword");
  const name = watch("name");

  const login = useCallback(async () => {
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      router.push("/profiles");
    } catch (error) {
      console.log(error);
    }
  }, [email, password, router]);

  const register = useCallback(async () => {
    try {
      console.log(email, name, password);
      await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });

      login();
    } catch (error) {
      console.log(error);
    }
  }, [email, name, password, login]);

  const toggleVariant = useCallback(() => {
    setValue("register", isRegister === true ? false : true);
  }, [setValue, isRegister]);

  return (
    <main className="flex w-full h-full">
      <div className="relative h-full w-full bg-[url('/images/hero.png')] bg-no-repeat bg-center bg-fixed bg-cover">
        <div className="bg-black w-full h-full lg:bg-opacity-50">
          <nav className="px-12 py-5">
            <img
              src="/images/logo_devtv_contour.png"
              alt="Logo"
              className="h-12"
            />
          </nav>
          <div className="flex justify-center">
            <div className="bg-black bg-opacity-75 px-14 py-14 self-center mt-2 lg:w/2/5 lg:max-w-md rounded-md w-full flex flex-col">
              <span className="text-white text-4xl mb-6 font-semibold">
                {!isRegister ? "Entrar" : "Registrar"}
              </span>
              <form>
                <div className="flex flex-col gap-4">
                  {isRegister && (
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      control={control}
                      label="Username"
                      errorLog={errors.name?.message}
                    />
                  )}
                  <Input
                    id="fieldEmail"
                    name="fieldEmail"
                    control={control}
                    label={"E-mail"}
                    type="text"
                    autoComplete="off"
                    errorLog={errors.fieldEmail?.message}
                  />
                  <Input
                    id="fieldPassword"
                    name="fieldPassword"
                    isPassword
                    control={control}
                    label={"Senha"}
                    autoComplete="new-password"
                    errorLog={errors.fieldPassword?.message}
                  />
                </div>
                <button
                  onClick={!isRegister ? login : register}
                  className="bg-primary py-3 text-white rounded-sm w-full mt-10 hover:bg-orange-700 transition"
                >
                  {!isRegister ? "Entrar" : "Registrar"}
                </button>
              </form>
              <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                <div
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                >
                  <FcGoogle size={32} />
                </div>
                <div
                  onClick={() => signIn("github", { callbackUrl: "/" })}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                >
                  <FaGithub size={32} />
                </div>
              </div>
              <p className="text-gray-500 mt-12 text-center">
                {!isRegister
                  ? "First time using DEVTV?"
                  : "Already have an account?"}
                <span
                  onClick={toggleVariant}
                  className="text-white ml-1 hover:underline cursor-pointer"
                >
                  {!isRegister ? "Create an account" : "Login"}
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
