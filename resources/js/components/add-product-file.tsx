import React, { FormEventHandler, useState } from 'react'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';

function AddProductFile() {
    const [file, setFile] = useState<File | null>(null)
    const [fileLoading, setFileLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string[]>>({});


    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            setFileLoading(true)
            const formData = new FormData()
            if (file) {
                formData.append('file', file)
            }


            // Example: send it somewhere
            // await fetch('/upload', { method: 'POST', body: formData })
            const { data } = await axios.post("http://localhost:8000/products/import",
                formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json"
                }
            });
            console.log("data import", data)
            if (data?.success === true) {
                toast(data?.message);
            }
        } catch (error: any) {
            console.error("add prod files error", error);
            if (error?.response && error.response.status === 422) {
                setErrors(error?.response.data.errors); // 👈 store backend errors
            }
        } finally {
            setFileLoading(false)
        }
    }
    return (
        <>
            <form onSubmit={submit}>
                <Label className="block font-medium mb-1">Select the file you are importing</Label>
                <Input
                    type="file"
                    name="files"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                />
                {errors.file && (
                    <p className="text-red-500 text-sm">{errors.file[0]}</p>
                )}
                <Button
                    type="submit"
                    className='mt-6'
                >
                    {fileLoading ? 'Loading...' : 'Upload'}
                </Button>
            </form>
        </>
    )
}

export default AddProductFile