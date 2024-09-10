"use client"

import React,{ReactNode} from "react";
import { useFormStatus } from "react-dom";


interface FormButtonProps{
    text:string;
    icon:ReactNode
}

export default function FormButton({ text, icon}:FormButtonProps) {
    const {pending} = useFormStatus();
    return(
        <button
            disabled = {pending}
            className="primary-btn h-10 flex justify-center gap-2 py-2
            disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
        >
            {icon}
            {pending ? "로딩 중" : text}
        </button>
    );
}