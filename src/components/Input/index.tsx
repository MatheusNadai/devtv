"use client";
import React, { useMemo, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Control, Controller } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isPassword?: boolean;
  disabled?: boolean;
  errorLog?: string;
  control: Control<any>;
  name: string;
  id: string;
}

export function Input({
  label,
  isPassword,
  disabled,
  errorLog,
  control,
  name,
  id,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const colorInput = useMemo(() => {
    if (errorLog) {
      return "text-red-500";
    } else {
      return "text-slate-800";
    }
  }, [errorLog]);

  const colorBorderInput = useMemo(() => {
    return errorLog
      ? "border-red-500 text-red-500"
      : "border-slate-400 text-slate-800 dark:text-slate-100";
  }, [errorLog]);

  const disableColors = useMemo(() => {
    return disabled ? "bg-slate-300 text-slate-500" : "";
  }, [disabled]);

  return (
    <div className="flex flex-col">
      <div className="relative w-full">
        {isPassword ? (
          <div className="relative">
            <Controller
              name={name}
              control={control}
              defaultValue={""}
              render={({ field }) => (
                <input
                  className={`block rounded-sm px-6 items-center justify-center py-4 w-full text-md text-white bg-[#333] appearance-none focus:outline-none focus:ring-0 peer ${disableColors}
              ${colorBorderInput}
              `}
                  placeholder=""
                  type={showPassword ? "text" : "password"}
                  disabled={disabled}
                  {...field}
                  {...rest}
                />
              )}
            />
            <div className="absolute inset-y-0 right-3 flex items-center justify-center">
              <button
                onClick={toggleShowPassword}
                disabled={disabled}
                type="button"
              >
                {showPassword ? (
                  <FaEye
                    className={`text-3xl text-gray-600 ${disableColors}`}
                  />
                ) : (
                  <FaEyeSlash
                    className={`text-3xl text-gray-600 ${disableColors}`}
                  />
                )}
              </button>
            </div>
            <label
              htmlFor={id}
              className="
                absolute 
                text-md
              text-zinc-400
                duration-150 
                transform 
                -translate-y-3 
                scale-75 
                top-4 
                z-10 
                origin-[0] 
                left-6
                peer-placeholder-shown:scale-100 
                peer-placeholder-shown:translate-y-0 
                peer-focus:scale-75
                peer-focus:-translate-y-4
              "
            >
              {label}
            </label>
          </div>
        ) : (
          <div className="relative">
            <Controller
              name={name}
              control={control}
              defaultValue={""}
              render={({ field }) => (
                <input
                  id={id}
                  className={`block rounded-sm px-6 items-center justify-center py-4 w-full text-md text-white bg-[#333] appearance-none focus:outline-none focus:ring-0 peer ${disableColors}
            ${colorBorderInput}
            `}
                  placeholder=" "
                  disabled={disabled}
                  {...field}
                  {...rest}
                />
              )}
            />
            <label
              htmlFor={id}
              className="
                absolute 
                text-md
              text-zinc-400
                duration-150 
                transform 
                -translate-y-3 
                scale-75 
                top-4 
                z-10 
                origin-[0] 
                left-6
                peer-placeholder-shown:scale-100 
                peer-placeholder-shown:translate-y-0 
                peer-focus:scale-75
                peer-focus:-translate-y-4
              "
            >
              {label}
            </label>
          </div>
        )}
      </div>
      {errorLog && <span className="text-xs text-red-500">{errorLog}</span>}
    </div>
  );
}
