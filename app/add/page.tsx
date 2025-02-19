'use client'
import { getRandomInt } from "@/lib/functions";
import { createUser } from "@/lib/store/slice/sliceUser";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type InputHandler = (field: string) => (e: ChangeEvent<HTMLInputElement>) => void;
type FormState = {
    [key: string]: {
        value: string;
        isError: boolean;
        message: string;
    };
};

const initialFormState: FormState = {
    name: { value: '', isError: false, message: "" },
    email: { value: '', isError: false, message: "" },
    address: { value: '', isError: false, message: "" },
    city: { value: '', isError: false, message: "" },
    street: { value: '', isError: false, message: "" },
    suite: { value: '', isError: false, message: "" },
    zipcode: { value: '', isError: false, message: "" },
    company: { value: '', isError: false, message: "" },
};
export default function PageAdd() {

    const [form, setForm] = useState<FormState>({
        name: {
            value: '',
            isError: false,
            message: ""
        },
        email: {
            value: '',
            isError: false,
            message: ""
        },
        address: {
            value: '',
            isError: false,
            message: ''
        },
        city: {
            value: '',
            isError: false,
            message: ''
        },
        suite: {
            value: '',
            isError: false,
            message: ''
        },
        zipcode: {
            value: '',
            isError: false,
            message: ''
        },
        company: {
            value: '',
            isError: false,
            message: ""
        },
    })

    const dispatch = useDispatch()

    const handleInput: InputHandler = (field) => (e) => {
        setForm((prevForm) => ({
            ...prevForm,
            [field]: {
                ...prevForm[field],
                value: e.target.value,
                isError: false,
                message: '',
            },
        }));
    }
    const cekEmpty = () => {
        return Object.values(form).some(field => field.value.trim() === '');
    };

    const handleAddUser = () => {
        const hasErrors = cekEmpty();
        if (hasErrors) {
            // ❌ Form has errors
            validateForm()
        } else {
            // ✅ no error
            const params = {
                id: getRandomInt(10, 100),
                name: form.name.value,
                email: form.email.value,
                address: {
                    city: form.city.value,
                    geo: { lat: '', lng: '' },
                    street: form.address.value,
                    suite: form.suite.value,
                    zipcode: form.zipcode.value
                },
                company: {
                    bs: form.company.value,
                    catchPhrase: form.company.value,
                    name: form.company.value
                },
                phone: '',
                username: '',
                website: '',

            }
            dispatch(createUser(params))
            setForm(initialFormState)
        }
    }

    const validateForm = () => {
        let hasErrors = false;

        setForm(prevForm => {
            const updatedForm = { ...prevForm };

            Object.keys(updatedForm).forEach(key => {
                const { value } = updatedForm[key];

                if (value.trim() === '') {
                    updatedForm[key] = {
                        ...updatedForm[key],
                        isError: true,
                        message: 'This field is required',
                    };
                    hasErrors = true;
                } else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    updatedForm[key] = {
                        ...updatedForm[key],
                        isError: true,
                        message: 'Invalid email format',
                    };
                    hasErrors = true;
                } else {
                    updatedForm[key] = {
                        ...updatedForm[key],
                        isError: false,
                        message: '',
                    };
                }
            });

            return updatedForm;
        });

        return hasErrors;
    };

    return (
        <div>
            <div className="py-2">

                <p className="text-xl font-bold">Create User</p>
            </div>
            <form>
                <FormInput isError={form.name.isError} label="Nama" value={form.name.value} onChangeText={handleInput('name')} />
                <FormInput isError={form.email.isError} label="Email" value={form.email.value} onChangeText={handleInput('email')} />
                <FormInput isError={form.address.isError} label="Alamat" value={form.address.value} onChangeText={handleInput('address')} />
                <FormInput isError={form.city.isError} label="City" value={form.city.value} onChangeText={handleInput('city')} />
                <FormInput isError={form.suite.isError} label="Suite" value={form.suite.value} onChangeText={handleInput('suite')} />
                <FormInput isError={form.zipcode.isError} label="Zipcode" value={form.zipcode.value} onChangeText={handleInput('zipcode')} />
                <FormInput isError={form.company.isError} label="Company" value={form.company.value} onChangeText={handleInput('company')} />
                <button onClick={handleAddUser} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none w-full">Add</button>
            </form>
        </div>
    )
}
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