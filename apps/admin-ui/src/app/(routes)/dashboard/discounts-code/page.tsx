'use client';
import { ChevronRight, Plus, Trash, X } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { useQuery } from 'node_modules/@tanstack/react-query/build/modern/useQuery';
import axiosInstance from 'apps/admin-ui/src/utils/axoisInstance';
import { toast } from 'react-hot-toast';
import { useMutation } from 'node_modules/@tanstack/react-query/build/modern/useMutation';
import { useQueryClient } from 'node_modules/@tanstack/react-query/build/modern/QueryClientProvider';

import Input from 'packages/components/input';
import { Controller, useForm } from 'react-hook-form';
import { DeleteDiscountCodeModal } from 'apps/admin-ui/src/shared/components/modals/delete.discount-code';

const DiscountCode = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedDiscountCode, setSelectedDiscountCode] = React.useState<any>();
  const queryClient = useQueryClient();
  const {
    data: discountCodes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async () => {
      const response = await axiosInstance.get('/product/api/discount-codes');
      return response.data?.discountCodes || [];
    },
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      public_name: '',
      discountType: 'percentage',
      discountValue: '',
      discountCode: '',
    },
  });

  const createDiscountCodeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosInstance.post(
        '/product/api/discount-codes',
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-discounts'] });
      reset();
      setShowModal(false);
    },
  });
  const deleteDiscountCodeMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/product/api/discount-codes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-discounts'] });
      setShowDeleteModal(false);
    },
  });

  const handleDeleteClick = async (code: any) => {
    setSelectedDiscountCode(code);
    setShowDeleteModal(true);
  };
  const onSubmit = (data: any) => {
    if (discountCodes.length >= 8) {
      toast.error('You can only create up to 8 discount codes.');
      return;
    }
    createDiscountCodeMutation.mutate(data);
  };
  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl text-white font-semibold">Discount Codes</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Create Discount
        </button>
      </div>
      <div className="flex items-center text-white">
        <Link href="/dashboard" className="text-[#80Deea] cursor-pointer">
          Dashboard
        </Link>
        <ChevronRight size={20} className="opacity-[0.8]" />
        <span>Discount Codes</span>
      </div>
      <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-2">
          Your Discount Codes
        </h3>
        {isLoading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : (
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Value</th>
                <th className="py-2 px-4 text-left">Code</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discountCodes.map((code: any) => (
                <tr
                  key={code.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition"
                >
                  <td className="p-3">{code.public_name}</td>
                  <td className="p-3 capitalize">
                    {code.discountType === 'percentage'
                      ? 'Percentage (%)'
                      : 'Flat ($)'}
                  </td>
                  <td className="p-3">
                    {code.discountType === 'percentage'
                      ? `${code.discountValue}%`
                      : `$${code.discountValue}`}
                  </td>
                  <td className="p-3">{code.discountCode}</td>
                  <td className="p-3">
                    <button
                      className="text-red-400 hover:text-red-300 transition"
                      onClick={() => handleDeleteClick(code)}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!isLoading && discountCodes.length === 0 && (
          <p className="text-gray-400 text-center p-4">
            {' '}
            No Discount Codes Available{' '}
          </p>
        )}
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[450px]">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <h3 className="text-xl font-semibold text-white">
                Create Discount Code
              </h3>
              <button
                className="text-gray-400 hover:text-gray-300 transition"
                onClick={() => setShowModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <Input
                label="Title"
                {...register('public_name', { required: 'Title is required' })}
              />

              {errors.public_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.public_name.message}
                </p>
              )}

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Discount Type
                </label>
                <Controller
                  control={control}
                  name="discountType"
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full p-2 border outline-none rounded bg-transparent text-gray-300 border-gray-700"
                    >
                      <option
                        className="bg-gray-800 text-gray-300"
                        value="percentage"
                      >
                        Percentage (%)
                      </option>
                      <option
                        className="bg-gray-800 text-gray-300"
                        value="flat"
                      >
                        Flat ($)
                      </option>
                    </select>
                  )}
                />
              </div>
              <div className="mt-2">
                <Input
                  label="Discount Value"
                  type="number"
                  min={1}
                  {...register('discountValue', {
                    required: 'Discount Value is required',
                  })}
                />
              </div>
              <div className="mt-2">
                <Input
                  label="Discount Code"
                  {...register('discountCode', {
                    required: 'Discount Code is required',
                  })}
                />
              </div>
              <button
                type="submit"
                disabled={createDiscountCodeMutation.isPending}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-semibold flex items-center justify-center gap-4"
              >
                <Plus size={18} />{' '}
                {createDiscountCodeMutation.isPending
                  ? 'Creating...'
                  : 'Create'}
              </button>

              {createDiscountCodeMutation.isError && (
                <p className="text-red-500 text-sm mt-2">
                  {createDiscountCodeMutation.error?.message ||
                    'An error occurred'}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
      {showDeleteModal && selectedDiscountCode && (
        <DeleteDiscountCodeModal
          discountCode={selectedDiscountCode}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() =>
            deleteDiscountCodeMutation.mutate(selectedDiscountCode.id)
          }
        />
      )}
    </div>
  );
};

export default DiscountCode;
