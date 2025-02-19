'use client'

import { deleteUser, storeUser } from "@/lib/store/slice/sliceUser";
import { RootState } from "@/lib/store/store";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface SearchHandler {
	(e: ChangeEvent<HTMLInputElement>): void;
}

interface User {
	name: string;
	email: string;
	// Add other properties if needed
}
interface HandleDelete {
	(id: number): void;
}
export default function Home() {
	const [isOpen, setIsOpen] = useState(false);
	const [id, setId] = useState<number>()
	const [searchTerm, setSearchTerm] = useState("");
	const users = useSelector((state: RootState) => state.sliceUser.data)
	const dispatch = useDispatch()
	const router = useRouter()

	useEffect(() => { // first fetch
		axios.get('https://jsonplaceholder.typicode.com/users')
			.then((res) => {
				dispatch(storeUser(res.data))
				console.log('res : ', res.data)
			})
			.catch((err) => console.error(err));
	}, []);

	// useEffect(() => {
	// 	console.log('users : ', users)
	// }, [users])

	const handleSearchTerm: SearchHandler = (e) => {
		setSearchTerm(e.target.value)
	}
	const filteredUsers = users.filter((user) => // search function
		(["name", "email"] as (keyof User)[]).some((key) =>
			user[key].toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	const handleCreateUser = () => {
		router.push('/add')
	}

	const handleDelete = () => {
		console.log('id : ', id)
		setIsOpen(false)
		dispatch(deleteUser(id))
	}

	return (
		<div className="lg:max-w-[1024px] container mx-auto pt-4">
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg px-4">
				<div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
					<button onClick={handleCreateUser} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none ">Create User</button>
					<div className="pb-4 bg-white ">
						<label htmlFor="table-search" className="sr-only">Search</label>
						<div className="relative mt-1">
							<div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
								<svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
									<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
								</svg>
							</div>
							<input value={searchTerm} onChange={handleSearchTerm} type="text" id="table-search" className="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " placeholder="Search for items" />
						</div>
					</div>
				</div>
				<table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
						<tr>
							<th scope="col" className="px-6 py-3">
								No.
							</th>
							<th scope="col" className="px-6 py-3">
								ID
							</th>
							<th scope="col" className="px-6 py-3">
								Nama
							</th>
							<th scope="col" className="px-6 py-3">
								Email
							</th>
							<th scope="col" className="px-6 py-3">
								Perusahaan
							</th>
							<th scope="col" className="px-6 py-3">
								Aksi
							</th>
						</tr>
					</thead>
					<tbody>
						{
							filteredUsers.map((x, y) => (

								<tr key={y} className="bg-white border-b  border-gray-200 hover:bg-gray-50 ">
									<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
										{y+1}
									</th>
									<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
										{x.id}
									</th>
									<td className="px-6 py-4">
										{x.name}
									</td>
									<td className="px-6 py-4">
										{x.email}
									</td>
									<td className="px-6 py-4">
										{x.company.name}
									</td>
									<td className="px-6 py-4 space-x-2 flex">
										<Link href={`/edit/${x.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</Link>
										<p>|</p>
										<div onClick={() => {
											setId(x.id)
											setIsOpen(true)
										}}>

											<p className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Delete</p>
										</div>
										{/* <Link href={`/edit/${x.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</Link> */}
									</td>
								</tr>
							))
						}

					</tbody>
				</table>
			</div>
			{/* POPUP MODAL DELETE */}
			<div id="popup-modal" tabIndex={-1} className={`${isOpen ? 'flex' : 'hidden'} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
				<div className="relative p-4 w-full max-w-md max-h-full">
					<div className="relative bg-white rounded-lg shadow-sm ">
						<button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="popup-modal">
							<svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
								<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
							</svg>
							<span className="sr-only">Close modal</span>
						</button>
						<div className="p-4 md:p-5 text-center">
							<svg className="mx-auto mb-4 text-gray-400 w-12 h-12 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
								<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
							</svg>
							<h3 className="mb-5 text-lg font-normal text-gray-500 ">Are you sure you want to delete this user?</h3>
							<button onClick={handleDelete} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
								Yes, I'm sure
							</button>
							<button onClick={() => {
								setId(0)
								setIsOpen(false)
							}} data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 ">No, cancel</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
