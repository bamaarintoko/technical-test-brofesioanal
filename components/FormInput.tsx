import { ChangeEvent } from "react";

interface Form {
    label: string;
    value: string;
    isError?: boolean;
    message?: string;
    onChangeText: (e: ChangeEvent<HTMLInputElement>) => void
    // (e: ChangeEvent<HTMLInputElement>): void;
}
export const FormInput = ({ label, value, onChangeText, isError, message }: Form) => {
    return (
        <div className="mb-5">
            {/* bg-red-50 border border-red-500 text-red-900 placeholder-red-700 */}
            <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
            <input value={value} onChange={onChangeText} type="text" id="base-input" className={`${isError ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700" : "bg-gray-50 border border-gray-300"} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 `} />
        </div>
    )
}