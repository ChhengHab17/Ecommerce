import axios from 'axios';
import { useMutation } from 'node_modules/@tanstack/react-query/build/modern/useMutation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { shopCategories } from 'apps/admin-ui/src/utils/categories';
import { useRouter } from 'next/navigation';


const CreateShop = ({
    sellerId,
    setActiveStep,
}: {
    sellerId: string;
    setActiveStep: (step: number) => void;
}) => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
  const onCreateShopMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-shop`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      router.push('/success');
    },
  });
  const onSubmit = (data: any) => {
    const shopData = { ...data, sellerId };
    console.log('Submitting shop data:', shopData);
    onCreateShopMutation.mutate(shopData);
  };

  const wordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-2xl font-semibold text-center mb-4">
          Set Up Your Shop
        </h3>
        <label className="block mb-1 text-gray-700">Name*</label>
        <input
          type="text"
          placeholder="Enter your shop name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          {...register('name', {
            required: 'Name is required',
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
        )}
        <label className="block mb-1 text-gray-700">
          Shop Bio (Max 100 words)*
        </label>
        <input
          type="text"
          placeholder="Enter your shop bio"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          {...register('bio', {
            required: 'Bio is required',
            validate: (value) =>
              wordCount(value) <= 100 || 'Bio must be 100 words or less',
          })}
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{String(errors.bio.message)}</p>
        )}
        <label className="block mb-1 text-gray-700">Address*</label>
        <input
          type="text"
          placeholder="Enter your shop Address"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          {...register('address', {
            required: 'Address is required',
          })}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">
            {String(errors.address.message)}
          </p>
        )}
        <label className="block mb-1 text-gray-700">Open Hours*</label>
        <input
          type="text"
          placeholder="Mon-Fri 9am-5pm"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          {...register('opening_hours', {
            required: 'Open hours is required',
          })}
        />
        {errors.opening_hours && (
          <p className="text-red-500 text-sm">
            {String(errors.opening_hours.message)}
          </p>
        )}
        <label className="block mb-1 text-gray-700">Website</label>
        <input
          type="url"
          placeholder="https://www.example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          {...register('website', {
            pattern: {
              value:
                /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
              message: 'Invalid URL',
            },
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
        )}
        <label className="block mb-1 text-gray-700">Category *</label>
        <select
          className="w-full p2 border border-gray-300 outline-0 rounded-[4px] mb-1"
          {...register('category', {
            required: 'Category is required',
          })}
        >
          <option value="">Select a category</option>
          {shopCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.name && (
          <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
        )}
        <button
          type="submit"
          disabled={onCreateShopMutation.isPending}
          className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {onCreateShopMutation.isPending ? 'Creating shop...' : 'Create shop'}
        </button>
      </form>
    </div>
  );
};

export default CreateShop;
