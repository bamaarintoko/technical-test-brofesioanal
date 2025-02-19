'use client'

import { FormInput } from "@/components/FormInput";
// import { FormInput } from "@/app/add/page";
import { updateUser } from "@/lib/store/slice/sliceUser";
import { RootState } from "@/lib/store/store";
import { useParams, useRouter } from "next/navigation"
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Geo {
    lat: string;
    lng: string;
}

interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}

interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
}
type InputZipCode = (e: ChangeEvent<HTMLInputElement>) => void;
type InputHandler = (field: string, value: string) => void;
type EditInputHandler = (field: string) => (e: ChangeEvent<HTMLInputElement>) => void;
type FormState = {
    [key: string]: {
        value: string;
        isError: boolean;
        message: string;
    };
};

export default function () {
    const users = useSelector((state: RootState) => state.sliceUser.data)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
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
        street: {
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
    const params = useParams();
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        const result: User[] = users.filter(data => data.id === Number(params.id))
        console.log('result : ', result)
        handleInput('name', result[0].name)
        handleInput('email', result[0].email)
        handleInput('address', result[0].address.street)
        handleInput('city', result[0].address.city)
        handleInput('street', result[0].address.street)
        handleInput('suite', result[0].address.suite)
        handleInput('zipcode', result[0].address.zipcode)
        handleInput('company', result[0].company.name)

    }, [])

    useEffect(() => {
        console.log('form : ', form)
    }, [form])

    const handleInput: InputHandler = (field, value) => { // for initial set form
        setForm((prevForm) => ({
            ...prevForm,
            [field]: {
                ...prevForm[field],
                value: value,
                isError: false,
                message: '',
            },
        }));
    }

    const handleZipCodeInput: InputZipCode = (e) => { // for input zipcode
        let input = e.target.value.replace(/\D/g, "").slice(0, 5); // only number, and max input 5 length
        setForm((prevForm) => ({
            ...prevForm,
            zipcode: {
                ...prevForm.zipcode,
                value: input,
                isError: false,
                message: ''
            }
        }))
    }

    const handleEditInput: EditInputHandler = (field) => (e) => { // for update state
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

    const handleEditUser = () => {
        const hasErrors = cekEmpty();
        if (hasErrors) {
            // ❌ Form has errors
            setError(true)
            validateForm()
        } else {
            // ✅ no error
            setSuccess(true)
            const par = {
                id: Number(params.id),
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
            dispatch(updateUser(par))
            router.back()
        }
        // setForm(initialFormState)
        // console.log('params : ', params_)
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
        <div className="p-4">
            <div className="py-2">

                <p className="text-xl font-bold">Update User</p>
            </div>
            <form>
                <FormInput message={form.name.message} isError={form.name.isError} label="Nama" value={form.name.value} onChangeText={handleEditInput('name')} />
                <FormInput message={form.email.message} isError={form.email.isError} label="Email" value={form.email.value} onChangeText={handleEditInput('email')} />
                <FormInput message={form.address.message} isError={form.address.isError} label="Alamat" value={form.address.value} onChangeText={handleEditInput('address')} />
                <FormInput message={form.city.message} isError={form.city.isError} label="City" value={form.city.value} onChangeText={handleEditInput('city')} />
                <FormInput message={form.suite.message} isError={form.suite.isError} label="Suite" value={form.suite.value} onChangeText={handleEditInput('suite')} />
                <FormInput message={form.zipcode.message} isError={form.zipcode.isError} label="Zipcode" value={form.zipcode.value} onChangeText={handleZipCodeInput} />
                <FormInput message={form.company.message} isError={form.company.isError} label="Company" value={form.company.value} onChangeText={handleEditInput('company')} />
                {/* success alert */}
                <div id="alert-3" className={`${success ? 'flex' : 'hidden'} items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50`} role="alert">
                    <svg className="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="sr-only">Info</span>
                    <div className="ms-3 text-sm font-medium">
                        Create user berhasil
                    </div>
                    <button onClick={() => setSuccess(false)} type="button" className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 " data-dismiss-target="#alert-3" aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
                </div>

                {/* error alert */}
                <div id="alert-3" className={`${error ? 'flex' : 'hidden'} items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50`} role="alert">
                    <svg className="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="sr-only">Info</span>
                    <div className="ms-3 text-sm font-medium">
                        Create user gagal
                    </div>
                    <button onClick={() => setError(false)} type="button" className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 " data-dismiss-target="#alert-3" aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
                </div>
                <button onClick={handleEditUser} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none w-full">Update</button>
            </form>
        </div>
    )
}