"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";

export default function SMSLogin() {
    const onClick = async ()=>{
        const response = await fetch("/api/users",{
            method: "POST",
            body: JSON.stringify({
                username:"nico",
                password : "1234",
            }),
        });
        console.log(await response.json());
    };
    return(
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">SMS Log in</h1>
                <h2 className="text-xl">Verify your phone number.</h2>
            </div>
            <form className="flex flex-col gap-3">
                <FormInput
                type="number"
                placeholder="Phone number"
                required
                errors={[]}
                />
                <FormInput
                type="number"
                placeholder="Verification code"
                required
                errors={[]}
                />
                <FormButton loading={false} text="Verify" 
                icon={<ArrowRightEndOnRectangleIcon className="h-6 w-6"  />} />
            </form>
            <span onClick={onClick}>
                <FormButton loading={false} text="Log in"
                icon={""} />
            </span>
        </div>
    );
}