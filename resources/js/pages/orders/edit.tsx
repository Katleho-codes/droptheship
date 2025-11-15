import { useOrder } from '@/hooks/use-order'
import React, { useEffect, useState } from 'react'
import { usePage, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useInternalNotes } from '@/hooks/use-internal-notes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const breadcrumbs = [
  { title: "Orders", href: "/orders" },
  { title: "View Order", href: "#" },
];

const Edit = () => {
  const { props } = usePage();
  const { id } = props;
  const { order, orderLoading } = useOrder(id);

  const [addNote, setAddNote] = useState("")
  const [noteType, setNoteType] = useState("")
  const [addNoteLoading, setAddNoteLoading] = useState(false)
  const [isPrivateNote, setIsPrivateNote] = useState("")
  const [errors, setErrors] = useState<Record<string, string[]>>({});


  const {
    internalNotes,
    internalNotesLoading,
    pagination,
    setPagination,
    fetchNotes,
    pageCount,
    totalRecords,
  } = useInternalNotes();

  useEffect(() => {
    fetchNotes(id as string, pagination.pageIndex + 1);
  }, [id, pagination]);

  const submitNote = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      setAddNoteLoading(true)
      setErrors({});
      const payload = { 'order_id': Number(id), 'customer_id': order?.customer_id, "note": addNote, 'note_type': noteType, 'pinned': false, 'is_private': Boolean(isPrivateNote), "attachment_url": "" }
      const response = await axios.post("http://localhost:8000/api/notes", payload, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
      if (response?.data) {
        toast.success(response.data?.message);
        setAddNote("")
        setNoteType("")
        setIsPrivateNote("")
      }

    } catch (error: any) {
      console.error("error", error);
      if (error?.response && error.response.status === 422) {
        setErrors(error?.response.data.errors);
      }
    } finally {
      setAddNoteLoading(false)
    }
  }


  if (orderLoading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${order?.order_number ?? "View order"}`} />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white shadow rounded p-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Order #{order?.order_number}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${order?.status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {order?.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Order date: {order?.created_at}
          </p>
        </div>

        {/* Product Card */}
        <div className="bg-white shadow rounded overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <img
              src={order?.product_image}
              alt={order?.product_name}
              className="md:w-1/3 object-cover"
            />
            <div className="p-6 flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {order?.product_name}
              </h2>
              <p className="text-gray-600 mb-4">{order?.product_description}</p>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-lg font-bold text-indigo-600">
                  {order?.currency} {order?.price}
                </span>
                {order?.discount && (
                  <span className="text-sm text-red-500">
                    -{order?.discount}% off
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500">
                Quantity: {order?.quantity}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white shadow rounded p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-medium text-gray-700">
                {order?.first_name} {order?.last_name}
              </p>
              <p className="text-gray-500">{order?.email}</p>
              <p className="text-gray-500">{order?.phone}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Shipping Address</p>
              <p className="text-gray-500">{order?.address}</p>
              <p className="text-gray-500">
                {order?.state}, {order?.postal_code}, {order?.country}
              </p>
            </div>
          </div>
        </div>

        {/* Comment details */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Internal notes
        </h3>
        <div className="mt-4 flex flex-col gap-2 mb-8">
          <select name="note_type" className='border' id="note_type" value={noteType} onChange={(e) => setNoteType(e.target.value)}>
            <option value="" disabled>Select note type</option>
            <option value="email">email</option>
            <option value="note">note</option>
            <option value="followup">followup</option>
            <option value="issue">issue</option>
          </select>
          <select name="is_private" className='border' id="is_private" value={isPrivateNote} onChange={(e) => setIsPrivateNote(e.target.value)}>
            <option value="" disabled>Private/public note</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <Textarea
            placeholder="Write a note..."
            value={addNote}
            onChange={(e) => setAddNote(e.target.value)}
          />
          <Button onClick={submitNote} disabled={addNoteLoading}>{addNoteLoading ? 'Adding...' : 'Add note'}</Button>
        </div>
        <div className="space-y-2">
          {internalNotes.length > 0 ? (
            // Sort pinned notes first, then map
            internalNotes
              .sort((a, b) => Number(b.pinned) - Number(a.pinned))
              .map((note) => (
                <div
                  key={note.id}
                  className={`p-3 border rounded-md shadow-sm ${note.pinned ? "border-yellow-400 bg-yellow-50" : "border-gray-200"
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <p className="text-gray-800">{note.note}</p>
                      <small className="text-gray-500 mt-1">
                        {note.created_at} • {note.note_type}
                      </small>
                    </div>
                    {note.pinned && (
                      <span className="text-yellow-600 font-bold">📌 Pinned</span>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-sm">No notes yet.</p>
          )}
        </div>


        <div className="flex gap-2 mt-4">
          <Button
            disabled={pagination.pageIndex === 0}
            onClick={() =>
              setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))
            }
          >
            Previous
          </Button>

          <span>
            Page {pagination.pageIndex + 1} of {pageCount}
          </span>

          <Button
            disabled={pagination.pageIndex + 1 >= pageCount}
            onClick={() =>
              setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))
            }
          >
            Next
          </Button>
        </div>

      </div>
    </AppLayout>
  );
};

export default Edit;
