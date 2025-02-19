import { ChangeEvent } from "react";

interface Form {
    label: string;
    value: string;
    isError?: boolean;
    message?: string;
    placeholder?: string;
    onChangeText: (e: ChangeEvent<HTMLInputElement>) => void
    // (e: ChangeEvent<HTMLInputElement>): void;
}
export const FormInput = ({ label, value, onChangeText, isError, message, placeholder }: Form) => {
    return (
        <div className="mb-5">
            {/* bg-red-50 border border-red-500 text-red-900 placeholder-red-700 */}
            <div className="flex  mb-2">
                <label htmlFor="base-input" className="block text-sm font-medium text-gray-900">{label}</label>
                {
                    isError
                    &&
                    <p className=" text-sm text-red-600 dark:text-red-500"><span className="font-medium">&nbsp; Oops!</span>{message}</p>
                }
            </div>
            <input placeholder={placeholder} value={value} onChange={onChangeText} type="text" id="base-input" className={`${isError ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700" : "bg-gray-50 border border-gray-300 placeholder-gray-300"}  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 `} />

        </div>
    )
}