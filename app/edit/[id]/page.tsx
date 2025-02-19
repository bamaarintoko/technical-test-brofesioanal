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

    const handleInput: InputHandler = (field, value) => {
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
    const handleEditInput: EditInputHandler = (field) => (e) => {
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
            validateForm()
            // ❌ Form has errors
        } else {
            // ✅ no error
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
        <div>
            <div className="py-2">

                <p className="text-xl font-bold">Update User</p>
            </div>
            <form>
                <FormInput isError={form.name.isError} label="Nama" value={form.name.value} onChangeText={handleEditInput('name')} />
                <FormInput isError={form.email.isError} label="Email" value={form.email.value} onChangeText={handleEditInput('email')} />
                <FormInput isError={form.address.isError} label="Alamat" value={form.address.value} onChangeText={handleEditInput('address')} />
                <FormInput isError={form.city.isError} label="City" value={form.city.value} onChangeText={handleEditInput('city')} />
                <FormInput isError={form.suite.isError} label="Suite" value={form.suite.value} onChangeText={handleEditInput('suite')} />
                <FormInput isError={form.zipcode.isError} label="Zipcode" value={form.zipcode.value} onChangeText={handleEditInput('zipcode')} />
                <FormInput isError={form.company.isError} label="Company" value={form.company.value} onChangeText={handleEditInput('company')} />
                <button onClick={handleEditUser} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none w-full">Update</button>
            </form>
        </div>
    )
}