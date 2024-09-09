import React,{ReactNode} from "react";


interface FormButtonProps{
    loading:boolean;
    text:string;
    icon:ReactNode
}

export default function FormButton({loading, text, icon}:FormButtonProps) {
    return(
        <button
            disabled = {loading}
            className="primary-btn h-10 flex justify-center gap-2 py-2
            disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
        >
            {icon}
            {loading ? "로딩 중" : text}
        </button>
    );
}