"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./action";
import { PASSWORD_MIN_LENGTH } from "../../lib/constants";


export default function CreateAccount() {
    const [state, dispatch] = useFormState(createAccount, null);
    return(
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Fill in the form below to join!</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <Input type="text" name="username" placeholder="Username" 
                    required errors={state?.fieldErrors.username} 
                    minLength={3} maxLength={10} />
                <Input type="email" name="email" placeholder="Email" required  errors={state?.fieldErrors.email} />
                <Input type="password" name="password" placeholder="Password" required  
                    errors={state?.fieldErrors.password} 
                    minLength={PASSWORD_MIN_LENGTH}  />
                <Input type="password" name="confirm_password" placeholder="Confirm Password" required 
                 errors={state?.fieldErrors.confirm_password} 
                 minLength={PASSWORD_MIN_LENGTH}  />
                <Button text="Creat account"  />
            </form>
            <SocialLogin/>
        </div>
    );
    
}